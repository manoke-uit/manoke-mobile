import React from "react";
import { View, Text, TouchableOpacity, ScrollView } from "react-native";
import { Ionicons, Entypo } from "@expo/vector-icons";
import { LinearGradient } from "expo-linear-gradient";
import { APP_COLOR } from "@/utils/constant";
import { useRouter } from "expo-router";

const SettingTab = () => {
  const router = useRouter();

  return (
    <LinearGradient
      colors={[APP_COLOR.LIGHT_PINK, APP_COLOR.BLACK]}
      start={{ x: 0, y: 0 }}
      end={{ x: 0, y: 1 }}
      locations={[0, 0.25]}
      style={{ flex: 1 }}
    >
      <ScrollView contentContainerStyle={{ padding: 20 }}>
        <View className="flex-row justify-end mb-4">
          <TouchableOpacity onPress={() => router.back()}>
            <Text className="text-pink-400 font-bold">Done</Text>
          </TouchableOpacity>
        </View>

        <LinearGradient
          colors={["#F72585", "#7209B7"]}
          className=" px-4 py-4 mb-5 rounded-full"
        >
          <Text className="text-white font-bold text-lg">
            Sing without limits.
          </Text>
          <Text className="text-white mt-1">
            Subscribes to unlock full versions of the songs and premium
            features!
          </Text>
        </LinearGradient>

        <TouchableOpacity
          onPress={() => router.push("/account")}
          className="bg-neutral-700 rounded-lg px-4 py-3 mb-4 flex-row items-center justify-between"
        >
          <View className="flex-row items-center">
            <Ionicons name="person" size={20} color="#fff" />
            <Text className="text-white ml-3">Account</Text>
          </View>
          <View className="flex-row items-center">
            <Text className="text-gray-300 mr-2">admin</Text>
            <Entypo name="chevron-right" size={16} color="#fff" />
          </View>
        </TouchableOpacity>

        {[1, 2].map((groupIndex) => (
          <View key={groupIndex} className="bg-neutral-700 rounded-lg mb-4">
            {[1, 2].map((_, i) => (
              <TouchableOpacity
                key={i}
                className="flex-row justify-between items-center px-4 py-3 border-b border-neutral-600"
              >
                <Text className="text-white">Setting {i + 1}</Text>
                <Entypo name="chevron-right" size={16} color="#fff" />
              </TouchableOpacity>
            ))}
          </View>
        ))}

        <TouchableOpacity className="bg-neutral-700 mt-2 py-3 rounded-xl items-center">
          <Text className="text-red-400 font-bold">Log out</Text>
        </TouchableOpacity>
      </ScrollView>
    </LinearGradient>
  );
};

export default SettingTab;
