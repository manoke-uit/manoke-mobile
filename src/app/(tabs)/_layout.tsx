import { Tabs } from "expo-router";
import { FontAwesome, Ionicons } from "@expo/vector-icons";
import { Text } from "react-native";
import { APP_COLOR } from "@/utils/constant";

const TabLayout = () => {
  return (
    <Tabs
      screenOptions={{
        headerShown: true,
        tabBarStyle: {
          backgroundColor: "#000",
          borderTopWidth: 0,
        },
        tabBarActiveTintColor: APP_COLOR.PINK,
        tabBarInactiveTintColor: "#888",
      }}
    >
      <Tabs.Screen
        name="home"
        options={{
          headerTitle: () => (
            <Text className="text-white text-3xl font-bold">Discover</Text>
          ),
          headerRight: () => (
            <Ionicons
              name="settings-outline"
              size={24}
              color="white"
              style={{ marginRight: 16 }}
            />
          ),
          headerStyle: {
            backgroundColor: APP_COLOR.LT_PINK,
          },
          tabBarIcon: ({ color, size }) => (
            <FontAwesome name="home" size={size} color={color} />
          ),
        }}
      />
      <Tabs.Screen
        name="search"
        options={{
          headerTitle: () => (
            <Text className="text-white text-3xl font-bold">Search</Text>
          ),
          headerRight: () => (
            <Ionicons
              name="settings-outline"
              size={24}
              color="white"
              style={{ marginRight: 16 }}
            />
          ),
          headerStyle: {
            backgroundColor: APP_COLOR.LIGHT_PINK,
          },
          tabBarIcon: ({ color, size }) => (
            <FontAwesome name="search" size={size} color={color} />
          ),
        }}
      />
      <Tabs.Screen
        name="favorites"
        options={{
          tabBarIcon: ({ color, size }) => (
            <FontAwesome name="heart" size={size} color={color} />
          ),
        }}
      />
      <Tabs.Screen
        name="history"
        options={{
          tabBarIcon: ({ color, size }) => (
            <FontAwesome name="history" size={size} color={color} />
          ),
        }}
      />
      <Tabs.Screen
        name="profile"
        options={{
          tabBarIcon: ({ color, size }) => (
            <FontAwesome name="user" size={size} color={color} />
          ),
        }}
      />
    </Tabs>
  );
};

export default TabLayout;
