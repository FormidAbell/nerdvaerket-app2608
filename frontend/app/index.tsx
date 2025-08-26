import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { Link, router, usePathname } from 'expo-router';
import { useEffect } from 'react';

export default function Index() {
  const pathname = usePathname();
  
  // Auto-navigate to tabs after 1 second, but only if we're actually on the index page
  useEffect(() => {
    // Only auto-navigate if we're on the root index path
    if (pathname === '/') {
      const timer = setTimeout(() => {
        router.replace('/(tabs)/connect');
      }, 1000);

      return () => clearTimeout(timer);
    }
  }, [pathname]);

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Nerdværket</Text>
      <Text style={styles.subtitle}>Starter app...</Text>
      
      <Link href="/(tabs)/connect" asChild>
        <TouchableOpacity style={styles.button}>
          <Text style={styles.buttonText}>Gå til App Nu</Text>
        </TouchableOpacity>
      </Link>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#0a0e1a',
    padding: 24,
  },
  title: {
    fontSize: 32,
    fontWeight: 'bold',
    color: '#f0f4f8',
    marginBottom: 16,
  },
  subtitle: {
    fontSize: 18,
    color: '#00d4ff',
    marginBottom: 32,
  },
  button: {
    backgroundColor: '#00d4ff',
    paddingHorizontal: 24,
    paddingVertical: 12,
    borderRadius: 8,
  },
  buttonText: {
    color: '#001a2e',
    fontSize: 16,
    fontWeight: 'bold',
  },
});