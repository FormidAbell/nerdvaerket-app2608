import React from "react";
import { Stack } from "expo-router";
import { Platform } from "react-native";

const colors = { bg: "#0b141b", card: "#0f2741", cardAlt: "#0d253d", text: "#e6f0ff", tint: "#3aa0ff" };

export default function GamesLayout(){
  return (
    <Stack screenOptions={{
      headerStyle: { backgroundColor: colors.card },
      headerTintColor: colors.text,
      contentStyle: { backgroundColor: colors.bg },
      animation: Platform.select({ ios: 'default', android: 'fade' })
    }}>
      <Stack.Screen name="index" options={{ title: 'Spil' }} />
      <Stack.Screen name="snake" options={{ title: 'Snake' }} />
      <Stack.Screen name="tetris" options={{ title: 'Tetris' }} />
    </Stack>
  );
}