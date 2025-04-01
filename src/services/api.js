import axios from 'axios';

// NOTE: There was an issue with client-instance-identifier being duplicated in headers
// causing a UUID syntax error: "373f92eb-26dc-4e76-bd10-9aa2cf75ad33, 373f92eb-26dc-4e76-bd10-9aa2cf75ad33"
// This has been fixed by:
// 1. Skipping Client-Instance-Identifier when adding tokens to headers
// 2. Adding client-instance-identifier separately
// 3. Checking for and fixing duplicate values in tokens and request headers

const API_BASE_URL = process.env.REACT_APP_API_BASE_URL || 'https://api.stage.outmarket.ai/v1';
const AGENT_API_URL = process.env.REACT_APP_AGENT_API_URL || 'http://localhost:9000';
// Supabase auth URL for token refresh
const AUTH_URL = process.env.REACT_APP_AUTH_URL || 'https://izspululkwbfxjuqpjbu.supabase.co/auth/v1';

class ApiService {
  constructor() {
    this.tokens = {};
    this.clientInstanceIdentifier = null;
    this.conversationIds = {}; // Store conversation IDs for different agent types
    this.tokenExpiration = null; // Store token expiration time
    this.isRefreshing = false; // Flag to prevent multiple refresh calls
    this.refreshSubscribers = []; // Store callbacks for requests waiting for token refresh
  }

  // Set authentication tokens
  setTokens(tokens) {
    this.tokens = tokens;

    // Extract client instance identifier if present
    if (tokens['Client-Instance-Identifier']) {
      // Check if it contains a comma which would indicate duplication
      const clientId = tokens['Client-Instance-Identifier'];
      if (clientId.includes(',')) {
        console.warn('Duplicate Client-Instance-Identifier detected in tokens, fixing...');
        // Fix the value by taking just the first UUID
        this.clientInstanceIdentifier = clientId.split(',')[0].trim();
        // Also update the token to avoid future issues
        this.tokens['Client-Instance-Identifier'] = this.clientInstanceIdentifier;
      } else {
        this.clientInstanceIdentifier = clientId;
      }
      console.log('Client instance identifier set to:', this.clientInstanceIdentifier.substring(0, 10) + '...');
    }
    
    // Store token expiration if available
    if (tokens.expires_at) {
      this.tokenExpiration = tokens.expires_at * 1000; // Convert to milliseconds
    } else if (tokens.expires_in) {
      this.tokenExpiration = Date.now() + tokens.expires_in * 1000;
    }
    
    // Store refresh token separately for clarity
    if (tokens.refresh_token) {
      this.refreshToken = tokens.refresh_token;
    }
    
    // Save tokens to local storage for persistence across sessions
    localStorage.setItem('om_tokens', JSON.stringify(tokens));
  }

  // Get tokens from local storage
  loadTokensFromStorage() {
    try {
      const storedTokens = localStorage.getItem('om_tokens');
      if (storedTokens) {
        const tokens = JSON.parse(storedTokens);
        this.setTokens(tokens);
        return true;
      }
    } catch (error) {
      console.error('Error loading tokens from storage:', error);
    }
    return false;
  }

  // Check if tokens are expired
  isTokenExpired() {
    if (!this.tokenExpiration) return true;
    // Return true if token expires in less than 60 seconds
    return this.tokenExpiration < Date.now() + 60000;
  }

  // Get authentication headers
  async getAuthHeaders() {
    // Check if tokens are expired and refresh if needed
    if (this.isTokenExpired() && this.refreshToken) {
      await this.refreshTokens();
    }
    
    const headers = {
      'Content-Type': 'application/json',
      'Accept': 'application/json',
      'Origin': 'https://api.stage.outmarket.ai',
    };

    // Add tokens if available
    Object.keys(this.tokens).forEach(key => {
      if (this.tokens[key] && typeof this.tokens[key] === 'string') {
        // Skip the Client-Instance-Identifier here, as we'll add it separately
        if (key !== 'Client-Instance-Identifier') {
          headers[key] = this.tokens[key];
        }
      }
    });

    // Add client instance identifier as a separate header if available
    if (this.clientInstanceIdentifier) {
      headers['client-instance-identifier'] = this.clientInstanceIdentifier;
    }

    return headers;
  }

  // Refresh tokens
  async refreshTokens() {
    // Prevent multiple refresh calls
    if (this.isRefreshing) {
      // Return a promise that resolves when the refresh is complete
      return new Promise((resolve) => {
        this.refreshSubscribers.push(resolve);
      });
    }

    this.isRefreshing = true;

    try {
      if (!this.refreshToken) {
        throw new Error('No refresh token available');
      }

      const response = await axios.post(`${AUTH_URL}/token?grant_type=refresh_token`, {
        refresh_token: this.refreshToken
      });

      if (response.status === 200 && response.data) {
        // Update tokens with the refreshed ones
        this.setTokens(response.data);
        
        // Notify waiting subscribers
        this.refreshSubscribers.forEach(callback => callback());
        this.refreshSubscribers = [];
        
        console.log('Token refreshed successfully');
        return true;
      } else {
        throw new Error('Token refresh failed');
      }
    } catch (error) {
      console.error('Error refreshing token:', error);
      // Clear tokens
      this.clearTokens();
      
      // Dispatch auth failure event for the auth context to handle
      window.dispatchEvent(new CustomEvent('auth_failure'));
      
      return false;
    } finally {
      this.isRefreshing = false;
    }
  }

  // Clear tokens
  clearTokens() {
    this.tokens = {};
    this.clientInstanceIdentifier = null;
    this.tokenExpiration = null;
    this.refreshToken = null;
    localStorage.removeItem('om_tokens');
  }

  // Get or set conversation ID for a specific agent
  getConversationId(agentId) {
    return this.conversationIds[agentId];
  }

  setConversationId(agentId, conversationId) {
    this.conversationIds[agentId] = conversationId;
    console.log(`Set conversation ID for ${agentId}: ${conversationId}`);
    // Store conversation IDs in local storage for persistence
    localStorage.setItem('om_conversation_ids', JSON.stringify(this.conversationIds));
  }

  // Load conversation IDs from storage
  loadConversationIdsFromStorage() {
    try {
      const storedIds = localStorage.getItem('om_conversation_ids');
      if (storedIds) {
        this.conversationIds = JSON.parse(storedIds);
        return true;
      }
    } catch (error) {
      console.error('Error loading conversation IDs from storage:', error);
    }
    return false;
  }

  // Check authentication status
  isAuthenticated() {
    return !!this.tokens['OM-Access-Token'] || !!this.tokens.access_token;
  }

  // Initialize the service
  init() {
    this.loadTokensFromStorage();
    this.loadConversationIdsFromStorage();
    return this.isAuthenticated();
  }

  // Login method
  async login(email, password) {
    const endpoint = `${API_BASE_URL}/user/login`;

    const headers = {
      'Content-Type': 'application/json',
      'Accept': 'application/json',
      'Origin': 'https://api.stage.outmarket.ai',
    };

    const data = {
      '_email': email,
      '_password': password
    };

    try {
      const response = await axios.post(endpoint, data, { headers });

      if (response.status === 200) {
        // Extract tokens from headers
        const tokenHeaders = [
          'OM-Access-Token',
          'OM-Refresh-Token',
          'Client-Access-Token',
          'Client-Refresh-Token',
          'Client-Instance-Identifier',
        ];

        // Store tokens
        const tokens = {};
        tokenHeaders.forEach(header => {
          if (response.headers[header.toLowerCase()]) {
            // Store the token value
            const tokenValue = response.headers[header.toLowerCase()];
            
            // For Client-Instance-Identifier, check for duplication
            if (header === 'Client-Instance-Identifier' && tokenValue.includes(',')) {
              console.warn('Duplicate Client-Instance-Identifier detected in response headers, fixing...');
              tokens[header] = tokenValue.split(',')[0].trim();
            } else {
              tokens[header] = tokenValue;
            }
          }
        });
        
        // Check if response includes body tokens (Supabase format)
        if (response.data && response.data.metadata && response.data.metadata.user) {
          // Convert Supabase tokens to our format if available
          if (response.data.tokens) {
            tokens.access_token = response.data.tokens.access_token;
            tokens.refresh_token = response.data.tokens.refresh_token;
            tokens.expires_in = response.data.tokens.expires_in;
            tokens.expires_at = response.data.tokens.expires_at;
          }
        }

        // Set tokens in the service
        this.setTokens(tokens);

        return {
          status: 'success',
          message: 'Login successful',
          tokens: tokens
        };
      } else {
        return {
          status: 'error',
          message: `Login failed: ${response.status} - ${response.data}`
        };
      }
    } catch (error) {
      console.error('Login error:', error);
      return {
        status: 'error',
        message: error.response?.data?.message || error.message || 'An error occurred during login'
      };
    }
  }

  // Logout method
  async logout() {
    this.clearTokens();
    this.conversationIds = {}; // Clear conversation IDs on logout
    localStorage.removeItem('om_conversation_ids');
    return {
      status: 'success',
      message: 'Logged out successfully'
    };
  }

  // Send a streaming request to the agent API with automatic retries and token refresh
  async sendAgentRequestStream(query, onData, agentId = 'om_assistant', retryCount = 0) {
    // Check if we have an existing conversation ID for this agent
    const conversationId = this.getConversationId(agentId);
    
    // Ensure authentication before proceeding
    if (!this.isAuthenticated() && !await this.init()) {
      onData({ 
        status: 'error', 
        message: 'Not authenticated. Please log in.',
        event_type: 'error' 
      });
      // Redirect to login page
      window.location.href = '/';
      return { status: 'error', message: 'Not authenticated' };
    }
    
    // Determine the appropriate endpoint based on whether this is a new or continuing conversation
    const endpoint = conversationId 
      ? `${AGENT_API_URL}/api/v1/carrier_explorer/conversations/${conversationId}/chat/stream` 
      : `${AGENT_API_URL}/api/v1/carrier_explorer/tools/apply/stream`;
    
    console.log(`Using agent: ${agentId} for query: ${query.substring(0, 50)}${query.length > 50 ? '...' : ''}`);
    console.log(conversationId 
      ? `Continuing conversation: ${conversationId}` 
      : 'Starting new conversation');

    try {
      // Get fresh headers with potentially refreshed tokens
      const headers = await this.getAuthHeaders();
      
      // Add streaming header
      headers['Accept'] = 'text/event-stream';

      // Create the appropriate payload
      const payload = conversationId 
        ? { query } // Continuing conversation format
        : { 
            tool_id: agentId, 
            input_args: { query } 
          }; // First query format

      // Using fetch for SSE instead of axios
      const response = await fetch(endpoint, {
        method: 'POST',
        headers,
        body: JSON.stringify(payload)
      });

      // Log headers for debugging - make sure to hide sensitive parts
      const debugHeaders = { ...headers };
      if (debugHeaders['client-instance-identifier']) {
        const clientId = debugHeaders['client-instance-identifier'];
        // Check if it contains a comma which would indicate duplication
        if (clientId.includes(',')) {
          console.warn('Duplicate client-instance-identifier detected:', 
                      clientId.substring(0, 10) + '...');
          // Fix the value by taking just the first UUID
          headers['client-instance-identifier'] = clientId.split(',')[0].trim();
          console.log('Fixed client-instance-identifier:', 
                     headers['client-instance-identifier'].substring(0, 10) + '...');
        } else {
          debugHeaders['client-instance-identifier'] = clientId.substring(0, 10) + '...';
        }
      }
      // Log sanitized headers for debugging
      console.log('Request headers:', debugHeaders);

      // Handle authentication errors with refresh and retry
      if (response.status === 401 || response.status === 403) {
        if (retryCount < 3) {
          console.log('Authentication error, attempting to refresh token and retry...');
          // Force token refresh
          await this.refreshTokens();
          // Retry the request
          return this.sendAgentRequestStream(query, onData, agentId, retryCount + 1);
        } else {
          throw new Error(`Authentication failed after ${retryCount} retries`);
        }
      }

      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(`Server error: ${response.status} - ${errorText}`);
      }

      // Create an EventSource-like reader for the response
      const reader = response.body.getReader();
      const decoder = new TextDecoder('utf-8');
      let buffer = '';
      let finalResult = null;

      while (true) {
        const { done, value } = await reader.read();
        
        if (done) {
          // Process any remaining data in buffer
          if (buffer.trim()) {
            try {
              const eventData = this._parseEventData(buffer);
              if (eventData) {
                // Process the event data if it's a tool call
                const processedData = this._processEventData(eventData);
                
                // Check if this is the completion message
                if (processedData.status === 'completed' && processedData.data) {
                  finalResult = this._extractResultData(processedData);
                  
                  // Check for and store conversation_id if this is the first query
                  if (!conversationId && finalResult && finalResult.conversation_id) {
                    this.setConversationId(agentId, finalResult.conversation_id);
                    console.log(`New conversation created with ID: ${finalResult.conversation_id}`);
                  }
                }
                onData(processedData);
              }
            } catch (e) {
              console.error('Error parsing final buffer:', e, 'Buffer:', buffer);
            }
          }
          
          // Send final completion message
          console.log("Stream completed, sending final result:", finalResult);
          onData({ 
            status: 'completed', 
            data: finalResult || { result: 'Operation completed successfully.' },
            event_type: 'completion'
          });
          
          break;
        }
        
        // Append decoded chunk to buffer
        buffer += decoder.decode(value, { stream: true });
        
        // Process complete events in buffer
        const events = buffer.split('\n\n');
        buffer = events.pop() || ''; // Keep the last incomplete event in buffer
        
        for (const event of events) {
          if (event.trim() === '') continue;
          
          try {
            const eventData = this._parseEventData(event);
            if (eventData) {
              // Process the event data for tool calls and other events
              const processedData = this._processEventData(eventData);
              
              // Check if this contains completion data with conversation_id
              if (processedData.status === 'completed' && processedData.data) {
                finalResult = this._extractResultData(processedData);
                
                // Check for and store conversation_id if this is the first query
                if (!conversationId && finalResult && finalResult.conversation_id) {
                  this.setConversationId(agentId, finalResult.conversation_id);
                  console.log(`New conversation created with ID: ${finalResult.conversation_id}`);
                }
              }
              onData(processedData);
            }
          } catch (e) {
            console.error('Error processing event:', e, 'Event:', event);
          }
        }
      }
      
      return { status: 'success', message: 'Stream processing completed' };
    } catch (error) {
      console.error('Stream error:', error);
      
      // Check if this is an authentication error
      if (error.message.includes('401') || error.message.includes('403') || 
          error.message.includes('authentication failed')) {
        // Try to refresh tokens and notify user
        onData({ 
          status: 'error', 
          message: 'Authentication error. Attempting to refresh session...',
          event_type: 'error' 
        });
        
        // Attempt to refresh token
        const refreshed = await this.refreshTokens();
        if (refreshed && retryCount < 3) {
          // If we successfully refreshed, retry the request
          onData({ 
            status: 'info', 
            message: 'Session refreshed. Retrying request...',
            event_type: 'info' 
          });
          return this.sendAgentRequestStream(query, onData, agentId, retryCount + 1);
        } else {
          onData({ 
            status: 'error', 
            message: 'Authentication failed. Please log in again.',
            event_type: 'error' 
          });
          // Dispatch auth failure event for the auth context to handle
          window.dispatchEvent(new CustomEvent('auth_failure'));
        }
      } else {
        // Handle other errors
        onData({ 
          status: 'error', 
          message: error.message,
          event_type: 'error' 
        });
      }
      
      return { status: 'error', message: error.message };
    }
  }
  
  // Helper method to parse SSE event data
  _parseEventData(event) {
    if (!event || event.trim() === '') return null;
    
    const lines = event.split('\n');
    const eventData = {};
    
    for (const line of lines) {
      if (line.startsWith('data:')) {
        try {
          eventData.data = JSON.parse(line.substring(5).trim());
        } catch (e) {
          eventData.data = line.substring(5).trim();
        }
      } else if (line.startsWith('event:')) {
        eventData.event = line.substring(6).trim();
      } else if (line.startsWith('id:')) {
        eventData.id = line.substring(3).trim();
      }
    }
    
    // Add event_type for backward compatibility
    if (eventData.event && !eventData.event_type) {
      eventData.event_type = eventData.event;
    }
    
    // If we have a status but no event_type, infer it
    if (eventData.data?.status === 'tool_call' && !eventData.event_type) {
      eventData.event_type = 'agent_thinks';
    }
    
    // If we have tool data, mark it as a tool call
    if (eventData.data?.tool && !eventData.data.status) {
      if (!eventData.event_type) eventData.event_type = 'agent_thinks';
      if (!eventData.data.status) eventData.data.status = 'tool_call';
    }
    
    // If we have an ai_message, mark it for easier handling
    if (eventData.data?.ai_message && !eventData.event_type) {
      eventData.event_type = 'agent_message';
    }
    
    // If we have an event type but no status, use the event type as status
    if (eventData.event && !eventData.data?.status) {
      eventData.status = eventData.event;
    }
    
    return eventData.data || eventData;
  }
  
  // Helper method to extract result data from completion events
  _extractResultData(eventData) {
    // Handle different structures of completion data
    if (!eventData || !eventData.data) return null;
    
    let result = null;
    
    if (typeof eventData.data === 'object') {
      // If there's a result field, use that
      if (eventData.data.result !== undefined) {
        result = { ...eventData.data };
      } else {
        // Otherwise return the entire data object
        result = { ...eventData.data };
      }
      
      // If content field exists, make sure we preserve it
      if (eventData.data.content) {
        result.content = eventData.data.content;
        // If no result field but content exists, use content as result
        if (result.result === undefined) {
          result.result = eventData.data.content;
        }
      }
    } else if (typeof eventData.data === 'string') {
      // Try to parse as JSON first
      try {
        result = JSON.parse(eventData.data);
        // Check if parsed result has content field
        if (result.content && result.result === undefined) {
          result.result = result.content;
        }
      } catch (e) {
        // If not JSON, wrap in a result object
        result = { 
          result: eventData.data,
          content: eventData.data // Also set content field for consistency
        };
      }
    }
    
    // If no result was extracted, use fallback
    if (!result) {
      result = { result: 'Operation completed successfully.' };
    }
    
    // Ensure conversation_id is present in the result if it exists in the original data
    if (eventData.data.conversation_id && !result.conversation_id) {
      result.conversation_id = eventData.data.conversation_id;
    }
    
    return result;
  }

  // Helper method to process event data for consistent format
  _processEventData(eventData) {
    // Make a copy to avoid modifying the original
    const data = { ...eventData };
    
    // If this is a tool call, ensure the format is consistent
    if (data.event_type === 'agent_thinks' || data.status === 'tool_call') {
      // Make sure we have a data object with tool and ai_message
      if (!data.data) data.data = {};
      
      // If we have direct tool info, move it to the standard format
      if (data.tool && !data.data.tool) {
        data.data.tool = data.tool;
        delete data.tool;
      }
      
      // If we have direct ai_message, move it to the standard format
      if (data.ai_message && !data.data.ai_message) {
        data.data.ai_message = data.ai_message;
        delete data.ai_message;
      }
      
      // Ensure status is set for tool calls
      if (!data.status) data.status = 'tool_call';
      if (!data.event_type) data.event_type = 'agent_thinks';
    }
    
    return data;
  }
}

// Create a singleton instance
const apiService = new ApiService();

// Initialize the service
apiService.init();

// Make apiService available globally for access from other components
window.apiService = apiService;

export default apiService; 