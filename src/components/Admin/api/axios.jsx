import axios from 'axios';

const instance = axios.create({
  baseURL: 'https://bfbackend.onrender.com',
});

export default instance;