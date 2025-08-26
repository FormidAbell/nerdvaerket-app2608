import React, { useState } from 'react';
import { View, Text, StyleSheet, TextInput, TouchableOpacity, Switch } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

export default function TextScroller() {
  const [text, setText] = useState('Hello World!');
  const [speed, setSpeed] = useState(50);
  const [repeat, setRepeat] = useState(true);

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Tekst Scroller</Text>
      <Text style={styles.subtitle}>Send scrollende tekst til LED skærmen</Text>

      <View style={styles.preview}>
        <Text style={styles.previewText}>{text}</Text>
      </View>

      <View style={styles.inputCard}>
        <Text style={styles.label}>Din tekst:</Text>
        <TextInput
          style={styles.textInput}
          value={text}
          onChangeText={setText}
          placeholder="Indtast din besked..."
          placeholderTextColor="#7a8ca0"
          maxLength={100}
        />
        <Text style={styles.charCount}>{text.length}/100 tegn</Text>
      </View>

      <View style={styles.settingsCard}>
        <Text style={styles.sectionTitle}>Indstillinger</Text>
        
        <View style={styles.settingRow}>
          <Text style={styles.settingLabel}>Hastighed: {speed}%</Text>
          <View style={styles.speedButtons}>
            <TouchableOpacity 
              style={styles.speedButton}
              onPress={() => setSpeed(Math.max(10, speed - 10))}
            >
              <Ionicons name="remove" size={20} color="#00d4ff" />
            </TouchableOpacity>
            <TouchableOpacity 
              style={styles.speedButton}
              onPress={() => setSpeed(Math.min(100, speed + 10))}
            >
              <Ionicons name="add" size={20} color="#00d4ff" />
            </TouchableOpacity>
          </View>
        </View>

        <View style={styles.settingRow}>
          <Text style={styles.settingLabel}>Gentag</Text>
          <Switch
            value={repeat}
            onValueChange={setRepeat}
            trackColor={{ false: '#7a8ca0', true: '#00d4ff' }}
          />
        </View>
      </View>

      <TouchableOpacity style={styles.sendButton}>
        <Ionicons name="send" size={20} color="#001a2e" />
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
    backgroundColor: '#000',
    height: 80,
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 24,
    borderWidth: 2,
    borderColor: '#00d4ff',
  },
  previewText: {
    color: '#00d4ff',
    fontSize: 16,
    fontFamily: 'monospace',
  },
  inputCard: {
    backgroundColor: '#1a2332',
    padding: 20,
    borderRadius: 12,
    marginBottom: 20,
  },
  label: {
    color: '#e6f0ff',
    fontSize: 16,
    marginBottom: 12,
  },
  textInput: {
    backgroundColor: '#0b141b',
    color: '#e6f0ff',
    padding: 12,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#7a8ca0',
    fontSize: 16,
  },
  charCount: {
    color: '#7a8ca0',
    fontSize: 12,
    textAlign: 'right',
    marginTop: 8,
  },
  settingsCard: {
    backgroundColor: '#1a2332',
    padding: 20,
    borderRadius: 12,
    marginBottom: 20,
  },
  sectionTitle: {
    color: '#e6f0ff',
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 16,
  },
  settingRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 16,
  },
  settingLabel: {
    color: '#e6f0ff',
    fontSize: 16,
  },
  speedButtons: {
    flexDirection: 'row',
  },
  speedButton: {
    backgroundColor: 'rgba(0, 212, 255, 0.2)',
    padding: 8,
    borderRadius: 6,
    marginLeft: 8,
  },
  sendButton: {
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