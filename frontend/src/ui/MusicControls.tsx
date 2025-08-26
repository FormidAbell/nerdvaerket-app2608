/**
 * Musik & Mikrofon Controls til LOY PLAY-paritet
 * Real-time FFT, gain/smoothing, beat detection, color mapping
 */

import React, { useState, useEffect, useRef } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Dimensions } from 'react-native';
import Slider from '@react-native-community/slider';
import { Ionicons } from '@expo/vector-icons';
import { Card, PrimaryButton, SecondaryButton } from './components';
import { palette, spacing, radius } from './theme';
import { useBleStore } from '../store/bleStore';

const { width: screenWidth } = Dimensions.get('window');

interface AudioSettings {
  fftBands: number; // 8, 16, 32
  gain: number; // 0-100
  smoothing: number; // 0-100
  threshold: number; // 0-100 for beat detection
  beatSensitivity: number; // 0-100
  colorPalette: 'rainbow' | 'fire' | 'ocean' | 'forest' | 'sunset';
  autoColorChange: boolean;
}

interface FFTData {
  frequencies: number[]; // 0-255 per band
  volume: number; // 0-100 overall volume
  beatDetected: boolean;
  dominantFreq: number; // Hz
}

const COLOR_PALETTES = {
  rainbow: [
    { r: 255, g: 0, b: 0 },   // Red
    { r: 255, g: 165, b: 0 }, // Orange
    { r: 255, g: 255, b: 0 }, // Yellow
    { r: 0, g: 255, b: 0 },   // Green
    { r: 0, g: 255, b: 255 }, // Cyan
    { r: 0, g: 0, b: 255 },   // Blue
    { r: 128, g: 0, b: 128 }, // Purple
  ],
  fire: [
    { r: 255, g: 0, b: 0 },   // Red
    { r: 255, g: 69, b: 0 },  // Red-Orange
    { r: 255, g: 140, b: 0 }, // Dark Orange
    { r: 255, g: 165, b: 0 }, // Orange
    { r: 255, g: 215, b: 0 }, // Gold
    { r: 255, g: 255, b: 0 }, // Yellow
  ],
  ocean: [
    { r: 0, g: 0, b: 139 },   // Dark Blue
    { r: 0, g: 0, b: 255 },   // Blue
    { r: 0, g: 191, b: 255 }, // Deep Sky Blue
    { r: 0, g: 255, b: 255 }, // Cyan
    { r:64, g: 224, b: 208 }, // Turquoise
    { r: 127, g: 255, b: 212 }, // Aquamarine
  ],
  forest: [
    { r: 0, g: 100, b: 0 },   // Dark Green
    { r: 0, g: 128, b: 0 },   // Green
    { r: 34, g: 139, b: 34 }, // Forest Green
    { r: 0, g: 255, b: 0 },   // Lime
    { r: 173, g: 255, b: 47 }, // Green Yellow
    { r: 255, g: 255, b: 0 }, // Yellow
  ],
  sunset: [
    { r: 255, g: 94, b: 77 }, // Coral
    { r: 255, g: 154, b: 0 }, // Orange
    { r: 255, g: 206, b: 84 }, // Peach
    { r: 255, g: 218, b: 185 }, // Bisque
    { r: 255, g: 160, b: 122 }, // Light Salmon
    { r: 255, g: 99, b: 71 }, // Tomato
  ]
};

export const MusicControls: React.FC = () => {
  const { sendCommand, connectedDevice } = useBleStore();
  
  const [settings, setSettings] = useState<AudioSettings>({
    fftBands: 16,
    gain: 50,
    smoothing: 30,
    threshold: 40,
    beatSensitivity: 60,
    colorPalette: 'rainbow',
    autoColorChange: true
  });
  
  const [isActive, setIsActive] = useState(false);
  const [currentMode, setCurrentMode] = useState<'music' | 'microphone'>('music');
  const [fftData, setFFTData] = useState<FFTData>({
    frequencies: new Array(16).fill(0),
    volume: 0,
    beatDetected: false,
    dominantFreq: 440
  });
  
  const animationRef = useRef<number | null>(null);

  // Simulate FFT data for demo (i rigtig app ville dette komme fra audio analysis)
  const simulateFFTData = () => {
    const frequencies = new Array(settings.fftBands).fill(0).map(() => 
      Math.random() * 255 * (settings.gain / 100)
    );
    
    const volume = Math.random() * 100;
    const beatDetected = volume > settings.threshold && Math.random() > 0.7;
    const dominantFreq = 440 + (Math.random() - 0.5) * 880;
    
    setFFTData({
      frequencies,
      volume,
      beatDetected,
      dominantFreq
    });
  };

  // Start audio processing
  const startAudioProcessing = async () => {
    if (!connectedDevice) return;
    
    setIsActive(true);
    
    try {
      // Send initial settings til device
      await sendCommand('music_mode', 'fft', {
        bands: settings.fftBands,
        gain: settings.gain,
        hold: 10,
        decay: 20
      });
      
      if (currentMode === 'microphone') {
        await sendCommand('mic_mode', 'threshold', {
          threshold: settings.threshold,
          smoothing: settings.smoothing
        });
      }
      
      // Start FFT simulation
      const animate = () => {
        simulateFFTData();
        sendFFTToDevice();
        animationRef.current = requestAnimationFrame(animate);
      };
      animate();
      
    } catch (error) {
      console.log('Error starting audio processing:', error);
      setIsActive(false);
    }
  };

  // Stop audio processing
  const stopAudioProcessing = () => {
    setIsActive(false);
    
    if (animationRef.current) {
      cancelAnimationFrame(animationRef.current);
    }
    
    setFFTData({
      frequencies: new Array(settings.fftBands).fill(0),
      volume: 0,
      beatDetected: false,
      dominantFreq: 440
    });
  };

  // Send FFT data til LED device
  const sendFFTToDevice = async () => {
    if (!connectedDevice || !isActive) return;
    
    try {
      const palette = COLOR_PALETTES[settings.colorPalette];
      
      if (settings.autoColorChange && fftData.beatDetected) {
        // Auto color change på beat
        const colorIndex = Math.floor(Math.random() * palette.length);
        const color = palette[colorIndex];
        
        await sendCommand('color', 'rgb', {
          r: color.r,
          g: color.g,
          b: color.b
        });
      }
      
      // Map FFT data til brightness/speed
      const avgFrequency = fftData.frequencies.reduce((a, b) => a + b, 0) / fftData.frequencies.length;
      const brightness = Math.min(100, (avgFrequency / 255) * 100);
      
      await sendCommand('brightness', 'set', {
        value: Math.max(10, brightness) // Minimum 10% brightness
      });
      
    } catch (error) {
      console.log('Error sending FFT data:', error);
    }
  };

  // Update settings og send til device
  const updateSettings = async (newSettings: Partial<AudioSettings>) => {
    const updated = { ...settings, ...newSettings };
    setSettings(updated);
    
    if (isActive && connectedDevice) {
      try {
        if ('fftBands' in newSettings || 'gain' in newSettings) {
          await sendCommand('music_mode', 'fft', {
            bands: updated.fftBands,
            gain: updated.gain,
            hold: 10,
            decay: 20
          });
        }
        
        if ('threshold' in newSettings || 'smoothing' in newSettings) {
          await sendCommand('mic_mode', 'threshold', {
            threshold: updated.threshold,
            smoothing: updated.smoothing
          });
        }
      } catch (error) {
        console.log('Error updating settings:', error);
      }
    }
  };

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
      }
    };
  }, []);

  // FFT Visualizer component
  const FFTVisualizer = () => (
    <View style={styles.visualizer}>
      {fftData.frequencies.map((value, index) => (
        <View key={index} style={styles.fftBarContainer}>
          <View 
            style={[
              styles.fftBar, 
              { 
                height: `${(value / 255) * 100}%`,
                backgroundColor: fftData.beatDetected && settings.autoColorChange 
                  ? COLOR_PALETTES[settings.colorPalette][index % COLOR_PALETTES[settings.colorPalette].length]
                  ? `rgb(${COLOR_PALETTES[settings.colorPalette][index % COLOR_PALETTES[settings.colorPalette].length].r}, ${COLOR_PALETTES[settings.colorPalette][index % COLOR_PALETTES[settings.colorPalette].length].g}, ${COLOR_PALETTES[settings.colorPalette][index % COLOR_PALETTES[settings.colorPalette].length].b})`
                  : palette.tint
                  : palette.tint
              }
            ]} 
          />
        </View>
      ))}
    </View>
  );

  return (
    <ScrollView style={styles.container}>
      {/* Status & Controls */}
      <Card style={styles.statusCard}>
        <View style={styles.statusRow}>
          <View style={styles.statusInfo}>
            <Text style={styles.statusLabel}>
              {currentMode === 'music' ? 'Musik Mode' : 'Mikrofon Mode'}
            </Text>
            <Text style={styles.statusValue}>
              {isActive ? `Aktiv • ${settings.fftBands} bånd` : 'Standby'}
              {fftData.beatDetected && ' • Beat!'}
            </Text>
          </View>
          
          {!isActive ? (
            <PrimaryButton
              title="Start"
              icon="play"
              onPress={startAudioProcessing}
            />
          ) : (
            <SecondaryButton
              title="Stop"
              icon="stop"
              onPress={stopAudioProcessing}
            />
          )}
        </View>
        
        {/* Volume Level */}
        <View style={styles.volumeContainer}>
          <View style={styles.volumeBar}>
            <View style={[styles.volumeFill, { width: `${fftData.volume}%` }]} />
          </View>
          <Text style={styles.volumeText}>{Math.round(fftData.volume)}%</Text>
        </View>
      </Card>

      {/* Mode Selector */}
      <Card style={styles.modeCard}>
        <Text style={styles.sectionTitle}>Audio Kilde</Text>
        <View style={styles.modeButtons}>
          <TouchableOpacity
            style={[styles.modeButton, currentMode === 'music' && styles.modeButtonActive]}
            onPress={() => setCurrentMode('music')}
            activeOpacity={0.8}
          >
            <Ionicons 
              name="musical-notes" 
              size={24} 
              color={currentMode === 'music' ? palette.bg : palette.text} 
            />
            <Text style={[styles.modeText, currentMode === 'music' && styles.modeTextActive]}>
              Musik Player
            </Text>
          </TouchableOpacity>
          
          <TouchableOpacity
            style={[styles.modeButton, currentMode === 'microphone' && styles.modeButtonActive]}
            onPress={() => setCurrentMode('microphone')}
            activeOpacity={0.8}
          >
            <Ionicons 
              name="mic" 
              size={24} 
              color={currentMode === 'microphone' ? palette.bg : palette.text} 
            />
            <Text style={[styles.modeText, currentMode === 'microphone' && styles.modeTextActive]}>
              Mikrofon
            </Text>
          </TouchableOpacity>
        </View>
      </Card>

      {/* FFT Visualizer */}
      <Card style={styles.visualizerCard}>
        <Text style={styles.sectionTitle}>Real-time FFT</Text>
        <FFTVisualizer />
        <Text style={styles.visualizerInfo}>
          Dominant frekvens: {Math.round(fftData.dominantFreq)}Hz
        </Text>
      </Card>

      {/* Audio Settings */}
      <Card style={styles.settingsCard}>
        <Text style={styles.sectionTitle}>Audio Indstillinger</Text>
        
        {/* FFT Bands */}
        <View style={styles.parameterSection}>
          <Text style={styles.parameterLabel}>FFT Bånd</Text>
          <View style={styles.bandButtons}>
            {[8, 16, 32].map(bands => (
              <TouchableOpacity
                key={bands}
                style={[
                  styles.bandButton,
                  settings.fftBands === bands && styles.bandButtonActive
                ]}
                onPress={() => updateSettings({ fftBands: bands })}
                activeOpacity={0.8}
              >
                <Text style={[
                  styles.bandText,
                  settings.fftBands === bands && styles.bandTextActive
                ]}>
                  {bands}
                </Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>

        {/* Gain */}
        <View style={styles.parameterSection}>
          <View style={styles.parameterHeader}>
            <Ionicons name="volume-high" size={20} color={palette.text} />
            <Text style={styles.parameterLabel}>Gain</Text>
            <Text style={styles.parameterValue}>{settings.gain}%</Text>
          </View>
          <Slider
            style={styles.slider}
            minimumValue={0}
            maximumValue={100}
            value={settings.gain}
            onValueChange={(value) => updateSettings({ gain: value })}
            minimumTrackTintColor={palette.tint}
            maximumTrackTintColor={palette.muted}
          />
        </View>

        {/* Smoothing */}
        <View style={styles.parameterSection}>
          <View style={styles.parameterHeader}>
            <Ionicons name="analytics" size={20} color={palette.text} />
            <Text style={styles.parameterLabel}>Smoothing</Text>
            <Text style={styles.parameterValue}>{settings.smoothing}%</Text>
          </View>
          <Slider
            style={styles.slider}
            minimumValue={0}
            maximumValue={100}
            value={settings.smoothing}
            onValueChange={(value) => updateSettings({ smoothing: value })}
            minimumTrackTintColor={palette.tint}
            maximumTrackTintColor={palette.muted}
          />
        </View>

        {/* Beat Detection Threshold */}
        <View style={styles.parameterSection}>
          <View style={styles.parameterHeader}>
            <Ionicons name="pulse" size={20} color={palette.text} />
            <Text style={styles.parameterLabel}>Beat Threshold</Text>
            <Text style={styles.parameterValue}>{settings.threshold}%</Text>
          </View>
          <Slider
            style={styles.slider}
            minimumValue={0}
            maximumValue={100}
            value={settings.threshold}
            onValueChange={(value) => updateSettings({ threshold: value })}
            minimumTrackTintColor={palette.tint}
            maximumTrackTintColor={palette.muted}
          />
        </View>
      </Card>

      {/* Color Palette */}
      <Card style={styles.paletteCard}>
        <Text style={styles.sectionTitle}>Farve Palette</Text>
        
        <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.paletteScroll}>
          {Object.entries(COLOR_PALETTES).map(([key, colors]) => (
            <TouchableOpacity
              key={key}
              style={[
                styles.paletteOption,
                settings.colorPalette === key && styles.paletteOptionActive
              ]}
              onPress={() => updateSettings({ colorPalette: key as any })}
              activeOpacity={0.8}
            >
              <View style={styles.palettePreview}>
                {colors.slice(0, 4).map((color, index) => (
                  <View
                    key={index}
                    style={[
                      styles.paletteColor,
                      { backgroundColor: `rgb(${color.r}, ${color.g}, ${color.b})` }
                    ]}
                  />
                ))}
              </View>
              <Text style={[
                styles.paletteName,
                settings.colorPalette === key && styles.paletteNameActive
              ]}>
                {key.charAt(0).toUpperCase() + key.slice(1)}
              </Text>
            </TouchableOpacity>
          ))}
        </ScrollView>

        {/* Auto Color Change Toggle */}
        <View style={styles.toggleSection}>
          <Ionicons name="color-palette" size={20} color={palette.text} />
          <Text style={styles.toggleLabel}>Auto farve på beat</Text>
          <TouchableOpacity
            style={[styles.toggle, settings.autoColorChange && styles.toggleActive]}
            onPress={() => updateSettings({ autoColorChange: !settings.autoColorChange })}
            activeOpacity={0.8}
          >
            <View style={[styles.toggleThumb, settings.autoColorChange && styles.toggleThumbActive]} />
          </TouchableOpacity>
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
  statusCard: {
    padding: spacing.md,
    marginBottom: spacing.md,
  },
  statusRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: spacing.sm,
  },
  statusInfo: {
    flex: 1,
  },
  statusLabel: {
    color: palette.text,
    fontSize: 16,
    fontWeight: '600',
  },
  statusValue: {
    color: palette.muted,
    fontSize: 14,
  },
  volumeContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm,
  },
  volumeBar: {
    flex: 1,
    height: 8,
    backgroundColor: palette.muted,
    borderRadius: 4,
    overflow: 'hidden',
  },
  volumeFill: {
    height: '100%',
    backgroundColor: palette.tint,
  },
  volumeText: {
    color: palette.text,
    fontSize: 12,
    minWidth: 35,
    textAlign: 'right',
  },
  modeCard: {
    padding: spacing.md,
    marginBottom: spacing.md,
  },
  sectionTitle: {
    color: palette.text,
    fontSize: 16,
    fontWeight: '600',
    marginBottom: spacing.md,
  },
  modeButtons: {
    flexDirection: 'row',
    gap: spacing.sm,
  },
  modeButton: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: spacing.md,
    paddingHorizontal: spacing.sm,
    borderRadius: radius.md,
    backgroundColor: 'rgba(122,140,160,0.1)',
    gap: spacing.sm,
  },
  modeButtonActive: {
    backgroundColor: palette.tint,
  },
  modeText: {
    color: palette.text,
    fontSize: 14,
    fontWeight: '600',
  },
  modeTextActive: {
    color: palette.bg,
  },
  visualizerCard: {
    padding: spacing.md,
    marginBottom: spacing.md,
  },
  visualizer: {
    height: 120,
    flexDirection: 'row',
    alignItems: 'flex-end',
    justifyContent: 'space-between',
    backgroundColor: 'rgba(0,0,0,0.3)',
    borderRadius: radius.sm,
    padding: spacing.sm,
    marginBottom: spacing.sm,
  },
  fftBarContainer: {
    flex: 1,
    height: '100%',
    marginHorizontal: 1,
    justifyContent: 'flex-end',
  },
  fftBar: {
    backgroundColor: palette.tint,
    borderRadius: 1,
    minHeight: 2,
  },
  visualizerInfo: {
    color: palette.muted,
    fontSize: 12,
    textAlign: 'center',
  },
  settingsCard: {
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
  bandButtons: {
    flexDirection: 'row',
    gap: spacing.sm,
    marginTop: spacing.sm,
  },
  bandButton: {
    paddingVertical: spacing.sm,
    paddingHorizontal: spacing.md,
    borderRadius: radius.sm,
    backgroundColor: 'rgba(122,140,160,0.1)',
  },
  bandButtonActive: {
    backgroundColor: palette.tint,
  },
  bandText: {
    color: palette.text,
    fontSize: 14,
    fontWeight: '600',
  },
  bandTextActive: {
    color: palette.bg,
  },
  paletteCard: {
    padding: spacing.md,
    marginBottom: spacing.md,
  },
  paletteScroll: {
    marginBottom: spacing.md,
  },
  paletteOption: {
    alignItems: 'center',
    marginRight: spacing.md,
    padding: spacing.sm,
    borderRadius: radius.sm,
    backgroundColor: 'rgba(122,140,160,0.1)',
  },
  paletteOptionActive: {
    backgroundColor: palette.tint,
  },
  palettePreview: {
    flexDirection: 'row',
    marginBottom: spacing.xs,
  },
  paletteColor: {
    width: 12,
    height: 12,
    marginHorizontal: 1,
  },
  paletteName: {
    color: palette.text,
    fontSize: 12,
    fontWeight: '600',
  },
  paletteNameActive: {
    color: palette.bg,
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
});