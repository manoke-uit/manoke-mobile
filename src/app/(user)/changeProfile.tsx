import React, { useRef } from "react";
import { View, Text, TouchableOpacity, Animated } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { LinearGradient } from "expo-linear-gradient";
import { useRouter } from "expo-router";
import { APP_COLOR } from "@/utils/constant";

const ChangeProfile = () => {
  const router = useRouter();
  const fadeAnim = useRef(new Animated.Value(1)).current;

  const handleDone = () => {
    Animated.timing(fadeAnim, {
      toValue: 0,
      duration: 300,
      useNativeDriver: true,
    }).start(() => {
      router.replace("/home");
    });
  };

  return (
    <LinearGradient
      colors={[APP_COLOR.LIGHT_PINK, APP_COLOR.BLACK]}
      start={{ x: 0, y: 0 }}
      end={{ x: 0, y: 1 }}
      locations={[0, 0.25]}
      style={{ flex: 1 }}
    >
      <Animated.View style={{ flex: 1, opacity: fadeAnim }}>
        <View className="flex-1 px-6 pt-10">
          <View className="flex-row justify-between mb-6">
            <TouchableOpacity onPress={() => router.back()}>
              <Text className="text-pink-400">{`< Account`}</Text>
            </TouchableOpacity>
            <TouchableOpacity onPress={handleDone}>
              <Text className="text-pink-400 font-bold">Done</Text>
            </TouchableOpacity>
          </View>

          <View className="items-center mb-8">
            <Ionicons name="sync-circle-outline" size={64} color="white" />
            <Text className="text-white font-bold text-2xl mt-4">
              Update Profile Image
            </Text>
          </View>

          <TouchableOpacity className="bg-neutral-700 px-4 py-3 rounded-lg mb-4">
            <Text className="text-white text-center">Take a picture</Text>
          </TouchableOpacity>

          <TouchableOpacity className="bg-neutral-700 px-4 py-3 rounded-lg">
            <Text className="text-white text-center">
              Choose a picture from your library
            </Text>
          </TouchableOpacity>
        </View>
      </Animated.View>
    </LinearGradient>
  );
};

export default ChangeProfile;
