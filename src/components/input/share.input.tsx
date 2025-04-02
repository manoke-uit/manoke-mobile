import { APP_COLOR } from "@/utils/constant";
import {
  KeyboardType,
  KeyboardTypeOptions,
  StyleSheet,
  Text,
  TextInput,
  View,
} from "react-native";

const styles = StyleSheet.create({
  inputGroup: {
    padding: 5,
    gap: 10,
  },
  text: {
    fontSize: 20,
    fontWeight: "600",
  },
  input: {
    borderColor: "green",
    borderWidth: 1,
    paddingHorizontal: 7,
    paddingVertical: 10,
    borderRadius: 5,
  },
});

interface IProps {
  title?: string;
  keyboardType?: KeyboardTypeOptions;
}
const ShareInput = (props: IProps) => {
  const { title, keyboardType } = props;
  return (
    <View style={styles.inputGroup}>
      {title && <Text style={styles.text}>{title}</Text>}
      <TextInput
        onFocus={() => {}}
        onBlur={() => {}}
        style={[styles.input, { borderColor: APP_COLOR.ORANGE }]}
        keyboardType={keyboardType}
      />
    </View>
  );
};
export default ShareInput;
