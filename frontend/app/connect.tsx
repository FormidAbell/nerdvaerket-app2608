import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

export default function Connect() {
  const [isScanning, setIsScanning] = useState(false);
  const [connectedDevice, setConnectedDevice] = useState(null);

  const mockDevices = [
    { id: '1', name: 'iDot-3 Display #1', rssi: -45, isConnected: false },
    { id: '2', name: 'iDot-3 Display #2', rssi: -67, isConnected: false },
    { id: '3', name: 'LED Matrix Pro', rssi: -82, isConnected: false },
  ];

  const startScan = () => {
    setIsScanning(true);
    // Mock scan duration
    setTimeout(() => {
      setIsScanning(false);
    }, 3000);
  };

  return (
    <View style={styles.container}>
      <ScrollView>
        <Text style={styles.title}>Bluetooth Forbindelse</Text>
        <Text style={styles.subtitle}>Forbind til din iDot-3 LED skærm</Text>

        <View style={styles.statusCard}>
          <View style={styles.statusHeader}>
            <Ionicons name="bluetooth" size={32} color="#00d4ff" />
            <Text style={styles.statusTitle}>BLE Status</Text>
          </View>
          <Text style={styles.statusText}>
            {connectedDevice ? `Forbundet til ${connectedDevice}` : 'Demo Mode - Ingen enhed forbundet'}
          </Text>
          {!connectedDevice && (
            <Text style={styles.demoText}>
              BLE funktionalitet er ikke tilgængelig i Expo Go
            </Text>
          )}
        </View>

        <View style={styles.scanSection}>
          <TouchableOpacity 
            style={[styles.scanButton, isScanning && styles.scanningButton]}
            onPress={startScan}
            disabled={isScanning}
          >
            <Ionicons 
              name={isScanning ? "refresh" : "search"} 
              size={20} 
              color={isScanning ? "#7a8ca0" : "#001a2e"} 
            />
            <Text style={[styles.buttonText, isScanning && styles.scanningText]}>
              {isScanning ? 'Scanner...' : 'Søg efter enheder'}
            </Text>
          </TouchableOpacity>
        </View>

        <View style={styles.devicesSection}>
          <Text style={styles.sectionTitle}>Tilgængelige Enheder</Text>
          {mockDevices.map((device) => (
            <View key={device.id} style={styles.deviceCard}>
              <View style={styles.deviceInfo}>
                <Text style={styles.deviceName}>{device.name}</Text>
                <Text style={styles.deviceDetails}>RSSI: {device.rssi} dBm</Text>
              </View>
              <TouchableOpacity style={styles.connectButton}>
                <Text style={styles.connectButtonText}>Forbind</Text>
              </TouchableOpacity>
            </View>
          ))}
        </View>

        <View style={styles.infoCard}>
          <Ionicons name="information-circle" size={24} color="#00d4ff" />
          <View style={styles.infoContent}>
            <Text style={styles.infoTitle}>BLE Krav</Text>
            <Text style={styles.infoText}>
              • Bluetooth 4.0+ påkrævet{'\n'}
              • Enhed skal være tændt og i pairing mode{'\n'}
              • Maksimal afstand: 10 meter{'\n'}
              • Fuld funktionalitet kræver development APK
            </Text>
          </View>
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
  statusCard: {
    backgroundColor: '#1a2332',
    padding: 20,
    borderRadius: 12,
    marginBottom: 24,
  },
  statusHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  statusTitle: {
    color: '#e6f0ff',
    fontSize: 18,
    fontWeight: 'bold',
    marginLeft: 16,
  },
  statusText: {
    color: '#e6f0ff',
    fontSize: 16,
    marginBottom: 8,
  },
  demoText: {
    color: '#7a8ca0',
    fontSize: 14,
    fontStyle: 'italic',
  },
  scanSection: {
    marginBottom: 24,
  },
  scanButton: {
    backgroundColor: '#00d4ff',
    padding: 16,
    borderRadius: 8,
    alignItems: 'center',
    flexDirection: 'row',
    justifyContent: 'center',
  },
  scanningButton: {
    backgroundColor: '#1a2332',
  },
  buttonText: {
    color: '#001a2e',
    fontSize: 16,
    fontWeight: 'bold',
    marginLeft: 8,
  },
  scanningText: {
    color: '#7a8ca0',
  },
  devicesSection: {
    marginBottom: 24,
  },
  sectionTitle: {
    color: '#e6f0ff',
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 16,
  },
  deviceCard: {
    backgroundColor: '#1a2332',
    padding: 16,
    borderRadius: 8,
    marginBottom: 12,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  deviceInfo: {
    flex: 1,
  },
  deviceName: {
    color: '#e6f0ff',
    fontSize: 16,
    fontWeight: 'bold',
  },
  deviceDetails: {
    color: '#7a8ca0',
    fontSize: 14,
    marginTop: 4,
  },
  connectButton: {
    backgroundColor: '#00d4ff',
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderRadius: 6,
  },
  connectButtonText: {
    color: '#001a2e',
    fontSize: 14,
    fontWeight: 'bold',
  },
  infoCard: {
    backgroundColor: '#1a2332',
    padding: 20,
    borderRadius: 12,
    flexDirection: 'row',
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
});