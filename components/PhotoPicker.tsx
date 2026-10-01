import React from 'react';
import { Alert, Image, Pressable, StyleSheet, Text } from 'react-native';
import * as ImagePicker from 'expo-image-picker';
import { colors, shadow } from '../theme';

type Props = {
  uri: string | null;
  onChange: (uri: string) => void;
};

const options: ImagePicker.ImagePickerOptions = {
  mediaTypes: ['images'],
  allowsEditing: true,
  aspect: [1, 1],
  quality: 0.7,
};

export default function PhotoPicker({ uri, onChange }: Props) {
  const fromCamera = async () => {
    const permission = await ImagePicker.requestCameraPermissionsAsync();
    if (!permission.granted) {
      Alert.alert('Camera blocked', 'Allow camera access in Settings to take a photo.');
      return;
    }
    const result = await ImagePicker.launchCameraAsync(options);
    if (!result.canceled) onChange(result.assets[0].uri);
  };

  const fromGallery = async () => {
    const result = await ImagePicker.launchImageLibraryAsync(options);
    if (!result.canceled) onChange(result.assets[0].uri);
  };

  const choose = () => {
    Alert.alert('Add a photo', 'Choose a source', [
      { text: 'Camera', onPress: fromCamera },
      { text: 'Gallery', onPress: fromGallery },
      { text: 'Cancel', style: 'cancel' },
    ]);
  };

  return (
    <Pressable
      onPress={choose}
      accessibilityRole="button"
      accessibilityLabel="Choose a photo"
      style={({ pressed }) => [styles.circle, pressed && styles.pressed]}
    >
      {uri ? (
        <Image source={{ uri }} style={styles.image} />
      ) : (
        <Text style={styles.placeholder}>Add photo</Text>
      )}
    </Pressable>
  );
}

const styles = StyleSheet.create({
  circle: {
    width: 120,
    height: 120,
    borderRadius: 60,
    alignSelf: 'center',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: colors.surface,
    borderWidth: 2,
    borderColor: colors.accent,
    overflow: 'hidden',
    ...shadow,
  },
  pressed: {
    opacity: 0.8,
  },
  image: {
    width: '100%',
    height: '100%',
  },
  placeholder: {
    color: colors.accent,
    fontSize: 16,
    fontWeight: '700',
  },
});
