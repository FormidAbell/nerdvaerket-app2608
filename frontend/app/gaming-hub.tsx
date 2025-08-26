/**
 * Gaming Hub - Interactive games and features for LED screen
 */

import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import { Link } from 'expo-router';
import { palette, gradients, spacing } from '../src/ui/theme';

export default function GamingHub() {
  const [selectedCategory, setSelectedCategory] = useState('arcade');

  const gameCategories = [
    { id: 'arcade', name: 'Arcade', icon: 'game-controller' },
    { id: 'puzzle', name: 'Puzzle', icon: 'extension-puzzle' },
    { id: 'interactive', name: 'Interaktiv', icon: 'hand-left' },
    { id: 'multiplayer', name: 'Multiplayer', icon: 'people' },
  ];

  const arcadeGames = [
    { 
      id: 'snake', 
      name: 'Snake', 
      description: 'Klassisk slange spil på LED matrix',
      icon: 'git-network',
      difficulty: 'Let',
      players: '1',
      route: '/(tabs)/games/snake'
    },
    { 
      id: 'tetris', 
      name: 'Tetris', 
      description: 'Blok-faldende puzzle spil',
      icon: 'grid',
      difficulty: 'Medium',
      players: '1',
      route: '/(tabs)/games/tetris'
    },
    { 
      id: 'pong', 
      name: 'Pong', 
      description: 'Klassisk tennis spil',
      icon: 'remove',
      difficulty: 'Let',
      players: '2',
      route: '/games/pong'
    },
    { 
      id: 'breakout', 
      name: 'Breakout', 
      description: 'Ødelæg blokke med kugle',
      icon: 'apps',
      difficulty: 'Medium',
      players: '1',
      route: '/games/breakout'
    },
  ];

  const puzzleGames = [
    { 
      id: 'maze', 
      name: 'Labyrint', 
      description: 'Find vej gennem labyrinten',
      icon: 'map',
      difficulty: 'Hard',
      players: '1',
      route: '/games/maze'
    },
    { 
      id: 'sudoku', 
      name: 'Sudoku', 
      description: 'Tal puzzle på LED',
      icon: 'grid',
      difficulty: 'Hard',
      players: '1',
      route: '/games/sudoku'
    },
    { 
      id: 'lights', 
      name: 'Lights Out', 
      description: 'Sluk alle lys',
      icon: 'bulb',
      difficulty: 'Medium',
      players: '1',
      route: '/games/lights-out'
    },
  ];

  const interactiveGames = [
    { 
      id: 'simon', 
      name: 'Simon Says', 
      description: 'Hukommelse spil med farver',
      icon: 'color-palette',
      difficulty: 'Medium',
      players: '1+',
      route: '/games/simon'
    },
    { 
      id: 'reaction', 
      name: 'Reaktionstid', 
      description: 'Test din reaktionstid',
      icon: 'flash',
      difficulty: 'Let',
      players: '1+',
      route: '/games/reaction'
    },
    { 
      id: 'dance', 
      name: 'Dance Dance', 
      description: 'Dans til rytmen',
      icon: 'musical-notes',
      difficulty: 'Medium',
      players: '1+',
      route: '/games/dance'
    },
  ];

  const multiplayerGames = [
    { 
      id: 'quiz', 
      name: 'Quiz Battle', 
      description: 'Konkurrencer i viden',
      icon: 'help-circle',
      difficulty: 'Medium',
      players: '2-4',
      route: '/games/quiz'
    },
    { 
      id: 'racing', 
      name: 'LED Racing', 
      description: 'Kør mod hinanden',
      icon: 'car-sport',
      difficulty: 'Medium',
      players: '2-4',
      route: '/games/racing'
    },
    { 
      id: 'battleship', 
      name: 'Sænke Slagskib', 
      description: 'Find modstanderens skibe',
      icon: 'boat',
      difficulty: 'Medium',
      players: '2',
      route: '/games/battleship'
    },
  ];

  const getCurrentGames = () => {
    switch (selectedCategory) {
      case 'arcade': return arcadeGames;
      case 'puzzle': return puzzleGames;
      case 'interactive': return interactiveGames;
      case 'multiplayer': return multiplayerGames;
      default: return arcadeGames;
    }
  };

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case 'Let': return palette.success;
      case 'Medium': return palette.warning;
      case 'Hard': return palette.error;
      default: return palette.muted;
    }
  };

  return (
    <LinearGradient colors={gradients.primary} style={styles.container}>
      <SafeAreaView style={styles.safeArea}>
        
        {/* Header */}
        <View style={styles.header}>
          <Ionicons name="game-controller" size={32} color={palette.tint} />
          <Text style={styles.title}>Gaming Hub</Text>
          <Text style={styles.subtitle}>Spil og interaktive oplevelser på LED</Text>
        </View>

        {/* Category Tabs */}
        <View style={styles.categoryTabs}>
          <ScrollView horizontal showsHorizontalScrollIndicator={false}>
            {gameCategories.map((category) => (
              <TouchableOpacity
                key={category.id}
                style={[
                  styles.categoryTab,
                  selectedCategory === category.id && styles.categoryTabActive
                ]}
                onPress={() => setSelectedCategory(category.id)}
              >
                <Ionicons 
                  name={category.icon as any} 
                  size={20} 
                  color={selectedCategory === category.id ? '#001a2e' : palette.text} 
                />
                <Text style={[
                  styles.categoryTabText,
                  selectedCategory === category.id && styles.categoryTabTextActive
                ]}>
                  {category.name}
                </Text>
              </TouchableOpacity>
            ))}
          </ScrollView>
        </View>

        {/* Games Grid */}
        <ScrollView style={styles.gamesContainer} showsVerticalScrollIndicator={false}>
          <View style={styles.gamesGrid}>
            {getCurrentGames().map((game) => (
              <Link key={game.id} href={game.route as any} asChild>
                <TouchableOpacity style={styles.gameCard}>
                  <LinearGradient
                    colors={['rgba(26,35,50,0.9)', 'rgba(15,39,65,0.7)']}
                    style={styles.gameCardGradient}
                  >
                    <View style={styles.gameIcon}>
                      <Ionicons name={game.icon as any} size={32} color={palette.tint} />
                    </View>
                    
                    <View style={styles.gameInfo}>
                      <Text style={styles.gameName}>{game.name}</Text>
                      <Text style={styles.gameDescription}>{game.description}</Text>
                      
                      <View style={styles.gameStats}>
                        <View style={styles.gameStat}>
                          <Ionicons name="speedometer" size={14} color={getDifficultyColor(game.difficulty)} />
                          <Text style={[styles.gameStatText, { color: getDifficultyColor(game.difficulty) }]}>
                            {game.difficulty}
                          </Text>
                        </View>
                        
                        <View style={styles.gameStat}>
                          <Ionicons name="people" size={14} color={palette.textSecondary} />
                          <Text style={styles.gameStatText}>{game.players}</Text>
                        </View>
                      </View>
                    </View>
                    
                    <View style={styles.playButton}>
                      <Ionicons name="play" size={20} color="#001a2e" />
                    </View>
                  </LinearGradient>
                </TouchableOpacity>
              </Link>
            ))}
          </View>

          {/* Custom Game Builder */}
          <View style={styles.card}>
            <View style={styles.cardHeader}>
              <Ionicons name="construct" size={24} color={palette.tint} />
              <Text style={styles.cardTitle}>Byg Dit Eget Spil</Text>
            </View>
            
            <Text style={styles.cardSubtitle}>
              Lav dine egne spil og animationer med vores spil-bygger
            </Text>
            
            <TouchableOpacity style={styles.builderButton}>
              <Ionicons name="add-circle" size={20} color={palette.text} />
              <Text style={styles.builderButtonText}>Start Game Builder</Text>
            </TouchableOpacity>
          </View>

          {/* Tournaments & Leaderboards */}
          <View style={styles.card}>
            <View style={styles.cardHeader}>
              <Ionicons name="trophy" size={24} color={palette.warning} />
              <Text style={styles.cardTitle}>Turneringer & Ranglister</Text>
            </View>
            
            <View style={styles.leaderboard}>
              <View style={styles.leaderItem}>
                <Text style={styles.leaderRank}>#1</Text>
                <Text style={styles.leaderName}>Jonas</Text>
                <Text style={styles.leaderScore}>15,240</Text>
              </View>
              <View style={styles.leaderItem}>
                <Text style={styles.leaderRank}>#2</Text>
                <Text style={styles.leaderName}>Emma</Text>
                <Text style={styles.leaderScore}>12,890</Text>
              </View>
              <View style={styles.leaderItem}>
                <Text style={styles.leaderRank}>#3</Text>
                <Text style={styles.leaderName}>Marcus</Text>
                <Text style={styles.leaderScore}>11,450</Text>
              </View>
            </View>
            
            <TouchableOpacity style={styles.tournamentButton}>
              <Text style={styles.tournamentButtonText}>Join Weekly Tournament</Text>
            </TouchableOpacity>
          </View>

          {/* Game Settings */}
          <View style={styles.card}>
            <View style={styles.cardHeader}>
              <Ionicons name="settings" size={24} color={palette.tint} />
              <Text style={styles.cardTitle}>Spil Indstillinger</Text>
            </View>
            
            <TouchableOpacity style={styles.settingOption}>
              <Ionicons name="volume-medium" size={20} color={palette.tint} />
              <Text style={styles.settingName}>Lyd Effekter</Text>
              <Ionicons name="chevron-forward" size={16} color={palette.muted} />
            </TouchableOpacity>

            <TouchableOpacity style={styles.settingOption}>
              <Ionicons name="flash" size={20} color={palette.tint} />
              <Text style={styles.settingName}>Vibration</Text>
              <Ionicons name="chevron-forward" size={16} color={palette.muted} />
            </TouchableOpacity>

            <TouchableOpacity style={styles.settingOption}>
              <Ionicons name="speedometer" size={20} color={palette.tint} />
              <Text style={styles.settingName}>Spil Hastighed</Text>
              <Ionicons name="chevron-forward" size={16} color={palette.muted} />
            </TouchableOpacity>
          </View>

        </ScrollView>
      </SafeAreaView>
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  safeArea: { flex: 1, paddingHorizontal: spacing.md },
  header: {
    alignItems: 'center',
    paddingVertical: spacing.lg,
  },
  title: {
    fontSize: 28,
    fontWeight: '800',
    color: palette.text,
    marginTop: spacing.sm,
  },
  subtitle: {
    fontSize: 16,
    color: palette.textSecondary,
  },
  categoryTabs: {
    marginBottom: spacing.lg,
  },
  categoryTab: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(255,255,255,0.1)',
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm,
    borderRadius: 20,
    marginRight: spacing.sm,
  },
  categoryTabActive: {
    backgroundColor: palette.tint,
  },
  categoryTabText: {
    color: palette.text,
    fontSize: 14,
    fontWeight: '600',
    marginLeft: spacing.xs,
  },
  categoryTabTextActive: {
    color: '#001a2e',
  },
  gamesContainer: {
    flex: 1,
  },
  gamesGrid: {
    marginBottom: spacing.lg,
  },
  gameCard: {
    marginBottom: spacing.md,
    borderRadius: 16,
    overflow: 'hidden',
  },
  gameCardGradient: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: spacing.lg,
  },
  gameIcon: {
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: 'rgba(0,212,255,0.2)',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: spacing.md,
  },
  gameInfo: {
    flex: 1,
  },
  gameName: {
    fontSize: 18,
    fontWeight: '700',
    color: palette.text,
    marginBottom: spacing.xs,
  },
  gameDescription: {
    fontSize: 14,
    color: palette.textSecondary,
    marginBottom: spacing.sm,
  },
  gameStats: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  gameStat: {
    flexDirection: 'row',
    alignItems: 'center',
    marginRight: spacing.md,
  },
  gameStatText: {
    fontSize: 12,
    color: palette.textSecondary,
    marginLeft: spacing.xs,
  },
  playButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: palette.tint,
    alignItems: 'center',
    justifyContent: 'center',
  },
  card: {
    backgroundColor: 'rgba(26,35,50,0.8)',
    borderRadius: 16,
    padding: spacing.lg,
    marginBottom: spacing.lg,
  },
  cardHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: spacing.md,
  },
  cardTitle: {
    fontSize: 20,
    fontWeight: '600',
    color: palette.text,
    marginLeft: spacing.sm,
  },
  cardSubtitle: {
    fontSize: 14,
    color: palette.textSecondary,
    marginBottom: spacing.md,
  },
  builderButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'rgba(0,212,255,0.2)',
    paddingVertical: spacing.md,
    borderRadius: 12,
  },
  builderButtonText: {
    color: palette.text,
    fontSize: 16,
    fontWeight: '600',
    marginLeft: spacing.sm,
  },
  leaderboard: {
    marginBottom: spacing.md,
  },
  leaderItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: spacing.sm,
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(255,255,255,0.1)',
  },
  leaderRank: {
    fontSize: 16,
    fontWeight: '700',
    color: palette.warning,
    width: 40,
  },
  leaderName: {
    fontSize: 16,
    color: palette.text,
    flex: 1,
  },
  leaderScore: {
    fontSize: 16,
    fontWeight: '600',
    color: palette.tint,
  },
  tournamentButton: {
    backgroundColor: palette.warning,
    paddingVertical: spacing.md,
    borderRadius: 12,
    alignItems: 'center',
  },
  tournamentButtonText: {
    color: '#001a2e',
    fontSize: 16,
    fontWeight: '700',
  },
  settingOption: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: spacing.md,
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(255,255,255,0.1)',
  },
  settingName: {
    fontSize: 16,
    color: palette.text,
    flex: 1,
    marginLeft: spacing.sm,
  },
});