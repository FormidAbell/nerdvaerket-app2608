import AsyncStorage from '@react-native-async-storage/async-storage';

export async function saveString(key: string, value: string) {
  try { await AsyncStorage.setItem(key, value); } catch {}
}
export async function loadString(key: string) {
  try { return await AsyncStorage.getItem(key); } catch { return null; }
}
export async function remove(key: string) {
  try { await AsyncStorage.removeItem(key); } catch {}
}