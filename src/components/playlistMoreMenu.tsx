import React from "react";
import { Modal, Pressable, Text, TouchableOpacity, View } from "react-native";
import { APP_COLOR } from "@/utils/constant";
import { Ionicons } from "@expo/vector-icons";

interface Action {
  label: string;
  onPress: () => void;
}

interface PlaylistMoreMenuProps {
  visible: boolean;
  onClose: () => void;
  actions: Action[];
}

const PlaylistMoreMenu: React.FC<PlaylistMoreMenuProps> = ({
  visible,
  onClose,
  actions,
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
          backgroundColor: "rgba(0, 0, 0, 0.3)",
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
          {actions.map((action, index) => (
            <TouchableOpacity
              key={index}
              onPress={() => {
                action.onPress();
                onClose();
              }}
              activeOpacity={0.8}
              style={{
                marginVertical: 8,
                backgroundColor: "#3A3A3A",
                paddingVertical: 14,
                paddingHorizontal: 20,
                borderRadius: 8,
                flexDirection: "row",
                alignItems: "center",
                justifyContent: "space-between",
              }}
            >
              <Text
                style={{
                  color: APP_COLOR.WHITE,
                  fontSize: 16,
                  fontWeight: "600",
                }}
              >
                {action.label}
              </Text>
              <Ionicons
                name={
                  action.label.includes("Public")
                    ? "globe-outline"
                    : action.label.includes("Private")
                    ? "lock-closed-outline"
                    : action.label.includes("Delete")
                    ? "trash-outline"
                    : action.label.includes("Edit")
                    ? "create-outline"
                    : "chevron-forward"
                }
                size={20}
                color={APP_COLOR.WHITE}
              />
            </TouchableOpacity>
          ))}
        </View>
      </Pressable>
    </Modal>
  );
};

export default PlaylistMoreMenu;
