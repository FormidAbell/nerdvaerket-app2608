import React from 'react';
import { View, Text, StyleSheet, Image } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Card } from './components';
import { palette, spacing, radius, gradients } from './theme';

interface HeroSectionProps {
  title: string;
  subtitle: string;
  showLogo?: boolean;
  accent?: boolean;
}

export const HeroSection: React.FC<HeroSectionProps> = ({ title, subtitle, showLogo = true, accent = false }) => {
  return (
    <Card gradient={false} style={styles.heroCard}>
      <LinearGradient 
        colors={accent ? gradients.accent : gradients.secondary} 
        start={{x:0,y:0}} 
        end={{x:1,y:1}} 
        style={styles.heroGradient}
      >
        <View style={styles.heroContent}>
          {showLogo && (
            <View style={[styles.logoContainer, accent && styles.logoContainerAccent]}>
              <Image 
                source={require('../../assets/nerdvaerket_logo.png')} 
                style={styles.logo}
                resizeMode="contain"
              />
            </View>
          )}
          <View style={styles.textContainer}>
            <Text style={[styles.heroTitle, accent && styles.heroTitleAccent]}>{title}</Text>
            <Text style={[styles.heroSubtitle, accent && styles.heroSubtitleAccent]}>{subtitle}</Text>
          </View>
        </View>
      </LinearGradient>
    </Card>
  );
};

const styles = StyleSheet.create({
  heroCard: {
    marginBottom: spacing.lg,
    padding: 0,
    overflow: 'hidden',
  },
  heroGradient: {
    padding: spacing.lg,
    borderRadius: radius.lg,
  },
  heroContent: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.md,
  },
  logoContainer: {
    width: 56,
    height: 56,
    borderRadius: radius.md,
    backgroundColor: 'rgba(0,212,255,0.15)',
    borderWidth: 2,
    borderColor: 'rgba(0,212,255,0.3)',
    padding: spacing.xs,
    alignItems: 'center',
    justifyContent: 'center',
  },
  logoContainerAccent: {
    backgroundColor: 'rgba(255,255,255,0.9)',
    borderColor: 'rgba(255,255,255,0.6)',
  },
  logo: {
    width: 40,
    height: 40,
  },
  textContainer: {
    flex: 1,
  },
  heroTitle: {
    color: palette.text,
    fontSize: 20,
    fontWeight: '800',
    marginBottom: 4,
  },
  heroTitleAccent: {
    color: '#001a2e',
  },
  heroSubtitle: {
    color: palette.textSecondary,
    fontSize: 15,
    fontWeight: '500',
  },
  heroSubtitleAccent: {
    color: 'rgba(0,26,46,0.7)',
  },
});