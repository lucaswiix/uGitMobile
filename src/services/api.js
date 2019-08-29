import axios from 'axios';

const api = axios.create({
    baseURL: 'http://10.0.30.9:80'
});

export default api;