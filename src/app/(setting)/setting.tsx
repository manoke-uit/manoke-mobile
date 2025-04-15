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
const avatar = require("@/assets/auth/Icon/avatar.png");

const SettingTab = () => {
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
            <View className="w-full flex-row justify-end px-4 mt-2">
                <TouchableOpacity onPress={() => router.replace('/home')}>
                    <Text style={tw`text-[${APP_COLOR.PINK}] text-[14px]`}>
                        Done
                    </Text>
                </TouchableOpacity>
            </View>
            <View className="flex-1 items-center pt-20 w-[90%]">
                <LinearGradient
                    colors={[APP_COLOR.PINK, APP_COLOR.PURPLE]}
                    style={tw`w-full h-[150px] justify-center items-center rounded-[10px]`}
                    start={{ x: 0, y: 0 }}
                    end={{ x: 1, y: 1 }}
                >
                    <Text className="flex text-white font-bold text-2xl absolute left-5 top-5">
                        Sing without limits
                    </Text>
                    <Text className="flex text-white pt-5 mx-5 text-[18px]">
                        Subscribes to unlock full versions of the songs and premium features!
                    </Text> 
                </LinearGradient>
                <View className="pt-10 w-full">
                    <TouchableOpacity
                        onPress={() => router.push('/(setting)/account')}
                        style={tw`bg-[${APP_COLOR.GREY_BT}] rounded-[5px] p-3 flex-row justify-between items-center`}
                    >
                        <Ionicons name="person-outline" size={24} color="white" />
                        <Text className="text-white text-[17px] mr-[100px]">Account</Text>
                        <View style={tw`flex-row justify-between items-center`}>
                            <Text 
                                className="text-[15px] p-1"
                                style={{ color: 'rgba(255, 255, 255, 0.7)' }}
                            >admin</Text>
                            <Ionicons name="chevron-forward-outline" size={24} color="white" />
                        </View>
                    </TouchableOpacity>
                </View>
            </View>
            <View className="mb-10 w-[90%] text-center">
                    <TouchableOpacity
                        style={tw`bg-[${APP_COLOR.GREY_BT}] rounded-[10px] p-4 justify-between items-center`}
                    >
                        <Text style={tw`text-[${APP_COLOR.RED}] font-bold text-[17px]`}>Log Out</Text>

                    </TouchableOpacity>
            </View>

          
        </Animated.View>
    </SafeAreaView>
  );
};

export default SettingTab;