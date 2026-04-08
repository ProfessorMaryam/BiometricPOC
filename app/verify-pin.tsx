import { useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { useRouter } from 'expo-router';
import { verifyPin } from '@/services/api';
import { getEmail } from '@/services/auth';

const PIN_LENGTH = 6;

export default function VerifyPinScreen() {
  const router = useRouter();
  const [pin, setPin] = useState('');
  const [error, setError] = useState('');

  async function handleDigit(digit: string) {
    if (pin.length >= PIN_LENGTH) return;
    const next = pin + digit;
    setPin(next);
    setError('');

    if (next.length === PIN_LENGTH) {
      setTimeout(async () => {
        try {
          const email = await getEmail();
          if (!email) { setError('Session expired. Please log in again.'); setPin(''); return; }
          const valid = await verifyPin(email, next);
          if (valid) {
            router.replace('/home');
          } else {
            setError('Incorrect PIN. Try again.');
            setPin('');
          }
        } catch {
          setError('Something went wrong. Try again.');
          setPin('');
        }
      }, 300);
    }
  }

  function handleDelete() {
    setError('');
    setPin((p) => p.slice(0, -1));
  }

  return (
    <View style={styles.container}>
      <View style={styles.inner}>
        <Text style={styles.title}>Enter your PIN</Text>
        <Text style={styles.subtitle}>Biometric failed — use your PIN to continue</Text>

        <View style={styles.dotsRow}>
          {Array.from({ length: PIN_LENGTH }).map((_, i) => (
            <View key={i} style={[styles.dot, i < pin.length ? styles.dotFilled : undefined]} />
          ))}
        </View>

        {error ? <Text style={styles.errorText}>{error}</Text> : null}

        <View style={styles.pad}>
          {[['1','2','3'], ['4','5','6'], ['7','8','9'], ['','0','⌫']].map((row, ri) => (
            <View key={ri} style={styles.padRow}>
              {row.map((key) => (
                <TouchableOpacity
                  key={key}
                  style={[styles.key, key === '' ? styles.keyInvisible : undefined]}
                  onPress={() => key === '⌫' ? handleDelete() : key !== '' ? handleDigit(key) : null}
                  activeOpacity={0.7}
                  disabled={key === ''}
                >
                  <Text style={styles.keyText}>{key}</Text>
                </TouchableOpacity>
              ))}
            </View>
          ))}
        </View>

        <TouchableOpacity onPress={() => router.replace('/login')} style={styles.linkRow}>
          <Text style={styles.linkText}>Back to login</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#F0F2FF' },
  inner: { flex: 1, alignItems: 'center', justifyContent: 'center', padding: 24 },
  title: { fontSize: 26, fontWeight: '700', color: '#1A1A2E', marginBottom: 8 },
  subtitle: { fontSize: 14, color: '#6B7280', textAlign: 'center', marginBottom: 40 },
  dotsRow: { flexDirection: 'row', gap: 16, marginBottom: 16 },
  dot: {
    width: 18, height: 18, borderRadius: 9,
    borderWidth: 2, borderColor: '#5B6EF5', backgroundColor: 'transparent',
  },
  dotFilled: { backgroundColor: '#5B6EF5' },
  errorText: { color: '#E53E3E', fontSize: 13, marginBottom: 16, textAlign: 'center' },
  pad: { width: '100%', maxWidth: 280, marginTop: 8 },
  padRow: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 16 },
  key: {
    width: 72, height: 72, borderRadius: 36,
    backgroundColor: '#fff', alignItems: 'center', justifyContent: 'center',
    shadowColor: '#5B6EF5', shadowOpacity: 0.07, shadowRadius: 8,
    shadowOffset: { width: 0, height: 4 }, elevation: 3,
  },
  keyInvisible: { backgroundColor: 'transparent', shadowOpacity: 0, elevation: 0 },
  keyText: { fontSize: 22, fontWeight: '600', color: '#1A1A2E' },
  linkRow: { marginTop: 32 },
  linkText: { color: '#5B6EF5', fontWeight: '600', fontSize: 14 },
});
