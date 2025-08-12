// Application constants
export const APP_CONSTANTS = {
  // API Endpoints - Point to your local backend
  API_BASE_URL: 'http://localhost:5000/api', // Change this to your backend URL
  API_TIMEOUT: 10000,
  
  // Storage Keys
  AUTH_TOKEN_KEY: 'auth_token',
  USER_DATA_KEY: 'user_data',
  
  // Date/Time Formats
  DATE_FORMAT: 'yyyy-MM-dd',
  TIME_FORMAT: 'HH:mm',
  
  // Pagination
  DEFAULT_PAGE_SIZE: 20,
  
  // Colors
  PRIMARY_COLOR: '#007AFF',
  SECONDARY_COLOR: '#34C759',
  ERROR_COLOR: '#FF3B30',
  WARNING_COLOR: '#FF9500',
  INFO_COLOR: '#007AFF',
  
  // Messages
  LOADING_MESSAGE: 'Please wait...',
  SUCCESS_MESSAGE: 'Operation completed successfully',
  ERROR_MESSAGE: 'Something went wrong. Please try again.'
};

//module.exports = APP_CONSTANTS;