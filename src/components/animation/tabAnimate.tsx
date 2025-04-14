import { Animated } from "react-native";
import { useEffect, useRef } from "react";
import { FontAwesome } from "@expo/vector-icons";
import type { BottomTabBarButtonProps } from "@react-navigation/bottom-tabs";

type AnimatedTabIconProps = {
  name: React.ComponentProps<typeof FontAwesome>["name"];
  color: string;
  size: number;
  focused: boolean;
};

const AnimatedTabIcon = ({
  name,
  color,
  size,
  focused,
}: AnimatedTabIconProps) => {
  const scale = useRef(new Animated.Value(1)).current;

  useEffect(() => {
    Animated.spring(scale, {
      toValue: focused ? 1.2 : 1,
      useNativeDriver: true,
    }).start();
  }, [focused]);

  return (
    <Animated.View style={{ transform: [{ scale }] }}>
      <FontAwesome name={name} size={size} color={color} />
    </Animated.View>
  );
};

export default AnimatedTabIcon;
