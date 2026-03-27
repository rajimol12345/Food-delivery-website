import axios from 'axios';

const api = axios.create({
  baseURL: 'https://food-delivery-website-k1e1.onrender.com',
  timeout: 10000,
});

export default api;
