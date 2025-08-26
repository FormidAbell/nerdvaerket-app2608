import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

export default function Tetris() {
  const [score, setScore] = useState(0);
  const [level, setLevel] = useState(1);
  const [lines, setLines] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);

  const startGame = () => {
    setIsPlaying(true);
    setScore(0);
    setLevel(1);
    setLines(0);
  };

  const pauseGame = () => {
    setIsPlaying(false);
  };

  const resetGame = () => {
    setIsPlaying(false);
    setScore(0);
    setLevel(1);
    setLines(0);
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Tetris Spil</Text>
      <Text style={styles.subtitle}>Klassisk blok-stabling spil</Text>

      <View style={styles.gameArea}>
        <View style={styles.gameGrid}>
          {/* 32x32 grid simulation */}
          {Array.from({ length: 32 * 16 }).map((_, index) => (
            <View 
              key={index} 
              style={[
                styles.gridCell,
                // Demo tetris blocks
                index >= 480 && index < 496 && styles.filledBlock,
                index >= 496 && index < 500 && styles.activeBlock,
                index >= 504 && index < 508 && styles.activeBlock,
              ]} 
            />
          ))}
        </View>

        <View style={styles.nextPiece}>
          <Text style={styles.nextTitle}>Næste</Text>
          <View style={styles.nextGrid}>
            {Array.from({ length: 16 }).map((_, index) => (
              <View 
                key={index} 
                style={[
                  styles.nextCell,
                  (index === 5 || index === 6 || index === 9 || index === 10) && styles.nextActiveBlock
                ]} 
              />
            ))}
          </View>
        </View>
      </View>

      <View style={styles.gameStats}>
        <View style={styles.statCard}>
          <Text style={styles.statLabel}>Score</Text>
          <Text style={styles.statValue}>{score.toLocaleString()}</Text>
        </View>
        <View style={styles.statCard}>
          <Text style={styles.statLabel}>Level</Text>
          <Text style={styles.statValue}>{level}</Text>
        </View>
        <View style={styles.statCard}>
          <Text style={styles.statLabel}>Linjer</Text>
          <Text style={styles.statValue}>{lines}</Text>
        </View>
      </View>

      <View style={styles.controls}>
        <View style={styles.leftControls}>
          <TouchableOpacity style={styles.controlButton}>
            <Ionicons name="chevron-back" size={24} color="#00d4ff" />
          </TouchableOpacity>
          <TouchableOpacity style={styles.controlButton}>
            <Ionicons name="chevron-forward" size={24} color="#00d4ff" />
          </TouchableOpacity>
        </View>

        <View style={styles.centerControls}>
          <TouchableOpacity style={styles.dropButton}>
            <Ionicons name="chevron-down" size={32} color="#00d4ff" />
          </TouchableOpacity>
        </View>

        <View style={styles.rightControls}>
          <TouchableOpacity style={styles.rotateButton}>
            <Ionicons name="refresh" size={24} color="#00d4ff" />
          </TouchableOpacity>
          <TouchableOpacity style={styles.holdButton}>
            <Text style={styles.holdText}>HOLD</Text>
          </TouchableOpacity>
        </View>
      </View>

      <View style={styles.gameButtons}>
        {!isPlaying ? (
          <TouchableOpacity style={styles.playButton} onPress={startGame}>
            <Ionicons name="play" size={20} color="#001a2e" />
            <Text style={styles.buttonText}>Start Spil</Text>
          </TouchableOpacity>
        ) : (
          <TouchableOpacity style={styles.pauseButton} onPress={pauseGame}>
            <Ionicons name="pause" size={20} color="#001a2e" />
            <Text style={styles.buttonText}>Pause</Text>
          </TouchableOpacity>
        )}
        
        <TouchableOpacity style={styles.resetButton} onPress={resetGame}>
          <Ionicons name="refresh" size={20} color="#e6f0ff" />
          <Text style={styles.resetButtonText}>Reset</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#0b141b',
    padding: 20,
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#e6f0ff',
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 16,
    color: '#7a8ca0',
    marginBottom: 24,
  },
  gameArea: {
    flexDirection: 'row',
    marginBottom: 20,
  },
  gameGrid: {
    backgroundColor: '#000',
    borderRadius: 12,
    padding: 4,
    borderWidth: 2,
    borderColor: '#00d4ff',
    flexDirection: 'row',
    flexWrap: 'wrap',
    width: '75%',
  },
  gridCell: {
    width: '6.25%', // 100/16 = 6.25%
    aspectRatio: 1,
    backgroundColor: '#111',
    borderWidth: 0.25,
    borderColor: '#222',
  },
  filledBlock: {
    backgroundColor: '#7a8ca0',
  },
  activeBlock: {
    backgroundColor: '#00d4ff',
  },
  nextPiece: {
    marginLeft: 12,
    flex: 1,
  },
  nextTitle: {
    color: '#e6f0ff',
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 8,
  },
  nextGrid: {
    backgroundColor: '#1a2332',
    borderRadius: 8,
    padding: 8,
    flexDirection: 'row',
    flexWrap: 'wrap',
    aspectRatio: 1,
  },
  nextCell: {
    width: '25%',
    aspectRatio: 1,
    backgroundColor: '#0b141b',
    borderWidth: 0.5,
    borderColor: '#7a8ca0',
  },
  nextActiveBlock: {
    backgroundColor: '#00d4ff',
  },
  gameStats: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 20,
  },
  statCard: {
    backgroundColor: '#1a2332',
    padding: 12,
    borderRadius: 8,
    alignItems: 'center',
    flex: 0.3,
  },
  statLabel: {
    color: '#7a8ca0',
    fontSize: 12,
  },
  statValue: {
    color: '#00d4ff',
    fontSize: 18,
    fontWeight: 'bold',
  },
  controls: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 20,
  },
  leftControls: {
    flexDirection: 'row',
  },
  centerControls: {
    alignItems: 'center',
  },
  rightControls: {
    alignItems: 'center',
  },
  controlButton: {
    backgroundColor: '#1a2332',
    width: 50,
    height: 50,
    borderRadius: 25,
    alignItems: 'center',
    justifyContent: 'center',
    margin: 4,
  },
  dropButton: {
    backgroundColor: '#1a2332',
    width: 60,
    height: 60,
    borderRadius: 30,
    alignItems: 'center',
    justifyContent: 'center',
  },
  rotateButton: {
    backgroundColor: '#1a2332',
    width: 50,
    height: 50,
    borderRadius: 25,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 8,
  },
  holdButton: {
    backgroundColor: '#1a2332',
    paddingVertical: 8,
    paddingHorizontal: 12,
    borderRadius: 6,
  },
  holdText: {
    color: '#00d4ff',
    fontSize: 12,
    fontWeight: 'bold',
  },
  gameButtons: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  playButton: {
    backgroundColor: '#00d4ff',
    padding: 16,
    borderRadius: 8,
    alignItems: 'center',
    flexDirection: 'row',
    flex: 0.65,
  },
  pauseButton: {
    backgroundColor: '#fbbf24',
    padding: 16,
    borderRadius: 8,
    alignItems: 'center',
    flexDirection: 'row',
    flex: 0.65,
  },
  resetButton: {
    backgroundColor: '#1a2332',
    padding: 16,
    borderRadius: 8,
    alignItems: 'center',
    flexDirection: 'row',
    flex: 0.3,
  },
  buttonText: {
    color: '#001a2e',
    fontSize: 16,
    fontWeight: 'bold',
    marginLeft: 8,
  },
  resetButtonText: {
    color: '#e6f0ff',
    fontSize: 16,
    fontWeight: 'bold',
    marginLeft: 8,
  },
});