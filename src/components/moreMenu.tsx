import React from "react";
import { Modal, Pressable, Text, TouchableOpacity, View } from "react-native";
import { APP_COLOR } from "@/utils/constant";
import { Entypo, MaterialIcons, Ionicons } from "@expo/vector-icons";

interface MoreMenuProps {
  visible: boolean;
  onClose: () => void;
  onAddToPlaylist: () => void;
  onRemoveFromPlaylist?: () => void;
  isPlaylistTab?: boolean;
}

const MoreMenu: React.FC<MoreMenuProps> = ({
  visible,
  onClose,
  onAddToPlaylist,
  onRemoveFromPlaylist,
  isPlaylistTab = false,
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
          backgroundColor: "rgba(0, 0, 0, 0)",
          justifyContent: "flex-end",
        }}
        onPress={onClose}
      >
        <View
          style={{
            backgroundColor: "#1E1E1E",
            padding: 20,
            width: "100%",
            maxHeight: "50%",
          }}
        >
          <View
            style={{
              height: 5,
              width: 25,
              backgroundColor: "white",
              alignSelf: "center",
              borderRadius: 3,
              marginBottom: 15,
            }}
          />
        
          {!isPlaylistTab ? (
            <View
              style={{
                marginBottom: 20,
                flexDirection: "row",
                alignItems: "center",
                backgroundColor: "#9D9D9D",
                paddingVertical: 14,
                paddingHorizontal: 20,
                borderBottomWidth: 1,
                borderBottomColor: "#333",
                borderBottomLeftRadius: 10,
                borderBottomRightRadius: 10,
              }}
            >
              <TouchableOpacity
                onPress={() => {
                  onAddToPlaylist();
                  onClose();
                }}
                activeOpacity={0.7}
                style={{
                  flex: 1,
                  flexDirection: "row",
                  alignItems: "center",
                  justifyContent: "space-between",
                }}
              >
                <Text style={{ color: APP_COLOR.WHITE, fontSize: 16, fontWeight: "600" }}>
                  Add to Playlist
                </Text>
                <MaterialIcons name="playlist-add" size={20} color={APP_COLOR.WHITE} />
              </TouchableOpacity>
            </View>
          ) : (
            <View
              style={{
                marginBottom: 20,
                flexDirection: "row",
                alignItems: "center",
                backgroundColor: "#9D9D9D",
                paddingVertical: 14,
                paddingHorizontal: 20,
                borderBottomWidth: 1,
                borderBottomColor: "#333",
                borderBottomLeftRadius: 10,
                borderBottomRightRadius: 10,
              }}
            >
              <TouchableOpacity
                onPress={() => {
                  onRemoveFromPlaylist && onRemoveFromPlaylist();
                  onClose();
                }}
                activeOpacity={0.7}
                style={{
                  flex: 1,
                  flexDirection: "row",
                  alignItems: "center",
                  justifyContent: "space-between",
                }}
              >
                <Text style={{ color: APP_COLOR.WHITE, fontSize: 16, fontWeight: "600" }}>
                  Remove from Playlist
                </Text>
                <MaterialIcons name="playlist-remove" size={20} color={APP_COLOR.WHITE} />
              </TouchableOpacity>
            </View>
          )}
        </View>
      </Pressable>
    </Modal>
  );
};

export default MoreMenu;