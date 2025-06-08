import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  Image,
  Alert,
  ActivityIndicator,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { LinearGradient } from "expo-linear-gradient";
import { APP_COLOR } from "@/utils/constant";
import MoreMenu from "@/components/moreMenu";
import { router, useLocalSearchParams } from "expo-router";
import { getPlaylistById, getSongsInPlaylistAPI } from "@/utils/api";

const PlaylistSong = () => {
  const { id } = useLocalSearchParams();
  const [isMoreMenuVisible, setMoreMenuVisible] = useState(false);
  const [playlistTitle, setPlaylistTitle] = useState<string>("");
  const [playlistImage, setPlaylistImage] = useState<string>("");
  const [songs, setSongs] = useState<
    {
      id: string;
      title: string;
      imageUrl?: string;
      artists: { name: string }[];
    }[]
  >([]);
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    const fetchPlaylistData = async () => {
      // LOG 1: Kiểm tra xem ID có được truyền đúng cách không
      console.log(`[BẮT ĐẦU] Fetching data cho playlist với ID: ${id}`);

      if (!id) {
        console.log("[DỪNG] Không có ID, không gọi API.");
        return;
      }
      setLoading(true);
      try {
        console.log("[GỌI API] Bắt đầu gọi Promise.all...");

        const [playlistDetails, songsList] = await Promise.all([
          getPlaylistById(id as string),
          getSongsInPlaylistAPI(id as string),
        ]);

        // LOG 2: In ra dữ liệu thô từ API - QUAN TRỌNG NHẤT
        console.log("---------- DỮ LIỆU THÔ TỪ API ----------");
        console.log(">>> Kết quả từ getPlaylistById:", JSON.stringify(playlistDetails, null, 2));
        console.log(">>> Kết quả từ getSongsInPlaylistAPI:", JSON.stringify(songsList, null, 2));
        console.log("----------------------------------------");


        // LOG 3: Kiểm tra dữ liệu trước khi gán vào state
        console.log(`[GÁN STATE] Gán tiêu đề: "${playlistDetails?.title}"`);
        console.log(`[GÁN STATE] Gán ảnh: "${playlistDetails?.imageUrl}"`);
        console.log(`[GÁN STATE] Gán danh sách bài hát: có ${songsList?.length || 0} bài hát`);


        // Gán dữ liệu vào state
        setPlaylistTitle(playlistDetails.title);
        setPlaylistImage(playlistDetails.imageUrl);
        setSongs(songsList || []);

      } catch (err: any) { // Thêm kiểu `any` để truy cập các thuộc tính của lỗi
        // LOG 4: In ra lỗi chi tiết để gỡ rối
        console.error("!!!!!!!!!! ĐÃ XẢY RA LỖI !!!!!!!!!!");
        if (err.response) {
          // Lỗi từ server (ví dụ: 404, 500)
          console.error("Lỗi Status:", err.response.status);
          console.error("Lỗi Data:", JSON.stringify(err.response.data, null, 2));
        } else if (err.request) {
          // Request đã được gửi nhưng không nhận được phản hồi
          console.error("Lỗi Request:", err.request);
        } else {
          // Lỗi khác
          console.error("Lỗi Message:", err.message);
        }
        console.error("!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!");
        
        Alert.alert("Lỗi", "Không thể tải dữ liệu playlist");

      } finally {
        console.log("[KẾT THÚC] Quá trình fetch data hoàn tất.");
        setLoading(false);
      }
    };

    fetchPlaylistData();
  }, [id]);

  // Giữ nguyên phần còn lại của component
  return (
    <LinearGradient
      colors={[APP_COLOR.LIGHT_PINK, APP_COLOR.BLACK]}
      start={{ x: 0, y: 0 }}
      end={{ x: 0, y: 1 }}
      locations={[0, 0.4]}
      style={{ flex: 1 }}
    >
      <View
        className="w-full flex flex-row justify-between items-center"
        style={{ paddingVertical: 30, paddingHorizontal: 20 }}
      >
        <TouchableOpacity
          onPress={() => router.back()}
          className="w-10 h-10 items-center justify-center rounded-full bg-pink-500/30"
        >
          <Ionicons
            name="chevron-back-outline"
            size={25}
            color={APP_COLOR.WHITE}
          />
        </TouchableOpacity>
      </View>

      <ScrollView
        contentContainerStyle={{ paddingHorizontal: 16, paddingBottom: 80 }}
        className="flex-1"
      >
        {loading ? (
          <ActivityIndicator size="large" color={APP_COLOR.WHITE} style={{ marginTop: 50 }}/>
        ) : (
          <>
            <View className="items-center mb-6">
              {playlistImage ? (
                <Image
                  source={{ uri: playlistImage }}
                  className="w-48 h-48 rounded-xl"
                />
              ) : (
                <View className="w-48 h-48 bg-gray-400 rounded-xl" />
              )}
            </View>

            <Text className="text-white text-2xl font-bold mb-6 ml-4">
              {playlistTitle}
            </Text>

            <View className="flex-row justify-start mb-10 ml-4">
              <TouchableOpacity
                onPress={() => console.log("Add songs pressed")}
                className="bg-pink-500 rounded-lg px-6 py-2 mr-4"
              >
                <Text className="text-white font-semibold"> Add </Text>
              </TouchableOpacity>
              <TouchableOpacity
                onPress={() => console.log("Delete playlist pressed")}
                className="bg-gray-500 rounded-lg px-6 py-2"
              >
                <Text className="text-white font-semibold">Delete Playlist</Text>
              </TouchableOpacity>
            </View>

            <View className="px-4">
              {songs.map((item) => (
                <View
                  key={item.id}
                  className="flex-row items-center mb-5 border-b border-white/10 pb-4"
                >
                  {item.imageUrl ? (
                    <Image
                      source={{ uri: item.imageUrl }}
                      style={{
                        width: 64,
                        height: 64,
                        borderRadius: 8,
                        marginRight: 16,
                      }}
                      resizeMode="cover"
                    />
                  ) : (
                    <View className="w-16 h-16 bg-gray-400 rounded-lg mr-4" />
                  )}
                  <View className="flex-1">
                    <Text className="text-white font-bold">{item.title}</Text>
                    <Text className="text-gray-400 text-sm">
                      {item.artists?.map((a) => a.name).join(", ") || "Unknown"}
                    </Text>
                  </View>
                  <TouchableOpacity
                    onPress={() => setMoreMenuVisible(true)}
                    className="ml-2"
                  >
                    <Ionicons
                      name="ellipsis-vertical"
                      size={20}
                      color={APP_COLOR.WHITE}
                    />
                  </TouchableOpacity>
                </View>
              ))}
            </View>
          </>
        )}
      </ScrollView>
    </LinearGradient>
  );
};

export default PlaylistSong;