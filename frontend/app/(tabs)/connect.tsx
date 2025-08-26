import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Platform } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

export default function Connect() {
  const [connectionStatus, setConnectionStatus] = useState('Ikke forbundet');
  const [statusColor, setStatusColor] = useState('#f87171');

  useEffect(() => {
    // On native platforms, show proper status
    if (Platform.OS !== 'web') {
      setConnectionStatus('Ikke forbundet');
      setStatusColor('#f87171');
    } else {
      setConnectionStatus('BLE ikke understøttet på web');
      setStatusColor('#fbbf24');
    }
  }, []);

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Bluetooth Forbindelse</Text>
      <Text style={styles.subtitle}>Forbind til din iDot-3 skærm</Text>
      
      <View style={styles.statusCard}>
        <Ionicons name="bluetooth" size={32} color="#00d4ff" />
        <Text style={styles.statusText}>Status: {connectionStatus}</Text>
        {Platform.OS !== 'web' && (
          <Text style={styles.infoText}>Tryk på knappen for at søge efter enheder</Text>
        )}
        {Platform.OS === 'web' && (
          <Text style={styles.infoText}>Byg APK for fuld BLE support</Text>
        )}
      </View>

      <TouchableOpacity style={styles.connectButton} disabled={Platform.OS === 'web'}>
        <Text style={styles.buttonText}>
          {Platform.OS === 'web' ? 'Ikke tilgængelig på web' : 'Søg efter enheder'}
        </Text>
      </TouchableOpacity>
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
  statusCard: {
    backgroundColor: '#1a2332',
    padding: 20,
    borderRadius: 12,
    alignItems: 'center',
    marginBottom: 20,
  },
  statusText: {
    color: '#e6f0ff',
    fontSize: 16,
    marginTop: 8,
  },
  demoText: {
    color: '#7a8ca0',
    fontSize: 14,
    marginTop: 4,
  },
  infoText: {
    color: '#7a8ca0',
    fontSize: 14,
    marginTop: 4,
  },
  connectButton: {
    backgroundColor: '#00d4ff',
    padding: 16,
    borderRadius: 8,
    alignItems: 'center',
  },
  buttonText: {
    color: '#001a2e',
    fontSize: 16,
    fontWeight: 'bold',
  },
});