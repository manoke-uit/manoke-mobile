import React, { useRef } from "react";
import {
  Animated,
  View,
  Text,
  TextInput,
  TouchableOpacity,
  KeyboardAvoidingView,
  Platform,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { LinearGradient } from "expo-linear-gradient";
import { APP_COLOR } from "@/utils/constant";
import { router } from "expo-router";

const ChangePassword = () => {
  const [oldPass, setOldPass] = React.useState("");
  const [newPass, setNewPass] = React.useState("");

  const fadeAnim = useRef(new Animated.Value(1)).current;

  const handleDone = () => {
    Animated.timing(fadeAnim, {
      toValue: 0,
      duration: 300,
      useNativeDriver: true,
    }).start(() => {
      router.replace("/home");
    });
  };

  return (
    <LinearGradient
      colors={[APP_COLOR.LIGHT_PINK, APP_COLOR.BLACK]}
      start={{ x: 0, y: 0 }}
      end={{ x: 0, y: 1 }}
      locations={[0, 0.3]}
      style={{ flex: 1 }}
    >
      <Animated.View style={{ flex: 1, opacity: fadeAnim }}>
        <KeyboardAvoidingView
          behavior={Platform.OS === "ios" ? "padding" : "height"}
          className="flex-1 justify-start px-6 pt-16"
        >
          <View className="flex-row justify-between items-center mb-6">
            <TouchableOpacity onPress={() => router.back()}>
              <Text className="text-pink-400">‹ Account</Text>
            </TouchableOpacity>
            <TouchableOpacity onPress={handleDone}>
              <Text className="text-pink-400 font-bold">Done</Text>
            </TouchableOpacity>
          </View>

          <View className="items-center mb-6">
            <Ionicons name="sync-outline" size={48} color="white" />
            <Text className="text-white font-bold text-xl mt-2">
              Change Password
            </Text>
            <Text className="text-gray-300 text-center mt-1">
              To change your password, enter the{"\n"}current one followed by
              the new one.
            </Text>
          </View>

          <View className="gap-4 mt-6">
            <TextInput
              className="bg-neutral-700 text-white px-4 py-3 rounded-md"
              placeholder="Old Password"
              placeholderTextColor="#999"
              secureTextEntry
              value={oldPass}
              onChangeText={setOldPass}
            />
            <TextInput
              className="bg-neutral-700 text-white px-4 py-3 rounded-md"
              placeholder="New Password"
              placeholderTextColor="#999"
              secureTextEntry
              value={newPass}
              onChangeText={setNewPass}
            />
          </View>

          <TouchableOpacity
            className="mt-6 bg-neutral-800 py-3 rounded-md items-center"
            disabled={!oldPass || !newPass}
            onPress={() => {}}
          >
            <Text
              className={`font-bold ${
                oldPass && newPass ? "text-white" : "text-neutral-500"
              }`}
            >
              Change Password
            </Text>
          </TouchableOpacity>
        </KeyboardAvoidingView>
      </Animated.View>
    </LinearGradient>
  );
};

export default ChangePassword;
