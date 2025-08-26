import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Image } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import { palette, spacing, radius, gradients } from './theme';
import { AnimationItem } from '../data/animationsLibrary';

interface AnimationCardProps {
  animation: AnimationItem;
  onPress: () => void;
  onToggleLike: () => void;
  onDownload: () => void;
}

export const AnimationCard: React.FC<AnimationCardProps> = ({ 
  animation, 
  onPress, 
  onToggleLike, 
  onDownload 
}) => {
  return (
    <TouchableOpacity style={styles.container} onPress={onPress} activeOpacity={0.8}>
      <LinearGradient colors={gradients.card} style={styles.card}>
        {/* Preview Image */}
        <View style={styles.previewContainer}>
          <View style={styles.preview}>
            <Text style={styles.previewText}>{animation.name}</Text>
            
            {/* Preview Overlay Gradient */}
            <LinearGradient 
              colors={['transparent', 'rgba(0,0,0,0.8)']} 
              style={styles.previewOverlay} 
            />
          </View>
          
          {/* Type Badge */}
          <View style={[styles.typeBadge, { backgroundColor: getTypeColor(animation.type) }]}>
            <Text style={styles.typeBadgeText}>
              {animation.type.toUpperCase()}
            </Text>
          </View>

          {/* New/Trending Badges */}
          {animation.isNew && (
            <View style={[styles.statusBadge, styles.newBadge]}>
              <Ionicons name="sparkles" size={12} color="#fff" />
              <Text style={styles.statusBadgeText}>NY</Text>
            </View>
          )}
          
          {animation.isTrending && (
            <View style={[styles.statusBadge, styles.trendingBadge]}>
              <Ionicons name="trending-up" size={12} color="#fff" />
              <Text style={styles.statusBadgeText}>TREND</Text>
            </View>
          )}
        </View>

        {/* Content */}
        <View style={styles.content}>
          <Text style={styles.title} numberOfLines={1}>
            {animation.name}
          </Text>
          
          <View style={styles.footer}>
            {/* Stats */}
            <View style={styles.stats}>
              <View style={styles.stat}>
                <Ionicons name="heart" size={14} color={palette.accent} />
                <Text style={styles.statText}>
                  {animation.likes > 1000 ? `${(animation.likes/1000).toFixed(1)}k` : animation.likes}
                </Text>
              </View>
              
              {animation.downloaded && (
                <View style={styles.downloadedBadge}>
                  <Ionicons name="checkmark-circle" size={14} color={palette.success} />
                  <Text style={styles.downloadedText}>Hentet</Text>
                </View>
              )}
            </View>

            {/* Actions */}
            <View style={styles.actions}>
              <TouchableOpacity 
                style={styles.actionButton} 
                onPress={onToggleLike}
                activeOpacity={0.7}
              >
                <Ionicons 
                  name="heart-outline" 
                  size={18} 
                  color={palette.muted} 
                />
              </TouchableOpacity>
              
              <TouchableOpacity 
                style={[styles.actionButton, styles.downloadButton]} 
                onPress={onDownload}
                activeOpacity={0.7}
              >
                <Ionicons 
                  name="download-outline" 
                  size={18} 
                  color={palette.tint} 
                />
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </LinearGradient>
    </TouchableOpacity>
  );
};

const getTypeColor = (type: string) => {
  switch (type) {
    case 'color': return palette.tint;
    case 'pattern': return palette.success;
    case 'scroll': return palette.purple;
    case 'simple': return palette.orange;
    default: return palette.muted;
  }
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    margin: spacing.xs,
  },
  card: {
    borderRadius: radius.lg,
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.25,
    shadowRadius: 6,
    elevation: 6,
  },
  previewContainer: {
    height: 130,
    position: 'relative',
  },
  preview: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.9)',
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: radius.md,
    margin: spacing.xs,
    position: 'relative',
    overflow: 'hidden',
  },
  previewText: {
    color: palette.text,
    fontSize: 16,
    fontWeight: '600',
    textAlign: 'center',
    zIndex: 2,
  },
  previewOverlay: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    height: 40,
  },
  typeBadge: {
    position: 'absolute',
    top: spacing.xs,
    right: spacing.xs,
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: radius.sm,
  },
  typeBadgeText: {
    color: '#000',
    fontSize: 10,
    fontWeight: '700',
  },
  statusBadge: {
    position: 'absolute',
    top: spacing.xs,
    left: spacing.xs,
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: radius.sm,
    gap: 2,
  },
  newBadge: {
    backgroundColor: palette.success,
  },
  trendingBadge: {
    backgroundColor: palette.accent,
  },
  statusBadgeText: {
    color: '#fff',
    fontSize: 8,
    fontWeight: '700',
  },
  content: {
    padding: spacing.sm,
  },
  title: {
    color: palette.text,
    fontSize: 14,
    fontWeight: '600',
    marginBottom: spacing.xs,
  },
  footer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  stats: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.xs,
  },
  stat: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  statText: {
    color: palette.muted,
    fontSize: 12,
    fontWeight: '500',
  },
  downloadedBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 2,
  },
  downloadedText: {
    color: palette.success,
    fontSize: 10,
    fontWeight: '600',
  },
  actions: {
    flexDirection: 'row',
    gap: spacing.xs,
  },
  actionButton: {
    padding: 4,
  },
  downloadButton: {
    backgroundColor: 'rgba(0,212,255,0.1)',
    borderRadius: radius.sm,
    padding: 6,
  },
});