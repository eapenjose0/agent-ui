import React, { createContext, useState, useContext, useEffect } from 'react';

const ChatContext = createContext(null);

export function useChat() {
  return useContext(ChatContext);
}

export function ChatProvider({ children }) {
  const [chatHistory, setChatHistory] = useState([]);
  const [isStreaming, setIsStreaming] = useState(false);
  const [currentResponse, setCurrentResponse] = useState('');
  
  // Listen for custom clearChat event
  useEffect(() => {
    const handleClearChat = () => {
      console.log('Clearing chat history from event');
      clearChat();
    };
    
    // Add event listener
    document.addEventListener('clearChat', handleClearChat);
    
    // Clean up
    return () => {
      document.removeEventListener('clearChat', handleClearChat);
    };
  }, []);
  
  // Function to add a user message to the chat
  const addUserMessage = (message) => {
    setChatHistory(prevHistory => [...prevHistory, { role: 'user', content: message }]);
  };
  
  // Function to add an initial assistant message (placeholder)
  const addAssistantMessage = (initialMessage = '⏳ Processing your request...') => {
    setChatHistory(prevHistory => [...prevHistory, { role: 'assistant', content: initialMessage }]);
  };
  
  // Function to update the latest assistant message
  const updateLatestAssistantMessage = (content) => {
    setChatHistory(prevHistory => {
      // Create a copy of the history
      const newHistory = [...prevHistory];
      
      // Find the last assistant message
      const lastAssistantIndex = newHistory.map(msg => msg.role).lastIndexOf('assistant');
      
      if (lastAssistantIndex !== -1) {
        // Update the content of the last assistant message
        newHistory[lastAssistantIndex] = {
          ...newHistory[lastAssistantIndex],
          content
        };
      } else {
        // If no assistant message exists, add one
        newHistory.push({ role: 'assistant', content });
      }
      
      return newHistory;
    });
  };
  
  // Function to clear chat history
  const clearChat = () => {
    setChatHistory([]);
    setCurrentResponse('');
    setIsStreaming(false);
  };
  
  const value = {
    chatHistory,
    setChatHistory,
    isStreaming,
    setIsStreaming,
    currentResponse,
    setCurrentResponse,
    addUserMessage,
    addAssistantMessage,
    updateLatestAssistantMessage,
    clearChat
  };
  
  return (
    <ChatContext.Provider value={value}>
      {children}
    </ChatContext.Provider>
  );
} 