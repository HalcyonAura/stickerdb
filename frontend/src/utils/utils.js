import axios from 'axios';

const API = axios.create({ baseURL: 'http://localhost:5000' });

// Example function to fetch images
export const fetchImages = async () => {
  const response = await API.get('/images');
  return response.data;
};