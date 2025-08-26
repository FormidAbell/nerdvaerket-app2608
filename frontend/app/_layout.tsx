import React, { useEffect } from "react";
import { Stack } from "expo-router";
import { Platform } from "react-native";
import { useBleStore } from "../src/store/bleStore";

const colors = {
  bg: "#0b141b",
  card: "#0f2741",
  cardAlt: "#0d253d",
  text: "#e6f0ff",
  tint: "#3aa0ff",
};

export default function RootLayout() {
  const hydrate = useBleStore((s)=> s.hydrate);
  const quickReconnect = useBleStore((s)=> s.quickReconnect);
  useEffect(()=>{ (async()=>{ await hydrate(); await quickReconnect(); })(); },[]);
  
  console.log("RootLayout rendering...");

  return (
    <Stack
      screenOptions={{
        headerStyle: { backgroundColor: colors.card },
        headerTintColor: colors.text,
        contentStyle: { backgroundColor: colors.bg },
        animation: Platform.select({ ios: "default", android: "fade" }),
      }}
    >
      <Stack.Screen name="index" options={{ title: "Nerdværket" }} />
      <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
      <Stack.Screen name="connect" options={{ title: "Forbind" }} />
      <Stack.Screen name="solid" options={{ title: "Hel farve" }} />
      <Stack.Screen name="animations" options={{ title: "Animationer" }} />
      <Stack.Screen name="image" options={{ title: "Billede" }} />
      <Stack.Screen name="games/index" options={{ title: "Spil" }} />
      <Stack.Screen name="games/snake" options={{ title: "Snake Spil" }} />
      <Stack.Screen name="games/tetris" options={{ title: "Tetris Spil" }} />
      <Stack.Screen name="controls" options={{ title: "Power & Lysstyrke" }} />
      <Stack.Screen name="text" options={{ title: "Tekst" }} />
      <Stack.Screen name="status" options={{ title: "Status" }} />
      <Stack.Screen name="settings" options={{ title: "Indstillinger" }} />
      <Stack.Screen name="advanced-features" options={{ title: "Advanced Features" }} />
      <Stack.Screen name="phase4-features" options={{ title: "Phase 4 Features" }} />
      <Stack.Screen name="media-library" options={{ title: "Media Bibliotek" }} />
      
      {/* New Advanced Features */}
      <Stack.Screen name="music-visualizer" options={{ title: "Music Visualizer" }} />
      <Stack.Screen name="smart-features" options={{ title: "Smart Features" }} />
      <Stack.Screen name="gaming-hub" options={{ title: "Gaming Hub" }} />
      <Stack.Screen name="graffiti-draw" options={{ title: "Graffiti & Tegn" }} />
      <Stack.Screen name="voice-car-mode" options={{ title: "Voice & Car Mode" }} />
      <Stack.Screen name="timer-scheduler" options={{ title: "Timer & Scheduler" }} />
      <Stack.Screen name="device-groups" options={{ title: "Device Groups" }} />
      <Stack.Screen name="color-control" options={{ title: "Farve Control" }} />
    </Stack>
  );
}