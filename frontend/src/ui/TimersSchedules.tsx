/**
 * Timers & Schedules til LOY PLAY-paritet
 * Sleep/Wake timers, daglige/ugentlige planer, sunrise/sunset
 */

import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Alert } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import Slider from '@react-native-community/slider';
import { Card, PrimaryButton, SecondaryButton, InputField } from './components';
import { palette, spacing, radius } from './theme';
import { useBleStore } from '../store/bleStore';
import AsyncStorage from '@react-native-async-storage/async-storage';

interface Timer {
  id: string;
  name: string;
  type: 'sleep' | 'wake' | 'custom';
  time: string; // HH:MM format
  enabled: boolean;
  repeatDays: number[]; // 0-6 (Sunday-Saturday)
  action: TimerAction;
  created: string;
}

interface Schedule {
  id: string;
  name: string;
  type: 'daily' | 'weekly' | 'sunrise' | 'sunset';
  startTime: string;
  endTime: string;
  repeatDays: number[];
  enabled: boolean;
  action: ScheduleAction;
  location?: { lat: number; lon: number };
  offset: number; // minutes offset for sunrise/sunset
}

interface TimerAction {
  type: 'power' | 'brightness' | 'color' | 'animation' | 'scene';
  parameters: any;
}

interface ScheduleAction {
  type: 'power' | 'brightness' | 'color' | 'animation' | 'scene';
  parameters: any;
}

const DAYS_OF_WEEK = [
  { short: 'S', long: 'Søndag', index: 0 },
  { short: 'M', long: 'Mandag', index: 1 },
  { short: 'T', long: 'Tirsdag', index: 2 },
  { short: 'O', long: 'Onsdag', index: 3 },
  { short: 'T', long: 'Torsdag', index: 4 },
  { short: 'F', long: 'Fredag', index: 5 },
  { short: 'L', long: 'Lørdag', index: 6 },
];

const ACTION_TYPES = [
  { value: 'power', label: 'Tænd/Sluk', icon: 'power' },
  { value: 'brightness', label: 'Lysstyrke', icon: 'sunny' },
  { value: 'color', label: 'Farve', icon: 'color-palette' },
  { value: 'animation', label: 'Animation', icon: 'flash' },
  { value: 'scene', label: 'Scene', icon: 'apps' },
];

export const TimersSchedules: React.FC = () => {
  const { sendCommand, connectedDevice } = useBleStore();
  
  const [timers, setTimers] = useState<Timer[]>([]);
  const [schedules, setSchedules] = useState<Schedule[]>([]);
  const [activeTab, setActiveTab] = useState<'timers' | 'schedules'>('timers');
  const [selectedTimer, setSelectedTimer] = useState<string | null>(null);
  const [selectedSchedule, setSelectedSchedule] = useState<string | null>(null);
  const [currentTime, setCurrentTime] = useState(new Date());
  const [location, setLocation] = useState<{ lat: number; lon: number } | null>(null);

  // Update current time every minute
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentTime(new Date());
      checkActiveTimers();
    }, 60000);
    
    return () => clearInterval(interval);
  }, []);

  // Load saved timers and schedules
  useEffect(() => {
    loadTimersSchedules();
    getCurrentLocation();
  }, []);

  // Save timers and schedules to storage
  const saveTimersSchedules = async () => {
    try {
      await AsyncStorage.setItem('nerdvaerket_timers', JSON.stringify(timers));
      await AsyncStorage.setItem('nerdvaerket_schedules', JSON.stringify(schedules));
    } catch (error) {
      console.log('Error saving timers/schedules:', error);
    }
  };

  // Load timers and schedules from storage
  const loadTimersSchedules = async () => {
    try {
      const savedTimers = await AsyncStorage.getItem('nerdvaerket_timers');
      const savedSchedules = await AsyncStorage.getItem('nerdvaerket_schedules');
      
      if (savedTimers) {
        setTimers(JSON.parse(savedTimers));
      }
      
      if (savedSchedules) {
        setSchedules(JSON.parse(savedSchedules));
      }
    } catch (error) {
      console.log('Error loading timers/schedules:', error);
    }
  };

  // Get user location for sunrise/sunset
  const getCurrentLocation = async () => {
    // In a real app, this would use expo-location
    // For now, use Copenhagen coordinates as default
    setLocation({ lat: 55.6761, lon: 12.5683 });
  };

  // Calculate sunrise/sunset times
  const calculateSunTimes = (date: Date, lat: number, lon: number) => {
    // Simplified calculation - in real app would use proper astronomy library
    const dayOfYear = Math.floor((date.getTime() - new Date(date.getFullYear(), 0, 0).getTime()) / 86400000);
    const sunriseHour = 6 + Math.sin((dayOfYear / 365) * 2 * Math.PI) * 2;
    const sunsetHour = 18 + Math.sin((dayOfYear / 365) * 2 * Math.PI) * 2;
    
    return {
      sunrise: `${Math.floor(sunriseHour).toString().padStart(2, '0')}:${Math.floor((sunriseHour % 1) * 60).toString().padStart(2, '0')}`,
      sunset: `${Math.floor(sunsetHour).toString().padStart(2, '0')}:${Math.floor((sunsetHour % 1) * 60).toString().padStart(2, '0')}`
    };
  };

  // Check and execute active timers
  const checkActiveTimers = () => {
    const now = new Date();
    const currentDay = now.getDay();
    const currentTimeStr = `${now.getHours().toString().padStart(2, '0')}:${now.getMinutes().toString().padStart(2, '0')}`;
    
    // Check timers
    timers.forEach(timer => {
      if (timer.enabled && timer.time === currentTimeStr) {
        if (timer.repeatDays.length === 0 || timer.repeatDays.includes(currentDay)) {
          executeTimerAction(timer);
        }
      }
    });
    
    // Check schedules
    schedules.forEach(schedule => {
      if (schedule.enabled && shouldExecuteSchedule(schedule, now)) {
        executeScheduleAction(schedule);
      }
    });
  };

  // Determine if schedule should execute
  const shouldExecuteSchedule = (schedule: Schedule, now: Date): boolean => {
    const currentDay = now.getDay();
    const currentTimeStr = `${now.getHours().toString().padStart(2, '0')}:${now.getMinutes().toString().padStart(2, '0')}`;
    
    if (schedule.repeatDays.length > 0 && !schedule.repeatDays.includes(currentDay)) {
      return false;
    }
    
    if (schedule.type === 'sunrise' || schedule.type === 'sunset') {
      if (location) {
        const sunTimes = calculateSunTimes(now, location.lat, location.lon);
        const targetTime = schedule.type === 'sunrise' ? sunTimes.sunrise : sunTimes.sunset;
        
        // Apply offset
        const [hours, minutes] = targetTime.split(':').map(Number);
        const targetMinutes = hours * 60 + minutes + schedule.offset;
        const adjustedHours = Math.floor(targetMinutes / 60) % 24;
        const adjustedMinutesOnly = targetMinutes % 60;
        const adjustedTimeStr = `${adjustedHours.toString().padStart(2, '0')}:${adjustedMinutesOnly.toString().padStart(2, '0')}`;
        
        return currentTimeStr === adjustedTimeStr;
      }
      return false;
    }
    
    return currentTimeStr === schedule.startTime;
  };

  // Execute timer action
  const executeTimerAction = async (timer: Timer) => {
    if (!connectedDevice) return;
    
    try {
      const { type, parameters } = timer.action;
      
      switch (type) {
        case 'power':
          await sendCommand('power', parameters.state ? 'on' : 'off', {});
          break;
        case 'brightness':
          await sendCommand('brightness', 'set', { value: parameters.value });
          break;
        case 'color':
          await sendCommand('color', 'rgb', parameters.color);
          break;
        case 'animation':
          await sendCommand('animation', 'set', { id: parameters.animationId });
          break;
        case 'scene':
          await sendCommand('scene', 'load', { id: parameters.sceneId });
          break;
      }
      
      console.log(`Executed timer: ${timer.name}`);
    } catch (error) {
      console.log('Error executing timer action:', error);
    }
  };

  // Execute schedule action
  const executeScheduleAction = async (schedule: Schedule) => {
    if (!connectedDevice) return;
    
    try {
      const { type, parameters } = schedule.action;
      
      switch (type) {
        case 'power':
          await sendCommand('power', parameters.state ? 'on' : 'off', {});
          break;
        case 'brightness':
          await sendCommand('brightness', 'set', { value: parameters.value });
          break;
        case 'color':
          await sendCommand('color', 'rgb', parameters.color);
          break;
        case 'animation':
          await sendCommand('animation', 'set', { id: parameters.animationId });
          break;
        case 'scene':
          await sendCommand('scene', 'load', { id: parameters.sceneId });
          break;
      }
      
      console.log(`Executed schedule: ${schedule.name}`);
    } catch (error) {
      console.log('Error executing schedule action:', error);
    }
  };

  // Add new timer
  const addTimer = () => {
    const now = new Date();
    const newTimer: Timer = {
      id: Date.now().toString(),
      name: 'Ny Timer',
      type: 'custom',
      time: `${now.getHours().toString().padStart(2, '0')}:${now.getMinutes().toString().padStart(2, '0')}`,
      enabled: true,
      repeatDays: [],
      action: {
        type: 'power',
        parameters: { state: true }
      },
      created: new Date().toISOString()
    };
    
    setTimers(prev => [...prev, newTimer]);
    setSelectedTimer(newTimer.id);
  };

  // Add new schedule
  const addSchedule = () => {
    const now = new Date();
    const newSchedule: Schedule = {
      id: Date.now().toString(),
      name: 'Ny Plan',
      type: 'daily',
      startTime: `${now.getHours().toString().padStart(2, '0')}:${now.getMinutes().toString().padStart(2, '0')}`,
      endTime: `${(now.getHours() + 1).toString().padStart(2, '0')}:${now.getMinutes().toString().padStart(2, '0')}`,
      repeatDays: [],
      enabled: true,
      action: {
        type: 'power',
        parameters: { state: true }
      },
      offset: 0
    };
    
    setSchedules(prev => [...prev, newSchedule]);
    setSelectedSchedule(newSchedule.id);
  };

  // Delete timer
  const deleteTimer = (id: string) => {
    Alert.alert(
      'Slet Timer',
      'Er du sikker på, at du vil slette denne timer?',
      [
        { text: 'Annuller', style: 'cancel' },
        { 
          text: 'Slet', 
          style: 'destructive',
          onPress: () => {
            setTimers(prev => prev.filter(t => t.id !== id));
            if (selectedTimer === id) {
              setSelectedTimer(null);
            }
          }
        }
      ]
    );
  };

  // Delete schedule
  const deleteSchedule = (id: string) => {
    Alert.alert(
      'Slet Plan',
      'Er du sikker på, at du vil slette denne plan?',
      [
        { text: 'Annuller', style: 'cancel' },
        { 
          text: 'Slet', 
          style: 'destructive',
          onPress: () => {
            setSchedules(prev => prev.filter(s => s.id !== id));
            if (selectedSchedule === id) {
              setSelectedSchedule(null);
            }
          }
        }
      ]
    );
  };

  // Update timer
  const updateTimer = (id: string, updates: Partial<Timer>) => {
    setTimers(prev => prev.map(t => t.id === id ? { ...t, ...updates } : t));
  };

  // Update schedule
  const updateSchedule = (id: string, updates: Partial<Schedule>) => {
    setSchedules(prev => prev.map(s => s.id === id ? { ...s, ...updates } : s));
  };

  // Toggle day selection
  const toggleDay = (item: Timer | Schedule, dayIndex: number) => {
    const currentDays = item.repeatDays;
    const newDays = currentDays.includes(dayIndex)
      ? currentDays.filter(d => d !== dayIndex)
      : [...currentDays, dayIndex].sort();
    
    if ('time' in item) {
      updateTimer(item.id, { repeatDays: newDays });
    } else {
      updateSchedule(item.id, { repeatDays: newDays });
    }
  };

  // Save all changes
  useEffect(() => {
    saveTimersSchedules();
  }, [timers, schedules]);

  const selectedTimerObj = timers.find(t => t.id === selectedTimer);
  const selectedScheduleObj = schedules.find(s => s.id === selectedSchedule);

  const sunTimes = location ? calculateSunTimes(currentTime, location.lat, location.lon) : null;

  return (
    <ScrollView style={styles.container}>
      {/* Current Time & Sun Times */}
      <Card style={styles.timeCard}>
        <View style={styles.timeInfo}>
          <View style={styles.currentTime}>
            <Ionicons name="time" size={24} color={palette.tint} />
            <Text style={styles.timeText}>
              {currentTime.toLocaleTimeString('da-DK', { hour: '2-digit', minute: '2-digit' })}
            </Text>
          </View>
          
          {sunTimes && (
            <View style={styles.sunTimes}>
              <View style={styles.sunTime}>
                <Ionicons name="sunny" size={16} color={palette.text} />
                <Text style={styles.sunTimeText}>Solopgang: {sunTimes.sunrise}</Text>
              </View>
              <View style={styles.sunTime}>
                <Ionicons name="moon" size={16} color={palette.text} />
                <Text style={styles.sunTimeText}>Solnedgang: {sunTimes.sunset}</Text>
              </View>
            </View>
          )}
        </View>
      </Card>

      {/* Tab Selector */}
      <View style={styles.tabContainer}>
        <View style={styles.tabButtons}>
          <TouchableOpacity 
            style={[styles.tabButton, activeTab === 'timers' && styles.tabButtonActive]}
            onPress={() => setActiveTab('timers')}
          >
            <Text style={[styles.tabText, activeTab === 'timers' && styles.tabTextActive]}>
              Timers
            </Text>
          </TouchableOpacity>
          
          <TouchableOpacity 
            style={[styles.tabButton, activeTab === 'schedules' && styles.tabButtonActive]}
            onPress={() => setActiveTab('schedules')}
          >
            <Text style={[styles.tabText, activeTab === 'schedules' && styles.tabTextActive]}>
              Planer
            </Text>
          </TouchableOpacity>
        </View>
      </View>

      {/* Timers Tab */}
      {activeTab === 'timers' && (
        <>
          {/* Timers List */}
          <Card style={styles.listCard}>
            <View style={styles.listHeader}>
              <Text style={styles.sectionTitle}>Timers</Text>
              <SecondaryButton
                title="Tilføj"
                icon="add"
                onPress={addTimer}
              />
            </View>
            
            {timers.map((timer) => (
              <TouchableOpacity
                key={timer.id}
                style={[
                  styles.listItem,
                  selectedTimer === timer.id && styles.listItemActive
                ]}
                onPress={() => setSelectedTimer(timer.id)}
                activeOpacity={0.8}
              >
                <View style={styles.itemInfo}>
                  <Text style={styles.itemName}>{timer.name}</Text>
                  <Text style={styles.itemDetails}>
                    {timer.time} • {timer.type === 'sleep' ? 'Sluk' : timer.type === 'wake' ? 'Tænd' : 'Brugerdefineret'}
                    {timer.repeatDays.length > 0 && ` • ${timer.repeatDays.length} dage`}
                  </Text>
                </View>
                
                <View style={styles.itemControls}>
                  <TouchableOpacity
                    style={[styles.enableToggle, timer.enabled && styles.enableToggleActive]}
                    onPress={() => updateTimer(timer.id, { enabled: !timer.enabled })}
                    activeOpacity={0.8}
                  >
                    <Ionicons 
                      name={timer.enabled ? "checkmark" : "close"} 
                      size={16} 
                      color={timer.enabled ? palette.bg : palette.text} 
                    />
                  </TouchableOpacity>
                  
                  <TouchableOpacity
                    style={styles.deleteButton}
                    onPress={() => deleteTimer(timer.id)}
                    activeOpacity={0.8}
                  >
                    <Ionicons name="trash" size={16} color={palette.error} />
                  </TouchableOpacity>
                </View>
              </TouchableOpacity>
            ))}
            
            {timers.length === 0 && (
              <View style={styles.emptyState}>
                <Ionicons name="time" size={48} color={palette.muted} />
                <Text style={styles.emptyText}>Ingen timers endnu</Text>
                <Text style={styles.emptySubtext}>Tryk "Tilføj" for at oprette din første timer</Text>
              </View>
            )}
          </Card>

          {/* Timer Editor */}
          {selectedTimerObj && (
            <Card style={styles.editorCard}>
              <Text style={styles.sectionTitle}>Timer Editor</Text>
              
              {/* Name */}
              <View style={styles.parameterSection}>
                <Text style={styles.parameterLabel}>Navn</Text>
                <InputField
                  value={selectedTimerObj.name}
                  onChangeText={(text) => updateTimer(selectedTimerObj.id, { name: text })}
                  placeholder="Timer navn"
                />
              </View>

              {/* Time */}
              <View style={styles.parameterSection}>
                <Text style={styles.parameterLabel}>Tid</Text>
                <InputField
                  value={selectedTimerObj.time}
                  onChangeText={(text) => {
                    if (/^\d{2}:\d{2}$/.test(text) || text.length <= 5) {
                      updateTimer(selectedTimerObj.id, { time: text });
                    }
                  }}
                  placeholder="HH:MM"
                  keyboardType="numeric"
                />
              </View>

              {/* Timer Type */}
              <View style={styles.parameterSection}>
                <Text style={styles.parameterLabel}>Type</Text>
                <View style={styles.typeButtons}>
                  {[
                    { value: 'wake', label: 'Tænd', icon: 'sunny' },
                    { value: 'sleep', label: 'Sluk', icon: 'moon' },
                    { value: 'custom', label: 'Brugerdefineret', icon: 'settings' },
                  ].map((type) => (
                    <TouchableOpacity
                      key={type.value}
                      style={[
                        styles.typeButton,
                        selectedTimerObj.type === type.value && styles.typeButtonActive
                      ]}
                      onPress={() => updateTimer(selectedTimerObj.id, { type: type.value as any })}
                      activeOpacity={0.8}
                    >
                      <Ionicons 
                        name={type.icon as any} 
                        size={16} 
                        color={selectedTimerObj.type === type.value ? palette.bg : palette.text} 
                      />
                      <Text style={[
                        styles.typeText,
                        selectedTimerObj.type === type.value && styles.typeTextActive
                      ]}>
                        {type.label}
                      </Text>
                    </TouchableOpacity>
                  ))}
                </View>
              </View>

              {/* Repeat Days */}
              <View style={styles.parameterSection}>
                <Text style={styles.parameterLabel}>Gentag Dage</Text>
                <View style={styles.daysSelector}>
                  {DAYS_OF_WEEK.map((day) => (
                    <TouchableOpacity
                      key={day.index}
                      style={[
                        styles.dayButton,
                        selectedTimerObj.repeatDays.includes(day.index) && styles.dayButtonActive
                      ]}
                      onPress={() => toggleDay(selectedTimerObj, day.index)}
                      activeOpacity={0.8}
                    >
                      <Text style={[
                        styles.dayText,
                        selectedTimerObj.repeatDays.includes(day.index) && styles.dayTextActive
                      ]}>
                        {day.short}
                      </Text>
                    </TouchableOpacity>
                  ))}
                </View>
                <Text style={styles.daysHelp}>
                  {selectedTimerObj.repeatDays.length === 0 
                    ? 'Kører kun én gang' 
                    : `Kører ${selectedTimerObj.repeatDays.length} dage om ugen`}
                </Text>
              </View>

              {/* Action Configuration */}
              <View style={styles.parameterSection}>
                <Text style={styles.parameterLabel}>Handling</Text>
                <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.actionScroll}>
                  {ACTION_TYPES.map((action) => (
                    <TouchableOpacity
                      key={action.value}
                      style={[
                        styles.actionButton,
                        selectedTimerObj.action.type === action.value && styles.actionButtonActive
                      ]}
                      onPress={() => updateTimer(selectedTimerObj.id, { 
                        action: { 
                          type: action.value as any, 
                          parameters: action.value === 'power' ? { state: true } : { value: 50 }
                        }
                      })}
                      activeOpacity={0.8}
                    >
                      <Ionicons 
                        name={action.icon as any} 
                        size={16} 
                        color={selectedTimerObj.action.type === action.value ? palette.bg : palette.text} 
                      />
                      <Text style={[
                        styles.actionText,
                        selectedTimerObj.action.type === action.value && styles.actionTextActive
                      ]}>
                        {action.label}
                      </Text>
                    </TouchableOpacity>
                  ))}
                </ScrollView>
              </View>
            </Card>
          )}
        </>
      )}

      {/* Schedules Tab */}
      {activeTab === 'schedules' && (
        <>
          {/* Schedules List */}
          <Card style={styles.listCard}>
            <View style={styles.listHeader}>
              <Text style={styles.sectionTitle}>Planer</Text>
              <SecondaryButton
                title="Tilføj"
                icon="add"
                onPress={addSchedule}
              />
            </View>
            
            {schedules.map((schedule) => (
              <TouchableOpacity
                key={schedule.id}
                style={[
                  styles.listItem,
                  selectedSchedule === schedule.id && styles.listItemActive
                ]}
                onPress={() => setSelectedSchedule(schedule.id)}
                activeOpacity={0.8}
              >
                <View style={styles.itemInfo}>
                  <Text style={styles.itemName}>{schedule.name}</Text>
                  <Text style={styles.itemDetails}>
                    {schedule.type === 'sunrise' || schedule.type === 'sunset' 
                      ? `${schedule.type === 'sunrise' ? 'Solopgang' : 'Solnedgang'}${schedule.offset !== 0 ? ` ${schedule.offset > 0 ? '+' : ''}${schedule.offset}min` : ''}`
                      : `${schedule.startTime} - ${schedule.endTime}`}
                    {schedule.repeatDays.length > 0 && ` • ${schedule.repeatDays.length} dage`}
                  </Text>
                </View>
                
                <View style={styles.itemControls}>
                  <TouchableOpacity
                    style={[styles.enableToggle, schedule.enabled && styles.enableToggleActive]}
                    onPress={() => updateSchedule(schedule.id, { enabled: !schedule.enabled })}
                    activeOpacity={0.8}
                  >
                    <Ionicons 
                      name={schedule.enabled ? "checkmark" : "close"} 
                      size={16} 
                      color={schedule.enabled ? palette.bg : palette.text} 
                    />
                  </TouchableOpacity>
                  
                  <TouchableOpacity
                    style={styles.deleteButton}
                    onPress={() => deleteSchedule(schedule.id)}
                    activeOpacity={0.8}
                  >
                    <Ionicons name="trash" size={16} color={palette.error} />
                  </TouchableOpacity>
                </View>
              </TouchableOpacity>
            ))}
            
            {schedules.length === 0 && (
              <View style={styles.emptyState}>
                <Ionicons name="calendar" size={48} color={palette.muted} />
                <Text style={styles.emptyText}>Ingen planer endnu</Text>
                <Text style={styles.emptySubtext}>Tryk "Tilføj" for at oprette din første plan</Text>
              </View>
            )}
          </Card>

          {/* Schedule Editor */}
          {selectedScheduleObj && (
            <Card style={styles.editorCard}>
              <Text style={styles.sectionTitle}>Plan Editor</Text>
              
              {/* Name */}
              <View style={styles.parameterSection}>
                <Text style={styles.parameterLabel}>Navn</Text>
                <InputField
                  value={selectedScheduleObj.name}
                  onChangeText={(text) => updateSchedule(selectedScheduleObj.id, { name: text })}
                  placeholder="Plan navn"
                />
              </View>

              {/* Schedule Type */}
              <View style={styles.parameterSection}>
                <Text style={styles.parameterLabel}>Type</Text>
                <View style={styles.scheduleTypeButtons}>
                  {[
                    { value: 'daily', label: 'Daglig', icon: 'today' },
                    { value: 'weekly', label: 'Ugentlig', icon: 'calendar' },
                    { value: 'sunrise', label: 'Solopgang', icon: 'sunny' },
                    { value: 'sunset', label: 'Solnedgang', icon: 'moon' },
                  ].map((type) => (
                    <TouchableOpacity
                      key={type.value}
                      style={[
                        styles.scheduleTypeButton,
                        selectedScheduleObj.type === type.value && styles.scheduleTypeButtonActive
                      ]}
                      onPress={() => updateSchedule(selectedScheduleObj.id, { type: type.value as any })}
                      activeOpacity={0.8}
                    >
                      <Ionicons 
                        name={type.icon as any} 
                        size={16} 
                        color={selectedScheduleObj.type === type.value ? palette.bg : palette.text} 
                      />
                      <Text style={[
                        styles.scheduleTypeText,
                        selectedScheduleObj.type === type.value && styles.scheduleTypeTextActive
                      ]}>
                        {type.label}
                      </Text>
                    </TouchableOpacity>
                  ))}
                </View>
              </View>

              {/* Time Configuration */}
              {(selectedScheduleObj.type === 'daily' || selectedScheduleObj.type === 'weekly') && (
                <>
                  <View style={styles.parameterSection}>
                    <Text style={styles.parameterLabel}>Start Tid</Text>
                    <InputField
                      value={selectedScheduleObj.startTime}
                      onChangeText={(text) => {
                        if (/^\d{2}:\d{2}$/.test(text) || text.length <= 5) {
                          updateSchedule(selectedScheduleObj.id, { startTime: text });
                        }
                      }}
                      placeholder="HH:MM"
                      keyboardType="numeric"
                    />
                  </View>
                  
                  <View style={styles.parameterSection}>
                    <Text style={styles.parameterLabel}>Slut Tid</Text>
                    <InputField
                      value={selectedScheduleObj.endTime}
                      onChangeText={(text) => {
                        if (/^\d{2}:\d{2}$/.test(text) || text.length <= 5) {
                          updateSchedule(selectedScheduleObj.id, { endTime: text });
                        }
                      }}
                      placeholder="HH:MM"
                      keyboardType="numeric"
                    />
                  </View>
                </>
              )}

              {/* Offset for sunrise/sunset */}
              {(selectedScheduleObj.type === 'sunrise' || selectedScheduleObj.type === 'sunset') && (
                <View style={styles.parameterSection}>
                  <View style={styles.parameterHeader}>
                    <Ionicons name="time" size={20} color={palette.text} />
                    <Text style={styles.parameterLabel}>Offset</Text>
                    <Text style={styles.parameterValue}>{selectedScheduleObj.offset}min</Text>
                  </View>
                  <Slider
                    style={styles.slider}
                    minimumValue={-120}
                    maximumValue={120}
                    value={selectedScheduleObj.offset}
                    step={5}
                    onValueChange={(value) => updateSchedule(selectedScheduleObj.id, { offset: Math.round(value) })}
                    minimumTrackTintColor={palette.tint}
                    maximumTrackTintColor={palette.muted}
                  />
                  <Text style={styles.offsetHelp}>
                    {selectedScheduleObj.offset === 0 
                      ? `Præcis ved ${selectedScheduleObj.type === 'sunrise' ? 'solopgang' : 'solnedgang'}`
                      : `${Math.abs(selectedScheduleObj.offset)} minutter ${selectedScheduleObj.offset > 0 ? 'efter' : 'før'} ${selectedScheduleObj.type === 'sunrise' ? 'solopgang' : 'solnedgang'}`}
                  </Text>
                </View>
              )}

              {/* Repeat Days */}
              <View style={styles.parameterSection}>
                <Text style={styles.parameterLabel}>Gentag Dage</Text>
                <View style={styles.daysSelector}>
                  {DAYS_OF_WEEK.map((day) => (
                    <TouchableOpacity
                      key={day.index}
                      style={[
                        styles.dayButton,
                        selectedScheduleObj.repeatDays.includes(day.index) && styles.dayButtonActive
                      ]}
                      onPress={() => toggleDay(selectedScheduleObj, day.index)}
                      activeOpacity={0.8}
                    >
                      <Text style={[
                        styles.dayText,
                        selectedScheduleObj.repeatDays.includes(day.index) && styles.dayTextActive
                      ]}>
                        {day.short}
                      </Text>
                    </TouchableOpacity>
                  ))}
                </View>
                <Text style={styles.daysHelp}>
                  {selectedScheduleObj.repeatDays.length === 0 
                    ? 'Kører hver dag' 
                    : `Kører ${selectedScheduleObj.repeatDays.length} dage om ugen`}
                </Text>
              </View>
            </Card>
          )}
        </>
      )}
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: spacing.md,
  },
  timeCard: {
    padding: spacing.md,
    marginBottom: spacing.md,
  },
  timeInfo: {
    alignItems: 'center',
  },
  currentTime: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm,
    marginBottom: spacing.sm,
  },
  timeText: {
    color: palette.text,
    fontSize: 24,
    fontWeight: '600',
  },
  sunTimes: {
    flexDirection: 'row',
    gap: spacing.lg,
  },
  sunTime: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.xs,
  },
  sunTimeText: {
    color: palette.muted,
    fontSize: 12,
  },
  tabContainer: {
    marginBottom: spacing.md,
  },
  tabButtons: {
    flexDirection: 'row',
    backgroundColor: 'rgba(122,140,160,0.1)',
    borderRadius: 8,
    padding: 4,
  },
  tabButton: {
    flex: 1,
    paddingVertical: spacing.sm,
    paddingHorizontal: spacing.md,
    borderRadius: 6,
    alignItems: 'center',
  },
  tabButtonActive: {
    backgroundColor: palette.tint,
  },
  tabText: {
    color: palette.muted,
    fontSize: 14,
    fontWeight: '600',
  },
  tabTextActive: {
    color: palette.bg,
  },
  listCard: {
    padding: spacing.md,
    marginBottom: spacing.md,
  },
  listHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: spacing.md,
  },
  sectionTitle: {
    color: palette.text,
    fontSize: 16,
    fontWeight: '600',
  },
  listItem: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: spacing.sm,
    marginBottom: spacing.sm,
    borderRadius: radius.sm,
    backgroundColor: 'rgba(122,140,160,0.1)',
  },
  listItemActive: {
    backgroundColor: 'rgba(0,212,255,0.2)',
    borderWidth: 1,
    borderColor: palette.tint,
  },
  itemInfo: {
    flex: 1,
  },
  itemName: {
    color: palette.text,
    fontSize: 14,
    fontWeight: '600',
  },
  itemDetails: {
    color: palette.muted,
    fontSize: 12,
    marginTop: 2,
  },
  itemControls: {
    flexDirection: 'row',
    gap: spacing.sm,
  },
  enableToggle: {
    width: 24,
    height: 24,
    borderRadius: 12,
    backgroundColor: palette.muted,
    alignItems: 'center',
    justifyContent: 'center',
  },
  enableToggleActive: {
    backgroundColor: palette.tint,
  },
  deleteButton: {
    width: 24,
    height: 24,
    borderRadius: 12,
    backgroundColor: 'rgba(255,59,48,0.2)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  emptyState: {
    alignItems: 'center',
    paddingVertical: spacing.xl,
  },
  emptyText: {
    color: palette.text,
    fontSize: 16,
    fontWeight: '600',
    marginTop: spacing.sm,
  },
  emptySubtext: {
    color: palette.muted,
    fontSize: 12,
    textAlign: 'center',
    marginTop: spacing.xs,
  },
  editorCard: {
    padding: spacing.md,
    marginBottom: spacing.md,
  },
  parameterSection: {
    marginBottom: spacing.md,
  },
  parameterHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: spacing.sm,
  },
  parameterLabel: {
    color: palette.text,
    fontSize: 14,
    marginBottom: spacing.sm,
    marginLeft: spacing.sm,
    flex: 1,
  },
  parameterValue: {
    color: palette.tint,
    fontSize: 14,
    fontWeight: '600',
  },
  slider: {
    height: 40,
  },
  typeButtons: {
    flexDirection: 'row',
    gap: spacing.sm,
  },
  typeButton: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: spacing.sm,
    paddingHorizontal: spacing.xs,
    borderRadius: radius.sm,
    backgroundColor: 'rgba(122,140,160,0.1)',
    gap: spacing.xs,
  },
  typeButtonActive: {
    backgroundColor: palette.tint,
  },
  typeText: {
    color: palette.text,
    fontSize: 11,
    fontWeight: '600',
  },
  typeTextActive: {
    color: palette.bg,
  },
  daysSelector: {
    flexDirection: 'row',
    gap: spacing.xs,
    marginBottom: spacing.xs,
  },
  dayButton: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: 'rgba(122,140,160,0.1)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  dayButtonActive: {
    backgroundColor: palette.tint,
  },
  dayText: {
    color: palette.text,
    fontSize: 12,
    fontWeight: '600',
  },
  dayTextActive: {
    color: palette.bg,
  },
  daysHelp: {
    color: palette.muted,
    fontSize: 11,
  },
  actionScroll: {
    marginTop: spacing.sm,
  },
  actionButton: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: spacing.sm,
    paddingHorizontal: spacing.md,
    marginRight: spacing.sm,
    borderRadius: radius.sm,
    backgroundColor: 'rgba(122,140,160,0.1)',
    gap: spacing.xs,
  },
  actionButtonActive: {
    backgroundColor: palette.tint,
  },
  actionText: {
    color: palette.text,
    fontSize: 12,
    fontWeight: '600',
  },
  actionTextActive: {
    color: palette.bg,
  },
  scheduleTypeButtons: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: spacing.sm,
  },
  scheduleTypeButton: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: spacing.sm,
    paddingHorizontal: spacing.md,
    borderRadius: radius.sm,
    backgroundColor: 'rgba(122,140,160,0.1)',
    gap: spacing.xs,
    minWidth: '45%',
    justifyContent: 'center',
  },
  scheduleTypeButtonActive: {
    backgroundColor: palette.tint,
  },
  scheduleTypeText: {
    color: palette.text,
    fontSize: 12,
    fontWeight: '600',
  },
  scheduleTypeTextActive: {
    color: palette.bg,
  },
  offsetHelp: {
    color: palette.muted,
    fontSize: 11,
    textAlign: 'center',
    marginTop: spacing.xs,
  },
});