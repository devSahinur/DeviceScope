import AsyncStorage from '@react-native-async-storage/async-storage';

const STORAGE_KEYS = {
  DEVICE_INFO_HISTORY: 'device_info_history',
  PERFORMANCE_DATA: 'performance_data',
  USER_PREFERENCES: 'user_preferences',
  OFFLINE_DATA: 'offline_data',
};

class StorageManager {
  // Save device info history
  static async saveDeviceInfoHistory(deviceInfo) {
    try {
      const history = await this.getDeviceInfoHistory();
      const newEntry = {
        timestamp: Date.now(),
        data: deviceInfo,
      };
      
      // Keep only last 50 entries
      const updatedHistory = [newEntry, ...history.slice(0, 49)];
      
      await AsyncStorage.setItem(
        STORAGE_KEYS.DEVICE_INFO_HISTORY,
        JSON.stringify(updatedHistory)
      );
      
      return true;
    } catch (error) {
      console.error('Error saving device info history:', error);
      return false;
    }
  }

  // Get device info history
  static async getDeviceInfoHistory() {
    try {
      const historyJson = await AsyncStorage.getItem(STORAGE_KEYS.DEVICE_INFO_HISTORY);
      return historyJson ? JSON.parse(historyJson) : [];
    } catch (error) {
      console.error('Error getting device info history:', error);
      return [];
    }
  }

  // Save performance data
  static async savePerformanceData(performanceData) {
    try {
      await AsyncStorage.setItem(
        STORAGE_KEYS.PERFORMANCE_DATA,
        JSON.stringify(performanceData)
      );
      return true;
    } catch (error) {
      console.error('Error saving performance data:', error);
      return false;
    }
  }

  // Get performance data
  static async getPerformanceData() {
    try {
      const dataJson = await AsyncStorage.getItem(STORAGE_KEYS.PERFORMANCE_DATA);
      return dataJson ? JSON.parse(dataJson) : null;
    } catch (error) {
      console.error('Error getting performance data:', error);
      return null;
    }
  }

  // Save user preferences
  static async saveUserPreferences(preferences) {
    try {
      await AsyncStorage.setItem(
        STORAGE_KEYS.USER_PREFERENCES,
        JSON.stringify(preferences)
      );
      return true;
    } catch (error) {
      console.error('Error saving user preferences:', error);
      return false;
    }
  }

  // Get user preferences
  static async getUserPreferences() {
    try {
      const preferencesJson = await AsyncStorage.getItem(STORAGE_KEYS.USER_PREFERENCES);
      return preferencesJson ? JSON.parse(preferencesJson) : {};
    } catch (error) {
      console.error('Error getting user preferences:', error);
      return {};
    }
  }

  // Save offline data for when device is offline
  static async saveOfflineData(data) {
    try {
      const offlineData = await this.getOfflineData();
      const newData = {
        timestamp: Date.now(),
        ...data,
      };
      
      const updatedData = [newData, ...offlineData.slice(0, 9)]; // Keep last 10 entries
      
      await AsyncStorage.setItem(
        STORAGE_KEYS.OFFLINE_DATA,
        JSON.stringify(updatedData)
      );
      
      return true;
    } catch (error) {
      console.error('Error saving offline data:', error);
      return false;
    }
  }

  // Get offline data
  static async getOfflineData() {
    try {
      const dataJson = await AsyncStorage.getItem(STORAGE_KEYS.OFFLINE_DATA);
      return dataJson ? JSON.parse(dataJson) : [];
    } catch (error) {
      console.error('Error getting offline data:', error);
      return [];
    }
  }

  // Clear all stored data
  static async clearAllData() {
    try {
      await AsyncStorage.multiRemove(Object.values(STORAGE_KEYS));
      return true;
    } catch (error) {
      console.error('Error clearing all data:', error);
      return false;
    }
  }

  // Get storage info
  static async getStorageInfo() {
    try {
      const keys = await AsyncStorage.getAllKeys();
      const appKeys = keys.filter(key => Object.values(STORAGE_KEYS).includes(key));
      
      const storageInfo = {
        totalKeys: appKeys.length,
        keys: appKeys,
        estimatedSize: 0,
      };

      // Calculate estimated size
      for (const key of appKeys) {
        try {
          const value = await AsyncStorage.getItem(key);
          if (value) {
            storageInfo.estimatedSize += new Blob([value]).size;
          }
        } catch (error) {
          console.error(`Error calculating size for key ${key}:`, error);
        }
      }

      return storageInfo;
    } catch (error) {
      console.error('Error getting storage info:', error);
      return {
        totalKeys: 0,
        keys: [],
        estimatedSize: 0,
      };
    }
  }

  // Export all data
  static async exportAllData() {
    try {
      const history = await this.getDeviceInfoHistory();
      const performance = await this.getPerformanceData();
      const preferences = await this.getUserPreferences();
      const offline = await this.getOfflineData();
      const storageInfo = await this.getStorageInfo();

      return {
        exportTimestamp: Date.now(),
        deviceInfoHistory: history,
        performanceData: performance,
        userPreferences: preferences,
        offlineData: offline,
        storageInfo: storageInfo,
      };
    } catch (error) {
      console.error('Error exporting data:', error);
      return null;
    }
  }
}

export default StorageManager;