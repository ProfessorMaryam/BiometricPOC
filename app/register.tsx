import { useState } from 'react';
import { registerUser } from '@/services/api';
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

export default function RegisterScreen() {
  const router = useRouter();

  const [form, setForm] = useState({ email: '', fullName: '', password: '', confirm: '' });
  const [errors, setErrors] = useState<Partial<typeof form>>({});

  function set(field: keyof typeof form, value: string) {
    setForm((p) => ({ ...p, [field]: value }));
    setErrors((p) => ({ ...p, [field]: undefined }));
  }

  function validate() {
    const e: Partial<typeof form> = {};
    if (!form.email.trim()) {
      e.email = 'Email is required.';
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email.trim())) {
      e.email = 'Enter a valid email address.';
    }
    if (!form.fullName.trim()) {
      e.fullName = 'Full name is required.';
    }
    if (!form.password) {
      e.password = 'Password is required.';
    } else if (form.password.length < 8) {
      e.password = 'Password must be at least 8 characters.';
    } else if (!/[A-Z]/.test(form.password)) {
      e.password = 'Password must contain at least one uppercase letter.';
    } else if (!/[0-9]/.test(form.password)) {
      e.password = 'Password must contain at least one number.';
    }
    if (!form.confirm) {
      e.confirm = 'Please confirm your password.';
    } else if (form.confirm !== form.password) {
      e.confirm = 'Passwords do not match.';
    }
    return e;
  }

  async function handleRegister() {
  const e = validate();
  if (Object.keys(e).length > 0) { setErrors(e); return; }

  try {
    const user = await registerUser(form.email, form.fullName, form.password);
    console.log('Registered as', user.fullName);
    router.push('/setup-pin');
  } catch (err: any) {
    setErrors({ email: err.message }); // show server error under email field
  }
}

  return (
    <KeyboardAvoidingView
      style={styles.flex}
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
    >
      <ScrollView contentContainerStyle={styles.container} keyboardShouldPersistTaps="handled">
        <View style={styles.header}>
          <Text style={styles.title}>Create account</Text>
          <Text style={styles.subtitle}>Fill in your details to get started</Text>
        </View>

        <View style={styles.card}>
          <Field
            label="Full Name"
            value={form.fullName}
            onChangeText={(t) => set('fullName', t)}
            placeholder="Jane Doe"
            error={errors.fullName}
          />
          <Field
            label="Email"
            value={form.email}
            onChangeText={(t) => set('email', t)}
            placeholder="you@example.com"
            keyboardType="email-address"
            autoCapitalize="none"
            error={errors.email}
          />
          <Field
            label="Password"
            value={form.password}
            onChangeText={(t) => set('password', t)}
            placeholder="••••••••"
            secureTextEntry
            error={errors.password}
          />
          <Field
            label="Confirm Password"
            value={form.confirm}
            onChangeText={(t) => set('confirm', t)}
            placeholder="••••••••"
            secureTextEntry
            error={errors.confirm}
          />

          <Text style={styles.hint}>
            Min. 8 characters, one uppercase letter, one number.
          </Text>

          <TouchableOpacity style={styles.btn} onPress={handleRegister} activeOpacity={0.85}>
            <Text style={styles.btnText}>Create Account</Text>
          </TouchableOpacity>

          <TouchableOpacity onPress={() => router.back()} style={styles.linkRow}>
            <Text style={styles.linkText}>
              Already have an account? <Text style={styles.link}>Sign in</Text>
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
  hint: { fontSize: 12, color: '#9CA3AF', marginBottom: 12, marginTop: -4 },
  btn: {
    backgroundColor: '#5B6EF5',
    borderRadius: 12,
    paddingVertical: 14,
    alignItems: 'center',
    marginTop: 4,
  },
  btnText: { color: '#fff', fontWeight: '700', fontSize: 16 },
  linkRow: { marginTop: 20, alignItems: 'center' },
  linkText: { fontSize: 14, color: '#6B7280' },
  link: { color: '#5B6EF5', fontWeight: '600' },
});
