/**
 * Timer & Scheduler - LOY PLAY style scheduling features
 */

import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Switch, TextInput } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import { palette, gradients, spacing } from '../src/ui/theme';

interface ScheduleItem {
  id: number;
  time: string;
  action: string;
  enabled: boolean;
  days: string[];
}

export default function TimerScheduler() {
  const [schedules, setSchedules] = useState<ScheduleItem[]>([
    { id: 1, time: "07:00", action: "Show Clock", enabled: true, days: ["Mon", "Tue", "Wed", "Thu", "Fri"] },
    { id: 2, time: "18:00", action: "Rainbow Animation", enabled: false, days: ["Sat", "Sun"] },
    { id: 3, time: "22:00", action: "Turn Off", enabled: true, days: ["All"] },
  ]);

  const [clockEnabled, setClockEnabled] = useState(true);
  const [autoShutoff, setAutoShutoff] = useState(true);
  const [newScheduleTime, setNewScheduleTime] = useState("12:00");

  const toggleSchedule = (id: number) => {
    setSchedules(prev => prev.map(item => 
      item.id === id ? { ...item, enabled: !item.enabled } : item
    ));
  };

  const clockFormats = [
    { id: 'digital24', name: '24-timers digital', preview: '14:30' },
    { id: 'digital12', name: '12-timers digital', preview: '2:30 PM' },
    { id: 'analog', name: 'Analog ur', preview: '🕐' },
    { id: 'countdown', name: 'Nedtælling', preview: '05:30' },
  ];

  const scheduledActions = [
    "Show Clock", "Turn Off", "Rainbow Animation", "Show Text", 
    "Solid Color", "Brightness 50%", "Start Game", "Custom Program"
  ];

  return (
    <LinearGradient colors={gradients.primary} style={styles.container}>
      <SafeAreaView style={styles.safeArea}>
        <ScrollView style={styles.scrollView} contentContainerStyle={styles.content}>
          
          {/* Header */}
          <View style={styles.header}>
            <Ionicons name="time" size={32} color={palette.tint} />
            <Text style={styles.title}>Timer & Scheduler</Text>
            <Text style={styles.subtitle}>Automatiske programmer og ure</Text>
          </View>

          {/* Clock Settings */}
          <View style={styles.card}>
            <View style={styles.cardHeader}>
              <Ionicons name="alarm-outline" size={24} color={palette.tint} />
              <Text style={styles.cardTitle}>Clock Display</Text>
              <Switch 
                value={clockEnabled} 
                onValueChange={setClockEnabled}
                trackColor={{ false: palette.muted, true: palette.tint }}
              />
            </View>
            
            {clockEnabled && (
              <>
                <Text style={styles.cardSubtitle}>Vælg ur format:</Text>
                {clockFormats.map((format) => (
                  <TouchableOpacity key={format.id} style={styles.formatRow}>
                    <View style={styles.formatInfo}>
                      <Text style={styles.formatName}>{format.name}</Text>
                      <Text style={styles.formatPreview}>{format.preview}</Text>
                    </View>
                    <Ionicons name="chevron-forward" size={16} color={palette.muted} />
                  </TouchableOpacity>
                ))}
              </>
            )}
          </View>

          {/* Current Schedules */}
          <View style={styles.card}>
            <View style={styles.cardHeader}>
              <Ionicons name="calendar-outline" size={24} color={palette.tint} />
              <Text style={styles.cardTitle}>Scheduled Programs</Text>
            </View>
            
            {schedules.map((schedule) => (
              <View key={schedule.id} style={styles.scheduleItem}>
                <View style={styles.scheduleInfo}>
                  <Text style={styles.scheduleTime}>{schedule.time}</Text>
                  <Text style={styles.scheduleAction}>{schedule.action}</Text>
                  <Text style={styles.scheduleDays}>
                    {schedule.days.join(', ')}
                  </Text>
                </View>
                <Switch 
                  value={schedule.enabled} 
                  onValueChange={() => toggleSchedule(schedule.id)}
                  trackColor={{ false: palette.muted, true: palette.tint }}
                />
              </View>
            ))}

            <TouchableOpacity style={styles.addScheduleButton}>
              <Ionicons name="add" size={20} color={palette.text} />
              <Text style={styles.addScheduleText}>Add New Schedule</Text>
            </TouchableOpacity>
          </View>

          {/* Quick Timer */}
          <View style={styles.card}>
            <View style={styles.cardHeader}>
              <Ionicons name="timer-outline" size={24} color={palette.tint} />
              <Text style={styles.cardTitle}>Quick Timer</Text>
            </View>
            
            <Text style={styles.cardSubtitle}>Set a countdown timer for current session</Text>
            
            <View style={styles.timerControls}>
              <TouchableOpacity style={styles.timerButton}>
                <Text style={styles.timerButtonText}>5 min</Text>
              </TouchableOpacity>
              <TouchableOpacity style={styles.timerButton}>
                <Text style={styles.timerButtonText}>15 min</Text>
              </TouchableOpacity>
              <TouchableOpacity style={styles.timerButton}>
                <Text style={styles.timerButtonText}>30 min</Text>
              </TouchableOpacity>
              <TouchableOpacity style={styles.timerButton}>
                <Text style={styles.timerButtonText}>1 hour</Text>
              </TouchableOpacity>
            </View>

            <View style={styles.customTimer}>
              <TextInput
                style={styles.timerInput}
                placeholder="Custom time (mm:ss)"
                placeholderTextColor={palette.muted}
                value={newScheduleTime}
                onChangeText={setNewScheduleTime}
              />
              <TouchableOpacity style={styles.startTimerButton}>
                <Text style={styles.startTimerText}>Start Timer</Text>
              </TouchableOpacity>
            </View>
          </View>

          {/* Auto Settings */}
          <View style={styles.card}>
            <View style={styles.cardHeader}>
              <Ionicons name="settings-outline" size={24} color={palette.tint} />
              <Text style={styles.cardTitle}>Auto Settings</Text>
            </View>
            
            <View style={styles.settingRow}>
              <Text style={styles.settingLabel}>Auto shutoff ved inaktivitet</Text>
              <Switch 
                value={autoShutoff} 
                onValueChange={setAutoShutoff}
                trackColor={{ false: palette.muted, true: palette.tint }}
              />
            </View>

            <View style={styles.settingRow}>
              <Text style={styles.settingLabel}>Sync med telefon ur</Text>
              <Switch 
                value={true} 
                onValueChange={() => {}}
                trackColor={{ false: palette.muted, true: palette.tint }}
              />
            </View>

            <TouchableOpacity style={styles.actionButton}>
              <Text style={styles.actionButtonText}>Advanced Schedule Settings</Text>
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
  formatRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: spacing.md,
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(255,255,255,0.1)',
  },
  formatInfo: {
    flex: 1,
  },
  formatName: {
    fontSize: 16,
    color: palette.text,
    marginBottom: 2,
  },
  formatPreview: {
    fontSize: 14,
    color: palette.tint,
    fontFamily: 'monospace',
  },
  scheduleItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: spacing.md,
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(255,255,255,0.1)',
  },
  scheduleInfo: {
    flex: 1,
  },
  scheduleTime: {
    fontSize: 18,
    fontWeight: '600',
    color: palette.tint,
    marginBottom: 2,
  },
  scheduleAction: {
    fontSize: 16,
    color: palette.text,
    marginBottom: 2,
  },
  scheduleDays: {
    fontSize: 14,
    color: palette.textSecondary,
  },
  addScheduleButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'rgba(0,212,255,0.2)',
    paddingVertical: spacing.md,
    borderRadius: 12,
    marginTop: spacing.md,
  },
  addScheduleText: {
    color: palette.text,
    fontSize: 16,
    fontWeight: '600',
    marginLeft: spacing.sm,
  },
  timerControls: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: spacing.md,
  },
  timerButton: {
    backgroundColor: 'rgba(0,212,255,0.2)',
    paddingVertical: spacing.sm,
    paddingHorizontal: spacing.md,
    borderRadius: 8,
    flex: 0.23,
    alignItems: 'center',
  },
  timerButtonText: {
    color: palette.tint,
    fontSize: 14,
    fontWeight: '600',
  },
  customTimer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: spacing.sm,
  },
  timerInput: {
    flex: 1,
    backgroundColor: 'rgba(255,255,255,0.1)',
    paddingVertical: spacing.sm,
    paddingHorizontal: spacing.md,
    borderRadius: 8,
    color: palette.text,
    fontSize: 16,
    marginRight: spacing.sm,
  },
  startTimerButton: {
    backgroundColor: palette.tint,
    paddingVertical: spacing.sm,
    paddingHorizontal: spacing.lg,
    borderRadius: 8,
  },
  startTimerText: {
    color: '#001a2e',
    fontSize: 16,
    fontWeight: '600',
  },
  settingRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: spacing.md,
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(255,255,255,0.1)',
  },
  settingLabel: {
    fontSize: 16,
    color: palette.text,
    flex: 1,
  },
  actionButton: {
    backgroundColor: 'rgba(0,212,255,0.2)',
    paddingVertical: spacing.md,
    borderRadius: 12,
    alignItems: 'center',
    marginTop: spacing.md,
  },
  actionButtonText: {
    color: palette.tint,
    fontSize: 16,
    fontWeight: '600',
  },
});