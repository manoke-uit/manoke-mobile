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
import { loginAPI } from "@/utils/api";
import Toast from "react-native-toast-message";
const { height: screenHeight, width: screenWidth } = Dimensions.get("window");
const modalHeight = screenHeight * 0.9;
const avatar = require("@/assets/auth/Image/avt.png");

const SettingAccount = () => {
  const slideAnim = useRef(new Animated.Value(-modalHeight)).current;
  const router = useRouter();

  useEffect(() => {
    Animated.timing(slideAnim, {
      toValue: 0,
      duration: 600,
      useNativeDriver: true,
    }).start();
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
              bottom: slideAnim,
              left: 0,
            },
            tw`rounded-t-2xl items-center justify-start`,
          ]}
        >
            <View className="w-full flex-row justify-between px-4 mt-2">
                <TouchableOpacity>
                    <Ionicons name="chevron-back-outline" size={20} color={APP_COLOR.PINK} />
                </TouchableOpacity>

                <TouchableOpacity>
                    <Text style={tw`text-[${APP_COLOR.PINK}] text-[14px]`}>Done</Text>
                </TouchableOpacity>
            </View>

            <View className="pt-10 justify-center items-center">
                <Image source={avatar} />
                <Text className="pt-5 text-white text-[20px]">admin</Text>
            </View>

            <View className="pt-10 w-[90%] rounded-[10px]">
                    <TouchableOpacity
                        style={tw`bg-[${APP_COLOR.GREY_BT}] pl-8 pr-2 py-3 flex-row justify-between items-center `}
                    >
                        <Text className="text-white text-[17px]">Change Profile Image</Text>
                        <Ionicons name="chevron-forward-outline" size={24} color="white" />
                    </TouchableOpacity>
                    <TouchableOpacity
                        style={tw`bg-[${APP_COLOR.GREY_BT}] pl-8 pr-2 py-3 flex-row justify-between items-center `}
                    >
                        <Text className="text-white text-[17px]">Change Username</Text>
                        <Ionicons name="chevron-forward-outline" size={24} color="white" />
                    </TouchableOpacity>
                    <TouchableOpacity
                        style={tw`bg-[${APP_COLOR.GREY_BT}] pl-8 pr-2 py-3 flex-row justify-between items-center `}
                    >
                        <Text className="text-white text-[17px]">Change Password</Text>
                        <Ionicons name="chevron-forward-outline" size={24} color="white" />
                    </TouchableOpacity>
            </View>
          
        </Animated.View>
    </SafeAreaView>
  );
};

export default SettingAccount;
