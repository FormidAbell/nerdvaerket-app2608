import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Alert } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

export default function Snake() {
  const [score, setScore] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [gameSpeed, setGameSpeed] = useState(200);

  const startGame = () => {
    setIsPlaying(true);
    setScore(0);
    // Game logic would be implemented here
  };

  const pauseGame = () => {
    setIsPlaying(false);
  };

  const resetGame = () => {
    setIsPlaying(false);
    setScore(0);
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Snake Spil</Text>
      <Text style={styles.subtitle}>Klassisk slange spil på LED skærmen</Text>

      <View style={styles.gameArea}>
        <View style={styles.gameGrid}>
          {/* 32x32 grid simulation */}
          {Array.from({ length: 32 * 8 }).map((_, index) => (
            <View 
              key={index} 
              style={[
                styles.gridCell,
                // Demo snake and food positions
                index === 120 && styles.snakeHead,
                index === 119 && styles.snakeBody,
                index === 118 && styles.snakeBody,
                index === 200 && styles.food,
              ]} 
            />
          ))}
        </View>
      </View>

      <View style={styles.gameInfo}>
        <View style={styles.scoreCard}>
          <Text style={styles.scoreLabel}>Score</Text>
          <Text style={styles.scoreValue}>{score}</Text>
        </View>
        <View style={styles.speedCard}>
          <Text style={styles.speedLabel}>Hastighed</Text>
          <Text style={styles.speedValue}>{Math.round((300 - gameSpeed) / 10)}</Text>
        </View>
      </View>

      <View style={styles.controls}>
        <View style={styles.directionPad}>
          <TouchableOpacity style={[styles.directionButton, styles.upButton]}>
            <Ionicons name="chevron-up" size={24} color="#00d4ff" />
          </TouchableOpacity>
          <View style={styles.middleRow}>
            <TouchableOpacity style={[styles.directionButton, styles.leftButton]}>
              <Ionicons name="chevron-back" size={24} color="#00d4ff" />
            </TouchableOpacity>
            <TouchableOpacity style={[styles.directionButton, styles.rightButton]}>
              <Ionicons name="chevron-forward" size={24} color="#00d4ff" />
            </TouchableOpacity>
          </View>
          <TouchableOpacity style={[styles.directionButton, styles.downButton]}>
            <Ionicons name="chevron-down" size={24} color="#00d4ff" />
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
    backgroundColor: '#000',
    borderRadius: 12,
    padding: 8,
    marginBottom: 20,
    borderWidth: 2,
    borderColor: '#00d4ff',
  },
  gameGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    aspectRatio: 1,
  },
  gridCell: {
    width: '3.125%', // 100/32 = 3.125%
    aspectRatio: 1,
    backgroundColor: '#111',
    borderWidth: 0.5,
    borderColor: '#222',
  },
  snakeHead: {
    backgroundColor: '#00d4ff',
  },
  snakeBody: {
    backgroundColor: '#0099cc',
  },
  food: {
    backgroundColor: '#ff4444',
  },
  gameInfo: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 20,
  },
  scoreCard: {
    backgroundColor: '#1a2332',
    padding: 16,
    borderRadius: 8,
    alignItems: 'center',
    flex: 0.48,
  },
  scoreLabel: {
    color: '#7a8ca0',
    fontSize: 14,
  },
  scoreValue: {
    color: '#00d4ff',
    fontSize: 24,
    fontWeight: 'bold',
  },
  speedCard: {
    backgroundColor: '#1a2332',
    padding: 16,
    borderRadius: 8,
    alignItems: 'center',
    flex: 0.48,
  },
  speedLabel: {
    color: '#7a8ca0',
    fontSize: 14,
  },
  speedValue: {
    color: '#00d4ff',
    fontSize: 24,
    fontWeight: 'bold',
  },
  controls: {
    alignItems: 'center',
    marginBottom: 20,
  },
  directionPad: {
    alignItems: 'center',
  },
  directionButton: {
    backgroundColor: '#1a2332',
    width: 50,
    height: 50,
    borderRadius: 25,
    alignItems: 'center',
    justifyContent: 'center',
    margin: 4,
  },
  upButton: {},
  middleRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: 120,
  },
  leftButton: {},
  rightButton: {},
  downButton: {},
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