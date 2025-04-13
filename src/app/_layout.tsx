import { Slot, Stack } from "expo-router";
import { Text, TouchableOpacity, View } from "react-native";
import "../../global.css";
import Toast from "react-native-toast-message";
const RootLayout = () => {
  return (
    <>
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
            headerTitle: "Trang chu",
          }}
        />

        <Stack.Screen name="(user)/record" />

        <Stack.Screen name="(user)/playlist" />
      </Stack>
      <Toast />
    </>
  );
};
export default RootLayout;
