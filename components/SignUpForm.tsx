import React, { useRef, useState } from 'react';
import {
  ActivityIndicator,
  Animated,
  Pressable,
  StyleSheet,
  Text,
  TextInput,
  View,
} from 'react-native';
import PhotoPicker from './PhotoPicker';
import { NewEntry } from '../types';
import { colors, radius, shadow, spacing } from '../theme';

type Props = {
  onSubmit: (entry: NewEntry) => Promise<void>;
};

export default function SignUpForm({ onSubmit }: Props) {
  const [name, setName] = useState('');
  const [admissionNumber, setAdmissionNumber] = useState('');
  const [photoUri, setPhotoUri] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);
  const successOpacity = useRef(new Animated.Value(0)).current;
  const admissionRef = useRef<TextInput>(null);

  const trimmedName = name.trim();
  const trimmedAdmission = admissionNumber.trim();
  const ready = trimmedName !== '' && trimmedAdmission !== '' && photoUri !== null;

  const hint =
    trimmedName === ''
      ? 'Enter your full name'
      : trimmedAdmission === ''
      ? 'Enter your admission number'
      : photoUri === null
      ? 'Add a photo'
      : '';

  const showSuccess = () => {
    successOpacity.setValue(0);
    Animated.sequence([
      Animated.timing(successOpacity, { toValue: 1, duration: 200, useNativeDriver: true }),
      Animated.delay(1600),
      Animated.timing(successOpacity, { toValue: 0, duration: 500, useNativeDriver: true }),
    ]).start();
  };

  const submit = async () => {
    if (!ready || saving || photoUri === null) return;
    setSaving(true);
    await new Promise((resolve) => setTimeout(resolve, 400));
    await onSubmit({ name: trimmedName, admissionNumber: trimmedAdmission, photoUri });
    setName('');
    setAdmissionNumber('');
    setPhotoUri(null);
    setSaving(false);
    showSuccess();
  };

  return (
    <View style={styles.card}>
      <PhotoPicker uri={photoUri} onChange={setPhotoUri} />

      <Text style={styles.label}>Full name</Text>
      <TextInput
        value={name}
        onChangeText={setName}
        placeholder="Jane Wanjiku"
        placeholderTextColor={colors.placeholder}
        style={styles.input}
        autoCapitalize="words"
        returnKeyType="next"
        onSubmitEditing={() => admissionRef.current?.focus()}
      />

      <Text style={styles.label}>Admission number</Text>
      <TextInput
        ref={admissionRef}
        value={admissionNumber}
        onChangeText={setAdmissionNumber}
        placeholder="e.g. CIT/00123/2023"
        placeholderTextColor={colors.placeholder}
        style={styles.input}
        autoCapitalize="characters"
        returnKeyType="done"
      />

      <View style={styles.message}>
        {hint !== '' && <Text style={styles.hint}>{hint}</Text>}
        <Animated.Text style={[styles.success, { opacity: successOpacity }]}>
          Registered successfully
        </Animated.Text>
      </View>

      <Pressable
        onPress={submit}
        disabled={!ready || saving}
        accessibilityRole="button"
        style={({ pressed }) => [
          styles.button,
          (!ready || saving) && styles.buttonDisabled,
          pressed && styles.buttonPressed,
        ]}
      >
        {saving ? (
          <ActivityIndicator color={colors.onAccent} />
        ) : (
          <Text style={styles.buttonText}>Register</Text>
        )}
      </Pressable>
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: colors.surface,
    borderRadius: radius.md,
    padding: spacing.lg,
    ...shadow,
  },
  label: {
    marginTop: spacing.md,
    marginBottom: spacing.xs,
    fontSize: 15,
    fontWeight: '600',
    color: colors.text,
  },
  input: {
    height: 50,
    borderWidth: 1.5,
    borderColor: colors.border,
    borderRadius: radius.sm,
    paddingHorizontal: spacing.md,
    fontSize: 16,
    color: colors.text,
    backgroundColor: colors.surface,
  },
  message: {
    height: 28,
    justifyContent: 'center',
    marginTop: spacing.sm,
  },
  hint: {
    position: 'absolute',
    color: colors.error,
    fontSize: 14,
    fontWeight: '600',
  },
  success: {
    color: colors.success,
    fontSize: 15,
    fontWeight: '700',
  },
  button: {
    height: 52,
    borderRadius: radius.sm,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: colors.accent,
    ...shadow,
  },
  buttonDisabled: {
    backgroundColor: colors.accentDisabled,
    shadowOpacity: 0,
    elevation: 0,
  },
  buttonPressed: {
    opacity: 0.85,
  },
  buttonText: {
    color: colors.onAccent,
    fontSize: 17,
    fontWeight: '700',
  },
});
