import axios from 'axios';

//CHANGE API URL HERE!
const api = axios.create({
    baseURL: 'http://127.0.0.1:80'
});

export default api;