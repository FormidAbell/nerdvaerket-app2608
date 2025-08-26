/**
 * Scene Controls til LOY PLAY-paritet
 * Presets: Static, Breathe, Strobe, Chase, Rainbow, Gradient osv.
 */

import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
import Slider from '@react-native-community/slider';
import { Ionicons } from '@expo/vector-icons';
import { Card, PrimaryButton, SecondaryButton } from './components';
import { palette, spacing, radius } from './theme';
import { useBleStore } from '../store/bleStore';

interface Scene {
  id: string;
  name: string;
  icon: keyof typeof Ionicons.glyphMap;
  description: string;
  category: 'basic' | 'effect' | 'rainbow' | 'custom';
  params?: {
    requiresColor?: boolean;
    requiresSpeed?: boolean;
    requiresGradient?: boolean;
  };
}

interface SceneState {
  selectedScene: Scene | null;
  speed: number; // 0-100
  primaryColor: { r: number; g: number; b: number };
  secondaryColor: { r: number; g: number; b: number };
  isPlaying: boolean;
}

const PRESET_SCENES: Scene[] = [
  {
    id: 'static',
    name: 'Statisk',
    icon: 'radio-button-on',
    description: 'Ren farve uden animation',
    category: 'basic',
    params: { requiresColor: true }
  },
  {
    id: 'breathe',
    name: 'Puls',
    icon: 'heart',
    description: 'Blød pulsering op og ned',
    category: 'effect',
    params: { requiresColor: true, requiresSpeed: true }
  },
  {
    id: 'strobe',
    name: 'Strobe',
    icon: 'flash',
    description: 'Hurtig on/off blinking',
    category: 'effect',
    params: { requiresColor: true, requiresSpeed: true }
  },
  {
    id: 'chase',
    name: 'Chase',
    icon: 'arrow-forward',
    description: 'Lys løber hen over LED strip',
    category: 'effect',
    params: { requiresColor: true, requiresSpeed: true }
  },
  {
    id: 'rainbow',
    name: 'Regnbue',
    icon: 'color-palette',
    description: 'Klassisk regnbue animation',
    category: 'rainbow',
    params: { requiresSpeed: true }
  },
  {
    id: 'gradient',
    name: 'Gradient',
    icon: 'layers',
    description: 'Blød overgang mellem to farver',
    category: 'effect',
    params: { requiresGradient: true, requiresSpeed: true }
  }
];

const COLOR_PRESETS = [
  { name: 'Rød', color: { r: 255, g: 0, b: 0 } },
  { name: 'Grøn', color: { r: 0, g: 255, b: 0 } },
  { name: 'Blå', color: { r: 0, g: 0, b: 255 } },
  { name: 'Gul', color: { r: 255, g: 255, b: 0 } },
  { name: 'Lilla', color: { r: 128, g: 0, b: 128 } },
  { name: 'Cyan', color: { r: 0, g: 255, b: 255 } },
  { name: 'Orange', color: { r: 255, g: 165, b: 0 } },
  { name: 'Hvid', color: { r: 255, g: 255, b: 255 } }
];

export const SceneControls: React.FC = () => {
  const { sendCommand, connectedDevice } = useBleStore();
  
  const [sceneState, setSceneState] = useState<SceneState>({
    selectedScene: null,
    speed: 50,
    primaryColor: { r: 255, g: 0, b: 0 },
    secondaryColor: { r: 0, g: 0, b: 255 },
    isPlaying: false
  });

  // Send scene kommando
  const activateScene = async (scene: Scene) => {
    if (!connectedDevice) return;
    
    try {
      setSceneState(prev => ({ ...prev, selectedScene: scene, isPlaying: true }));
      
      switch (scene.id) {
        case 'static':
          await sendCommand('scene', 'static', {
            r: sceneState.primaryColor.r,
            g: sceneState.primaryColor.g,
            b: sceneState.primaryColor.b
          });
          break;
          
        case 'breathe':
          await sendCommand('scene', 'breathe', {
            r: sceneState.primaryColor.r,
            g: sceneState.primaryColor.g,
            b: sceneState.primaryColor.b
          });
          await sendCommand('speed', 'set', { value: sceneState.speed });
          break;
          
        case 'strobe':
          await sendCommand('scene', 'strobe', {
            r: sceneState.primaryColor.r,
            g: sceneState.primaryColor.g,
            b: sceneState.primaryColor.b
          });
          await sendCommand('speed', 'set', { value: sceneState.speed });
          break;
          
        case 'chase':
          await sendCommand('scene', 'chase', {
            r: sceneState.primaryColor.r,
            g: sceneState.primaryColor.g,
            b: sceneState.primaryColor.b
          });
          await sendCommand('speed', 'set', { value: sceneState.speed });
          break;
          
        case 'rainbow':
          await sendCommand('scene', 'rainbow', {
            speed: sceneState.speed
          });
          break;
          
        case 'gradient':
          await sendCommand('scene', 'gradient', {
            r1: sceneState.primaryColor.r,
            g1: sceneState.primaryColor.g,
            b1: sceneState.primaryColor.b,
            r2: sceneState.secondaryColor.r,
            g2: sceneState.secondaryColor.g,
            b2: sceneState.secondaryColor.b
          });
          await sendCommand('speed', 'set', { value: sceneState.speed });
          break;
      }
    } catch (error) {
      console.log('Error activating scene:', error);
      setSceneState(prev => ({ ...prev, isPlaying: false }));
    }
  };

  // Stop scene
  const stopScene = async () => {
    if (!connectedDevice) return;
    
    try {
      await sendCommand('power', 'off', {});
      setSceneState(prev => ({ ...prev, selectedScene: null, isPlaying: false }));
    } catch (error) {
      console.log('Error stopping scene:', error);
    }
  };

  // Auto-update scene når parametre ændres
  useEffect(() => {
    if (sceneState.selectedScene && sceneState.isPlaying && connectedDevice) {
      const timeout = setTimeout(() => activateScene(sceneState.selectedScene!), 300);
      return () => clearTimeout(timeout);
    }
  }, [sceneState.speed, sceneState.primaryColor, sceneState.secondaryColor]);

  const renderSceneCard = (scene: Scene) => {
    const isActive = sceneState.selectedScene?.id === scene.id;
    
    return (
      <TouchableOpacity
        key={scene.id}
        style={[styles.sceneCard, isActive && styles.sceneCardActive]}
        onPress={() => activateScene(scene)}
        activeOpacity={0.8}
      >
        <View style={[styles.sceneIcon, isActive && styles.sceneIconActive]}>
          <Ionicons 
            name={scene.icon} 
            size={24} 
            color={isActive ? palette.bg : palette.tint} 
          />
        </View>
        
        <Text style={[styles.sceneName, isActive && styles.sceneNameActive]}>
          {scene.name}
        </Text>
        
        <Text style={[styles.sceneDescription, isActive && styles.sceneDescriptionActive]}>
          {scene.description}
        </Text>
        
        {isActive && sceneState.isPlaying && (
          <View style={styles.playingIndicator}>
            <Ionicons name="play" size={12} color={palette.bg} />
          </View>
        )}
      </TouchableOpacity>
    );
  };

  const renderColorPicker = (title: string, color: { r: number; g: number; b: number }, onChange: (color: { r: number; g: number; b: number }) => void) => (
    <View style={styles.colorSection}>
      <Text style={styles.colorTitle}>{title}</Text>
      <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.colorPresets}>
        {COLOR_PRESETS.map((preset, index) => (
          <TouchableOpacity
            key={index}
            style={[
              styles.colorPreset,
              { backgroundColor: `rgb(${preset.color.r}, ${preset.color.g}, ${preset.color.b})` },
              color.r === preset.color.r && color.g === preset.color.g && color.b === preset.color.b && styles.colorPresetActive
            ]}
            onPress={() => onChange(preset.color)}
            activeOpacity={0.8}
          >
            {color.r === preset.color.r && color.g === preset.color.g && color.b === preset.color.b && (
              <Ionicons name="checkmark" size={16} color="#FFF" />
            )}
          </TouchableOpacity>
        ))}
      </ScrollView>
    </View>
  );

  const selectedScene = sceneState.selectedScene;

  return (
    <ScrollView style={styles.container}>
      {/* Status */}
      <Card style={styles.statusCard}>
        <View style={styles.statusRow}>
          <View style={styles.statusInfo}>
            <Text style={styles.statusLabel}>Scene Status</Text>
            <Text style={styles.statusValue}>
              {sceneState.isPlaying ? `Afspiller: ${selectedScene?.name}` : 'Standby'}
            </Text>
          </View>
          
          {sceneState.isPlaying && (
            <PrimaryButton
              title="Stop"
              icon="stop"
              onPress={stopScene}
            />
          )}
        </View>
      </Card>

      {/* Scene Selector */}
      <Card style={styles.scenesCard}>
        <Text style={styles.sectionTitle}>Scener & Effekter</Text>
        
        <View style={styles.categorySection}>
          <Text style={styles.categoryTitle}>Basis</Text>
          <View style={styles.sceneGrid}>
            {PRESET_SCENES.filter(s => s.category === 'basic').map(renderSceneCard)}
          </View>
        </View>

        <View style={styles.categorySection}>
          <Text style={styles.categoryTitle}>Effekter</Text>
          <View style={styles.sceneGrid}>
            {PRESET_SCENES.filter(s => s.category === 'effect').map(renderSceneCard)}
          </View>
        </View>

        <View style={styles.categorySection}>
          <Text style={styles.categoryTitle}>Regnbue</Text>
          <View style={styles.sceneGrid}>
            {PRESET_SCENES.filter(s => s.category === 'rainbow').map(renderSceneCard)}
          </View>
        </View>
      </Card>

      {/* Scene Parameters */}
      {selectedScene && (
        <Card style={styles.paramsCard}>
          <Text style={styles.sectionTitle}>Scene Indstillinger</Text>
          
          {/* Speed Control */}
          {selectedScene.params?.requiresSpeed && (
            <View style={styles.paramSection}>
              <View style={styles.paramHeader}>
                <Ionicons name="speedometer" size={20} color={palette.text} />
                <Text style={styles.paramLabel}>Hastighed</Text>
                <Text style={styles.paramValue}>{sceneState.speed}%</Text>
              </View>
              <Slider
                style={styles.slider}
                minimumValue={1}
                maximumValue={100}
                value={sceneState.speed}
                onValueChange={(value) => setSceneState(prev => ({ ...prev, speed: value }))}
                minimumTrackTintColor={palette.tint}
                maximumTrackTintColor={palette.muted}
              />
            </View>
          )}

          {/* Primary Color */}
          {selectedScene.params?.requiresColor && (
            renderColorPicker(
              'Primær farve',
              sceneState.primaryColor,
              (color) => setSceneState(prev => ({ ...prev, primaryColor: color }))
            )
          )}

          {/* Secondary Color for Gradient */}
          {selectedScene.params?.requiresGradient && (
            renderColorPicker(
              'Sekundær farve',
              sceneState.secondaryColor,
              (color) => setSceneState(prev => ({ ...prev, secondaryColor: color }))
            )
          )}
        </Card>
      )}
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
  scenesCard: {
    padding: spacing.md,
    marginBottom: spacing.md,
  },
  sectionTitle: {
    color: palette.text,
    fontSize: 18,
    fontWeight: '600',
    marginBottom: spacing.md,
  },
  categorySection: {
    marginBottom: spacing.lg,
  },
  categoryTitle: {
    color: palette.text,
    fontSize: 14,
    fontWeight: '600',
    marginBottom: spacing.sm,
    opacity: 0.8,
  },
  sceneGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: spacing.sm,
  },
  sceneCard: {
    backgroundColor: 'rgba(122,140,160,0.1)',
    borderRadius: radius.md,
    padding: spacing.md,
    width: '48%',
    alignItems: 'center',
    borderWidth: 2,
    borderColor: 'transparent',
  },
  sceneCardActive: {
    backgroundColor: palette.tint,
    borderColor: palette.tint,
  },
  sceneIcon: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: 'rgba(122,140,160,0.2)',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: spacing.sm,
  },
  sceneIconActive: {
    backgroundColor: 'rgba(255,255,255,0.2)',
  },
  sceneName: {
    color: palette.text,
    fontSize: 14,
    fontWeight: '600',
    textAlign: 'center',
    marginBottom: 4,
  },
  sceneNameActive: {
    color: palette.bg,
  },
  sceneDescription: {
    color: palette.muted,
    fontSize: 12,
    textAlign: 'center',
    lineHeight: 16,
  },
  sceneDescriptionActive: {
    color: 'rgba(0,26,46,0.8)',
  },
  playingIndicator: {
    position: 'absolute',
    top: 8,
    right: 8,
    backgroundColor: 'rgba(0,255,0,0.8)',
    borderRadius: 12,
    width: 24,
    height: 24,
    alignItems: 'center',
    justifyContent: 'center',
  },
  paramsCard: {
    padding: spacing.md,
    marginBottom: spacing.md,
  },
  paramSection: {
    marginBottom: spacing.md,
  },
  paramHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: spacing.sm,
  },
  paramLabel: {
    color: palette.text,
    fontSize: 14,
    flex: 1,
    marginLeft: spacing.sm,
  },
  paramValue: {
    color: palette.tint,
    fontSize: 14,
    fontWeight: '600',
  },
  slider: {
    height: 40,
  },
  colorSection: {
    marginBottom: spacing.md,
  },
  colorTitle: {
    color: palette.text,
    fontSize: 14,
    fontWeight: '600',
    marginBottom: spacing.sm,
  },
  colorPresets: {
    flexDirection: 'row',
  },
  colorPreset: {
    width: 40,
    height: 40,
    borderRadius: 20,
    marginRight: spacing.sm,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 2,
    borderColor: palette.muted,
  },
  colorPresetActive: {
    borderColor: palette.text,
    borderWidth: 3,
  },
});