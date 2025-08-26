import React from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
import { Link } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';

export default function Settings() {
  return (
    <View style={styles.container}>
      <ScrollView>
        <Text style={styles.title}>Indstillinger</Text>
        <Text style={styles.subtitle}>App konfiguration og avancerede funktioner</Text>

        <Link href="/advanced-features" asChild>
          <TouchableOpacity style={styles.tile}>
            <Ionicons name="construct" size={24} color="#00d4ff" />
            <Text style={styles.tileTitle}>Avancerede Funktioner</Text>
            <Text style={styles.tileSubtitle}>DIY Editor og Musik/Mikrofon</Text>
          </TouchableOpacity>
        </Link>

        <Link href="/smart-features" asChild>
          <TouchableOpacity style={styles.tile}>
            <Ionicons name="phone-portrait" size={24} color="#00d4ff" />
            <Text style={styles.tileTitle}>Smart Features</Text>
            <Text style={styles.tileSubtitle}>Notifikationer og integrationer</Text>
          </TouchableOpacity>
        </Link>

        <Link href="/voice-car-mode" asChild>
          <TouchableOpacity style={styles.tile}>
            <Ionicons name="mic" size={24} color="#00d4ff" />
            <Text style={styles.tileTitle}>Voice & Car Mode</Text>
            <Text style={styles.tileSubtitle}>Stemmekommandoer og bil integration</Text>
          </TouchableOpacity>
        </Link>

        <Link href="/timer-scheduler" asChild>
          <TouchableOpacity style={styles.tile}>
            <Ionicons name="time" size={24} color="#00d4ff" />
            <Text style={styles.tileTitle}>Timer & Scheduler</Text>
            <Text style={styles.tileSubtitle}>Tidsplanlægning og automatisering</Text>
          </TouchableOpacity>
        </Link>

        <Link href="/device-groups" asChild>
          <TouchableOpacity style={styles.tile}>
            <Ionicons name="layers" size={24} color="#00d4ff" />
            <Text style={styles.tileTitle}>Device Groups</Text>
            <Text style={styles.tileSubtitle}>Multi-device synkronisering</Text>
          </TouchableOpacity>
        </Link>

        <Link href="/status" asChild>
          <TouchableOpacity style={styles.tile}>
            <Ionicons name="information-circle" size={24} color="#00d4ff" />
            <Text style={styles.tileTitle}>Status & Diagnostik</Text>
            <Text style={styles.tileSubtitle}>Device info og BLE status</Text>
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