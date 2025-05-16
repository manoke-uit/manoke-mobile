import axios from "axios";
import { Platform } from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { router } from "expo-router";

const backend =
  Platform.OS === "android"
    ? process.env.EXPO_PUBLIC_ANDROID_API_URL
    : process.env.EXPO_PUBLIC_IOS_API_URL;

const instance = axios.create({
  baseURL: backend,
});

// Add a request interceptor
instance.interceptors.request.use(
  async function (config) {
    const noAuthEndpoints = ["/auth/login", "/auth/signup", "/auth/confirm-email", "/auth/forgot-password", "/auth/reset-password"];
    if (!noAuthEndpoints.some((endpoint) => config.url?.includes(endpoint))) {
      const access_token = await AsyncStorage.getItem("accessToken");
      console.log("Request URL:", config.url);
      console.log("Access Token:", access_token);
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
    console.log("Response:", response.data);
    if (response.data) return response.data;
    return response;
  },
  async function (error) {
    // console.error("Response Error:", error);
    if (error?.response?.status === 401) {
      await AsyncStorage.removeItem("accessToken");
      router.replace("/(auth)/start");
      return Promise.reject(new Error("Unauthorized"));
    }
    if (error?.response?.data) return error?.response?.data;
    return Promise.reject(error);
  }
);

export default instance;