import { View, Text, Image, TouchableOpacity } from "react-native";
import { Entypo } from "@expo/vector-icons";

interface Props {
  results: ISong[];
  onPress: (song: ISong) => void;
  onMorePress?: (song: ISong) => void;
}

const SongSearchResults = ({ results, onPress, onMorePress }: Props) => {
  if (results.length === 0) {
    return (
      <Text className="text-white italic text-center mt-10">
        Không tìm thấy bài hát nào.
      </Text>
    );
  }

  return (
    <View className="mt-4 space-y-4">
      {results.map((song) => (
        <View key={song.id} className="flex-row items-center">
          <TouchableOpacity
            className="flex-row items-center flex-1 m-2"
            onPress={() => onPress(song)}
          >
            <Image
              source={{
                uri: song.imageUrl || "https://via.placeholder.com/80",
              }}
              className="w-16 h-16 rounded-lg mr-4"
              resizeMode="cover"
            />
            <View className="flex-1">
              <Text className="text-white font-bold">{song.title}</Text>
              <Text className="text-gray-400 text-sm">
                {song.artists?.map((a) => a.name).join(", ") ?? ""}
              </Text>
            </View>
          </TouchableOpacity>

          <TouchableOpacity className="p-2" onPress={() => onMorePress?.(song)}>
            <Entypo name="dots-three-vertical" size={20} color="#ccc" />
          </TouchableOpacity>
        </View>
      ))}
    </View>
  );
};

export default SongSearchResults;
