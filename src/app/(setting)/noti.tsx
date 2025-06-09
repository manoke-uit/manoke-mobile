import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  FlatList,
  ActivityIndicator,
  TouchableOpacity,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { LinearGradient } from "expo-linear-gradient";
import tw from "twrnc";
import { APP_COLOR } from "@/utils/constant";
import { getNotificationsAPI } from "@/utils/api";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { router } from "expo-router";

const Notifications = () => {
  const [loading, setLoading] = useState(true);
  const [notifications, setNotifications] = useState<INotification[]>([]);

  useEffect(() => {
    const fetchNotifications = async () => {
      try {
        const userId = await AsyncStorage.getItem("userId");
        const res = await getNotificationsAPI(userId ?? "");
        setNotifications(res);
      } catch (error) {
        console.error("Lỗi khi lấy thông báo", error);
      } finally {
        setLoading(false);
      }
    };

    fetchNotifications();
  }, []);

  if (loading) {
    return (
      <LinearGradient
        colors={[APP_COLOR.LIGHT_PINK, APP_COLOR.BLACK]}
        style={tw`flex-1 justify-center items-center`}
      >
        <ActivityIndicator size="large" color="white" />
      </LinearGradient>
    );
  }

  return (
    <LinearGradient
      colors={[APP_COLOR.LIGHT_PINK, APP_COLOR.BLACK]}
      style={tw`flex-1 pt-12`}
    >
      <View style={tw`flex-row items-center justify-between px-5 mb-5`}>
        <TouchableOpacity onPress={() => router.replace("/home")}>
          <Ionicons name="arrow-back" size={24} color="white" />
        </TouchableOpacity>
        <Text style={tw`text-white text-xl font-bold`}>Notifications</Text>
        <View style={tw`w-6`} />
      </View>

      <FlatList
        contentContainerStyle={tw`px-5 pb-4`}
        data={notifications}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <View
            style={tw`flex-row items-start bg-white/10 p-4 rounded-xl mb-3`}
          >
            <Ionicons
              name="notifications"
              size={24}
              color="#f472b6"
              style={tw`mt-1`}
            />
            <View style={tw`ml-3 flex-1`}>
              <Text style={tw`text-white font-bold text-base`}>
                {item.title}
              </Text>
              <Text style={tw`text-white text-sm mt-1`}>
                {item.description}
              </Text>
              <Text style={tw`text-gray-400 text-xs mt-2`}>
                {new Date(item.createdAt).toLocaleString("vi-VN")}
              </Text>
            </View>
          </View>
        )}
        ListEmptyComponent={
          <Text style={tw`text-white text-center mt-10`}>
            Bạn chưa có thông báo nào.
          </Text>
        }
      />
    </LinearGradient>
  );
};

export default Notifications;
