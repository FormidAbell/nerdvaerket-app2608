import React, { useMemo } from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useBleStore } from '../store/bleStore';
import { palette, spacing } from './theme';

export const StatusHeader: React.FC = () => {
  const { 
    scanning, 
    connectedDevice, 
    lastNotify, 
    matchesAck, 
    notifyCounter,
    deviceInfo,
    detectedScreenSize,
    isDetectingDevice 
  } = useBleStore();

  const connectionStatus = useMemo(() => {
    if (connectedDevice) {
      return { icon: 'bluetooth' as const, label: 'Forbundet', color: '#18d56b' };
    }
    return { icon: 'bluetooth-outline' as const, label: 'Ikke forbundet', color: '#7f93b1' };
  }, [connectedDevice]);

  const scanningStatus = useMemo(() => {
    if (scanning) {
      return { icon: 'search' as const, label: 'Scanner', color: '#3aa0ff' };
    }
    return null;
  }, [scanning]);

  const ackStatus = useMemo(() => {
    if (!lastNotify) return null;
    const isGoodAck = matchesAck(lastNotify);
    return {
      icon: 'checkmark-circle' as const,
      label: `ACK ${isGoodAck ? 'OK' : 'Fejl'}`,
      color: isGoodAck ? '#18d56b' : '#e3b341'
    };
  }, [lastNotify, matchesAck, notifyCounter]);

  // NEW: Device size status
  const deviceStatus = useMemo(() => {
    if (isDetectingDevice) {
      return { icon: 'search' as const, label: 'Detector...', color: '#ffa726' };
    }
    if (detectedScreenSize) {
      const model = deviceInfo?.model?.includes('Mini') ? 'Mini' :
                   deviceInfo?.model?.includes('Standard') ? 'Std' :
                   deviceInfo?.model?.includes('Pro') ? 'Pro' : '';
      return { 
        icon: 'tv' as const, 
        label: `${detectedScreenSize}${model ? ' ' + model : ''}`, 
        color: '#00d4ff' 
      };
    }
    return null;
  }, [detectedScreenSize, deviceInfo, isDetectingDevice]);

  return (
    <View style={styles.container}>
      {/* Connection Status */}
      <View style={[styles.badge, { backgroundColor: connectionStatus.color }]}>
        <Ionicons name={connectionStatus.icon} size={12} color="#001123" />
        <Text style={styles.badgeText}>{connectionStatus.label}</Text>
      </View>

      {/* Device Size Status */}
      {deviceStatus && (
        <View style={[styles.badge, { backgroundColor: deviceStatus.color }]}>
          <Ionicons name={deviceStatus.icon} size={12} color="#001123" />
          <Text style={styles.badgeText}>{deviceStatus.label}</Text>
        </View>
      )}

      {/* Scanning Status */}
      {scanningStatus && (
        <View style={[styles.badge, { backgroundColor: scanningStatus.color }]}>
          <Ionicons name={scanningStatus.icon} size={12} color="#001123" />
          <Text style={styles.badgeText}>{scanningStatus.label}</Text>
        </View>
      )}

      {/* ACK Status */}
      {ackStatus && (
        <View style={[styles.badge, { backgroundColor: ackStatus.color }]}>
          <Ionicons name={ackStatus.icon} size={12} color="#001123" />
          <Text style={styles.badgeText}>{ackStatus.label}</Text>
        </View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.xs,
    marginRight: spacing.sm,
  },
  badge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
  },
  badgeText: {
    color: '#001123',
    fontSize: 10,
    fontWeight: '700',
  },
});