import React, { useState } from 'react';
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  TextInput,
  RefreshControl,
  StyleSheet,
  ActivityIndicator,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useTheme } from '../contexts/ThemeContext';
import useEnhancedDeviceInfo from '../hooks/useEnhancedDeviceInfo';
import usePerformanceMonitor from '../hooks/usePerformanceMonitor';
import CollapsibleSection from './CollapsibleSection';
import PerformanceMonitor from './PerformanceMonitor';
import InfoTable from './InfoTable';
import DownloadManager from './DownloadManager';

const EnhancedDeviceInfo = () => {
  const { colors } = useTheme();
  const { deviceInfo, realtimeUpdates, toggleRealtimeUpdates, refreshData } = useEnhancedDeviceInfo();
  const { performanceData } = usePerformanceMonitor();
  const [searchTerm, setSearchTerm] = useState('');
  const [fontSize] = useState('medium');
  const [refreshing, setRefreshing] = useState(false);
  const [showSearchSuggestions, setShowSearchSuggestions] = useState(false);
  const [searchHistory, setSearchHistory] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState('all');

  const fontSizes = {
    small: 12,
    medium: 14,
    large: 16,
    xl: 18,
  };

  const onRefresh = async () => {
    setRefreshing(true);
    await refreshData();
    setRefreshing(false);
  };

  // Search suggestions and popular terms
  const popularSearchTerms = [
    'battery', 'memory', 'screen', 'cpu', 'network', 'storage', 
    'device', 'platform', 'browser', 'location', 'performance'
  ];

  const getSearchSuggestions = () => {
    if (!searchTerm) return popularSearchTerms.slice(0, 6);
    
    const allKeys = Object.keys(deviceInfo || {});
    const matching = allKeys.filter(key => 
      key.toLowerCase().includes(searchTerm.toLowerCase())
    ).slice(0, 6);
    
    return matching.length > 0 ? matching : popularSearchTerms.slice(0, 6);
  };

  const handleSearchChange = (text) => {
    setSearchTerm(text);
    setShowSearchSuggestions(text.length > 0);
  };

  const handleSearchSelect = (term) => {
    setSearchTerm(term);
    setShowSearchSuggestions(false);
    // Add to search history
    const newHistory = [term, ...searchHistory.filter(h => h !== term)].slice(0, 5);
    setSearchHistory(newHistory);
    // Force immediate search by triggering a small delay
    setTimeout(() => {
      // This will trigger the filtering immediately
      setSearchTerm(term);
    }, 10);
  };

  const clearSearch = () => {
    setSearchTerm('');
    setShowSearchSuggestions(false);
    setSelectedCategory('all');
  };

  const styles = createStyles(colors, fontSizes[fontSize]);

  if (!deviceInfo) {
    return (
      <View style={[styles.loadingContainer, { backgroundColor: colors.background }]}>
        <ActivityIndicator size="large" color={colors.primary} />
        <Text style={[styles.loadingText, { color: colors.text, marginTop: 16 }]}>
          Loading comprehensive device information...
        </Text>
        <Text style={[styles.loadingSubtext, { color: colors.textSecondary, marginTop: 8 }]}>
          Gathering system data and performance metrics
        </Text>
      </View>
    );
  }

  const categories = {
    'Basic Information': {
      icon: 'information-circle',
      keys: ['Device Name', 'Device Type', 'Brand', 'Manufacturer', 'Model Name', 'Platform', 'Platform Version', 'Is Device'],
      color: colors.primary,
    },
    'Hardware Information': {
      icon: 'hardware-chip',
      keys: ['Model ID', 'Design Name', 'Product Name', 'Device Year Class', 'Total Memory', 'Supported CPU Architectures'],
      color: '#8B5CF6',
    },
    'Display & Screen': {
      icon: 'phone-portrait',
      keys: ['Screen Width', 'Screen Height', 'Screen Density', 'Font Scale', 'Physical Screen Width', 'Physical Screen Height', 'Screen Orientation'],
      color: '#10B981',
    },
    'Network Information': {
      icon: 'wifi',
      keys: ['Connection Type', 'Is Connected', 'Is Internet Reachable'],
      color: '#3B82F6',
    },
    'Power & Battery': {
      icon: 'battery-charging',
      keys: ['Battery Level', 'Battery State', 'Power Mode'],
      color: '#F59E0B',
    },
    'Application Information': {
      icon: 'apps',
      keys: ['App Name', 'App Version', 'Build Version', 'App ID', 'App State', 'Install Time', 'Runtime Environment', 'App Ownership'],
      color: '#EF4444',
    },
    'System Information': {
      icon: 'settings',
      keys: ['Expo SDK Version', 'Expo Runtime Version', 'Installation ID', 'Session ID', 'Device Language', 'Available Memory', 'Architecture', 'Kernel', 'JavaScript Engine'],
      color: '#6366F1',
    },
    'Performance & Optimization': {
      icon: 'speedometer',
      keys: ['Touch Responsiveness', 'Animation Performance', 'Memory Management', 'Background Processing'],
      color: '#8B5CF6',
    },
    'Location Information': {
      icon: 'location',
      keys: ['Latitude', 'Longitude', 'Accuracy', 'Altitude', 'Heading', 'Speed', 'Location', 'Location Error'],
      color: '#14B8A6',
    },
  };

  // Category mapping for filters
  const categoryMapping = {
    'hardware': ['Hardware Information', 'Performance & Optimization'],
    'software': ['Application Information', 'System Information'],
    'network': ['Network Information'],
    'battery': ['Power & Battery'],
    'display': ['Display & Screen'],
  };

  const filteredCategories = Object.entries(categories).filter(([category, config]) => {
    // Filter by selected category first
    if (selectedCategory !== 'all') {
      const allowedCategories = categoryMapping[selectedCategory] || [];
      if (!allowedCategories.includes(category)) {
        return false;
      }
    }

    // Then filter by search term
    const filteredKeys = config.keys.filter((key) => {
      const value = deviceInfo[key];
      if (!value) return false;
      
      if (!searchTerm) return true; // Show all if no search term
      
      return (
        key.toLowerCase().includes(searchTerm.toLowerCase()) ||
        (typeof value === 'string' && value.toLowerCase().includes(searchTerm.toLowerCase())) ||
        (typeof value === 'object' && JSON.stringify(value).toLowerCase().includes(searchTerm.toLowerCase()))
      );
    });
    return filteredKeys.length > 0;
  });

  return (
    <ScrollView
      style={[styles.container, { backgroundColor: colors.background }]}
      refreshControl={
        <RefreshControl
          refreshing={refreshing}
          onRefresh={onRefresh}
          tintColor={colors.primary}
          colors={[colors.primary]}
        />
      }
    >
      {/* Control Panel */}
      <View style={styles.controlPanel}>
        {/* Enhanced Search */}
        <View style={styles.searchSection}>
          <View style={styles.searchContainer}>
            <View style={styles.searchInputContainer}>
              <Ionicons name="search" size={20} color={colors.textSecondary} style={styles.searchIcon} />
              <TextInput
                style={[styles.searchInput, { 
                  color: colors.text, 
                  borderColor: showSearchSuggestions ? colors.primary : colors.border 
                }]}
                placeholder="Search device data, specs, battery..."
                placeholderTextColor={colors.textSecondary}
                value={searchTerm}
                onChangeText={handleSearchChange}
                onFocus={() => setShowSearchSuggestions(true)}
                onBlur={() => setTimeout(() => setShowSearchSuggestions(false), 200)}
                returnKeyType="search"
                onSubmitEditing={() => {
                  setShowSearchSuggestions(false);
                  // Trigger search action if needed
                }}
              />
              {searchTerm.length > 0 && (
                <TouchableOpacity onPress={clearSearch} style={styles.clearButton}>
                  <Ionicons name="close-circle" size={20} color={colors.textSecondary} />
                </TouchableOpacity>
              )}
            </View>
            
            {/* Search Button */}
            <TouchableOpacity 
              onPress={() => {
                setShowSearchSuggestions(false);
                // Force focus on search results
              }}
              style={[styles.searchButton, { backgroundColor: colors.primary }]}
              activeOpacity={0.8}
            >
              <Ionicons name="search" size={18} color="#FFFFFF" />
              <Text style={styles.searchButtonText}>Search</Text>
            </TouchableOpacity>
          </View>

          {/* Search Suggestions */}
          {showSearchSuggestions && (
            <View style={[styles.suggestionsContainer, { backgroundColor: colors.surface, borderColor: colors.border }]}>
              <View style={styles.suggestionsHeader}>
                <Text style={[styles.suggestionsTitle, { color: colors.text }]}>
                  {searchTerm ? 'Suggestions' : 'Popular Searches'}
                </Text>
              </View>
              <View style={styles.suggestionsList}>
                {getSearchSuggestions().map((suggestion, index) => (
                  <TouchableOpacity
                    key={index}
                    onPress={() => handleSearchSelect(suggestion)}
                    style={[styles.suggestionItem, { borderColor: colors.border }]}
                    activeOpacity={0.7}
                    onPressIn={() => {
                      // Prevent blur from hiding suggestions too early
                      setShowSearchSuggestions(true);
                    }}
                  >
                    <Ionicons 
                      name={searchTerm ? "search" : "trending-up"} 
                      size={16} 
                      color={colors.primary} 
                      style={styles.suggestionIcon}
                    />
                    <Text style={[styles.suggestionText, { color: colors.text }]}>
                      {suggestion}
                    </Text>
                    <Ionicons name="arrow-up-outline" size={14} color={colors.textSecondary} />
                  </TouchableOpacity>
                ))}
              </View>
            </View>
          )}

          {/* Quick Search Chips */}
          <View style={styles.quickSearchContainer}>
            <Text style={[styles.quickSearchLabel, { color: colors.textSecondary }]}>Quick Search:</Text>
            <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.quickSearchScroll}>
              {popularSearchTerms.slice(0, 6).map((term) => (
                <TouchableOpacity
                  key={term}
                  onPress={() => handleSearchSelect(term)}
                  style={[styles.quickSearchChip, { backgroundColor: colors.surface, borderColor: colors.border }]}
                >
                  <Ionicons name="flash" size={12} color={colors.primary} />
                  <Text style={[styles.quickSearchText, { color: colors.text }]}>{term}</Text>
                </TouchableOpacity>
              ))}
            </ScrollView>
          </View>

          {/* Search Filters */}
          <View style={styles.filtersContainer}>
            <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.filtersScroll}>
              {['all', 'hardware', 'software', 'network', 'battery', 'display'].map((filter) => (
                <TouchableOpacity
                  key={filter}
                  onPress={() => setSelectedCategory(filter)}
                  style={[
                    styles.filterChip,
                    {
                      backgroundColor: selectedCategory === filter ? colors.primary : colors.surface,
                      borderColor: selectedCategory === filter ? colors.primary : colors.border,
                    },
                  ]}
                >
                  <Text
                    style={[
                      styles.filterText,
                      { color: selectedCategory === filter ? '#FFFFFF' : colors.text },
                    ]}
                  >
                    {filter.charAt(0).toUpperCase() + filter.slice(1)}
                  </Text>
                </TouchableOpacity>
              ))}
            </ScrollView>
          </View>

          {/* Search Results Summary */}
          {searchTerm && (
            <View style={styles.searchSummary}>
              <Text style={[styles.searchSummaryText, { color: colors.textSecondary }]}>
                Found {filteredCategories.reduce((total, [, config]) => total + config.keys.filter(key => {
                  const value = deviceInfo[key];
                  return value && (
                    key.toLowerCase().includes(searchTerm.toLowerCase()) ||
                    (typeof value === 'string' && value.toLowerCase().includes(searchTerm.toLowerCase()))
                  );
                }).length, 0)} results for &ldquo;{searchTerm}&rdquo;
              </Text>
              <TouchableOpacity onPress={clearSearch}>
                <Text style={[styles.clearText, { color: colors.primary }]}>Clear</Text>
              </TouchableOpacity>
            </View>
          )}
        </View>

        {/* Controls */}
        <View style={styles.controlsRow}>
          {/* Real-time Toggle */}
          <TouchableOpacity
            onPress={toggleRealtimeUpdates}
            style={[
              styles.controlButton,
              {
                backgroundColor: realtimeUpdates ? colors.success : colors.surface,
                borderColor: realtimeUpdates ? colors.success : colors.border,
                shadowColor: realtimeUpdates ? colors.success : colors.border,
              },
            ]}
            activeOpacity={0.8}
          >
            <Ionicons
              name={realtimeUpdates ? 'pause' : 'play'}
              size={16}
              color={realtimeUpdates ? '#FFFFFF' : colors.text}
            />
            <Text
              style={[
                styles.controlButtonText,
                { color: realtimeUpdates ? '#FFFFFF' : colors.text },
              ]}
            >
              {realtimeUpdates ? 'Live' : 'Static'}
            </Text>
            {realtimeUpdates && (
              <View style={[styles.liveDot, { backgroundColor: '#FFFFFF' }]} />
            )}
          </TouchableOpacity>

          {/* Refresh Button */}
          <TouchableOpacity
            onPress={refreshData}
            style={[
              styles.controlButton, 
              { 
                backgroundColor: colors.primary, 
                borderColor: colors.primary,
                shadowColor: colors.primary,
              }
            ]}
            activeOpacity={0.8}
          >
            <Ionicons name="refresh" size={16} color="#FFFFFF" />
            <Text style={[styles.controlButtonText, { color: '#FFFFFF' }]}>
              Refresh
            </Text>
          </TouchableOpacity>
        </View>

        {/* Status Indicators */}
        <View style={styles.statusRow}>
          <View style={styles.statusItem}>
            <View
              style={[
                styles.statusDot,
                { backgroundColor: realtimeUpdates ? colors.success : colors.textSecondary },
              ]}
            />
            <Text style={[styles.statusText, { color: colors.textSecondary }]}>
              {realtimeUpdates ? 'Real-time monitoring active' : 'Static view'}
            </Text>
          </View>
          <Text style={[styles.statusText, { color: colors.textSecondary }]}>
            Last updated: {deviceInfo['Last Updated']}
          </Text>
        </View>
      </View>

      {/* Performance Monitor */}
      <CollapsibleSection
        title="Real-time Performance Monitor"
        icon="stats-chart"
        defaultOpen={true}
        badge="Live Data"
      >
        <PerformanceMonitor />
      </CollapsibleSection>

      {/* Download Manager */}
      <CollapsibleSection
        title="Export & Download"
        icon="download"
        defaultOpen={false}
        badge="Share Data"
      >
        <DownloadManager deviceInfo={deviceInfo} performanceData={performanceData} />
      </CollapsibleSection>

      {/* Device Information Sections */}
      {filteredCategories.map(([category, config]) => {
        const filteredKeys = config.keys.filter((key) => {
          const value = deviceInfo[key];
          if (!value) return false;
          
          return (
            key.toLowerCase().includes(searchTerm.toLowerCase()) ||
            (typeof value === 'string' && value.toLowerCase().includes(searchTerm.toLowerCase()))
          );
        });

        return (
          <CollapsibleSection
            key={category}
            title={category}
            icon={config.icon}
            defaultOpen={category === 'Basic Information'}
            badge={`${filteredKeys.length} items`}
            color={config.color}
          >
            <InfoTable
              data={filteredKeys.map(key => [key, deviceInfo[key]])}
              searchTerm={searchTerm}
            />
          </CollapsibleSection>
        );
      })}

      {/* No Results Message */}
      {filteredCategories.length === 0 && searchTerm && (
        <View style={styles.noResultsContainer}>
          <Ionicons name="search" size={64} color={colors.textSecondary} />
          <Text style={[styles.noResultsTitle, { color: colors.text }]}>
            No results found
          </Text>
          <Text style={[styles.noResultsText, { color: colors.textSecondary }]}>
            No device information matches &ldquo;{searchTerm}&rdquo;. Try a different search term.
          </Text>
          <TouchableOpacity
            onPress={() => setSearchTerm('')}
            style={[styles.clearSearchButton, { backgroundColor: colors.primary }]}
          >
            <Text style={styles.clearButtonText}>Clear Search</Text>
          </TouchableOpacity>
        </View>
      )}

      {/* Privacy Notice */}
      <View style={[styles.privacyNotice, { backgroundColor: colors.primary + '20', borderColor: colors.primary + '40' }]}>
        <Ionicons name="shield-checkmark" size={20} color={colors.primary} />
        <View style={styles.privacyContent}>
          <Text style={[styles.privacyTitle, { color: colors.primary }]}>
            Privacy & Security
          </Text>
          <Text style={[styles.privacyText, { color: colors.primary }]}>
            All device information is processed locally on your device. No data is transmitted to external servers.
            Location and sensitive data require explicit permission and can be disabled at any time.
          </Text>
        </View>
      </View>
    </ScrollView>
  );
};

const createStyles = (colors, fontSize) => StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  loadingText: {
    fontSize: 18,
    fontWeight: '600',
    textAlign: 'center',
  },
  loadingSubtext: {
    fontSize: 14,
    textAlign: 'center',
  },
  controlPanel: {
    backgroundColor: colors.surface,
    margin: 16,
    padding: 16,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: colors.border,
  },
  searchSection: {
    marginBottom: 20,
  },
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    position: 'relative',
    marginBottom: 12,
    gap: 12,
  },
  searchInputContainer: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    position: 'relative',
  },
  searchIcon: {
    position: 'absolute',
    left: 12,
    zIndex: 1,
  },
  searchInput: {
    flex: 1,
    height: 48,
    paddingLeft: 40,
    paddingRight: 50,
    borderWidth: 2,
    borderRadius: 12,
    backgroundColor: colors.background,
    fontSize: fontSize,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  clearButton: {
    position: 'absolute',
    right: 12,
    zIndex: 1,
    padding: 4,
  },
  searchButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderRadius: 12,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 3,
    minWidth: 80,
  },
  searchButtonText: {
    color: '#FFFFFF',
    fontSize: 14,
    fontWeight: '600',
    marginLeft: 4,
  },
  suggestionsContainer: {
    position: 'absolute',
    top: 60,
    left: 0,
    right: 0,
    borderWidth: 1,
    borderRadius: 12,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.15,
    shadowRadius: 8,
    elevation: 8,
    zIndex: 1000,
    maxHeight: 250,
  },
  suggestionsHeader: {
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
  },
  suggestionsTitle: {
    fontSize: 14,
    fontWeight: '600',
  },
  suggestionsList: {
    paddingVertical: 8,
  },
  suggestionItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderBottomWidth: 0.5,
  },
  suggestionIcon: {
    marginRight: 12,
  },
  suggestionText: {
    flex: 1,
    fontSize: 14,
    fontWeight: '500',
  },
  filtersContainer: {
    marginBottom: 12,
  },
  filtersScroll: {
    flexGrow: 0,
  },
  filterChip: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    borderWidth: 1,
    marginRight: 8,
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 1,
  },
  filterText: {
    fontSize: 12,
    fontWeight: '600',
  },
  searchSummary: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 8,
    paddingHorizontal: 4,
  },
  searchSummaryText: {
    fontSize: 12,
    flex: 1,
  },
  clearText: {
    fontSize: 12,
    fontWeight: '600',
  },
  quickSearchContainer: {
    marginBottom: 12,
  },
  quickSearchLabel: {
    fontSize: 12,
    fontWeight: '600',
    marginBottom: 8,
    marginLeft: 4,
  },
  quickSearchScroll: {
    flexGrow: 0,
  },
  quickSearchChip: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 16,
    borderWidth: 1,
    marginRight: 8,
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 1,
  },
  quickSearchText: {
    fontSize: 11,
    fontWeight: '500',
    marginLeft: 4,
  },
  controlsRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 16,
    gap: 12,
  },
  controlButton: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderRadius: 12,
    borderWidth: 1.5,
    minWidth: 90,
    flex: 1,
    justifyContent: 'center',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
    position: 'relative',
  },
  controlButtonText: {
    marginLeft: 6,
    fontSize: fontSize - 1,
    fontWeight: '600',
  },
  liveDot: {
    position: 'absolute',
    top: -2,
    right: -2,
    width: 8,
    height: 8,
    borderRadius: 4,
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.3,
    shadowRadius: 2,
    elevation: 2,
  },
  statusRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  statusItem: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  statusDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    marginRight: 8,
  },
  statusText: {
    fontSize: fontSize - 2,
  },
  noResultsContainer: {
    alignItems: 'center',
    padding: 40,
    backgroundColor: colors.surface,
    margin: 16,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: colors.border,
  },
  noResultsTitle: {
    fontSize: 18,
    fontWeight: '600',
    marginTop: 16,
    marginBottom: 8,
  },
  noResultsText: {
    fontSize: fontSize,
    textAlign: 'center',
    marginBottom: 20,
  },
  clearSearchButton: {
    paddingHorizontal: 24,
    paddingVertical: 12,
    borderRadius: 8,
  },
  clearButtonText: {
    color: '#FFFFFF',
    fontSize: fontSize,
    fontWeight: '500',
  },
  privacyNotice: {
    flexDirection: 'row',
    margin: 16,
    padding: 16,
    borderRadius: 12,
    borderWidth: 1,
  },
  privacyContent: {
    flex: 1,
    marginLeft: 12,
  },
  privacyTitle: {
    fontSize: fontSize,
    fontWeight: '600',
    marginBottom: 4,
  },
  privacyText: {
    fontSize: fontSize - 2,
    lineHeight: 18,
  },
});

export default EnhancedDeviceInfo;