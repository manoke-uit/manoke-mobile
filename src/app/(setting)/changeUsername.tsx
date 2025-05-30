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
import { SafeAreaView } from "react-native-safe-area-context";
import { APP_COLOR } from "@/utils/constant";
import { useRouter } from "expo-router";
import tw from "twrnc";
import { Ionicons } from "@expo/vector-icons";
import { getUserByIdAPI, updateUserAPI } from "@/utils/api";
import Toast from "react-native-toast-message";
import AsyncStorage from "@react-native-async-storage/async-storage";

const { height: screenHeight, width: screenWidth } = Dimensions.get("window");
const modalHeight = screenHeight * 0.9;
const icon = require("@/assets/auth/Icon/changeu.png");

const ChangeUsername = () => {
  const slideAnim = useRef(new Animated.Value(screenWidth)).current;
  const router = useRouter();
  const [username, setUsername] = useState("");
  const [displayName, setDisplayName] = useState("");

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const userId = await AsyncStorage.getItem("userId");
        if (!userId) throw new Error("User ID not found");

        const res = await getUserByIdAPI(userId);
        const user = res.data || res;

        setDisplayName(user.displayName || "");
        setUsername(user.displayName || "");
      } catch (err) {
        // console.error("Fetch user failed:", err);
        Toast.show({ type: "error", text1: "Failed to load user" });
      }
    };

    fetchUser();

    Animated.timing(slideAnim, {
      toValue: 0,
      duration: 600,
      useNativeDriver: true,
    }).start();
  }, []);

  const handleChangeUsername = async () => {
    if (!username || username.length < 3 || username.length > 20) {
      Toast.show({ type: "error", text1: "Username must be 3-20 characters" });
      return;
    }

    try {
      const userId = await AsyncStorage.getItem("userId");
      if (!userId) throw new Error("User ID not found");

      const res = await getUserByIdAPI(userId);
      const user = res.data || res;

      await updateUserAPI(userId, user.email, username);
      setDisplayName(username);
      Toast.show({ type: "success", text1: "Username updated" });
      router.replace("/account");
    } catch (err) {
      // console.error("Update error:", err);
      Toast.show({ type: "error", text1: "Update failed" });
    }
  };

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

          <TouchableOpacity onPress={handleChangeUsername}>
            <Text style={tw`text-[${APP_COLOR.PINK}] text-[14px]`}>Done</Text>
          </TouchableOpacity>
        </View>

        <View style={tw`pt-10 justify-center items-center`}>
          <Image source={icon} />
          <Text style={tw`pt-3 text-white text-[27px] font-bold`}>
            Change Username
          </Text>
          <Text
            style={tw`pt-5 text-white px-12 items-center text-center text-[16px]`}
          >
            Enter your new username.
          </Text>
        </View>

        <View style={tw`w-[80%] pt-10 justify-center items-center`}>
          <TextInput
            placeholder="Enter new username"
            style={tw`w-full h-[50px] text-[17px] bg-white/20 rounded-lg px-4 mb-4 text-white`}
            placeholderTextColor={APP_COLOR.WHITE40}
            value={username}
            onChangeText={setUsername}
          />
        </View>
      </Animated.View>
    </SafeAreaView>
  );
};

export default ChangeUsername;
