import React, { useEffect, useRef, useState } from "react";
import {
  View,
  Animated,
  Dimensions,
  Image,
  Text,
  TextInput,
  TouchableOpacity,
} from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import { SafeAreaView } from "react-native-safe-area-context";
import { APP_COLOR } from "@/utils/constant";
import tw from "twrnc";
import { useRouter, useLocalSearchParams } from "expo-router";
import Toast from "react-native-toast-message";
import { resetPasswordAPI } from "@/utils/api";

const { height: screenHeight } = Dimensions.get("window");
const modalHeight = screenHeight * 0.9;
const avatar = require("@/assets/auth/Icon/avatar.png");

const NewPassword = () => {
  const slideAnim = useRef(new Animated.Value(modalHeight)).current;
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();
  const { token } = useLocalSearchParams();
  const isSubmitting = useRef(false);

  useEffect(() => {
    Animated.timing(slideAnim, {
      toValue: 0,
      duration: 600,
      useNativeDriver: true,
    }).start();
  }, []);

  const handleResetPassword = async () => {
    if (isLoading || isSubmitting.current) return;

    if (!password || !confirmPassword) {
      Toast.show({
        type: "error",
        text1: "error",
        text2: "Please fill in all fields!",
      });
      return;
    }

    if (password !== confirmPassword) {
      Toast.show({
        type: "error",
        text1: "error",
        text2: "Passwords do not match!",
      });
      return;
    }

    if (!token || typeof token !== "string") {
      Toast.show({
        type: "error",
        text1: "error",
        text2: "Token does not exist or is invalid!",
      });
      return;
    }

    isSubmitting.current = true;
    setIsLoading(true);

    try {
      const response = await resetPasswordAPI(token, password, confirmPassword);
      if (response && response.message) {
        Toast.show({
          type: "success",
          text1: "success",
          text2: "Password reset successfully. Please log in again.",
        });
        router.replace("/(auth)/signin");
      } else {
        throw new Error("No response message from server.");
      }
    } catch (error: any) {
      // console.error("Error detail ", {
      //   message: error.message,
      //   status: error.response?.status,
      //   data: error.response?.data,
      // });
      let errorMessage = "Error occurred. Please try again.";
      if (error.response?.status === 400) {
        errorMessage = "Token is invalid or has expired.";
      } else if (error.response?.status === 500) {
        errorMessage = "Error occurred on the server. Please try again later.";
      } else if (error.response?.data?.message) {
        errorMessage = error.response.data.message;
      }
      Toast.show({
        type: "error",
        text1: "error",
        text2: errorMessage,
      });
    } finally {
      setIsLoading(false);
      isSubmitting.current = false;
    }
  };

  const isButtonActive = password.length > 0 && confirmPassword.length > 0 && !isLoading;

  return (
    <SafeAreaView style={tw`flex-1`}>
      <LinearGradient
        colors={[APP_COLOR.DARK_PURPLE, APP_COLOR.BLACK, APP_COLOR.DARK_PURPLE]}
        style={tw`flex-1`}
        start={{ x: 0, y: 0 }}
        end={{ x: 0, y: 1 }}
        locations={[0, 0.5, 1]}
      >
        <Animated.View
          style={[
            {
              position: "absolute",
              bottom: 0,
              width: "100%",
              height: modalHeight,
              backgroundColor: "#F3F2F8",
              transform: [{ translateY: slideAnim }],
            },
            tw`rounded-t-3xl items-center justify-start`,
          ]}
        >
          <View style={tw`w-full items-center mt-10`}>
            <Image source={avatar} style={tw`mt-5 mb-5`} />
            <Text
              style={tw`font-roboto text-2xl font-bold text-center text-[${APP_COLOR.TEXT_PURPLE}]`}
            >
              New Password
            </Text>
            <Text
              style={tw`text-sm text-center mt-2 px-10 text-[${APP_COLOR.TEXT_PURPLE}]`}
            >
              Enter your new password.
            </Text>
          </View>

          <View style={tw`w-full items-center mt-10`}>
            <TextInput
              placeholder="Password"
              secureTextEntry={true}
              style={tw`w-[85%] h-[50px] bg-white rounded-lg px-4 mb-4 colors-[${APP_COLOR.TEXT_PURPLE}]`}
              placeholderTextColor={"#66339980"}
              value={password}
              onChangeText={setPassword}
              editable={!isLoading}
            />
            <TextInput
              placeholder="Confirm password"
              secureTextEntry={true}
              style={tw`w-[85%] h-[50px] bg-white rounded-lg px-4 mb-4 colors-[${APP_COLOR.TEXT_PURPLE}]`}
              placeholderTextColor={"#66339980"}
              value={confirmPassword}
              onChangeText={setConfirmPassword}
              editable={!isLoading}
            />
          </View>

          <View style={tw`w-full items-center mt-5`}>
            <TouchableOpacity
              onPress={handleResetPassword}
              disabled={!isButtonActive}
              style={tw`w-[80%] h-[50px] rounded-lg items-center justify-center ${
                isButtonActive
                  ? `bg-[${APP_COLOR.PURPLE}]`
                  : `bg-[${APP_COLOR.LIGHT_PURPLE}]`
              }`}
            >
              <Text style={tw`text-white text-lg font-roboto font-bold`}>
                {isLoading ? "Processing..." : "Confirm"}
              </Text>
            </TouchableOpacity>
          </View>
        </Animated.View>
      </LinearGradient>
    </SafeAreaView>
  );
};

export default NewPassword;