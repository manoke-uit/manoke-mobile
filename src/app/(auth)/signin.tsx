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
import { useRouter } from "expo-router";
import tw from "twrnc";
import { loginAPI, getAccountAPI, printAsyncStorage } from "@/utils/api";
import Toast from "react-native-toast-message";
import AsyncStorage from "@react-native-async-storage/async-storage";
import GoogleLoginButton from "./loginGoogle";
import { Ionicons } from "@expo/vector-icons";
const { height: screenHeight } = Dimensions.get("window");
const modalHeight = screenHeight * 0.9;
const avatar = require("@/assets/auth/Icon/avatar.png");

const SignIn = () => {
  const slideAnim = useRef(new Animated.Value(modalHeight)).current;
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const router = useRouter();
  const [showPassword, setShowPassword] = useState(false);
  useEffect(() => {
    Animated.timing(slideAnim, {
      toValue: 0,
      duration: 600,
      useNativeDriver: true,
    }).start();
  }, []);

  const isButtonActive = email.length > 0 && password.length > 0;

  const handleSignIn = async () => {
    try {
      const res = await loginAPI(email, password);
      if (res?.accessToken) {
        await AsyncStorage.setItem("accessToken", res.accessToken);
        const profile = await getAccountAPI();
        if (profile?.userId) {
          await AsyncStorage.setItem("userId", profile.userId);
          await AsyncStorage.setItem("userProfile", JSON.stringify(profile));
        }
      }
      const storedToken = await AsyncStorage.getItem("accessToken");
      const storedProfile = await AsyncStorage.getItem("userProfile");
      if (storedToken && storedProfile) {
        printAsyncStorage();
        Toast.show({
          type: "success",
          text1: "Success",
          text2: "Successfully logged in!",
        });
        setTimeout(() => {
          router.replace("/(tabs)/home");
        }, 1000);
      } else {
        throw new Error(
          "Cannot get accessToken or userProfile from AsyncStorage"
        );
      }
    } catch (error) {
      // console.error("Login error: ", error);
      Toast.show({
        type: "error",
        text1: "Error",
        text2: "Login failed!",
      });
    }
  };
  const handleGoogleLogin = async (token: string) => {
    try {
      await AsyncStorage.setItem("accessToken", token);
      const profile = await getAccountAPI();
      if (profile?.userId) {
        await AsyncStorage.setItem("userId", profile.userId);
        await AsyncStorage.setItem("userProfile", JSON.stringify(profile));
        Toast.show({
          type: "success",
          text1: "Success",
          text2: "Google login successful!",
        });
        router.replace("/(tabs)/home");
      } else {
        throw new Error("Profile fetch failed");
      }
    } catch (error) {
      // console.error("Google Login Error:", error);
      Toast.show({
        type: "error",
        text1: "Error",
        text2: "Google login failed!",
      });
    }
  };

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
              Login
            </Text>
            <Text
              style={tw`text-sm text-center mt-2 px-10 text-[${APP_COLOR.TEXT_PURPLE}]`}
            >
              Enter your email and password you used when you created your
              account to log in.
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
              placeholder="Password"
              secureTextEntry={!showPassword}
              style={tw`w-[85%] h-[50px] bg-white rounded-lg px-4 mb-4 colors-[${APP_COLOR.TEXT_PURPLE}] relative`}
              placeholderTextColor={"#66339980"}
              value={password}
              onChangeText={setPassword}
            />
            <TouchableOpacity
              onPress={() => setShowPassword(!showPassword)}
              className="absolute right-12 bottom-16"
            >
              <Ionicons
                name={showPassword ? "eye" : "eye-off"}
                size={20}
                color="#663399"
              />
            </TouchableOpacity>
            <TouchableOpacity
              onPress={() => router.push("/(auth)/forgotpassword")}
            >
              <Text
                style={tw`text-sm text-center mt-2 text-[${APP_COLOR.TEXT_PURPLE}]`}
              >
                Forgot Password?
              </Text>
            </TouchableOpacity>
          </View>
          <View style={tw`w-full items-center mt-10`}>
            <TouchableOpacity
              style={tw`w-[80%] h-[50px] rounded-lg items-center justify-center ${
                isButtonActive
                  ? `bg-[${APP_COLOR.PURPLE}]`
                  : `bg-[${APP_COLOR.LIGHT_PURPLE}]`
              }`}
              onPress={handleSignIn}
            >
              <Text style={tw`text-white text-lg font-roboto font-bold`}>
                Sign In
              </Text>
            </TouchableOpacity>

            <TouchableOpacity onPress={() => router.push("/(auth)/signup")}>
              <Text
                style={tw`text-sm text-center mt-2 mb-6 text-[${APP_COLOR.TEXT_PURPLE}]`}
              >
                Don't have an account?
              </Text>
            </TouchableOpacity>

            <View style={tw`w-[80%] max-w-[400px]`}>
              <GoogleLoginButton onTokenReceived={handleGoogleLogin} />
            </View>
          </View>
        </Animated.View>
      </LinearGradient>
    </SafeAreaView>
  );
};

export default SignIn;
