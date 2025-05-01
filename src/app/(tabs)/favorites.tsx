import React, { useState } from "react";
import { View, Text, TextInput, ScrollView, TouchableOpacity } from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import { APP_COLOR } from "@/utils/constant";
import AnimatedWrapper from "@/components/animation/animate";
import { Entypo, Ionicons } from "@expo/vector-icons";
import MoreMenu from "@/components/moreMenu";

const FavoritesTab = () => {
  const [isMoreMenuVisible, setMoreMenuVisible] = useState<boolean>(false);

  const songs = [
    { id: "1", name: "Still Into You", artist: "Paramore" },
    { id: "2", name: "Die For You", artist: "The Weeknd" },
    { id: "3", name: "Easy On Me", artist: "Adele" },
  ];

  const handleAddToQueue = (): void => {
    console.log("Added to queue");
  };

  const handleRemoveFromFavorite = (): void => {
    console.log("Removed from favorite");
  };

  const handleAddToPlaylist = (): void => {
    console.log("Added to playlist");
  };

  return (
    <LinearGradient
      colors={[APP_COLOR.LIGHT_PINK, APP_COLOR.BLACK]}
      start={{ x: 0, y: 0 }}
      end={{ x: 0, y: 1 }}
      locations={[0, 0.2]}
      style={{ flex: 1 }}
    >
      <AnimatedWrapper fade scale slideUp style={{ flex: 1 }}>
        <ScrollView className="flex-1 px-4 pt-8">
          <View className="flex-row items-center bg-white/20 px-4 py-2 rounded-xl mb-6">
            <Ionicons
              name="search"
              size={20}
              color="white"
              className="mr-2"
            />
            <TextInput
              placeholder="Find your favorite songs..."
              placeholderTextColor="#eee"
              className="flex-1 text-white"
            />
          </View>

          <View className="mt-5">
            {songs.map((item) => (
              <View
                key={item.id}
                className="flex-row items-center mb-5 border-b border-white/10 pb-4"
              >
                <View className="w-20 h-20 bg-gray-400 rounded-lg mr-4" />
                <View className="flex-1">
                  <Text className="text-white font-bold">{item.name}</Text>
                  <Text className="text-gray-400 text-sm">{item.artist}</Text>
                </View>
                
                <TouchableOpacity
                  onPress={() => setMoreMenuVisible(true)}
                  className="ml-2"
                >
                  <Entypo
                      name="dots-three-vertical"
                      size={20}
                      color="#C0C0C0"
                  />
                </TouchableOpacity>
              </View>
            ))}
          </View>
        </ScrollView>
      </AnimatedWrapper>

      <MoreMenu
        visible={isMoreMenuVisible}
        onClose={() => setMoreMenuVisible(false)}
        onAddToQueue={handleAddToQueue}
        onAddToFavorite={() => {}} 
        onRemoveFromFavorite={handleRemoveFromFavorite} 
        onAddToPlaylist={handleAddToPlaylist}
        isFavoriteTab={true} 
      />
    </LinearGradient>
  );
};

export default FavoritesTab;