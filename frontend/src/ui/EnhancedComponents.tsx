/**
 * Enhanced UI Components for better user experience
 * Improved visuals, animations, and user feedback
 */

import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Animated, ViewStyle, TextStyle } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { palette, spacing, radius } from './theme';

// Enhanced Card with better shadows and gradients
interface EnhancedCardProps {
  children: React.ReactNode;
  style?: ViewStyle;
  gradient?: boolean;
  elevated?: boolean;
}

export const EnhancedCard: React.FC<EnhancedCardProps> = ({ 
  children, 
  style, 
  gradient = false, 
  elevated = true 
}) => {
  return (
    <View style={[
      styles.enhancedCard,
      elevated && styles.elevatedCard,
      gradient && styles.gradientCard,
      style
    ]}>
      {children}
    </View>
  );
};

// Status Badge with better visual feedback
interface StatusBadgeProps {
  status: 'connected' | 'disconnected' | 'scanning' | 'error';
  label: string;
  animated?: boolean;
}

export const StatusBadge: React.FC<StatusBadgeProps> = ({ 
  status, 
  label, 
  animated = true 
}) => {
  const getBadgeStyle = () => {
    switch (status) {
      case 'connected':
        return { backgroundColor: '#34C759', color: '#FFFFFF' };
      case 'scanning':
        return { backgroundColor: '#FF9500', color: '#FFFFFF' };
      case 'error':
        return { backgroundColor: '#FF3B30', color: '#FFFFFF' };
      default:
        return { backgroundColor: palette.muted, color: palette.text };
    }
  };

  const badgeStyle = getBadgeStyle();

  return (
    <View style={[styles.statusBadge, { backgroundColor: badgeStyle.backgroundColor }]}>
      <View style={styles.statusIndicator}>
        <Ionicons 
          name={
            status === 'connected' ? 'checkmark-circle' :
            status === 'scanning' ? 'refresh' :
            status === 'error' ? 'alert-circle' : 'radio-button-off'
          } 
          size={12} 
          color={badgeStyle.color} 
        />
      </View>
      <Text style={[styles.statusBadgeText, { color: badgeStyle.color }]}>
        {label}
      </Text>
    </View>
  );
};

// Enhanced Button with better feedback
interface EnhancedButtonProps {
  title: string;
  onPress: () => void;
  variant?: 'primary' | 'secondary' | 'outline' | 'ghost';
  size?: 'small' | 'medium' | 'large';
  icon?: string;
  disabled?: boolean;
  loading?: boolean;
  fullWidth?: boolean;
}

export const EnhancedButton: React.FC<EnhancedButtonProps> = ({
  title,
  onPress,
  variant = 'primary',
  size = 'medium',
  icon,
  disabled = false,
  loading = false,
  fullWidth = false
}) => {
  const getButtonStyle = () => {
    const base = styles.enhancedButton;
    const sizeStyle = styles[`button${size.charAt(0).toUpperCase() + size.slice(1)}` as keyof typeof styles];
    const variantStyle = styles[`button${variant.charAt(0).toUpperCase() + variant.slice(1)}` as keyof typeof styles];
    
    return [
      base,
      sizeStyle,
      variantStyle,
      disabled && styles.buttonDisabled,
      fullWidth && styles.buttonFullWidth
    ];
  };

  const getTextStyle = () => {
    const variantTextStyle = styles[`button${variant.charAt(0).toUpperCase() + variant.slice(1)}Text` as keyof typeof styles];
    return [
      styles.enhancedButtonText,
      variantTextStyle,
      disabled && styles.buttonDisabledText
    ];
  };

  return (
    <TouchableOpacity
      style={getButtonStyle()}
      onPress={onPress}
      disabled={disabled || loading}
      activeOpacity={0.8}
    >
      {icon && !loading && (
        <Ionicons 
          name={icon as any} 
          size={size === 'small' ? 16 : size === 'large' ? 24 : 20} 
          color={variant === 'primary' ? '#FFFFFF' : palette.tint}
          style={styles.buttonIcon}
        />
      )}
      
      {loading && (
        <Ionicons 
          name="refresh" 
          size={size === 'small' ? 16 : size === 'large' ? 24 : 20} 
          color={variant === 'primary' ? '#FFFFFF' : palette.tint}
          style={[styles.buttonIcon, styles.spinning]}
        />
      )}
      
      <Text style={getTextStyle()}>
        {loading ? 'Loading...' : title}
      </Text>
    </TouchableOpacity>
  );
};

// Progress Bar with smooth animations
interface ProgressBarProps {
  progress: number; // 0-100
  color?: string;
  backgroundColor?: string;
  height?: number;
  animated?: boolean;
  showLabel?: boolean;
}

export const ProgressBar: React.FC<ProgressBarProps> = ({
  progress,
  color = palette.tint,
  backgroundColor = palette.muted,
  height = 8,
  animated = true,
  showLabel = false
}) => {
  return (
    <View style={styles.progressContainer}>
      <View style={[
        styles.progressTrack,
        { backgroundColor, height, borderRadius: height / 2 }
      ]}>
        <View style={[
          styles.progressFill,
          { 
            backgroundColor: color, 
            width: `${Math.min(100, Math.max(0, progress))}%`,
            height: height,
            borderRadius: height / 2
          }
        ]} />
      </View>
      {showLabel && (
        <Text style={styles.progressLabel}>
          {Math.round(progress)}%
        </Text>
      )}
    </View>
  );
};

// Enhanced Section Header
interface SectionHeaderProps {
  title: string;
  subtitle?: string;
  icon?: string;
  action?: {
    title: string;
    onPress: () => void;
    icon?: string;
  };
}

export const SectionHeader: React.FC<SectionHeaderProps> = ({
  title,
  subtitle,
  icon,
  action
}) => {
  return (
    <View style={styles.sectionHeader}>
      <View style={styles.sectionHeaderContent}>
        {icon && (
          <View style={styles.sectionIconContainer}>
            <Ionicons name={icon as any} size={24} color={palette.tint} />
          </View>
        )}
        <View style={styles.sectionTextContainer}>
          <Text style={styles.sectionTitle}>{title}</Text>
          {subtitle && (
            <Text style={styles.sectionSubtitle}>{subtitle}</Text>
          )}
        </View>
      </View>
      
      {action && (
        <TouchableOpacity
          style={styles.sectionAction}
          onPress={action.onPress}
          activeOpacity={0.7}
        >
          {action.icon && (
            <Ionicons 
              name={action.icon as any} 
              size={16} 
              color={palette.tint}
              style={styles.actionIcon}
            />
          )}
          <Text style={styles.sectionActionText}>
            {action.title}
          </Text>
        </TouchableOpacity>
      )}
    </View>
  );
};

// Enhanced Empty State
interface EmptyStateProps {
  icon: string;
  title: string;
  description: string;
  action?: {
    title: string;
    onPress: () => void;
  };
}

export const EnhancedEmptyState: React.FC<EmptyStateProps> = ({
  icon,
  title,
  description,
  action
}) => {
  return (
    <View style={styles.emptyState}>
      <View style={styles.emptyIconContainer}>
        <Ionicons name={icon as any} size={64} color={palette.muted} />
      </View>
      <Text style={styles.emptyTitle}>{title}</Text>
      <Text style={styles.emptyDescription}>{description}</Text>
      
      {action && (
        <EnhancedButton
          title={action.title}
          onPress={action.onPress}
          variant="outline"
          size="medium"
        />
      )}
    </View>
  );
};

// Device Status Indicator
interface DeviceStatusProps {
  name: string;
  status: 'connected' | 'connecting' | 'disconnected';
  signalStrength?: number;
  batteryLevel?: number;
}

export const DeviceStatus: React.FC<DeviceStatusProps> = ({
  name,
  status,
  signalStrength,
  batteryLevel
}) => {
  return (
    <View style={styles.deviceStatus}>
      <View style={styles.deviceInfo}>
        <Text style={styles.deviceName}>{name}</Text>
        <View style={styles.deviceMetrics}>
          <StatusBadge status={status} label={status} />
          
          {signalStrength !== undefined && (
            <View style={styles.signalIndicator}>
              <Ionicons 
                name="wifi" 
                size={12} 
                color={signalStrength > -60 ? '#34C759' : signalStrength > -80 ? '#FF9500' : '#FF3B30'} 
              />
              <Text style={styles.signalText}>{signalStrength}dBm</Text>
            </View>
          )}
          
          {batteryLevel !== undefined && (
            <View style={styles.batteryIndicator}>
              <Ionicons 
                name={batteryLevel > 20 ? "battery-full" : "battery-dead"} 
                size={12} 
                color={batteryLevel > 20 ? '#34C759' : '#FF3B30'} 
              />
              <Text style={styles.batteryText}>{batteryLevel}%</Text>
            </View>
          )}
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  enhancedCard: {
    backgroundColor: palette.card,
    borderRadius: radius.lg,
    padding: spacing.lg,
    marginBottom: spacing.md,
  },
  elevatedCard: {
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.15,
    shadowRadius: 12,
    elevation: 8,
  },
  gradientCard: {
    borderWidth: 1,
    borderColor: 'rgba(0,212,255,0.3)',
    backgroundColor: 'rgba(0,26,46,0.8)',
  },
  statusBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: spacing.sm,
    paddingVertical: spacing.xs,
    borderRadius: radius.full,
    gap: spacing.xs,
  },
  statusIndicator: {
    width: 16,
    height: 16,
    alignItems: 'center',
    justifyContent: 'center',
  },
  statusBadgeText: {
    fontSize: 11,
    fontWeight: '600',
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  enhancedButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: radius.md,
    paddingHorizontal: spacing.lg,
    gap: spacing.sm,
  },
  buttonSmall: {
    paddingVertical: spacing.xs,
    paddingHorizontal: spacing.md,
  },
  buttonMedium: {
    paddingVertical: spacing.sm,
    paddingHorizontal: spacing.lg,
  },
  buttonLarge: {
    paddingVertical: spacing.md,
    paddingHorizontal: spacing.xl,
  },
  buttonPrimary: {
    backgroundColor: palette.tint,
  },
  buttonSecondary: {
    backgroundColor: 'rgba(122,140,160,0.2)',
  },
  buttonOutline: {
    backgroundColor: 'transparent',
    borderWidth: 1,
    borderColor: palette.tint,
  },
  buttonGhost: {
    backgroundColor: 'transparent',
  },
  buttonDisabled: {
    opacity: 0.5,
  },
  buttonFullWidth: {
    width: '100%',
  },
  enhancedButtonText: {
    fontSize: 14,
    fontWeight: '600',
  },
  buttonPrimaryText: {
    color: '#FFFFFF',
  },
  buttonSecondaryText: {
    color: palette.text,
  },
  buttonOutlineText: {
    color: palette.tint,
  },
  buttonGhostText: {
    color: palette.text,
  },
  buttonDisabledText: {
    opacity: 0.5,
  },
  buttonIcon: {
    marginRight: -4,
  },
  spinning: {
    // Animation would be added here in a real implementation
  },
  progressContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm,
  },
  progressTrack: {
    flex: 1,
    overflow: 'hidden',
  },
  progressFill: {
    // Smooth animation would be added here
  },
  progressLabel: {
    color: palette.text,
    fontSize: 12,
    fontWeight: '600',
    minWidth: 35,
    textAlign: 'right',
  },
  sectionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: spacing.lg,
  },
  sectionHeaderContent: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  sectionIconContainer: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: 'rgba(0,212,255,0.2)',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: spacing.md,
  },
  sectionTextContainer: {
    flex: 1,
  },
  sectionTitle: {
    color: palette.text,
    fontSize: 18,
    fontWeight: '700',
    marginBottom: 2,
  },
  sectionSubtitle: {
    color: palette.muted,
    fontSize: 14,
  },
  sectionAction: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: spacing.xs,
    paddingHorizontal: spacing.sm,
    borderRadius: radius.sm,
    backgroundColor: 'rgba(0,212,255,0.1)',
    gap: spacing.xs,
  },
  actionIcon: {
    marginRight: -2,
  },
  sectionActionText: {
    color: palette.tint,
    fontSize: 12,
    fontWeight: '600',
  },
  emptyState: {
    alignItems: 'center',
    paddingVertical: spacing.xl * 2,
    paddingHorizontal: spacing.lg,
  },
  emptyIconContainer: {
    width: 120,
    height: 120,
    borderRadius: 60,
    backgroundColor: 'rgba(122,140,160,0.1)',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: spacing.lg,
  },
  emptyTitle: {
    color: palette.text,
    fontSize: 20,
    fontWeight: '700',
    marginBottom: spacing.sm,
    textAlign: 'center',
  },
  emptyDescription: {
    color: palette.muted,
    fontSize: 16,
    lineHeight: 24,
    textAlign: 'center',
    marginBottom: spacing.xl,
    maxWidth: 280,
  },
  deviceStatus: {
    backgroundColor: 'rgba(122,140,160,0.1)',
    borderRadius: radius.md,
    padding: spacing.md,
  },
  deviceInfo: {
    flex: 1,
  },
  deviceName: {
    color: palette.text,
    fontSize: 16,
    fontWeight: '600',
    marginBottom: spacing.sm,
  },
  deviceMetrics: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.md,
  },
  signalIndicator: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.xs,
  },
  signalText: {
    color: palette.muted,
    fontSize: 11,
    fontWeight: '500',
  },
  batteryIndicator: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.xs,
  },
  batteryText: {
    color: palette.muted,
    fontSize: 11,
    fontWeight: '500',
  },
});