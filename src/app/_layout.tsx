import { Slot, Stack } from "expo-router";
import "../../global.css";
import Toast from "react-native-toast-message";
import AppProvider from "./context/appContext";
import { NotificationProvider } from "@/contexts/NotificationContext";

const RootLayout = () => {
  return (
    <AppProvider>
      <NotificationProvider>
        <Stack
          screenOptions={{
            headerStyle: {
              backgroundColor: "#f4511e",
            },
            headerTintColor: "#fff",
            headerTitleStyle: {
              fontWeight: "bold",
            },
            headerShown: false,
          }}
          initialRouteName="index"
        >
          <Stack.Screen
            name="index"
            options={{
              headerShown: false,
            }}
          />
          <Stack.Screen
            name="(auth)/start"
            options={{
              headerShown: false,
            }}
          />
          <Stack.Screen
            name="(auth)/signin"
            options={{
              headerShown: false,
            }}
          />
          <Stack.Screen
            name="(auth)/signup"
            options={{
              headerShown: false,
            }}
          />
          <Stack.Screen
            name="(tabs)"
            options={{
              headerTitle: "Trang chủ",
            }}
          />
          <Stack.Screen
            name="(user)/record"
            options={{
              animation: "slide_from_right",
              gestureEnabled: true,
            }}
          />
          <Stack.Screen
            name="(user)/playlist"
            options={{
              animation: "slide_from_right",
              gestureEnabled: true,
            }}
          />
          <Stack.Screen
            name="(user)/songItem"
            options={{
              animation: "slide_from_right",
              gestureEnabled: true,
            }}
          />
          <Stack.Screen
            name="(setting)/setting"
            options={{
              animation: "slide_from_right",
              gestureEnabled: true,
            }}
          />
          <Stack.Screen
            name="(setting)/account"
            options={{
              animation: "slide_from_right",
              gestureEnabled: true,
            }}
          />
          <Stack.Screen
            name="(setting)/changePassword"
            options={{
              animation: "slide_from_right",
              gestureEnabled: true,
            }}
          />
          <Stack.Screen
            name="(setting)/changeProfile"
            options={{
              animation: "slide_from_right",
              gestureEnabled: true,
            }}
          />
          <Stack.Screen
            name="(setting)/changeUsername"
            options={{
              animation: "slide_from_right",
              gestureEnabled: true,
            }}
          />
          <Stack.Screen
            name="(user)/yourSong"
            options={{
              animation: "slide_from_right",
              gestureEnabled: true,
            }}
          />
          <Stack.Screen
            name="(user)/addSong"
            options={{
              animation: "slide_from_right",
              gestureEnabled: true,
            }}
          />
          <Stack.Screen
            name="(setting)/noti"
            options={{
              animation: "slide_from_right",
              gestureEnabled: true,
            }}
          />
        </Stack>
        <Toast />
      </NotificationProvider>
    </AppProvider>
  );
};

export default RootLayout;
