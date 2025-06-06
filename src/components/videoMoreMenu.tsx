import React from "react";
import { Modal, Pressable, Text, TouchableOpacity, View, StyleSheet } from "react-native";
import { APP_COLOR } from "@/utils/constant";
import { Ionicons } from "@expo/vector-icons";

// THAY ĐỔI: Cập nhật interface để linh hoạt và mạnh mẽ hơn
interface Action {
  label: string;
  onPress: () => void;
  icon?: keyof typeof Ionicons.glyphMap; // Tên icon hợp lệ từ Ionicons
  disabled?: boolean;
  isDestructive?: boolean;
}

interface VideoMoreMenuProps {
  visible: boolean;
  onClose: () => void;
  actions: Action[];
}

const VideoMoreMenu: React.FC<VideoMoreMenuProps> = ({ visible, onClose, actions }) => {
  return (
    <Modal
      animationType="slide"
      transparent={true}
      visible={visible}
      onRequestClose={onClose}
    >
      <Pressable style={styles.overlay} onPress={onClose}>
        <Pressable style={styles.container}>
          <View style={styles.handle} />
          <View style={styles.actionsContainer}>
            {actions.map((action, index) => (
              <React.Fragment key={index}>
                <TouchableOpacity
                  disabled={action.disabled}
                  onPress={() => {
                    action.onPress();
                    onClose();
                  }}
                  activeOpacity={0.7}
                  style={[styles.actionRow, action.disabled && styles.disabledRow]}
                >
                  <Ionicons
                    name={action.icon || 'chevron-forward'}
                    size={22}
                    style={[
                        styles.icon,
                        action.isDestructive && styles.destructiveColor
                    ]}
                  />
                  <Text style={[
                    styles.labelText,
                    action.isDestructive && styles.destructiveColor
                  ]}>
                    {action.label}
                  </Text>
                </TouchableOpacity>
                {/* Thêm đường kẻ ngăn cách nếu không phải là item cuối cùng */}
                {index < actions.length - 1 && <View style={styles.separator} />}
              </React.Fragment>
            ))}
          </View>
        </Pressable>
      </Pressable>
    </Modal>
  );
};

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: "rgba(0, 0, 0, 0.5)",
    justifyContent: "flex-end",
  },
  container: {
    backgroundColor: "#2C2C2E", // Màu nền tối hơn, hiện đại hơn
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    paddingVertical: 10,
    paddingHorizontal: 16,
  },
  handle: {
    height: 5,
    width: 40,
    backgroundColor: "#5E5E62",
    alignSelf: "center",
    borderRadius: 3,
    marginBottom: 10,
  },
  actionsContainer: {
    backgroundColor: '#1C1C1E',
    borderRadius: 14,
  },
  actionRow: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 14,
    paddingHorizontal: 16,
  },
  disabledRow: {
    opacity: 0.4,
  },
  icon: {
    color: APP_COLOR.WHITE,
    marginRight: 16,
    width: 24,
    textAlign: 'center',
  },
  labelText: {
    color: APP_COLOR.WHITE,
    fontSize: 17,
    fontWeight: "500",
  },
  destructiveColor: {
    color: '#FF453A', // Màu đỏ cho hành động nguy hiểm
  },
  separator: {
    height: 1,
    backgroundColor: 'rgba(94, 94, 98, 0.5)',
    marginLeft: 56, // Căn lề với text
  }
});

export default VideoMoreMenu;