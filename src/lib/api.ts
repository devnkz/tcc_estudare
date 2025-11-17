import axios from 'axios';

// Create an axios instance so we can export it and test more easily
const api = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL || '',
});

// Response interceptor: handle auth and service unavailable globally
api.interceptors.response.use(
  (res) => res,
  (error) => {
    const status = error?.response?.status;

    // Unauthorized -> remove token and redirect to login
    if (status === 401) {
      try {
        if (typeof document !== 'undefined') {
          document.cookie = 'token=; Max-Age=0; path=/';
        }
      } catch (e) {
        // ignore
      }
      if (typeof window !== 'undefined') {
        window.location.href = '/Auth/Login';
      }
      return Promise.reject(error);
    }

    // Service unavailable -> inform the user
    if (status === 503) {
      if (typeof window !== 'undefined') {
        // eslint-disable-next-line no-alert
        alert('Serviço temporariamente indisponível. Tente novamente mais tarde.');
      }
      return Promise.reject(error);
    }

    return Promise.reject(error);
  }
);

export default api;
