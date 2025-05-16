import React, { useEffect, useRef, useState } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  Dimensions,
  Animated,
} from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import { SafeAreaView } from "react-native-safe-area-context";
import { APP_COLOR } from "@/utils/constant";
import tw from "twrnc";
import { useRouter, useLocalSearchParams } from "expo-router";
import Toast from "react-native-toast-message";
import { confirmVerificationAPI } from "@/utils/api";

const { height: screenHeight } = Dimensions.get("window");
const modalHeight = screenHeight * 0.9;

const OtpVerify = () => {
  const slideAnim = useRef(new Animated.Value(modalHeight)).current;
  const [otp, setOtp] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();
  const { email: rawEmail, type: rawType } = useLocalSearchParams();
  const email = Array.isArray(rawEmail) ? rawEmail[0] : rawEmail || "";
  const type = Array.isArray(rawType) ? rawType[0] : rawType || "";
  const isSubmitting = useRef(false);

  useEffect(() => {
    Animated.timing(slideAnim, {
      toValue: 0,
      duration: 600,
      useNativeDriver: true,
    }).start();
  }, []);

  const handleVerifyOtp = async () => {
    if (isLoading || isSubmitting.current) return;
    if (!otp) {
      Toast.show({
        type: "error",
        text1: "Error",
        text2: "Please enter the OTP!",
      });
      return;
    }
    setIsLoading(true);
    isSubmitting.current = true;
    try {
      const res = await confirmVerificationAPI({ email, otp, type });
      Toast.show({
        type: "success",
        text1: "Success",
        text2: res.message || "Registration successful!",
      });
      setTimeout(() => {
        if (type === "forgot-password") {
          router.replace({
            pathname: "/(auth)/newpassword",
            params: { email },
          });
        } else {
          router.replace("/(auth)/signin");
        }
      }, 1000);
    } catch (error: any) {
      let errorMessage = "OTP verification failed. Please try again.";
      if (error?.response?.data?.message) {
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
          <Text style={tw`text-3xl font-bold text-[${APP_COLOR.TEXT_PURPLE}] mb-4 mt-20`}>
            Enter OTP
          </Text>
          <Text style={tw`text-sm mb-6 text-center text-[${APP_COLOR.TEXT_PURPLE}]`}>
            We have sent an OTP to your email. Please enter it below.
          </Text>
          <TextInput
            placeholder="Enter OTP"
            style={tw`w-[80%] h-[50px] bg-white rounded-lg my-10 px-4 text-center text-lg`}
            placeholderTextColor={"#66339980"}
            value={otp}
            onChangeText={setOtp}
            keyboardType="number-pad"
            editable={!isLoading}
            maxLength={6}
          />
          <TouchableOpacity
            onPress={handleVerifyOtp}
            disabled={isLoading || otp.length === 0}
            style={tw`w-[80%] h-[50px] rounded-lg items-center justify-center ${
              otp.length > 0 && !isLoading
                ? `bg-[${APP_COLOR.PURPLE}]`
                : `bg-[${APP_COLOR.LIGHT_PURPLE}]`
            }`}
          >
            <Text style={tw`text-white text-lg font-bold`}>
              {isLoading ? "Verifying..." : "Verify OTP"}
            </Text>
          </TouchableOpacity>
        </Animated.View>
      </LinearGradient>
    </SafeAreaView>
  );
};

export default OtpVerify;