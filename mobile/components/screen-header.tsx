import { Ionicons } from "@expo/vector-icons";
import { router } from "expo-router";
import { StyleSheet, Text, TouchableOpacity, View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

import { COLORS } from "../constants/colors";

type ScreenHeaderProps = {
  title: string;
  titleColor?: string;
  iconColor?: string;
  style?: object;
};

export function ScreenHeader({
  title,
  titleColor = COLORS.white,
  iconColor = COLORS.white,
  style,
}: ScreenHeaderProps) {
  const insets = useSafeAreaInsets();

  return (
    <View style={[styles.row, { paddingTop: Math.max(insets.top, 8) }, style]}>
      <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
        <Ionicons name="arrow-back" size={30} color={iconColor} />
      </TouchableOpacity>
      <Text style={[styles.title, { color: titleColor }]}>{title}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  row: {
    flexDirection: "row",
    alignItems: "center",
    gap: 16,
  },
  backButton: {
    paddingVertical: 2,
  },
  title: {
    fontSize: 28,
    fontWeight: "700",
    flexShrink: 1,
  },
});
