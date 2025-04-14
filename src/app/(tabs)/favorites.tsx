import React from "react";
import { View, Text, TextInput, ScrollView } from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import { APP_COLOR } from "@/utils/constant";
import AnimatedWrapper from "@/components/animation/animate";

const FavoritesTab = () => {
  const songs = [
    { id: "1", name: "Still Into You", artist: "Paramore" },
    { id: "2", name: "Die For You", artist: "The Weeknd" },
    { id: "3", name: "Easy On Me", artist: "Adele" },
  ];

  return (
    <LinearGradient
      colors={[APP_COLOR.LIGHT_PINK, APP_COLOR.BLACK]}
      start={{ x: 0, y: 0 }}
      end={{ x: 0, y: 1 }}
      locations={[0, 0.3]}
      style={{ flex: 1 }}
    >
      <AnimatedWrapper fade scale slideUp style={{ flex: 1 }}>
        <ScrollView className="flex-1 px-4 pt-16">
          <TextInput
            className="bg-gray-200 rounded-xl px-4 py-3 text-black"
            placeholder="Find your favorite songs..."
            placeholderTextColor="#888"
          />

          <View className="mt-5">
            {songs.map((item) => (
              <View
                key={item.id}
                className="flex-row items-center mb-5 border-b border-white/10 pb-4"
              >
                <View className="w-16 h-16 bg-gray-400 rounded-lg mr-4" />
                <View className="flex-1">
                  <Text className="text-white font-bold">{item.name}</Text>
                  <Text className="text-gray-400 text-sm">{item.artist}</Text>
                </View>
              </View>
            ))}
          </View>
        </ScrollView>
      </AnimatedWrapper>
    </LinearGradient>
  );
};

export default FavoritesTab;
