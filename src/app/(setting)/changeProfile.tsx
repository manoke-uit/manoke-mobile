import React, { useEffect, useRef, useState } from "react";
import {
  View,
  Animated,
  Dimensions,
  Image,
  Text,
  TouchableOpacity,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { APP_COLOR } from "@/utils/constant";
import { useRouter } from "expo-router";
import tw from "twrnc";
import { Ionicons } from "@expo/vector-icons";
import Toast from "react-native-toast-message";
import * as ImagePicker from "expo-image-picker";
import { getAccountAPI, getUserByIdAPI, updateUserImageAPI } from "@/utils/api";

const { height: screenHeight, width: screenWidth } = Dimensions.get("window");
const modalHeight = screenHeight * 0.9;
const defaultIcon = require("@/assets/auth/Icon/update.png");

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

    const fetchUser = async () => {
      try {
        const res = await getAccountAPI();
        if (res?.userId) {
          setUserId(res.userId);
          const userRes = await getUserByIdAPI(res.userId);
          const user = userRes.data || userRes;
          if (user.imageUrl) setImageUri(user.imageUrl);
        } else {
          Toast.show({ type: "error", text1: "User ID not found" });
        }
      } catch (err) {
        // console.error("Error fetching user:", err);
        Toast.show({ type: "error", text1: "Failed to load user data" });
      }
    };
    fetchUser();
  }, []);

  const pickImageFromLibrary = async () => {
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.All,
      allowsEditing: true,
      aspect: [1, 1],
      quality: 0.5,
    });

    if (!result.canceled) {
      const asset = result.assets && result.assets[0];

      if (asset && asset.uri) {
        setImageUri(asset.uri);
        await handleUpload(asset.uri);
      }
    }
  };

  const takePicture = async () => {
    const { status } = await ImagePicker.requestCameraPermissionsAsync();
    if (status !== "granted") {
      Toast.show({ type: "error", text1: "Camera permission denied" });
      return;
    }

    const result = await ImagePicker.launchCameraAsync({
      allowsEditing: true,
      aspect: [1, 1],
      quality: 0.5,
    });

    if (!result.canceled) {
      const asset = result.assets && result.assets[0];
      if (asset && asset.uri) {
        setImageUri(asset.uri);
        await handleUpload(asset.uri);
      }
    }
  };

  const handleUpload = async (uri: string) => {
    if (!userId) {
      Toast.show({ type: "error", text1: "User ID not found" });
      return;
    }

    try {
      const fileName = uri.split("/").pop() || "avatar.jpg";
      const match = /\.(\w+)$/.exec(fileName);
      const type = match ? `image/${match[1]}` : `image/jpeg`;

      await updateUserImageAPI(userId, {
        uri,
        name: fileName,
        type,
      });

      Toast.show({ type: "success", text1: "Avatar updated successfully" });
    } catch (err) {
      // console.error("Upload error:", err);
      Toast.show({ type: "error", text1: "Failed to update avatar" });
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

        <View style={tw`pt-10 justify-center items-center`}>
          <Image
            source={imageUri ? { uri: imageUri } : defaultIcon}
            style={tw`w-32 h-32 rounded-full`}
          />
          <Text style={tw`pt-3 text-white text-[27px] font-bold`}>
            Update Profile Image
          </Text>
          <Text
            style={tw`pt-5 text-white px-12 items-center text-center text-[16px]`}
          >
            Take a new photo or choose a picture from your library to update
            your profile image.
          </Text>
        </View>

        <View style={tw`w-[80%] pt-10 justify-center items-center`}>
          <TouchableOpacity
            style={tw`w-full h-[50px] bg-white/20 rounded-lg px-4 mb-4 justify-center`}
            onPress={takePicture}
          >
            <Text style={tw`text-white text-base text-left`}>
              Take a picture
            </Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={tw`w-full h-[50px] bg-white/20 rounded-lg px-4 mb-4 justify-center`}
            onPress={pickImageFromLibrary}
          >
            <Text style={tw`text-white text-base text-left`}>
              Choose a picture from your library
            </Text>
          </TouchableOpacity>
        </View>
      </Animated.View>
    </SafeAreaView>
  );
};

export default ChangeProfile;
