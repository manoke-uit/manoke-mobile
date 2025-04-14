import { router, Tabs } from "expo-router";
import { FontAwesome, Ionicons } from "@expo/vector-icons";
import { Text } from "react-native";
import { APP_COLOR } from "@/utils/constant";
import AnimatedTabIcon from "@/components/animation/tabAnimate";

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
          tabBarLabel: "Home",
          headerTitle: () => (
            <Text className="text-white text-3xl font-bold">Discover</Text>
          ),
          headerRight: () => (
            <Ionicons
              name="settings-outline"
              size={24}
              color="white"
              style={{ marginRight: 16 }}
              onPress={() => router.push("/(setting)/setting")}
            />
          ),
          headerStyle: {
            backgroundColor: APP_COLOR.LT_PINK,
          },
          tabBarIcon: ({ color, size, focused }) => (
            <AnimatedTabIcon
              name="home"
              color={color}
              size={size}
              focused={focused}
            />
          ),
        }}
      />
      <Tabs.Screen
        name="search"
        options={{
          tabBarLabel: "Search",
          headerTitle: () => (
            <Text className="text-white text-3xl font-bold">Search</Text>
          ),
          headerRight: () => (
            <Ionicons
              name="settings-outline"
              size={24}
              color="white"
              style={{ marginRight: 16 }}
              onPress={() => router.push("/(setting)/setting")}
            />
          ),
          headerStyle: {
            backgroundColor: APP_COLOR.LIGHT_PINK,
          },
          tabBarIcon: ({ color, size, focused }) => (
            <AnimatedTabIcon
              name="search"
              color={color}
              size={size}
              focused={focused}
            />
          ),
        }}
      />
      <Tabs.Screen
        name="favorites"
        options={{
          tabBarLabel: "Favorites",
          headerTitle: () => (
            <Text className="text-white text-3xl font-bold">Favorites</Text>
          ),
          headerRight: () => (
            <Ionicons
              name="settings-outline"
              size={24}
              color="white"
              style={{ marginRight: 16 }}
              onPress={() => router.push("/(setting)/setting")}
            />
          ),
          headerStyle: {
            backgroundColor: APP_COLOR.LIGHT_PINK,
          },
          tabBarIcon: ({ color, size, focused }) => (
            <AnimatedTabIcon
              name="heart"
              color={color}
              size={size}
              focused={focused}
            />
          ),
        }}
      />
      <Tabs.Screen
        name="history"
        options={{
          tabBarLabel: "History",
          headerTitle: () => (
            <Text className="text-white text-3xl font-bold">History</Text>
          ),
          headerRight: () => (
            <Ionicons
              name="settings-outline"
              size={24}
              color="white"
              style={{ marginRight: 16 }}
              onPress={() => router.push("/(setting)/setting")}
            />
          ),
          headerStyle: {
            backgroundColor: APP_COLOR.LIGHT_PINK,
          },
          tabBarIcon: ({ color, size, focused }) => (
            <AnimatedTabIcon
              name="history"
              color={color}
              size={size}
              focused={focused}
            />
          ),
        }}
      />
      <Tabs.Screen
        name="profile"
        options={{
          tabBarLabel: "Profile",
          headerTitle: "",
          headerRight: () => (
            <Ionicons
              name="settings-outline"
              size={24}
              color="white"
              style={{ marginRight: 16 }}
              onPress={() => router.push("/(setting)/setting")}
            />
          ),
          headerStyle: {
            backgroundColor: APP_COLOR.LIGHT_PINK,
          },
          tabBarIcon: ({ color, size, focused }) => (
            <AnimatedTabIcon
              name="user"
              color={color}
              size={size}
              focused={focused}
            />
          ),
        }}
      />
    </Tabs>
  );
};

export default TabLayout;
