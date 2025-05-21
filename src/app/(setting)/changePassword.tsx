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
import { getUserByIdAPI, changePasswordAPI} from "@/utils/api";
import Toast from "react-native-toast-message";
import AsyncStorage from "@react-native-async-storage/async-storage";

const { height: screenHeight, width: screenWidth } = Dimensions.get("window");
const modalHeight = screenHeight * 0.9;
const icon = require("@/assets/auth/Icon/change.png");

const ChangePassword = () => {
  const slideAnim = useRef(new Animated.Value(screenWidth)).current;
  const router = useRouter();
  const [oldpassword, setOldpassword] = useState("");
  const [newpassword, setNewpassword] = useState("");
  const [userId, setUserId] = useState<string | null>(null);

  useEffect(() => {
    const fetchUserId = async () => {
      try {
        const id = await AsyncStorage.getItem("userId");
        if (!id) {
          Toast.show({ type: "error", text1: "User ID not found" });
          return;
        }
        setUserId(id);
      } catch (err) {
        console.error("Error fetching user ID:", err);
        Toast.show({ type: "error", text1: "Failed to load user data" });
      }
    };

    fetchUserId();

    Animated.timing(slideAnim, {
      toValue: 0,
      duration: 600,
      useNativeDriver: true,
    }).start();
  }, []);

  const isButtonActive = oldpassword.length > 0 && newpassword.length > 0;

  const handleChangePassword = async () => {
    try {
      if (!userId) {
        Toast.show({ type: "error", text1: "User ID not found" });
        return;
      }

      const token = await AsyncStorage.getItem("accessToken");
      if (!token) {
        Toast.show({ type: "error", text1: "Session expired" });
        return;
      }

      try {
        const decodedToken = JSON.parse(atob(token.split(".")[1]));
        if (decodedToken.exp * 1000 < Date.now()) {
          Toast.show({ type: "error", text1: "Session expired" });
          return;
        }
      } catch (err) {
        Toast.show({ type: "error", text1: "Invalid token" });
        return;
      }

      // Validate passwords
      if (!oldpassword || oldpassword.length < 6) {
        Toast.show({ type: "error", text1: "Old password must be at least 6 characters" });
        return;
      }
      if (!newpassword || newpassword.length < 6) {
        Toast.show({ type: "error", text1: "New password must be at least 6 characters" });
        return;
      }
      if (oldpassword === newpassword) {
        Toast.show({ type: "error", text1: "New password must be different from old password" });
        return;
      }

      const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d).{6,}$/;
      if (!passwordRegex.test(newpassword)) {
        Toast.show({
          type: "error",
          text1: "New password must include at least one uppercase letter, one lowercase letter, and one number",
        });
        return;
      }

      const userRes = await getUserByIdAPI(userId);
      const user = userRes.data || userRes;

      const payload = {
        oldpassword: oldpassword,
        newpassword: newpassword,
      };

      // await updateUserAPI(userId, payload);
      await changePasswordAPI(payload);
      Toast.show({ type: "success", text1: "Password changed successfully!" });
      router.replace("/account");
    } catch (err) {
      console.error("Update error:", err);
      Toast.show({
        type: "error",
        text1: "Change failed",
      });
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
        <View style={tw`w-full flex-row justify-between px-4 mt-2`}>
          <TouchableOpacity onPress={() => router.back()}>
            <Ionicons name="chevron-back-outline" size={20} color={APP_COLOR.PINK} />
          </TouchableOpacity>
          <TouchableOpacity onPress={handleChangePassword}>
            <Text style={tw`text-[${APP_COLOR.PINK}] text-[14px]`}>Done</Text>
          </TouchableOpacity>
        </View>

        <View style={tw`pt-10 justify-center items-center`}>
          <Image source={icon} />
          <Text style={tw`pt-3 text-white text-[27px] font-bold`}>Change Password</Text>
          <Text style={tw`pt-5 text-white px-12 text-center text-[17px]`}>
            To change your password, enter the current one followed by the new one.
          </Text>
        </View>

        <View style={tw`w-[80%] pt-10 justify-center items-center`}>
          <TextInput
            placeholder="Old Password"
            secureTextEntry
            style={tw`w-full h-[50px] text-[17px] bg-white/20 rounded-lg px-4 mb-4 text-white`}
            placeholderTextColor={APP_COLOR.WHITE40}
            value={oldpassword}
            onChangeText={setOldpassword}
          />
          <TextInput
            placeholder="New Password"
            secureTextEntry
            style={tw`w-full h-[50px] text-[17px] bg-white/20 rounded-lg px-4 mb-4 text-white`}
            placeholderTextColor={APP_COLOR.WHITE40}
            value={newpassword}
            onChangeText={setNewpassword}
          />
        </View>

        <View style={tw`w-[80%] pt-10`}>
          <TouchableOpacity
            onPress={handleChangePassword}
            disabled={!isButtonActive}
            style={tw`p-2 rounded-lg items-center justify-center ${
              isButtonActive ? `bg-[${APP_COLOR.PINK}]` : `bg-[${APP_COLOR.WHITE40}]`
            }`}
          >
            <Text
              style={tw`p-1 text-[17px] font-roboto font-bold ${
                isButtonActive ? `text-white` : `text-black/60`
              }`}
            >
              Change Password
            </Text>
          </TouchableOpacity>
        </View>
      </Animated.View>
    </SafeAreaView>
  );
};

export default ChangePassword;