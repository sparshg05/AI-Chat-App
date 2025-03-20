import axios from 'axios';

const axiosInstance = axios.create({
    baseURL: "https://ai-chat-app-3e0k.onrender.com",
    headers: {
        'Authorization': `Bearer ${localStorage.getItem('token')}`
    }
});

export default axiosInstance;