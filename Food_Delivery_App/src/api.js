import axios from 'axios';

const api = axios.create({
  baseURL: 'https://food-delivery-app-yfr9.onrender.com',
  timeout: 10000,
});

export default api;
