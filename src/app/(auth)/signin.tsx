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
import { loginAPI, printAsyncStorage } from "@/utils/api";
import Toast from "react-native-toast-message";
import AsyncStorage from "@react-native-async-storage/async-storage";

const { height: screenHeight } = Dimensions.get("window");
const modalHeight = screenHeight * 0.9;
const avatar = require("@/assets/auth/Icon/avatar.png");

const SignIn = () => {
  const slideAnim = useRef(new Animated.Value(modalHeight)).current;
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const router = useRouter();

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
      const response = await loginAPI(email, password);
      if (response && response.accessToken) {
        await AsyncStorage.setItem("accessToken", response.accessToken);
        const storedToken = await AsyncStorage.getItem("accessToken");
        if (storedToken) {
          console.log("Token stored successfully:", storedToken);
          Toast.show({
            type: "success",
            text1: "success",
            text2: "Logged in successfully!",
          });
          setTimeout(() => {
            router.replace("/(tabs)/home");
          }, 1000);
        } else {
          throw new Error("Failed to store token in AsyncStorage");
        }
      } else {
        Toast.show({
          type: "error",
          text1: "error",
          text2: "Email or password is incorrect!",
        });
      }
    } catch (error) {
      console.error("Login error:", error);
      Toast.show({
        type: "error",
        text1: "error",
        text2: "Failed to login!",
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
              secureTextEntry
              style={tw`w-[85%] h-[50px] bg-white rounded-lg px-4 mb-4 colors-[${APP_COLOR.TEXT_PURPLE}]`}
              placeholderTextColor={"#66339980"}
              value={password}
              onChangeText={setPassword}
            />
            <TouchableOpacity onPress={() => router.push("/forgotpassword")}>
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
                style={tw`text-sm text-center mt-2 text-[${APP_COLOR.TEXT_PURPLE}]`}
              >
                Don't have an account?
              </Text>
            </TouchableOpacity>
          </View>
        </Animated.View>
      </LinearGradient>
    </SafeAreaView>
  );
};

export default SignIn;