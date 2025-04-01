/**
 * Date formatting utility functions
 */

// Format a date to a readable string
export const formatDate = (date) => {
  if (!date) return '';
  
  const d = new Date(date);
  
  // Check if date is valid
  if (isNaN(d.getTime())) return '';
  
  return d.toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
  });
};

// Format a date with time
export const formatDateTime = (date) => {
  if (!date) return '';
  
  const d = new Date(date);
  
  // Check if date is valid
  if (isNaN(d.getTime())) return '';
  
  return d.toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  });
};

// Get a relative time string like "2 hours ago"
export const getRelativeTimeString = (date) => {
  if (!date) return '';
  
  const d = new Date(date);
  
  // Check if date is valid
  if (isNaN(d.getTime())) return '';
  
  const now = new Date();
  const diffSeconds = Math.floor((now - d) / 1000);
  
  if (diffSeconds < 60) {
    return 'just now';
  }
  
  const diffMinutes = Math.floor(diffSeconds / 60);
  if (diffMinutes < 60) {
    return `${diffMinutes} minute${diffMinutes > 1 ? 's' : ''} ago`;
  }
  
  const diffHours = Math.floor(diffMinutes / 60);
  if (diffHours < 24) {
    return `${diffHours} hour${diffHours > 1 ? 's' : ''} ago`;
  }
  
  const diffDays = Math.floor(diffHours / 24);
  if (diffDays < 7) {
    return `${diffDays} day${diffDays > 1 ? 's' : ''} ago`;
  }
  
  return formatDate(date);
};

export default {
  formatDate,
  formatDateTime,
  getRelativeTimeString,
}; 