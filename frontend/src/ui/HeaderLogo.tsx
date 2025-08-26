import React from 'react';
import { View, Text, StyleSheet, Image } from 'react-native';
import { palette, spacing } from './theme';

export const HeaderLogo: React.FC = () => {
  return (
    <View style={styles.container}>
      <Image 
        source={require('../../assets/nerdvaerket_logo.png')} 
        style={styles.logo}
        resizeMode="contain"
      />
      <Text style={styles.title}>Nerdværket</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.xs,
  },
  logo: {
    width: 28,
    height: 28,
  },
  title: {
    color: palette.text,
    fontSize: 18,
    fontWeight: '700',
  },
});