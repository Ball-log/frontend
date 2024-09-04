  import axios from 'axios';
import { getHeader } from '../utils/get_header';

// Axios 인스턴스 생성
export const api = axios.create({
  baseURL: 'https://api.ballog.store',
});

// Request interceptor to add the token to headers
api.interceptors.request.use(
  async (config) => {
    try {
      config.headers = await getHeader();
      return config;
    } catch (error) {
      console.error('APi 헤더 오류', error);
      throw error;
    }
  },
  (error) => {
    return Promise.reject(error);
  }
);
