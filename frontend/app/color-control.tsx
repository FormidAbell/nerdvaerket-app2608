import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Switch } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

export default function ColorControl() {
  const [selectedMode, setSelectedMode] = useState('rgb');
  const [rgbValues, setRgbValues] = useState({ r: 255, g: 0, b: 0 });
  const [hsvValues, setHsvValues] = useState({ h: 0, s: 100, v: 100 });
  const [cctValue, setCctValue] = useState(3000);
  const [gamma, setGamma] = useState(1.0);

  const colorModes = [
    { id: 'rgb', name: 'RGB', description: 'Rød, Grøn, Blå' },
    { id: 'hsv', name: 'HSV', description: 'Hue, Saturation, Value' },
    { id: 'cct', name: 'CCT', description: 'Correlated Color Temperature' },
    { id: 'rgbw', name: 'RGBW', description: 'RGB + Hvid' },
  ];

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Farve Kontrol</Text>
      <Text style={styles.subtitle}>Avanceret farve manipulation</Text>

      <View style={styles.modeSelector}>
        <Text style={styles.sectionTitle}>Farve Mode</Text>
        {colorModes.map((mode) => (
          <TouchableOpacity
            key={mode.id}
            style={[
              styles.modeButton,
              selectedMode === mode.id && styles.selectedModeButton
            ]}
            onPress={() => setSelectedMode(mode.id)}
          >
            <Text style={[
              styles.modeText,
              selectedMode === mode.id && styles.selectedModeText
            ]}>
              {mode.name}
            </Text>
            <Text style={[
              styles.modeDescription,
              selectedMode === mode.id && styles.selectedModeDescription
            ]}>
              {mode.description}
            </Text>
          </TouchableOpacity>
        ))}
      </View>

      {selectedMode === 'rgb' && (
        <View style={styles.controlSection}>
          <Text style={styles.sectionTitle}>RGB Værdier</Text>
          <View style={styles.sliderGroup}>
            <Text style={styles.sliderLabel}>Rød: {rgbValues.r}</Text>
            <View style={styles.slider}>
              <View style={[styles.sliderFill, { width: `${(rgbValues.r / 255) * 100}%`, backgroundColor: '#ff0000' }]} />
            </View>
          </View>
          <View style={styles.sliderGroup}>
            <Text style={styles.sliderLabel}>Grøn: {rgbValues.g}</Text>
            <View style={styles.slider}>
              <View style={[styles.sliderFill, { width: `${(rgbValues.g / 255) * 100}%`, backgroundColor: '#00ff00' }]} />
            </View>
          </View>
          <View style={styles.sliderGroup}>
            <Text style={styles.sliderLabel}>Blå: {rgbValues.b}</Text>
            <View style={styles.slider}>
              <View style={[styles.sliderFill, { width: `${(rgbValues.b / 255) * 100}%`, backgroundColor: '#0000ff' }]} />
            </View>
          </View>
        </View>
      )}

      {selectedMode === 'cct' && (
        <View style={styles.controlSection}>
          <Text style={styles.sectionTitle}>Farvetemperatur</Text>
          <View style={styles.sliderGroup}>
            <Text style={styles.sliderLabel}>CCT: {cctValue}K</Text>
            <View style={styles.slider}>
              <View style={[styles.sliderFill, { width: `${((cctValue - 1000) / 9000) * 100}%`, backgroundColor: '#ffa500' }]} />
            </View>
          </View>
        </View>
      )}

      <View style={styles.controlSection}>
        <Text style={styles.sectionTitle}>Gamma Korrektion</Text>
        <View style={styles.sliderGroup}>
          <Text style={styles.sliderLabel}>Gamma: {gamma.toFixed(1)}</Text>
          <View style={styles.slider}>
            <View style={[styles.sliderFill, { width: `${((gamma - 0.5) / 2.5) * 100}%`, backgroundColor: '#00d4ff' }]} />
          </View>
        </View>
      </View>

      <View style={[styles.preview, { backgroundColor: `rgb(${rgbValues.r}, ${rgbValues.g}, ${rgbValues.b})` }]}>
        <Text style={styles.previewText}>Forhåndsvisning</Text>
      </View>

      <TouchableOpacity style={styles.applyButton}>
        <Ionicons name="checkmark-circle" size={20} color="#001a2e" />
        <Text style={styles.buttonText}>Anvend Farve</Text>
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
  modeSelector: {
    marginBottom: 24,
  },
  sectionTitle: {
    color: '#e6f0ff',
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 16,
  },
  modeButton: {
    backgroundColor: '#1a2332',
    padding: 16,
    borderRadius: 8,
    marginBottom: 8,
  },
  selectedModeButton: {
    backgroundColor: '#00d4ff',
  },
  modeText: {
    color: '#e6f0ff',
    fontSize: 16,
    fontWeight: 'bold',
  },
  selectedModeText: {
    color: '#001a2e',
  },
  modeDescription: {
    color: '#7a8ca0',
    fontSize: 14,
    marginTop: 4,
  },
  selectedModeDescription: {
    color: 'rgba(0, 26, 46, 0.7)',
  },
  controlSection: {
    marginBottom: 24,
  },
  sliderGroup: {
    marginBottom: 16,
  },
  sliderLabel: {
    color: '#e6f0ff',
    fontSize: 16,
    marginBottom: 8,
  },
  slider: {
    height: 8,
    backgroundColor: '#1a2332',
    borderRadius: 4,
    overflow: 'hidden',
  },
  sliderFill: {
    height: '100%',
    borderRadius: 4,
  },
  preview: {
    height: 80,
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 24,
  },
  previewText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
    textShadowColor: '#000',
    textShadowOffset: { width: 1, height: 1 },
    textShadowRadius: 2,
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