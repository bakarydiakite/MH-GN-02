import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';

interface TransactionItemProps {
  title: string;
  sub: string;
  value: string;
  icon: any;
  color: string;
  time?: string;
  onPress?: () => void;
}

export const TransactionItem = ({ title, sub, value, icon, color, time = '12:45', onPress }: TransactionItemProps) => (
  <TouchableOpacity style={styles.transactionItem} onPress={onPress} disabled={!onPress}>
    <View style={[styles.itemIconContainer, { backgroundColor: color + '15' }]}>
      <MaterialIcons name={icon} size={24} color={color} />
    </View>
    <View style={styles.itemContent}>
      <Text style={styles.itemTitle}>{title}</Text>
      <Text style={styles.itemSub}>{sub}</Text>
    </View>
    <View style={styles.itemValueContainer}>
      <Text style={styles.itemValue}>{value}</Text>
      <Text style={styles.itemDate}>{time}</Text>
    </View>
  </TouchableOpacity>
);

const styles = StyleSheet.create({
  transactionItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 16,
  },
  itemIconContainer: {
    width: 52,
    height: 52,
    borderRadius: 26,
    justifyContent: 'center',
    alignItems: 'center',
  },
  itemContent: {
    flex: 1,
  },
  itemTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: '#171d19',
  },
  itemSub: {
    fontSize: 12,
    color: '#6d7a72',
    marginTop: 2,
  },
  itemValueContainer: {
    alignItems: 'flex-end',
  },
  itemValue: {
    fontSize: 16,
    fontWeight: '800',
    color: '#171d19',
  },
  itemDate: {
    fontSize: 11,
    color: '#6d7a72',
    marginTop: 2,
  },
});
