import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Share,
  Alert,
} from 'react-native';
import * as Clipboard from 'expo-clipboard';
import { Ionicons } from '@expo/vector-icons';
import { useTheme } from '../contexts/ThemeContext';

const InfoTable = ({ data, searchTerm = '' }) => {
  const { colors } = useTheme();

  const copyToClipboard = async (text) => {
    try {
      await Clipboard.setStringAsync(text);
      Alert.alert('Copied', 'Value copied to clipboard');
    } catch (error) {
      Alert.alert('Error', 'Failed to copy to clipboard');
    }
  };

  const shareValue = async (key, value) => {
    try {
      await Share.share({
        message: `${key}: ${typeof value === 'object' ? JSON.stringify(value) : value}`,
        title: 'Device Information',
      });
    } catch (error) {
      console.error('Error sharing:', error);
    }
  };

  const highlightText = (text, highlight) => {
    if (!highlight || typeof text !== 'string') return text;
    
    const regex = new RegExp(`(${highlight})`, 'gi');
    const parts = text.split(regex);
    
    return parts.map((part, index) =>
      regex.test(part) ? (
        <Text key={index} style={{ backgroundColor: colors.warning + '40' }}>
          {part}
        </Text>
      ) : (
        part
      )
    );
  };

  const formatValue = (value) => {
    if (typeof value === 'object' && value !== null) {
      return JSON.stringify(value, null, 2);
    }
    return value?.toString() || 'N/A';
  };

  const styles = createStyles(colors);

  return (
    <View style={styles.container}>
      {data.map(([key, value], index) => (
        <View key={index} style={styles.row}>
          <View style={styles.keyContainer}>
            <Text style={styles.key}>{highlightText(key, searchTerm)}</Text>
          </View>
          <View style={styles.valueContainer}>
            <Text style={styles.value} selectable>
              {highlightText(formatValue(value), searchTerm)}
            </Text>
            <View style={styles.actions}>
              <TouchableOpacity
                onPress={() => copyToClipboard(formatValue(value))}
                style={styles.actionButton}
              >
                <Ionicons name="copy" size={16} color={colors.primary} />
              </TouchableOpacity>
              <TouchableOpacity
                onPress={() => shareValue(key, value)}
                style={styles.actionButton}
              >
                <Ionicons name="share" size={16} color={colors.primary} />
              </TouchableOpacity>
            </View>
          </View>
        </View>
      ))}
    </View>
  );
};

const createStyles = (colors) => StyleSheet.create({
  container: {
    backgroundColor: colors.background,
    borderRadius: 8,
  },
  row: {
    flexDirection: 'row',
    paddingVertical: 12,
    paddingHorizontal: 4,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
  },
  keyContainer: {
    flex: 1,
    paddingRight: 12,
  },
  key: {
    fontSize: 14,
    fontWeight: '500',
    color: colors.text,
    lineHeight: 20,
  },
  valueContainer: {
    flex: 2,
    flexDirection: 'row',
    alignItems: 'flex-start',
    justifyContent: 'space-between',
  },
  value: {
    fontSize: 14,
    color: colors.textSecondary,
    lineHeight: 20,
    flex: 1,
    marginRight: 8,
  },
  actions: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  actionButton: {
    padding: 4,
    marginLeft: 4,
  },
});

export default InfoTable;