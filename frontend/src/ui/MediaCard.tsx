import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import { palette, spacing, radius, gradients } from './theme';
import { MediaItem } from '../data/mediaLibrary';

interface MediaCardProps {
  media: MediaItem;
  onPress: () => void;
  onToggleLike: () => void;
  onDownload: () => void;
}

export const MediaCard: React.FC<MediaCardProps> = ({ 
  media, 
  onPress, 
  onToggleLike, 
  onDownload 
}) => {
  return (
    <TouchableOpacity style={styles.container} onPress={onPress} activeOpacity={0.8}>
      <LinearGradient colors={gradients.card} style={styles.card}>
        {/* Preview */}
        <View style={styles.previewContainer}>
          <View style={styles.preview}>
            <Text style={styles.previewText}>{media.name}</Text>
            
            {/* Type indicator */}
            {media.type === 'gif' && (
              <View style={styles.gifIndicator}>
                <Ionicons name="play-circle" size={20} color={palette.tint} />
              </View>
            )}
            
            {/* Overlay gradient */}
            <LinearGradient 
              colors={['transparent', 'rgba(0,0,0,0.7)']} 
              style={styles.previewOverlay} 
            />
          </View>
          
          {/* Premium/New badges */}
          {media.isPremium && (
            <View style={[styles.statusBadge, styles.premiumBadge]}>
              <Ionicons name="diamond" size={10} color="#fff" />
              <Text style={styles.statusBadgeText}>PRO</Text>
            </View>
          )}
          
          {media.isNew && (
            <View style={[styles.statusBadge, styles.newBadge]}>
              <Ionicons name="sparkles" size={10} color="#fff" />
              <Text style={styles.statusBadgeText}>NY</Text>
            </View>
          )}

          {/* File info */}
          <View style={styles.fileInfo}>
            <Text style={styles.fileInfoText}>{media.dimensions}</Text>
          </View>
        </View>

        {/* Content */}
        <View style={styles.content}>
          <Text style={styles.title} numberOfLines={1}>
            {media.name}
          </Text>
          
          {/* Stats */}
          <View style={styles.stats}>
            <View style={styles.stat}>
              <Ionicons name="heart" size={12} color={palette.accent} />
              <Text style={styles.statText}>
                {media.likes > 1000 ? `${(media.likes/1000).toFixed(1)}k` : media.likes}
              </Text>
            </View>
            
            <View style={styles.stat}>
              <Ionicons name="download" size={12} color={palette.muted} />
              <Text style={styles.statText}>
                {media.downloads > 1000 ? `${(media.downloads/1000).toFixed(1)}k` : media.downloads}
              </Text>
            </View>
            
            {media.downloaded && (
              <View style={styles.downloadedIndicator}>
                <Ionicons name="checkmark-circle" size={12} color={palette.success} />
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
              <Ionicons name="heart-outline" size={16} color={palette.muted} />
            </TouchableOpacity>
            
            <TouchableOpacity 
              style={[styles.actionButton, styles.downloadButton]} 
              onPress={onDownload}
              activeOpacity={0.7}
            >
              <Ionicons name="download-outline" size={16} color={palette.tint} />
            </TouchableOpacity>
          </View>
        </View>
      </LinearGradient>
    </TouchableOpacity>
  );
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
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 4,
  },
  previewContainer: {
    height: 120,
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
    fontSize: 14,
    fontWeight: '600',
    textAlign: 'center',
    zIndex: 2,
  },
  previewOverlay: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    height: 30,
  },
  gifIndicator: {
    position: 'absolute',
    top: 8,
    right: 8,
  },
  statusBadge: {
    position: 'absolute',
    top: spacing.xs,
    left: spacing.xs,
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 4,
    paddingVertical: 2,
    borderRadius: radius.sm,
    gap: 2,
  },
  premiumBadge: {
    backgroundColor: palette.warning,
  },
  newBadge: {
    backgroundColor: palette.success,
  },
  statusBadgeText: {
    color: '#fff',
    fontSize: 8,
    fontWeight: '700',
  },
  fileInfo: {
    position: 'absolute',
    bottom: spacing.xs,
    right: spacing.xs,
    backgroundColor: 'rgba(0,0,0,0.6)',
    paddingHorizontal: 4,
    paddingVertical: 2,
    borderRadius: 4,
  },
  fileInfoText: {
    color: palette.text,
    fontSize: 8,
    fontWeight: '500',
  },
  content: {
    padding: spacing.sm,
  },
  title: {
    color: palette.text,
    fontSize: 13,
    fontWeight: '600',
    marginBottom: spacing.xs,
  },
  stats: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm,
    marginBottom: spacing.xs,
  },
  stat: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 2,
  },
  statText: {
    color: palette.muted,
    fontSize: 10,
    fontWeight: '500',
  },
  downloadedIndicator: {
    marginLeft: 'auto',
  },
  actions: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
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