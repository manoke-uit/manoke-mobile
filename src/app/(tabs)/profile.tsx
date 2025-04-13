import React from "react";
import { Text, View, TouchableOpacity, Image } from "react-native";
import { Ionicons, Feather } from "@expo/vector-icons";
import { LinearGradient } from "expo-linear-gradient";
import { APP_COLOR } from "@/utils/constant";
import { useNavigation } from "@react-navigation/native";
import { router } from "expo-router";
const SettingTab = () => {
  const navigation = useNavigation();
  return (
    <LinearGradient
      colors={[APP_COLOR.LIGHT_PINK, APP_COLOR.BLACK]}
      start={{ x: 0, y: 0 }}
      end={{ x: 0, y: 1 }}
      locations={[0, 0.3]}
      style={{ flex: 1 }}
    >
      <View className="px-6 pt-16 flex-1">
        <View className="items-center mb-10">
          <View className="w-20 h-20 bg-pink-200 rounded-full items-center justify-center">
            <Ionicons name="person" size={40} color="#000" />
          </View>
          <Text className="text-white font-bold text-xl mt-3">admin</Text>
          <Text className="text-gray-300">admin.123@gmail.com</Text>
        </View>

        <View className="space-y-3">
          <TouchableOpacity
            className="bg-neutral-900 px-4 py-4 rounded-lg flex-row items-center justify-between"
            onPress={() => router.push("/record")}
          >
            <View className="flex-row items-center">
              <Ionicons name="mic-outline" size={20} color="white" />
              <Text className="text-white ml-3">Your Recordings</Text>
            </View>
            <Feather name="chevron-right" size={20} color="white" />
          </TouchableOpacity>

          <TouchableOpacity
            className="bg-neutral-900 px-4 py-4 rounded-lg flex-row items-center justify-between"
            onPress={() => router.push("/playlist")}
          >
            <View className="flex-row items-center">
              <Ionicons name="musical-notes-outline" size={20} color="white" />
              <Text className="text-white ml-3">Your Playlists</Text>
            </View>
            <Feather name="chevron-right" size={20} color="white" />
          </TouchableOpacity>
        </View>

        <View className="mt-auto mb-10">
          <TouchableOpacity className="bg-neutral-900 py-3 rounded-xl items-center">
            <Text className="text-red-400 font-bold">Log out</Text>
          </TouchableOpacity>
        </View>
      </View>
    </LinearGradient>
  );
};

export default SettingTab;
