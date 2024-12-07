import axios from 'axios';

const API = axios.create({ baseURL: 'http://localhost:5000/api' });

export const uploadImage = async (formData) => {
  const response = await API.post('/upload', formData, {
    headers: { 'Content-Type': 'multipart/form-data' },
  });
  return response.data;
};

export const fetchImages = async () => {
  const response = await API.get('/images');
  return response.data;
};