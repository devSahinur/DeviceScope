import React, { useRef, useEffect } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Animated,
  Dimensions,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useTheme } from '../contexts/ThemeContext';

const ThemeToggle = () => {
  const { theme, isDark, toggleTheme, colors } = useTheme();
  const { width } = Dimensions.get('window');
  const isSmallScreen = width < 600;
  
  // Animation values
  const slideAnim = useRef(new Animated.Value(0)).current;
  const scaleAnim = useRef(new Animated.Value(1)).current;
  const rotateAnim = useRef(new Animated.Value(0)).current;

  // Theme position mapping
  const getThemePosition = () => {
    switch (theme) {
      case 'light': return 0;
      case 'dark': return 1;
      case 'system': return 2;
      default: return 0;
    }
  };

  useEffect(() => {
    // Slide animation
    Animated.spring(slideAnim, {
      toValue: getThemePosition(),
      useNativeDriver: false,
      tension: 150,
      friction: 8,
    }).start();

    // Rotation animation for icon change
    Animated.sequence([
      Animated.timing(rotateAnim, {
        toValue: 1,
        duration: 200,
        useNativeDriver: true,
      }),
      Animated.timing(rotateAnim, {
        toValue: 0,
        duration: 200,
        useNativeDriver: true,
      }),
    ]).start();
  }, [theme]);

  const handlePress = () => {
    // Scale animation on press
    Animated.sequence([
      Animated.timing(scaleAnim, {
        toValue: 0.95,
        duration: 100,
        useNativeDriver: true,
      }),
      Animated.timing(scaleAnim, {
        toValue: 1,
        duration: 100,
        useNativeDriver: true,
      }),
    ]).start();

    toggleTheme();
  };

  const getThemeIcon = () => {
    switch (theme) {
      case 'light':
        return 'sunny';
      case 'dark':
        return 'moon';
      case 'system':
        return 'phone-portrait';
      default:
        return 'sunny';
    }
  };

  const getThemeColor = () => {
    switch (theme) {
      case 'light':
        return '#F59E0B'; // Warm yellow
      case 'dark':
        return '#8B5CF6'; // Cool purple
      case 'system':
        return colors.primary; // App primary color
      default:
        return '#F59E0B';
    }
  };

  const getThemeLabel = () => {
    switch (theme) {
      case 'light':
        return 'Light';
      case 'dark':
        return 'Dark';
      case 'system':
        return 'Auto';
      default:
        return 'Light';
    }
  };

  // Calculate slider position
  const sliderWidth = isSmallScreen ? 24 : 28;
  const containerWidth = isSmallScreen ? 84 : 96;
  const sliderPosition = slideAnim.interpolate({
    inputRange: [0, 1, 2],
    outputRange: [2, (containerWidth - sliderWidth) / 2 - 2, containerWidth - sliderWidth - 2],
    extrapolate: 'clamp',
  });

  const iconRotation = rotateAnim.interpolate({
    inputRange: [0, 1],
    outputRange: ['0deg', '360deg'],
  });

  if (isSmallScreen) {
    // Compact design for small screens
    return (
      <Animated.View style={{ transform: [{ scale: scaleAnim }] }}>
        <TouchableOpacity
          onPress={handlePress}
          style={[
            styles.compactContainer,
            { 
              backgroundColor: colors.surface, 
              borderColor: colors.border,
              shadowColor: colors.text,
            }
          ]}
          activeOpacity={0.8}
        >
          <Animated.View style={{ transform: [{ rotate: iconRotation }] }}>
            <Ionicons 
              name={getThemeIcon()} 
              size={18} 
              color={getThemeColor()} 
            />
          </Animated.View>
        </TouchableOpacity>
      </Animated.View>
    );
  }

  // Full design for larger screens
  return (
    <Animated.View style={{ transform: [{ scale: scaleAnim }] }}>
      <TouchableOpacity
        onPress={handlePress}
        style={[
          styles.container,
          { 
            backgroundColor: colors.surface, 
            borderColor: colors.border,
            shadowColor: colors.text,
          }
        ]}
        activeOpacity={0.8}
      >
        {/* Background slider */}
        <Animated.View
          style={[
            styles.slider,
            {
              backgroundColor: getThemeColor() + '20',
              borderColor: getThemeColor(),
              left: sliderPosition,
              width: sliderWidth,
            },
          ]}
        />
        
        {/* Theme options */}
        <View style={styles.optionsContainer}>
          {/* Light */}
          <View style={[styles.option, theme === 'light' && styles.activeOption]}>
            <Ionicons 
              name="sunny" 
              size={16} 
              color={theme === 'light' ? '#F59E0B' : colors.textSecondary} 
            />
          </View>
          
          {/* Dark */}
          <View style={[styles.option, theme === 'dark' && styles.activeOption]}>
            <Ionicons 
              name="moon" 
              size={16} 
              color={theme === 'dark' ? '#8B5CF6' : colors.textSecondary} 
            />
          </View>
          
          {/* System */}
          <View style={[styles.option, theme === 'system' && styles.activeOption]}>
            <Ionicons 
              name="phone-portrait" 
              size={16} 
              color={theme === 'system' ? colors.primary : colors.textSecondary} 
            />
          </View>
        </View>
        
        {/* Current theme label */}
        <Text style={[styles.label, { color: colors.text }]}>
          {getThemeLabel()}
        </Text>
      </TouchableOpacity>
    </Animated.View>
  );
};

const styles = StyleSheet.create({
  container: {
    position: 'relative',
    width: 96,
    height: 40,
    borderRadius: 20,
    borderWidth: 1.5,
    justifyContent: 'center',
    alignItems: 'center',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 3,
    elevation: 3,
  },
  compactContainer: {
    width: 36,
    height: 36,
    borderRadius: 18,
    borderWidth: 1.5,
    justifyContent: 'center',
    alignItems: 'center',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 3,
    elevation: 3,
  },
  slider: {
    position: 'absolute',
    height: 24,
    borderRadius: 12,
    borderWidth: 1,
    top: 6,
  },
  optionsContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    width: '100%',
    paddingHorizontal: 8,
    zIndex: 1,
  },
  option: {
    width: 28,
    height: 28,
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 14,
  },
  activeOption: {
    // Active state styling handled by slider background
  },
  label: {
    position: 'absolute',
    bottom: -20,
    fontSize: 10,
    fontWeight: '600',
    textAlign: 'center',
    width: '100%',
  },
});

export default ThemeToggle;