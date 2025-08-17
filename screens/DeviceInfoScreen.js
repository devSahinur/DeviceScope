import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useTheme } from '../contexts/ThemeContext';
import EnhancedDeviceInfo from '../components/EnhancedDeviceInfo';
import ThemeToggle from '../components/ThemeToggle';

const DeviceInfoScreen = () => {
  const { colors } = useTheme();

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      {/* Header */}
      <View style={[styles.header, { backgroundColor: colors.surface, borderColor: colors.border }]}>
        <View style={styles.headerLeft}>
          <View style={[styles.iconContainer, { backgroundColor: colors.primary + '20' }]}>
            <Ionicons name="phone-portrait" size={24} color={colors.primary} />
          </View>
          <View>
            <Text style={[styles.title, { color: colors.text }]}>
              DeviceScope
            </Text>
            <Text style={[styles.subtitle, { color: colors.textSecondary }]}>
              Comprehensive Device Intelligence • Real-time Monitoring
            </Text>
          </View>
        </View>
        
        <View style={styles.headerRight}>
          <Text style={[styles.statusText, { color: colors.textSecondary }]}>
            Real-time monitoring
          </Text>
          <ThemeToggle />
        </View>
      </View>

      {/* Main Content */}
      <EnhancedDeviceInfo />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: 16,
    borderBottomWidth: 1,
  },
  headerLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  iconContainer: {
    width: 48,
    height: 48,
    borderRadius: 24,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
  },
  subtitle: {
    fontSize: 12,
    marginTop: 2,
  },
  headerRight: {
    alignItems: 'flex-end',
  },
  statusText: {
    fontSize: 12,
    marginBottom: 8,
  },
});

export default DeviceInfoScreen;