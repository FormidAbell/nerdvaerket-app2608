import React from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
import { Link } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';

export default function Phase4Features() {
  return (
    <View style={styles.container}>
      <ScrollView>
        <Text style={styles.title}>Phase 4 Funktioner</Text>
        <Text style={styles.subtitle}>Næste generation LED kontrol features</Text>

        <Link href="/smart-features" asChild>
          <TouchableOpacity style={styles.featureCard}>
            <Ionicons name="phone-portrait" size={32} color="#00d4ff" />
            <View style={styles.featureContent}>
              <Text style={styles.featureTitle}>Smart Features</Text>
              <Text style={styles.featureDescription}>
                Telefon notifikationer, vejr displays, sociale medier integration,
                QR kode generator og fitness tracking.
              </Text>
            </View>
            <Ionicons name="chevron-forward" size={24} color="#7a8ca0" />
          </TouchableOpacity>
        </Link>

        <Link href="/gaming-hub" asChild>
          <TouchableOpacity style={styles.featureCard}>
            <Ionicons name="game-controller" size={32} color="#00d4ff" />
            <View style={styles.featureContent}>
              <Text style={styles.featureTitle}>Gaming Hub</Text>
              <Text style={styles.featureDescription}>
                Omfattende spil bibliotek med arcade, puzzle, interaktive spil,
                multiplayer support og custom game builder.
              </Text>
            </View>
            <Ionicons name="chevron-forward" size={24} color="#7a8ca0" />
          </TouchableOpacity>
        </Link>

        <Link href="/graffiti-draw" asChild>
          <TouchableOpacity style={styles.featureCard}>
            <Ionicons name="brush" size={32} color="#00d4ff" />
            <View style={styles.featureContent}>
              <Text style={styles.featureTitle}>Graffiti & Draw Mode</Text>
              <Text style={styles.featureDescription}>
                Tegn direkte på LED skærmen med forskellige pensler, farver
                og avancerede tegneværktøjer.
              </Text>
            </View>
            <Ionicons name="chevron-forward" size={24} color="#7a8ca0" />
          </TouchableOpacity>
        </Link>

        <Link href="/music-visualizer" asChild>
          <TouchableOpacity style={styles.featureCard}>
            <Ionicons name="musical-notes" size={32} color="#00d4ff" />
            <View style={styles.featureContent}>
              <Text style={styles.featureTitle}>Music Visualizer</Text>
              <Text style={styles.featureDescription}>
                8 forskellige visualizer typer, 5 farve modes, real-time
                audio reaktion og custom audio indstillinger.
              </Text>
            </View>
            <Ionicons name="chevron-forward" size={24} color="#7a8ca0" />
          </TouchableOpacity>
        </Link>

        <Link href="/voice-car-mode" asChild>
          <TouchableOpacity style={styles.featureCard}>
            <Ionicons name="mic" size={32} color="#00d4ff" />
            <View style={styles.featureContent}>
              <Text style={styles.featureTitle}>Voice Commands & Car Mode</Text>
              <Text style={styles.featureDescription}>
                Stemme kontrol, bil integration, håndfri betjening
                og automatiserede kommandoer.
              </Text>
            </View>
            <Ionicons name="chevron-forward" size={24} color="#7a8ca0" />
          </TouchableOpacity>
        </Link>

        <Link href="/timer-scheduler" asChild>
          <TouchableOpacity style={styles.featureCard}>
            <Ionicons name="time" size={32} color="#00d4ff" />
            <View style={styles.featureContent}>
              <Text style={styles.featureTitle}>Timer & Scheduler</Text>
              <Text style={styles.featureDescription}>
                4 ur typer, planlagte programmer, automatiske sekvenser
                og tid-baserede triggers.
              </Text>
            </View>
            <Ionicons name="chevron-forward" size={24} color="#7a8ca0" />
          </TouchableOpacity>
        </Link>

        <Link href="/device-groups" asChild>
          <TouchableOpacity style={styles.featureCard}>
            <Ionicons name="layers" size={32} color="#00d4ff" />
            <View style={styles.featureContent}>
              <Text style={styles.featureTitle}>Device Groups & Sync</Text>
              <Text style={styles.featureDescription}>
                Multi-device synkronisering, gruppe administration,
                master/slave setup og koordinerede displays.
              </Text>
            </View>
            <Ionicons name="chevron-forward" size={24} color="#7a8ca0" />
          </TouchableOpacity>
        </Link>

        <View style={styles.statusCard}>
          <Ionicons name="checkmark-circle" size={24} color="#4ade80" />
          <View style={styles.statusContent}>
            <Text style={styles.statusTitle}>Implementerings Status</Text>
            <Text style={styles.statusText}>
              Alle Phase 4 funktioner er implementeret og klar til brug.
              Total feature paritet med LOY PLAY app opnået! 🎉
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
  featureCard: {
    backgroundColor: '#1a2332',
    borderRadius: 12,
    padding: 20,
    marginBottom: 16,
    flexDirection: 'row',
    alignItems: 'center',
  },
  featureContent: {
    flex: 1,
    marginLeft: 16,
    marginRight: 12,
  },
  featureTitle: {
    color: '#e6f0ff',
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 8,
  },
  featureDescription: {
    color: '#7a8ca0',
    fontSize: 14,
    lineHeight: 20,
  },
  statusCard: {
    backgroundColor: 'rgba(74, 222, 128, 0.1)',
    borderRadius: 12,
    padding: 20,
    marginTop: 20,
    flexDirection: 'row',
    borderWidth: 1,
    borderColor: 'rgba(74, 222, 128, 0.3)',
  },
  statusContent: {
    flex: 1,
    marginLeft: 16,
  },
  statusTitle: {
    color: '#4ade80',
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 8,
  },
  statusText: {
    color: '#e6f0ff',
    fontSize: 14,
    lineHeight: 20,
  },
});