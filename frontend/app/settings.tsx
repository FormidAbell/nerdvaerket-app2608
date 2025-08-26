import React, { useState } from "react";
import { View, Text, StyleSheet, ScrollView, TouchableOpacity } from "react-native";
import { ThemedBackground, Card, SecondaryButton } from "../src/ui/components";
import { palette, spacing, radius } from "../src/ui/theme";
import { Ionicons } from '@expo/vector-icons';
import { Link } from 'expo-router';

export default function Settings(){
  const [showAdvanced, setShowAdvanced] = useState(false);

  return (
    <ThemedBackground>
      <ScrollView style={styles.container} contentContainerStyle={styles.content}>
        <Card>
          <Text style={styles.sectionTitle}>Generelle indstillinger</Text>
          <View style={styles.settingRow}>
            <View style={styles.settingInfo}>
              <Text style={styles.settingLabel}>App version</Text>
              <Text style={styles.settingValue}>1.0.0</Text>
            </View>
          </View>
          
          <View style={styles.settingRow}>
            <View style={styles.settingInfo}>
              <Text style={styles.settingLabel}>Bluetooth status</Text>
              <Text style={styles.settingValue}>Aktiveret</Text>
            </View>
          </View>
        </Card>

        <Card>
          <Text style={styles.sectionTitle}>Om appen</Text>
          <Text style={styles.description}>
            Nerdværket er en app til at styre din iDot-3 LED skærm via Bluetooth. 
            Du kan sende farver, animationer, billeder og spille spil direkte på skærmen.
          </Text>
        </Card>

        <Card>
          <Text style={styles.sectionTitle}>Avancerede Features</Text>
          
          <Link href="/music-visualizer" asChild>
            <TouchableOpacity style={styles.supportRow}>
              <Ionicons name="musical-notes-outline" size={24} color={palette.tint} />
              <View style={styles.supportText}>
                <Text style={styles.settingLabel}>Music Visualizer</Text>
                <Text style={styles.settingValue}>Lyd-reaktive LED displays og spektrum</Text>
              </View>
              <Ionicons name="chevron-forward" size={18} color={palette.muted} />
            </TouchableOpacity>
          </Link>

          <Link href="/smart-features" asChild>
            <TouchableOpacity style={styles.supportRow}>
              <Ionicons name="phone-portrait-outline" size={24} color={palette.tint} />
              <View style={styles.supportText}>
                <Text style={styles.settingLabel}>Smart Features</Text>
                <Text style={styles.settingValue}>Notifikationer, vejr, QR koder og mere</Text>
              </View>
              <Ionicons name="chevron-forward" size={18} color={palette.muted} />
            </TouchableOpacity>
          </Link>

          <Link href="/gaming-hub" asChild>
            <TouchableOpacity style={styles.supportRow}>
              <Ionicons name="game-controller-outline" size={24} color={palette.tint} />
              <View style={styles.supportText}>
                <Text style={styles.settingLabel}>Gaming Hub</Text>
                <Text style={styles.settingValue}>Spil, turneringer og interaktive features</Text>
              </View>
              <Ionicons name="chevron-forward" size={18} color={palette.muted} />
            </TouchableOpacity>
          </Link>
          
          <Link href="/voice-car-mode" asChild>
            <TouchableOpacity style={styles.supportRow}>
              <Ionicons name="flash-outline" size={24} color={palette.tint} />
              <View style={styles.supportText}>
                <Text style={styles.settingLabel}>Voice Control & Car Mode</Text>
                <Text style={styles.settingValue}>Stemmekommandoer og bil integration</Text>
              </View>
              <Ionicons name="chevron-forward" size={18} color={palette.muted} />
            </TouchableOpacity>
          </Link>
          
          <Link href="/timer-scheduler" asChild>
            <TouchableOpacity style={styles.supportRow}>
              <Ionicons name="time-outline" size={24} color={palette.tint} />
              <View style={styles.supportText}>
                <Text style={styles.settingLabel}>Timer & Scheduler</Text>
                <Text style={styles.settingValue}>Automatiske programmer og timere</Text>
              </View>
              <Ionicons name="chevron-forward" size={18} color={palette.muted} />
            </TouchableOpacity>
          </Link>

          <Link href="/device-groups" asChild>
            <TouchableOpacity style={styles.supportRow}>
              <Ionicons name="people-outline" size={24} color={palette.tint} />
              <View style={styles.supportText}>
                <Text style={styles.settingLabel}>Device Groups</Text>
                <Text style={styles.settingValue}>Synkroniser flere skærme</Text>
              </View>
              <Ionicons name="chevron-forward" size={18} color={palette.muted} />
            </TouchableOpacity>
          </Link>
        </Card>

        <Card>
          <Text style={styles.sectionTitle}>Support</Text>
          <TouchableOpacity style={styles.supportRow}>
            <Ionicons name="help-circle-outline" size={24} color={palette.tint} />
            <View style={styles.supportText}>
              <Text style={styles.settingLabel}>Hjælp & FAQ</Text>
              <Text style={styles.settingValue}>Få hjælp til at bruge appen</Text>
            </View>
            <Ionicons name="chevron-forward" size={18} color={palette.muted} />
          </TouchableOpacity>
        </Card>

        {/* Avancerede indstillinger - skjult som standard */}
        <TouchableOpacity onPress={() => setShowAdvanced(!showAdvanced)}>
          <Card>
            <View style={styles.advancedToggle}>
              <Text style={styles.advancedLabel}>Avancerede indstillinger</Text>
              <Ionicons 
                name={showAdvanced ? "chevron-up" : "chevron-down"} 
                size={20} 
                color={palette.muted} 
              />
            </View>
          </Card>
        </TouchableOpacity>

        {showAdvanced && (
          <Card>
            <Text style={styles.sectionTitle}>⚠️ Kun for udviklere</Text>
            <Text style={styles.warning}>
              Disse indstillinger er kun for tekniske brugere. 
              Ændring kan påvirke app'ens funktionalitet.
            </Text>
            <SecondaryButton 
              title="Åbn tekniske indstillinger" 
              onPress={() => {/* Navigation til teknisk settings */}} 
            />
          </Card>
        )}
      </ScrollView>
    </ThemedBackground>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  content: {
    padding: spacing.lg,
    paddingBottom: spacing.xl * 2,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: palette.text,
    marginBottom: spacing.md,
  },
  settingRow: {
    paddingVertical: spacing.sm,
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(255,255,255,0.1)',
    marginBottom: spacing.sm,
  },
  settingInfo: {
    flex: 1,
  },
  settingLabel: {
    fontSize: 16,
    color: palette.text,
    marginBottom: 2,
    fontWeight: '500',
  },
  settingValue: {
    fontSize: 14,
    color: palette.muted,
  },
  description: {
    fontSize: 15,
    color: palette.textSecondary,
    lineHeight: 22,
  },
  supportRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: spacing.md,
  },
  supportText: {
    flex: 1,
    marginLeft: spacing.md,
  },
  advancedToggle: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  advancedLabel: {
    fontSize: 16,
    color: palette.text,
    fontWeight: '500',
  },
  warning: {
    fontSize: 14,
    color: palette.warning,
    lineHeight: 20,
    marginBottom: spacing.md,
    fontStyle: 'italic',
  },
});