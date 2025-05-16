import React, { useEffect, useRef, useState } from "react";
import {
  View,
  Animated,
  Dimensions,
  Image,
  Text,
  TouchableOpacity,
} from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import { SafeAreaView } from "react-native-safe-area-context";
import { APP_COLOR } from "@/utils/constant";
import { useRouter } from "expo-router";
import tw from "twrnc";
import { Ionicons } from "@expo/vector-icons";
import Toast from "react-native-toast-message";
import * as ImagePicker from "expo-image-picker";
import { uploadAvatar, getAccountAPI } from "@/utils/api";
import AsyncStorage from "@react-native-async-storage/async-storage";

const { height: screenHeight, width: screenWidth } = Dimensions.get("window");
const modalHeight = screenHeight * 0.9;
const icon = require("@/assets/auth/Icon/update.png");

const ChangeProfile = () => {
  const slideAnim = useRef(new Animated.Value(screenWidth)).current;
  const [imageUri, setImageUri] = useState<string | null>(null);
  const [userId, setUserId] = useState<string | null>(null);
  const router = useRouter();

  useEffect(() => {
    Animated.timing(slideAnim, {
      toValue: 0,
      duration: 600,
      useNativeDriver: true,
    }).start();
    fetch("https://egryflripdibifvtttyl.supabase.co")
      .then((res) => console.log("Supabase response:", res.status))
      .catch((err) => console.error("Không kết nối Supabase:", err));
    const getUser = async () => {
      const res = await getAccountAPI();
      setUserId(res?.userId);
    };
    getUser();
  }, []);

  const pickImageFromLibrary = async () => {
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [1, 1],
      quality: 0.5,
    });

    if (!result.canceled) {
      setImageUri(result.assets[0].uri);
      await upload(result.assets[0].uri);
    }
  };

  const takePicture = async () => {
    const { status } = await ImagePicker.requestCameraPermissionsAsync();
    if (status !== "granted") {
      Toast.show({ type: "error", text1: "Permission denied" });
      return;
    }

    const result = await ImagePicker.launchCameraAsync({
      allowsEditing: true,
      aspect: [1, 1],
      quality: 1,
    });

    if (!result.canceled) {
      setImageUri(result.assets[0].uri);
      await upload(result.assets[0].uri);
    }
  };

  const upload = async (uri: string) => {
    if (!userId) {
      Toast.show({ type: "error", text1: "User ID not found" });
      return;
    }

    try {
      const uploadedUrl = await uploadAvatar(uri, userId);
      if (uploadedUrl) {
        Toast.show({ type: "success", text1: "Avatar updated" });
      } else {
        throw new Error("Upload failed");
      }
    } catch (err) {
      Toast.show({ type: "error", text1: "Upload failed" });
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
          <Image
            source={imageUri ? { uri: imageUri } : icon}
            style={tw`w-32 h-32 rounded-full`}
          />
          <Text className="pt-3 text-white text-[27px] font-bold">
            Update Profile Image
          </Text>
          <Text className="pt-5 text-white px-12 items-center text-center text-[16px]">
            Take a new photo or choose a picture from your library to update
            your profile image.
          </Text>
        </View>

        <View className="w-[80%] pt-10 justify-center items-center">
          <TouchableOpacity
            style={tw`w-full h-[50px] bg-white/20 rounded-lg px-4 mb-4 justify-center`}
            onPress={takePicture}
          >
            <Text className="text-white text-base text-left">
              Take a picture
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={tw`w-full h-[50px] bg-white/20 rounded-lg px-4 mb-4 justify-center`}
            onPress={pickImageFromLibrary}
          >
            <Text className="text-white text-base text-left">
              Choose a picture from your library
            </Text>
          </TouchableOpacity>
        </View>
      </Animated.View>
    </SafeAreaView>
  );
};

export default ChangeProfile;