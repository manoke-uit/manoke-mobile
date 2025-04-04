import { Slot, Stack } from "expo-router";
import { Text, View } from "react-native";
import "../../global.css";
const RootLayout = () => {
  return (
    <Stack
      screenOptions={{
        headerStyle: {
          backgroundColor: "#f4511e",
        },
        headerTintColor: "#fff",
        headerTitleStyle: {
          fontWeight: "bold",
        },
      }}
    >
      <Stack.Screen
        name="index"
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
      <Stack.Screen
        name="product/index"
        options={{
          headerTitle: "San pham",
        }}
      />
    </Stack>
  );
};
export default RootLayout;
