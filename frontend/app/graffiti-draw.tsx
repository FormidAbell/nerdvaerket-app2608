/**
 * Graffiti & Draw Mode - LOY PLAY style drawing canvas
 */

import React, { useState, useRef } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Dimensions } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import Svg, { Path, Circle } from 'react-native-svg';
import { palette, gradients, spacing } from '../src/ui/theme';

const { width: screenWidth, height: screenHeight } = Dimensions.get('window');
const canvasWidth = screenWidth - (spacing.lg * 2);
const canvasHeight = 300;

interface DrawPath {
  path: string;
  color: string;
  width: number;
}

export default function GraffitiDraw() {
  const [paths, setPaths] = useState<DrawPath[]>([]);
  const [currentPath, setCurrentPath] = useState<string>('');
  const [currentColor, setCurrentColor] = useState('#00d4ff');
  const [brushSize, setBrushSize] = useState(5);
  const [isDrawing, setIsDrawing] = useState(false);

  const colors = [
    '#ff0000', '#00ff00', '#0000ff', '#ffff00', '#ff00ff', '#00ffff',
    '#ff8000', '#8000ff', '#ff0080', '#80ff00', '#0080ff', '#ffffff',
    '#000000', '#808080', '#ff6b6b', '#4ecdc4', '#45b7d1', '#96ceb4'
  ];

  const brushSizes = [2, 5, 10, 15, 20];

  const clearCanvas = () => {
    setPaths([]);
    setCurrentPath('');
  };

  const undoLast = () => {
    setPaths(prev => prev.slice(0, -1));
  };

  const sendToDevice = () => {
    // Convert drawing to LED matrix data
    console.log('Sending drawing to LED device...');
    // Implementation would convert SVG paths to LED matrix
  };

  return (
    <LinearGradient colors={gradients.primary} style={styles.container}>
      <SafeAreaView style={styles.safeArea}>
        
        {/* Header */}
        <View style={styles.header}>
          <TouchableOpacity style={styles.backButton}>
            <Ionicons name="arrow-back" size={24} color={palette.text} />
          </TouchableOpacity>
          <View style={styles.headerContent}>
            <Text style={styles.title}>Graffiti & Draw</Text>
            <Text style={styles.subtitle}>Tegn dit design til LED skærmen</Text>
          </View>
        </View>

        {/* Drawing Canvas */}
        <View style={styles.canvasContainer}>
          <View style={styles.canvasFrame}>
            <View style={styles.canvas}>
              <Svg width={canvasWidth} height={canvasHeight} style={styles.svg}>
                {/* Render completed paths */}
                {paths.map((pathData, index) => (
                  <Path
                    key={index}
                    d={pathData.path}
                    stroke={pathData.color}
                    strokeWidth={pathData.width}
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    fill="none"
                  />
                ))}
                
                {/* Render current drawing path */}
                {currentPath && (
                  <Path
                    d={currentPath}
                    stroke={currentColor}
                    strokeWidth={brushSize}
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    fill="none"
                  />
                )}
              </Svg>
              
              {/* Grid overlay to show LED pixels */}
              <View style={styles.gridOverlay}>
                {Array.from({ length: 32 }, (_, i) => (
                  <View key={i} style={styles.gridLine} />
                ))}
                {Array.from({ length: 32 }, (_, i) => (
                  <View key={`v${i}`} style={styles.gridLineVertical} />
                ))}
              </View>
            </View>
            
            <Text style={styles.canvasInfo}>32x32 LED Matrix Preview (Touch drawing disabled for web)</Text>
          </View>
        </View>

        {/* Color Palette */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Colors</Text>
          <View style={styles.colorPalette}>
            {colors.map((color, index) => (
              <TouchableOpacity
                key={index}
                style={[
                  styles.colorButton,
                  { backgroundColor: color },
                  currentColor === color && styles.colorButtonSelected
                ]}
                onPress={() => setCurrentColor(color)}
              >
                {currentColor === color && (
                  <Ionicons name="checkmark" size={16} color="#fff" />
                )}
              </TouchableOpacity>
            ))}
          </View>
        </View>

        {/* Brush Size */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Brush Size</Text>
          <View style={styles.brushSizes}>
            {brushSizes.map((size, index) => (
              <TouchableOpacity
                key={index}
                style={[
                  styles.brushButton,
                  brushSize === size && styles.brushButtonSelected
                ]}
                onPress={() => setBrushSize(size)}
              >
                <View 
                  style={[
                    styles.brushPreview,
                    { 
                      width: Math.min(size * 2, 30), 
                      height: Math.min(size * 2, 30),
                      backgroundColor: currentColor 
                    }
                  ]} 
                />
                <Text style={styles.brushSizeText}>{size}px</Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>

        {/* Tools */}
        <View style={styles.toolsContainer}>
          <TouchableOpacity style={styles.toolButton} onPress={undoLast}>
            <Ionicons name="arrow-undo" size={24} color={palette.text} />
            <Text style={styles.toolButtonText}>Undo</Text>
          </TouchableOpacity>

          <TouchableOpacity style={styles.toolButton} onPress={clearCanvas}>
            <Ionicons name="trash" size={24} color={palette.error} />
            <Text style={[styles.toolButtonText, { color: palette.error }]}>Clear</Text>
          </TouchableOpacity>

          <TouchableOpacity style={styles.sendButton} onPress={sendToDevice}>
            <Ionicons name="send" size={24} color="#001a2e" />
            <Text style={styles.sendButtonText}>Send to LED</Text>
          </TouchableOpacity>
        </View>

        {/* Templates */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Quick Templates</Text>
          <View style={styles.templates}>
            <TouchableOpacity style={styles.templateButton}>
              <Ionicons name="heart" size={24} color={palette.error} />
              <Text style={styles.templateText}>Heart</Text>
            </TouchableOpacity>

            <TouchableOpacity style={styles.templateButton}>
              <Ionicons name="star" size={24} color={palette.warning} />
              <Text style={styles.templateText}>Star</Text>
            </TouchableOpacity>

            <TouchableOpacity style={styles.templateButton}>
              <Ionicons name="happy" size={24} color={palette.success} />
              <Text style={styles.templateText}>Smiley</Text>
            </TouchableOpacity>

            <TouchableOpacity style={styles.templateButton}>
              <Ionicons name="flash" size={24} color={palette.tint} />
              <Text style={styles.templateText}>Lightning</Text>
            </TouchableOpacity>
          </View>
        </View>

      </SafeAreaView>
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  safeArea: { flex: 1, paddingHorizontal: spacing.md },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: spacing.md,
  },
  backButton: {
    marginRight: spacing.md,
  },
  headerContent: {
    flex: 1,
  },
  title: {
    fontSize: 24,
    fontWeight: '800',
    color: palette.text,
  },
  subtitle: {
    fontSize: 14,
    color: palette.textSecondary,
  },
  canvasContainer: {
    alignItems: 'center',
    marginBottom: spacing.lg,
  },
  canvasFrame: {
    backgroundColor: 'rgba(26,35,50,0.8)',
    borderRadius: 12,
    padding: spacing.md,
    alignItems: 'center',
  },
  canvas: {
    width: canvasWidth,
    height: canvasHeight,
    backgroundColor: '#000',
    borderRadius: 8,
    position: 'relative',
  },
  svg: {
    position: 'absolute',
    top: 0,
    left: 0,
  },
  gridOverlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    flexDirection: 'row',
    opacity: 0.2,
  },
  gridLine: {
    position: 'absolute',
    left: 0,
    right: 0,
    height: 1,
    backgroundColor: palette.muted,
  },
  gridLineVertical: {
    position: 'absolute',
    top: 0,
    bottom: 0,
    width: 1,
    backgroundColor: palette.muted,
  },
  canvasInfo: {
    fontSize: 12,
    color: palette.textSecondary,
    marginTop: spacing.sm,
  },
  section: {
    marginBottom: spacing.lg,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: palette.text,
    marginBottom: spacing.sm,
  },
  colorPalette: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
  colorButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    marginBottom: spacing.sm,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 2,
    borderColor: 'transparent',
  },
  colorButtonSelected: {
    borderColor: palette.text,
  },
  brushSizes: {
    flexDirection: 'row',
    justifyContent: 'space-around',
  },
  brushButton: {
    alignItems: 'center',
    padding: spacing.sm,
    borderRadius: 8,
    backgroundColor: 'rgba(255,255,255,0.1)',
  },
  brushButtonSelected: {
    backgroundColor: 'rgba(0,212,255,0.3)',
  },
  brushPreview: {
    borderRadius: 15,
    marginBottom: spacing.xs,
  },
  brushSizeText: {
    fontSize: 12,
    color: palette.text,
  },
  toolsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginBottom: spacing.lg,
  },
  toolButton: {
    alignItems: 'center',
    padding: spacing.md,
  },
  toolButtonText: {
    fontSize: 12,
    color: palette.text,
    marginTop: spacing.xs,
  },
  sendButton: {
    backgroundColor: palette.tint,
    paddingHorizontal: spacing.lg,
    paddingVertical: spacing.md,
    borderRadius: 12,
    alignItems: 'center',
    flexDirection: 'row',
  },
  sendButtonText: {
    color: '#001a2e',
    fontSize: 16,
    fontWeight: '600',
    marginLeft: spacing.sm,
  },
  templates: {
    flexDirection: 'row',
    justifyContent: 'space-around',
  },
  templateButton: {
    alignItems: 'center',
    backgroundColor: 'rgba(255,255,255,0.1)',
    paddingVertical: spacing.md,
    paddingHorizontal: spacing.sm,
    borderRadius: 12,
    minWidth: 70,
  },
  templateText: {
    fontSize: 12,
    color: palette.text,
    marginTop: spacing.xs,
  },
});