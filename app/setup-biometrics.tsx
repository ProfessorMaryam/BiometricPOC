import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { useRouter } from 'expo-router';

export default function SetupBiometricsScreen() {
  const router = useRouter();

  function handleChoice(enabled: boolean) {
    // TODO: save preference to backend
    router.replace('/home');
  }

  return (
    <View style={styles.container}>
      <View style={styles.inner}>
        <View style={styles.iconCircle}>
          <Text style={styles.icon}>👆</Text>
        </View>

        <Text style={styles.title}>Enable Biometrics?</Text>
        <Text style={styles.subtitle}>
          Use Face ID, Touch ID, or fingerprint to sign in faster and more securely.
        </Text>

        <TouchableOpacity
          style={styles.btnPrimary}
          onPress={() => handleChoice(true)}
          activeOpacity={0.85}
        >
          <Text style={styles.btnPrimaryText}>Yes, enable biometrics</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.btnSecondary}
          onPress={() => handleChoice(false)}
          activeOpacity={0.85}
        >
          <Text style={styles.btnSecondaryText}>No, skip for now</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#F0F2FF' },
  inner: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 32,
  },
  iconCircle: {
    width: 96,
    height: 96,
    borderRadius: 48,
    backgroundColor: '#EEF0FF',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 32,
  },
  icon: { fontSize: 44 },
  title: {
    fontSize: 26,
    fontWeight: '700',
    color: '#1A1A2E',
    textAlign: 'center',
    marginBottom: 12,
  },
  subtitle: {
    fontSize: 15,
    color: '#6B7280',
    textAlign: 'center',
    lineHeight: 22,
    marginBottom: 48,
    maxWidth: 300,
  },
  btnPrimary: {
    backgroundColor: '#5B6EF5',
    borderRadius: 14,
    paddingVertical: 15,
    alignItems: 'center',
    width: '100%',
    marginBottom: 14,
  },
  btnPrimaryText: { color: '#fff', fontWeight: '700', fontSize: 16 },
  btnSecondary: {
    borderWidth: 1.5,
    borderColor: '#CBD5E0',
    borderRadius: 14,
    paddingVertical: 15,
    alignItems: 'center',
    width: '100%',
  },
  btnSecondaryText: { color: '#6B7280', fontWeight: '600', fontSize: 16 },
});
