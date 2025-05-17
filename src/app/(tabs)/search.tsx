import React, { useState } from "react";
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
import { getPlaylistsAPI, updatePlaylistAPI } from "@/utils/api";
import SelectPlaylistModal from "@/components/selectPlaylistModal";

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
  const [selectedSong, setSelectedSong] = useState<IYoutubeResult | null>(null);
  const [isPlaylistPickerVisible, setPlaylistPickerVisible] = useState(false);
  const [availablePlaylists, setAvailablePlaylists] = useState<Playlist[]>([]);

  const handleAddToPlaylist = async () => {
    try {
      const res = await getPlaylistsAPI();
      const fetched = res.items.map((p: IPlaylist) => ({
        id: p.id,
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
                <Text className="text-white italic mb-4">
                  🔍 Bạn đang tìm kiếm: {searchText}
                </Text>
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
