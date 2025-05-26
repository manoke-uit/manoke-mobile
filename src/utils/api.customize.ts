import axios from "axios";
import { Platform } from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { router, usePathname } from "expo-router";

const backend = process.env.EXPO_PUBLIC_API_URL;

const instance = axios.create({
  baseURL: backend,
});

// Add a request interceptor
instance.interceptors.request.use(
  async function (config) {
    const noAuthEndpoints = [
      "/auth/login",
      "/auth/signup",
      "/auth/confirm-email",
      "/auth/forgot-password",
      "/auth/reset-password",
    ];
    if (!noAuthEndpoints.some((endpoint) => config.url?.includes(endpoint))) {
      const access_token = await AsyncStorage.getItem("accessToken");
      if (access_token) {
        config.headers["Authorization"] = `Bearer ${access_token}`;
      }
    }
    return config;
  },
  function (error) {
    return Promise.reject(error);
  }
);

// Add a response interceptor
instance.interceptors.response.use(
  function (response) {
    if (response.data) return response.data;
    return response;
  },
  async function (error) {
    // console.error("Response Error:", error);

    const currentPath =
      typeof window !== "undefined" ? window.location.pathname : "";

    if (error?.response?.status === 401) {
      await AsyncStorage.removeItem("accessToken");
      if (!currentPath.includes("/start")) {
        router.replace("/(auth)/start");
      }

      return Promise.reject();
    }
    if (error?.response?.data) return error?.response?.data;
    return Promise.reject(error);
  }
);

export default instance;
