import React from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  TouchableOpacity, 
  Animated, 
  Dimensions,
  Platform 
} from 'react-native';
import { MaterialIcons, Ionicons } from '@expo/vector-icons';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useNotification, NotificationType } from '../../store/NotificationContext';

const { width } = Dimensions.get('window');

const TOAST_WIDTH = width - 40;

export const GlobalToastContainer = () => {
  const { notifications, hideNotification } = useNotification();
  const insets = useSafeAreaInsets();

  // Position it above the floating tab bar (which is at bottom: 25)
  const bottomOffset = insets.bottom + 110; 

  return (
    <View style={[styles.container, { bottom: bottomOffset }]} pointerEvents="box-none">
      {notifications.map((notif) => (
        <ToastItem 
          key={notif.id} 
          notif={notif} 
          onClose={() => hideNotification(notif.id)} 
        />
      ))}
    </View>
  );
};

const ToastItem = ({ notif, onClose }: { notif: any, onClose: () => void }) => {
  const [fadeAnim] = React.useState(new Animated.Value(0));
  const [slideAnim] = React.useState(new Animated.Value(20));

  React.useEffect(() => {
    Animated.parallel([
      Animated.timing(fadeAnim, { toValue: 1, duration: 300, useNativeDriver: true }),
      Animated.timing(slideAnim, { toValue: 0, duration: 300, useNativeDriver: true }),
    ]).start();
  }, []);

  const getTypeStyles = (type: NotificationType) => {
    switch (type) {
      case 'error':
        return { 
          bg: '#2C2C2C', 
          accent: '#FF5252', 
          icon: 'error-outline' as const 
        };
      case 'success':
        return { 
          bg: '#2C2C2C', 
          accent: '#80f9c2', 
          icon: 'check-circle-outline' as const 
        };
      case 'warning':
        return { 
          bg: '#2C2C2C', 
          accent: '#FFAB40', 
          icon: 'warning-amber' as const 
        };
      default:
        return { 
          bg: '#2C2C2C', 
          accent: '#536DFE', 
          icon: 'info-outline' as const 
        };
    }
  };

  const config = getTypeStyles(notif.type);

  return (
    <Animated.View style={[
      styles.toast, 
      { 
        opacity: fadeAnim, 
        transform: [{ translateY: slideAnim }],
        backgroundColor: config.bg,
        borderLeftColor: config.accent,
        borderLeftWidth: 4
      }
    ]}>
      <View style={styles.iconContainer}>
        <MaterialIcons name={config.icon} size={22} color={config.accent} />
      </View>
      <View style={styles.textContainer}>
        <Text style={styles.message} numberOfLines={3}>{notif.message}</Text>
      </View>
      <TouchableOpacity onPress={onClose} style={styles.closeBtn}>
        <Ionicons name="close" size={20} color="rgba(255,255,255,0.5)" />
      </TouchableOpacity>
    </Animated.View>
  );
};

const styles = StyleSheet.create({
  container: {
    position: 'absolute',
    left: 20,
    right: 20,
    alignItems: 'center',
    gap: 10,
    zIndex: 9999,
  },
  toast: {
    width: TOAST_WIDTH,
    borderRadius: 16,
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 12,
    paddingHorizontal: 16,
    ...Platform.select({
      ios: {
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 10 },
        shadowOpacity: 0.3,
        shadowRadius: 20,
      },
      android: {
        elevation: 12,
      },
    }),
  },
  iconContainer: {
    marginRight: 12,
  },
  textContainer: {
    flex: 1,
  },
  message: {
    color: '#FFFFFF',
    fontSize: 13,
    fontWeight: '600',
    lineHeight: 18,
  },
  closeBtn: {
    marginLeft: 10,
    padding: 4,
  },
});
