import React, { createContext, useState, useContext, useEffect } from 'react';
import apiService from '../services/api';

const AuthContext = createContext(null);

export function useAuth() {
  return useContext(AuthContext);
}

export function AuthProvider({ children }) {
  const [currentUser, setCurrentUser] = useState(null);
  const [tokens, setTokens] = useState({});
  const [loading, setLoading] = useState(true);

  // Check for existing login on mount and initialize the API service
  useEffect(() => {
    const checkAuth = async () => {
      // Try to initialize the API service first
      const isAuthValid = await apiService.init();
      
      if (isAuthValid) {
        // If API service has valid tokens, use those
        setTokens(apiService.tokens);
        
        // Try to get user info from localStorage
        const userEmail = localStorage.getItem('user_email');
        if (userEmail) {
          setCurrentUser({ email: userEmail });
        } else {
          // If we have tokens but no user info, set a generic user
          setCurrentUser({ email: 'User' });
        }
      } else {
        // Check legacy storage as fallback
        const savedUser = localStorage.getItem('omUser');
        const savedTokens = localStorage.getItem('omTokens');
        
        if (savedUser && savedTokens) {
          try {
            const parsedUser = JSON.parse(savedUser);
            const parsedTokens = JSON.parse(savedTokens);
            
            setCurrentUser(parsedUser);
            setTokens(parsedTokens);
            
            // Also update the API service with these tokens
            apiService.setTokens(parsedTokens);
          } catch (error) {
            console.error('Error parsing saved authentication data', error);
            // Clear invalid data
            localStorage.removeItem('omUser');
            localStorage.removeItem('omTokens');
          }
        }
      }
      
      setLoading(false);
    };
    
    checkAuth();
  }, []);

  // Save user and tokens to localStorage when they change
  useEffect(() => {
    if (currentUser) {
      localStorage.setItem('omUser', JSON.stringify(currentUser));
      // Also store email separately for easier access
      if (currentUser.email) {
        localStorage.setItem('user_email', currentUser.email);
      }
    } else {
      localStorage.removeItem('omUser');
      localStorage.removeItem('user_email');
    }
  }, [currentUser]);

  useEffect(() => {
    if (tokens && Object.keys(tokens).length > 0) {
      localStorage.setItem('omTokens', JSON.stringify(tokens));
      // Also update the API service
      apiService.setTokens(tokens);
    } else {
      localStorage.removeItem('omTokens');
    }
  }, [tokens]);

  // Setup listener for auth failures that need redirect
  useEffect(() => {
    const handleAuthFailure = () => {
      console.log('Auth failure event received, logging out');
      logout();
      // Navigate to login page
      window.location.href = '/';
    };
    
    // Add event listener for auth failures
    window.addEventListener('auth_failure', handleAuthFailure);
    
    return () => {
      window.removeEventListener('auth_failure', handleAuthFailure);
    };
  }, []);

  function login(user, authTokens) {
    setCurrentUser(user);
    setTokens(authTokens);
    // Also update the API service
    apiService.setTokens(authTokens);
    return true;
  }

  function logout() {
    // Call API service logout to clear its state
    apiService.logout();
    
    // Clear context state
    setCurrentUser(null);
    setTokens({});
    
    // Clear local storage
    localStorage.removeItem('omUser');
    localStorage.removeItem('omTokens');
    localStorage.removeItem('user_email');
    localStorage.removeItem('om_tokens');
    localStorage.removeItem('om_conversation_ids');
  }

  const value = {
    currentUser,
    tokens,
    login,
    logout,
    isAuthenticated: !!currentUser
  };

  return (
    <AuthContext.Provider value={value}>
      {!loading && children}
    </AuthContext.Provider>
  );
} 