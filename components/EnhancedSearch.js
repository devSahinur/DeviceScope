import React, { useState, useRef } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  ScrollView,
  StyleSheet,
  Animated,
  Keyboard,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useTheme } from '../contexts/ThemeContext';

const EnhancedSearch = ({ 
  searchTerm, 
  onSearchChange, 
  onCategoryChange,
  selectedCategory = 'all',
  suggestions = [],
  popularTerms = [],
  placeholder = "Search device information..."
}) => {
  const { colors } = useTheme();
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [isFocused, setIsFocused] = useState(false);
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const scaleAnim = useRef(new Animated.Value(1)).current;

  const categories = [
    { id: 'all', label: 'All', icon: 'apps' },
    { id: 'hardware', label: 'Hardware', icon: 'hardware-chip' },
    { id: 'software', label: 'Software', icon: 'code-slash' },
    { id: 'network', label: 'Network', icon: 'wifi' },
    { id: 'battery', label: 'Battery', icon: 'battery-charging' },
    { id: 'display', label: 'Display', icon: 'phone-portrait' },
  ];

  const handleFocus = () => {
    setIsFocused(true);
    setShowSuggestions(true);
    Animated.parallel([
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 200,
        useNativeDriver: true,
      }),
      Animated.timing(scaleAnim, {
        toValue: 1.02,
        duration: 200,
        useNativeDriver: true,
      }),
    ]).start();
  };

  const handleBlur = () => {
    setIsFocused(false);
    setTimeout(() => {
      setShowSuggestions(false);
      Animated.parallel([
        Animated.timing(fadeAnim, {
          toValue: 0,
          duration: 200,
          useNativeDriver: true,
        }),
        Animated.timing(scaleAnim, {
          toValue: 1,
          duration: 200,
          useNativeDriver: true,
        }),
      ]).start();
    }, 150);
  };

  const handleSuggestionSelect = (suggestion) => {
    onSearchChange(suggestion);
    setShowSuggestions(false);
    setIsFocused(false);
    Keyboard.dismiss();
    
    // Force immediate search by calling the change handler again
    setTimeout(() => {
      onSearchChange(suggestion);
    }, 50);
  };

  const clearSearch = () => {
    onSearchChange('');
    onCategoryChange('all');
  };

  const currentSuggestions = searchTerm ? suggestions : popularTerms;

  return (
    <View style={styles.container}>
      {/* Search Input */}
      <Animated.View 
        style={[
          styles.searchContainer, 
          { 
            borderColor: isFocused ? colors.primary : colors.border,
            backgroundColor: colors.surface,
            transform: [{ scale: scaleAnim }],
          }
        ]}
      >
        <Ionicons 
          name="search" 
          size={20} 
          color={isFocused ? colors.primary : colors.textSecondary} 
          style={styles.searchIcon} 
        />
        <TextInput
          style={[styles.searchInput, { color: colors.text }]}
          placeholder={placeholder}
          placeholderTextColor={colors.textSecondary}
          value={searchTerm}
          onChangeText={onSearchChange}
          onFocus={handleFocus}
          onBlur={handleBlur}
          returnKeyType="search"
          blurOnSubmit={true}
        />
        {searchTerm.length > 0 && (
          <TouchableOpacity onPress={clearSearch} style={styles.clearButton}>
            <Ionicons name="close-circle" size={20} color={colors.textSecondary} />
          </TouchableOpacity>
        )}
        {!isFocused && searchTerm.length > 0 && (
          <TouchableOpacity 
            onPress={() => {
              setShowSuggestions(false);
              Keyboard.dismiss();
            }} 
            style={[styles.searchButton, { backgroundColor: colors.primary }]}
          >
            <Ionicons name="search" size={16} color="#FFFFFF" />
          </TouchableOpacity>
        )}
        {isFocused && (
          <TouchableOpacity 
            onPress={() => {
              Keyboard.dismiss();
              handleBlur();
            }} 
            style={styles.doneButton}
          >
            <Text style={[styles.doneText, { color: colors.primary }]}>Done</Text>
          </TouchableOpacity>
        )}
      </Animated.View>

      {/* Search Suggestions */}
      {showSuggestions && currentSuggestions.length > 0 && (
        <Animated.View 
          style={[
            styles.suggestionsContainer, 
            { 
              backgroundColor: colors.surface, 
              borderColor: colors.border,
              opacity: fadeAnim,
            }
          ]}
        >
          <View style={styles.suggestionsHeader}>
            <Ionicons 
              name={searchTerm ? "search" : "trending-up"} 
              size={16} 
              color={colors.primary} 
            />
            <Text style={[styles.suggestionsTitle, { color: colors.text }]}>
              {searchTerm ? 'Search Suggestions' : 'Popular Searches'}
            </Text>
          </View>
          <ScrollView 
            style={styles.suggestionsList}
            showsVerticalScrollIndicator={false}
            keyboardShouldPersistTaps="handled"
          >
            {currentSuggestions.slice(0, 8).map((suggestion, index) => (
              <TouchableOpacity
                key={index}
                onPress={() => handleSuggestionSelect(suggestion)}
                style={[styles.suggestionItem, { borderColor: colors.border }]}
                activeOpacity={0.7}
                delayPressIn={0}
                delayPressOut={0}
                onPressIn={() => setShowSuggestions(true)} // Keep suggestions visible
              >
                <Ionicons 
                  name="arrow-up-outline" 
                  size={16} 
                  color={colors.textSecondary} 
                  style={styles.suggestionIcon}
                />
                <Text style={[styles.suggestionText, { color: colors.text }]}>
                  {suggestion}
                </Text>
                <Ionicons name="chevron-forward" size={14} color={colors.textSecondary} />
              </TouchableOpacity>
            ))}
          </ScrollView>
        </Animated.View>
      )}

      {/* Category Filters */}
      <View style={styles.filtersContainer}>
        <ScrollView 
          horizontal 
          showsHorizontalScrollIndicator={false} 
          contentContainerStyle={styles.filtersContent}
        >
          {categories.map((category) => (
            <TouchableOpacity
              key={category.id}
              onPress={() => onCategoryChange(category.id)}
              style={[
                styles.filterChip,
                {
                  backgroundColor: selectedCategory === category.id ? colors.primary : colors.surface,
                  borderColor: selectedCategory === category.id ? colors.primary : colors.border,
                },
              ]}
              activeOpacity={0.8}
            >
              <Ionicons 
                name={category.icon} 
                size={16} 
                color={selectedCategory === category.id ? '#FFFFFF' : colors.textSecondary}
                style={styles.filterIcon}
              />
              <Text
                style={[
                  styles.filterText,
                  { color: selectedCategory === category.id ? '#FFFFFF' : colors.text },
                ]}
              >
                {category.label}
              </Text>
            </TouchableOpacity>
          ))}
        </ScrollView>
      </View>

      {/* Search Results Summary */}
      {searchTerm && (
        <View style={styles.searchSummary}>
          <View style={styles.searchSummaryContent}>
            <Ionicons name="information-circle" size={16} color={colors.info} />
            <Text style={[styles.searchSummaryText, { color: colors.textSecondary }]}>
              Searching for &ldquo;{searchTerm}&rdquo;
            </Text>
          </View>
          <TouchableOpacity onPress={clearSearch} style={styles.clearAllButton}>
            <Text style={[styles.clearAllText, { color: colors.primary }]}>Clear All</Text>
          </TouchableOpacity>
        </View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginBottom: 16,
  },
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    height: 50,
    borderWidth: 2,
    borderRadius: 25,
    paddingHorizontal: 16,
    marginBottom: 12,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 4,
  },
  searchIcon: {
    marginRight: 12,
  },
  searchInput: {
    flex: 1,
    fontSize: 16,
    fontWeight: '500',
  },
  clearButton: {
    marginLeft: 8,
    padding: 4,
  },
  searchButton: {
    marginLeft: 8,
    paddingHorizontal: 12,
    paddingVertical: 12,
    borderRadius: 8,
    justifyContent: 'center',
    alignItems: 'center',
  },
  doneButton: {
    marginLeft: 8,
    paddingHorizontal: 12,
    paddingVertical: 6,
  },
  doneText: {
    fontSize: 14,
    fontWeight: '600',
  },
  suggestionsContainer: {
    position: 'absolute',
    top: 62,
    left: 0,
    right: 0,
    borderWidth: 1,
    borderRadius: 16,
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.15,
    shadowRadius: 16,
    elevation: 12,
    zIndex: 1000,
    maxHeight: 300,
  },
  suggestionsHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(0,0,0,0.1)',
  },
  suggestionsTitle: {
    fontSize: 14,
    fontWeight: '600',
    marginLeft: 8,
  },
  suggestionsList: {
    maxHeight: 240,
  },
  suggestionItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 14,
    borderBottomWidth: 0.5,
  },
  suggestionIcon: {
    marginRight: 12,
  },
  suggestionText: {
    flex: 1,
    fontSize: 15,
    fontWeight: '500',
  },
  filtersContainer: {
    marginBottom: 12,
  },
  filtersContent: {
    paddingHorizontal: 4,
  },
  filterChip: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderRadius: 20,
    borderWidth: 1.5,
    marginRight: 8,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  filterIcon: {
    marginRight: 6,
  },
  filterText: {
    fontSize: 13,
    fontWeight: '600',
  },
  searchSummary: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 8,
    paddingHorizontal: 4,
  },
  searchSummaryContent: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  searchSummaryText: {
    fontSize: 13,
    marginLeft: 6,
    fontStyle: 'italic',
  },
  clearAllButton: {
    paddingHorizontal: 12,
    paddingVertical: 4,
  },
  clearAllText: {
    fontSize: 13,
    fontWeight: '600',
  },
});

export default EnhancedSearch;