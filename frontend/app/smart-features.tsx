/**
 * Smart Features - Notifications, Weather, Social Media, QR Codes
 */

import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Switch, TextInput, ScrollView } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import { palette, gradients, spacing } from '../src/ui/theme';

export default function SmartFeatures() {
  const [notificationsEnabled, setNotificationsEnabled] = useState(true);
  const [weatherEnabled, setWeatherEnabled] = useState(true);
  const [socialEnabled, setSocialEnabled] = useState(false);
  const [qrText, setQrText] = useState('');

  const notificationTypes = [
    { id: 'calls', name: 'Indkommende opkald', icon: 'call', enabled: true },
    { id: 'messages', name: 'SMS/Messages', icon: 'chatbubble', enabled: true },
    { id: 'social', name: 'Sociale medier', icon: 'people', enabled: false },
    { id: 'email', name: 'E-mail', icon: 'mail', enabled: true },
    { id: 'calendar', name: 'Kalender begivenheder', icon: 'calendar', enabled: false },
    { id: 'apps', name: 'App notifikationer', icon: 'apps', enabled: false },
  ];

  const weatherDisplays = [
    { id: 'temp', name: 'Temperatur', icon: 'thermometer', desc: 'Vis aktuel temperatur' },
    { id: 'weather', name: 'Vejr ikon', icon: 'partly-sunny', desc: 'Vejr symbol (sol, regn, osv.)' },
    { id: 'forecast', name: 'Prognose', icon: 'trending-up', desc: '24-timers vejrudsigt' },
    { id: 'alerts', name: 'Vejr advarsler', icon: 'warning', desc: 'Storm, regn advarsler' },
  ];

  const socialPlatforms = [
    { id: 'instagram', name: 'Instagram', icon: 'logo-instagram', followers: '1.2K' },
    { id: 'twitter', name: 'Twitter/X', icon: 'logo-twitter', followers: '856' },
    { id: 'tiktok', name: 'TikTok', icon: 'logo-tiktok', followers: '3.4K' },
    { id: 'youtube', name: 'YouTube', icon: 'logo-youtube', followers: '492' },
  ];

  const quickQRs = [
    { text: 'WiFi: Hjemme password', icon: 'wifi' },
    { text: 'https://nerdvaerket.dk', icon: 'link' },
    { text: 'Instagram: @nerdvaerket', icon: 'logo-instagram' },
    { text: 'Kontakt: +45 12345678', icon: 'call' },
  ];

  return (
    <LinearGradient colors={gradients.primary} style={styles.container}>
      <SafeAreaView style={styles.safeArea}>
        <ScrollView showsVerticalScrollIndicator={false}>
          
          {/* Header */}
          <View style={styles.header}>
            <Ionicons name="phone-portrait" size={32} color={palette.tint} />
            <Text style={styles.title}>Smart Features</Text>
            <Text style={styles.subtitle}>Notifikationer, vejr og smarte funktioner</Text>
          </View>

          {/* Phone Notifications */}
          <View style={styles.card}>
            <View style={styles.cardHeader}>
              <Ionicons name="notifications" size={24} color={palette.tint} />
              <Text style={styles.cardTitle}>Telefon Notifikationer</Text>
              <Switch 
                value={notificationsEnabled} 
                onValueChange={setNotificationsEnabled}
                trackColor={{ false: palette.muted, true: palette.tint }}
              />
            </View>
            
            {notificationsEnabled && (
              <>
                <Text style={styles.cardSubtitle}>Vælg hvilke notifikationer der skal vises på LED skærmen:</Text>
                {notificationTypes.map((type) => (
                  <View key={type.id} style={styles.notificationRow}>
                    <Ionicons name={type.icon as any} size={20} color={palette.tint} />
                    <Text style={styles.notificationName}>{type.name}</Text>
                    <Switch 
                      value={type.enabled} 
                      onValueChange={() => {}}
                      trackColor={{ false: palette.muted, true: palette.tint }}
                    />
                  </View>
                ))}
                
                <TouchableOpacity style={styles.testButton}>
                  <Text style={styles.testButtonText}>Test Notifikation</Text>
                </TouchableOpacity>
              </>
            )}
          </View>

          {/* Weather Display */}
          <View style={styles.card}>
            <View style={styles.cardHeader}>
              <Ionicons name="partly-sunny" size={24} color={palette.tint} />
              <Text style={styles.cardTitle}>Vejr Display</Text>
              <Switch 
                value={weatherEnabled} 
                onValueChange={setWeatherEnabled}
                trackColor={{ false: palette.muted, true: palette.tint }}
              />
            </View>
            
            {weatherEnabled && (
              <>
                <View style={styles.weatherInfo}>
                  <View style={styles.currentWeather}>
                    <Text style={styles.temperature}>22°C</Text>
                    <View style={styles.weatherDetails}>
                      <Text style={styles.weatherLocation}>København</Text>
                      <Text style={styles.weatherCondition}>Overskyet</Text>
                      <Text style={styles.weatherExtra}>Føles som 24°C</Text>
                    </View>
                    <Ionicons name="cloud" size={40} color={palette.textSecondary} />
                  </View>
                </View>

                <Text style={styles.cardSubtitle}>Vejr funktioner:</Text>
                {weatherDisplays.map((display) => (
                  <TouchableOpacity key={display.id} style={styles.weatherOption}>
                    <Ionicons name={display.icon as any} size={20} color={palette.tint} />
                    <View style={styles.weatherOptionInfo}>
                      <Text style={styles.weatherOptionName}>{display.name}</Text>
                      <Text style={styles.weatherOptionDesc}>{display.desc}</Text>
                    </View>
                    <Ionicons name="chevron-forward" size={16} color={palette.muted} />
                  </TouchableOpacity>
                ))}
              </>
            )}
          </View>

          {/* Social Media Integration */}
          <View style={styles.card}>
            <View style={styles.cardHeader}>
              <Ionicons name="people" size={24} color={palette.tint} />
              <Text style={styles.cardTitle}>Sociale Medier</Text>
              <Switch 
                value={socialEnabled} 
                onValueChange={setSocialEnabled}
                trackColor={{ false: palette.muted, true: palette.tint }}
              />
            </View>
            
            {socialEnabled && (
              <>
                <Text style={styles.cardSubtitle}>Vis følger-antal og aktivitet fra dine sociale platforme:</Text>
                {socialPlatforms.map((platform) => (
                  <View key={platform.id} style={styles.socialRow}>
                    <Ionicons name={platform.icon as any} size={24} color={palette.tint} />
                    <View style={styles.socialInfo}>
                      <Text style={styles.socialName}>{platform.name}</Text>
                      <Text style={styles.socialFollowers}>{platform.followers} følgere</Text>
                    </View>
                    <TouchableOpacity style={styles.connectSocialButton}>
                      <Text style={styles.connectSocialText}>Forbind</Text>
                    </TouchableOpacity>
                  </View>
                ))}
              </>
            )}
          </View>

          {/* QR Code Generator */}
          <View style={styles.card}>
            <View style={styles.cardHeader}>
              <Ionicons name="qr-code" size={24} color={palette.tint} />
              <Text style={styles.cardTitle}>QR Code Generator</Text>
            </View>
            
            <Text style={styles.cardSubtitle}>Generer QR koder direkte på LED skærmen:</Text>
            
            <View style={styles.qrInput}>
              <TextInput
                style={styles.textInput}
                placeholder="Indtast tekst eller URL..."
                placeholderTextColor={palette.muted}
                value={qrText}
                onChangeText={setQrText}
                multiline
              />
              <TouchableOpacity style={styles.generateButton}>
                <Text style={styles.generateButtonText}>Generer QR</Text>
              </TouchableOpacity>
            </View>

            <Text style={styles.quickQRTitle}>Hurtige QR koder:</Text>
            <View style={styles.quickQRs}>
              {quickQRs.map((qr, index) => (
                <TouchableOpacity key={index} style={styles.quickQR}>
                  <Ionicons name={qr.icon as any} size={16} color={palette.tint} />
                  <Text style={styles.quickQRText}>{qr.text}</Text>
                </TouchableOpacity>
              ))}
            </View>
          </View>

          {/* Screen Mirror */}
          <View style={styles.card}>
            <View style={styles.cardHeader}>
              <Ionicons name="phone-portrait" size={24} color={palette.tint} />
              <Text style={styles.cardTitle}>Screen Mirror</Text>
            </View>
            
            <Text style={styles.cardSubtitle}>Mirror dele af din telefon skærm til LED displayet:</Text>
            
            <TouchableOpacity style={styles.mirrorOption}>
              <Ionicons name="time" size={20} color={palette.tint} />
              <View style={styles.mirrorInfo}>
                <Text style={styles.mirrorName}>Ur & Dato</Text>
                <Text style={styles.mirrorDesc}>Vis telefon tid på LED</Text>
              </View>
            </TouchableOpacity>

            <TouchableOpacity style={styles.mirrorOption}>
              <Ionicons name="battery-charging" size={20} color={palette.tint} />
              <View style={styles.mirrorInfo}>
                <Text style={styles.mirrorName}>Batteri Status</Text>
                <Text style={styles.mirrorDesc}>Vis batteri niveau</Text>
              </View>
            </TouchableOpacity>

            <TouchableOpacity style={styles.mirrorOption}>
              <Ionicons name="musical-notes" size={20} color={palette.tint} />
              <View style={styles.mirrorInfo}>
                <Text style={styles.mirrorName}>Nu Spiller</Text>
                <Text style={styles.mirrorDesc}>Vis aktuel musik</Text>
              </View>
            </TouchableOpacity>
          </View>

          {/* Fitness Integration */}
          <View style={styles.card}>
            <View style={styles.cardHeader}>
              <Ionicons name="fitness" size={24} color={palette.tint} />
              <Text style={styles.cardTitle}>Fitness Integration</Text>
            </View>
            
            <TouchableOpacity style={styles.fitnessOption}>
              <Ionicons name="walk" size={20} color={palette.success} />
              <View style={styles.fitnessInfo}>
                <Text style={styles.fitnessName}>Skridt Tæller</Text>
                <Text style={styles.fitnessValue}>8,432 skridt i dag</Text>
              </View>
            </TouchableOpacity>

            <TouchableOpacity style={styles.fitnessOption}>
              <Ionicons name="heart" size={20} color={palette.error} />
              <View style={styles.fitnessInfo}>
                <Text style={styles.fitnessName}>Puls</Text>
                <Text style={styles.fitnessValue}>72 BPM</Text>
              </View>
            </TouchableOpacity>

            <TouchableOpacity style={styles.fitnessOption}>
              <Ionicons name="flame" size={20} color={palette.warning} />
              <View style={styles.fitnessInfo}>
                <Text style={styles.fitnessName}>Kalorier</Text>
                <Text style={styles.fitnessValue}>1,245 brændt</Text>
              </View>
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
    flex: 1,
    marginLeft: spacing.sm,
  },
  cardSubtitle: {
    fontSize: 14,
    color: palette.textSecondary,
    marginBottom: spacing.md,
  },
  notificationRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: spacing.sm,
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(255,255,255,0.1)',
  },
  notificationName: {
    fontSize: 16,
    color: palette.text,
    flex: 1,
    marginLeft: spacing.sm,
  },
  testButton: {
    backgroundColor: 'rgba(0,212,255,0.2)',
    paddingVertical: spacing.md,
    borderRadius: 12,
    alignItems: 'center',
    marginTop: spacing.md,
  },
  testButtonText: {
    color: palette.tint,
    fontSize: 16,
    fontWeight: '600',
  },
  weatherInfo: {
    backgroundColor: 'rgba(255,255,255,0.1)',
    borderRadius: 12,
    padding: spacing.md,
    marginBottom: spacing.md,
  },
  currentWeather: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  temperature: {
    fontSize: 36,
    fontWeight: '800',
    color: palette.tint,
    marginRight: spacing.md,
  },
  weatherDetails: {
    flex: 1,
  },
  weatherLocation: {
    fontSize: 18,
    fontWeight: '600',
    color: palette.text,
  },
  weatherCondition: {
    fontSize: 14,
    color: palette.textSecondary,
  },
  weatherExtra: {
    fontSize: 12,
    color: palette.muted,
  },
  weatherOption: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: spacing.md,
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(255,255,255,0.1)',
  },
  weatherOptionInfo: {
    flex: 1,
    marginLeft: spacing.sm,
  },
  weatherOptionName: {
    fontSize: 16,
    color: palette.text,
    fontWeight: '600',
  },
  weatherOptionDesc: {
    fontSize: 14,
    color: palette.textSecondary,
  },
  socialRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: spacing.md,
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(255,255,255,0.1)',
  },
  socialInfo: {
    flex: 1,
    marginLeft: spacing.sm,
  },
  socialName: {
    fontSize: 16,
    color: palette.text,
    fontWeight: '600',
  },
  socialFollowers: {
    fontSize: 14,
    color: palette.textSecondary,
  },
  connectSocialButton: {
    backgroundColor: 'rgba(0,212,255,0.2)',
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm,
    borderRadius: 8,
  },
  connectSocialText: {
    color: palette.tint,
    fontSize: 14,
    fontWeight: '600',
  },
  qrInput: {
    marginBottom: spacing.md,
  },
  textInput: {
    backgroundColor: 'rgba(255,255,255,0.1)',
    borderRadius: 8,
    padding: spacing.md,
    color: palette.text,
    fontSize: 16,
    marginBottom: spacing.sm,
    minHeight: 80,
    textAlignVertical: 'top',
  },
  generateButton: {
    backgroundColor: palette.tint,
    paddingVertical: spacing.md,
    borderRadius: 8,
    alignItems: 'center',
  },
  generateButtonText: {
    color: '#001a2e',
    fontSize: 16,
    fontWeight: '600',
  },
  quickQRTitle: {
    fontSize: 16,
    color: palette.text,
    fontWeight: '600',
    marginTop: spacing.md,
    marginBottom: spacing.sm,
  },
  quickQRs: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
  quickQR: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(255,255,255,0.1)',
    paddingHorizontal: spacing.sm,
    paddingVertical: spacing.xs,
    borderRadius: 6,
    marginBottom: spacing.xs,
    width: '48%',
  },
  quickQRText: {
    fontSize: 12,
    color: palette.text,
    marginLeft: spacing.xs,
    flex: 1,
  },
  mirrorOption: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(255,255,255,0.1)',
    borderRadius: 12,
    padding: spacing.md,
    marginBottom: spacing.sm,
  },
  mirrorInfo: {
    flex: 1,
    marginLeft: spacing.sm,
  },
  mirrorName: {
    fontSize: 16,
    color: palette.text,
    fontWeight: '600',
  },
  mirrorDesc: {
    fontSize: 14,
    color: palette.textSecondary,
  },
  fitnessOption: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(255,255,255,0.1)',
    borderRadius: 12,
    padding: spacing.md,
    marginBottom: spacing.sm,
  },
  fitnessInfo: {
    flex: 1,
    marginLeft: spacing.sm,
  },
  fitnessName: {
    fontSize: 16,
    color: palette.text,
    fontWeight: '600',
  },
  fitnessValue: {
    fontSize: 14,
    color: palette.tint,
    fontWeight: '600',
  },
});