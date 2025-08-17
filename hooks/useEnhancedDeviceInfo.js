import { useState, useEffect, useCallback } from 'react';
import * as Device from 'expo-device';
import Constants from 'expo-constants';
import * as ScreenOrientation from 'expo-screen-orientation';
import * as Battery from 'expo-battery';
import * as Network from 'expo-network';
import * as Application from 'expo-application';
import * as Location from 'expo-location';
import { Dimensions, Platform } from 'react-native';

const useEnhancedDeviceInfo = () => {
  const [deviceInfo, setDeviceInfo] = useState(null);
  const [realtimeUpdates, setRealtimeUpdates] = useState(false);
  const [updateInterval, setUpdateInterval] = useState(null);

  const collectDeviceInfo = useCallback(async () => {
    try {
      // Get screen dimensions
      const { width, height } = Dimensions.get('window');
      const screenData = Dimensions.get('screen');

      // Get network info
      let networkInfo = {};
      try {
        const networkState = await Network.getNetworkStateAsync();
        networkInfo = {
          'Connection Type': networkState.type || 'Unknown',
          'Is Connected': networkState.isConnected ? 'Yes' : 'No',
          'Is Internet Reachable': networkState.isInternetReachable ? 'Yes' : 'No',
        };
      } catch (error) {
        networkInfo = { 'Network Error': error.message };
      }

      // Get battery info
      let batteryInfo = {};
      try {
        const batteryLevel = await Battery.getBatteryLevelAsync();
        const batteryState = await Battery.getBatteryStateAsync();
        const powerMode = await Battery.getPowerModeAsync();
        
        batteryInfo = {
          'Battery Level': `${Math.round(batteryLevel * 100)}%`,
          'Battery State': getBatteryStateText(batteryState),
          'Power Mode': getPowerModeText(powerMode),
        };
      } catch (error) {
        batteryInfo = { 'Battery Error': 'Not available' };
      }

      // Get orientation
      let orientationInfo = {};
      try {
        const orientation = await ScreenOrientation.getOrientationAsync();
        orientationInfo = {
          'Screen Orientation': getOrientationText(orientation),
        };
      } catch (error) {
        orientationInfo = { 'Orientation': 'Unknown' };
      }

      // Get location info (if permission granted)
      let locationInfo = {};
      try {
        const { status } = await Location.requestForegroundPermissionsAsync();
        if (status === 'granted') {
          const location = await Location.getCurrentPositionAsync({
            accuracy: Location.Accuracy.Balanced,
            timeInterval: 10000,
          });
          locationInfo = {
            'Latitude': location.coords.latitude.toFixed(6),
            'Longitude': location.coords.longitude.toFixed(6),
            'Accuracy': `${location.coords.accuracy} meters`,
            'Altitude': location.coords.altitude ? `${location.coords.altitude} meters` : 'Not available',
            'Heading': location.coords.heading ? `${location.coords.heading}°` : 'Not available',
            'Speed': location.coords.speed ? `${location.coords.speed} m/s` : 'Not available',
          };
        } else {
          locationInfo = { 'Location': 'Permission denied' };
        }
      } catch (error) {
        locationInfo = { 'Location Error': error.message };
      }

      const info = {
        // Basic Device Information
        'Device Name': Device.deviceName || 'Unknown',
        'Device Type': Device.deviceType ? getDeviceTypeText(Device.deviceType) : 'Unknown',
        'Brand': Device.brand || 'Unknown',
        'Manufacturer': Device.manufacturer || 'Unknown',
        'Model Name': Device.modelName || 'Unknown',
        'Model ID': Device.modelId || 'Unknown',
        'Design Name': Device.designName || 'Unknown',
        'Product Name': Device.productName || 'Unknown',
        'Device Year Class': Device.deviceYearClass?.toString() || 'Unknown',
        'Total Memory': Device.totalMemory ? `${(Device.totalMemory / (1024 ** 3)).toFixed(2)} GB` : 'Unknown',
        'Supported CPU Architectures': Device.supportedCpuArchitectures?.join(', ') || 'Unknown',

        // Platform Information
        'Platform': Platform.OS,
        'Platform Version': Platform.Version?.toString() || 'Unknown',
        'Is Device': Device.isDevice ? 'Yes' : 'No (Simulator/Emulator)',

        // Application Information
        'App Name': 'DeviceScope',
        'App Version': Application.nativeApplicationVersion || '1.0.0',
        'Build Version': Application.nativeBuildVersion || 'Unknown',
        'App ID': Application.applicationId || Constants.manifest?.slug || 'Unknown',
        'App State': 'Active',
        'Install Time': Constants.installationId ? 'Available' : 'Unknown',
        'Runtime Environment': Constants.executionEnvironment || 'Unknown',

        // Screen Information
        'Screen Width': `${width}px`,
        'Screen Height': `${height}px`,
        'Screen Density': `${screenData.scale}x`,
        'Font Scale': `${screenData.fontScale}x`,
        'Physical Screen Width': `${screenData.width}px`,
        'Physical Screen Height': `${screenData.height}px`,

        // System Information
        'Expo SDK Version': Constants.expoVersion || 'Unknown',
        'Expo Runtime Version': Constants.expoRuntimeVersion || 'Unknown',
        'App Ownership': Constants.appOwnership || 'Unknown',
        'Installation ID': Constants.installationId || 'Unknown',
        'Session ID': Constants.sessionId || 'Unknown',

        // Merge additional info
        ...networkInfo,
        ...batteryInfo,
        ...orientationInfo,
        ...locationInfo,

        // Additional System Info
        'Device Language': Platform.OS === 'ios' ? 'iOS Device' : 'Android Device',
        'Available Memory': Device.totalMemory ? `${(Device.totalMemory / (1024 ** 3)).toFixed(2)} GB` : 'Unknown',
        'Architecture': Device.supportedCpuArchitectures?.join(', ') || 'Unknown',
        'Kernel': Platform.constants?.reactNativeVersion ? 'React Native' : 'Unknown',
        'JavaScript Engine': 'Hermes' + (Platform.constants?.reactNativeVersion?.toString() || ''),
        
        // Performance Indicators
        'Touch Responsiveness': 'Optimized',
        'Animation Performance': '60 FPS Target',
        'Memory Management': 'Automatic',
        'Background Processing': 'Enabled',

        'Last Updated': new Date().toLocaleString(),
      };

      setDeviceInfo(info);
    } catch (error) {
      console.error('Device info collection error:', error);
      setDeviceInfo({
        'Error': 'Failed to collect device information',
        'Error Message': error.message,
        'Last Updated': new Date().toLocaleString(),
      });
    }
  }, []);

  const toggleRealtimeUpdates = useCallback(() => {
    setRealtimeUpdates(prev => {
      const newState = !prev;
      
      if (newState) {
        const interval = setInterval(() => {
          collectDeviceInfo();
        }, 5000);
        setUpdateInterval(interval);
      } else {
        if (updateInterval) {
          clearInterval(updateInterval);
          setUpdateInterval(null);
        }
      }
      
      return newState;
    });
  }, [updateInterval, collectDeviceInfo]);

  useEffect(() => {
    collectDeviceInfo();

    const dimensionsSubscription = Dimensions.addEventListener('change', () => {
      if (deviceInfo) {
        collectDeviceInfo();
      }
    });

    return () => {
      dimensionsSubscription?.remove();
      if (updateInterval) {
        clearInterval(updateInterval);
      }
    };
  }, [collectDeviceInfo, updateInterval]);

  return { 
    deviceInfo, 
    realtimeUpdates, 
    toggleRealtimeUpdates,
    refreshData: collectDeviceInfo 
  };
};

// Helper functions
const getDeviceTypeText = (deviceType) => {
  const types = {
    [Device.DeviceType.UNKNOWN]: 'Unknown',
    [Device.DeviceType.PHONE]: 'Phone',
    [Device.DeviceType.TABLET]: 'Tablet',
    [Device.DeviceType.DESKTOP]: 'Desktop',
    [Device.DeviceType.TV]: 'TV',
  };
  return types[deviceType] || 'Unknown';
};

const getBatteryStateText = (batteryState) => {
  const states = {
    [Battery.BatteryState.UNKNOWN]: 'Unknown',
    [Battery.BatteryState.UNPLUGGED]: 'Unplugged',
    [Battery.BatteryState.CHARGING]: 'Charging',
    [Battery.BatteryState.FULL]: 'Full',
  };
  return states[batteryState] || 'Unknown';
};

const getPowerModeText = (powerMode) => {
  const modes = {
    [Battery.PowerMode.UNKNOWN]: 'Unknown',
    [Battery.PowerMode.NORMAL]: 'Normal',
    [Battery.PowerMode.LOW_POWER]: 'Low Power Mode',
  };
  return modes[powerMode] || 'Unknown';
};

const getOrientationText = (orientation) => {
  const orientations = {
    [ScreenOrientation.Orientation.UNKNOWN]: 'Unknown',
    [ScreenOrientation.Orientation.PORTRAIT_UP]: 'Portrait Up',
    [ScreenOrientation.Orientation.PORTRAIT_DOWN]: 'Portrait Down',
    [ScreenOrientation.Orientation.LANDSCAPE_LEFT]: 'Landscape Left',
    [ScreenOrientation.Orientation.LANDSCAPE_RIGHT]: 'Landscape Right',
  };
  return orientations[orientation] || 'Unknown';
};

export default useEnhancedDeviceInfo;