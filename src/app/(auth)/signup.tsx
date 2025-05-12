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
import { registerAPI, confirmEmailAPI } from "@/utils/api";

const { height: screenHeight } = Dimensions.get("window");
const modalHeight = screenHeight * 0.9;
const avatar = require("@/assets/auth/Icon/avatar.png");

const SignUp = () => {
  const slideAnim = useRef(new Animated.Value(modalHeight)).current;
  const [email, setEmail] = useState("");
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [countdown, setCountdown] = useState(0);
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

  useEffect(() => {
    const confirmEmail = async () => {
      if (token && typeof token === "string") {
        try {
          const response = await confirmEmailAPI(token);
          Toast.show({
            type: "success",
            text1: "Success",
            text2: response.message || "Email confirmed successfully!",
          });
          router.replace("/(auth)/signin");
        } catch (error: any) {
          console.error("Email confirmation error:", {
            message: error.message,
            response: error.response?.data,
            status: error.response?.status,
          });
          Toast.show({
            type: "error",
            text1: "Error",
            text2:
              error.response?.data?.message ||
              "Failed to confirm email. Please try again.",
          });
        }
      }
    };
    confirmEmail();
  }, [token, router]);

  const handleSignUp = async () => {
    if (isLoading || countdown > 0 || isSubmitting.current) return;

    if (password !== confirmPassword) {
      Toast.show({
        type: "error",
        text1: "Error",
        text2: "Passwords do not match!",
      });
      return;
    }

    if (!email || !username || !password || !confirmPassword) {
      Toast.show({
        type: "error",
        text1: "Error",
        text2: "Please fill in all fields!",
      });
      return;
    }

    isSubmitting.current = true;
    setIsLoading(true);

    try {
      const payload = { email, password, displayName: username };
      console.log("Sending payload:", JSON.stringify(payload));
      const response = await registerAPI(email, password, username);
      if (response && response.message) {
        Toast.show({
          type: "success",
          text1: "Success",
          text2: "Please check your email to confirm your account.",
        });
        setCountdown(3);
      } else {
        throw new Error("Failed to send confirmation email.");
      }
    } catch (error: any) {
      console.error("Signup error details:", {
        message: error.message,
        status: error.response?.status,
        data: error.response?.data,
        headers: error.response?.headers,
      });
      let errorMessage = "An error occurred. Please try again later.";
      if (error.response?.status === 403) {
        errorMessage =
          error.response?.data?.message ||
          "Signup failed: Email may already be registered or request is forbidden.";
      } else if (error.response?.data?.message) {
        errorMessage = error.response.data.message;
      }
      Toast.show({
        type: "error",
        text1: "Error",
        text2: errorMessage,
      });
    } finally {
      setIsLoading(false);
      isSubmitting.current = false;
    }
  };

  const isButtonActive =
    email.length > 0 &&
    username.length > 0 &&
    password.length > 0 &&
    confirmPassword.length > 0 &&
    password === confirmPassword &&
    countdown === 0 &&
    !isLoading;

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
              Register
            </Text>
          </View>

          <View style={tw`w-full items-center mt-10`}>
            <TextInput
              placeholder="Email"
              style={tw`w-[85%] h-[50px] bg-white rounded-lg px-4 mb-4 colors-[${APP_COLOR.TEXT_PURPLE}]`}
              placeholderTextColor={"#66339980"}
              value={email}
              onChangeText={setEmail}
            />
            <TextInput
              placeholder="Username"
              style={tw`w-[85%] h-[50px] bg-white rounded-lg px-4 mb-4 colors-[${APP_COLOR.TEXT_PURPLE}]`}
              placeholderTextColor={"#66339980"}
              value={username}
              onChangeText={setUsername}
            />
            <TextInput
              placeholder="Password"
              secureTextEntry={true}
              style={tw`w-[85%] h-[50px] bg-white rounded-lg px-4 mb-4 colors-[${APP_COLOR.TEXT_PURPLE}]`}
              placeholderTextColor={"#66339980"}
              value={password}
              onChangeText={setPassword}
            />
            <TextInput
              placeholder="Confirm Password"
              secureTextEntry={true}
              style={tw`w-[85%] h-[50px] bg-white rounded-lg px-4 mb-4 colors-[${APP_COLOR.TEXT_PURPLE}]`}
              placeholderTextColor={"#66339980"}
              value={confirmPassword}
              onChangeText={setConfirmPassword}
            />
          </View>

          <View style={tw`w-full items-center mt-5`}>
            <TouchableOpacity
              onPress={handleSignUp}
              disabled={!isButtonActive}
              style={tw`w-[80%] h-[50px] rounded-lg items-center justify-center ${
                isButtonActive
                  ? `bg-[${APP_COLOR.PURPLE}]`
                  : `bg-[${APP_COLOR.LIGHT_PURPLE}]`
              }`}
            >
              <Text style={tw`text-white text-lg font-roboto font-bold`}>
                {isLoading
                  ? "Sending..."
                  : countdown > 0
                  ? `Resend after ${countdown}s`
                  : "Send Email"}
              </Text>
            </TouchableOpacity>
            <TouchableOpacity onPress={() => router.push("/(auth)/signin")}>
              <Text
                style={tw`text-sm text-center mt-3 text-[${APP_COLOR.TEXT_PURPLE}]`}
              >
                Already have an account?
              </Text>
            </TouchableOpacity>
          </View>
        </Animated.View>
      </LinearGradient>
    </SafeAreaView>
  );
};

export default SignUp;