import React from 'react';
import { View, Text, StyleSheet, ScrollView, Platform } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

export default function Status() {
  const getBleStatus = () => {
    if (Platform.OS === 'web') {
      return { status: 'Ikke understøttet på web', color: 'warning' };
    }
    return { status: 'Ikke forbundet', color: 'error' };
  };

  const bleStatus = getBleStatus();
  
  const statusItems = [
    { label: 'App Version', value: '1.0.0', icon: 'information-circle', status: 'info' },
    { label: 'BLE Status', value: bleStatus.status, icon: 'bluetooth', status: bleStatus.color },
    { label: 'Device', value: 'Ikke forbundet', icon: 'phone-portrait', status: 'error' },
    { label: 'Backend', value: 'Tilgængelig', icon: 'server', status: 'success' },
    { label: 'Hukommelse', value: '45MB / 128MB', icon: 'hardware-chip', status: 'info' },
    { label: 'Netværk', value: 'WiFi forbundet', icon: 'wifi', status: 'success' },
  ];

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'success': return '#4ade80';
      case 'warning': return '#fbbf24';
      case 'error': return '#f87171';
      default: return '#00d4ff';
    }
  };

  return (
    <View style={styles.container}>
      <ScrollView>
        <Text style={styles.title}>Status & Diagnostik</Text>
        <Text style={styles.subtitle}>System information og forbindelsesstatus</Text>

        <View style={styles.statusGrid}>
          {statusItems.map((item, index) => (
            <View key={index} style={styles.statusCard}>
              <View style={styles.statusHeader}>
                <Ionicons 
                  name={item.icon as any} 
                  size={24} 
                  color={getStatusColor(item.status)} 
                />
                <View style={[styles.statusIndicator, { backgroundColor: getStatusColor(item.status) }]} />
              </View>
              <Text style={styles.statusLabel}>{item.label}</Text>
              <Text style={[styles.statusValue, { color: getStatusColor(item.status) }]}>
                {item.value}
              </Text>
            </View>
          ))}
        </View>

        <View style={styles.infoCard}>
          <Ionicons name="information-circle" size={24} color="#00d4ff" />
          <View style={styles.infoContent}>
            <Text style={styles.infoTitle}>BLE Information</Text>
            <Text style={styles.infoText}>
              {Platform.OS === 'web' 
                ? 'Bluetooth funktionalitet er ikke tilgængelig på web. Byg en APK for fuld BLE support.'
                : 'Tryk på "Søg efter enheder" i Connect-fanen for at forbinde til din iDot-3 skærm.'
              }
            </Text>
          </View>
        </View>

        <View style={styles.debugCard}>
          <Text style={styles.debugTitle}>Debug Information</Text>
          <Text style={styles.debugText}>Platform: {Platform.OS}</Text>
          <Text style={styles.debugText}>Expo SDK: 53.0.0</Text>
          <Text style={styles.debugText}>React Native: 0.79.5</Text>
          <Text style={styles.debugText}>Environment: Development</Text>
        </View>
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
  statusGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    marginBottom: 24,
  },
  statusCard: {
    backgroundColor: '#1a2332',
    padding: 16,
    borderRadius: 12,
    width: '48%',
    marginBottom: 16,
  },
  statusHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 12,
  },
  statusIndicator: {
    width: 8,
    height: 8,
    borderRadius: 4,
  },
  statusLabel: {
    color: '#7a8ca0',
    fontSize: 14,
    marginBottom: 4,
  },
  statusValue: {
    fontSize: 16,
    fontWeight: 'bold',
  },
  infoCard: {
    backgroundColor: '#1a2332',
    padding: 20,
    borderRadius: 12,
    flexDirection: 'row',
    marginBottom: 24,
  },
  infoContent: {
    flex: 1,
    marginLeft: 16,
  },
  infoTitle: {
    color: '#e6f0ff',
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 8,
  },
  infoText: {
    color: '#7a8ca0',
    fontSize: 14,
    lineHeight: 20,
  },
  debugCard: {
    backgroundColor: '#1a2332',
    padding: 20,
    borderRadius: 12,
  },
  debugTitle: {
    color: '#e6f0ff',
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 12,
  },
  debugText: {
    color: '#7a8ca0',
    fontSize: 14,
    marginBottom: 4,
    fontFamily: 'monospace',
  },
});