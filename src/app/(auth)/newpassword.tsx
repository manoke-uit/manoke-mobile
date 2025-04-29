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
import { useRouter } from "expo-router";

const { height: screenHeight, width: screenWidth } = Dimensions.get("window");
const modalHeight = screenHeight * 0.9;
const avatar = require("@/assets/auth/Icon/avatar.png");

const NewPassword = () => {
  const slideAnim = useRef(new Animated.Value(-modalHeight)).current;
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const router = useRouter();

  useEffect(() => {
    Animated.timing(slideAnim, {
      toValue: 0,
      duration: 600,
      useNativeDriver: true,
    }).start();
  }, []);

  const isButtonActive = password.length && confirmPassword.length > 0;

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
              width: "100%",
              height: modalHeight,
              backgroundColor: "#F3F2F8",
              bottom: slideAnim,
              left: 0,
            },
            tw`rounded-t-3xl items-center justify-start`,
          ]}
        >
          <View style={tw`w-full items-center mt-10`}>
            <Image source={avatar} style={tw`mt-5 mb-5`} />
            <Text
              style={tw`font-roboto text-2xl font-bold text-center text-[${APP_COLOR.TEXT_PURPLE}]`}
            >
              New Password
            </Text>
            <Text
              style={tw`text-sm text-center mt-2 px-10 text-[${APP_COLOR.TEXT_PURPLE}]`}
            >
              Enter your new password.
            </Text>
          </View>

          <View style={tw`w-full items-center mt-10`}>
            <TextInput
              placeholder="Password"
              secureTextEntry={true}
              style={tw`w-[85%] h-[50px] bg-white rounded-lg px-4 mb-4 colors-[${APP_COLOR.TEXT_PURPLE}]`}
              placeholderTextColor={"#66339980"}
              value={password}
              onChangeText={setPassword}
            />

            <TextInput
              placeholder="Confirm password"
              secureTextEntry={true}
              style={tw`w-[85%] h-[50px] bg-white rounded-lg px-4 mb-4 colors-[${APP_COLOR.TEXT_PURPLE}]`}
              placeholderTextColor={"#66339980"}
              value={confirmPassword}
              onChangeText={setConfirmPassword}
            />
          </View>

          <View style={tw`w-full items-center mt-5`}>
            <TouchableOpacity
              onPress={() => router.push("./start")} // chưa viết hàm xử lý tạo tk
              style={tw`w-[80%] h-[50px] rounded-lg items-center justify-center ${
                isButtonActive
                  ? `bg-[${APP_COLOR.PURPLE}]`
                  : `bg-[${APP_COLOR.LIGHT_PURPLE}]`
              }`}
            >
              <Text style={tw`text-white text-lg font-roboto font-bold`}>
                Confirm
              </Text>
            </TouchableOpacity>
          </View>
        </Animated.View>
      </LinearGradient>
    </SafeAreaView>
  );
};

export default NewPassword;
