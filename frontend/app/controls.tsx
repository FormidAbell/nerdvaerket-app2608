import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Switch } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

export default function Controls() {
  const [isOn, setIsOn] = useState(true);
  const [brightness, setBrightness] = useState(75);

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Power & Lysstyrke</Text>
      <Text style={styles.subtitle}>Grundlæggende kontroller for LED skærmen</Text>

      <View style={styles.powerCard}>
        <View style={styles.powerHeader}>
          <Ionicons name="power" size={32} color={isOn ? '#4ade80' : '#7a8ca0'} />
          <Text style={styles.powerTitle}>LED Skærm</Text>
        </View>
        <Switch
          value={isOn}
          onValueChange={setIsOn}
          trackColor={{ false: '#7a8ca0', true: '#4ade80' }}
        />
      </View>

      <View style={styles.brightnessCard}>
        <Text style={styles.sectionTitle}>Lysstyrke</Text>
        <Text style={styles.brightnessValue}>{brightness}%</Text>
        
        <View style={styles.brightnessSlider}>
          <View style={styles.sliderTrack}>
            <View style={[styles.sliderFill, { width: `${brightness}%` }]} />
            <View style={[styles.sliderThumb, { left: `${brightness - 2}%` }]} />
          </View>
        </View>

        <View style={styles.brightnessButtons}>
          <TouchableOpacity 
            style={styles.brightnessButton}
            onPress={() => setBrightness(Math.max(0, brightness - 10))}
          >
            <Ionicons name="remove" size={20} color="#00d4ff" />
          </TouchableOpacity>
          
          <TouchableOpacity 
            style={styles.presetButton}
            onPress={() => setBrightness(25)}
          >
            <Text style={styles.presetText}>25%</Text>
          </TouchableOpacity>
          
          <TouchableOpacity 
            style={styles.presetButton}
            onPress={() => setBrightness(50)}
          >
            <Text style={styles.presetText}>50%</Text>
          </TouchableOpacity>
          
          <TouchableOpacity 
            style={styles.presetButton}
            onPress={() => setBrightness(100)}
          >
            <Text style={styles.presetText}>100%</Text>
          </TouchableOpacity>

          <TouchableOpacity 
            style={styles.brightnessButton}
            onPress={() => setBrightness(Math.min(100, brightness + 10))}
          >
            <Ionicons name="add" size={20} color="#00d4ff" />
          </TouchableOpacity>
        </View>
      </View>

      <View style={styles.quickActions}>
        <Text style={styles.sectionTitle}>Hurtige Handlinger</Text>
        
        <TouchableOpacity style={styles.actionButton}>
          <Ionicons name="moon" size={24} color="#00d4ff" />
          <Text style={styles.actionText}>Nat Mode</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.actionButton}>
          <Ionicons name="sunny" size={24} color="#00d4ff" />
          <Text style={styles.actionText}>Dag Mode</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.actionButton}>
          <Ionicons name="refresh" size={24} color="#00d4ff" />
          <Text style={styles.actionText}>Genstart Skærm</Text>
        </TouchableOpacity>
      </View>

      <TouchableOpacity style={styles.applyButton}>
        <Ionicons name="checkmark-circle" size={20} color="#001a2e" />
        <Text style={styles.buttonText}>Anvend Indstillinger</Text>
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
  powerCard: {
    backgroundColor: '#1a2332',
    padding: 20,
    borderRadius: 12,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 24,
  },
  powerHeader: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  powerTitle: {
    color: '#e6f0ff',
    fontSize: 20,
    fontWeight: 'bold',
    marginLeft: 16,
  },
  brightnessCard: {
    backgroundColor: '#1a2332',
    padding: 20,
    borderRadius: 12,
    marginBottom: 24,
  },
  sectionTitle: {
    color: '#e6f0ff',
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 16,
  },
  brightnessValue: {
    color: '#00d4ff',
    fontSize: 24,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 20,
  },
  brightnessSlider: {
    marginBottom: 20,
  },
  sliderTrack: {
    height: 6,
    backgroundColor: '#7a8ca0',
    borderRadius: 3,
    position: 'relative',
  },
  sliderFill: {
    height: '100%',
    backgroundColor: '#00d4ff',
    borderRadius: 3,
  },
  sliderThumb: {
    position: 'absolute',
    top: -6,
    width: 18,
    height: 18,
    borderRadius: 9,
    backgroundColor: '#00d4ff',
  },
  brightnessButtons: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  brightnessButton: {
    backgroundColor: 'rgba(0, 212, 255, 0.2)',
    padding: 12,
    borderRadius: 8,
  },
  presetButton: {
    backgroundColor: 'rgba(0, 212, 255, 0.1)',
    paddingVertical: 8,
    paddingHorizontal: 12,
    borderRadius: 6,
  },
  presetText: {
    color: '#00d4ff',
    fontSize: 14,
    fontWeight: 'bold',
  },
  quickActions: {
    backgroundColor: '#1a2332',
    padding: 20,
    borderRadius: 12,
    marginBottom: 24,
  },
  actionButton: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 12,
    paddingHorizontal: 16,
    backgroundColor: 'rgba(0, 212, 255, 0.1)',
    borderRadius: 8,
    marginBottom: 12,
  },
  actionText: {
    color: '#00d4ff',
    fontSize: 16,
    marginLeft: 12,
  },
  applyButton: {
    backgroundColor: '#00d4ff',
    padding: 16,
    borderRadius: 8,
    alignItems: 'center',
    flexDirection: 'row',
    justifyContent: 'center',
  },
  buttonText: {
    color: '#001a2e',
    fontSize: 16,
    fontWeight: 'bold',
    marginLeft: 8,
  },
});