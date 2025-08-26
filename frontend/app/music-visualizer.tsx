/**
 * Music Visualizer - Real-time audio reactive LED displays
 */

import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Switch, ScrollView } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import { palette, gradients, spacing } from '../src/ui/theme';

export default function MusicVisualizer() {
  const [isListening, setIsListening] = useState(false);
  const [sensitivity, setSensitivity] = useState(50);
  const [selectedVisualization, setSelectedVisualization] = useState('spectrum');
  const [bassBoost, setBassBoost] = useState(false);
  const [autoColor, setAutoColor] = useState(true);

  const visualizations = [
    { id: 'spectrum', name: 'Spektrum Analyzer', description: 'Klassisk frekvens spektrum', icon: 'bar-chart' },
    { id: 'waveform', name: 'Waveform', description: 'Lydbølger i realtid', icon: 'pulse' },
    { id: 'vumeter', name: 'VU Meter', description: 'Volumen level indikator', icon: 'speedometer' },
    { id: 'beatdrop', name: 'Beat Drop', description: 'Reagerer på bass drops', icon: 'flash' },
    { id: 'circular', name: 'Cirkulær VU', description: 'Rund visning af audio', icon: 'radio-button-on' },
    { id: 'matrix', name: 'Matrix Rain', description: 'Matrix effekt med lyd', icon: 'grid' },
    { id: 'fire', name: 'Audio Fire', description: 'Ild effekt der danser til musik', icon: 'flame' },
    { id: 'particles', name: 'Partikel Eksplosion', description: 'Partikler der reagerer på beat', icon: 'sparkles' },
  ];

  const colorModes = [
    { id: 'rainbow', name: 'Rainbow', color: ['#ff0000', '#ff8000', '#ffff00', '#00ff00', '#0080ff', '#8000ff'] },
    { id: 'fire', name: 'Fire', color: ['#ff0000', '#ff4000', '#ff8000', '#ffff00'] },
    { id: 'ocean', name: 'Ocean', color: ['#000080', '#0080ff', '#00ffff', '#80ffff'] },
    { id: 'neon', name: 'Neon', color: ['#ff00ff', '#00ffff', '#ffff00', '#ff0080'] },
    { id: 'sunset', name: 'Sunset', color: ['#ff4000', '#ff8000', '#ffff00', '#ff0080'] },
  ];

  return (
    <LinearGradient colors={gradients.primary} style={styles.container}>
      <SafeAreaView style={styles.safeArea}>
        <ScrollView showsVerticalScrollIndicator={false}>
        
        {/* Header */}
        <View style={styles.header}>
          <Ionicons name="musical-notes" size={32} color={palette.tint} />
          <Text style={styles.title}>Music Visualizer</Text>
          <Text style={styles.subtitle}>Lyd-reaktive LED displays</Text>
        </View>

        {/* Listening Status */}
        <View style={styles.statusCard}>
          <View style={styles.statusHeader}>
            <View style={styles.statusInfo}>
              <Text style={styles.statusTitle}>Audio Input</Text>
              <Text style={styles.statusText}>
                {isListening ? 'Lytter til musik...' : 'Ingen audio input'}
              </Text>
            </View>
            <TouchableOpacity 
              style={[styles.listenButton, isListening && styles.listenButtonActive]}
              onPress={() => setIsListening(!isListening)}
            >
              <Ionicons 
                name={isListening ? "stop" : "play"} 
                size={32} 
                color={isListening ? "#fff" : palette.tint} 
              />
            </TouchableOpacity>
          </View>
          
          {isListening && (
            <View style={styles.audioLevels}>
              <View style={styles.audioBar}>
                <View style={[styles.audioLevel, { width: '70%', backgroundColor: '#ff4444' }]} />
              </View>
              <View style={styles.audioBar}>
                <View style={[styles.audioLevel, { width: '45%', backgroundColor: '#44ff44' }]} />
              </View>
              <View style={styles.audioBar}>
                <View style={[styles.audioLevel, { width: '85%', backgroundColor: '#4444ff' }]} />
              </View>
            </View>
          )}
        </View>

        {/* Visualization Selection */}
        <View style={styles.card}>
          <Text style={styles.sectionTitle}>Visualisering Type</Text>
          <View style={styles.visualizationGrid}>
            {visualizations.map((viz) => (
              <TouchableOpacity
                key={viz.id}
                style={[
                  styles.vizCard,
                  selectedVisualization === viz.id && styles.vizCardSelected
                ]}
                onPress={() => setSelectedVisualization(viz.id)}
              >
                <Ionicons 
                  name={viz.icon as any} 
                  size={24} 
                  color={selectedVisualization === viz.id ? '#001a2e' : palette.tint} 
                />
                <Text style={[
                  styles.vizName,
                  selectedVisualization === viz.id && styles.vizNameSelected
                ]}>
                  {viz.name}
                </Text>
                <Text style={[
                  styles.vizDescription,
                  selectedVisualization === viz.id && styles.vizDescriptionSelected
                ]}>
                  {viz.description}
                </Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>

        {/* Color Modes */}
        <View style={styles.card}>
          <View style={styles.cardHeader}>
            <Text style={styles.sectionTitle}>Farve Mode</Text>
            <Switch 
              value={autoColor} 
              onValueChange={setAutoColor}
              trackColor={{ false: palette.muted, true: palette.tint }}
            />
          </View>
          
          {!autoColor && (
            <View style={styles.colorModes}>
              {colorModes.map((mode) => (
                <TouchableOpacity key={mode.id} style={styles.colorMode}>
                  <LinearGradient colors={mode.color} style={styles.colorGradient} start={{x:0,y:0}} end={{x:1,y:0}} />
                  <Text style={styles.colorModeName}>{mode.name}</Text>
                </TouchableOpacity>
              ))}
            </View>
          )}
        </View>

        {/* Audio Settings */}
        <View style={styles.card}>
          <Text style={styles.sectionTitle}>Audio Indstillinger</Text>
          
          <View style={styles.settingRow}>
            <Text style={styles.settingLabel}>Sensitivitet</Text>
            <View style={styles.sliderContainer}>
              <View style={styles.sliderTrack}>
                <View style={[styles.sliderFill, { width: `${sensitivity}%` }]} />
              </View>
              <Text style={styles.sliderValue}>{Math.round(sensitivity)}%</Text>
            </View>
          </View>

          <View style={styles.settingRow}>
            <Text style={styles.settingLabel}>Bass Boost</Text>
            <Switch 
              value={bassBoost} 
              onValueChange={setBassBoost}
              trackColor={{ false: palette.muted, true: palette.tint }}
            />
          </View>
        </View>

        {/* Audio Sources */}
        <View style={styles.card}>
          <Text style={styles.sectionTitle}>Audio Kilder</Text>
          
          <TouchableOpacity style={styles.sourceButton}>
            <Ionicons name="mic" size={24} color={palette.tint} />
            <View style={styles.sourceInfo}>
              <Text style={styles.sourceName}>Mikrofon</Text>
              <Text style={styles.sourceDesc}>Live lyd fra omgivelserne</Text>
            </View>
          </TouchableOpacity>

          <TouchableOpacity style={styles.sourceButton}>
            <Ionicons name="musical-notes" size={24} color={palette.tint} />
            <View style={styles.sourceInfo}>
              <Text style={styles.sourceName}>Spotify/Apple Music</Text>
              <Text style={styles.sourceDesc}>Musik fra streaming apps</Text>
            </View>
          </TouchableOpacity>

          <TouchableOpacity style={styles.sourceButton}>
            <Ionicons name="radio" size={24} color={palette.tint} />
            <View style={styles.sourceInfo}>
              <Text style={styles.sourceName}>System Audio</Text>
              <Text style={styles.sourceDesc}>Al lyd fra telefonen</Text>
            </View>
          </TouchableOpacity>
        </View>

        {/* Quick Presets */}
        <View style={styles.card}>
          <Text style={styles.sectionTitle}>Hurtige Presets</Text>
          
          <View style={styles.presets}>
            <TouchableOpacity style={styles.preset}>
              <Text style={styles.presetText}>🎵 Chill Music</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.preset}>
              <Text style={styles.presetText}>🔥 Party Mode</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.preset}>
              <Text style={styles.presetText}>🎸 Rock Concert</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.preset}>
              <Text style={styles.presetText}>🎹 Classical</Text>
            </TouchableOpacity>
          </View>
        </View>

        </ScrollView>
      </SafeAreaView>
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  safeArea: { flex: 1, paddingHorizontal: spacing.md },
  header: {
    alignItems: 'center',
    paddingVertical: spacing.lg,
  },
  title: {
    fontSize: 28,
    fontWeight: '800',
    color: palette.text,
    marginTop: spacing.sm,
  },
  subtitle: {
    fontSize: 16,
    color: palette.textSecondary,
  },
  statusCard: {
    backgroundColor: 'rgba(26,35,50,0.8)',
    borderRadius: 16,
    padding: spacing.lg,
    marginBottom: spacing.lg,
  },
  statusHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: spacing.md,
  },
  statusInfo: {
    flex: 1,
  },
  statusTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: palette.text,
  },
  statusText: {
    fontSize: 14,
    color: palette.textSecondary,
    marginTop: 4,
  },
  listenButton: {
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: 'rgba(0,212,255,0.2)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  listenButtonActive: {
    backgroundColor: palette.tint,
  },
  audioLevels: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'end',
    height: 60,
  },
  audioBar: {
    width: 20,
    height: 50,
    backgroundColor: 'rgba(255,255,255,0.1)',
    borderRadius: 10,
    justifyContent: 'flex-end',
  },
  audioLevel: {
    borderRadius: 10,
    minHeight: 5,
  },
  card: {
    backgroundColor: 'rgba(26,35,50,0.8)',
    borderRadius: 16,
    padding: spacing.lg,
    marginBottom: spacing.lg,
  },
  cardHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: spacing.md,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: '600',
    color: palette.text,
    marginBottom: spacing.md,
  },
  visualizationGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
  vizCard: {
    width: '48%',
    backgroundColor: 'rgba(255,255,255,0.1)',
    borderRadius: 12,
    padding: spacing.md,
    alignItems: 'center',
    marginBottom: spacing.md,
  },
  vizCardSelected: {
    backgroundColor: palette.tint,
  },
  vizName: {
    fontSize: 14,
    fontWeight: '600',
    color: palette.text,
    marginTop: spacing.sm,
    textAlign: 'center',
  },
  vizNameSelected: {
    color: '#001a2e',
  },
  vizDescription: {
    fontSize: 12,
    color: palette.textSecondary,
    marginTop: spacing.xs,
    textAlign: 'center',
  },
  vizDescriptionSelected: {
    color: 'rgba(0,26,46,0.7)',
  },
  colorModes: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
  colorMode: {
    alignItems: 'center',
    marginBottom: spacing.md,
  },
  colorGradient: {
    width: 50,
    height: 30,
    borderRadius: 15,
    marginBottom: spacing.xs,
  },
  colorModeName: {
    fontSize: 12,
    color: palette.text,
  },
  settingRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: spacing.md,
  },
  settingLabel: {
    fontSize: 16,
    color: palette.text,
    flex: 1,
  },
  sliderContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
    marginLeft: spacing.md,
  },
  sliderTrack: {
    flex: 1,
    height: 4,
    backgroundColor: palette.muted,
    borderRadius: 2,
    overflow: 'hidden',
  },
  sliderFill: {
    height: '100%',
    backgroundColor: palette.tint,
  },
  sliderValue: {
    fontSize: 14,
    color: palette.text,
    marginLeft: spacing.sm,
    minWidth: 40,
  },
  sourceButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(255,255,255,0.1)',
    borderRadius: 12,
    padding: spacing.md,
    marginBottom: spacing.sm,
  },
  sourceInfo: {
    flex: 1,
    marginLeft: spacing.md,
  },
  sourceName: {
    fontSize: 16,
    fontWeight: '600',
    color: palette.text,
  },
  sourceDesc: {
    fontSize: 14,
    color: palette.textSecondary,
    marginTop: 2,
  },
  presets: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
  preset: {
    backgroundColor: 'rgba(0,212,255,0.2)',
    borderRadius: 12,
    paddingVertical: spacing.md,
    paddingHorizontal: spacing.sm,
    width: '48%',
    alignItems: 'center',
    marginBottom: spacing.sm,
  },
  presetText: {
    fontSize: 14,
    color: palette.text,
    fontWeight: '600',
  },
});