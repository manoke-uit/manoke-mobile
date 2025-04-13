import React from "react";
import { View, Text, ScrollView, TouchableOpacity } from "react-native";
import { Ionicons, Entypo } from "@expo/vector-icons";
import { APP_COLOR } from "@/utils/constant";
import { LinearGradient } from "expo-linear-gradient";
import { router } from "expo-router";

const playlists = [
  { id: "1", name: "Name of Playlist", count: 0 },
  { id: "2", name: "Name of Playlist", count: 0 },
  { id: "3", name: "Name of Playlist", count: 0 },
  { id: "4", name: "Name of Playlist", count: 0 },
];

const PlaylistScreen = () => {
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
          paddingBottom: 80,
        }}
        className="h-full"
      >
        <View className="bg-neutral-900 rounded-2xl px-6 py-6 h-[75vh]">
          <TouchableOpacity onPress={() => router.back()} className="self-end">
            <Text className="text-pink-400 font-bold text-base mr-1">Done</Text>
          </TouchableOpacity>

          <View className="items-center mb-6">
            <Ionicons name="musical-notes" size={48} color="pink" />
            <Text className="text-white font-bold text-2xl mt-2">
              Your playlists
            </Text>
            <Text className="text-gray-300 text-center mt-1">
              Your playlists will be stored here. You can also create your own
              playlists.
            </Text>
          </View>

          {playlists.map((item) => (
            <View key={item.id} className="flex-row items-center mb-5">
              <View className="w-24 h-24 bg-gray-400 rounded-lg mr-4" />
              <View className="justify-center">
                <Text className="text-white font-bold">{item.name}</Text>
                <Text className="text-gray-400">
                  Sum of Songs: {item.count}
                </Text>
              </View>
            </View>
          ))}
        </View>
      </ScrollView>

      <TouchableOpacity
        className="absolute bottom-8 right-6 bg-pink-500 w-14 h-14 rounded-full items-center justify-center shadow-lg"
        onPress={() => console.log("Add playlist")}
      >
        <Entypo name="plus" size={28} color="white" />
      </TouchableOpacity>
    </LinearGradient>
  );
};

export default PlaylistScreen;
