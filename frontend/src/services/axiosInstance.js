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
          `${backendUrl}/api/user/refresh`,
          null,
          { withCredentials: true }
        );

        const newAccessToken = data.accessToken;

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

// import axios from "axios";
// import Cookies from "js-cookie";

// const backendUrl = import.meta.env.VITE_BACKEND_URL;

// const axiosInstance = axios.create({
//   baseURL: backendUrl,
//   timeout: 10000,
//   withCredentials: true,
// });

// axiosInstance.interceptors.response.use(
//   (response) => response,
//   async (error) => {
//     const originalConfig = error.config;

//     if (error.response?.status === 401 && !originalConfig._retry) {
//       originalConfig._retry = true;

//       try {
//         // Call the refresh endpoint
//         const { data } = await axios.post(
//           `${backendUrl}/api/user/refresh`,
//           null,
//           {
//             withCredentials: true, // Include cookies
//           }
//         );

//         const newAccessToken = data.accessToken;

//         // Update the Authorization header with the new access token
//         axiosInstance.defaults.headers.common[
//           "Authorization"
//         ] = `${newAccessToken}`;
//         originalConfig.headers["Authorization"] = `${newAccessToken}`;

//         // Retry the original request
//         return axiosInstance(originalConfig);
//       } catch (refreshError) {
//         console.error("Failed to refresh token:", refreshError);
//         // Optionally redirect to login if refreshing fails
//         // Handle refresh token failure
//         // Cookies.remove("jwt");
//         // Cookies.remove("refreshToken");
//         // window.location.href = "/login";
//         return Promise.reject(refreshError);
//       }
//     }

//     return Promise.reject(error);
//   }
// );

///////////////////////////////////////////////////////////////////////
// import axios from "axios";
// import Cookies from "js-cookie";

// const backendUrl = import.meta.env.VITE_BACKEND_URL;

// const axiosInstance = axios.create({
//   baseURL: backendUrl,
//   timeout: 10000,
//   withCredentials: true,
// });

// axiosInstance.interceptors.request.use(
//   (config) => {
//     const accessToken = Cookies.get("jwt");
//     if (accessToken) {
//       config.headers.Authorization = `${accessToken}`;
//     }
//     return config;
//   },
//   (error) => Promise.reject(error)
// );

// axiosInstance.interceptors.response.use(
//   (response) => response,
//   async (error) => {
//     const originalConfig = error.config;

//     // If access token is expired (401) and the request is not retried yet
//     if (error.response?.status === 401 && !originalConfig._retry) {
//       originalConfig._retry = true;
//       console.log(originalConfig._retry);

//       try {
//         const refreshToken = Cookies.get("refreshToken");
//         // Get the refresh token from cookies

//         console.log(refreshToken);

//         if (refreshToken) {
//           // Use the refresh token to get a new access token
//           const { data } = await axios.post(`${backendUrl}/api/user/refresh`, {
//             refreshToken,
//           });

//           const newAccessToken = data.accessToken;

//           // Save the new access token in cookies
//           Cookies.set("jwt", newAccessToken, {
//             secure: true,
//             sameSite: "Strict",
//           });

//           // Update the Authorization header of the original request
//           originalConfig.headers.Authorization = `${newAccessToken}`;

//           // Retry the original request
//           return axiosInstance(originalConfig);
//         } else {
//           // If no refresh token is available, redirect to login
//           throw new Error("Refresh token not found. Redirecting to login.");
//         }
//       } catch (refreshError) {
//         // Handle refresh token failure
//         // Cookies.remove("jwt");
//         // Cookies.remove("refreshToken");
//         // window.location.href = "/login";
//         // return Promise.reject(refreshError);
//       }
//     }

//     return Promise.reject(error);
//   }
// );

// export default axiosInstance;

// ///////////////////////////////////////////////////////////////////////

// import { useContext } from "react";
// import axios from "axios";
// import Cookies from "js-cookie";

// const backendUrl = import.meta.env.VITE_BACKEND_URL;

// const axiosInstance = axios.create({
//   baseURL: backendUrl,
//   timeout: 10000,
//   withCredentials: true,
// });

// axiosInstance.interceptors.response.use(
//   async (res) => {
//     return res;
//   },
//   async (err) => {
//     const originalConfig = err.config;

//     if (err.response) {
//       if (err.response.status === 401 && !originalConfig._retry) {
//         originalConfig._retry = true;

//         try {
//           let cookieInfo;
//           const cookieArray = Cookies.get("refreshToken")?.split("j:");
//           console.log(cookieArray);

//           cookieInfo = cookieArray;
//           if (cookieArray) cookieInfo = JSON.parse(cookieArray[1]);

//           if (cookieInfo.refreshToken) {
//             await axiosInstance.post("/api/user/refresh", {
//               refreshToken: cookieInfo.refreshToken,
//             });
//             return axiosInstance(originalConfig);
//           }
//         } catch (_error) {
//           if (_error.response && _error.response.data) {
//             return Promise.reject(_error.response.data);
//           }
//           return Promise.reject(_error);
//         }
//       }
//     }
//   }
// );

// export default axiosInstance;
