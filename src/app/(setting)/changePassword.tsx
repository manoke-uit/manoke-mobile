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
import Toast from "react-native-toast-message";
import { getAccountAPI, changePasswordAPI } from "@/utils/api";

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
    Animated.timing(slideAnim, {
      toValue: 0,
      duration: 600,
      useNativeDriver: true,
    }).start();

    const fetchUserId = async () => {
      try {
        const res = await getAccountAPI();
        setUserId(res.userId);
      } catch (error) {
        Toast.show({
          type: "error",
          text1: "Error",
          text2: "Cannot fetch profile!",
        });
      }
    };
    fetchUserId();
  }, []);

  const isButtonActive = oldpassword.length > 0 && newpassword.length > 0;

  const handleChangePassword = async () => {
    if (!userId) {
      Toast.show({
        type: "error",
        text1: "Error",
        text2: "User ID not found",
      });
      return;
    }

    try {
      await changePasswordAPI(userId, newpassword);
      Toast.show({
        type: "success",
        text1: "Password changed successfully!",
      });
      router.back();
    } catch (error) {
      Toast.show({
        type: "error",
        text1: "Change Failed",
        text2: "Something went wrong!",
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
          <Image source={icon} />
          <Text className="pt-3 text-white text-[27px] font-bold">
            Change Password
          </Text>
          <Text className="pt-5 text-white px-12 text-center text-[17px]">
            To change your password, enter the current one followed by the new
            one.
          </Text>
        </View>

        <View className="w-[80%] pt-10 justify-center items-center">
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

        <View className="w-[80%] pt-10">
          <TouchableOpacity
            onPress={handleChangePassword}
            disabled={!isButtonActive}
            style={tw`p-2 rounded-lg items-center justify-center ${
              isButtonActive
                ? `bg-[${APP_COLOR.PINK}]`
                : `bg-[${APP_COLOR.WHITE40}]`
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
