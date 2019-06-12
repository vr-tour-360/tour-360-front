import axios from 'axios';
import { UserStore } from '../Stores';

const instance = axios.create({
    baseURL: 'http://localhost:3001/'
});

instance.interceptors.request.use((config: any) => {
    config.headers.Authorization = UserStore.getToken();

    return config;
});

export default instance;