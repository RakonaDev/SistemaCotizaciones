import axios, { AxiosError, AxiosInstance, AxiosResponse, InternalAxiosRequestConfig } from "axios";

// Define an interface for expected API error responses
interface ApiErrorResponse {
  message: string;
  errors?: Record<string, string[]>;
}

export const apiArchivo: AxiosInstance = axios.create({
  // baseURL: process.env.NEXT_PUBLIC_API || 'http://localhost:8000/api',
  responseType: 'blob',
  withCredentials: true,
});

apiArchivo.interceptors.request.use(
  (config: InternalAxiosRequestConfig): InternalAxiosRequestConfig => {
    // Ensure this code only runs on the client-side (browser)
    if (typeof window !== 'undefined') {
      let token: string | null = null;

      // Option A: From localStorage
      token = localStorage.getItem('token');

      console.log(token)
      if (token) {
        console.log(token)
        
        config.headers.Authorization = `Bearer ${token}`;
      }
    }
    return config;
  },
  (error: AxiosError): Promise<AxiosError> => {
    return Promise.reject(error);
  }
);

// 3. (Optional) Response Interceptor to handle authorization errors
apiArchivo.interceptors.response.use(
  (response: AxiosResponse): AxiosResponse => response,
  (error: AxiosError<ApiErrorResponse>): Promise<AxiosError> => {
    if (error.response && error.response.status === 401) {
      if (typeof window !== 'undefined') {
        localStorage.removeItem('token');
        // redirect('/login')
        window.location.href = '/login'; // Or use useRouter from Next.js if in a component
      }
    }
    return Promise.reject(error);
  }
);
