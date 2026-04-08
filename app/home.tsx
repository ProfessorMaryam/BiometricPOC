import { View, Text, StyleSheet } from 'react-native';

export default function HomeScreen() {
  return (
    <View style={styles.container}>
      <View style={styles.badge}>
        <Text style={styles.badgeIcon}>✅</Text>
      </View>
      <Text style={styles.title}>You have access to the application now!!</Text>
      <Text style={styles.subtitle}>Home screen placeholder</Text>
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
  subtitle: { fontSize: 14, color: '#9CA3AF' },
});
