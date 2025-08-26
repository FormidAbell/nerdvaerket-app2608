/**
 * Groups & Sync til LOY PLAY-paritet
 * Multi-device group creation, leader-follower sync, broadcast mode
 */

import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Alert } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { Card, PrimaryButton, SecondaryButton, InputField } from './components';
import { palette, spacing, radius } from './theme';
import { useBleStore } from '../store/bleStore';
import AsyncStorage from '@react-native-async-storage/async-storage';

interface DeviceGroup {
  id: string;
  name: string;
  devices: GroupDevice[];
  leader: string | null; // Device ID of the leader
  syncMode: 'broadcast' | 'leader-follower' | 'mesh';
  enabled: boolean;
  created: string;
}

interface GroupDevice {
  id: string;
  name: string;
  address: string;
  role: 'leader' | 'follower' | 'independent';
  connected: boolean;
  lastSeen: string;
  signalStrength: number; // RSSI
}

interface SyncCommand {
  id: string;
  command: string;
  parameters: any;
  timestamp: number;
  targetDevices: string[];
  status: 'pending' | 'sent' | 'acknowledged' | 'failed';
}

const SYNC_MODES = [
  { 
    value: 'broadcast', 
    label: 'Broadcast', 
    icon: 'radio',
    description: 'Send til alle enheder samtidig'
  },
  { 
    value: 'leader-follower', 
    label: 'Leader-Follower', 
    icon: 'people',
    description: 'En leder styrer alle følgere'
  },
  { 
    value: 'mesh', 
    label: 'Mesh Network', 
    icon: 'grid',
    description: 'Enheder kommunikerer indbyrdes'
  },
];

export const GroupsSync: React.FC = () => {
  const { connectedDevice, scanForDevices, connectToDevice, sendCommand } = useBleStore();
  
  const [groups, setGroups] = useState<DeviceGroup[]>([]);
  const [selectedGroup, setSelectedGroup] = useState<string | null>(null);
  const [availableDevices, setAvailableDevices] = useState<GroupDevice[]>([]);
  const [syncCommands, setSyncCommands] = useState<SyncCommand[]>([]);
  const [isScanning, setIsScanning] = useState(false);
  const [syncStatus, setSyncStatus] = useState<'idle' | 'syncing' | 'error'>('idle');

  // Load saved groups
  useEffect(() => {
    loadGroups();
    loadAvailableDevices();
  }, []);

  // Save groups to storage
  const saveGroups = async () => {
    try {
      await AsyncStorage.setItem('nerdvaerket_groups', JSON.stringify(groups));
    } catch (error) {
      console.log('Error saving groups:', error);
    }
  };

  // Load groups from storage
  const loadGroups = async () => {
    try {
      const savedGroups = await AsyncStorage.getItem('nerdvaerket_groups');
      if (savedGroups) {
        setGroups(JSON.parse(savedGroups));
      }
    } catch (error) {
      console.log('Error loading groups:', error);
    }
  };

  // Load available devices
  const loadAvailableDevices = async () => {
    try {
      const savedDevices = await AsyncStorage.getItem('nerdvaerket_devices');
      if (savedDevices) {
        setAvailableDevices(JSON.parse(savedDevices));
      }
    } catch (error) {
      console.log('Error loading devices:', error);
    }
  };

  // Save available devices
  const saveAvailableDevices = async (devices: GroupDevice[]) => {
    try {
      await AsyncStorage.setItem('nerdvaerket_devices', JSON.stringify(devices));
      setAvailableDevices(devices);
    } catch (error) {
      console.log('Error saving devices:', error);
    }
  };

  // Scan for nearby devices
  const scanForNearbyDevices = async () => {
    setIsScanning(true);
    
    try {
      // In real app, this would use BLE scanning
      // For now, simulate some discovered devices
      const mockDevices: GroupDevice[] = [
        {
          id: 'device-1',
          name: 'iDot-3 #001',
          address: 'AA:BB:CC:DD:EE:01',
          role: 'independent',
          connected: false,
          lastSeen: new Date().toISOString(),
          signalStrength: -45
        },
        {
          id: 'device-2', 
          name: 'iDot-3 #002',
          address: 'AA:BB:CC:DD:EE:02',
          role: 'independent',
          connected: false,
          lastSeen: new Date().toISOString(),
          signalStrength: -62
        },
        {
          id: 'device-3',
          name: 'iDot-3 #003', 
          address: 'AA:BB:CC:DD:EE:03',
          role: 'independent',
          connected: false,
          lastSeen: new Date().toISOString(),
          signalStrength: -78
        }
      ];
      
      // Merge with existing devices
      const existingIds = availableDevices.map(d => d.id);
      const newDevices = mockDevices.filter(d => !existingIds.includes(d.id));
      const updatedDevices = [...availableDevices, ...newDevices];
      
      await saveAvailableDevices(updatedDevices);
      
    } catch (error) {
      console.log('Error scanning for devices:', error);
      Alert.alert('Fejl', 'Kunne ikke scanne efter enheder');
    } finally {
      setIsScanning(false);
    }
  };

  // Create new group
  const createGroup = () => {
    const newGroup: DeviceGroup = {
      id: Date.now().toString(),
      name: 'Ny Gruppe',
      devices: [],
      leader: null,
      syncMode: 'broadcast',
      enabled: true,
      created: new Date().toISOString()
    };
    
    setGroups(prev => [...prev, newGroup]);
    setSelectedGroup(newGroup.id);
  };

  // Delete group
  const deleteGroup = (groupId: string) => {
    Alert.alert(
      'Slet Gruppe',
      'Er du sikker på, at du vil slette denne gruppe?',
      [
        { text: 'Annuller', style: 'cancel' },
        { 
          text: 'Slet', 
          style: 'destructive',
          onPress: () => {
            setGroups(prev => prev.filter(g => g.id !== groupId));
            if (selectedGroup === groupId) {
              setSelectedGroup(null);
            }
          }
        }
      ]
    );
  };

  // Update group
  const updateGroup = (groupId: string, updates: Partial<DeviceGroup>) => {
    setGroups(prev => prev.map(g => g.id === groupId ? { ...g, ...updates } : g));
  };

  // Add device to group
  const addDeviceToGroup = (groupId: string, deviceId: string) => {
    const device = availableDevices.find(d => d.id === deviceId);
    if (!device) return;
    
    const group = groups.find(g => g.id === groupId);
    if (!group) return;
    
    // Check if device is already in group
    if (group.devices.some(d => d.id === deviceId)) {
      Alert.alert('Fejl', 'Enheden er allerede i gruppen');
      return;
    }
    
    const updatedDevice = { ...device, role: 'follower' as const };
    const updatedDevices = [...group.devices, updatedDevice];
    
    // If this is the first device, make it the leader
    let leader = group.leader;
    if (updatedDevices.length === 1) {
      leader = deviceId;
      updatedDevice.role = 'leader';
    }
    
    updateGroup(groupId, { 
      devices: updatedDevices,
      leader: leader
    });
  };

  // Remove device from group
  const removeDeviceFromGroup = (groupId: string, deviceId: string) => {
    const group = groups.find(g => g.id === groupId);
    if (!group) return;
    
    const updatedDevices = group.devices.filter(d => d.id !== deviceId);
    let newLeader = group.leader;
    
    // If we removed the leader, assign a new one
    if (group.leader === deviceId && updatedDevices.length > 0) {
      newLeader = updatedDevices[0].id;
      updatedDevices[0].role = 'leader';
    } else if (updatedDevices.length === 0) {
      newLeader = null;
    }
    
    updateGroup(groupId, { 
      devices: updatedDevices,
      leader: newLeader
    });
  };

  // Set device role in group
  const setDeviceRole = (groupId: string, deviceId: string, role: 'leader' | 'follower') => {
    const group = groups.find(g => g.id === groupId);
    if (!group) return;
    
    let updatedDevices = group.devices.map(d => 
      d.id === deviceId ? { ...d, role } : d
    );
    
    let newLeader = group.leader;
    
    if (role === 'leader') {
      // Remove leader role from other devices
      updatedDevices = updatedDevices.map(d => 
        d.id !== deviceId && d.role === 'leader' ? { ...d, role: 'follower' } : d
      );
      newLeader = deviceId;
    } else if (group.leader === deviceId) {
      // If demoting current leader, assign new leader
      const nextLeader = updatedDevices.find(d => d.id !== deviceId);
      if (nextLeader) {
        nextLeader.role = 'leader';
        newLeader = nextLeader.id;
      } else {
        newLeader = null;
      }
    }
    
    updateGroup(groupId, { 
      devices: updatedDevices,
      leader: newLeader
    });
  };

  // Connect to all devices in group
  const connectToGroup = async (groupId: string) => {
    const group = groups.find(g => g.id === groupId);
    if (!group) return;
    
    setSyncStatus('syncing');
    
    try {
      for (const device of group.devices) {
        if (!device.connected) {
          // In real app, would connect to each device
          console.log(`Connecting to ${device.name}...`);
          
          // Simulate connection
          await new Promise(resolve => setTimeout(resolve, 1000));
          
          // Update device connection status
          const updatedDevices = group.devices.map(d => 
            d.id === device.id ? { ...d, connected: true, lastSeen: new Date().toISOString() } : d
          );
          
          updateGroup(groupId, { devices: updatedDevices });
        }
      }
      
      setSyncStatus('idle');
      Alert.alert('Succes', 'Forbundet til alle enheder i gruppen');
      
    } catch (error) {
      console.log('Error connecting to group:', error);
      setSyncStatus('error');
      Alert.alert('Fejl', 'Kunne ikke forbinde til alle enheder');
    }
  };

  // Send command to group
  const sendCommandToGroup = async (groupId: string, command: string, parameters: any) => {
    const group = groups.find(g => g.id === groupId);
    if (!group || !group.enabled) return;
    
    const connectedDevices = group.devices.filter(d => d.connected);
    if (connectedDevices.length === 0) {
      Alert.alert('Fejl', 'Ingen enheder er forbundet i gruppen');
      return;
    }
    
    const syncCommand: SyncCommand = {
      id: Date.now().toString(),
      command,
      parameters,
      timestamp: Date.now(),
      targetDevices: connectedDevices.map(d => d.id),
      status: 'pending'
    };
    
    setSyncCommands(prev => [...prev, syncCommand]);
    
    try {
      setSyncStatus('syncing');
      
      if (group.syncMode === 'broadcast') {
        // Send to all devices simultaneously
        const promises = connectedDevices.map(device => 
          sendCommand(command, 'sync', { ...parameters, deviceId: device.id })
        );
        await Promise.all(promises);
        
      } else if (group.syncMode === 'leader-follower') {
        // Send to leader first, then followers
        const leader = connectedDevices.find(d => d.id === group.leader);
        if (leader) {
          await sendCommand(command, 'sync', { ...parameters, deviceId: leader.id, role: 'leader' });
          
          // Send to followers
          const followers = connectedDevices.filter(d => d.id !== group.leader);
          for (const follower of followers) {
            await sendCommand(command, 'sync', { ...parameters, deviceId: follower.id, role: 'follower' });
          }
        }
        
      } else if (group.syncMode === 'mesh') {
        // In mesh mode, devices coordinate themselves
        await sendCommand(command, 'mesh_sync', { ...parameters, groupId: group.id });
      }
      
      // Update command status
      setSyncCommands(prev => prev.map(cmd => 
        cmd.id === syncCommand.id ? { ...cmd, status: 'sent' } : cmd
      ));
      
      setSyncStatus('idle');
      
    } catch (error) {
      console.log('Error sending group command:', error);
      setSyncCommands(prev => prev.map(cmd => 
        cmd.id === syncCommand.id ? { ...cmd, status: 'failed' } : cmd
      ));
      setSyncStatus('error');
    }
  };

  // Test group sync
  const testGroupSync = async (groupId: string) => {
    await sendCommandToGroup(groupId, 'test_sync', {
      type: 'rainbow',
      duration: 3000
    });
  };

  // Save groups when they change
  useEffect(() => {
    saveGroups();
  }, [groups]);

  const selectedGroupObj = groups.find(g => g.id === selectedGroup);

  return (
    <ScrollView style={styles.container}>
      {/* Groups List */}
      <Card style={styles.groupsCard}>
        <View style={styles.groupsHeader}>
          <Text style={styles.sectionTitle}>Enheds Grupper</Text>
          <SecondaryButton
            title="Opret"
            icon="add"
            onPress={createGroup}
          />
        </View>
        
        {groups.map((group) => (
          <TouchableOpacity
            key={group.id}
            style={[
              styles.groupItem,
              selectedGroup === group.id && styles.groupItemActive
            ]}
            onPress={() => setSelectedGroup(group.id)}
            activeOpacity={0.8}
          >
            <View style={styles.groupInfo}>
              <Text style={styles.groupName}>{group.name}</Text>
              <Text style={styles.groupDetails}>
                {group.devices.length} enheder • {group.syncMode}
                {group.leader && ` • Leader: ${group.devices.find(d => d.id === group.leader)?.name}`}
              </Text>
            </View>
            
            <View style={styles.groupControls}>
              <View style={[styles.statusIndicator, group.enabled && styles.statusActive]}>
                <Ionicons 
                  name={group.enabled ? "checkmark" : "close"} 
                  size={12} 
                  color={group.enabled ? palette.bg : palette.text} 
                />
              </View>
              
              <TouchableOpacity
                style={styles.deleteButton}
                onPress={() => deleteGroup(group.id)}
                activeOpacity={0.8}
              >
                <Ionicons name="trash" size={16} color={palette.error} />
              </TouchableOpacity>
            </View>
          </TouchableOpacity>
        ))}
        
        {groups.length === 0 && (
          <View style={styles.emptyState}>
            <Ionicons name="people" size={48} color={palette.muted} />
            <Text style={styles.emptyText}>Ingen grupper endnu</Text>
            <Text style={styles.emptySubtext}>Opret en gruppe for at synkronisere flere enheder</Text>
          </View>
        )}
      </Card>

      {/* Available Devices */}
      <Card style={styles.devicesCard}>
        <View style={styles.devicesHeader}>
          <Text style={styles.sectionTitle}>Tilgængelige Enheder</Text>
          <SecondaryButton
            title={isScanning ? "Scanner..." : "Scan"}
            icon="scan"
            onPress={scanForNearbyDevices}
            disabled={isScanning}
          />
        </View>
        
        {availableDevices.map((device) => (
          <View key={device.id} style={styles.deviceItem}>
            <View style={styles.deviceInfo}>
              <Text style={styles.deviceName}>{device.name}</Text>
              <Text style={styles.deviceDetails}>
                {device.address} • Signal: {device.signalStrength}dBm
              </Text>
            </View>
            
            <View style={styles.deviceControls}>
              <View style={[styles.signalStrength, { opacity: Math.min(1, Math.abs(device.signalStrength) / 100) }]}>
                <Ionicons name="wifi" size={16} color={palette.tint} />
              </View>
              
              {selectedGroup && (
                <TouchableOpacity
                  style={styles.addButton}
                  onPress={() => addDeviceToGroup(selectedGroup, device.id)}
                  activeOpacity={0.8}
                >
                  <Ionicons name="add" size={16} color={palette.tint} />
                </TouchableOpacity>
              )}
            </View>
          </View>
        ))}
        
        {availableDevices.length === 0 && (
          <View style={styles.emptyState}>
            <Ionicons name="scan" size={48} color={palette.muted} />
            <Text style={styles.emptyText}>Ingen enheder fundet</Text>
            <Text style={styles.emptySubtext}>Tryk "Scan" for at søge efter iDot-3 enheder</Text>
          </View>
        )}
      </Card>

      {/* Group Editor */}
      {selectedGroupObj && (
        <Card style={styles.editorCard}>
          <Text style={styles.sectionTitle}>Gruppe Editor</Text>
          
          {/* Group Name */}
          <View style={styles.parameterSection}>
            <Text style={styles.parameterLabel}>Gruppe Navn</Text>
            <InputField
              value={selectedGroupObj.name}
              onChangeText={(text) => updateGroup(selectedGroupObj.id, { name: text })}
              placeholder="Gruppe navn"
            />
          </View>

          {/* Sync Mode */}
          <View style={styles.parameterSection}>
            <Text style={styles.parameterLabel}>Synkroniserings Mode</Text>
            <View style={styles.syncModeButtons}>
              {SYNC_MODES.map((mode) => (
                <TouchableOpacity
                  key={mode.value}
                  style={[
                    styles.syncModeButton,
                    selectedGroupObj.syncMode === mode.value && styles.syncModeButtonActive
                  ]}
                  onPress={() => updateGroup(selectedGroupObj.id, { syncMode: mode.value as any })}
                  activeOpacity={0.8}
                >
                  <Ionicons 
                    name={mode.icon as any} 
                    size={16} 
                    color={selectedGroupObj.syncMode === mode.value ? palette.bg : palette.text} 
                  />
                  <Text style={[
                    styles.syncModeText,
                    selectedGroupObj.syncMode === mode.value && styles.syncModeTextActive
                  ]}>
                    {mode.label}
                  </Text>
                  <Text style={[
                    styles.syncModeDescription,
                    selectedGroupObj.syncMode === mode.value && styles.syncModeDescriptionActive
                  ]}>
                    {mode.description}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>
          </View>

          {/* Group Devices */}
          <View style={styles.parameterSection}>
            <Text style={styles.parameterLabel}>Enheder i Gruppe</Text>
            {selectedGroupObj.devices.map((device) => (
              <View key={device.id} style={styles.groupDeviceItem}>
                <View style={styles.groupDeviceInfo}>
                  <Text style={styles.groupDeviceName}>{device.name}</Text>
                  <Text style={styles.groupDeviceDetails}>
                    {device.role} • {device.connected ? 'Forbundet' : 'Ikke forbundet'}
                  </Text>
                </View>
                
                <View style={styles.groupDeviceControls}>
                  <TouchableOpacity
                    style={[
                      styles.roleButton,
                      device.role === 'leader' && styles.roleButtonActive
                    ]}
                    onPress={() => setDeviceRole(selectedGroupObj.id, device.id, 
                      device.role === 'leader' ? 'follower' : 'leader')}
                    activeOpacity={0.8}
                  >
                    <Ionicons 
                      name={device.role === 'leader' ? "star" : "star-outline"} 
                      size={16} 
                      color={device.role === 'leader' ? palette.bg : palette.text} 
                    />
                  </TouchableOpacity>
                  
                  <TouchableOpacity
                    style={styles.removeButton}
                    onPress={() => removeDeviceFromGroup(selectedGroupObj.id, device.id)}
                    activeOpacity={0.8}
                  >
                    <Ionicons name="remove" size={16} color={palette.error} />
                  </TouchableOpacity>
                </View>
              </View>
            ))}
            
            {selectedGroupObj.devices.length === 0 && (
              <Text style={styles.noDevicesText}>
                Ingen enheder i gruppen. Tilføj enheder fra listen ovenfor.
              </Text>
            )}
          </View>

          {/* Group Controls */}  
          <View style={styles.groupControlsSection}>
            <View style={styles.groupControlsRow}>
              <SecondaryButton
                title="Forbind Alle"
                icon="link"
                onPress={() => connectToGroup(selectedGroupObj.id)}
                disabled={syncStatus === 'syncing'}
              />
              
              <SecondaryButton
                title="Test Sync"
                icon="flash"
                onPress={() => testGroupSync(selectedGroupObj.id)}
                disabled={syncStatus === 'syncing' || selectedGroupObj.devices.length === 0}
              />
            </View>
            
            {/* Enable/Disable Group */}
            <View style={styles.toggleSection}>
              <Ionicons name="power" size={20} color={palette.text} />
              <Text style={styles.toggleLabel}>Aktiver Gruppe</Text>
              <TouchableOpacity
                style={[styles.toggle, selectedGroupObj.enabled && styles.toggleActive]}
                onPress={() => updateGroup(selectedGroupObj.id, { enabled: !selectedGroupObj.enabled })}
                activeOpacity={0.8}
              >
                <View style={[styles.toggleThumb, selectedGroupObj.enabled && styles.toggleThumbActive]} />
              </TouchableOpacity>
            </View>
          </View>
        </Card>
      )}

      {/* Sync Status */}
      <Card style={styles.statusCard}>
        <Text style={styles.sectionTitle}>Synkroniserings Status</Text>
        
        <View style={styles.statusInfo}>
          <View style={styles.statusRow}>
            <Text style={styles.statusLabel}>Status:</Text>
            <Text style={[
              styles.statusValue,
              syncStatus === 'error' && styles.statusError,
              syncStatus === 'syncing' && styles.statusSyncing
            ]}>
              {syncStatus === 'idle' ? 'Klar' : 
               syncStatus === 'syncing' ? 'Synkroniserer...' : 'Fejl'}
            </Text>
          </View>
          
          <View style={styles.statusRow}>
            <Text style={styles.statusLabel}>Aktive Grupper:</Text>
            <Text style={styles.statusValue}>
              {groups.filter(g => g.enabled).length} af {groups.length}
            </Text>
          </View>
          
          <View style={styles.statusRow}>
            <Text style={styles.statusLabel}>Forbundne Enheder:</Text>
            <Text style={styles.statusValue}>
              {groups.reduce((total, group) => 
                total + group.devices.filter(d => d.connected).length, 0
              )}
            </Text>
          </View>
        </View>

        {/* Recent Sync Commands */}
        {syncCommands.length > 0 && (
          <View style={styles.recentCommands}>
            <Text style={styles.recentCommandsTitle}>Seneste Kommandoer</Text>
            {syncCommands.slice(-3).map((cmd) => (
              <View key={cmd.id} style={styles.commandItem}>
                <Text style={styles.commandText}>{cmd.command}</Text>
                <Text style={[
                  styles.commandStatus,
                  cmd.status === 'failed' && styles.commandStatusError,
                  cmd.status === 'sent' && styles.commandStatusSuccess
                ]}>
                  {cmd.status}
                </Text>
              </View>
            ))}
          </View>
        )}
      </Card>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: spacing.md,
  },
  groupsCard: {
    padding: spacing.md,
    marginBottom: spacing.md,
  },
  groupsHeader: {
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
  groupItem: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: spacing.sm,
    marginBottom: spacing.sm,
    borderRadius: radius.sm,
    backgroundColor: 'rgba(122,140,160,0.1)',
  },
  groupItemActive: {
    backgroundColor: 'rgba(0,212,255,0.2)',
    borderWidth: 1,
    borderColor: palette.tint,
  },
  groupInfo: {
    flex: 1,
  },
  groupName: {
    color: palette.text,
    fontSize: 14,
    fontWeight: '600',
  },
  groupDetails: {
    color: palette.muted,
    fontSize: 12,
    marginTop: 2,
  },
  groupControls: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm,
  },
  statusIndicator: {
    width: 20,
    height: 20,
    borderRadius: 10,
    backgroundColor: palette.muted,
    alignItems: 'center',
    justifyContent: 'center',
  },
  statusActive: {
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
  devicesCard: {
    padding: spacing.md,
    marginBottom: spacing.md,
  },
  devicesHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: spacing.md,
  },
  deviceItem: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: spacing.sm,
    marginBottom: spacing.sm,
    borderRadius: radius.sm,
    backgroundColor: 'rgba(122,140,160,0.1)',
  },
  deviceInfo: {
    flex: 1,
  },
  deviceName: {
    color: palette.text,
    fontSize: 14,
    fontWeight: '600',
  },
  deviceDetails: {
    color: palette.muted,
    fontSize: 12,
    marginTop: 2,
  },
  deviceControls: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm,
  },
  signalStrength: {
    width: 24,
    height: 24,
    alignItems: 'center',
    justifyContent: 'center',
  },
  addButton: {
    width: 24,
    height: 24,
    borderRadius: 12,
    backgroundColor: 'rgba(0,212,255,0.2)',
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
  parameterLabel: {
    color: palette.text,
    fontSize: 14,
    marginBottom: spacing.sm,
  },
  syncModeButtons: {
    gap: spacing.sm,
  },
  syncModeButton: {
    padding: spacing.md,
    borderRadius: radius.sm,
    backgroundColor: 'rgba(122,140,160,0.1)',
  },
  syncModeButtonActive: {
    backgroundColor: palette.tint,
  },
  syncModeText: {
    color: palette.text,
    fontSize: 14,
    fontWeight: '600',
    marginTop: spacing.xs,
  },
  syncModeTextActive: {
    color: palette.bg,
  },
  syncModeDescription: {
    color: palette.muted,
    fontSize: 12,
    marginTop: 2,
  },
  syncModeDescriptionActive: {
    color: 'rgba(0,26,46,0.7)',
  },
  groupDeviceItem: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: spacing.sm,
    marginBottom: spacing.sm,
    borderRadius: radius.sm,
    backgroundColor: 'rgba(122,140,160,0.1)',
  },
  groupDeviceInfo: {
    flex: 1,
  },
  groupDeviceName: {
    color: palette.text,
    fontSize: 14,
    fontWeight: '600',
  },
  groupDeviceDetails: {
    color: palette.muted,
    fontSize: 12,
    marginTop: 2,
  },
  groupDeviceControls: {
    flexDirection: 'row',
    gap: spacing.sm,
  },
  roleButton: {
    width: 24,
    height: 24,
    borderRadius: 12,
    backgroundColor: 'rgba(122,140,160,0.1)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  roleButtonActive: {
    backgroundColor: palette.tint,
  },
  removeButton: {
    width: 24,
    height: 24,
    borderRadius: 12,
    backgroundColor: 'rgba(255,59,48,0.2)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  noDevicesText: {
    color: palette.muted,
    fontSize: 12,
    fontStyle: 'italic',
    textAlign: 'center',
    paddingVertical: spacing.md,
  },
  groupControlsSection: {
    marginTop: spacing.md,
  },
  groupControlsRow: {
    flexDirection: 'row',
    gap: spacing.sm,
    marginBottom: spacing.md,
  },
  toggleSection: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  toggleLabel: {
    color: palette.text,
    fontSize: 14,
    flex: 1,
    marginLeft: spacing.sm,
  },
  toggle: {
    width: 50,
    height: 30,
    borderRadius: 15,
    backgroundColor: palette.muted,
    padding: 2,
  },
  toggleActive: {
    backgroundColor: palette.tint,
  },
  toggleThumb: {
    width: 26,
    height: 26,
    borderRadius: 13,
    backgroundColor: palette.text,
  },
  toggleThumbActive: {
    backgroundColor: palette.bg,
    transform: [{ translateX: 20 }],
  },
  statusCard: {
    padding: spacing.md,
    marginBottom: spacing.xl,
  },
  statusInfo: {
    marginBottom: spacing.md,
  },
  statusRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: spacing.sm,
  },
  statusLabel: {
    color: palette.text,
    fontSize: 14,
  },
  statusValue: {
    color: palette.tint,
    fontSize: 14,
    fontWeight: '600',
  },
  statusError: {
    color: palette.error,
  },
  statusSyncing: {
    color: '#FF9500',
  },
  recentCommands: {
    marginTop: spacing.md,
  },
  recentCommandsTitle: {
    color: palette.text,
    fontSize: 14,
    fontWeight: '600',
    marginBottom: spacing.sm,
  },
  commandItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: spacing.xs,
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(122,140,160,0.1)',
  },
  commandText: {
    color: palette.text,
    fontSize: 12,
  },
  commandStatus: {
    color: palette.muted,
    fontSize: 12,
    fontWeight: '600',
  },
  commandStatusError: {
    color: palette.error,
  },
  commandStatusSuccess: {
    color: palette.tint,
  },
});