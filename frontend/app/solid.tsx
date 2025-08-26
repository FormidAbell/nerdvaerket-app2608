import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

export default function Solid() {
  const [selectedColor, setSelectedColor] = useState('#ff0000');

  const colors = [
    '#ff0000', '#00ff00', '#0000ff', '#ffff00', '#ff00ff', '#00ffff',
    '#ffffff', '#ff8000', '#8000ff', '#ff0080', '#00ff80', '#8080ff',
  ];

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Hel Farve</Text>
      <Text style={styles.subtitle}>Vælg en farve til hele skærmen</Text>

      <View style={[styles.preview, { backgroundColor: selectedColor }]}>
        <Text style={styles.previewText}>Forhåndsvisning</Text>
      </View>

      <View style={styles.colorGrid}>
        {colors.map((color) => (
          <TouchableOpacity
            key={color}
            style={[styles.colorButton, { backgroundColor: color }]}
            onPress={() => setSelectedColor(color)}
          >
            {selectedColor === color && (
              <Ionicons name="checkmark" size={24} color="#fff" />
            )}
          </TouchableOpacity>
        ))}
      </View>

      <TouchableOpacity style={styles.sendButton}>
        <Text style={styles.buttonText}>Send til LED Skærm</Text>
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
  preview: {
    height: 120,
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 32,
  },
  previewText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold',
    textShadowColor: '#000',
    textShadowOffset: { width: 1, height: 1 },
    textShadowRadius: 2,
  },
  colorGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    marginBottom: 32,
  },
  colorButton: {
    width: 60,
    height: 60,
    borderRadius: 30,
    marginBottom: 12,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 2,
    borderColor: '#1a2332',
  },
  sendButton: {
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