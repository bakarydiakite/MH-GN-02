import React from 'react';
import { View, StyleSheet, Animated, Dimensions } from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';
import { Colors } from '../../theme/colors';

const { width: SCREEN_WIDTH } = Dimensions.get('window');

interface Props {
  iconName: keyof typeof MaterialIcons.glyphMap;
  index: number;
  scrollX: Animated.Value;
}

/**
 * IllustrationCircle
 * A modern, abstract illustration component with a futuristic feel.
 * Uses overlapping circles and opacity to create depth.
 */
export const IllustrationCircle: React.FC<Props> = ({ iconName, index, scrollX }) => {
  const scale = scrollX.interpolate({
    inputRange: [(index - 1) * SCREEN_WIDTH, index * SCREEN_WIDTH, (index + 1) * SCREEN_WIDTH],
    outputRange: [0.8, 1, 0.8],
    extrapolate: 'clamp',
  });

  return (
    <Animated.View style={[styles.container, { transform: [{ scale }] }]}>
      <View style={[styles.circle, styles.outerCircle]} />
      <View style={[styles.circle, styles.midCircle]} />
      <View style={[styles.circle, styles.innerCircle]}>
        <View style={styles.iconContainer}>
          <View style={styles.iconBackground} />
          <MaterialIcons name={iconName} size={56} color={Colors.primary} />
        </View>
      </View>
    </Animated.View>
  );
};

const styles = StyleSheet.create({
  container: {
    width: 280,
    height: 280,
    justifyContent: 'center',
    alignItems: 'center',
  },
  circle: {
    position: 'absolute',
    borderRadius: 999,
  },
  outerCircle: {
    width: 280,
    height: 280,
    backgroundColor: 'rgba(0, 105, 72, 0.03)',
    borderWidth: 1,
    borderColor: 'rgba(0, 105, 72, 0.05)',
  },
  midCircle: {
    width: 220,
    height: 220,
    backgroundColor: 'rgba(0, 105, 72, 0.05)',
    borderWidth: 1,
    borderColor: 'rgba(0, 105, 72, 0.1)',
  },
  innerCircle: {
    width: 160,
    height: 160,
    backgroundColor: '#FFFFFF',
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: Colors.primary,
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.1,
    shadowRadius: 20,
    elevation: 10,
  },
  iconContainer: {
    width: 100,
    height: 100,
    borderRadius: 50,
    justifyContent: 'center',
    alignItems: 'center',
    overflow: 'hidden',
  },
  iconBackground: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: Colors.primary,
    opacity: 0.05,
  },
  icon: {
    fontSize: 56,
  },
});
