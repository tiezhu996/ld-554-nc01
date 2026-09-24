import axios from 'axios';
import { ElMessage } from 'element-plus';
import router from '@/router';
import { getToken } from './auth';

export const request = axios.create({
  baseURL: '/api',
  timeout: 12000
});

request.interceptors.request.use((config) => {
  const token = getToken();
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

request.interceptors.response.use(
  (response) => response.data,
  (error) => {
    const status = error.response?.status;
    if (status === 401) {
      ElMessage.error('登录已过期，请重新登录');
      router.push('/login');
    } else if (status === 403) {
      ElMessage.error('无权限执行该操作');
    } else if (status >= 500) {
      ElMessage.error('服务器错误，请稍后重试');
    } else {
      ElMessage.error(error.response?.data?.message ?? '请求失败');
    }
    return Promise.reject(error);
  }
);
