import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  Dimensions,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useTheme } from '../contexts/ThemeContext';
import EnhancedDeviceInfo from '../components/EnhancedDeviceInfo';
import ThemeToggle from '../components/ThemeToggle';

const DeviceInfoScreen = () => {
  const { colors } = useTheme();
  const { width } = Dimensions.get('window');
  const isSmallScreen = width < 600;

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      {/* Header */}
      <View style={[styles.header, { backgroundColor: colors.surface, borderColor: colors.border }]}>
        <View style={[styles.headerContent, isSmallScreen && styles.headerContentSmall]}>
          <View style={[styles.headerLeft, isSmallScreen && styles.headerLeftSmall]}>
            <View style={[styles.iconContainer, { backgroundColor: colors.primary + '20' }]}>
              <Ionicons name="phone-portrait" size={isSmallScreen ? 20 : 24} color={colors.primary} />
            </View>
            <View style={styles.titleContainer}>
              <Text style={[styles.title, { color: colors.text }, isSmallScreen && styles.titleSmall]}>
                DeviceScope
              </Text>
              {!isSmallScreen && (
                <Text style={[styles.subtitle, { color: colors.textSecondary }]}>
                  Comprehensive Device Intelligence • Real-time Monitoring
                </Text>
              )}
            </View>
          </View>
          
          <View style={[styles.headerRight, isSmallScreen && styles.headerRightSmall]}>
            {!isSmallScreen && (
              <Text style={[styles.statusText, { color: colors.textSecondary }]}>
                Real-time monitoring
              </Text>
            )}
            <ThemeToggle />
          </View>
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
    borderBottomWidth: 1,
    paddingHorizontal: 16,
    paddingVertical: 12,
    minHeight: 70,
  },
  headerContent: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    width: '100%',
  },
  headerContentSmall: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  headerLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
    marginRight: 12,
  },
  headerLeftSmall: {
    flex: 1,
    marginRight: 8,
  },
  iconContainer: {
    width: 48,
    height: 48,
    borderRadius: 24,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
    flexShrink: 0,
  },
  titleContainer: {
    flex: 1,
    justifyContent: 'center',
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
    lineHeight: 24,
  },
  titleSmall: {
    fontSize: 18,
    lineHeight: 22,
  },
  subtitle: {
    fontSize: 12,
    marginTop: 2,
    lineHeight: 16,
    opacity: 0.8,
  },
  headerRight: {
    alignItems: 'flex-end',
    justifyContent: 'center',
    flexShrink: 0,
  },
  headerRightSmall: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  statusText: {
    fontSize: 11,
    marginBottom: 8,
    textAlign: 'right',
  },
});

export default DeviceInfoScreen;