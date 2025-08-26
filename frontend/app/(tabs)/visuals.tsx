import React from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
import { Link } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';

export default function Visuals() {
  return (
    <View style={styles.container}>
      <ScrollView>
        <Text style={styles.title}>Visuelle Kontroller</Text>
        <Text style={styles.subtitle}>Styr farver og effekter på din LED skærm</Text>

        <Link href="/solid" asChild>
          <TouchableOpacity style={styles.tile}>
            <Ionicons name="color-fill" size={24} color="#00d4ff" />
            <Text style={styles.tileTitle}>Hel Farve</Text>
            <Text style={styles.tileSubtitle}>Sæt en ensfarvet baggrund</Text>
          </TouchableOpacity>
        </Link>

        <Link href="/animations" asChild>
          <TouchableOpacity style={styles.tile}>
            <Ionicons name="play-circle" size={24} color="#00d4ff" />
            <Text style={styles.tileTitle}>Animationer</Text>
            <Text style={styles.tileSubtitle}>Forskellige LED effekter</Text>
          </TouchableOpacity>
        </Link>

        <Link href="/graffiti-draw" asChild>
          <TouchableOpacity style={styles.tile}>
            <Ionicons name="brush" size={24} color="#00d4ff" />
            <Text style={styles.tileTitle}>Graffiti & Tegn</Text>
            <Text style={styles.tileSubtitle}>Tegn på LED skærmen</Text>
          </TouchableOpacity>
        </Link>

        <Link href="/controls" asChild>
          <TouchableOpacity style={styles.tile}>
            <Ionicons name="settings" size={24} color="#00d4ff" />
            <Text style={styles.tileTitle}>Power & Lysstyrke</Text>
            <Text style={styles.tileSubtitle}>Grundlæggende kontroller</Text>
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