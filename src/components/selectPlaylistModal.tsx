import React from "react";
import {
  Modal,
  Pressable,
  Text,
  TouchableOpacity,
  View,
  ScrollView,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";

interface Playlist {
  id: string;
  name: string;
  count: number;
}

interface SelectPlaylistModalProps {
  visible: boolean;
  playlists: Playlist[];
  onSelect: (playlistId: string) => void;
  onClose: () => void;
}

const SelectPlaylistModal: React.FC<SelectPlaylistModalProps> = ({
  visible,
  playlists,
  onSelect,
  onClose,
}) => {
  return (
    <Modal
      animationType="slide"
      transparent={true}
      visible={visible}
      onRequestClose={onClose}
    >
      <Pressable
        style={{
          flex: 1,
          backgroundColor: "rgba(0,0,0,0.3)",
          justifyContent: "flex-end",
        }}
        onPress={onClose}
      >
        <View
          style={{
            backgroundColor: "#1E1E1E",
            borderTopLeftRadius: 20,
            borderTopRightRadius: 20,
            padding: 20,
            maxHeight: "60%",
          }}
        >
          <View
            style={{
              height: 5,
              width: 40,
              backgroundColor: "#999",
              alignSelf: "center",
              borderRadius: 10,
              marginBottom: 15,
            }}
          />

          <Text
            style={{
              color: "white",
              fontSize: 18,
              fontWeight: "bold",
              marginBottom: 16,
              textAlign: "center",
            }}
          >
            Select a Playlist
          </Text>

          <ScrollView>
            {playlists.map((item) => (
              <TouchableOpacity
                key={item.id}
                onPress={() => {
                  onSelect(item.id);
                  onClose();
                }}
                style={{
                  backgroundColor: "#9D9D9D",
                  paddingVertical: 14,
                  paddingHorizontal: 20,
                  borderRadius: 10,
                  marginBottom: 12,
                  flexDirection: "row",
                  alignItems: "center",
                  justifyContent: "space-between",
                }}
              >
                <View>
                  <Text
                    style={{ color: "white", fontWeight: "600", fontSize: 16 }}
                  >
                    {item.name}
                  </Text>
                  <Text style={{ color: "#ddd", fontSize: 12 }}>
                    {item.count} song{item.count !== 1 ? "s" : ""}
                  </Text>
                </View>
                <Ionicons name="chevron-forward" size={20} color="#fff" />
              </TouchableOpacity>
            ))}
          </ScrollView>
        </View>
      </Pressable>
    </Modal>
  );
};

export default SelectPlaylistModal;
