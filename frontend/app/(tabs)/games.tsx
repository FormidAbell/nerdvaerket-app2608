import React from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
import { Link } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';

export default function Games() {
  return (
    <View style={styles.container}>
      <ScrollView>
        <Text style={styles.title}>Spil & Underholdning</Text>
        <Text style={styles.subtitle}>Klassiske spil på din LED skærm</Text>

        <Link href="/games/snake" asChild>
          <TouchableOpacity style={styles.tile}>
            <Ionicons name="apps" size={24} color="#00d4ff" />
            <Text style={styles.tileTitle}>Snake</Text>
            <Text style={styles.tileSubtitle}>Klassisk slange spil</Text>
          </TouchableOpacity>
        </Link>

        <Link href="/games/tetris" asChild>
          <TouchableOpacity style={styles.tile}>
            <Ionicons name="grid" size={24} color="#00d4ff" />
            <Text style={styles.tileTitle}>Tetris</Text>
            <Text style={styles.tileSubtitle}>Faldende blokke</Text>
          </TouchableOpacity>
        </Link>

        <Link href="/gaming-hub" asChild>
          <TouchableOpacity style={styles.tile}>
            <Ionicons name="game-controller" size={24} color="#00d4ff" />
            <Text style={styles.tileTitle}>Gaming Hub</Text>
            <Text style={styles.tileSubtitle}>Alle spil på ét sted</Text>
          </TouchableOpacity>
        </Link>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#0b141b',
    padding: 20,
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#e6f0ff',
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 16,
    color: '#7a8ca0',
    marginBottom: 32,
  },
  tile: {
    backgroundColor: '#1a2332',
    padding: 20,
    borderRadius: 12,
    marginBottom: 16,
    flexDirection: 'row',
    alignItems: 'center',
  },
  tileTitle: {
    color: '#e6f0ff',
    fontSize: 18,
    fontWeight: 'bold',
    marginLeft: 16,
    flex: 1,
  },
  tileSubtitle: {
    color: '#7a8ca0',
    fontSize: 14,
    marginTop: 4,
  },
});