import axios from "axios";
import Cookies from "js-cookie";

const backendUrl = import.meta.env.VITE_BACKEND_URL;

const axiosInstance = axios.create({
  baseURL: backendUrl,
  timeout: 10000,
  withCredentials: true, // کوکی‌ها به طور خودکار ارسال می‌شوند
});

// Request interceptor to add Authorization header with access token if available
axiosInstance.interceptors.request.use(
  (config) => {
    // چون توکن‌ها در کوکی‌های httpOnly ذخیره می‌شن، نیازی به اضافه کردن Authorization نیست
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor to handle 401 errors and refresh token logic
axiosInstance.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalConfig = error.config;

    if (error.response?.status === 401 && !originalConfig._retry) {
      originalConfig._retry = true;

      try {
        // Call the refresh endpoint to get a new access token
        const { data } = await axios.post(
          `${backendUrl}/api/user/adminrefresh`,
          null,
          { withCredentials: true }
        );

        const newAccessToken = data.adminAccessToken;

        // Update the Authorization header with the new access token
        axiosInstance.defaults.headers.common[
          "Authorization"
        ] = `${newAccessToken}`;
        originalConfig.headers["Authorization"] = `${newAccessToken}`;

        // Retry the original request with the new access token
        return axiosInstance(originalConfig);
      } catch (refreshError) {
        console.error("Failed to refresh token:", refreshError);
        // Optionally redirect to login if refreshing fails
        localStorage.removeItem("isLogin");
        window.location.href = "/";
        return Promise.reject(refreshError);
      }
    }

    // Handle other errors
    return Promise.reject(error);
  }
);

export default axiosInstance;
