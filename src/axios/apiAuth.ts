import axios, { AxiosError, AxiosInstance, AxiosResponse, InternalAxiosRequestConfig } from "axios";

// Define an interface for expected API error responses
interface ApiErrorResponse {
  message: string;
  errors?: Record<string, string[]>; 
}

export const apiAuth: AxiosInstance = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API || 'http://localhost:8000/api', // Reemplaza con tu URL base de la API
  headers: {
    'Content-Type': 'application/json',
    'Accept': 'application/json',
  },
  withCredentials: true,
});

apiAuth.interceptors.request.use(
  (config: InternalAxiosRequestConfig): InternalAxiosRequestConfig => {
    // Ensure this code only runs on the client-side (browser)
    if (typeof window !== 'undefined') {
      let token: string | null = null;

      // Option A: From localStorage
      token = localStorage.getItem('token'); 

      // Option B: From cookies (example with 'js-cookie' or direct document.cookie access)
      // If you use 'js-cookie':
      /*
      token = Cookies.get('jwt_token') || null; 
      console.log(Cookies)
      */
      //If you don't use 'js-cookie' and your cookie is named 'authToken':
      /*
      const name = 'jwt_token=';
      const decodedCookie = decodeURIComponent(document.cookie);
      console.log(document.cookie)
      const ca = decodedCookie.split(';');
      for (let i = 0; i < ca.length; i++) {
        let c = ca[i];
        while (c.charAt(0) === ' ') {
          c = c.substring(1);
        }
        if (c.indexOf(name) === 0) {
          token = c.substring(name.length, c.length);
          break;
        }
      }
      console.log(ca)
      */
     console.log(token)
      if (token) {
        console.log(token)
        // Axios 1.x and above: headers are always expected to be an object
        // You can directly access and assign if you're sure it exists or initialize.
        // It's safer to check and ensure it's an object if not strictly typed.
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
apiAuth.interceptors.response.use(
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
