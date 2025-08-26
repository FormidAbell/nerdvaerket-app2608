/**
 * LOY PLAY-paritet farve controls
 * Farvehjul (HSV), paletter, RGB/RGBW/CCT, brightness, power
 */

import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, Dimensions, TouchableOpacity } from 'react-native';
import Slider from '@react-native-community/slider';
import { Ionicons } from '@expo/vector-icons';
import { Card, PrimaryButton, SecondaryButton } from './components';
import { palette, spacing } from './theme';
import { useBleStore } from '../store/bleStore';

const { width: screenWidth } = Dimensions.get('window');
const WHEEL_SIZE = Math.min(screenWidth - 32, 280);

interface ColorState {
  hue: number;        // 0-360
  saturation: number; // 0-100
  brightness: number; // 0-100
  kelvin: number;     // 2700-6500K
  tint: number;       // -100 to +100
  white: number;      // 0-100 (for RGBW)
}

interface RGB {
  r: number;
  g: number;
  b: number;
}

export const ColorControls: React.FC = () => {
  const { sendCommand, connectedDevice } = useBleStore();
  
  const [colorState, setColorState] = useState<ColorState>({
    hue: 0,
    saturation: 100,
    brightness: 100,
    kelvin: 4000,
    tint: 0,
    white: 0
  });
  
  const [colorMode, setColorMode] = useState<'hsv' | 'rgb' | 'cct' | 'rgbw'>('hsv');
  const [gammaCorrection, setGammaCorrection] = useState(false);
  const [power, setPower] = useState(true);

  // HSV til RGB konvertering
  const hsvToRgb = (h: number, s: number, v: number): RGB => {
    h = h / 60;
    s = s / 100;
    v = v / 100;
    
    const c = v * s;
    const x = c * (1 - Math.abs((h % 2) - 1));
    const m = v - c;
    
    let r = 0, g = 0, b = 0;
    
    if (h >= 0 && h < 1) {
      r = c; g = x; b = 0;
    } else if (h >= 1 && h < 2) {
      r = x; g = c; b = 0;
    } else if (h >= 2 && h < 3) {
      r = 0; g = c; b = x;
    } else if (h >= 3 && h < 4) {
      r = 0; g = x; b = c;
    } else if (h >= 4 && h < 5) {
      r = x; g = 0; b = c;
    } else if (h >= 5 && h < 6) {
      r = c; g = 0; b = x;
    }
    
    return {
      r: Math.round((r + m) * 255),
      g: Math.round((g + m) * 255),
      b: Math.round((b + m) * 255)
    };
  };

  // Kelvin til RGB konvertering (approksimation)
  const kelvinToRgb = (kelvin: number, tint: number = 0): RGB => {
    const temp = kelvin / 100;
    
    let r, g, b;
    
    if (temp <= 66) {
      r = 255;
      g = temp;
      g = 99.4708025861 * Math.log(g) - 161.1195681661;
      
      if (temp >= 19) {
        b = temp - 10;
        b = 138.5177312231 * Math.log(b) - 305.0447927307;
      } else {
        b = 0;
      }
    } else {
      r = temp - 60;
      r = 329.698727446 * Math.pow(r, -0.1332047592);
      
      g = temp - 60;
      g = 288.1221695283 * Math.pow(g, -0.0755148492);
      
      b = 255;
    }
    
    // Clamp values
    r = Math.max(0, Math.min(255, r));
    g = Math.max(0, Math.min(255, g));
    b = Math.max(0, Math.min(255, b));
    
    // Apply tint (grøn-magenta shift)
    if (tint > 0) {
      // Mere magenta (mindre grøn)
      const factor = tint / 100;
      g = Math.max(0, g * (1 - factor * 0.3));
      r = Math.min(255, r * (1 + factor * 0.1));
      b = Math.min(255, b * (1 + factor * 0.1));
    } else if (tint < 0) {
      // Mere grøn (mindre magenta)
      const factor = Math.abs(tint) / 100;
      g = Math.min(255, g * (1 + factor * 0.3));
      r = Math.max(0, r * (1 - factor * 0.1));
      b = Math.max(0, b * (1 - factor * 0.1));
    }
    
    return { r: Math.round(r), g: Math.round(g), b: Math.round(b) };
  };

  // Send farve kommando
  const sendColorCommand = async () => {
    if (!connectedDevice) return;
    
    try {
      let rgb: RGB;
      
      if (colorMode === 'cct') {
        rgb = kelvinToRgb(colorState.kelvin, colorState.tint);
        await sendCommand('color', 'cct', {
          kelvin: colorState.kelvin,
          tint: colorState.tint
        });
      } else {
        rgb = hsvToRgb(colorState.hue, colorState.saturation, colorState.brightness);
        
        if (colorMode === 'rgbw') {
          await sendCommand('color', 'rgbw', {
            r: rgb.r,
            g: rgb.g,
            b: rgb.b,
            w: Math.round(colorState.white * 2.55)
          });
        } else {
          await sendCommand('color', 'rgb', {
            r: rgb.r,
            g: rgb.g,
            b: rgb.b
          });
        }
      }
      
      // Send brightness separat
      await sendCommand('brightness', 'set', {
        value: colorState.brightness
      });
      
    } catch (error) {
      console.log('Error sending color command:', error);
    }
  };

  // Power toggle
  const togglePower = async () => {
    if (!connectedDevice) return;
    
    try {
      if (power) {
        await sendCommand('power', 'off', {});
      } else {
        await sendCommand('power', 'on', { brightness: Math.round(colorState.brightness * 2.55) });
      }
      setPower(!power);
    } catch (error) {
      console.log('Error toggling power:', error);
    }
  };

  // Auto-send når farver ændres
  useEffect(() => {
    if (connectedDevice && power) {
      const timeout = setTimeout(sendColorCommand, 300); // Debounce
      return () => clearTimeout(timeout);
    }
  }, [colorState, colorMode, power, connectedDevice]);

  const currentRgb = colorMode === 'cct' 
    ? kelvinToRgb(colorState.kelvin, colorState.tint)
    : hsvToRgb(colorState.hue, colorState.saturation, colorState.brightness);

  const previewColor = `rgb(${currentRgb.r}, ${currentRgb.g}, ${currentRgb.b})`;

  return (
    <View style={styles.container}>
      {/* Power & Preview */}
      <Card style={styles.powerCard}>
        <View style={styles.powerRow}>
          <View style={styles.powerInfo}>
            <Text style={styles.powerLabel}>LED Strip</Text>
            <Text style={styles.powerStatus}>{power ? 'Tændt' : 'Slukket'}</Text>
          </View>
          
          <View style={[styles.colorPreview, { backgroundColor: power ? previewColor : '#333' }]} />
          
          <PrimaryButton
            title={power ? 'Sluk' : 'Tænd'}
            icon={power ? 'power' : 'power-outline'}
            onPress={togglePower}
          />  
        </View>
      </Card>

      {/* Color Mode Selector */}
      <Card style={styles.modeCard}>
        <Text style={styles.sectionTitle}>Farvetilstand</Text>
        <View style={styles.modeButtons}>
          {[
            { key: 'hsv', label: 'HSV', icon: 'color-palette' },
            { key: 'rgb', label: 'RGB', icon: 'layers' },
            { key: 'cct', label: 'CCT', icon: 'sunny' },
            { key: 'rgbw', label: 'RGBW', icon: 'add-circle' }
          ].map(mode => (
            <SecondaryButton
              key={mode.key}
              title={mode.label}
              icon={mode.icon as any}
              onPress={() => setColorMode(mode.key as any)}
            />
          ))}
        </View>
      </Card>

      {/* HSV Controls */}
      {colorMode === 'hsv' && (
        <Card style={styles.controlCard}>
          <Text style={styles.sectionTitle}>HSV Farvehjul</Text>
          
          <View style={styles.sliderContainer}>
            <View style={styles.sliderRow}>
              <Ionicons name="color-palette" size={20} color={palette.text} />
              <Text style={styles.sliderLabel}>Farvetone</Text>
              <Text style={styles.sliderValue}>{colorState.hue}°</Text>
            </View>
            <Slider
              style={styles.slider}
              minimumValue={0}
              maximumValue={360}
              value={colorState.hue}
              onValueChange={(value) => setColorState(prev => ({ ...prev, hue: value }))}
              minimumTrackTintColor={palette.tint}
              maximumTrackTintColor={palette.muted}
              thumbStyle={styles.sliderThumb}
            />
          </View>

          <View style={styles.sliderContainer}>
            <View style={styles.sliderRow}>
              <Ionicons name="contrast" size={20} color={palette.text} />
              <Text style={styles.sliderLabel}>Mætning</Text>
              <Text style={styles.sliderValue}>{Math.round(colorState.saturation)}%</Text>
            </View>
            <Slider
              style={styles.slider}
              minimumValue={0}
              maximumValue={100}
              value={colorState.saturation}
              onValueChange={(value) => setColorState(prev => ({ ...prev, saturation: value }))}
              minimumTrackTintColor={palette.tint}
              maximumTrackTintColor={palette.muted}
              thumbStyle={styles.sliderThumb}
            />
          </View>
        </Card>
      )}

      {/* CCT Controls */}
      {colorMode === 'cct' && (
        <Card style={styles.controlCard}>
          <Text style={styles.sectionTitle}>Farvetemperatur (CCT)</Text>
          
          <View style={styles.sliderContainer}>
            <View style={styles.sliderRow}>
              <Ionicons name="sunny" size={20} color={palette.text} />
              <Text style={styles.sliderLabel}>Kelvin</Text>
              <Text style={styles.sliderValue}>{colorState.kelvin}K</Text>
            </View>
            <Slider
              style={styles.slider}
              minimumValue={2700}
              maximumValue={6500}
              value={colorState.kelvin}
              onValueChange={(value) => setColorState(prev => ({ ...prev, kelvin: value }))}
              minimumTrackTintColor={palette.orange}
              maximumTrackTintColor={palette.tint}
              thumbStyle={styles.sliderThumb}
            />
          </View>

          <View style={styles.sliderContainer}>
            <View style={styles.sliderRow}>
              <Ionicons name="options" size={20} color={palette.text} />
              <Text style={styles.sliderLabel}>Tint</Text>
              <Text style={styles.sliderValue}>{colorState.tint > 0 ? '+' : ''}{colorState.tint}</Text>
            </View>
            <Slider
              style={styles.slider}
              minimumValue={-100}
              maximumValue={100}
              value={colorState.tint}
              onValueChange={(value) => setColorState(prev => ({ ...prev, tint: value }))}
              minimumTrackTintColor={palette.success}
              maximumTrackTintColor={palette.purple}
              thumbStyle={styles.sliderThumb}
            />
          </View>
        </Card>
      )}

      {/* RGBW Controls */}  
      {colorMode === 'rgbw' && (
        <Card style={styles.controlCard}>
          <Text style={styles.sectionTitle}>RGBW + Hvid</Text>
          
          <View style={styles.sliderContainer}>
            <View style={styles.sliderRow}>
              <Ionicons name="radio-button-on" size={20} color="#FFF" />
              <Text style={styles.sliderLabel}>Hvid LED</Text>
              <Text style={styles.sliderValue}>{Math.round(colorState.white)}%</Text>
            </View>
            <Slider
              style={styles.slider}
              minimumValue={0}
              maximumValue={100}
              value={colorState.white}
              onValueChange={(value) => setColorState(prev => ({ ...prev, white: value }))}
              minimumTrackTintColor="#FFF"
              maximumTrackTintColor={palette.muted}
              thumbStyle={styles.sliderThumb}
            />
          </View>
        </Card>
      )}

      {/* Brightness Control */}
      <Card style={styles.controlCard}>
        <Text style={styles.sectionTitle}>Lysstyrke & Indstillinger</Text>
        
        <View style={styles.sliderContainer}>
          <View style={styles.sliderRow}>
            <Ionicons name="sunny" size={20} color={palette.text} />
            <Text style={styles.sliderLabel}>Lysstyrke</Text>
            <Text style={styles.sliderValue}>{Math.round(colorState.brightness)}%</Text>
          </View>
          <Slider
            style={styles.slider}
            minimumValue={0}
            maximumValue={100}
            value={colorState.brightness}
            onValueChange={(value) => setColorState(prev => ({ ...prev, brightness: value }))}
            minimumTrackTintColor={palette.tint}
            maximumTrackTintColor={palette.muted}
            thumbStyle={styles.sliderThumb}
          />
        </View>

        <View style={styles.toggleRow}>
          <Ionicons name="contrast" size={20} color={palette.text} />
          <Text style={styles.toggleLabel}>Gamma korrektion</Text>
          <SecondaryButton
            title={gammaCorrection ? 'Til' : 'Fra'}
            onPress={() => setGammaCorrection(!gammaCorrection)}
          />
        </View>
      </Card>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: spacing.md,
    gap: spacing.md,
  },
  powerCard: {
    padding: spacing.md,
  },
  powerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  powerInfo: {
    flex: 1,
  },
  powerLabel: {
    color: palette.text,
    fontSize: 16,
    fontWeight: '600',
  },
  powerStatus: {
    color: palette.muted,
    fontSize: 14,
  },
  colorPreview: {
    width: 40,
    height: 40,
    borderRadius: 20,
    marginHorizontal: spacing.md,
    borderWidth: 2,
    borderColor: palette.muted,
  },
  modeCard: {
    padding: spacing.md,
  },
  modeButtons: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: spacing.sm,
    marginTop: spacing.sm,
  },
  controlCard: {
    padding: spacing.md,
  },
  sectionTitle: {
    color: palette.text,
    fontSize: 16,
    fontWeight: '600',
    marginBottom: spacing.md,
  },
  sliderContainer: {
    marginBottom: spacing.md,
  },
  sliderRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: spacing.sm,
  },
  sliderLabel: {
    color: palette.text,
    fontSize: 14,
    flex: 1,
    marginLeft: spacing.sm,
  },
  sliderValue: {
    color: palette.tint,
    fontSize: 14,
    fontWeight: '600',
    minWidth: 50,
    textAlign: 'right',
  },
  slider: {
    height: 40,
  },
  sliderThumb: {
    backgroundColor: palette.tint,
    width: 20,
    height: 20,
  },
  toggleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginTop: spacing.sm,
  },
  toggleLabel: {
    color: palette.text,
    fontSize: 14,
    flex: 1,
    marginLeft: spacing.sm,
  },
});