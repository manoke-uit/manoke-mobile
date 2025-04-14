import React, { useRef } from "react";
import { Animated, ViewStyle } from "react-native";
import { useFocusEffect } from "@react-navigation/native";

type AnimatedWrapperProps = {
  children: React.ReactNode;
  style?: ViewStyle;
  fade?: boolean;
  scale?: boolean;
  slideUp?: boolean;
};

const AnimatedWrapper = ({
  children,
  style,
  fade = true,
  scale = false,
  slideUp = false,
}: AnimatedWrapperProps) => {
  const opacity = useRef(new Animated.Value(0)).current;
  const scaleAnim = useRef(new Animated.Value(0.95)).current;
  const translateY = useRef(new Animated.Value(40)).current;

  useFocusEffect(
    React.useCallback(() => {
      const animations = [];

      if (fade) {
        opacity.setValue(0);
        animations.push(
          Animated.timing(opacity, {
            toValue: 1,
            duration: 350,
            useNativeDriver: true,
          })
        );
      }

      if (scale) {
        scaleAnim.setValue(0.95);
        animations.push(
          Animated.spring(scaleAnim, {
            toValue: 1,
            useNativeDriver: true,
            damping: 10,
            stiffness: 80,
          })
        );
      }

      if (slideUp) {
        translateY.setValue(40);
        animations.push(
          Animated.timing(translateY, {
            toValue: 0,
            duration: 350,
            useNativeDriver: true,
          })
        );
      }

      Animated.parallel(animations).start();

      return () => {
        if (fade) opacity.setValue(0);
        if (scale) scaleAnim.setValue(0.95);
        if (slideUp) translateY.setValue(40);
      };
    }, [])
  );

  const animatedStyle = {
    ...(fade && { opacity }),
    ...(scale && { transform: [{ scale: scaleAnim }] }),
    ...(slideUp && { transform: [{ translateY }] }),
    ...(scale &&
      slideUp && {
        transform: [{ scale: scaleAnim }, { translateY }],
      }),
  };

  return (
    <Animated.View style={[style, animatedStyle]}>{children}</Animated.View>
  );
};

export default AnimatedWrapper;
