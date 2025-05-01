import React from "react";
import { View, Text, ScrollView, TouchableOpacity } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { LinearGradient } from "expo-linear-gradient";
import { APP_COLOR } from "@/utils/constant";
import { router } from "expo-router";

const recordings = [
  { id: "1", name: "Name of Song", artist: "Artist", time: "00s" },
  { id: "2", name: "Name of Song", artist: "Artist", time: "00s" },
  { id: "3", name: "Name of Song", artist: "Artist", time: "00s" },
  { id: "4", name: "Name of Song", artist: "Artist", time: "00s" },
];

const RecordingsScreen = () => {

  return (
    <LinearGradient
      colors={[APP_COLOR.LIGHT_PINK, APP_COLOR.BLACK]}
      start={{ x: 0, y: 0 }}
      end={{ x: 0, y: 1 }}
      locations={[0, 0.4]}
      style={{ flex: 1 }}
    >
      {/* Custom Header */}
      <View
        className="w-full flex flex-row justify-between items-center"
        style={{
          paddingVertical: 30,
          paddingHorizontal: 20,
          backgroundColor: "transparent",
        }}
      >
        <TouchableOpacity
          onPress={() => router.back()}
          className="w-10 h-10 items-center justify-center rounded-full bg-pink-500/30"
        >
          <Ionicons name="chevron-back-outline" size={25} color={APP_COLOR.WHITE} />
        </TouchableOpacity>
      </View>

      <ScrollView
        contentContainerStyle={{
          paddingHorizontal: 16,
          paddingBottom: 80,
        }}
        className="flex-1"
      >
        <View className="items-center mb-6">
          <View className="w-48 h-48 bg-gray-400" /> 
        </View>

        <View className="flex-row justify-between items-center px-4 mb-10">
          <Text className="text-white text-2xl font-bold">
            All Recordings
          </Text>
        </View>

        {/* Danh sách playlist */}
        <View className="px-4">
          {recordings.map((item) => (
            <View
              key={item.id}
              className="flex-row items-center mb-5 border-b border-white/10 pb-4"
            >
              <View className="w-16 h-16 bg-gray-400 rounded-lg mr-4" />
              <View className="flex-1">
                <Text className="text-white font-bold">{item.name}</Text>
                <Text className="text-gray-400">{item.artist}</Text>
                <Text className="text-gray-400">Time: {item.time}</Text>
              </View>
            </View>
          ))}
        </View>
      </ScrollView>
    </LinearGradient>
  );
};

export default RecordingsScreen;