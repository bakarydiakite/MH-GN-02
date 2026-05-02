import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Image } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

interface SocialLoginButtonsProps {
  onGooglePress: () => void;
  isLoading?: boolean;
}

export const SocialLoginButtons: React.FC<SocialLoginButtonsProps> = ({ onGooglePress, isLoading }) => {
  return (
    <View style={styles.container}>
      <View style={styles.dividerContainer}>
        <View style={styles.line} />
        <Text style={styles.dividerText}>Ou continuer avec</Text>
        <View style={styles.line} />
      </View>

      <View style={styles.buttonsRow}>
        <TouchableOpacity 
          style={styles.socialButton} 
          onPress={onGooglePress}
          disabled={isLoading}
        >
          <Image 
            source={{ uri: 'https://upload.wikimedia.org/wikipedia/commons/5/53/Google_%22G%22_Logo.svg' }} 
            style={styles.googleIcon}
            resizeMode="contain"
          />
          <Text style={styles.buttonText}>Google</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.socialButton} disabled={isLoading}>
          <Ionicons name="logo-apple" size={24} color="#000" />
          <Text style={styles.buttonText}>Apple</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: { width: '100%', marginTop: 25 },
  dividerContainer: { flexDirection: 'row', alignItems: 'center', marginBottom: 20 },
  line: { flex: 1, height: 1, backgroundColor: '#E0E0E0' },
  dividerText: { marginHorizontal: 15, color: '#9E9E9E', fontSize: 13, fontWeight: '600' },
  buttonsRow: { flexDirection: 'row', gap: 15 },
  socialButton: {
    flex: 1,
    height: 56,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: '#E0E0E0',
    backgroundColor: '#fff',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 12,
  },
  googleIcon: { width: 24, height: 24 },
  buttonText: { fontSize: 15, fontWeight: '700', color: '#1A1A1A' },
});
