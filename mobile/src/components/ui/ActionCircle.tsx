import React from 'react';
import { TouchableOpacity, View, Text, StyleSheet } from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';

interface ActionCircleProps {
  icon: any;
  label: string;
  color: string;
  onPress?: () => void;
}

export const ActionCircle = ({ icon, label, color, onPress }: ActionCircleProps) => (
  <TouchableOpacity style={styles.actionCircleContainer} onPress={onPress}>
    <View style={[styles.circleIcon, { borderColor: color + '33' }]}>
      <MaterialIcons name={icon} size={28} color={color} />
    </View>
    <Text style={styles.circleLabel}>{label}</Text>
  </TouchableOpacity>
);

const styles = StyleSheet.create({
  actionCircleContainer: {
    alignItems: 'center',
    gap: 8,
  },
  circleIcon: {
    width: 68,
    height: 68,
    borderRadius: 34,
    borderWidth: 1.5,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.05,
    shadowRadius: 10,
    elevation: 2,
  },
  circleLabel: {
    fontSize: 13,
    fontWeight: '600',
    color: '#6d7a72',
  },
});
