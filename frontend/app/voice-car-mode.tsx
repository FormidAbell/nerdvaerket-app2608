/**
 * Voice Control & Car Mode - LOY PLAY style features
 */

import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Switch } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import { palette, gradients, spacing } from '../src/ui/theme';

export default function VoiceCarMode() {
  const [voiceEnabled, setVoiceEnabled] = useState(false);
  const [carModeEnabled, setCarModeEnabled] = useState(false);
  const [autoStart, setAutoStart] = useState(false);

  const sendToDevice = () => {
    // TODO: Implement device communication
    console.log('Sending setup command to device...');
  };

  const voiceCommands = [
    { command: "Skift til rød", description: "Ændrer skærmen til rød farve" },
    { command: "Start animation", description: "Starter den aktuelle animation" },
    { command: "Sæt lysstyrke 50", description: "Indstiller lysstyrke til 50%" },
    { command: "Vis tekst hej", description: "Viser 'hej' på skærmen" },
    { command: "Stop", description: "Stopper alt indhold" },
  ];

  const carFeatures = [
    { icon: "speedometer-outline", title: "Speed Display", desc: "Vis hastighed på skærm" },
    { icon: "navigation-outline", title: "GPS Navigation", desc: "Vis retning og afstand" },
    { icon: "musical-notes-outline", title: "Music Sync", desc: "Synkroniser med musikafspiller" },
    { icon: "call-outline", title: "Call Notifications", desc: "Vis indkommende opkald" },
  ];

  return (
    <LinearGradient colors={gradients.primary} style={styles.container}>
      <SafeAreaView style={styles.safeArea}>
        <ScrollView style={styles.scrollView} contentContainerStyle={styles.content}>
          
          {/* Header */}
          <View style={styles.header}>
            <Ionicons name="flash" size={32} color={palette.tint} />
            <Text style={styles.title}>Voice Control & Car Mode</Text>
            <Text style={styles.subtitle}>LOY PLAY Advanced Features</Text>
          </View>

          {/* Voice Control Section */}
          <View style={styles.card}>
            <View style={styles.cardHeader}>
              <Ionicons name="mic" size={24} color={palette.tint} />
              <Text style={styles.cardTitle}>Voice Control</Text>
              <Switch 
                value={voiceEnabled} 
                onValueChange={setVoiceEnabled}
                trackColor={{ false: palette.muted, true: palette.tint }}
              />
            </View>
            
            {voiceEnabled && (
              <>
                <Text style={styles.cardSubtitle}>Tilgængelige stemmekommandoer:</Text>
                {voiceCommands.map((cmd, index) => (
                  <View key={index} style={styles.commandRow}>
                    <Text style={styles.commandText}>"{cmd.command}"</Text>
                    <Text style={styles.commandDesc}>{cmd.description}</Text>
                  </View>
                ))}
                
                <TouchableOpacity style={styles.actionButton}>
                  <Ionicons name="mic" size={20} color={palette.text} />
                  <Text style={styles.actionButtonText}>Test Voice Recognition</Text>
                </TouchableOpacity>
              </>
            )}
          </View>

          {/* Car Mode Section */}
          <View style={styles.card}>
            <View style={styles.cardHeader}>
              <Ionicons name="car" size={24} color={palette.tint} />
              <Text style={styles.cardTitle}>Car Mode</Text>
              <Switch 
                value={carModeEnabled} 
                onValueChange={setCarModeEnabled}
                trackColor={{ false: palette.muted, true: palette.tint }}
              />
            </View>
            
            {carModeEnabled && (
              <>
                <Text style={styles.cardSubtitle}>Car integration features:</Text>
                {carFeatures.map((feature, index) => (
                  <TouchableOpacity key={index} style={styles.featureRow}>
                    <Ionicons name={feature.icon as any} size={24} color={palette.tint} />
                    <View style={styles.featureText}>
                      <Text style={styles.featureTitle}>{feature.title}</Text>
                      <Text style={styles.featureDesc}>{feature.desc}</Text>
                    </View>
                    <Ionicons name="chevron-forward" size={16} color={palette.muted} />
                  </TouchableOpacity>
                ))}
                
                <View style={styles.settingRow}>
                  <Text style={styles.settingLabel}>Auto-start når bil tilsluttes</Text>
                  <Switch 
                    value={autoStart} 
                    onValueChange={setAutoStart}
                    trackColor={{ false: palette.muted, true: palette.tint }}
                  />
                </View>
              </>
            )}
          </View>

          {/* Remote Control Section */}
          <View style={styles.card}>
            <View style={styles.cardHeader}>
              <Ionicons name="settings" size={24} color={palette.tint} />
              <Text style={styles.cardTitle}>Remote Programs</Text>
            </View>
            <Text style={styles.cardSubtitle}>Fjernstyring og automatiske programmer</Text>
            
            <TouchableOpacity style={styles.remoteButton} onPress={sendToDevice}>
              <Text style={styles.remoteButtonText}>Setup Remote Control</Text>
            </TouchableOpacity>
            
            <TouchableOpacity style={styles.remoteButton}>
              <Text style={styles.remoteButtonText}>Program Scheduler</Text>
            </TouchableOpacity>
          </View>

        </ScrollView>
      </SafeAreaView>
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  safeArea: { flex: 1 },
  scrollView: { flex: 1 },
  content: { 
    paddingHorizontal: spacing.md,
    paddingBottom: spacing.xl,
  },
  header: {
    alignItems: 'center',
    marginVertical: spacing.lg,
  },
  title: {
    fontSize: 28,
    fontWeight: '800',
    color: palette.text,
    marginTop: spacing.sm,
    marginBottom: spacing.xs,
  },
  subtitle: {
    fontSize: 16,
    color: palette.textSecondary,
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
    marginBottom: spacing.md,
  },
  cardTitle: {
    fontSize: 20,
    fontWeight: '600',
    color: palette.text,
    flex: 1,
    marginLeft: spacing.sm,
  },
  cardSubtitle: {
    fontSize: 14,
    color: palette.textSecondary,
    marginBottom: spacing.md,
  },
  commandRow: {
    paddingVertical: spacing.sm,
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(255,255,255,0.1)',
  },
  commandText: {
    fontSize: 16,
    fontWeight: '600',
    color: palette.tint,
    marginBottom: 4,
  },
  commandDesc: {
    fontSize: 14,
    color: palette.textSecondary,
  },
  actionButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'rgba(0,212,255,0.2)',
    paddingVertical: spacing.md,
    paddingHorizontal: spacing.lg,
    borderRadius: 12,
    marginTop: spacing.md,
  },
  actionButtonText: {
    color: palette.text,
    fontSize: 16,
    fontWeight: '600',
    marginLeft: spacing.sm,
  },
  featureRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: spacing.md,
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(255,255,255,0.1)',
  },
  featureText: {
    flex: 1,
    marginLeft: spacing.sm,
  },
  featureTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: palette.text,
    marginBottom: 2,
  },
  featureDesc: {
    fontSize: 14,
    color: palette.textSecondary,
  },
  settingRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: spacing.md,
    marginTop: spacing.sm,
  },
  settingLabel: {
    fontSize: 16,
    color: palette.text,
    flex: 1,
  },
  remoteButton: {
    backgroundColor: 'rgba(0,212,255,0.2)',
    paddingVertical: spacing.md,
    borderRadius: 12,
    alignItems: 'center',
    marginBottom: spacing.sm,
  },
  remoteButtonText: {
    color: palette.tint,
    fontSize: 16,
    fontWeight: '600',
  },
});