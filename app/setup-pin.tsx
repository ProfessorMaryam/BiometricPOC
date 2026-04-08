import { useState, useRef } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  KeyboardAvoidingView,
  Platform,
} from 'react-native';
import { useRouter } from 'expo-router';
import { savePin } from '@/services/api';
import { getEmail } from '@/services/auth';

const PIN_LENGTH = 6;

export default function SetupPinScreen() {
  const router = useRouter();
  const [pin, setPin] = useState('');
  const [confirm, setConfirm] = useState('');
  const [step, setStep] = useState<'enter' | 'confirm'>('enter');
  const [error, setError] = useState('');

  const inputRef = useRef<TextInput>(null);

  function handleDigit(digit: string) {
    setError('');
    if (step === 'enter') {
      if (pin.length < PIN_LENGTH) {
        const next = pin + digit;
        setPin(next);
        if (next.length === PIN_LENGTH) {
          setTimeout(() => setStep('confirm'), 300);
        }
      }
    } else {
      if (confirm.length < PIN_LENGTH) {
        const next = confirm + digit;
        setConfirm(next);
        if (next.length === PIN_LENGTH) {
          setTimeout(async () => {
            if (next === pin) {
              const email = await getEmail();
              if (email) await savePin(email, next);
              router.push('/setup-biometrics');
            } else {
              setError('PINs do not match. Please try again.');
              setConfirm('');
            }
          }, 300);
        }
      }
    }
  }

  function handleDelete() {
    setError('');
    if (step === 'enter') {
      setPin((p) => p.slice(0, -1));
    } else {
      setConfirm((p) => p.slice(0, -1));
    }
  }

  function handleBack() {
    if (step === 'confirm') {
      setStep('enter');
      setConfirm('');
      setError('');
    }
  }

  const current = step === 'enter' ? pin : confirm;

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
    >
      <View style={styles.inner}>
        <View style={styles.header}>
          {step === 'confirm' && (
            <TouchableOpacity onPress={handleBack} style={styles.backBtn}>
              <Text style={styles.backText}>← Back</Text>
            </TouchableOpacity>
          )}
          <Text style={styles.title}>
            {step === 'enter' ? 'Set up your PIN' : 'Confirm your PIN'}
          </Text>
          <Text style={styles.subtitle}>
            {step === 'enter'
              ? 'Choose a 6-digit PIN to secure your account'
              : 'Enter your PIN again to confirm'}
          </Text>
        </View>

        <View style={styles.dotsRow}>
          {Array.from({ length: PIN_LENGTH }).map((_, i) => (
            <View
              key={i}
              style={[styles.dot, i < current.length ? styles.dotFilled : undefined]}
            />
          ))}
        </View>

        {error ? <Text style={styles.errorText}>{error}</Text> : null}

        <View style={styles.pad}>
          {[
            ['1', '2', '3'],
            ['4', '5', '6'],
            ['7', '8', '9'],
            ['', '0', '⌫'],
          ].map((row, ri) => (
            <View key={ri} style={styles.padRow}>
              {row.map((key) => (
                <TouchableOpacity
                  key={key}
                  style={[styles.key, key === '' ? styles.keyInvisible : undefined]}
                  onPress={() => (key === '⌫' ? handleDelete() : key !== '' ? handleDigit(key) : null)}
                  activeOpacity={0.7}
                  disabled={key === ''}
                >
                  <Text style={styles.keyText}>{key}</Text>
                </TouchableOpacity>
              ))}
            </View>
          ))}
        </View>
      </View>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#F0F2FF' },
  inner: { flex: 1, alignItems: 'center', justifyContent: 'center', padding: 24 },
  header: { alignItems: 'center', marginBottom: 40, width: '100%' },
  backBtn: { alignSelf: 'flex-start', marginBottom: 16 },
  backText: { color: '#5B6EF5', fontWeight: '600', fontSize: 15 },
  title: { fontSize: 26, fontWeight: '700', color: '#1A1A2E', textAlign: 'center', marginBottom: 8 },
  subtitle: { fontSize: 14, color: '#6B7280', textAlign: 'center' },
  dotsRow: { flexDirection: 'row', gap: 16, marginBottom: 16 },
  dot: {
    width: 18,
    height: 18,
    borderRadius: 9,
    borderWidth: 2,
    borderColor: '#5B6EF5',
    backgroundColor: 'transparent',
  },
  dotFilled: { backgroundColor: '#5B6EF5' },
  errorText: { color: '#E53E3E', fontSize: 13, marginBottom: 16, textAlign: 'center' },
  pad: { width: '100%', maxWidth: 280, marginTop: 8 },
  padRow: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 16 },
  key: {
    width: 72,
    height: 72,
    borderRadius: 36,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#5B6EF5',
    shadowOpacity: 0.07,
    shadowRadius: 8,
    shadowOffset: { width: 0, height: 4 },
    elevation: 3,
  },
  keyInvisible: { backgroundColor: 'transparent', shadowOpacity: 0, elevation: 0 },
  keyText: { fontSize: 22, fontWeight: '600', color: '#1A1A2E' },
});
