import React from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

export default function AdvancedFeatures() {
  return (
    <View style={styles.container}>
      <ScrollView>
        <Text style={styles.title}>Avancerede Funktioner</Text>
        <Text style={styles.subtitle}>Professionelle værktøjer til LED kontrol</Text>

        <View style={styles.featureCard}>
          <Ionicons name="construct" size={32} color="#00d4ff" />
          <View style={styles.featureContent}>
            <Text style={styles.featureTitle}>DIY Editor</Text>
            <Text style={styles.featureDescription}>
              Opret dine egne custom animationer og effekter. 
              Fuld kontrol over hver pixel på skærmen.
            </Text>
            <TouchableOpacity style={styles.featureButton}>
              <Text style={styles.buttonText}>Åbn Editor</Text>
            </TouchableOpacity>
          </View>
        </View>

        <View style={styles.featureCard}>
          <Ionicons name="musical-notes" size={32} color="#00d4ff" />
          <View style={styles.featureContent}>
            <Text style={styles.featureTitle}>Musik/Mikrofon Mode</Text>
            <Text style={styles.featureDescription}>
              Realtids audio visualisering. LED'erne reagerer på 
              musik eller mikrofon input.
            </Text>
            <TouchableOpacity style={styles.featureButton}>
              <Text style={styles.buttonText}>Konfigurér Audio</Text>
            </TouchableOpacity>
          </View>
        </View>

        <View style={styles.featureCard}>
          <Ionicons name="settings" size={32} color="#00d4ff" />
          <View style={styles.featureContent}>
            <Text style={styles.featureTitle}>IC/Pixel Setup</Text>
            <Text style={styles.featureDescription}>
              Avanceret konfiguration af LED driver chips og 
              pixel mapping for forskellige skærm layouts.
            </Text>
            <TouchableOpacity style={styles.featureButton}>
              <Text style={styles.buttonText}>Hardware Setup</Text>
            </TouchableOpacity>
          </View>
        </View>

        <View style={styles.featureCard}>
          <Ionicons name="time" size={32} color="#00d4ff" />
          <View style={styles.featureContent}>
            <Text style={styles.featureTitle}>Timers & Schedules</Text>
            <Text style={styles.featureDescription}>
              Automatiser LED displays med tidsbaserede 
              programmer og planlagte sekvenser.
            </Text>
            <TouchableOpacity style={styles.featureButton}>
              <Text style={styles.buttonText}>Planlæg Aktiviteter</Text>
            </TouchableOpacity>
          </View>
        </View>

        <View style={styles.featureCard}>
          <Ionicons name="layers" size={32} color="#00d4ff" />
          <View style={styles.featureContent}>
            <Text style={styles.featureTitle}>Groups & Sync</Text>
            <Text style={styles.featureDescription}>
              Synkronisér flere LED skærme og opret grupper 
              for koordinerede displays.
            </Text>
            <TouchableOpacity style={styles.featureButton}>
              <Text style={styles.buttonText}>Administrér Grupper</Text>
            </TouchableOpacity>
          </View>
        </View>

        <View style={styles.warningCard}>
          <Ionicons name="warning" size={24} color="#fbbf24" />
          <View style={styles.warningContent}>
            <Text style={styles.warningTitle}>Avanceret Bruger</Text>
            <Text style={styles.warningText}>
              Disse funktioner kræver teknisk viden om LED hardware 
              og kan påvirke systemets stabilitet hvis de bruges forkert.
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
  },
  featureContent: {
    flex: 1,
    marginLeft: 16,
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
    marginBottom: 16,
  },
  featureButton: {
    backgroundColor: '#00d4ff',
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderRadius: 6,
    alignSelf: 'flex-start',
  },
  buttonText: {
    color: '#001a2e',
    fontSize: 14,
    fontWeight: 'bold',
  },
  warningCard: {
    backgroundColor: 'rgba(251, 191, 36, 0.1)',
    borderRadius: 12,
    padding: 20,
    marginTop: 20,
    flexDirection: 'row',
    borderWidth: 1,
    borderColor: 'rgba(251, 191, 36, 0.3)',
  },
  warningContent: {
    flex: 1,
    marginLeft: 16,
  },
  warningTitle: {
    color: '#fbbf24',
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 8,
  },
  warningText: {
    color: '#e6f0ff',
    fontSize: 14,
    lineHeight: 20,
  },
});