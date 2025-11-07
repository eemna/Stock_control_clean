import { Stack } from "expo-router";
import { SafeAreaView } from "react-native-safe-area-context";
import { COLORS } from "@/constants/colors";

export default function RootGroupLayout() {
  return (
    <SafeAreaView
      style={{
        flex: 1,
        backgroundColor: COLORS.background,
      }}
      edges={["top"]} 
    >
      <Stack screenOptions={{ headerShown: false }} />
    </SafeAreaView>
  );
}
