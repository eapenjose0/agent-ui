import React, { useState, useRef, useEffect } from 'react';
import { 
  Box, 
  Container, 
  Grid, 
  Typography, 
  Tab, 
  Tabs, 
  Paper, 
  Accordion, 
  AccordionSummary, 
  AccordionDetails,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  Divider,
  ToggleButtonGroup,
  ToggleButton,
  Chip,
  IconButton
} from '@mui/material';
import { 
  ExpandMore, 
  Psychology, 
  Science, 
  Search, 
  Description, 
  Code, 
  BarChart,
  AddCircleOutline,
  Lock
} from '@mui/icons-material';
import Chat from '../components/Chat';
import Settings from '../components/Settings';
import { ChatProvider, useChat } from '../contexts/ChatContext';
import Header from '../components/Header';
import Footer from '../components/Footer';

// Create a child component that has access to the ChatContext
const ChatTab = ({ selectedAgent, tabIndex }) => {
  const { clearChat, setChatHistory } = useChat();
  const prevAgentRef = useRef(selectedAgent);
  
  // Reset chat history when agent changes
  useEffect(() => {
    if (prevAgentRef.current !== selectedAgent) {
      // Agent has changed, clear the chat
      setChatHistory([]);
      console.log(`Agent changed from ${prevAgentRef.current} to ${selectedAgent}, clearing chat history`);
      prevAgentRef.current = selectedAgent;
    }
  }, [selectedAgent, setChatHistory]);
  
  // This component will only be rendered when the Chat tab is active
  return (
    <Box 
      hidden={tabIndex !== 0} 
      sx={{ 
        flexGrow: 1, 
        position: 'relative',
        zIndex: 1,
        width: '100%',
        height: '100%',
        overflow: 'hidden',
        display: 'flex',
      }}
    >
      {tabIndex === 0 && <Chat selectedAgent={selectedAgent} key={selectedAgent} />}
    </Box>
  );
};

const Dashboard = () => {
  const [tabIndex, setTabIndex] = useState(0);
  const [selectedAgent, setSelectedAgent] = useState('market_agent');
  const chatProviderRef = useRef(null);
  const previousAgentRef = useRef(selectedAgent);
  
  const handleTabChange = (event, newValue) => {
    setTabIndex(newValue);
  };
  
  const handleAgentChange = (event, newAgent) => {
    if (newAgent !== null) {
      // Store the current agent before changing
      previousAgentRef.current = selectedAgent;
      setSelectedAgent(newAgent);
      
      // Clear chat when changing agents
      clearChat();
    }
  };
  
  // Handle agent selection from the list
  const selectAgent = (agentId) => {
    if (agentId !== selectedAgent) {
      // Store the current agent before changing
      previousAgentRef.current = selectedAgent;
      setSelectedAgent(agentId);
      
      // Clear chat when changing agents
      clearChat();
    }
  };
  
  // Handle new chat button click
  const handleNewChat = () => {
    // Reset conversation ID for the current agent
    if (window.apiService) {
      window.apiService.setConversationId(selectedAgent, null);
    }
    
    // Set active tab to chat if not already there
    if (tabIndex !== 0) {
      setTabIndex(0);
    }
    
    // The actual chat clearing is handled in the ChatProvider's clearChat method
    // We'll use a custom event to communicate with the ChatProvider
    document.dispatchEvent(new CustomEvent('clearChat'));
  };
  
  // Clear chat and start a new conversation
  const clearChat = () => {
    // Reset conversation ID for the current agent
    if (window.apiService) {
      window.apiService.setConversationId(selectedAgent, null);
    }
    
    // The actual chat clearing is handled in the ChatProvider's clearChat method
    document.dispatchEvent(new CustomEvent('clearChat'));
    console.log('Cleared chat and started new conversation with', getAgentDisplayName());
  };
  
  // Get agent display name
  const getAgentDisplayName = () => {
    if (selectedAgent === 'market_agent') {
      return 'Market Agent';
    } else if (selectedAgent === 'vault_agent') {
      return 'Vault Agent';
    }
    return 'Agent'; // Default fallback
  };
  
  return (
    <Box sx={{ 
      display: 'flex', 
      flexDirection: 'column', 
      minHeight: '100vh',
      backgroundColor: '#f7f8fa', // Very light background
    }}>
      <Header />
      
      <Container maxWidth="lg" sx={{ mt: 4, mb: 4, flexGrow: 1 }}>
        <Grid container spacing={3}>
          <Grid item xs={12} md={4}>
            {/* Sidebar with settings */}
            <Paper sx={{ 
              p: 3, 
              display: 'flex', 
              flexDirection: 'column',
              borderRadius: '12px',
              boxShadow: '0 1px 3px rgba(0, 0, 0, 0.05)',
              border: '1px solid #f0f0f0',
              bgcolor: 'white',
            }}>
              <Typography variant="h6" gutterBottom sx={{ fontWeight: 600, color: '#333333', fontSize: '1.1rem' }}>
                Agent Tools
              </Typography>
              
              <Accordion 
                defaultExpanded
                expanded={true}
                disableGutters
                elevation={0}
                sx={{ 
                  mb: 2,
                  '&.MuiAccordion-root:before': {
                    display: 'none', // Remove default divider
                  },
                  '& .MuiAccordionSummary-root': {
                    minHeight: '48px',
                    '&.Mui-expanded': {
                      minHeight: '48px',
                    }
                  },
                  '& .MuiAccordionSummary-content': {
                    margin: '8px 0',
                    '&.Mui-expanded': {
                      margin: '8px 0',
                    }
                  }
                }}
              >
                <AccordionSummary 
                  sx={{
                    backgroundColor: '#fafafa',
                    borderRadius: '8px',
                    pointerEvents: 'none', // Disable clicking
                  }}
                >
                  <Typography sx={{ fontSize: '0.95rem', fontWeight: 600, color: '#555555' }}>
                    Available Agents
                  </Typography>
                </AccordionSummary>
                <AccordionDetails sx={{ pt: 1 }}>
                  <List dense sx={{ width: '100%', py: 0 }}>
                    <ListItem 
                      alignItems="flex-start" 
                      sx={{ 
                        px: 1, 
                        py: 1, 
                        borderRadius: '8px',
                        '&:hover': { 
                          backgroundColor: selectedAgent === 'market_agent' ? 'rgba(16, 185, 129, 0.04)' : 'rgba(0, 0, 0, 0.02)' 
                        },
                        backgroundColor: selectedAgent === 'market_agent' ? 'rgba(16, 185, 129, 0.08)' : 'transparent',
                        transition: 'background-color 0.2s ease',
                        position: 'relative',
                        borderLeft: selectedAgent === 'market_agent' ? '3px solid #10B981' : 'none',
                        cursor: 'pointer'
                      }}
                      onClick={() => selectAgent('market_agent')}
                    >
                      <ListItemIcon>
                        <Science color="secondary" fontSize="small" sx={{ fontSize: '1.3rem' }} />
                      </ListItemIcon>
                      <ListItemText
                        primary={
                          <Box sx={{ display: 'flex', alignItems: 'center' }}>
                            <Typography sx={{ fontSize: '0.95rem', fontWeight: 600 }}>
                              Market Agent
                            </Typography>
                            {selectedAgent === 'market_agent' && (
                              <Chip 
                                label="Active" 
                                size="small"
                                sx={{
                                  ml: 1,
                                  height: '18px',
                                  fontSize: '0.65rem',
                                  backgroundColor: '#10B981',
                                  color: 'white',
                                  fontWeight: 500,
                                }}
                              />
                            )}
                          </Box>
                        }
                        secondary={
                          <Typography sx={{ fontSize: '0.85rem', color: '#666666', mt: 0.5 }}>
                            Specialized agent for market research and analysis.
                          </Typography>
                        }
                      />
                    </ListItem>
                    <Divider variant="inset" component="li" sx={{ my: 1.5 }} />
                    <ListItem 
                      alignItems="flex-start" 
                      sx={{ 
                        px: 1, 
                        py: 1, 
                        borderRadius: '8px',
                        '&:hover': { 
                          backgroundColor: selectedAgent === 'vault_agent' ? 'rgba(106, 27, 154, 0.04)' : 'rgba(0, 0, 0, 0.02)' 
                        },
                        backgroundColor: selectedAgent === 'vault_agent' ? 'rgba(106, 27, 154, 0.08)' : 'transparent',
                        transition: 'background-color 0.2s ease',
                        position: 'relative',
                        borderLeft: selectedAgent === 'vault_agent' ? '3px solid #6A1B9A' : 'none',
                        cursor: 'pointer'
                      }}
                      onClick={() => selectAgent('vault_agent')}
                    >
                      <ListItemIcon>
                        <Lock sx={{ color: '#6A1B9A', fontSize: '1.3rem' }} />
                      </ListItemIcon>
                      <ListItemText
                        primary={
                          <Box sx={{ display: 'flex', alignItems: 'center' }}>
                            <Typography sx={{ fontSize: '0.95rem', fontWeight: 600 }}>
                              Vault Agent
                            </Typography>
                            {selectedAgent === 'vault_agent' && (
                              <Chip 
                                label="Active" 
                                size="small"
                                sx={{
                                  ml: 1,
                                  height: '18px',
                                  fontSize: '0.65rem',
                                  backgroundColor: '#6A1B9A',
                                  color: 'white',
                                  fontWeight: 500,
                                }}
                              />
                            )}
                          </Box>
                        }
                        secondary={
                          <Typography sx={{ fontSize: '0.85rem', color: '#666666', mt: 0.5 }}>
                            Specialized agent for document analysis and Q&A assistant.
                          </Typography>
                        }
                      />
                    </ListItem>
                  </List>
                </AccordionDetails>
              </Accordion>
              
              <Accordion>
                <AccordionSummary expandIcon={<ExpandMore />}>
                  <Typography>Settings</Typography>
                </AccordionSummary>
                <AccordionDetails>
                  <Settings />
                </AccordionDetails>
              </Accordion>
              
              <Accordion>
                <AccordionSummary expandIcon={<ExpandMore />}>
                  <Typography>Help</Typography>
                </AccordionSummary>
                <AccordionDetails>
                  <Typography variant="body2">
                    <strong>How to use Agents</strong>
                    <ul>
                      <li>Select your preferred agent at the top of the chat</li>
                      <li>Start a conversation by typing in the chat box</li>
                      <li>Configure your agent using the settings panel</li>
                      <li>Enable tools that the agent can use to assist you</li>
                      <li>Use the refresh button if you don't see updates</li>
                    </ul>
                    For additional help, contact support@outmarket.ai
                  </Typography>
                </AccordionDetails>
              </Accordion>
              
              <Accordion>
                <AccordionSummary expandIcon={<ExpandMore />}>
                  <Typography>Agent Capabilities</Typography>
                </AccordionSummary>
                <AccordionDetails>
                  <List dense>
                    <ListItem>
                      <ListItemIcon><Search fontSize="small" /></ListItemIcon>
                      <ListItemText primary="Web Search" secondary="Search the web for information" />
                    </ListItem>
                    <ListItem>
                      <ListItemIcon><Description fontSize="small" /></ListItemIcon>
                      <ListItemText primary="Document Analysis" secondary="Analyze PDFs and documents" />
                    </ListItem>
                    <ListItem>
                      <ListItemIcon><Code fontSize="small" /></ListItemIcon>
                      <ListItemText primary="Code Generation" secondary="Create and explain code" />
                    </ListItem>
                    <ListItem>
                      <ListItemIcon><BarChart fontSize="small" /></ListItemIcon>
                      <ListItemText primary="Data Visualization" secondary="Create charts and graphs" />
                    </ListItem>
                  </List>
                </AccordionDetails>
              </Accordion>
            </Paper>
          </Grid>
          
          <Grid item xs={12} md={8}>
            {/* Main content area with tabs */}
            <Paper 
              sx={{ 
                p: 0, 
                display: 'flex', 
                flexDirection: 'column', 
                height: 'calc(100vh - 120px)', // Fixed height calculation
                position: 'relative',
                zIndex: 0,
                borderRadius: '12px',
                boxShadow: '0 1px 3px rgba(0, 0, 0, 0.05)',
                border: '1px solid #f0f0f0',
                bgcolor: 'white',
                color: '#333333',
                overflow: 'hidden', // Prevent content overflow
              }}
            >
              <Tabs 
                value={tabIndex} 
                onChange={handleTabChange} 
                sx={{ 
                  borderBottom: 1, 
                  borderColor: '#f0f0f0',
                  position: 'relative',
                  zIndex: 5,
                  px: 3,
                  pt: 2,
                  pb: 1,
                  minHeight: '48px',
                  '& .MuiTab-root': {
                    fontSize: '0.9rem',
                    fontWeight: 600,
                    minHeight: '48px',
                    color: '#666666',
                    '&.Mui-selected': {
                      color: '#FF5722',
                    },
                  },
                  display: 'flex',
                  justifyContent: 'space-between',
                }}
              >
                <Box sx={{ display: 'flex', alignItems: 'center' }}>
                  <Tab label="Chat" />
                  <Tab label="History" />
                  {tabIndex === 0 && (
                    <Chip 
                      label={`Using: ${getAgentDisplayName()}`} 
                      size="small"
                      sx={{
                        ml: 2,
                        backgroundColor: selectedAgent === 'market_agent' ? '#f0fcf9' : '#f8f5ff',
                        color: selectedAgent === 'market_agent' ? '#10B981' : '#6A1B9A',
                        fontWeight: 500,
                        fontSize: '0.75rem',
                        border: `1px solid ${selectedAgent === 'market_agent' ? '#e6f7f3' : '#e6d8f5'}`,
                        height: '24px'
                      }}
                    />
                  )}
                </Box>
                
                {/* New Chat button - Mac style */}
                <Box sx={{ display: 'flex', alignItems: 'center' }}>
                  <IconButton 
                    onClick={handleNewChat}
                    size="small"
                    sx={{
                      backgroundColor: 'rgba(0,0,0,0.03)',
                      color: selectedAgent === 'market_agent' ? '#10B981' : 
                            selectedAgent === 'vault_agent' ? '#6A1B9A' : '#10B981',
                      fontSize: '0.85rem',
                      padding: '4px 10px',
                      borderRadius: '16px',
                      height: '32px',
                      display: 'flex',
                      gap: 0.5,
                      alignItems: 'center',
                      transition: 'all 0.2s',
                      border: '1px solid rgba(0,0,0,0.05)',
                      boxShadow: '0px 1px 2px rgba(0,0,0,0.02)',
                      '&:hover': {
                        backgroundColor: selectedAgent === 'market_agent' ? 'rgba(16, 185, 129, 0.08)' : 
                                        selectedAgent === 'vault_agent' ? 'rgba(106, 27, 154, 0.08)' : 'rgba(16, 185, 129, 0.08)',
                        boxShadow: '0px 1px 3px rgba(0,0,0,0.05)',
                      }
                    }}
                  >
                    <AddCircleOutline fontSize="small" sx={{ fontSize: '16px' }} />
                    <Typography variant="caption" sx={{ fontWeight: 500, fontSize: '0.75rem' }}>
                      New Chat
                    </Typography>
                  </IconButton>
                </Box>
              </Tabs>
              
              {/* ChatProvider with ref */}
              <ChatProvider ref={chatProviderRef}>
                {/* Chat Tab */}
                <ChatTab selectedAgent={selectedAgent} tabIndex={tabIndex} />
                
                {/* History Tab */}
                <Box 
                  hidden={tabIndex !== 1} 
                  sx={{ 
                    flexGrow: 1, 
                    position: 'relative',
                    zIndex: 1,
                    color: '#333333',
                  }}
                >
                  {tabIndex === 1 && (
                    <Box>
                      <Typography variant="h6" gutterBottom sx={{ fontSize: '1rem', fontWeight: 600, color: '#333333' }}>
                        Conversation History
                      </Typography>
                      <Typography variant="body2" sx={{ color: '#666666' }}>
                        Your past conversations will appear here.
                      </Typography>
                    </Box>
                  )}
                </Box>
              </ChatProvider>
            </Paper>
          </Grid>
        </Grid>
      </Container>
      
      <Footer />
    </Box>
  );
};

export default Dashboard; 