import React from "react";
import { Text, TouchableOpacity, Image } from "react-native";
import { makeRedirectUri } from "expo-auth-session";
import * as WebBrowser from "expo-web-browser";

const GOOGLE_ICON =
  "https://th.bing.com/th/id/R.0b5f56acafa451e24c84ece2e848c7b5?rik=GbZk1A%2bLRZVRnA&pid=ImgRaw&r=0";

const BACKEND_LOGIN_URL = "http://192.168.210.5:3000/auth/google/login";

export default function GoogleLoginButton({
  onTokenReceived,
}: {
  onTokenReceived: (token: string) => void;
}) {
  const handleLogin = async () => {
    const redirectUri = makeRedirectUri();

    const authUrl = `${BACKEND_LOGIN_URL}?redirect_uri=${encodeURIComponent(
      redirectUri
    )}`;

    const result = await WebBrowser.openAuthSessionAsync(authUrl, redirectUri);

    if (result.type === "success" && result.url) {
      const token = new URL(result.url).searchParams.get("token");
      if (token) {
        onTokenReceived(token);
      } else {
        console.warn("Không tìm thấy token trong URL.");
      }
    } else {
      console.warn("Đăng nhập bị huỷ.");
    }
  };

  return (
    <TouchableOpacity
      onPress={handleLogin}
      className="flex-row items-center bg-white py-3 px-5 rounded-lg mt-4 shadow"
    >
      <Image
        source={{ uri: GOOGLE_ICON }}
        className="w-8 h-8 mr-2"
        resizeMode="contain"
      />
      <Text className="text-base font-medium text-gray-800">
        Sign In With Google
      </Text>
    </TouchableOpacity>
  );
}
