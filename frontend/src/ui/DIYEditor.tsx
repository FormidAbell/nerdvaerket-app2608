/**
 * DIY Editor til LOY PLAY-paritet
 * Træk-og-slip keyframes med farver, varigheder, easing, segmentmål
 */

import React, { useState, useRef } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import Slider from '@react-native-community/slider';
import { Card, PrimaryButton, SecondaryButton, InputField } from './components';
import { palette, spacing, radius } from './theme';
import { useBleStore } from '../store/bleStore';

interface Keyframe {
  id: string;
  time: number; // 0-100% af total duration
  color: { r: number; g: number; b: number };
  brightness: number; // 0-100%
  easing: 'linear' | 'ease-in' | 'ease-out' | 'ease-in-out';
}

interface DIYSequence {
  id: string;
  name: string;
  duration: number; // seconds
  loop: boolean;
  keyframes: Keyframe[];
  segments: { start: number; end: number }[];
}

const EASING_OPTIONS = [
  { value: 'linear', label: 'Linear', icon: 'remove' },
  { value: 'ease-in', label: 'Ease In', icon: 'play' },
  { value: 'ease-out', label: 'Ease Out', icon: 'stop' },
  { value: 'ease-in-out', label: 'Ease Both', icon: 'swap-horizontal' },
];

const COLOR_PRESETS = [
  { r: 255, g: 0, b: 0 },     // Red
  { r: 255, g: 165, b: 0 },   // Orange  
  { r: 255, g: 255, b: 0 },   // Yellow
  { r: 0, g: 255, b: 0 },     // Green
  { r: 0, g: 255, b: 255 },   // Cyan
  { r: 0, g: 0, b: 255 },     // Blue
  { r: 128, g: 0, b: 128 },   // Purple
  { r: 255, g: 255, b: 255 }, // White
];

export const DIYEditor: React.FC = () => {
  const { sendCommand, connectedDevice } = useBleStore();
  
  const [sequence, setSequence] = useState<DIYSequence>({
    id: '1',
    name: 'Min DIY Sekvens',
    duration: 10,
    loop: true,
    keyframes: [
      {
        id: '1',
        time: 0,
        color: { r: 255, g: 0, b: 0 },
        brightness: 100,
        easing: 'linear'
      },
      {
        id: '2', 
        time: 50,
        color: { r: 0, g: 255, b: 0 },
        brightness: 80,
        easing: 'ease-in-out'
      },
      {
        id: '3',
        time: 100,
        color: { r: 0, g: 0, b: 255 },
        brightness: 60,
        easing: 'linear'
      }
    ],
    segments: [{ start: 0, end: 15 }]
  });
  
  const [selectedKeyframe, setSelectedKeyframe] = useState<string | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);

  // Add ny keyframe
  const addKeyframe = () => {
    const newKeyframe: Keyframe = {
      id: Date.now().toString(),
      time: 50, // Start i midten
      color: { r: 255, g: 255, b: 255 },
      brightness: 100,
      easing: 'linear'
    };
    
    setSequence(prev => ({
      ...prev,
      keyframes: [...prev.keyframes, newKeyframe].sort((a, b) => a.time - b.time)
    }));
    setSelectedKeyframe(newKeyframe.id);
  };

  // Delete keyframe
  const deleteKeyframe = (id: string) => {
    if (sequence.keyframes.length <= 2) return; // Keep minimum 2 keyframes
    
    setSequence(prev => ({
      ...prev,
      keyframes: prev.keyframes.filter(kf => kf.id !== id)
    }));
    
    if (selectedKeyframe === id) {
      setSelectedKeyframe(null);
    }
  };

  // Update keyframe
  const updateKeyframe = (id: string, updates: Partial<Keyframe>) => {
    setSequence(prev => ({
      ...prev,
      keyframes: prev.keyframes.map(kf => 
        kf.id === id ? { ...kf, ...updates } : kf
      ).sort((a, b) => a.time - b.time)
    }));
  };

  // Play sequence
  const playSequence = async () => {
    if (!connectedDevice) return;
    
    setIsPlaying(true);
    
    try {
      // Send keyframes til device
      for (const keyframe of sequence.keyframes) {
        await sendCommand('color', 'rgb', {
          r: keyframe.color.r,
          g: keyframe.color.g,
          b: keyframe.color.b
        });
        
        await sendCommand('brightness', 'set', {
          value: keyframe.brightness
        });
        
        // Simulate timing (i rigtig implementation ville dette være device-side)
        await new Promise(resolve => setTimeout(resolve, (sequence.duration * 1000) * (keyframe.time / 100)));
      }
      
      if (sequence.loop) {
        // Loop tilbage til start
        const firstKeyframe = sequence.keyframes[0];
        await sendCommand('color', 'rgb', {
          r: firstKeyframe.color.r,
          g: firstKeyframe.color.g,
          b: firstKeyframe.color.b
        });
      }
      
    } catch (error) {
      console.log('Error playing DIY sequence:', error);
    } finally {
      setIsPlaying(false);
    }
  };

  // Stop playback
  const stopSequence = async () => {
    setIsPlaying(false);
    setCurrentTime(0);
    
    if (connectedDevice) {
      try {
        await sendCommand('power', 'off', {});
      } catch (error) {
        console.log('Error stopping sequence:', error);
      }
    }
  };

  // Export sequence som JSON
  const exportSequence = () => {
    const jsonString = JSON.stringify(sequence, null, 2);
    console.log('DIY Sequence Export:', jsonString);
    // I rigtig app ville dette gemme til fil eller clipboard
  };

  const selectedKf = sequence.keyframes.find(kf => kf.id === selectedKeyframe);

  return (
    <ScrollView style={styles.container}>
      {/* Header Controls */}
      <Card style={styles.headerCard}>
        <View style={styles.headerRow}>
          <View style={styles.sequenceInfo}>
            <Text style={styles.sequenceName}>{sequence.name}</Text>
            <Text style={styles.sequenceMeta}>
              {sequence.keyframes.length} keyframes • {sequence.duration}s
              {sequence.loop && ' • Loop'}
            </Text>
          </View>
          
          <View style={styles.playbackControls}>
            {!isPlaying ? (
              <PrimaryButton
                title="Afspil"
                icon="play"
                onPress={playSequence}
              />
            ) : (
              <SecondaryButton
                title="Stop"
                icon="stop"
                onPress={stopSequence}
              />
            )}
          </View>
        </View>
        
        {isPlaying && (
          <View style={styles.progressBar}>
            <View style={[styles.progressFill, { width: `${currentTime}%` }]} />
          </View>
        )}
      </Card>

      {/* Timeline */}
      <Card style={styles.timelineCard}>
        <Text style={styles.sectionTitle}>Timeline Editor</Text>
        
        <View style={styles.timeline}>
          <View style={styles.timelineTrack}>
            {/* Time markers */}
            {[0, 25, 50, 75, 100].map(time => (
              <View key={time} style={[styles.timeMarker, { left: `${time}%` }]}>
                <Text style={styles.timeLabel}>{Math.round(time * sequence.duration / 100)}s</Text>
              </View>
            ))}
            
            {/* Keyframes */}
            {sequence.keyframes.map((keyframe, index) => (
              <TouchableOpacity
                key={keyframe.id}
                style={[
                  styles.keyframeMarker,
                  { 
                    left: `${keyframe.time}%`,
                    backgroundColor: `rgb(${keyframe.color.r}, ${keyframe.color.g}, ${keyframe.color.b})`,
                    borderColor: selectedKeyframe === keyframe.id ? palette.tint : 'transparent'
                  }
                ]}
                onPress={() => setSelectedKeyframe(keyframe.id)}
                activeOpacity={0.8}
              >
                <Text style={styles.keyframeNumber}>{index + 1}</Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>
        
        <View style={styles.timelineControls}>
          <SecondaryButton
            title="Tilføj Keyframe"
            icon="add"
            onPress={addKeyframe}
          />
          
          {selectedKf && (
            <SecondaryButton
              title="Slet"
              icon="trash"
              onPress={() => deleteKeyframe(selectedKf.id)}
            />
          )}
        </View>
      </Card>

      {/* Keyframe Editor */}
      {selectedKf && (
        <Card style={styles.editorCard}>
          <Text style={styles.sectionTitle}>Keyframe Editor</Text>
          
          {/* Time Position */}
          <View style={styles.parameterSection}>
            <View style={styles.parameterHeader}>
              <Ionicons name="time" size={20} color={palette.text} />
              <Text style={styles.parameterLabel}>Tid Position</Text>
              <Text style={styles.parameterValue}>{selectedKf.time}%</Text>
            </View>
            <Slider
              style={styles.slider}
              minimumValue={0}
              maximumValue={100}
              value={selectedKf.time}
              onValueChange={(value) => updateKeyframe(selectedKf.id, { time: value })}
              minimumTrackTintColor={palette.tint}
              maximumTrackTintColor={palette.muted}
            />
          </View>

          {/* Brightness */}
          <View style={styles.parameterSection}>
            <View style={styles.parameterHeader}>
              <Ionicons name="sunny" size={20} color={palette.text} />
              <Text style={styles.parameterLabel}>Lysstyrke</Text>
              <Text style={styles.parameterValue}>{Math.round(selectedKf.brightness)}%</Text>
            </View>
            <Slider
              style={styles.slider}
              minimumValue={0}
              maximumValue={100}
              value={selectedKf.brightness}
              onValueChange={(value) => updateKeyframe(selectedKf.id, { brightness: value })}
              minimumTrackTintColor={palette.tint}
              maximumTrackTintColor={palette.muted}
            />
          </View>

          {/* Color Picker */}
          <View style={styles.parameterSection}>
            <Text style={styles.parameterLabel}>Farve</Text>
            <ScrollView horizontal style={styles.colorPalette} showsHorizontalScrollIndicator={false}>
              {COLOR_PRESETS.map((color, index) => (
                <TouchableOpacity
                  key={index}
                  style={[
                    styles.colorSwatch,
                    { backgroundColor: `rgb(${color.r}, ${color.g}, ${color.b})` },
                    (selectedKf.color.r === color.r && selectedKf.color.g === color.g && selectedKf.color.b === color.b) && styles.colorSwatchSelected
                  ]}
                  onPress={() => updateKeyframe(selectedKf.id, { color })}
                  activeOpacity={0.8}
                />
              ))}
            </ScrollView>
          </View>

          {/* Easing */}
          <View style={styles.parameterSection}>
            <Text style={styles.parameterLabel}>Animation Easing</Text>
            <View style={styles.easingOptions}>
              {EASING_OPTIONS.map((option) => (
                <TouchableOpacity
                  key={option.value}
                  style={[
                    styles.easingButton,
                    selectedKf.easing === option.value && styles.easingButtonActive
                  ]}
                  onPress={() => updateKeyframe(selectedKf.id, { easing: option.value as any })}
                  activeOpacity={0.8}
                >
                  <Ionicons 
                    name={option.icon as any} 
                    size={16} 
                    color={selectedKf.easing === option.value ? palette.bg : palette.text} 
                  />
                  <Text style={[
                    styles.easingLabel,
                    selectedKf.easing === option.value && styles.easingLabelActive
                  ]}>
                    {option.label}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>
          </View>
        </Card>
      )}

      {/* Sequence Settings */}
      <Card style={styles.settingsCard}>
        <Text style={styles.sectionTitle}>Sekvens Indstillinger</Text>
        
        {/* Duration */}
        <View style={styles.parameterSection}>
          <View style={styles.parameterHeader}>
            <Ionicons name="timer" size={20} color={palette.text} />
            <Text style={styles.parameterLabel}>Total Varighed</Text>
            <Text style={styles.parameterValue}>{sequence.duration}s</Text>
          </View>
          <Slider
            style={styles.slider}
            minimumValue={1}
            maximumValue={60}
            value={sequence.duration}
            onValueChange={(value) => setSequence(prev => ({ ...prev, duration: value }))}
            minimumTrackTintColor={palette.tint}
            maximumTrackTintColor={palette.muted}
          />
        </View>

        {/* Loop Toggle */}
        <View style={styles.toggleSection}>
          <Ionicons name="repeat" size={20} color={palette.text} />
          <Text style={styles.toggleLabel}>Loop Animation</Text>
          <TouchableOpacity
            style={[styles.toggle, sequence.loop && styles.toggleActive]}
            onPress={() => setSequence(prev => ({ ...prev, loop: !prev.loop }))}
            activeOpacity={0.8}
          >
            <View style={[styles.toggleThumb, sequence.loop && styles.toggleThumbActive]} />
          </TouchableOpacity>
        </View>

        {/* Export */}
        <View style={styles.exportSection}>
          <SecondaryButton
            title="Eksportér JSON"
            icon="download"
            onPress={exportSequence}
          />
        </View>
      </Card>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: spacing.md,
  },
  headerCard: {
    padding: spacing.md,
    marginBottom: spacing.md,
  },
  headerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: spacing.sm,
  },
  sequenceInfo: {
    flex: 1,
  },
  sequenceName: {
    color: palette.text,
    fontSize: 18,
    fontWeight: '600',
  },
  sequenceMeta: {
    color: palette.muted,
    fontSize: 14,
  },
  playbackControls: {
    flexDirection: 'row',
    gap: spacing.sm,
  },
  progressBar: {
    height: 4,
    backgroundColor: palette.muted,
    borderRadius: 2,
    overflow: 'hidden',
  },
  progressFill: {
    height: '100%',
    backgroundColor: palette.tint,
  },
  timelineCard: {
    padding: spacing.md,
    marginBottom: spacing.md,
  },
  sectionTitle: {
    color: palette.text,
    fontSize: 16,
    fontWeight: '600',
    marginBottom: spacing.md,
  },
  timeline: {
    height: 80,
    marginBottom: spacing.md,
  },
  timelineTrack: {
    position: 'relative',
    height: 60,
    backgroundColor: 'rgba(122,140,160,0.1)',
    borderRadius: radius.sm,
  },
  timeMarker: {
    position: 'absolute',
    top: -20,
    transform: [{ translateX: -10 }],
  },
  timeLabel: {
    color: palette.muted,
    fontSize: 12,
    textAlign: 'center',
  },
  keyframeMarker: {
    position: 'absolute',
    top: 10,
    width: 40,
    height: 40,
    borderRadius: 20,
    borderWidth: 3,
    alignItems: 'center',
    justifyContent: 'center',
    transform: [{ translateX: -20 }],
  },
  keyframeNumber: {
    color: '#FFF',
    fontSize: 12,
    fontWeight: '600',
  },
  timelineControls: {
    flexDirection: 'row',
    gap: spacing.sm,
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
  colorPalette: {
    flexDirection: 'row',
    marginTop: spacing.sm,
  },
  colorSwatch: {
    width: 40,
    height: 40,
    borderRadius: 20,
    marginRight: spacing.sm,
    borderWidth: 2,
    borderColor: 'transparent',
  },
  colorSwatchSelected: {
    borderColor: palette.text,
    borderWidth: 3,
  },
  easingOptions: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: spacing.sm,
    marginTop: spacing.sm,
  },
  easingButton: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: spacing.sm,
    paddingHorizontal: spacing.md,
    borderRadius: radius.sm,
    backgroundColor: 'rgba(122,140,160,0.1)',
    gap: spacing.xs,
  },
  easingButtonActive: {
    backgroundColor: palette.tint,
  },
  easingLabel: {
    color: palette.text,
    fontSize: 12,
  },
  easingLabelActive: {
    color: palette.bg,
  },
  settingsCard: {
    padding: spacing.md,
    marginBottom: spacing.md,
  },
  toggleSection: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: spacing.md,
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
  exportSection: {
    alignItems: 'flex-start',
  },
});