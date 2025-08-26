import React from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
import { Link } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';

export default function Media() {
  return (
    <View style={styles.container}>
      <ScrollView>
        <Text style={styles.title}>Media & Indhold</Text>
        <Text style={styles.subtitle}>Billeder, tekst og diagnostik for din iDot-3</Text>

        <Link href="/music-visualizer" asChild>
          <TouchableOpacity style={styles.tile}>
            <Ionicons name="musical-notes" size={24} color="#00d4ff" />
            <Text style={styles.tileTitle}>Music Visualizer</Text>
            <Text style={styles.tileSubtitle}>Lyd-reaktive LED displays</Text>
          </TouchableOpacity>
        </Link>

        <Link href="/image" asChild>
          <TouchableOpacity style={styles.tile}>
            <Ionicons name="camera" size={24} color="#00d4ff" />
            <Text style={styles.tileTitle}>Billede Upload</Text>
            <Text style={styles.tileSubtitle}>Tag billede eller upload fil</Text>
          </TouchableOpacity>
        </Link>

        <Link href="/text" asChild>
          <TouchableOpacity style={styles.tile}>
            <Ionicons name="text" size={24} color="#00d4ff" />
            <Text style={styles.tileTitle}>Tekst Scroller</Text>
            <Text style={styles.tileSubtitle}>Scrollende tekst meddelelser</Text>
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