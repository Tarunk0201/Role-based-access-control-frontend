const BASE_URL = "http://localhost:3000";

export const getApiUrl = (endpoint) => {
  return `${BASE_URL}${endpoint}`;
};
