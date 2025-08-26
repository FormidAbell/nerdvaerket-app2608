import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Alert } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import Constants from 'expo-constants';

interface Animation {
  id: string;
  name: string;
  filename: string;
  url: string;
  size: number;
  tags: string[];
  mime?: string;
  created_at: string;
}

export default function Animations() {
  const [selectedAnimation, setSelectedAnimation] = useState<string | null>(null);
  const [animations, setAnimations] = useState<Animation[]>([]);
  const [loading, setLoading] = useState(true);

  const backendUrl = Constants.expoConfig?.extra?.EXPO_BACKEND_URL || process.env.EXPO_BACKEND_URL || 'https://ble-led-master.preview.emergentagent.com';

  useEffect(() => {
    fetchAnimations();
  }, []);

  const fetchAnimations = async () => {
    try {
      setLoading(true);
      const response = await fetch(`${backendUrl}/api/animations`);
      if (response.ok) {
        const data = await response.json();
        setAnimations(data.items || []);
        if (data.items.length > 0 && !selectedAnimation) {
          setSelectedAnimation(data.items[0].id);
        }
      } else {
        console.error('Failed to fetch animations:', response.status);
        // Fallback to default animations if API fails
        loadDefaultAnimations();
      }
    } catch (error) {
      console.error('Error fetching animations:', error);
      loadDefaultAnimations();
    } finally {
      setLoading(false);
    }
  };

  const loadDefaultAnimations = () => {
    const defaultAnimations = [
      { id: 'rainbow', name: 'Regnbue', filename: 'rainbow.gif', url: '', size: 1024, tags: ['colors'], created_at: new Date().toISOString() },
      { id: 'fire', name: 'Ild', filename: 'fire.gif', url: '', size: 2048, tags: ['effects'], created_at: new Date().toISOString() },
      { id: 'wave', name: 'Bølge', filename: 'wave.gif', url: '', size: 1536, tags: ['motion'], created_at: new Date().toISOString() },
      { id: 'sparkle', name: 'Glimmer', filename: 'sparkle.gif', url: '', size: 1280, tags: ['effects'], created_at: new Date().toISOString() },
      { id: 'matrix', name: 'Matrix', filename: 'matrix.gif', url: '', size: 3072, tags: ['special'], created_at: new Date().toISOString() },
      { id: 'heartbeat', name: 'Hjerteslag', filename: 'heartbeat.gif', url: '', size: 896, tags: ['patterns'], created_at: new Date().toISOString() },
    ];
    setAnimations(defaultAnimations);
    if (!selectedAnimation) {
      setSelectedAnimation(defaultAnimations[0].id);
    }
  };

  const getAnimationIcon = (animation: Animation) => {
    if (animation.tags.includes('colors')) return 'color-palette';
    if (animation.tags.includes('effects')) return 'flame';
    if (animation.tags.includes('motion')) return 'pulse';
    if (animation.tags.includes('special')) return 'grid';
    if (animation.tags.includes('patterns')) return 'heart';
    return 'sparkles';
  };

  const formatFileSize = (bytes: number) => {
    if (bytes < 1024) return `${bytes} B`;
    if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
    return `${(bytes / 1024 / 1024).toFixed(1)} MB`;
  };

  const handlePlayAnimation = () => {
    const animation = animations.find(a => a.id === selectedAnimation);
    if (animation) {
      Alert.alert(
        'Start Animation',
        `Starter "${animation.name}" (${formatFileSize(animation.size)})`,
        [{ text: 'OK' }]
      );
    }
  };

  return (
    <View style={styles.container}>
      <ScrollView>
        <Text style={styles.title}>Animationer</Text>
        <Text style={styles.subtitle}>
          {loading ? 'Henter animationer...' : `Dynamiske LED effekter (${animations.length} tilgængelige)`}
        </Text>

        {animations.map((animation) => (
          <TouchableOpacity
            key={animation.id}
            style={[
              styles.animationCard,
              selectedAnimation === animation.id && styles.selectedCard
            ]}
            onPress={() => setSelectedAnimation(animation.id)}
          >
            <Ionicons 
              name={getAnimationIcon(animation) as any} 
              size={24} 
              color={selectedAnimation === animation.id ? '#001a2e' : '#00d4ff'} 
            />
            <View style={styles.animationInfo}>
              <View style={styles.animationHeader}>
                <Text style={[
                  styles.animationName,
                  selectedAnimation === animation.id && styles.selectedText
                ]}>
                  {animation.name}
                </Text>
                <Text style={[
                  styles.animationSize,
                  selectedAnimation === animation.id && styles.selectedDescription
                ]}>
                  {formatFileSize(animation.size)}
                </Text>
              </View>
              <Text style={[
                styles.animationTags,
                selectedAnimation === animation.id && styles.selectedDescription
              ]}>
                {animation.tags.length > 0 ? animation.tags.join(', ') : 'LED effekt'}
              </Text>
            </View>
            {selectedAnimation === animation.id && (
              <Ionicons name="checkmark-circle" size={24} color="#001a2e" />
            )}
          </TouchableOpacity>
        ))}

        <TouchableOpacity 
          style={[styles.playButton, loading && styles.disabledButton]} 
          onPress={handlePlayAnimation}
          disabled={loading || !selectedAnimation}
        >
          <Ionicons name="play" size={20} color={loading ? '#7a8ca0' : '#001a2e'} />
          <Text style={[styles.buttonText, loading && styles.disabledButtonText]}>
            {loading ? 'Henter...' : 'Start Animation'}
          </Text>
        </TouchableOpacity>

        <TouchableOpacity 
          style={styles.refreshButton} 
          onPress={fetchAnimations}
          disabled={loading}
        >
          <Ionicons name="refresh" size={20} color="#00d4ff" />
          <Text style={styles.refreshButtonText}>Opdater Liste</Text>
        </TouchableOpacity>
      </ScrollView>
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
    marginBottom: 32,
  },
  animationCard: {
    backgroundColor: '#1a2332',
    padding: 20,
    borderRadius: 12,
    marginBottom: 16,
    flexDirection: 'row',
    alignItems: 'center',
  },
  selectedCard: {
    backgroundColor: '#00d4ff',
  },
  animationInfo: {
    flex: 1,
    marginLeft: 16,
  },
  animationHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  animationName: {
    color: '#e6f0ff',
    fontSize: 18,
    fontWeight: 'bold',
  },
  animationSize: {
    color: '#7a8ca0',
    fontSize: 12,
    fontWeight: '500',
  },
  animationTags: {
    color: '#7a8ca0',
    fontSize: 14,
    marginTop: 4,
  },
  selectedText: {
    color: '#001a2e',
  },
  selectedDescription: {
    color: 'rgba(0, 26, 46, 0.7)',
  },
  playButton: {
    backgroundColor: '#00d4ff',
    padding: 16,
    borderRadius: 8,
    alignItems: 'center',
    flexDirection: 'row',
    justifyContent: 'center',
    marginTop: 20,
  },
  disabledButton: {
    backgroundColor: '#1a2332',
  },
  buttonText: {
    color: '#001a2e',
    fontSize: 16,
    fontWeight: 'bold',
    marginLeft: 8,
  },
  disabledButtonText: {
    color: '#7a8ca0',
  },
  refreshButton: {
    backgroundColor: 'rgba(0, 212, 255, 0.1)',
    borderWidth: 1,
    borderColor: '#00d4ff',
    padding: 12,
    borderRadius: 8,
    alignItems: 'center',
    flexDirection: 'row',
    justifyContent: 'center',
    marginTop: 12,
  },
  refreshButtonText: {
    color: '#00d4ff',
    fontSize: 14,
    fontWeight: '600',
    marginLeft: 8,
  },
});