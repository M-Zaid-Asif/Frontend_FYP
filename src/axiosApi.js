import axios from 'axios';

const api = axios.create({
  baseURL: 'http://localhost:8000/api/v1', // Your backend URL
  withCredentials: true, // Required for cookies/sessions
});

export default api;