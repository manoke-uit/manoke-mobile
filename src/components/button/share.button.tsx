import {
  Pressable,
  StyleProp,
  StyleSheet,
  Text,
  TextStyle,
  View,
  ViewStyle,
} from "react-native";
import { ReactNode } from "react";
import { APP_COLOR } from "@/utils/constant";

const styles = StyleSheet.create({
  btnContainer: {
    borderWidth: 1,
    borderRadius: 10,
    paddingHorizontal: 15,
    paddingVertical: 10,
    flexDirection: "row",
    gap: 10,
    alignItems: "center",
    backgroundColor: APP_COLOR.ORANGE,
    // alignSelf: "flex-start",
  },
});

interface IProps {
  title: string;
  onPress: () => void;
  icon?: ReactNode;
  textStyle?: StyleProp<TextStyle>;
  btnStyle?: StyleProp<ViewStyle>;
  pressStyle?: StyleProp<ViewStyle>;
}
const ShareButton = (props: IProps) => {
  const { title, onPress, icon, textStyle, btnStyle, pressStyle } = props;
  return (
    <Pressable
      style={({ pressed }) => [
        {
          opacity: pressed === true ? 0.5 : 1,
          alignSelf: "flex-start", //fit-content
        },
        pressStyle,
      ]}
      onPress={onPress}
    >
      <View style={[styles.btnContainer, btnStyle]}>
        {icon}
        <Text style={textStyle}>{title}</Text>
      </View>
    </Pressable>
  );
};

export default ShareButton;
