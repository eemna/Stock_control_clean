import { Stack } from "expo-router";
import { SafeAreaView } from "react-native-safe-area-context";
import { COLORS } from "@/constants/colors";

export default function RootLayout() {
  return (
    <SafeAreaView
      style={{
        flex: 1,
        backgroundColor: COLORS.background,
      }}
      edges={["top"]} // ✅ Pas d’espace en bas
    >
      <Stack screenOptions={{ headerShown: false }}>
        {/* Auth group */}
        <Stack.Screen name="(auth)" options={{ headerShown: false }} />
        {/* Main app group */}
        <Stack.Screen name="(root)" options={{ headerShown: false }} />
      </Stack>
    </SafeAreaView>
  );
}
