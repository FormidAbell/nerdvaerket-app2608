/**
 * Device Groups - LOY PLAY style multi-device sync
 */

import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Switch, TextInput, Alert } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import { palette, gradients, spacing } from '../src/ui/theme';

interface DeviceGroup {
  id: number;
  name: string;
  devices: Device[];
  syncEnabled: boolean;
  masterDevice?: string;
}

interface Device {
  id: string;
  name: string;
  status: 'connected' | 'disconnected' | 'syncing';
  batteryLevel?: number;
  signal?: number;
}

export default function DeviceGroups() {
  const [groups, setGroups] = useState<DeviceGroup[]>([
    {
      id: 1,
      name: "Living Room Setup",
      devices: [
        { id: "device1", name: "iDot-3 Main", status: "connected", batteryLevel: 85, signal: -45 },
        { id: "device2", name: "iDot-3 Side", status: "connected", batteryLevel: 72, signal: -52 },
      ],
      syncEnabled: true,
      masterDevice: "device1"
    },
    {
      id: 2,
      name: "Bedroom Lights",
      devices: [
        { id: "device3", name: "iDot-3 Bedside", status: "disconnected", batteryLevel: 45, signal: -68 },
      ],
      syncEnabled: false
    }
  ]);

  const [availableDevices] = useState<Device[]>([
    { id: "device4", name: "iDot-3 New", status: "disconnected", batteryLevel: 90, signal: -38 },
    { id: "device5", name: "iDot-3 Portable", status: "connected", batteryLevel: 60, signal: -55 },
  ]);

  const [newGroupName, setNewGroupName] = useState("");
  const [showAddGroup, setShowAddGroup] = useState(false);

  const toggleGroupSync = (groupId: number) => {
    setGroups(prev => prev.map(group => 
      group.id === groupId ? { ...group, syncEnabled: !group.syncEnabled } : group
    ));
  };

  const setMasterDevice = (groupId: number, deviceId: string) => {
    setGroups(prev => prev.map(group => 
      group.id === groupId ? { ...group, masterDevice: deviceId } : group
    ));
  };

  const addDeviceToGroup = (groupId: number, device: Device) => {
    setGroups(prev => prev.map(group => 
      group.id === groupId 
        ? { ...group, devices: [...group.devices, device] }
        : group
    ));
  };

  const createNewGroup = () => {
    if (!newGroupName.trim()) {
      Alert.alert("Error", "Please enter a group name");
      return;
    }

    const newGroup: DeviceGroup = {
      id: Date.now(),
      name: newGroupName,
      devices: [],
      syncEnabled: false
    };

    setGroups(prev => [...prev, newGroup]);
    setNewGroupName("");
    setShowAddGroup(false);
  };

  const getStatusColor = (status: Device['status']) => {
    switch (status) {
      case 'connected': return palette.success;
      case 'syncing': return palette.warning;
      case 'disconnected': return palette.error;
      default: return palette.muted;
    }
  };

  const getStatusIcon = (status: Device['status']) => {
    switch (status) {
      case 'connected': return 'checkmark-circle';
      case 'syncing': return 'sync';
      case 'disconnected': return 'close-circle';
      default: return 'help-circle';
    }
  };

  return (
    <LinearGradient colors={gradients.primary} style={styles.container}>
      <SafeAreaView style={styles.safeArea}>
        <ScrollView style={styles.scrollView} contentContainerStyle={styles.content}>
          
          {/* Header */}
          <View style={styles.header}>
            <Ionicons name="people" size={32} color={palette.tint} />
            <Text style={styles.title}>Device Groups</Text>
            <Text style={styles.subtitle}>Synkroniser flere LED skærme</Text>
          </View>

          {/* Device Groups */}
          {groups.map((group) => (
            <View key={group.id} style={styles.card}>
              <View style={styles.cardHeader}>
                <Ionicons name="folder-outline" size={24} color={palette.tint} />
                <Text style={styles.cardTitle}>{group.name}</Text>
                <Switch 
                  value={group.syncEnabled} 
                  onValueChange={() => toggleGroupSync(group.id)}
                  trackColor={{ false: palette.muted, true: palette.tint }}
                />
              </View>
              
              {group.syncEnabled && group.devices.length > 0 && (
                <Text style={styles.syncStatus}>
                  ✅ Synchronized - Master: {group.devices.find(d => d.id === group.masterDevice)?.name || "None"}
                </Text>
              )}

              {/* Devices in Group */}
              {group.devices.map((device) => (
                <View key={device.id} style={styles.deviceItem}>
                  <View style={styles.deviceInfo}>
                    <View style={styles.deviceHeader}>
                      <Text style={styles.deviceName}>{device.name}</Text>
                      <Ionicons 
                        name={getStatusIcon(device.status) as any} 
                        size={20} 
                        color={getStatusColor(device.status)} 
                      />
                    </View>
                    <View style={styles.deviceStats}>
                      {device.batteryLevel && (
                        <Text style={styles.deviceStat}>🔋 {device.batteryLevel}%</Text>
                      )}
                      {device.signal && (
                        <Text style={styles.deviceStat}>📶 {device.signal} dBm</Text>
                      )}
                    </View>
                  </View>
                  
                  {group.syncEnabled && (
                    <TouchableOpacity 
                      style={[
                        styles.masterButton,
                        group.masterDevice === device.id && styles.masterButtonActive
                      ]}
                      onPress={() => setMasterDevice(group.id, device.id)}
                    >
                      <Text style={[
                        styles.masterButtonText,
                        group.masterDevice === device.id && styles.masterButtonTextActive
                      ]}>
                        {group.masterDevice === device.id ? "Master" : "Set Master"}
                      </Text>
                    </TouchableOpacity>
                  )}
                </View>
              ))}

              {/* Add Device to Group */}
              <TouchableOpacity style={styles.addDeviceButton}>
                <Ionicons name="add-circle-outline" size={20} color={palette.tint} />
                <Text style={styles.addDeviceText}>Add Device to Group</Text>
              </TouchableOpacity>
            </View>
          ))}

          {/* Available Devices */}
          <View style={styles.card}>
            <View style={styles.cardHeader}>
              <Ionicons name="scan-outline" size={24} color={palette.tint} />
              <Text style={styles.cardTitle}>Available Devices</Text>
            </View>
            
            {availableDevices.map((device) => (
              <View key={device.id} style={styles.deviceItem}>
                <View style={styles.deviceInfo}>
                  <View style={styles.deviceHeader}>
                    <Text style={styles.deviceName}>{device.name}</Text>
                    <Ionicons 
                      name={getStatusIcon(device.status) as any} 
                      size={20} 
                      color={getStatusColor(device.status)} 
                    />
                  </View>
                  <View style={styles.deviceStats}>
                    {device.batteryLevel && (
                      <Text style={styles.deviceStat}>🔋 {device.batteryLevel}%</Text>
                    )}
                    {device.signal && (
                      <Text style={styles.deviceStat}>📶 {device.signal} dBm</Text>
                    )}
                  </View>
                </View>
                
                <TouchableOpacity style={styles.connectButton}>
                  <Text style={styles.connectButtonText}>Connect</Text>
                </TouchableOpacity>
              </View>
            ))}
          </View>

          {/* Create New Group */}
          <View style={styles.card}>
            <TouchableOpacity 
              style={styles.cardHeader} 
              onPress={() => setShowAddGroup(!showAddGroup)}
            >
              <Ionicons name="add" size={24} color={palette.tint} />
              <Text style={styles.cardTitle}>Create New Group</Text>
              <Ionicons 
                name={showAddGroup ? "chevron-up" : "chevron-down"} 
                size={20} 
                color={palette.muted} 
              />
            </TouchableOpacity>
            
            {showAddGroup && (
              <View style={styles.newGroupForm}>
                <TextInput
                  style={styles.groupNameInput}
                  placeholder="Enter group name"
                  placeholderTextColor={palette.muted}
                  value={newGroupName}
                  onChangeText={setNewGroupName}
                />
                <View style={styles.formButtons}>
                  <TouchableOpacity 
                    style={styles.cancelButton}
                    onPress={() => setShowAddGroup(false)}
                  >
                    <Text style={styles.cancelButtonText}>Cancel</Text>
                  </TouchableOpacity>
                  <TouchableOpacity 
                    style={styles.createButton}
                    onPress={createNewGroup}
                  >
                    <Text style={styles.createButtonText}>Create</Text>
                  </TouchableOpacity>
                </View>
              </View>
            )}
          </View>

          {/* Sync Controls */}
          <View style={styles.card}>
            <View style={styles.cardHeader}>
              <Ionicons name="sync" size={24} color={palette.tint} />
              <Text style={styles.cardTitle}>Global Sync Controls</Text>
            </View>
            
            <TouchableOpacity style={styles.globalButton}>
              <Text style={styles.globalButtonText}>Sync All Groups</Text>
            </TouchableOpacity>
            
            <TouchableOpacity style={[styles.globalButton, styles.globalButtonSecondary]}>
              <Text style={styles.globalButtonTextSecondary}>Stop All Sync</Text>
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
  syncStatus: {
    fontSize: 14,
    color: palette.success,
    marginBottom: spacing.md,
    fontStyle: 'italic',
  },
  deviceItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: spacing.md,
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(255,255,255,0.1)',
  },
  deviceInfo: {
    flex: 1,
  },
  deviceHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 4,
  },
  deviceName: {
    fontSize: 16,
    fontWeight: '600',
    color: palette.text,
  },
  deviceStats: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  deviceStat: {
    fontSize: 12,
    color: palette.textSecondary,
    marginRight: spacing.md,
  },
  masterButton: {
    backgroundColor: 'rgba(255,255,255,0.1)',
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm,
    borderRadius: 8,
    marginLeft: spacing.sm,
  },
  masterButtonActive: {
    backgroundColor: palette.tint,
  },
  masterButtonText: {
    color: palette.text,
    fontSize: 12,
    fontWeight: '600',
  },
  masterButtonTextActive: {
    color: '#001a2e',
  },
  connectButton: {
    backgroundColor: 'rgba(0,212,255,0.2)',
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm,
    borderRadius: 8,
  },
  connectButtonText: {
    color: palette.tint,
    fontSize: 14,
    fontWeight: '600',
  },
  addDeviceButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'rgba(0,212,255,0.2)',
    paddingVertical: spacing.md,
    borderRadius: 12,
    marginTop: spacing.sm,
  },
  addDeviceText: {
    color: palette.text,
    fontSize: 16,
    fontWeight: '600',
    marginLeft: spacing.sm,
  },
  newGroupForm: {
    marginTop: spacing.md,
  },
  groupNameInput: {
    backgroundColor: 'rgba(255,255,255,0.1)',
    paddingVertical: spacing.md,
    paddingHorizontal: spacing.md,
    borderRadius: 8,
    color: palette.text,
    fontSize: 16,
    marginBottom: spacing.md,
  },
  formButtons: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  cancelButton: {
    backgroundColor: 'rgba(255,255,255,0.1)',
    paddingVertical: spacing.sm,
    paddingHorizontal: spacing.lg,
    borderRadius: 8,
    flex: 0.45,
    alignItems: 'center',
  },
  cancelButtonText: {
    color: palette.text,
    fontSize: 16,
    fontWeight: '600',
  },
  createButton: {
    backgroundColor: palette.tint,
    paddingVertical: spacing.sm,
    paddingHorizontal: spacing.lg,
    borderRadius: 8,
    flex: 0.45,
    alignItems: 'center',
  },
  createButtonText: {
    color: '#001a2e',
    fontSize: 16,
    fontWeight: '600',
  },
  globalButton: {
    backgroundColor: 'rgba(0,212,255,0.2)',
    paddingVertical: spacing.md,
    borderRadius: 12,
    alignItems: 'center',
    marginBottom: spacing.sm,
  },
  globalButtonSecondary: {
    backgroundColor: 'rgba(255,87,87,0.2)',
  },
  globalButtonText: {
    color: palette.tint,
    fontSize: 16,
    fontWeight: '600',
  },
  globalButtonTextSecondary: {
    color: palette.error,
    fontSize: 16,
    fontWeight: '600',
  },
});