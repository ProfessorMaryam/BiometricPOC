import { useState } from 'react';
import { loginUser } from '@/services/api';
import { saveToken, saveEmail, setBiometricsEnabled } from '@/services/auth';
import * as LocalAuthentication from 'expo-local-authentication';

import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
} from 'react-native';
import { useRouter } from 'expo-router';

export default function LoginScreen() {
  const router = useRouter();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [errors, setErrors] = useState<{ email?: string; password?: string }>({});

  function validate() {
    const e: typeof errors = {};
    if (!email.trim()) {
      e.email = 'Email is required.';
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim())) {
      e.email = 'Enter a valid email address.';
    }
    if (!password) {
      e.password = 'Password is required.';
    } else if (password.length < 6) {
      e.password = 'Password must be at least 6 characters.';
    }
    return e;
  }

  async function handleLogin() {
    const e = validate();
    if (Object.keys(e).length > 0) { setErrors(e); return; }

    try {
      const user = await loginUser(email, password);
      if (user.token) await saveToken(user.token);
      await saveEmail(user.email);
      await setBiometricsEnabled(user.biometricEnabled);

      if (user.biometricEnabled) {
        const hardware = await LocalAuthentication.hasHardwareAsync();
        const enrolled = await LocalAuthentication.isEnrolledAsync();

        if (hardware && enrolled) {
          const result = await LocalAuthentication.authenticateAsync({
            promptMessage: 'Authenticate to continue',
            cancelLabel: 'Cancel',
            disableDeviceFallback: true,
          });

          if (result.success) {
            router.replace('/home');
          } else {
            router.replace('/verify-pin');
          }
          return;
        }
      }

      router.replace('/home');
    } catch (err: any) {
      setErrors({ password: err.message });
    }
  }

  return (
    <KeyboardAvoidingView
      style={styles.flex}
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
    >
      <ScrollView contentContainerStyle={styles.container} keyboardShouldPersistTaps="handled">
        <View style={styles.header}>
          <Text style={styles.title}>Welcome back</Text>
          <Text style={styles.subtitle}>Sign in to continue</Text>
        </View>

        <View style={styles.card}>
          <Field
            label="Email"
            value={email}
            onChangeText={(t) => { setEmail(t); setErrors((p) => ({ ...p, email: undefined })); }}
            placeholder="you@example.com"
            keyboardType="email-address"
            autoCapitalize="none"
            error={errors.email}
          />
          <Field
            label="Password"
            value={password}
            onChangeText={(t) => { setPassword(t); setErrors((p) => ({ ...p, password: undefined })); }}
            placeholder="••••••••"
            secureTextEntry
            error={errors.password}
          />

          <TouchableOpacity style={styles.btn} onPress={handleLogin} activeOpacity={0.85}>
            <Text style={styles.btnText}>Sign In</Text>
          </TouchableOpacity>

          <TouchableOpacity onPress={() => router.push('/register')} style={styles.linkRow}>
            <Text style={styles.linkText}>
              Don't have an account? <Text style={styles.link}>Register</Text>
            </Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

function Field({
  label,
  error,
  ...props
}: {
  label: string;
  error?: string;
} & React.ComponentProps<typeof TextInput>) {
  return (
    <View style={styles.fieldWrap}>
      <Text style={styles.label}>{label}</Text>
      <TextInput
        style={[styles.input, error ? styles.inputError : undefined]}
        placeholderTextColor="#A0AEC0"
        {...props}
      />
      {error ? <Text style={styles.errorText}>{error}</Text> : null}
    </View>
  );
}

const styles = StyleSheet.create({
  flex: { flex: 1, backgroundColor: '#F0F2FF' },
  container: { flexGrow: 1, justifyContent: 'center', padding: 24 },
  header: { marginBottom: 32, alignItems: 'center' },
  title: { fontSize: 30, fontWeight: '700', color: '#1A1A2E', marginBottom: 6 },
  subtitle: { fontSize: 15, color: '#6B7280' },
  card: {
    backgroundColor: '#fff',
    borderRadius: 20,
    padding: 24,
    shadowColor: '#5B6EF5',
    shadowOpacity: 0.08,
    shadowRadius: 20,
    shadowOffset: { width: 0, height: 8 },
    elevation: 4,
  },
  fieldWrap: { marginBottom: 16 },
  label: { fontSize: 13, fontWeight: '600', color: '#374151', marginBottom: 6 },
  input: {
    borderWidth: 1.5,
    borderColor: '#E2E8F0',
    borderRadius: 12,
    paddingHorizontal: 14,
    paddingVertical: 12,
    fontSize: 15,
    color: '#1A1A2E',
    backgroundColor: '#FAFAFA',
  },
  inputError: { borderColor: '#E53E3E' },
  errorText: { marginTop: 4, fontSize: 12, color: '#E53E3E' },
  btn: {
    backgroundColor: '#5B6EF5',
    borderRadius: 12,
    paddingVertical: 14,
    alignItems: 'center',
    marginTop: 8,
  },
  btnText: { color: '#fff', fontWeight: '700', fontSize: 16 },
  linkRow: { marginTop: 20, alignItems: 'center' },
  linkText: { fontSize: 14, color: '#6B7280' },
  link: { color: '#5B6EF5', fontWeight: '600' },
});
