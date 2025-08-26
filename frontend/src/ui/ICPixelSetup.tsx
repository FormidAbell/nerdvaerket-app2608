/**
 * IC/Pixel Setup til LOY PLAY-paritet
 * LED type, pixel count, segments, power limits, hardware kalibrering
 */

import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Alert } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import Slider from '@react-native-community/slider';
import { Card, PrimaryButton, SecondaryButton, InputField } from './components';
import { palette, spacing, radius } from './theme';
import { useBleStore } from '../store/bleStore';

interface ICConfig {
  ledType: 'WS2812B' | 'WS2811' | 'APA102' | 'SK6812' | 'WS2815';
  pixelCount: number;
  segments: SegmentConfig[];
  powerLimit: number; // Watts
  voltage: 5 | 12 | 24;
  brightness: number; // Global max brightness %
  colorOrder: 'RGB' | 'GRB' | 'BRG' | 'RBG' | 'GBR' | 'BGR';
  frequency: number; // kHz for PWM
}

interface SegmentConfig {
  id: string;
  name: string;
  startPixel: number;
  endPixel: number;
  reversed: boolean;
  enabled: boolean;
}

const LED_TYPES = [
  { value: 'WS2812B', label: 'WS2812B', specs: '5V, 60mA, 800kHz' },
  { value: 'WS2811', label: 'WS2811', specs: '12V, 60mA, 400kHz' },
  { value: 'APA102', label: 'APA102', specs: '5V, 60mA, SPI' },
  { value: 'SK6812', label: 'SK6812', specs: '5V, 60mA, RGBW' },
  { value: 'WS2815', label: 'WS2815', specs: '12V, 15mA, 800kHz' },
];

const COLOR_ORDERS = ['RGB', 'GRB', 'BRG', 'RBG', 'GBR', 'BGR'];

export const ICPixelSetup: React.FC = () => {
  const { sendCommand, connectedDevice } = useBleStore();
  
  const [config, setConfig] = useState<ICConfig>({
    ledType: 'WS2812B',
    pixelCount: 144,
    segments: [
      {
        id: '1',
        name: 'Segment 1',
        startPixel: 0,
        endPixel: 143,
        reversed: false,
        enabled: true
      }
    ],
    powerLimit: 50,
    voltage: 5,
    brightness: 100,
    colorOrder: 'GRB',
    frequency: 800
  });
  
  const [testMode, setTestMode] = useState<'off' | 'rainbow' | 'single' | 'segment'>('off');
  const [selectedSegment, setSelectedSegment] = useState<string | null>(null);
  
  // Calculate power consumption
  const calculatePower = () => {
    const pixelPower = config.pixelCount * 0.06 * (config.brightness / 100); // 60mA per pixel max
    const voltage = config.voltage;
    return Math.round(pixelPower * voltage * 10) / 10;
  };

  // Update configuration
  const updateConfig = (updates: Partial<ICConfig>) => {
    setConfig(prev => ({ ...prev, ...updates }));
  };

  // Add new segment
  const addSegment = () => {
    const lastSegment = config.segments[config.segments.length - 1];
    const startPixel = lastSegment ? lastSegment.endPixel + 1 : 0;
    const endPixel = Math.min(startPixel + 47, config.pixelCount - 1);
    
    if (startPixel >= config.pixelCount) {
      Alert.alert('Fejl', 'Ikke nok pixels tilbage til nyt segment');
      return;
    }
    
    const newSegment: SegmentConfig = {
      id: Date.now().toString(),
      name: `Segment ${config.segments.length + 1}`,
      startPixel,
      endPixel,
      reversed: false,
      enabled: true
    };
    
    updateConfig({
      segments: [...config.segments, newSegment]
    });
    setSelectedSegment(newSegment.id);
  };

  // Delete segment
  const deleteSegment = (id: string) => {
    if (config.segments.length <= 1) {
      Alert.alert('Fejl', 'Mindst ét segment skal bevares');
      return;
    }
    
    updateConfig({
      segments: config.segments.filter(s => s.id !== id)
    });
    
    if (selectedSegment === id) {
      setSelectedSegment(null);
    }
  };

  // Update segment
  const updateSegment = (id: string, updates: Partial<SegmentConfig>) => {
    updateConfig({
      segments: config.segments.map(s => s.id === id ? { ...s, ...updates } : s)
    });
  };

  // Send configuration to device
  const applyConfiguration = async () => {
    if (!connectedDevice) {
      Alert.alert('Fejl', 'Ingen enhed tilsluttet');
      return;
    }
    
    try {
      // Send basic configuration
      await sendCommand('ic_setup', 'config', {
        ledType: config.ledType,
        pixelCount: config.pixelCount,
        voltage: config.voltage,
        colorOrder: config.colorOrder,
        frequency: config.frequency
      });
      
      // Send power limits
      await sendCommand('power_setup', 'limits', {
        maxWatts: config.powerLimit,
        maxBrightness: config.brightness
      });
      
      // Send segment configuration
      for (const segment of config.segments) {
        if (segment.enabled) {
          await sendCommand('segment_setup', 'add', {
            id: segment.id,
            name: segment.name,
            start: segment.startPixel,
            end: segment.endPixel,
            reversed: segment.reversed
          });
        }
      }
      
      Alert.alert('Succes', 'Konfiguration sendt til enhed');
      
    } catch (error) {
      console.log('Error applying configuration:', error);
      Alert.alert('Fejl', 'Kunne ikke sende konfiguration');
    }
  };

  // Test configuration
  const runTest = async (mode: typeof testMode) => {
    if (!connectedDevice) return;
    
    setTestMode(mode);
    
    try {
      switch (mode) {
        case 'rainbow':
          await sendCommand('test_mode', 'rainbow', { duration: 5000 });
          break;
        case 'single':
          await sendCommand('test_mode', 'single', { color: { r: 255, g: 255, b: 255 } });
          break;
        case 'segment':
          if (selectedSegment) {
            const segment = config.segments.find(s => s.id === selectedSegment);
            if (segment) {
              await sendCommand('test_mode', 'segment', {
                start: segment.startPixel,
                end: segment.endPixel,
                color: { r: 255, g: 0, b: 0 }
              });
            }
          }
          break;
        case 'off':
          await sendCommand('power', 'off', {});
          break;
      }
    } catch (error) {
      console.log('Error running test:', error);
    }
  };

  const estimatedPower = calculatePower();
  const powerWarning = estimatedPower > config.powerLimit;
  const selectedSeg = config.segments.find(s => s.id === selectedSegment);

  return (
    <ScrollView style={styles.container}>
      {/* Hardware Configuration */}
      <Card style={styles.configCard}>
        <Text style={styles.sectionTitle}>Hardware Konfiguration</Text>
        
        {/* LED Type Selection */}
        <View style={styles.parameterSection}>
          <Text style={styles.parameterLabel}>LED Type</Text>
          <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.ledTypeScroll}>
            {LED_TYPES.map((type) => (
              <TouchableOpacity
                key={type.value}
                style={[
                  styles.ledTypeButton,
                  config.ledType === type.value && styles.ledTypeButtonActive
                ]}
                onPress={() => updateConfig({ ledType: type.value as any })}
                activeOpacity={0.8}
              >
                <Text style={[
                  styles.ledTypeLabel,
                  config.ledType === type.value && styles.ledTypeLabelActive
                ]}>
                  {type.label}
                </Text>
                <Text style={[
                  styles.ledTypeSpecs,
                  config.ledType === type.value && styles.ledTypeSpecsActive
                ]}>
                  {type.specs}
                </Text>
              </TouchableOpacity>
            ))}
          </ScrollView>
        </View>

        {/* Pixel Count */}
        <View style={styles.parameterSection}>
          <View style={styles.parameterHeader}>
            <Ionicons name="apps" size={20} color={palette.text} />
            <Text style={styles.parameterLabel}>Pixel Antal</Text>
            <Text style={styles.parameterValue}>{config.pixelCount}</Text>
          </View>
          <Slider
            style={styles.slider}
            minimumValue={1}
            maximumValue={1000}
            value={config.pixelCount}
            step={1}
            onValueChange={(value) => updateConfig({ pixelCount: Math.round(value) })}
            minimumTrackTintColor={palette.tint}
            maximumTrackTintColor={palette.muted}
          />
        </View>

        {/* Voltage Selection */}
        <View style={styles.parameterSection}>
          <Text style={styles.parameterLabel}>Forsyningsspænding</Text>
          <View style={styles.voltageButtons}>
            {[5, 12, 24].map(voltage => (
              <TouchableOpacity
                key={voltage}
                style={[
                  styles.voltageButton,
                  config.voltage === voltage && styles.voltageButtonActive
                ]}
                onPress={() => updateConfig({ voltage: voltage as any })}
                activeOpacity={0.8}
              >
                <Text style={[
                  styles.voltageText,
                  config.voltage === voltage && styles.voltageTextActive
                ]}>
                  {voltage}V
                </Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>

        {/* Color Order */}
        <View style={styles.parameterSection}>
          <Text style={styles.parameterLabel}>Farve Rækkefølge</Text>
          <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.colorOrderScroll}>
            {COLOR_ORDERS.map((order) => (
              <TouchableOpacity
                key={order}
                style={[
                  styles.colorOrderButton,
                  config.colorOrder === order && styles.colorOrderButtonActive
                ]}
                onPress={() => updateConfig({ colorOrder: order as any })}
                activeOpacity={0.8}
              >
                <Text style={[
                  styles.colorOrderText,
                  config.colorOrder === order && styles.colorOrderTextActive
                ]}>
                  {order}
                </Text>
              </TouchableOpacity>
            ))}
          </ScrollView>
        </View>
      </Card>

      {/* Power Management */}
      <Card style={styles.powerCard}>
        <Text style={styles.sectionTitle}>Strøm Management</Text>
        
        {/* Power Limit */}
        <View style={styles.parameterSection}>
          <View style={styles.parameterHeader}>
            <Ionicons name="flash" size={20} color={palette.text} />
            <Text style={styles.parameterLabel}>Strøm Grænse</Text>
            <Text style={styles.parameterValue}>{config.powerLimit}W</Text>
          </View>
          <Slider
            style={styles.slider}
            minimumValue={5}
            maximumValue={500}
            value={config.powerLimit}
            step={5}
            onValueChange={(value) => updateConfig({ powerLimit: Math.round(value) })}
            minimumTrackTintColor={palette.tint}
            maximumTrackTintColor={palette.muted}
          />
        </View>

        {/* Global Brightness Limit */}
        <View style={styles.parameterSection}>
          <View style={styles.parameterHeader}>
            <Ionicons name="sunny" size={20} color={palette.text} />
            <Text style={styles.parameterLabel}>Max Lysstyrke</Text>
            <Text style={styles.parameterValue}>{config.brightness}%</Text>
          </View>
          <Slider
            style={styles.slider}
            minimumValue={1}
            maximumValue={100}
            value={config.brightness}
            step={1}
            onValueChange={(value) => updateConfig({ brightness: Math.round(value) })}
            minimumTrackTintColor={palette.tint}
            maximumTrackTintColor={palette.muted}
          />
        </View>

        {/* Power Estimation */}
        <View style={styles.powerEstimation}>
          <View style={styles.powerEstimationRow}>
            <Text style={styles.powerEstimationLabel}>Estimeret Forbrug:</Text>
            <Text style={[
              styles.powerEstimationValue,
              powerWarning && styles.powerWarning
            ]}>
              {estimatedPower}W
            </Text>
          </View>
          {powerWarning && (
            <Text style={styles.warningText}>
              ⚠️ Forbrug overstiger grænse på {config.powerLimit}W
            </Text>
          )}
        </View>
      </Card>

      {/* Segment Configuration */}
      <Card style={styles.segmentCard}>
        <View style={styles.segmentHeader}>
          <Text style={styles.sectionTitle}>Segmenter</Text>
          <SecondaryButton
            title="Tilføj"
            icon="add"
            onPress={addSegment}
          />
        </View>
        
        {config.segments.map((segment, index) => (
          <View key={segment.id} style={styles.segmentItem}>
            <TouchableOpacity
              style={[
                styles.segmentInfo,
                selectedSegment === segment.id && styles.segmentInfoActive
              ]}
              onPress={() => setSelectedSegment(segment.id)}
              activeOpacity={0.8}
            >
              <View style={styles.segmentDetails}>
                <Text style={styles.segmentName}>{segment.name}</Text>
                <Text style={styles.segmentRange}>
                  Pixel {segment.startPixel}-{segment.endPixel} ({segment.endPixel - segment.startPixel + 1})
                </Text>
              </View>
              
              <View style={styles.segmentControls}>
                <TouchableOpacity
                  style={[styles.segmentToggle, segment.enabled && styles.segmentToggleActive]}
                  onPress={() => updateSegment(segment.id, { enabled: !segment.enabled })}
                  activeOpacity={0.8}
                >
                  <Ionicons 
                    name={segment.enabled ? "checkmark" : "close"} 
                    size={16} 
                    color={segment.enabled ? palette.bg : palette.text} 
                  />
                </TouchableOpacity>
                
                {config.segments.length > 1 && (
                  <TouchableOpacity
                    style={styles.deleteButton}
                    onPress={() => deleteSegment(segment.id)}
                    activeOpacity={0.8}
                  >
                    <Ionicons name="trash" size={16} color={palette.error} />
                  </TouchableOpacity>
                )}
              </View>
            </TouchableOpacity>
          </View>
        ))}
      </Card>

      {/* Segment Editor */}
      {selectedSeg && (
        <Card style={styles.editorCard}>
          <Text style={styles.sectionTitle}>Segment Editor</Text>
          
          {/* Segment Name */}
          <View style={styles.parameterSection}>
            <Text style={styles.parameterLabel}>Navn</Text>
            <InputField
              value={selectedSeg.name}
              onChangeText={(text) => updateSegment(selectedSeg.id, { name: text })}
              placeholder="Segment navn"
            />
          </View>

          {/* Start Pixel */}
          <View style={styles.parameterSection}>
            <View style={styles.parameterHeader}>
              <Ionicons name="play" size={20} color={palette.text} />
              <Text style={styles.parameterLabel}>Start Pixel</Text>
              <Text style={styles.parameterValue}>{selectedSeg.startPixel}</Text>
            </View>
            <Slider
              style={styles.slider}
              minimumValue={0}
              maximumValue={config.pixelCount - 1}
              value={selectedSeg.startPixel}
              step={1}
              onValueChange={(value) => {
                const start = Math.round(value);
                const end = Math.max(start, selectedSeg.endPixel);
                updateSegment(selectedSeg.id, { startPixel: start, endPixel: end });
              }}
              minimumTrackTintColor={palette.tint}
              maximumTrackTintColor={palette.muted}
            />
          </View>

          {/* End Pixel */}
          <View style={styles.parameterSection}>
            <View style={styles.parameterHeader}>
              <Ionicons name="stop" size={20} color={palette.text} />
              <Text style={styles.parameterLabel}>Slut Pixel</Text>
              <Text style={styles.parameterValue}>{selectedSeg.endPixel}</Text>
            </View>
            <Slider
              style={styles.slider}
              minimumValue={selectedSeg.startPixel}
              maximumValue={config.pixelCount - 1}
              value={selectedSeg.endPixel}
              step={1}
              onValueChange={(value) => updateSegment(selectedSeg.id, { endPixel: Math.round(value) })}
              minimumTrackTintColor={palette.tint}
              maximumTrackTintColor={palette.muted}
            />
          </View>

          {/* Reversed Toggle */}
          <View style={styles.toggleSection}>
            <Ionicons name="swap-horizontal" size={20} color={palette.text} />
            <Text style={styles.toggleLabel}>Omvendt Retning</Text>
            <TouchableOpacity
              style={[styles.toggle, selectedSeg.reversed && styles.toggleActive]}
              onPress={() => updateSegment(selectedSeg.id, { reversed: !selectedSeg.reversed })}
              activeOpacity={0.8}
            >
              <View style={[styles.toggleThumb, selectedSeg.reversed && styles.toggleThumbActive]} />
            </TouchableOpacity>
          </View>
        </Card>
      )}

      {/* Test Controls */}
      <Card style={styles.testCard}>
        <Text style={styles.sectionTitle}>Test Konfiguration</Text>
        
        <View style={styles.testButtons}>
          <SecondaryButton
            title="Rainbow"
            icon="rainbow"
            onPress={() => runTest('rainbow')}
          />
          <SecondaryButton
            title="Hvid"
            icon="sunny"
            onPress={() => runTest('single')}
          />
          {selectedSeg && (
            <SecondaryButton
              title="Segment"
              icon="apps"
              onPress={() => runTest('segment')}
            />
          )}
          <SecondaryButton
            title="Stop"
            icon="stop"
            onPress={() => runTest('off')}
          />
        </View>
        
        {testMode !== 'off' && (
          <Text style={styles.testStatus}>
            Test aktiv: {testMode === 'rainbow' ? 'Rainbow' : testMode === 'single' ? 'Hvid' : 'Segment'}
          </Text>
        )}
      </Card>

      {/* Apply Configuration */}
      <Card style={styles.applyCard}>
        <PrimaryButton
          title="Anvend Konfiguration"
          icon="checkmark"
          onPress={applyConfiguration}
        />
        <Text style={styles.applyNote}>
          Sender alle indstillinger til din iDot-3 enhed
        </Text>
      </Card>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: spacing.md,
  },
  configCard: {
    padding: spacing.md,
    marginBottom: spacing.md,
  },
  sectionTitle: {
    color: palette.text,
    fontSize: 16,
    fontWeight: '600',
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
    flex: 1,
    marginLeft: spacing.sm,
  },
  parameterValue: {
    color: palette.tint,
    fontSize: 14,
    fontWeight: '600',
  },
  slider: {
    height: 40,
  },
  ledTypeScroll: {
    marginTop: spacing.sm,
  },
  ledTypeButton: {
    padding: spacing.sm,
    marginRight: spacing.sm,
    borderRadius: radius.sm,
    backgroundColor: 'rgba(122,140,160,0.1)',
    minWidth: 100,
  },
  ledTypeButtonActive: {
    backgroundColor: palette.tint,
  },
  ledTypeLabel: {
    color: palette.text,
    fontSize: 12,
    fontWeight: '600',
    textAlign: 'center',
  },
  ledTypeLabelActive: {
    color: palette.bg,
  },
  ledTypeSpecs: {
    color: palette.muted,
    fontSize: 10,
    textAlign: 'center',
    marginTop: 2,
  },
  ledTypeSpecsActive: {
    color: 'rgba(0,26,46,0.7)',
  },
  voltageButtons: {
    flexDirection: 'row',
    gap: spacing.sm,
    marginTop: spacing.sm,
  },
  voltageButton: {
    flex: 1,
    paddingVertical: spacing.sm,
    paddingHorizontal: spacing.md,
    borderRadius: radius.sm,
    backgroundColor: 'rgba(122,140,160,0.1)',
    alignItems: 'center',
  },
  voltageButtonActive: {
    backgroundColor: palette.tint,
  },
  voltageText: {
    color: palette.text,
    fontSize: 14,
    fontWeight: '600',
  },
  voltageTextActive: {
    color: palette.bg,
  },
  colorOrderScroll: {
    marginTop: spacing.sm,
  },
  colorOrderButton: {
    paddingVertical: spacing.sm,
    paddingHorizontal: spacing.md,
    marginRight: spacing.sm,
    borderRadius: radius.sm,
    backgroundColor: 'rgba(122,140,160,0.1)',
    alignItems: 'center',
  },
  colorOrderButtonActive: {
    backgroundColor: palette.tint,
  },
  colorOrderText: {
    color: palette.text,
    fontSize: 12,
    fontWeight: '600',
  },
  colorOrderTextActive: {
    color: palette.bg,
  },
  powerCard: {
    padding: spacing.md,
    marginBottom: spacing.md,
  },
  powerEstimation: {
    marginTop: spacing.sm,
  },
  powerEstimationRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  powerEstimationLabel: {
    color: palette.text,
    fontSize: 14,
  },
  powerEstimationValue: {
    color: palette.tint,
    fontSize: 16,
    fontWeight: '600',
  },
  powerWarning: {
    color: palette.error,
  },
  warningText: {
    color: palette.error,
    fontSize: 12,
    marginTop: spacing.xs,
  },
  segmentCard: {
    padding: spacing.md,
    marginBottom: spacing.md,
  },
  segmentHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: spacing.md,
  },
  segmentItem: {
    marginBottom: spacing.sm,
  },
  segmentInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: spacing.sm,
    borderRadius: radius.sm,
    backgroundColor: 'rgba(122,140,160,0.1)',
  },
  segmentInfoActive: {
    backgroundColor: 'rgba(0,212,255,0.2)',
    borderWidth: 1,
    borderColor: palette.tint,
  },
  segmentDetails: {
    flex: 1,
  },
  segmentName: {
    color: palette.text,
    fontSize: 14,
    fontWeight: '600',
  },
  segmentRange: {
    color: palette.muted,
    fontSize: 12,
  },
  segmentControls: {
    flexDirection: 'row',
    gap: spacing.sm,
  },
  segmentToggle: {
    width: 24,
    height: 24,
    borderRadius: 12,
    backgroundColor: palette.muted,
    alignItems: 'center',
    justifyContent: 'center',
  },
  segmentToggleActive: {
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
  editorCard: {
    padding: spacing.md,
    marginBottom: spacing.md,
  },
  toggleSection: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: spacing.sm,
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
  testCard: {
    padding: spacing.md,
    marginBottom: spacing.md,
  },
  testButtons: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: spacing.sm,
  },
  testStatus: {
    color: palette.tint,
    fontSize: 12,
    marginTop: spacing.sm,
    textAlign: 'center',
  },
  applyCard: {
    padding: spacing.md,
    marginBottom: spacing.xl,
    alignItems: 'center',
  },
  applyNote: {
    color: palette.muted,
    fontSize: 12,
    marginTop: spacing.sm,
    textAlign: 'center',
  },
});