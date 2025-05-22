import React, { useEffect, useRef, useState } from "react";
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  NativeSyntheticEvent,
  NativeScrollEvent,
  Image,
  ActivityIndicator,
} from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import { APP_COLOR } from "@/utils/constant";
import AnimatedWrapper from "@/components/animation/animate";
import tw from "twrnc";
import { useNavigation, router } from "expo-router";
import {
  getAllSongs,
  getPlaylistsAPI,
  registerOrUpdateExpoPushTokenAPI,
} from "@/utils/api";
import Toast from "react-native-toast-message";
import * as Notifications from "expo-notifications";

import { registerForPushNotificationsAsync } from "@/utils/registerPushToken";
import AsyncStorage from "@react-native-async-storage/async-storage";

const HomeTab = () => {
  const [songs, setSongs] = useState<ISong[]>([]);
  const [playlists, setPlaylists] = useState<IPlaylist[]>([]);
  const [loadingSongs, setLoadingSongs] = useState(true);
  const [loadingPlaylists, setLoadingPlaylists] = useState(true);
  const currentOffset = useRef(0);
  const [visible, setVisible] = useState(true);
  const navigation = useNavigation();

  const handleScroll = (event: NativeSyntheticEvent<NativeScrollEvent>) => {
    const offsetY = event.nativeEvent.contentOffset.y;
    const diff = offsetY - currentOffset.current;

    if (diff > 10 && visible) {
      setVisible(false);
      navigation.setOptions({ tabBarStyle: { display: "none" } });
    } else if (diff < -10 && !visible) {
      setVisible(true);
      navigation.setOptions({
        tabBarStyle: {
          backgroundColor: "#000",
          borderTopWidth: 0,
          height: 70,
        },
      });
    }

    currentOffset.current = offsetY;
  };

  useEffect(() => {
    const initPushToken = async () => {
      try {
        const userId = await AsyncStorage.getItem("userId");
        const token = await registerForPushNotificationsAsync();
        console.log(token);

        if (token && userId) {
          await registerOrUpdateExpoPushTokenAPI(userId, token);
        }
      } catch (error) {
        console.error("Lỗi lấy hoặc gửi push token:", error);
      }
    };

    initPushToken();
  }, []);
  useEffect(() => {
    const subscription = Notifications.addNotificationReceivedListener(
      (notification) => {
        console.log("🔔 Thông báo nhận:", notification);
      }
    );

    return () => subscription.remove();
  }, []);
  useEffect(() => {
    const fetchSongs = async () => {
      try {
        const res = await getAllSongs();
        setSongs(res.data || []);
      } catch (error: any) {
        Toast.show({
          type: "error",
          text1: "Error",
          text2: error.message || "Failed to load songs",
        });
      } finally {
        setLoadingSongs(false);
      }
    };

    const fetchPlaylists = async () => {
      try {
        const res = await getPlaylistsAPI();
        setPlaylists(res || []);
      } catch (error: any) {
        Toast.show({
          type: "error",
          text1: "Error",
          text2: "Failed to load playlists",
        });
      } finally {
        setLoadingPlaylists(false);
      }
    };

    fetchSongs();
    fetchPlaylists();
  }, []);

  return (
    <LinearGradient
      colors={[APP_COLOR.LT_PINK, APP_COLOR.BLACK]}
      start={{ x: 0, y: 0 }}
      end={{ x: 0, y: 1 }}
      locations={[0, 0.5]}
      style={{ flex: 1 }}
    >
      <AnimatedWrapper fade scale slideUp style={{ flex: 1 }}>
        <ScrollView
          className="flex-1 px-4"
          scrollEventThrottle={16}
          onScroll={handleScroll}
        >
          <View className="pt-8">
            <LinearGradient
              colors={[APP_COLOR.PINK, APP_COLOR.PURPLE]}
              style={tw`w-full h-[150px] justify-center items-center rounded-[10px]`}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 1 }}
            >
              <Text className="text-white font-bold text-2xl absolute left-5 top-5">
                Sing without limits
              </Text>
              <Text className="text-white pt-7 mx-5 text-[18px] text-center">
                Subscribes to unlock full versions of the songs and premium
                features!
              </Text>
            </LinearGradient>

            <View className="mb-6 pt-8">
              <View className="flex-row justify-between items-center mb-3">
                <Text className="text-white text-2xl font-bold">Playlists</Text>
                <TouchableOpacity>
                  <Text style={tw`text-[${APP_COLOR.PINK}] font-bold text-xl`}>
                    See All
                  </Text>
                </TouchableOpacity>
              </View>

              {loadingPlaylists ? (
                <ActivityIndicator size="large" color="#fff" />
              ) : playlists.length === 0 ? (
                <Text style={tw`text-white text-lg`}>
                  No playlists available
                </Text>
              ) : (
                <ScrollView
                  horizontal
                  showsHorizontalScrollIndicator={false}
                  className="flex-row pt-3"
                >
                  {playlists.map((p) => (
                    <TouchableOpacity
                      key={p.id}
                      className="w-[120px] mr-3"
                      onPress={() =>
                        router.push(`/(user)/playlistSong?id=${p.id}`)
                      }
                    >
                      {p.imageUrl ? (
                        <Image
                          source={{ uri: p.imageUrl }}
                          className="w-full h-[120px] rounded-xl mb-2"
                          resizeMode="cover"
                        />
                      ) : (
                        <View className="w-full h-[120px] rounded-xl mb-2 bg-gray-400" />
                      )}

                      <Text
                        className="text-white font-semibold text-sm"
                        numberOfLines={1}
                      >
                        {p.title}
                      </Text>
                    </TouchableOpacity>
                  ))}
                </ScrollView>
              )}
            </View>

            <View className="mb-6 mt-7">
              <View className="flex-row justify-between items-center mb-3">
                <Text className="text-white text-2xl font-bold">Top Songs</Text>
                <TouchableOpacity>
                  <Text style={tw`text-[${APP_COLOR.PINK}] font-bold text-xl`}>
                    See All
                  </Text>
                </TouchableOpacity>
              </View>

              {loadingSongs ? (
                <ActivityIndicator size="large" color="#fff" />
              ) : songs.length === 0 ? (
                <Text style={tw`text-white text-lg`}>No songs available</Text>
              ) : (
                <View className="flex-row flex-wrap justify-between pt-3">
                  {songs.map((s) => (
                    <TouchableOpacity
                      key={s.id}
                      className="w-[48%] mb-4"
                      onPress={() => router.push(`/songItem?id=${s.id}`)}
                    >
                      <Image
                        source={{ uri: s.imageUrl }}
                        className="w-full h-[120px] rounded-xl mb-2"
                        resizeMode="cover"
                      />
                      <Text className="text-white font-bold" numberOfLines={1}>
                        {s.title}
                      </Text>
                    </TouchableOpacity>
                  ))}
                </View>
              )}
            </View>
          </View>
        </ScrollView>
      </AnimatedWrapper>
    </LinearGradient>
  );
};

export default HomeTab;
