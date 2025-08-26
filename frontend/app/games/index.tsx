import React from "react";
import { Link } from "expo-router";
import { View, Text, StyleSheet, TouchableOpacity } from "react-native";

const colors = { bg: "#0b141b", card: "#0f2741", cardAlt: "#0d253d", text: "#e6f0ff", tint: "#3aa0ff" };

export default function GamesIndex(){
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Spil</Text>
      <Link href="/games/snake" asChild>
        <TouchableOpacity style={styles.item}><Text style={styles.text}>Snake</Text></TouchableOpacity>
      </Link>
      {/* Tetris kan tilføjes her senere */}
    </View>
  );
}

const styles = StyleSheet.create({
  container:{ flex:1, backgroundColor: colors.bg, padding: 16 },
  title:{ color: colors.text, fontSize: 22, fontWeight:'700', marginBottom: 12 },
  item:{ backgroundColor: colors.card, padding: 14, borderRadius: 12, marginBottom: 10 },
  text:{ color: colors.text, fontWeight:'600' },
});