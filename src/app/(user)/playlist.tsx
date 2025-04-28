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
  { id: "5", name: "Name of Playlist", count: 0 },
  { id: "6", name: "Name of Playlist", count: 0 },
  { id: "7", name: "Name of Playlist", count: 0 },
  { id: "8", name: "Name of Playlist", count: 0 },
  { id: "9", name: "Name of Playlist", count: 0 },
];

const PlaylistScreen = () => {
  return (
    <LinearGradient
      colors={[APP_COLOR.BLACK, APP_COLOR.BLACK]}
      start={{ x: 0, y: 0 }}
      end={{ x: 0, y: 1 }}
      locations={[0, 0.5]}
      style={{ flex: 1 }}
    >
      {/* Custom Header */}
      <View
        className="w-full flex flex-row"
        style={{
          paddingVertical: 30,
          paddingHorizontal: 20,
          backgroundColor: "transparent",
        }}
      >
        <TouchableOpacity 
          onPress={() => router.back()}
          className="w-10 h-10 items-center justify-center rounded-full bg-pink-500/30">
          <Ionicons name="chevron-back-outline" size={25} color={APP_COLOR.WHITE} />
        </TouchableOpacity>
        <Text className="text-pink-500 text-3xl font-bold ml-4">Playlist</Text>
        <TouchableOpacity
          activeOpacity={0.8}
          className="flex-row items-center justify-center absolute bottom-8 right-6 bg-pink-500 rounded-full px-4 py-2 shadow-lg shadow-pink-500/50"
          onPress={() => console.log("Add playlist")}
        >
          <Entypo name="plus" size={20} color="white" />
          <Text className="text-white font-bold text-lg ml-2">Add</Text>
        </TouchableOpacity>

      </View>

      <ScrollView
        contentContainerStyle={{
          paddingHorizontal: 16,
          paddingBottom: 80,
        }}
        className="h-full color-transparent"
      >
        <View className=" rounded-2xl px-6 py-6 h-[75vh]">
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

      
    </LinearGradient>
  );
};

export default PlaylistScreen;