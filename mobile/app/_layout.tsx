import { Stack } from "expo-router";
import { StatusBar } from "expo-status-bar";
import { SafeAreaProvider } from "react-native-safe-area-context";

import { BiometricLockProvider } from "../src/auth/biometric-lock";

export default function RootLayout() {
  return (
    <SafeAreaProvider>
      <BiometricLockProvider>
        <Stack screenOptions={{ headerShown: false }} />
        <StatusBar style="auto" />
      </BiometricLockProvider>
    </SafeAreaProvider>
  );
}
