import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, FlatList, TextInput, TouchableOpacity } from 'react-native';
import { ThemedBackground, Card } from '../src/ui/components';
import { MediaCard } from '../src/ui/MediaCard';
import { HeroSection } from '../src/ui/HeroSection';
import { palette, spacing, radius } from '../src/ui/theme';
import { Ionicons } from '@expo/vector-icons';
import { 
  mediaCategories, 
  mediaLibrary, 
  getMediaByCategory, 
  searchMedia,
  MediaItem 
} from '../src/data/mediaLibrary';
import * as Haptics from 'expo-haptics';

export default function MediaLibrary() {
  const [selectedCategory, setSelectedCategory] = useState('populaer');
  const [searchQuery, setSearchQuery] = useState('');
  const [media, setMedia] = useState<MediaItem[]>(
    getMediaByCategory('populaer')
  );

  const handleCategoryPress = (categoryId: string) => {
    setSelectedCategory(categoryId);
    setMedia(getMediaByCategory(categoryId));  
    setSearchQuery('');
    Haptics.selectionAsync();
  };

  const handleSearch = (query: string) => {
    setSearchQuery(query);
    if (query.trim()) {
      setMedia(searchMedia(query));
    } else {
      setMedia(getMediaByCategory(selectedCategory));
    }
  };

  const handleMediaPress = (mediaItem: MediaItem) => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    // TODO: Vis media detaljer eller start download
    console.log('Selected media:', mediaItem.name);
  };

  const handleToggleLike = (mediaId: string) => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    // TODO: Implementer like funktionalitet
    console.log('Toggle like for:', mediaId);
  };

  const handleDownload = (mediaItem: MediaItem) => {
    Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
    // TODO: Implementer download funktionalitet
    console.log('Download media:', mediaItem.name);
  };

  const renderMediaCard = ({ item }: { item: MediaItem }) => (
    <MediaCard
      media={item}
      onPress={() => handleMediaPress(item)}
      onToggleLike={() => handleToggleLike(item.id)}
      onDownload={() => handleDownload(item)}
    />
  );

  return (
    <ThemedBackground>
      <ScrollView style={styles.container}>
        {/* Hero Section */}
        <View style={styles.heroContainer}>
          <HeroSection
            title="Media Bibliotek"
            subtitle="Billeder, GIF'er og templates til din iDot-3"
            accent={true}
          />
        </View>

        {/* Search Bar */}
        <Card style={styles.searchCard}>
          <View style={styles.searchContainer}>
            <Ionicons name="search" size={20} color={palette.muted} />
            <TextInput
              style={styles.searchInput}
              placeholder="Søg billeder og templates..."
              placeholderTextColor={palette.muted}
              value={searchQuery}
              onChangeText={handleSearch}
            />
            {searchQuery.length > 0 && (
              <TouchableOpacity onPress={() => handleSearch('')}>
                <Ionicons name="close-circle" size={20} color={palette.muted} />
              </TouchableOpacity>
            )}
          </View>
        </Card>

        {/* Categories */}
        <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.categoriesContainer}>
          {mediaCategories.map((category) => (
            <TouchableOpacity
              key={category.id}
              style={[
                styles.categoryButton,
                selectedCategory === category.id && styles.categoryButtonActive
              ]}
              onPress={() => handleCategoryPress(category.id)}
              activeOpacity={0.7}
            >
              <Ionicons
                name={category.icon as any}
                size={18}
                color={selectedCategory === category.id ? '#001a2e' : palette.muted}
              />
              <Text style={[
                styles.categoryText,
                selectedCategory === category.id && styles.categoryTextActive
              ]}>
                {category.name}
              </Text>
            </TouchableOpacity>
          ))}
        </ScrollView>

        {/* Results Header */}
        <View style={styles.resultsHeader}>
          <Text style={styles.resultsTitle}>
            {searchQuery ? 
              `Søgeresultater (${media.length})` : 
              `${mediaCategories.find(c => c.id === selectedCategory)?.name} (${media.length})`
            }
          </Text>
          
          {/* Filter buttons */}
          <View style={styles.filterButtons}>
            <TouchableOpacity style={styles.filterButton}>
              <Ionicons name="funnel" size={16} color={palette.muted} />
              <Text style={styles.filterText}>Filtrer</Text>
            </TouchableOpacity>
          </View>
        </View>

        {/* Media Grid */}
        <View style={styles.gridContainer}>
          <FlatList
            data={media}
            renderItem={renderMediaCard}
            keyExtractor={(item) => item.id}
            numColumns={2}
            columnWrapperStyle={styles.row}
            scrollEnabled={false}
            showsVerticalScrollIndicator={false}
          />
        </View>

        <View style={{ height: spacing.xl }} />
      </ScrollView>
    </ThemedBackground>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  heroContainer: {
    paddingHorizontal: spacing.md,
    paddingTop: spacing.md,
    marginBottom: spacing.lg,
  },
  searchCard: {
    marginHorizontal: spacing.md,
    marginBottom: spacing.md,
  },
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm,
  },
  searchInput: {
    flex: 1,
    color: palette.text,
    fontSize: 16,
  },
  categoriesContainer: {
    marginHorizontal: spacing.md,
    marginBottom: spacing.lg,
  },
  categoryButton: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm,
    marginRight: spacing.sm,
    backgroundColor: palette.cardBackground,
    borderRadius: radius.md,
    gap: spacing.xs,
  },
  categoryButtonActive: {
    backgroundColor: palette.primary,
  },
  categoryText: {
    color: palette.muted,
    fontSize: 13,
    fontWeight: '500',
  },
  categoryTextActive: {
    color: '#001a2e',
    fontWeight: '600',
  },
  resultsHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: spacing.md,
    marginBottom: spacing.md,
  },
  resultsTitle: {
    color: palette.text,
    fontSize: 16,
    fontWeight: '600',
  },
  filterButtons: {
    flexDirection: 'row',
    gap: spacing.sm,
  },
  filterButton: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    paddingHorizontal: spacing.sm,
    paddingVertical: spacing.xs,
    backgroundColor: palette.cardBackground,
    borderRadius: radius.sm,
  },
  filterText: {
    color: palette.muted,
    fontSize: 12,
    fontWeight: '500',
  },
  gridContainer: {
    paddingHorizontal: spacing.md,
  },
  row: {
    justifyContent: 'space-between',
    marginBottom: spacing.md,
  },
});