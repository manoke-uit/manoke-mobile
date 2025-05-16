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
import { registerAPI } from "@/utils/api";

const { height: screenHeight } = Dimensions.get("window");
const modalHeight = screenHeight * 0.9;
const avatar = require("@/assets/auth/Icon/avatar.png");

const SignUp = () => {
  const slideAnim = useRef(new Animated.Value(modalHeight)).current;
  const [email, setEmail] = useState("");
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
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

  const handleSignUp = async () => {
    if (isLoading || isSubmitting.current) return;

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
        text2: "Please fill in all fields.",
      });
      return;
    }

    isSubmitting.current = true;
    setIsLoading(true);

    try {
      const payload = { email, password, displayName: username };
      const response = await registerAPI(email, password, username);

      if (response?.message && response.message.toLowerCase().includes('exist')) {
        throw { response: { status: 500, data: { message: response.message } } };
      }

      Toast.show({
        type: "success",
        text1: "Success",
        text2: "Please check your email for the OTP.",
      });
      router.push({
        pathname: "/(auth)/otpverify",
        params: { email, type: "signup" },
      });
    } catch (error: any) {
      console.error("Error detail", {
        message: error.message,
        status: error.response?.status,
        data: error.response?.data,
        headers: error.response?.headers,
      });
      let errorMessage = "Email already exists. Please try again.";
      if (error.response?.status === 500) {
        Toast.show({
          type: "error",
          text1: "Error",
          text2: errorMessage,
        });
      } else if (error.response?.status === 403) {
        errorMessage =
          error.response?.data?.message ||
          "Registration failed. Please try again.";
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
                {isLoading ? "Sending..." : "Send OTP"}
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