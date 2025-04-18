import React from 'react';
import { Box, Paper, Typography, Avatar } from '@mui/material';
import { SmartToy, Person, Psychology, Science, Lock, BarChart } from '@mui/icons-material';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import rehypeRaw from 'rehype-raw';
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
import { materialLight } from 'react-syntax-highlighter/dist/esm/styles/prism';
import remarkMath from 'remark-math';
import rehypeKatex from 'rehype-katex';
import 'katex/dist/katex.min.css';

const ChatMessage = ({ message, agentType = 'om_assistant' }) => {
  const { role, content } = message;
  const isUser = role === 'user';
  
  // Function to detect if content includes a code block
  const containsCodeBlock = (text) => {
    return text?.includes('```');
  };

  // Function to detect if content is JSON
  const isJsonString = (text) => {
    if (typeof text !== 'string') return false;
    try {
      const result = JSON.parse(text);
      return typeof result === 'object' && result !== null;
    } catch (e) {
      return false;
    }
  };

  // Function to format content appropriately
  const formatContent = (content) => {
    // If content is empty or null, return empty string
    if (!content) return '';
    
    // If content is already a string, use it directly
    if (typeof content === 'string') {
      // Check if content is a JSON string
      if (isJsonString(content) && !containsCodeBlock(content)) {
        try {
          // Format the JSON nicely
          const parsed = JSON.parse(content);
          return "```json\n" + JSON.stringify(parsed, null, 2) + "\n```";
        } catch (e) {
          // If parsing fails, just use the original content
          return content;
        }
      }
      return content;
    }
    
    // If content is an object, stringify it
    if (typeof content === 'object' && content !== null) {
      return "```json\n" + JSON.stringify(content, null, 2) + "\n```";
    }
    
    // Default case: convert to string
    return String(content);
  };

  // Get the right icon and color based on the agent type
  const getAgentIcon = () => {
    if (isUser) return <Person />;
    if (agentType === 'market_agent') return <Science />;
    if (agentType === 'vault_agent') return <Lock />;
    if (agentType === 'insights_agent') return <BarChart />;
    return <SmartToy />; // Default fallback
  };

  const getAgentName = () => {
    if (isUser) return 'You';
    if (agentType === 'market_agent') return 'Market Agent';
    if (agentType === 'vault_agent') return 'Vault Agent';
    if (agentType === 'insights_agent') return 'Insights Agent';
    return 'Agent'; // Default fallback
  };

  const getAgentColor = () => {
    if (isUser) return 'primary.main';
    if (agentType === 'market_agent') return 'secondary.dark';
    if (agentType === 'vault_agent') return '#6A1B9A'; // Purple for Vault Agent
    if (agentType === 'insights_agent') return '#1976D2'; // Blue for Insights Agent
    return 'secondary.dark'; // Default fallback
  };

  // Format the content
  const formattedContent = formatContent(content);

  // Check if the message is an error
  const isErrorMessage = formattedContent.includes('## ❌ Error');

  // Custom components for enhanced markdown rendering
  const components = {
    code({ node, inline, className, children, ...props }) {
      const match = /language-(\w+)/.exec(className || '');
      // Special styling for error code blocks
      if (match && match[1] === 'error') {
        return (
          <div style={{
            backgroundColor: '#ffebee',
            border: '1px solid #f44336',
            borderRadius: '8px',
            padding: '12px',
            margin: '8px 0',
            color: '#c62828',
            fontFamily: 'SF Mono, Menlo, Monaco, monospace',
            fontSize: '0.85rem',
            whiteSpace: 'pre-wrap',
            wordBreak: 'break-word'
          }}>
            {String(children).replace(/\n$/, '')}
          </div>
        );
      }
      
      return !inline && match ? (
        <SyntaxHighlighter
          style={materialLight}
          language={match[1]}
          PreTag="div"
          {...props}
        >
          {String(children).replace(/\n$/, '')}
        </SyntaxHighlighter>
      ) : (
        <code className={className} {...props}>
          {children}
        </code>
      );
    },
    table({ node, ...props }) {
      return (
        <div style={{ overflowX: 'auto', margin: '16px 0' }}>
          <table style={{ 
            borderCollapse: 'collapse', 
            width: '100%',
            fontSize: '0.9rem'
          }} {...props} />
        </div>
      );
    },
    thead({ node, ...props }) {
      return <thead style={{ backgroundColor: '#f8f9fa' }} {...props} />;
    },
    th({ node, ...props }) {
      return (
        <th
          style={{
            padding: '8px 12px',
            borderBottom: '2px solid #ddd',
            textAlign: 'left',
            fontWeight: 600
          }}
          {...props}
        />
      );
    },
    td({ node, ...props }) {
      return (
        <td
          style={{
            padding: '8px 12px',
            borderBottom: '1px solid #eee',
            textAlign: 'left'
          }}
          {...props}
        />
      );
    }
  };

  return (
    <Box 
      sx={{
        display: 'flex',
        flexDirection: 'row',
        my: 2,
        gap: 2,
        position: 'relative',
        zIndex: 1,
        isolation: 'isolate', // Create a stacking context
        pointerEvents: 'auto',
      }}
    >
      <Avatar 
        sx={{ 
          bgcolor: isUser ? '#f0f0f0' : getAgentColor(),
          color: isUser ? '#333333' : 'white',
          zIndex: 2,
          position: 'relative',
          boxShadow: '0px 1px 2px rgba(0, 0, 0, 0.1)',
        }}
      >
        {getAgentIcon()}
      </Avatar>
      
      <Paper 
        elevation={1}
        sx={{ 
          p: 2, 
          maxWidth: '85%',
          width: '100%', // Make sure it takes up available width
          borderRadius: '16px', // More rounded corners for Mac-like appearance
          bgcolor: isUser 
            ? '#f0f0f0' 
            : (isErrorMessage 
               ? '#fff5f5' // Light red background for error messages 
               : (agentType === 'market_agent' ? '#f8fffa' : 
                  agentType === 'vault_agent' ? '#f8f5ff' : '#f8fffa')),
          color: '#333333', // Dark gray text for better readability
          borderLeft: isErrorMessage ? '3px solid #f44336' : 'none', // Red border for errors
          position: 'relative',
          zIndex: 2,
          boxShadow: isErrorMessage 
            ? '0px 1px 3px rgba(244, 67, 54, 0.2)' 
            : '0px 1px 3px rgba(0, 0, 0, 0.08)',
          '&:hover': {
            boxShadow: isErrorMessage 
              ? '0px 2px 5px rgba(244, 67, 54, 0.15)' 
              : '0px 2px 5px rgba(0, 0, 0, 0.05)', // Subtle shadow on hover
          },
        }}
      >
        <Typography 
          variant="subtitle2" 
          color={isUser 
            ? '#666666' 
            : (agentType === 'market_agent' ? '#10B981' : 
               agentType === 'vault_agent' ? '#6A1B9A' : '#10B981')
          } 
          gutterBottom
          fontWeight="600"
          fontSize="0.85rem"
        >
          {getAgentName()}
        </Typography>
        
        <Box sx={{ 
          overflow: 'auto',
          position: 'relative',
          zIndex: 3,
          color: '#333333', // Dark gray text
          '& pre': {
            backgroundColor: '#f7f7f7', // Light gray background for code blocks
            padding: '10px',
            borderRadius: '8px',
            overflowX: 'auto',
            border: '1px solid #eeeeee',
            fontSize: '0.85rem',
          },
          '& code': {
            fontFamily: 'SF Mono, Menlo, Monaco, monospace', // Mac-like font
            fontSize: '0.85rem',
            backgroundColor: '#f5f5f5',
            padding: '2px 4px',
            borderRadius: '3px',
          },
          '& a': {
            color: agentType === 'market_agent' ? '#10B981' : 
                  agentType === 'vault_agent' ? '#6A1B9A' : '#10B981',
            textDecoration: 'none',
            '&:hover': {
              textDecoration: 'underline',
            }
          },
          '& blockquote': {
            borderLeft: `3px solid ${agentType === 'market_agent' ? '#e2f9ef' : 
                                    agentType === 'vault_agent' ? '#e6d8f5' : '#e2f9ef'}`,
            paddingLeft: '10px',
            color: '#666666', // Medium gray for blockquotes
            margin: '0.5rem 0',
            backgroundColor: '#fafafa',
            borderRadius: '0 4px 4px 0',
          },
          '& h1, & h2, & h3, & h4, & h5, & h6': {
            color: '#333333',
            fontWeight: 600,
          },
          '& img': {
            maxWidth: '100%',
            borderRadius: '8px',
            margin: '8px 0',
          },
          '& hr': {
            border: 'none',
            height: '1px',
            backgroundColor: '#eeeeee',
            margin: '16px 0',
          },
          '& *': {
            pointerEvents: 'auto', // Ensure all child elements are interactive
          }
        }}>
          <ReactMarkdown
            remarkPlugins={[remarkGfm, remarkMath]}
            rehypePlugins={[rehypeRaw, rehypeKatex]}
            components={components}
          >
            {formattedContent}
          </ReactMarkdown>
        </Box>
      </Paper>
    </Box>
  );
};

export default ChatMessage; 