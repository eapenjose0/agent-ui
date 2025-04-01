import React, { useState, useEffect, useRef } from 'react';
import { 
  Box, 
  TextField, 
  Typography, 
  CircularProgress, 
  IconButton,
  Tooltip,
} from '@mui/material';
import { Send, Refresh, AddCircleOutline } from '@mui/icons-material';
import ChatMessage from './ChatMessage';
import { useChat } from '../contexts/ChatContext';
import apiService from '../services/api';

const Chat = ({ selectedAgent }) => {
  const [message, setMessage] = useState('');
  const [sending, setSending] = useState(false);
  const messagesEndRef = useRef(null);
  
  const { 
    chatHistory, 
    isStreaming, 
    setIsStreaming, 
    currentResponse, 
    setCurrentResponse,
    addUserMessage,
    addAssistantMessage,
    updateLatestAssistantMessage,
    setChatHistory,
  } = useChat();
  
  // Scroll to bottom of messages
  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };
  
  useEffect(() => {
    scrollToBottom();
  }, [chatHistory]);
  
  // Get agent display name
  const getAgentDisplayName = () => {
    return selectedAgent === 'om_assistant' ? 'Assistant' : 'Appetite Agent';
  };
  
  // Clear chat and start a new conversation
  const clearChat = () => {
    // Clear the chat history
    setChatHistory([]);
    // Reset conversation ID for the current agent
    apiService.setConversationId(selectedAgent, null);
    console.log('Starting new conversation with', getAgentDisplayName());
  };
  
  // Process streaming data
  const processStreamedData = (data) => {
    console.log("Processing streamed data:", data);
    
    // Check if this is a completion message
    if (data.status === 'completed') {
      console.log("Completion detected, data:", data);
      
      let result = null;
      
      // Try to extract result from data
      if (data.data) {
        if (typeof data.data === 'object') {
          // Check if there's a content field - prioritize this for response display
          if (data.data.content) {
            result = data.data.content;
            console.log("Using content field for response:", result);
          } 
          // Check if there's a result field
          else if (data.data.result) {
            result = data.data.result;
          } else {
            // If no specific result field, use the whole data object
            result = data.data;
          }
        } else if (typeof data.data === 'string') {
          // If data is a string, use it directly
          result = data.data;
        } else {
          // If data is something else, convert to string
          try {
            result = JSON.stringify(data.data);
          } catch (e) {
            result = "Operation completed successfully.";
          }
        }
      } else if (data.result) {
        // Sometimes the result might be directly in the top-level object
        result = data.result;
      } else if (data.content) {
        // Sometimes the content might be directly in the top-level object
        result = data.content;
      }
      
      // Process the result
      if (result) {
        console.log("Completion result:", result);
        // Update the messages with the completion
        setCurrentResponse(result);
        updateLatestAssistantMessage(result);
      } else {
        console.log("No result found in completion data");
      }
      
      setIsStreaming(false);
      return;
    }
    
    // Handle tool calls
    if (data.status === 'tool_call' || data.event_type === 'agent_thinks') {
      const toolData = data.data || {};
      const toolInfo = toolData.tool || {};
      const aiMessage = toolData.ai_message || {};
      
      const toolName = toolInfo.name || '';
      const toolInput = toolInfo.input || {};
      const aiContent = aiMessage.content || '';
      
      // Format the response for display
      const response = `
### 🤔 Thinking...
${aiContent}

### 🛠️ Using tool: \`${toolName}\`
\`\`\`json
${JSON.stringify(toolInput, null, 2)}
\`\`\`
`;
      
      setCurrentResponse(response);
      updateLatestAssistantMessage(response);
      return;
    }
    
    // Handle regular agent message updates
    if (data.event_type === 'agent_message' && data.data) {
      const messageContent = data.data.content || data.data;
      setCurrentResponse(messageContent);
      updateLatestAssistantMessage(messageContent);
      return;
    }
    
    // For other statuses
    if (data.status) {
      const statusMsg = data.detail
        ? `⚙️ Status: ${data.status} - ${data.detail}`
        : `⚙️ Status: ${data.status}`;
        
      setCurrentResponse(statusMsg);
      updateLatestAssistantMessage(statusMsg);
    }
  };
  
  // Send a message to the API
  const sendMessage = (e) => {
    e?.preventDefault();
    
    if (!message.trim() || sending) return;
    
    // Set UI state
    setSending(true);
    setIsStreaming(true);
    
    // Add user message to chat
    addUserMessage(message);
    
    // Add initial AI response with agent info
    const initialResponse = `⏳ Processing your request with ${getAgentDisplayName()}... Please wait.`;
    addAssistantMessage(initialResponse);
    setCurrentResponse(initialResponse);
    
    try {
      console.log(`Sending message to ${selectedAgent} with current message: ${message.substring(0, 50)}...`);
      // Send request via API service with the selected agent/tool ID
      apiService.sendAgentRequestStream(
        message,
        processStreamedData,
        selectedAgent
      );
    } catch (error) {
      console.error('Error sending message:', error);
      updateLatestAssistantMessage(`❌ Error: ${error.message}`);
      setIsStreaming(false);
    } finally {
      // Clear message input and reset sending state
      setMessage('');
      setSending(false);
    }
  };
  
  // Handle refresh button click
  const handleRefresh = () => {
    if (currentResponse && isStreaming) {
      updateLatestAssistantMessage(currentResponse);
    }
  };
  
  return (
    <Box sx={{ 
      height: '100%', 
      display: 'flex', 
      flexDirection: 'column',
      position: 'relative',
      backgroundColor: 'white',
      borderRadius: '8px',
      width: '100%',
      p: 0,
      color: '#333333',
    }}>
      {/* Chat messages area with Mac-inspired styling */}
      <Box
        sx={{
          flex: 1,
          display: 'flex',
          flexDirection: 'column',
          position: 'relative',
          px: 3,
          pt: 2,
          overflowX: 'hidden',
          minHeight: 0,
        }}
      >
        <Box 
          sx={{ 
            flex: 1,
            display: 'flex',
            flexDirection: 'column',
            height: '100%',
            overflowY: 'auto',
            position: 'relative',
            zIndex: 1,
            pb: 2,
            // Subtle Mac-style scrollbar
            '&::-webkit-scrollbar': {
              width: '8px',
            },
            '&::-webkit-scrollbar-track': {
              background: 'transparent',
            },
            '&::-webkit-scrollbar-thumb': {
              background: 'rgba(0, 0, 0, 0.1)',
              borderRadius: '4px',
              border: '2px solid transparent',
              backgroundClip: 'padding-box',
            },
            '&::-webkit-scrollbar-thumb:hover': {
              background: 'rgba(0, 0, 0, 0.2)',
              borderRadius: '4px',
              border: '2px solid transparent',
              backgroundClip: 'padding-box',
            },
          }}
        >
          {chatHistory.length === 0 ? (
            <Box sx={{ 
              display: 'flex', 
              flexDirection: 'column',
              alignItems: 'center', 
              justifyContent: 'center',
              height: '100%',
              color: '#999999'
            }}>
              <Typography variant="h6" gutterBottom sx={{ color: '#666666', fontWeight: 500 }}>
                Start a conversation
              </Typography>
              <Typography variant="body2" sx={{ color: '#999999' }}>
                Type a message below to begin chatting with {getAgentDisplayName()}
              </Typography>
            </Box>
          ) : (
            <Box sx={{ 
              display: 'flex', 
              flexDirection: 'column',
              gap: 2,
              position: 'relative',
              zIndex: 2,
            }}>
              {chatHistory.map((msg, index) => (
                <Box 
                  key={index}
                  sx={{ 
                    position: 'relative',
                    zIndex: index + 3,
                    '&:hover': {
                      background: 'rgba(0, 0, 0, 0.01)',
                      borderRadius: '12px',
                    }
                  }}
                >
                  <ChatMessage message={msg} agentType={selectedAgent} />
                </Box>
              ))}
              <div ref={messagesEndRef} style={{ height: '1px', width: '100%' }} />
            </Box>
          )}
        </Box>
      </Box>
      
      {/* Streaming status indicator - Mac style subtle indicator */}
      {isStreaming && (
        <Box 
          sx={{ 
            mx: 3,
            mb: 1, 
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            py: 0.75,
            borderRadius: '6px',
            bgcolor: 'rgba(0, 0, 0, 0.03)',
            color: selectedAgent === 'om_assistant' ? '#FF5722' : '#10B981',
            position: 'relative',
            zIndex: 10,
          }}
        >
          <Typography variant="caption" component="span" sx={{ fontWeight: 500, fontSize: '0.8rem' }}>
            {getAgentDisplayName()} is responding...
          </Typography>
          <CircularProgress size={12} sx={{ ml: 1 }} color={selectedAgent === 'om_assistant' ? 'primary' : 'secondary'} />
        </Box>
      )}
      
      {/* Fixed message input at the bottom - Mac style */}
      <Box
        sx={{
          px: 3,
          py: 2,
          borderTop: '1px solid rgba(0, 0, 0, 0.06)',
          bgcolor: 'white',
          zIndex: 100,
          position: 'relative',
          width: '100%',
          marginTop: 'auto',
        }}
      >
        <form 
          onSubmit={(e) => { e.preventDefault(); sendMessage(e); }}
          style={{ position: 'relative' }}
        >
          <Box 
            sx={{ 
              display: 'flex', 
              gap: 1,
              position: 'relative',
              alignItems: 'center',
            }}
          >
            <Box 
              sx={{ 
                display: 'flex',
                flexGrow: 1,
                position: 'relative',
                borderRadius: '18px',
                bgcolor: 'rgba(0, 0, 0, 0.03)',
                transition: 'all 0.2s ease',
                overflow: 'hidden',
                '&:hover': {
                  bgcolor: 'rgba(0, 0, 0, 0.04)',
                },
                '&:focus-within': {
                  bgcolor: 'rgba(0, 0, 0, 0.04)',
                  boxShadow: selectedAgent === 'om_assistant' 
                    ? '0 0 0 2px rgba(255, 87, 34, 0.1)' 
                    : '0 0 0 2px rgba(16, 185, 129, 0.1)',
                }
              }}
            >
              <TextField
                fullWidth
                variant="standard"
                placeholder="Message..."
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                disabled={isStreaming}
                sx={{
                  '& .MuiInputBase-root': {
                    height: '40px',
                    fontFamily: '-apple-system, BlinkMacSystemFont, "SF Pro Text", "Segoe UI", Roboto, sans-serif',
                    fontSize: '0.9rem',
                    fontWeight: 400,
                    color: '#333333',
                    padding: '0 16px 0 16px',
                    transition: 'all 0.2s',
                    '&::before, &::after': {
                      display: 'none',
                    },
                    '&:hover': {
                      backgroundColor: 'transparent',
                    },
                    '&.Mui-disabled': {
                      backgroundColor: 'transparent',
                      color: '#999999',
                    },
                  },
                  '& .MuiInputBase-input': {
                    '&::placeholder': {
                      color: '#999999',
                      opacity: 1,
                      fontSize: '0.9rem',
                      fontWeight: 400,
                    },
                  },
                }}
                InputProps={{
                  disableUnderline: true,
                }}
              />
              
              <Tooltip title={isStreaming ? "Please wait" : "Send message"}>
                <span style={{ 
                  display: 'flex', 
                  alignItems: 'center',
                  padding: '8px 12px 8px 0',
                }}>
                  <IconButton 
                    type="submit"
                    disabled={!message.trim() || isStreaming}
                    sx={{ 
                      bgcolor: message.trim() && !isStreaming 
                        ? (selectedAgent === 'om_assistant' ? '#FF5722' : '#10B981')
                        : 'transparent',
                      color: message.trim() && !isStreaming 
                        ? 'white'
                        : '#b0b0b0',
                      height: 28,
                      width: 28,
                      borderRadius: '50%',
                      transition: 'all 0.2s',
                      '&:hover': {
                        bgcolor: message.trim() && !isStreaming 
                          ? (selectedAgent === 'om_assistant' ? '#E64A19' : '#059669')
                          : 'rgba(0, 0, 0, 0.04)',
                      },
                      '&.Mui-disabled': {
                        bgcolor: 'transparent',
                      }
                    }}
                  >
                    <Send sx={{ fontSize: '0.9rem' }} />
                  </IconButton>
                </span>
              </Tooltip>
            </Box>
            
            <IconButton 
              onClick={handleRefresh}
              disabled={!isStreaming}
              sx={{
                height: 28,
                width: 28,
                borderRadius: '50%',
                color: isStreaming 
                  ? (selectedAgent === 'om_assistant' ? '#FF5722' : '#10B981')
                  : '#d0d0d0',
                transition: 'all 0.2s',
                '&.Mui-disabled': {
                  color: '#e0e0e0',
                },
                '&:hover': {
                  backgroundColor: isStreaming ? 'rgba(255, 87, 34, 0.04)' : 'rgba(0, 0, 0, 0.04)'
                }
              }}
            >
              <Refresh sx={{ fontSize: '0.9rem' }} />
            </IconButton>
          </Box>
        </form>
      </Box>
    </Box>
  );
};

export default Chat; 