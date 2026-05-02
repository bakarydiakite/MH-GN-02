import React from 'react';
import { 
  TouchableOpacity, 
  Text, 
  StyleSheet, 
  ActivityIndicator, 
  ViewStyle, 
  TextStyle 
} from 'react-native';
import { Colors } from '../../theme/colors';

/**
 * Interface Defining Button Props
 * Follows the Interface Segregation Principle
 */
interface ButtonProps {
  title: string;
  onPress: () => void;
  variant?: 'primary' | 'secondary' | 'outline' | 'ghost';
  isLoading?: boolean;
  disabled?: boolean;
  style?: ViewStyle;
  textStyle?: TextStyle;
}

/**
 * Modular Button Component
 * Follows SOLID principles:
 * - Single Responsibility: Handles only the button interaction and display.
 * - Open/Closed: Can be extended via the 'variant' and 'style' props.
 * - Liskov Substitution: Extends standard touchable properties.
 */
export const Button: React.FC<ButtonProps> = ({
  title,
  onPress,
  variant = 'primary',
  isLoading = false,
  disabled = false,
  style,
  textStyle,
}) => {
  const isPrimary = variant === 'primary';
  const isOutline = variant === 'outline';
  
  const buttonStyles = [
    styles.base,
    isPrimary && styles.primary,
    isOutline && styles.outline,
    disabled && styles.disabled,
    style,
  ];

  const labelStyles = [
    styles.text,
    isPrimary && styles.textPrimary,
    isOutline && styles.textOutline,
    textStyle,
  ];

  return (
    <TouchableOpacity
      onPress={onPress}
      disabled={disabled || isLoading}
      activeOpacity={0.7}
      style={buttonStyles}
    >
      {isLoading ? (
        <ActivityIndicator color={isPrimary ? '#FFFFFF' : Colors.primary} />
      ) : (
        <Text style={labelStyles}>{title}</Text>
      )}
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  base: {
    height: 52,
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 24,
    flexDirection: 'row',
  },
  primary: {
    backgroundColor: Colors.primary,
  },
  outline: {
    backgroundColor: 'transparent',
    borderWidth: 1.5,
    borderColor: Colors.primary,
  },
  disabled: {
    opacity: 0.5,
  },
  text: {
    fontSize: 16,
    fontWeight: '600',
    textAlign: 'center',
  },
  textPrimary: {
    color: '#FFFFFF',
  },
  textOutline: {
    color: Colors.primary,
  },
});
