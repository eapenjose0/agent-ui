import React, { useState, useRef } from 'react';
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
  AddCircleOutline
} from '@mui/icons-material';
import Chat from '../components/Chat';
import Settings from '../components/Settings';
import { ChatProvider, useChat } from '../contexts/ChatContext';
import Header from '../components/Header';
import Footer from '../components/Footer';

// Create a child component that has access to the ChatContext
const ChatTab = ({ selectedAgent, tabIndex }) => {
  const { clearChat } = useChat();
  
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
      {tabIndex === 0 && <Chat selectedAgent={selectedAgent} />}
    </Box>
  );
};

const Dashboard = () => {
  const [tabIndex, setTabIndex] = useState(0);
  const [selectedAgent, setSelectedAgent] = useState('om_assistant');
  const chatProviderRef = useRef(null);
  
  const handleTabChange = (event, newValue) => {
    setTabIndex(newValue);
  };
  
  const handleAgentChange = (event, newAgent) => {
    if (newAgent !== null) {
      setSelectedAgent(newAgent);
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
  
  // Get agent display name
  const getAgentDisplayName = () => {
    return selectedAgent === 'om_assistant' ? 'Assistant' : 'Appetite Agent';
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
              
              {/* Agent Selector */}
              <Box sx={{ mb: 3.5 }}>
                <Typography variant="subtitle2" gutterBottom sx={{ color: '#666666', fontWeight: 500, fontSize: '0.9rem', mb: 1 }}>
                  Select an AI Agent:
                </Typography>
                <ToggleButtonGroup
                  value={selectedAgent}
                  exclusive
                  onChange={handleAgentChange}
                  aria-label="selected agent"
                  color="primary"
                  size="medium"
                  fullWidth
                  sx={{ 
                    mb: 2,
                    '& .MuiToggleButton-root': {
                      color: '#666666',
                      borderColor: '#e0e0e0',
                      fontWeight: 500,
                      fontSize: '0.9rem',
                      py: 1,
                      '&:hover': {
                        backgroundColor: '#fff8f6',
                      }
                    }
                  }}
                >
                  <ToggleButton 
                    value="om_assistant" 
                    aria-label="Assistant"
                    sx={{ 
                      '&.Mui-selected': {
                        backgroundColor: '#fff0eb',
                        color: '#FF5722',
                        '&:hover': {
                          backgroundColor: '#ffe8e0',
                        }
                      }
                    }}
                  >
                    <Psychology sx={{ mr: 1, fontSize: '1.1rem' }} />
                    Assistant
                  </ToggleButton>
                  <ToggleButton 
                    value="appetite_agent" 
                    aria-label="Appetite Agent"
                    sx={{ 
                      '&.Mui-selected': {
                        backgroundColor: '#f0fcf9',
                        color: '#10B981',
                        '&:hover': {
                          backgroundColor: '#e6f7f3',
                        }
                      }
                    }}
                  >
                    <Science sx={{ mr: 1, fontSize: '1.1rem' }} />
                    Appetite Agent
                  </ToggleButton>
                </ToggleButtonGroup>
                <Chip 
                  label={`Active: ${getAgentDisplayName()}`} 
                  color={selectedAgent === 'om_assistant' ? 'primary' : 'secondary'}
                  size="medium"
                  sx={{
                    backgroundColor: selectedAgent === 'om_assistant' ? '#fff0eb' : '#f0fcf9',
                    color: selectedAgent === 'om_assistant' ? '#FF5722' : '#10B981',
                    fontWeight: 500,
                    fontSize: '0.85rem',
                    py: 0.5,
                    border: `1px solid ${selectedAgent === 'om_assistant' ? '#ffe0d3' : '#e6f7f3'}`,
                    width: '100%',
                    justifyContent: 'center'
                  }}
                />
              </Box>
              
              <Accordion 
                defaultExpanded
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
                  expandIcon={<ExpandMore />}
                  sx={{
                    backgroundColor: '#fafafa',
                    borderRadius: '8px',
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
                          backgroundColor: selectedAgent === 'om_assistant' ? 'rgba(255, 87, 34, 0.04)' : 'rgba(0, 0, 0, 0.02)' 
                        },
                        backgroundColor: selectedAgent === 'om_assistant' ? 'rgba(255, 87, 34, 0.08)' : 'transparent',
                        transition: 'background-color 0.2s ease'
                      }}
                      onClick={() => setSelectedAgent('om_assistant')}
                    >
                      <ListItemIcon>
                        <Psychology color="primary" fontSize="small" sx={{ fontSize: '1.3rem' }} />
                      </ListItemIcon>
                      <ListItemText
                        primary={
                          <Typography sx={{ fontSize: '0.95rem', fontWeight: 600 }}>
                            Assistant
                          </Typography>
                        }
                        secondary={
                          <Typography sx={{ fontSize: '0.85rem', color: '#666666', mt: 0.5 }}>
                            General purpose assistant for everyday tasks. Ideal for general inquiries and information gathering.
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
                          backgroundColor: selectedAgent === 'appetite_agent' ? 'rgba(16, 185, 129, 0.04)' : 'rgba(0, 0, 0, 0.02)' 
                        },
                        backgroundColor: selectedAgent === 'appetite_agent' ? 'rgba(16, 185, 129, 0.08)' : 'transparent',
                        transition: 'background-color 0.2s ease'
                      }}
                      onClick={() => setSelectedAgent('appetite_agent')}
                    >
                      <ListItemIcon>
                        <Science color="secondary" fontSize="small" sx={{ fontSize: '1.3rem' }} />
                      </ListItemIcon>
                      <ListItemText
                        primary={
                          <Typography sx={{ fontSize: '0.95rem', fontWeight: 600 }}>
                            Appetite Agent
                          </Typography>
                        }
                        secondary={
                          <Typography sx={{ fontSize: '0.85rem', color: '#666666', mt: 0.5 }}>
                            Specialized agent for insurance carrier exploration and appetite analysis.
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
                <Box sx={{ display: 'flex' }}>
                  <Tab label="Chat" />
                  <Tab label="History" />
                </Box>
                
                {/* New Chat button - Mac style */}
                <Box sx={{ display: 'flex', alignItems: 'center' }}>
                  <IconButton 
                    onClick={handleNewChat}
                    size="small"
                    sx={{
                      backgroundColor: 'rgba(0,0,0,0.03)',
                      color: selectedAgent === 'om_assistant' ? '#FF5722' : '#10B981',
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
                        backgroundColor: selectedAgent === 'om_assistant' ? 'rgba(255, 87, 34, 0.08)' : 'rgba(16, 185, 129, 0.08)',
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