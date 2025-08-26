import { Tabs } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';

export default function TabLayout() {
  return (
    <Tabs
      screenOptions={{
        tabBarActiveTintColor: '#00d4ff',
        tabBarInactiveTintColor: '#7a8ca0',
        tabBarStyle: {
          backgroundColor: '#0f2741',
          borderTopColor: '#1a2332',
        },
        headerStyle: {
          backgroundColor: '#0f2741',
        },
        headerTintColor: '#e6f0ff',
      }}
    >
      <Tabs.Screen
        name="connect"
        options={{
          title: 'Forbind',
          tabBarIcon: ({ color }) => <Ionicons name="bluetooth" size={24} color={color} />,
        }}
      />
      <Tabs.Screen
        name="visuals"
        options={{
          title: 'Visuelt',
          tabBarIcon: ({ color }) => <Ionicons name="color-palette" size={24} color={color} />,
        }}
      />
      <Tabs.Screen
        name="media"
        options={{
          title: 'Media',
          tabBarIcon: ({ color }) => <Ionicons name="musical-notes" size={24} color={color} />,
        }}
      />
      <Tabs.Screen
        name="games"
        options={{
          title: 'Spil',
          tabBarIcon: ({ color }) => <Ionicons name="game-controller" size={24} color={color} />,
        }}
      />
      <Tabs.Screen
        name="settings"
        options={{
          title: 'Indstillinger',
          tabBarIcon: ({ color }) => <Ionicons name="settings" size={24} color={color} />,
        }}
      />
    </Tabs>
  );
}