import axios from 'axios';
import Cookies from 'js-cookie';
import { jwtDecode } from 'jwt-decode';


axios.interceptors.request.use(async (config) => {
  const token = Cookies.get('token');
  const refreshToken = Cookies.get('refreshToken'); 

  const isTokenExpired = (token) => {
    if (!token) {
      return true;
    }
    const decoded = jwtDecode(token);
    const currentTime = Date.now() / 1000; 
    return decoded.exp < currentTime;
  };

  if (isTokenExpired(token) && refreshToken) {
    try {
      const response = await axios.post('http://127.0.0.1:8000/api/token/refresh/', { refresh: refreshToken });
      const { access, refresh } = response.data;

      Cookies.set('token', access, { expires: 7 }); 
      if (refresh) {
        Cookies.set('refreshToken', refresh, { expires: 7 }); 
      }

      config.headers['Authorization'] = `Bearer ${access}`;
    } catch (error) {
      console.error('Error refreshing token:', error);
      window.location.href = '/login';
      alert('Error refreshing token. Please login again.');
    }
  } else if (!isTokenExpired(token)) {
    config.headers['Authorization'] = `Bearer ${token}`;
  }

  return config;
}, error => {
  return Promise.reject(error);
});

export default axios;
