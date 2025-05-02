import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  TextInput,
  ScrollView,
  TouchableOpacity,
  Image,
} from "react-native";
import { Entypo, Ionicons } from "@expo/vector-icons";
import { LinearGradient } from "expo-linear-gradient";
import { APP_COLOR } from "@/utils/constant";
import AnimatedWrapper from "@/components/animation/animate";
import MoreMenu from "@/components/moreMenu";
import { searchYoutubeAPI } from "@/utils/api";

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

interface IYoutubeResult {
  title: string;
  videoId: string;
  embedUrl: string;
  thumbnailUrl: string;
}

const SearchTab = () => {
  const [searchText, setSearchText] = useState("");
  const [isMoreMenuVisible, setMoreMenuVisible] = useState(false);
  const [selectedFilter, setSelectedFilter] = useState<FilterType>("SONGS");
  const [youtubeResults, setYoutubeResults] = useState<IYoutubeResult[]>([]);
  const [loading, setLoading] = useState(false);

  const searchResults = {
    ARTISTS: [{ name: "Artist" }],
    PLAYLISTS: [{ name: "Playlist" }],
  };

  const filters: FilterType[] = ["SONGS", "ARTISTS", "PLAYLISTS"];

  const handleAddToQueue = () => {};
  const handleAddToFavorite = () => {};
  const handleAddToPlaylist = () => {};

  useEffect(() => {
    const timeoutId = setTimeout(() => {
      if (searchText.length > 0 && selectedFilter === "SONGS") {
        fetchYoutube(searchText);
      }
    }, 500);
    return () => clearTimeout(timeoutId);
  }, [searchText, selectedFilter]);

  const fetchYoutube = async (text: string) => {
    try {
      setLoading(true);
      const res = await searchYoutubeAPI(text, "");
      setYoutubeResults(res.results);
    } catch (error) {
      console.log("Youtube search error:", error);
    } finally {
      setLoading(false);
    }
  };

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
              <Ionicons name="search" size={20} color="white" />
              <TextInput
                placeholder="Songs, Artists, Playlists..."
                placeholderTextColor="#eee"
                className="flex-1 text-white ml-2"
                value={searchText}
                onChangeText={(text) => setSearchText(text)}
              />
            </View>

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
                          : "transparent",
                    }}
                  >
                    <Text className="text-white font-semibold">{filter}</Text>
                  </TouchableOpacity>
                ))}
              </View>
            )}

            {searchText.length > 0 ? (
              <View>
                {selectedFilter === "SONGS" ? (
                  loading ? (
                    <Text className="text-white">Đang tìm kiếm...</Text>
                  ) : (
                    youtubeResults.map((item, i) => (
                      <View key={i} className="flex-row items-center mb-4">
                        <TouchableOpacity className="flex-1 flex-row items-center">
                          <Image
                            source={{ uri: item.thumbnailUrl }}
                            style={{
                              width: 80,
                              height: 80,
                              borderRadius: 10,
                              marginRight: 12,
                            }}
                          />
                          <View>
                            <Text className="text-white">{item.title}</Text>
                            <Text className="text-gray-400 text-sm">
                              youtube.com/watch?v={item.videoId}
                            </Text>
                          </View>
                        </TouchableOpacity>
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
                    ))
                  )
                ) : (
                  searchResults[selectedFilter].map((item, i) => (
                    <View key={i} className="flex-row items-center mb-4">
                      <TouchableOpacity className="flex-1 flex-row items-center">
                        <View className="w-[80px] h-[80px] bg-neutral-300 rounded-lg mr-4" />
                        <Text className="text-white">{item.name}</Text>
                      </TouchableOpacity>
                    </View>
                  ))
                )}
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
