import React from "react";
import { View, Text, ScrollView, TouchableOpacity } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { APP_COLOR } from "@/utils/constant";
import { LinearGradient } from "expo-linear-gradient";
import { router } from "expo-router";
import { useNavigation } from "@react-navigation/native";
const RecordingsScreen = () => {
  const navigation = useNavigation();
  const recordings = [
    { id: "1", name: "Name of Song", artist: "Artist", time: "00s" },
    { id: "2", name: "Name of Song", artist: "Artist", time: "00s" },
    { id: "3", name: "Name of Song", artist: "Artist", time: "00s" },
    { id: "4", name: "Name of Song", artist: "Artist", time: "00s" },
  ];
  return (
    <LinearGradient
      colors={[APP_COLOR.LIGHT_PINK, APP_COLOR.BLACK]}
      start={{ x: 0, y: 0 }}
      end={{ x: 0, y: 1 }}
      locations={[0, 0.5]}
      style={{ flex: 1 }}
    >
      <ScrollView
        contentContainerStyle={{
          paddingHorizontal: 16,
          paddingTop: 48,
          paddingBottom: 32,
        }}
        className="h-full"
      >
        <View className="bg-neutral-900 rounded-2xl px-6 py-6 h-[75vh]">
          <TouchableOpacity
            onPress={() => navigation.goBack()}
            className="self-end"
          >
            <Text className="text-pink-400 font-bold text-base mr-1 ">
              Done
            </Text>
          </TouchableOpacity>
          <View className="items-center mb-6">
            <Ionicons name="mic" size={48} color="pink" />
            <Text className="text-white font-bold text-2xl mt-2">
              Your recordings
            </Text>
            <Text className="text-gray-300 text-center mt-1">
              Your recordings will be stored here.
            </Text>
          </View>

          {recordings.map((item) => (
            <View key={item.id} className="flex-row items-center mb-5">
              <View className="w-24 h-24 bg-gray-400 rounded-lg mr-4" />
              <View className="justify-center">
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
