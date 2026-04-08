import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { useRouter } from 'expo-router';
import { clearSession } from '@/services/auth';

export default function HomeScreen() {
  const router = useRouter();

  async function handleLogout() {
    await clearSession();
    router.replace('/login');
  }

  return (
    <View style={styles.container}>
      <View style={styles.badge}>
        <Text style={styles.badgeIcon}>✅</Text>
      </View>
      <Text style={styles.title}>You have access to the application now!!</Text>
      <Text style={styles.subtitle}>Home screen placeholder</Text>

      <TouchableOpacity style={styles.btn} onPress={handleLogout} activeOpacity={0.85}>
        <Text style={styles.btnText}>Log Out</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F0F2FF',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 32,
  },
  badge: {
    width: 88,
    height: 88,
    borderRadius: 44,
    backgroundColor: '#EEF0FF',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 28,
  },
  badgeIcon: { fontSize: 40 },
  title: {
    fontSize: 24,
    fontWeight: '700',
    color: '#1A1A2E',
    textAlign: 'center',
    lineHeight: 34,
    marginBottom: 10,
  },
  subtitle: { fontSize: 14, color: '#9CA3AF', marginBottom: 48 },
  btn: {
    backgroundColor: '#E53E3E',
    borderRadius: 12,
    paddingVertical: 14,
    paddingHorizontal: 40,
    alignItems: 'center',
  },
  btnText: { color: '#fff', fontWeight: '700', fontSize: 16 },
});
