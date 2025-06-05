import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  Image,
  Alert,
} from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import { useLocalSearchParams, router } from "expo-router";
import { getKaraokesBySongId } from "@/utils/api";
import { APP_COLOR } from "@/utils/constant";

const ChooseKaraokes = () => {
  const { id } = useLocalSearchParams(); // songId
  const [karaokes, setKaraokes] = useState<IKaraoke[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchKaraokes = async () => {
    try {
      setLoading(true);
      const res = await getKaraokesBySongId(id as string);
      setKaraokes(res.data || []);
    } catch (error) {
      Alert.alert("Error", "Failed to load karaokes");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchKaraokes();
  }, [id]);

  const handleSelect = (karaokeId: string) => {
    router.push(`/songItem?id=${id}&karaokeId=${karaokeId}`);
  };

  return (
    <LinearGradient
      colors={[APP_COLOR.LIGHT_PINK, APP_COLOR.BLACK]}
      start={{ x: 0, y: 0 }}
      end={{ x: 0, y: 1 }}
      style={{ flex: 1, paddingHorizontal: 20, paddingTop: 50 }}
    >
      <Text className="text-white text-2xl font-bold mb-4">
        Choose a Karaoke
      </Text>

      {loading ? (
        <Text className="text-white">Loading...</Text>
      ) : karaokes.length === 0 ? (
        <Text className="text-white">No karaokes available for this song</Text>
      ) : (
        <ScrollView contentContainerStyle={{ paddingBottom: 60 }}>
          {karaokes.map((k) => (
            <TouchableOpacity
              key={k.id}
              onPress={() => handleSelect(k.id)}
              className="mb-4 flex-row items-center border-b border-white/10 pb-4"
            >
              <Image
                source={{
                  uri:
                    k.song.imageUrl ||
                    "https://via.placeholder.com/80x80.png?text=No+Image",
                }}
                className="w-20 h-20 rounded-lg mr-4"
              />
              <View className="flex-1">
                <Text className="text-white font-semibold text-base">
                  {k.song.title}
                </Text>
                <Text className="text-gray-400 text-sm">
                  {k.song.artists?.map((a) => a.name).join(", ")}
                </Text>
                {k.description ? (
                  <Text className="text-white mt-1" numberOfLines={2}>
                    {k.description}
                  </Text>
                ) : null}
              </View>
            </TouchableOpacity>
          ))}
        </ScrollView>
      )}
    </LinearGradient>
  );
};

export default ChooseKaraokes;
