import React, { useState } from "react";
import { View, Text, TextInput, ScrollView, TouchableOpacity } from "react-native";
import { Entypo, Ionicons } from "@expo/vector-icons";
import { LinearGradient } from "expo-linear-gradient";
import { APP_COLOR } from "@/utils/constant";
import AnimatedWrapper from "@/components/animation/animate";
import MoreMenu from "@/components/moreMenu";

type FilterType = "SONGS" | "ARTISTS" | "PLAYLISTS";

interface SongItem {
  name: string;
  artist: string;
}

interface ArtistItem {
  name: string;
}

interface PlaylistItem {
  name: string;
}

interface SearchResults {
  SONGS: SongItem[];
  ARTISTS: ArtistItem[];
  PLAYLISTS: PlaylistItem[];
}

const SearchTab = () => {
  const [searchText, setSearchText] = useState("");
  const [isMoreMenuVisible, setMoreMenuVisible] = useState<boolean>(false);
  const [selectedFilter, setSelectedFilter] = useState<FilterType>("SONGS");

  const handleAddToQueue = (): void => {
    console.log("Added to queue");
  };

  const handleAddToFavorite = (): void => {
    console.log("Added to favorite");
  };

  const handleAddToPlaylist = (): void => {
    console.log("Added to playlist");
  };

  const searchResults: SearchResults = {
    SONGS: [
      { name: "Name of Song", artist: "Artist" },
      { name: "Name of Song", artist: "Artist" },
      { name: "Name of Song", artist: "Artist" },
    ],
    ARTISTS: [{ name: "Artist" }],
    PLAYLISTS: [{ name: "Playlist" }],
  };

  const filters: FilterType[] = ["SONGS", "ARTISTS", "PLAYLISTS"];

  return (
    <LinearGradient
      colors={[APP_COLOR.LIGHT_PINK, APP_COLOR.BLACK]}
      start={{ x: 0, y: 0 }}
      end={{ x: 0, y: 1 }}
      locations={searchText.length > 0 ? [0, 0.2] : [0, 1]}
      style={{ flex: 1 }}
    >
      <AnimatedWrapper fade scale slideUp style={{ flex: 1 }}>
        <ScrollView className="flex-1 px-4">
          <View className="pt-8">
            <View className="flex-row items-center bg-white/20 px-4 py-2 rounded-xl mb-4">
              <Ionicons
                name="search"
                size={20}
                color="white"
                className="mr-2"
              />
              <TextInput
                placeholder="Songs, Artists, Playlists..."
                placeholderTextColor="#eee"
                className="flex-1 text-white"
                value={searchText}
                onChangeText={(text) => setSearchText(text)}
              />
            </View>

            {/* Bộ lọc */}
            {searchText.length > 0 && (
              <View className="flex-row justify-between mb-7">
                {filters.map((filter) => (
                  <TouchableOpacity
                    key={filter}
                    onPress={() => setSelectedFilter(filter)}
                    className="px-5 py-2 rounded-full"
                    style={{
                      backgroundColor:
                        selectedFilter === filter
                          ? APP_COLOR.LIGHT_ORANGE
                          : 'transparent',
                    }}
                  >
                    <Text
                      className={`text-base font-semibold ${
                        selectedFilter === filter ? "text-white" : "text-white"
                      }`}
                    >
                      {filter}
                    </Text>
                  </TouchableOpacity>
                ))}
              </View>
            )}

            {searchText.length > 0 ? (
              <View>
                {searchResults[selectedFilter].map((item, i) => (
                  <View key={i} className="flex-row items-center mb-4">
                    <TouchableOpacity className="flex-1 flex-row items-center">
                      <View className="w-[80px] h-[80px] bg-neutral-300 rounded-lg mr-4" />
                      <View>
                        <Text className="text-white">{item.name}</Text>
                        {selectedFilter === "SONGS" && (
                          <Text className="text-gray-400 text-sm">
                            {(item as SongItem).artist}
                          </Text>
                        )}
                      </View>
                    </TouchableOpacity>
                    {selectedFilter === "SONGS" && (
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
                    )}
                  </View>
                ))}
              </View>
            ) : (
              <View className="flex-row flex-wrap justify-between">
                {[...Array(12)].map((_, i) => (
                  <View key={i} className="w-[32%] mb-4">
                    <View className="w-full h-[100px] bg-neutral-300 rounded-xl mb-2" />
                  </View>
                ))}
              </View>
            )}
          </View>
        </ScrollView>
      </AnimatedWrapper>

      <MoreMenu
        visible={isMoreMenuVisible}
        onClose={() => setMoreMenuVisible(false)}
        onAddToQueue={handleAddToQueue}
        onAddToFavorite={handleAddToFavorite}
        onAddToPlaylist={handleAddToPlaylist}
      />
    </LinearGradient>
  );
};

export default SearchTab;