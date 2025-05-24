import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  TextInput,
  ScrollView,
  TouchableOpacity,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { LinearGradient } from "expo-linear-gradient";
import { APP_COLOR } from "@/utils/constant";
import AnimatedWrapper from "@/components/animation/animate";
import MoreMenu from "@/components/moreMenu";
import SelectPlaylistModal from "@/components/selectPlaylistModal";

import { getAllSongs, getPlaylistsAPI, updatePlaylistAPI } from "@/utils/api";
import SongSearchResults from "@/components/songs/SongSearchResults";
import { router } from "expo-router";

const SearchTab = () => {
  const [searchText, setSearchText] = useState("");
  const [allSongs, setAllSongs] = useState<ISong[]>([]);
  const [filteredSongs, setFilteredSongs] = useState<ISong[]>([]);
  const [selectedSong, setSelectedSong] = useState<ISong | null>(null);
  const [isMoreMenuVisible, setMoreMenuVisible] = useState(false);
  const [isPlaylistPickerVisible, setPlaylistPickerVisible] = useState(false);
  const [availablePlaylists, setAvailablePlaylists] = useState<
    { id: string; name: string; count: number }[]
  >([]);

  const keywordSuggestions = [
    "Chill",
    "Lofi",
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
    "Workout",
    "Study",
    "Relax",
    "Taylor Swift",
    "BTS",
    "BLACKPINK",
    "Sơn Tùng M-TP",
    "Adele",
    "IU",
    "Bruno Mars",
  ];

  useEffect(() => {
    const fetchSongs = async () => {
      try {
        const res = await getAllSongs();
        setAllSongs(res.data ?? []);
      } catch (err) {
        // console.error("Lỗi tải danh sách bài hát:", err);
      }
    };
    fetchSongs();
  }, []);

  useEffect(() => {
    if (searchText.trim() === "") {
      setFilteredSongs([]);
      return;
    }

    const keyword = searchText.toLowerCase();
    const filtered = allSongs.filter(
      (song) =>
        song.title.toLowerCase().includes(keyword) ||
        song.artists?.some((a) => a.name.toLowerCase().includes(keyword))
    );
    setFilteredSongs(filtered);
  }, [searchText, allSongs]);

  const handleAddToPlaylist = async () => {
    try {
      const res = await getPlaylistsAPI();
      const fetched = res.map((p: IPlaylist) => ({
        id: p.id,
        name: p.title,
        count: p.songs?.length || 0,
      }));
      setAvailablePlaylists(fetched);
      setPlaylistPickerVisible(true);
    } catch (err) {
      console.error("Lỗi lấy playlist:", err);
    }
  };

  const handleSelectPlaylist = async (playlistId: string) => {
    try {
      const playlist = availablePlaylists.find((p) => p.id === playlistId);
      if (!playlist || !selectedSong) return;

      const newSongIds = [selectedSong.id];
      await updatePlaylistAPI(playlistId, { songIds: newSongIds });

      setPlaylistPickerVisible(false);
      setMoreMenuVisible(false);
    } catch (err) {
      // console.error("Thêm bài hát vào playlist lỗi:", err);
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
                <>
                  <Text className="text-white italic mb-4">
                    Bạn đang tìm kiếm: {searchText}
                  </Text>
                  <SongSearchResults
                    results={filteredSongs}
                    onPress={(song) => {
                      router.push(`/songItem?id=${song.id}`);
                    }}
                    onMorePress={(song) => {
                      setSelectedSong(song);
                      setMoreMenuVisible(true);
                    }}
                  />
                </>
              ) : (
                <View className="mt-10 px-4">
                  <Text className="text-white font-semibold mb-3">
                    Khám phá theo thể loại:
                  </Text>
                  <View className="flex-row flex-wrap gap-2">
                    {keywordSuggestions.map((keyword) => (
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
          onAddToPlaylist={handleAddToPlaylist}
        />
      </LinearGradient>

      <SelectPlaylistModal
        visible={isPlaylistPickerVisible}
        playlists={availablePlaylists}
        onClose={() => setPlaylistPickerVisible(false)}
        onSelect={handleSelectPlaylist}
      />
    </>
  );
};

export default SearchTab;
