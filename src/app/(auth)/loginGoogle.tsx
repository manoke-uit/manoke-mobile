import React, { useEffect } from "react";
import { Text, TouchableOpacity, Image, View } from "react-native";
import * as WebBrowser from "expo-web-browser";
import * as Google from "expo-auth-session/providers/google";
import axios from "axios";

WebBrowser.maybeCompleteAuthSession();

const GOOGLE_ICON =
  "https://th.bing.com/th/id/R.0b5f56acafa451e24c84ece2e848c7b5?rik=GbZk1A%2bLRZVRnA&pid=ImgRaw&r=0";

interface Props {
  onTokenReceived: (token: string) => void;
}

const GoogleLoginButton: React.FC<Props> = ({ onTokenReceived }) => {
  const [request, response, promptAsync] = Google.useAuthRequest({
    clientId:
      "806331050880-k34vttuuou6hr84q5ai2c57ucjodq2g8.apps.googleusercontent.com",
  });

  useEffect(() => {
    if (response?.type === "success") {
      const id_token = response.authentication?.idToken;
      if (id_token) {
        // Gửi token lên backend để xác thực và lấy accessToken riêng
        axios
          .post("https://manoke-server-6gsv.onrender.com/auth/google/mobile", {
            idToken: id_token,
          })
          .then((res) => {
            const { accessToken } = res.data;
            onTokenReceived(accessToken);
          })
          .catch((err) => {
            console.error("Google login backend failed", err);
          });
      }
    }
  }, [response]);

  return (
    <TouchableOpacity
      disabled={!request}
      onPress={() => promptAsync()}
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
