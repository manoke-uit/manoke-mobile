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
import { Ionicons } from "@expo/vector-icons";
import { getAccountAPI } from "@/utils/api"; // 👈 Import API get profile
import Toast from "react-native-toast-message";

const { height: screenHeight, width: screenWidth } = Dimensions.get("window");
const modalHeight = screenHeight * 0.9;
const avatarDefault = require("@/assets/auth/Image/avt.png");

const AccountPage = () => {
  const slideAnim = useRef(new Animated.Value(screenWidth)).current;
  const router = useRouter();

  const [userInfo, setUserInfo] = useState<{ email: string } | null>(null);

  useEffect(() => {
    Animated.timing(slideAnim, {
      toValue: 0,
      duration: 600,
      useNativeDriver: true,
    }).start();
  }, []);

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const res = await getAccountAPI();
        setUserInfo(res);
      } catch (error) {
        console.log("Error loading user info:", error);
        Toast.show({
          type: "error",
          text1: "Error",
          text2: "Failed to load profile!",
        });
      }
    };
    fetchUser();
  }, []);

  return (
    <SafeAreaView style={tw`flex-1 bg-[${APP_COLOR.BLACK}]`}>
      <Animated.View
        style={[
          {
            position: "absolute",
            width: "100%",
            height: modalHeight,
            backgroundColor: APP_COLOR.GREY_BG,
            transform: [{ translateX: slideAnim }],
            left: 0,
            bottom: 0,
          },
          tw`rounded-t-2xl items-center justify-start`,
        ]}
      >
        <View className="w-full flex-row justify-between px-4 mt-2">
          <TouchableOpacity onPress={() => router.back()}>
            <Ionicons
              name="chevron-back-outline"
              size={20}
              color={APP_COLOR.PINK}
            />
          </TouchableOpacity>

          <TouchableOpacity onPress={() => router.replace("/home")}>
            <Text style={tw`text-[${APP_COLOR.PINK}] text-[14px]`}>Done</Text>
          </TouchableOpacity>
        </View>

        <View className="pt-10 justify-center items-center">
          <Image source={avatarDefault} />
          <Text className="pt-5 text-white text-[20px]">
            {userInfo?.email?.split("@")[0] || "Loading..."}
          </Text>
        </View>

        <View className="pt-10 w-[90%] rounded-xl overflow-hidden">
          <TouchableOpacity
            onPress={() => router.push("/(setting)/changeProfile")}
            style={tw`rounded-t-xl bg-[${APP_COLOR.GREY_BT}] pl-8 pr-2 py-3 flex-row justify-between items-center`}
          >
            <Text className="text-white text-[17px]">Change Profile Image</Text>
            <Ionicons name="chevron-forward-outline" size={24} color="white" />
          </TouchableOpacity>

          <TouchableOpacity
            onPress={() => router.push("/(setting)/changeUsername")}
            style={tw`bg-[${APP_COLOR.GREY_BT}] pl-8 pr-2 py-3 flex-row justify-between items-center`}
          >
            <Text className="text-white text-[17px]">Change Username</Text>
            <Ionicons name="chevron-forward-outline" size={24} color="white" />
          </TouchableOpacity>

          <TouchableOpacity
            onPress={() => router.push("/(setting)/changePassword")}
            style={tw`bg-[${APP_COLOR.GREY_BT}] pl-8 pr-2 py-3 flex-row justify-between items-center`}
          >
            <Text className="text-white text-[17px]">Change Password</Text>
            <Ionicons name="chevron-forward-outline" size={24} color="white" />
          </TouchableOpacity>
        </View>
      </Animated.View>
    </SafeAreaView>
  );
};

export default AccountPage;
