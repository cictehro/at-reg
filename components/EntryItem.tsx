import React from 'react';
import { Image, Pressable, StyleSheet, Text, View } from 'react-native';
import { Entry } from '../types';
import { colors, radius, shadow, spacing } from '../theme';

type Props = {
  entry: Entry;
  onDelete: (id: string) => void;
};

export default function EntryItem({ entry, onDelete }: Props) {
  return (
    <View style={styles.card}>
      <Image source={{ uri: entry.photoUri }} style={styles.photo} />
      <View style={styles.details}>
        <Text style={styles.name} numberOfLines={1}>
          {entry.name}
        </Text>
        <Text style={styles.admission} numberOfLines={1}>
          {entry.admissionNumber}
        </Text>
      </View>
      <Pressable
        onPress={() => onDelete(entry.id)}
        accessibilityRole="button"
        accessibilityLabel={`Delete ${entry.name}`}
        style={({ pressed }) => [styles.delete, pressed && styles.deletePressed]}
      >
        <Text style={styles.deleteText}>Delete</Text>
      </Pressable>
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.surface,
    borderRadius: radius.md,
    padding: spacing.md,
    marginBottom: spacing.md,
    ...shadow,
  },
  photo: {
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: colors.background,
  },
  details: {
    flex: 1,
    marginHorizontal: spacing.md,
  },
  name: {
    fontSize: 17,
    fontWeight: '700',
    color: colors.text,
  },
  admission: {
    marginTop: spacing.xs,
    fontSize: 15,
    color: colors.textSecondary,
  },
  delete: {
    paddingVertical: spacing.sm,
    paddingHorizontal: spacing.md,
    borderRadius: radius.sm,
    borderWidth: 1.5,
    borderColor: colors.error,
  },
  deletePressed: {
    opacity: 0.6,
  },
  deleteText: {
    color: colors.error,
    fontSize: 14,
    fontWeight: '700',
  },
});
