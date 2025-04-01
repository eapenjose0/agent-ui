/**
 * Centralized error handling utility
 */

// Log errors to console in development, could be extended to send to a service in production
export const logError = (error, context = '') => {
  if (process.env.NODE_ENV !== 'production') {
    console.error(`Error${context ? ` in ${context}` : ''}:`, error);
  }
  // In production, could send to error tracking service like Sentry
};

// Format API error messages for display
export const formatApiError = (error) => {
  if (error.response) {
    // The request was made and the server responded with an error status
    const status = error.response.status;
    const message = error.response.data?.message || error.response.statusText;
    
    return {
      title: `Error (${status})`,
      message: message || 'An unexpected error occurred',
    };
  } else if (error.request) {
    // The request was made but no response was received
    return {
      title: 'Network Error',
      message: 'Unable to connect to the server. Please check your internet connection and try again.',
    };
  } else {
    // Something happened in setting up the request
    return {
      title: 'Application Error',
      message: error.message || 'An unexpected error occurred',
    };
  }
};

// Handle authentication errors
export const handleAuthError = (error) => {
  const formattedError = formatApiError(error);
  
  // Check if it's an auth-specific error
  if (error.response && error.response.status === 401) {
    return {
      title: 'Authentication Failed',
      message: 'Your login session has expired. Please log in again.',
      requiresLogin: true,
    };
  }
  
  return formattedError;
};

export default {
  logError,
  formatApiError,
  handleAuthError,
}; 