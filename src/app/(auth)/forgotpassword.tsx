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
import { useRouter } from "expo-router";
import Toast from "react-native-toast-message";
import { forgotPasswordAPI } from "@/utils/api";

const { height: screenHeight } = Dimensions.get("window");
const modalHeight = screenHeight * 0.9;
const avatar = require("@/assets/auth/Icon/avatar.png");

const ForgotPassword = () => {
  const slideAnim = useRef(new Animated.Value(modalHeight)).current;
  const [email, setEmail] = useState("");
  const [countdown, setCountdown] = useState(0);
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();
  const isSubmitting = useRef(false);

  useEffect(() => {
    Animated.timing(slideAnim, {
      toValue: 0,
      duration: 600,
      useNativeDriver: true,
    }).start();
  }, []);

  useEffect(() => {
    let timer: NodeJS.Timeout;
    if (countdown > 0) {
      timer = setInterval(() => {
        setCountdown((prev) => {
          if (prev <= 1) {
            clearInterval(timer);
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    }
    return () => clearInterval(timer);
  }, [countdown]);

  const handleForgotPassword = async () => {
    if (isLoading || countdown > 0 || isSubmitting.current) return;

    if (!email) {
      Toast.show({
        type: "error",
        text1: "error",
        text2: "Please enter your email!",
      });
      return;
    }

    isSubmitting.current = true;
    setIsLoading(true);

    try {
      const response = await forgotPasswordAPI(email);
      if (response && response.message) {
        Toast.show({
          type: "success",
          text1: "success",
          text2: "Plase check your email to reset your password.",
        });
        setCountdown(60);
        router.replace({
          pathname: "/(auth)/otpverify",
          params: { email, type: "forgot-password" },
        });
      } else {
        throw new Error("Failed to send forgot password email.");
      }
    } catch (error: any) {
        // console.error("Error detail ", {
        // message: error.message,
        // status: error.response?.status,
        // data: error.response?.data,
      // });
      // let errorMessage = "Error occurred. Please try again.";
      // if (error.response?.status === 404) {
      //   errorMessage = "Email not found. Please check and try again.";
      // } else if (error.response?.status === 500) {
      //   errorMessage = "Server error. Please try again later.";
      // } else if (error.response?.data?.message) {
      //   errorMessage = error.response.data.message;
      // }
      Toast.show({
        type: "error",
        text1: "error",
      });
    } finally {
      setIsLoading(false);
      isSubmitting.current = false;
    }
  };

  const isButtonActive = email.length > 0 && countdown === 0 && !isLoading;

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
              Forgot Password
            </Text>
            <Text
              style={tw`text-sm text-center mt-2 px-10 text-[${APP_COLOR.TEXT_PURPLE}]`}
            >
              Enter your email to receive a confirm email.
            </Text>
          </View>

          <View style={tw`w-full items-center mt-10`}>
            <TextInput
              placeholder="Email"
              style={tw`w-[85%] h-[50px] bg-white rounded-lg px-4 mb-4 colors-[${APP_COLOR.TEXT_PURPLE}]`}
              placeholderTextColor={"#66339980"}
              value={email}
              onChangeText={setEmail}
              editable={!isLoading}
            />
          </View>

          <View style={tw`w-full items-center mt-5`}>
            <TouchableOpacity
              onPress={handleForgotPassword}
              disabled={!isButtonActive}
              style={tw`w-[80%] h-[50px] rounded-lg items-center justify-center ${
                isButtonActive
                  ? `bg-[${APP_COLOR.PURPLE}]`
                  : `bg-[${APP_COLOR.LIGHT_PURPLE}]`
              }`}
            >
              <Text style={tw`text-white text-lg font-roboto font-bold`}>
                {isLoading ? "Sending..." : countdown > 0 ? `Resend in ${countdown}s` : "Send Email"}
              </Text>
            </TouchableOpacity>
            <TouchableOpacity onPress={() => router.push("./signin")} disabled={isLoading}>
              <Text
                style={tw`text-sm text-center mt-3 text-[${APP_COLOR.TEXT_PURPLE}]`}
              >
                Already Have An Account?
              </Text>
            </TouchableOpacity>
          </View>
        </Animated.View>
      </LinearGradient>
    </SafeAreaView>
  );
};

export default ForgotPassword;