import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Image } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

export default function ImageUpload() {
  const [selectedImage, setSelectedImage] = useState(null);

  const handleTakePhoto = () => {
    // Demo function - would use expo-image-picker in real app
    console.log('Take photo functionality');
  };

  const handlePickImage = () => {
    // Demo function - would use expo-image-picker in real app
    console.log('Pick image functionality');
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Billede Upload</Text>
      <Text style={styles.subtitle}>Tag billede eller vælg fra galleri</Text>

      <View style={styles.imagePreview}>
        {selectedImage ? (
          <Image source={{ uri: selectedImage }} style={styles.previewImage} />
        ) : (
          <View style={styles.placeholderContainer}>
            <Ionicons name="image" size={64} color="#7a8ca0" />
            <Text style={styles.placeholderText}>Intet billede valgt</Text>
          </View>
        )}
      </View>

      <View style={styles.buttonContainer}>
        <TouchableOpacity style={styles.actionButton} onPress={handleTakePhoto}>
          <Ionicons name="camera" size={24} color="#00d4ff" />
          <Text style={styles.actionButtonText}>Tag Billede</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.actionButton} onPress={handlePickImage}>
          <Ionicons name="images" size={24} color="#00d4ff" />
          <Text style={styles.actionButtonText}>Vælg fra Galleri</Text>
        </TouchableOpacity>
      </View>

      <View style={styles.infoCard}>
        <Ionicons name="information-circle" size={24} color="#00d4ff" />
        <View style={styles.infoText}>
          <Text style={styles.infoTitle}>Billedkrav</Text>
          <Text style={styles.infoDescription}>
            • Maksimal størrelse: 32x32 pixels{'\n'}
            • Understøttede formater: PNG, JPG{'\n'}
            • Billedet vil blive konverteret til LED format
          </Text>
        </View>
      </View>

      <TouchableOpacity 
        style={[styles.sendButton, !selectedImage && styles.disabledButton]}
        disabled={!selectedImage}
      >
        <Ionicons name="send" size={20} color={selectedImage ? "#001a2e" : "#7a8ca0"} />
        <Text style={[styles.buttonText, !selectedImage && styles.disabledButtonText]}>
          Send til LED Skærm
        </Text>
      </TouchableOpacity>
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
  imagePreview: {
    backgroundColor: '#1a2332',
    height: 200,
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 24,
    borderWidth: 2,
    borderColor: '#7a8ca0',
    borderStyle: 'dashed',
  },
  previewImage: {
    width: '100%',
    height: '100%',
    borderRadius: 10,
  },
  placeholderContainer: {
    alignItems: 'center',
  },
  placeholderText: {
    color: '#7a8ca0',
    fontSize: 16,
    marginTop: 12,
  },
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 24,
  },
  actionButton: {
    backgroundColor: '#1a2332',
    padding: 20,
    borderRadius: 12,
    alignItems: 'center',
    flex: 0.48,
  },
  actionButtonText: {
    color: '#00d4ff',
    fontSize: 16,
    fontWeight: 'bold',
    marginTop: 8,
  },
  infoCard: {
    backgroundColor: '#1a2332',
    padding: 20,
    borderRadius: 12,
    flexDirection: 'row',
    marginBottom: 24,
  },
  infoText: {
    flex: 1,
    marginLeft: 16,
  },
  infoTitle: {
    color: '#e6f0ff',
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 8,
  },
  infoDescription: {
    color: '#7a8ca0',
    fontSize: 14,
    lineHeight: 20,
  },
  sendButton: {
    backgroundColor: '#00d4ff',
    padding: 16,
    borderRadius: 8,
    alignItems: 'center',
    flexDirection: 'row',
    justifyContent: 'center',
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
});