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
import {
  getPlaylistsAPI,
  searchYoutubeAPI,
  updatePlaylistAPI,
} from "@/utils/api";
import SelectPlaylistModal from "@/components/SelectPlaylistModal";

interface IYoutubeResult {
  title: string;
  videoId: string;
  embedUrl: string;
  thumbnailUrl: string;
}
interface Playlist {
  id: string;
  name: string;
  count: number;
}
const SearchTab = () => {
  const [searchText, setSearchText] = useState("");
  const [isMoreMenuVisible, setMoreMenuVisible] = useState(false);
  const [youtubeResults, setYoutubeResults] = useState<IYoutubeResult[]>([]);
  const [loading, setLoading] = useState(false);
  const [selectedSong, setSelectedSong] = useState<IYoutubeResult | null>(null);
  const [isPlaylistPickerVisible, setPlaylistPickerVisible] = useState(false);
  const [availablePlaylists, setAvailablePlaylists] = useState<Playlist[]>([]);

  useEffect(() => {
    const timeoutId = setTimeout(() => {
      if (searchText.length > 0) {
        fetchYoutube(searchText);
      }
    }, 500);
    return () => clearTimeout(timeoutId);
  }, [searchText]);

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

  const handleAddToPlaylist = async () => {
    try {
      const res = await getPlaylistsAPI();
      const fetched = res.items.map((p) => ({
        id: p.title,
        name: p.title,
        count: p.songIds?.length || 0,
      }));
      setAvailablePlaylists(fetched);
      setPlaylistPickerVisible(true);
    } catch (err) {
      console.error("Lỗi lấy playlist:", err);
    }
  };

  return (
    <>
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
                  placeholder="Search songs..."
                  placeholderTextColor="#eee"
                  className="flex-1 text-white ml-2"
                  value={searchText}
                  onChangeText={(text) => setSearchText(text)}
                />
              </View>

              {searchText.length > 0 ? (
                <View>
                  {loading ? (
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
                          onPress={() => {
                            setSelectedSong(item);
                            setMoreMenuVisible(true);
                          }}
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
                  )}
                </View>
              ) : (
                <View className="mt-10 px-4">
                  <Text className="text-white font-semibold mb-3">
                    Từ khoá gợi ý:
                  </Text>
                  <View className="flex-row flex-wrap gap-2">
                    {[
                      "Chill",
                      "Lo-fi",
                      "Ballad",
                      "Pop",
                      "Acoustic",
                      "Hip Hop",
                      "Indie",
                      "EDM",
                      "US-UK",
                      "Kpop",
                      "Vpop",
                      "Anime",
                      "Lofi Chill",
                      "Workout",
                      "Study",
                      "Relax",
                      "Taylor Swift",
                      "BTS",
                      "BLACKPINK",
                      "Adele",
                      "The Weeknd",
                      "Charlie Puth",
                      "Sơn Tùng M-TP",
                      "Đen Vâu",
                      "Hoàng Dũng",
                      "IU",
                      "Jay Chou",
                      "Justin Bieber",
                      "Ariana Grande",
                      "Billie Eilish",
                      "Bruno Mars",
                    ].map((keyword) => (
                      <TouchableOpacity
                        key={keyword}
                        onPress={() => setSearchText(keyword)}
                        className="bg-white/20 px-4 py-2 rounded-full mb-2"
                      >
                        <Text className="text-white">{keyword}</Text>
                      </TouchableOpacity>
                    ))}
                  </View>
                </View>
              )}
            </View>
          </ScrollView>
        </AnimatedWrapper>

        <MoreMenu
          visible={isMoreMenuVisible}
          onClose={() => setMoreMenuVisible(false)}
          onAddToQueue={() => {}}
          onAddToFavorite={() => {}}
          onAddToPlaylist={handleAddToPlaylist}
        />
      </LinearGradient>
      <SelectPlaylistModal
        visible={isPlaylistPickerVisible}
        playlists={availablePlaylists}
        onClose={() => setPlaylistPickerVisible(false)}
        onSelect={async (playlistId) => {
          try {
            const playlist = availablePlaylists.find(
              (p) => p.id === playlistId
            );
            if (!playlist || !selectedSong) return;

            const newSongIds = [
              ...new Set([...(playlist.id || []), selectedSong.videoId]),
            ];
            await updatePlaylistAPI(playlistId, { songIds: newSongIds });
          } catch (err) {
            console.error("Thêm bài hát vào playlist lỗi:", err);
          }
        }}
      />
    </>
  );
};

export default SearchTab;
