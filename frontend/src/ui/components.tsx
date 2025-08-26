import React from 'react';
import { View, Text, TouchableOpacity, TextInput, StyleSheet, Platform } from 'react-native';
import { BlurView } from 'expo-blur';
import { LinearGradient } from 'expo-linear-gradient';
import Animated, { 
  useSharedValue, 
  useAnimatedStyle, 
  withSpring, 
  withTiming,
  interpolate,
  runOnJS
} from 'react-native-reanimated';
import { palette, radius, spacing, gradients, typography } from './theme';
import { Ionicons } from '@expo/vector-icons';

export const ThemedBackground: React.FC<{ children: React.ReactNode }> = ({ children }) => (
  <LinearGradient colors={gradients.primary} start={{x:0,y:0}} end={{x:1,y:1}} style={{ flex: 1 }}>
    {children}
  </LinearGradient>
);

export const Card: React.FC<{ children: React.ReactNode; style?: any; gradient?: boolean }> = ({ children, style, gradient = true }) => {
  if (gradient) {
    return Platform.OS === 'web' ? (
      <LinearGradient colors={gradients.card} style={[styles.card, style]}>
        {children}
      </LinearGradient>
    ) : (
      <LinearGradient colors={gradients.card} style={[styles.card, style]}>
        <BlurView intensity={15} tint="dark" style={{ borderRadius: radius.lg, overflow: 'hidden' }}>
          {children}
        </BlurView>
      </LinearGradient>
    );
  } else {
    return Platform.OS === 'web' ? (
      <View style={[styles.card, style]}>{children}</View>
    ) : (
      <BlurView intensity={20} tint="dark" style={[styles.card, style]}>{children}</BlurView>
    );
  }
};

export const PrimaryButton: React.FC<{ title: string; onPress: () => void; icon?: keyof typeof Ionicons.glyphMap; gradient?: boolean }>
= ({ title, onPress, icon, gradient = true }) => {
  const scale = useSharedValue(1);
  const opacity = useSharedValue(1);

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{ scale: scale.value }],
    opacity: opacity.value,
  }));

  const handlePressIn = () => {
    scale.value = withSpring(0.95, { damping: 15, stiffness: 300 });
    opacity.value = withTiming(0.8, { duration: 100 });
  };

  const handlePressOut = () => {
    scale.value = withSpring(1, { damping: 15, stiffness: 300 });
    opacity.value = withTiming(1, { duration: 100 });
  };

  const handlePress = () => {
    runOnJS(onPress)();
  };

  return (
    <TouchableOpacity 
      onPressIn={handlePressIn}
      onPressOut={handlePressOut}
      onPress={handlePress}
      activeOpacity={1}
    >
      <Animated.View style={animatedStyle}>
        {gradient ? (
          <LinearGradient colors={gradients.accent} style={styles.primaryBtn} start={{x:0,y:0}} end={{x:1,y:0}}>
            {icon ? <Ionicons name={icon} color="#001a2e" size={18} style={{ marginRight: 8 }} /> : null}
            <Text style={styles.primaryText}>{title}</Text>
          </LinearGradient>
        ) : (
          <View style={[styles.primaryBtn, { backgroundColor: palette.tint }]}>
            {icon ? <Ionicons name={icon} color="#001a2e" size={18} style={{ marginRight: 8 }} /> : null}
            <Text style={styles.primaryText}>{title}</Text>
          </View>
        )}
      </Animated.View>
    </TouchableOpacity>
  );
};

export const SecondaryButton: React.FC<{ title: string; onPress: () => void; icon?: keyof typeof Ionicons.glyphMap }>
 = ({ title, onPress, icon }) => (
  <TouchableOpacity style={styles.secondaryBtn} onPress={onPress} activeOpacity={0.7}>
    {icon ? <Ionicons name={icon} color={palette.text} size={18} style={{ marginRight: 8 }} /> : null}
    <Text style={styles.secondaryText}>{title}</Text>
  </TouchableOpacity>
);

// Standardized Input Field Component
export const InputField: React.FC<{
  value: string;
  onChangeText: (text: string) => void;
  placeholder?: string;
  keyboardType?: 'default' | 'numeric' | 'email-address';
  icon?: keyof typeof Ionicons.glyphMap;
  error?: string;
  clearable?: boolean;
  style?: any;
}> = ({ 
  value, 
  onChangeText, 
  placeholder, 
  keyboardType = 'default', 
  icon,
  error,
  clearable = false,
  style 
}) => {
  const clearInput = () => {
    onChangeText('');
  };

  return (
    <View style={style}>
      <Card style={[styles.inputCard, error && styles.inputCardError]}>
        <View style={styles.inputContainer}>
          {icon && <Ionicons name={icon} size={20} color={palette.muted} />}
          <TextInput
            style={styles.input}
            value={value}
            onChangeText={onChangeText}
            placeholder={placeholder}
            placeholderTextColor={palette.muted}
            keyboardType={keyboardType}
          />
          {clearable && value.length > 0 && (
            <TouchableOpacity onPress={clearInput} activeOpacity={0.7}>
              <Ionicons name="close-circle" size={20} color={palette.muted} />
            </TouchableOpacity>
          )}
        </View>
        {error && (
          <View style={styles.errorContainer}>
            <Ionicons name="alert-circle" size={14} color={palette.error} />
            <Text style={styles.errorText}>{error}</Text>
          </View>
        )}
      </Card>
    </View>
  );
};

export const Tile: React.FC<{ title: string; subtitle?: string; onPress: () => void; icon: keyof typeof Ionicons.glyphMap; accent?: boolean }>
= ({ title, subtitle, onPress, icon, accent = false }) => {
  const scale = useSharedValue(1);
  const rotate = useSharedValue(0);

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [
      { scale: scale.value },
      { rotateY: `${rotate.value}deg` }
    ],
  }));

  const handlePressIn = () => {
    scale.value = withSpring(0.98, { damping: 20, stiffness: 400 });
    rotate.value = withTiming(2, { duration: 150 });
  };

  const handlePressOut = () => {
    scale.value = withSpring(1, { damping: 20, stiffness: 400 });
    rotate.value = withTiming(0, { duration: 150 });
  };

  const handlePress = () => {
    runOnJS(onPress)();
  };

  return (
    <TouchableOpacity 
      onPressIn={handlePressIn}
      onPressOut={handlePressOut}
      onPress={handlePress}
      activeOpacity={1}
    >
      <Animated.View style={animatedStyle}>
        <Card style={[styles.tile, accent && styles.tileAccent]}>
          <LinearGradient 
            colors={accent ? gradients.accent : gradients.secondary} 
            start={{x:0,y:0}} 
            end={{x:1,y:1}}
            style={styles.tileGradient}
          >
            <View style={styles.tileContent}>
              <View style={[styles.tileIcon, accent && styles.tileIconAccent]}>
                <Ionicons name={icon} size={24} color={accent ? '#001a2e' : palette.tint} />
              </View>
              <View style={{ flex: 1 }}>
                <Text style={[styles.tileTitle, accent && styles.tileTitleAccent]}>{title}</Text>
                {subtitle ? <Text style={[styles.tileSubtitle, accent && styles.tileSubtitleAccent]}>{subtitle}</Text> : null}
              </View>
              <Ionicons name="chevron-forward" size={20} color={accent ? 'rgba(0,26,46,0.6)' : palette.muted} />
            </View>
          </LinearGradient>
        </Card>
      </Animated.View>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  card: { 
    borderRadius: radius.lg, 
    padding: spacing.md, 
    marginBottom: spacing.md,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 8,
  },
  primaryBtn: { 
    paddingVertical: 16, 
    paddingHorizontal: 20, 
    borderRadius: radius.lg, 
    flexDirection: 'row', 
    alignItems: 'center', 
    justifyContent: 'center',
    shadowColor: palette.tint,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 6,
  },
  primaryText: { 
    color: '#001a2e', 
    ...typography.button
  },
  secondaryBtn: { 
    backgroundColor: palette.cardHover, 
    paddingVertical: 14, 
    paddingHorizontal: 18, 
    borderRadius: radius.md, 
    flexDirection: 'row', 
    alignItems: 'center', 
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.1)',
  },
  secondaryText: { 
    color: palette.text, 
    ...typography.buttonSmall
  },
  tile: { 
    borderRadius: radius.lg,
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 4,
  },
  tileAccent: {
    shadowColor: palette.tint,
    shadowOpacity: 0.4,
  },
  tileGradient: {
    padding: spacing.md,
    borderRadius: radius.lg,
  },
  tileContent: { 
    flexDirection: 'row', 
    alignItems: 'center' 
  },
  tileIcon: { 
    backgroundColor: 'rgba(0,212,255,0.15)', 
    width: 48, 
    height: 48, 
    borderRadius: 14, 
    alignItems: 'center', 
    justifyContent: 'center', 
    marginRight: spacing.md,
    borderWidth: 1,
    borderColor: 'rgba(0,212,255,0.3)',
  },
  tileIconAccent: {
    backgroundColor: 'rgba(255,255,255,0.9)',
    borderColor: 'rgba(255,255,255,0.6)',
  },
  tileTitle: { 
    color: palette.text, 
    ...typography.title
  },
  tileTitleAccent: {
    color: '#001a2e',
  },
  tileSubtitle: { 
    color: palette.textSecondary, 
    ...typography.caption,
    marginTop: 2,
  },
  tileSubtitleAccent: {
    color: 'rgba(0,26,46,0.7)',
  },
  inputCard: {
    padding: 0,
    marginBottom: spacing.sm,
  },
  inputCardError: {
    borderWidth: 1,
    borderColor: palette.error,
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm,
    gap: spacing.sm,
  },
  input: {
    flex: 1,
    color: palette.text,
    ...typography.body,
    paddingVertical: spacing.xs,
  },
  errorContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: spacing.md,
    paddingBottom: spacing.sm,
    gap: spacing.xs,
  },
  errorText: {
    color: palette.error,
    ...typography.caption,
    fontSize: 12, // Override caption size for error text
  },
});