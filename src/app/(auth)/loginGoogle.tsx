import React from "react";
import { Text, TouchableOpacity, Image, Alert } from "react-native";
import * as WebBrowser from "expo-web-browser";
import * as Linking from "expo-linking";

const GOOGLE_ICON =
  "https://th.bing.com/th/id/R.0b5f56acafa451e24c84ece2e848c7b5?rik=GbZk1A%2bLRZVRnA&pid=ImgRaw&r=0";

interface Props {
  onTokenReceived: (token: string) => void;
}

const GoogleLoginButton: React.FC<Props> = ({ onTokenReceived }) => {
  const loginWithGoogle = async () => {
    console.log("Login button pressed");

    const redirectUri = Linking.createURL("auth-success");
    const backendLoginUrl = `https://manoke-server-6gsv.onrender.com/auth/google/login?redirect_url=${encodeURIComponent(
      redirectUri
    )}`;

    try {
      const result = await WebBrowser.openAuthSessionAsync(
        backendLoginUrl,
        redirectUri
      );
      console.log("OAuth result:", result);
      if (result.type === "success" && result.url) {
        const url = new URL(result.url);
        const accessToken = url.searchParams.get("accessToken");

        if (accessToken) {
          onTokenReceived(accessToken);
        } else {
          Alert.alert("Login failed", "No access token returned.");
        }
      } else {
        Alert.alert("Login canceled or failed.");
      }
    } catch (error) {
      console.error("Login error:", error);
      Alert.alert("Login error", "Something went wrong during login.");
    }
  };

  return (
    <TouchableOpacity
      onPress={loginWithGoogle}
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
};

export default GoogleLoginButton;
