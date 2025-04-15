import { router, Tabs } from "expo-router";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import { Text } from "react-native";
import { APP_COLOR } from "@/utils/constant";
import AnimatedTabIcon from "@/components/animation/tabAnimate";

const TabLayout = () => {
  return (
    <Tabs
      screenOptions={{
        headerShown: true,
        tabBarStyle: {
          backgroundColor: APP_COLOR.BLACK, 
          borderTopWidth: 0,
          elevation: 0, 
          height: 70, 
          borderTopLeftRadius: 20,
          borderTopRightRadius: 20,
          overflow: "hidden",
          position: "absolute", 
        },
        
        tabBarActiveTintColor: APP_COLOR.PINK,
        tabBarInactiveTintColor: "#888",
        tabBarLabelStyle: {
          fontSize: 12,
          fontWeight: "600",
        },
      }}
    >
      <Tabs.Screen
        name="home"
        options={{
          tabBarLabel: "Home",
          headerTitle: () => (
            <Text 
              style={{ paddingTop: 70, marginBottom: 40 }}
              className="text-white text-3xl font-bold"
            >
                Discover
            </Text>
          ),
          headerShadowVisible: false,
          headerRight: () => (
            <MaterialCommunityIcons
              name="cog-outline"
              size={24}
              color="white"
              style={{ marginRight: 16 }}
              onPress={() => router.push("/(setting)/setting")}
            />
          ),
          headerStyle: {
            backgroundColor: APP_COLOR.LT_PINK,
            elevation: 0,
            shadowOpacity: 0,
            borderBottomWidth: 0,
          },
          tabBarIcon: ({ color, size, focused }) => (
            <MaterialCommunityIcons
              name={focused ? "home-variant" : "home-variant-outline"}
              color={color}
              size={size + 2}
            />
          ),
        }}
      />
      <Tabs.Screen
        name="search"
        options={{
          tabBarLabel: "Search",
          headerTitle: () => (
            <Text 
              style={{ paddingTop: 70, marginBottom: 40 }}
              className="text-white text-3xl font-bold"
            >
              Search
            </Text>
          ),
          headerRight: () => (
            <MaterialCommunityIcons
              name="cog-outline"
              size={24}
              color="white"
              style={{ marginRight: 16 }}
              onPress={() => router.push("/(setting)/setting")}
            />
          ),
          headerShadowVisible: false,
          headerStyle: {
            backgroundColor: APP_COLOR.LIGHT_PINK,
            elevation: 0,
            shadowOpacity: 0,
            borderBottomWidth: 0,
          },
          tabBarIcon: ({ color, size, focused }) => (
            <MaterialCommunityIcons
              name={focused ? "magnify" : "magnify"}
              color={color}
              size={size + 2}
            />
          ),
        }}
      />
      <Tabs.Screen
        name="favorites"
        options={{
          tabBarLabel: "Favorites",
          headerTitle: () => (
            <Text 
              style={{ paddingTop: 70, marginBottom: 40 }}
              className="text-white text-3xl font-bold"
            >
              Favorites
            </Text>
          ),
          headerRight: () => (
            <MaterialCommunityIcons
              name="cog-outline"
              size={24}
              color="white"
              style={{ marginRight: 16 }}
              onPress={() => router.push("/(setting)/setting")}
            />
          ),
          headerShadowVisible: false,
          headerStyle: {
            backgroundColor: APP_COLOR.LIGHT_PINK,
            elevation: 0,
            shadowOpacity: 0,
            borderBottomWidth: 0,
          },
          tabBarIcon: ({ color, size, focused }) => (
            <MaterialCommunityIcons
              name={focused ? "heart" : "heart-outline"}
              color={color}
              size={size + 2}
            />
          ),
        }}
      />
      <Tabs.Screen
        name="history"
        options={{
          tabBarLabel: "History",
          headerTitle: () => (
            <Text 
              style={{ paddingTop: 70, marginBottom: 40 }}
              className="text-white text-3xl font-bold"
            >
              History
            </Text>
          ),
          headerRight: () => (
            <MaterialCommunityIcons
              name="cog-outline"
              size={24}
              color="white"
              style={{ marginRight: 16 }}
              onPress={() => router.push("/(setting)/setting")}
            />
          ),
          headerShadowVisible: false,
          headerStyle: {
            backgroundColor: APP_COLOR.LIGHT_PINK,
            elevation: 0,
            shadowOpacity: 0,
            borderBottomWidth: 0,
          },
          tabBarIcon: ({ color, size, focused }) => (
            <MaterialCommunityIcons
              name={focused ? "history" : "history"}
              color={color}
              size={size + 2}
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
            <MaterialCommunityIcons
              name="cog-outline"
              size={24}
              color="white"
              style={{ marginRight: 16 }}
              onPress={() => router.push("/(setting)/setting")}
            />
          ),
          headerShadowVisible: false,
          headerStyle: {
            backgroundColor: APP_COLOR.LIGHT_PINK,
            elevation: 0,
            shadowOpacity: 0,
            borderBottomWidth: 0,
          },
          tabBarIcon: ({ color, size, focused }) => (
            <MaterialCommunityIcons
              name={focused ? "account-circle" : "account-circle-outline"}
              color={color}
              size={size + 2}
            />
          ),
        }}
      />
    </Tabs>
  );
};

export default TabLayout;
