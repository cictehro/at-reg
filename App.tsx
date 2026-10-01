import React, { useCallback, useEffect, useState } from 'react';
import {
  FlatList,
  Keyboard,
  KeyboardAvoidingView,
  Platform,
  StatusBar,
  StyleSheet,
  Text,
  TouchableWithoutFeedback,
  View,
} from 'react-native';
import { SafeAreaProvider, SafeAreaView } from 'react-native-safe-area-context';
import SignUpForm from './components/SignUpForm';
import EntryItem from './components/EntryItem';
import { loadEntries, saveEntries } from './storage';
import { Entry, NewEntry } from './types';
import { colors, spacing } from './theme';

export default function App() {
  const [entries, setEntries] = useState<Entry[]>([]);

  useEffect(() => {
    loadEntries().then(setEntries);
  }, []);

  const addEntry = useCallback(
    async (data: NewEntry) => {
      const entry: Entry = {
        ...data,
        id: `${Date.now()}-${Math.random().toString(36).slice(2, 8)}`,
        timestamp: Date.now(),
      };
      const next = [entry, ...entries];
      await saveEntries(next);
      setEntries(next);
    },
    [entries]
  );

  const deleteEntry = useCallback(
    async (id: string) => {
      const next = entries.filter((entry) => entry.id !== id);
      setEntries(next);
      await saveEntries(next);
    },
    [entries]
  );

  return (
    <SafeAreaProvider style={styles.screen}>
      <SafeAreaView style={styles.screen}>
        <StatusBar barStyle="dark-content" backgroundColor={colors.background} />
        <KeyboardAvoidingView
          style={styles.flex}
          behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        >
          <TouchableWithoutFeedback onPress={Keyboard.dismiss} accessible={false}>
            <View style={styles.flex}>
              <FlatList
                data={entries}
                keyExtractor={(item) => item.id}
                renderItem={({ item }) => <EntryItem entry={item} onDelete={deleteEntry} />}
                keyboardShouldPersistTaps="handled"
                keyboardDismissMode="on-drag"
                contentContainerStyle={styles.content}
                ListHeaderComponent={
                  <View>
                    <Text style={styles.title}>Attendance Register</Text>
                    <SignUpForm onSubmit={addEntry} />
                    <Text style={styles.count}>{entries.length} registered</Text>
                  </View>
                }
                ListEmptyComponent={
                  <Text style={styles.empty}>No entries yet. Sign up above.</Text>
                }
              />
            </View>
          </TouchableWithoutFeedback>
        </KeyboardAvoidingView>
      </SafeAreaView>
    </SafeAreaProvider>
  );
}

const styles = StyleSheet.create({
  flex: {
    flex: 1,
  },
  screen: {
    flex: 1,
    backgroundColor: colors.background,
  },
  content: {
    padding: spacing.md,
    paddingBottom: spacing.lg * 2,
  },
  title: {
    fontSize: 28,
    fontWeight: '800',
    color: colors.text,
    marginBottom: spacing.md,
  },
  count: {
    marginTop: spacing.lg,
    marginBottom: spacing.md,
    fontSize: 18,
    fontWeight: '700',
    color: colors.text,
  },
  empty: {
    fontSize: 16,
    color: colors.textSecondary,
    textAlign: 'center',
    paddingVertical: spacing.lg,
  },
});
