# DeviceScope 📱

**Comprehensive Device Intelligence Platform**

A powerful React Native mobile application that provides detailed device information, real-time performance monitoring, and advanced analytics. DeviceScope offers professional-grade device intelligence with beautiful, responsive design optimized for both Android and iOS platforms.

## Features

### 📱 Device Information
- **Comprehensive device detection** - Hardware specs, model, manufacturer
- **System information** - OS version, platform details, memory
- **Display metrics** - Screen resolution, density, orientation
- **Network status** - Connection type, connectivity state
- **Battery information** - Level, charging state, power mode
- **Location data** - GPS coordinates (with permission)
- **Sensor capabilities** - Available device sensors

### ⚡ Real-time Performance Monitoring
- **Memory usage tracking** - Live memory consumption
- **Frame rate monitoring** - FPS performance metrics
- **Interactive charts** - Visual performance data
- **Historical data** - Performance trends over time

### 🎨 User Experience
- **Dark/Light/System themes** - Automatic theme switching
- **Responsive design** - Optimized for phones and tablets
- **Collapsible sections** - Organized information display
- **Search functionality** - Filter device information
- **Real-time updates** - Live data monitoring

### 💾 Data Management
- **Offline storage** - AsyncStorage for data persistence
- **Export capabilities** - JSON and text report generation
- **Share functionality** - Share device info summaries
- **Data history** - Track device information over time

### 📤 Export Options
- **JSON Reports** - Complete data in structured format
- **Text Reports** - Human-readable summaries
- **Quick Share** - Essential device info sharing
- **Full Export** - Complete app data backup

## Technology Stack

- **React Native** with Expo SDK
- **Expo Device** - Hardware information
- **Expo Battery** - Battery status
- **Expo Network** - Network connectivity
- **Expo Location** - GPS data
- **Expo Sensors** - Device sensors
- **AsyncStorage** - Local data persistence
- **React Native Chart Kit** - Performance visualization
- **Expo Vector Icons** - UI icons

## Installation & Setup

1. **Prerequisites**
   - Node.js 16+ installed
   - Expo CLI installed (`npm install -g expo-cli`)
   - Android Studio or Xcode for native development

2. **Install Dependencies**
   ```bash
   npm install
   ```

3. **Start Development Server**
   ```bash
   npm start
   ```

4. **Run on Device/Emulator**
   - Scan QR code with Expo Go app (iOS/Android)
   - Press `a` for Android emulator
   - Press `i` for iOS simulator

## Project Structure

```
Enhanced-Device-Info-Mobile/
├── components/           # Reusable UI components
│   ├── CollapsibleSection.js
│   ├── EnhancedDeviceInfo.js
│   ├── PerformanceMonitor.js
│   ├── InfoTable.js
│   ├── DownloadManager.js
│   └── ThemeToggle.js
├── contexts/            # React Context providers
│   └── ThemeContext.js
├── hooks/              # Custom React hooks
│   ├── useEnhancedDeviceInfo.js
│   └── usePerformanceMonitor.js
├── screens/            # Screen components
│   └── DeviceInfoScreen.js
├── utils/              # Utility functions
│   └── storage.js
├── App.js              # Main app component
└── app.json            # Expo configuration
```

## Key Components

### Device Information Hook
- Collects comprehensive device data
- Real-time updates capability
- Location and sensor data (with permissions)
- Performance optimized data collection

### Theme System
- System theme detection
- Manual theme switching
- Persistent theme preferences
- Automatic color scheme adaptation

### Storage Manager
- Local data persistence
- Data export functionality
- Historical data tracking
- Offline data management

## Permissions

The app requests the following permissions:

- **Location** - For GPS coordinates and location-based info
- **Camera/Microphone** - For media device enumeration
- **Storage** - For data export and file sharing

## Platform Optimization

### iOS Specific
- iPad support enabled
- Proper Info.plist permissions
- Native bundle configuration

### Android Specific
- Adaptive icon support
- Edge-to-edge display
- ProGuard optimization for release builds
- Proper permission declarations

## Privacy & Security

- **Local Processing** - All data processed on device
- **No External Servers** - No data transmission
- **Permission Control** - Explicit permission requests
- **Offline Capable** - Full functionality without internet

## Building for Production

### Android (APK)
```bash
expo build:android
```

### iOS (IPA)
```bash
expo build:ios
```

### Expo Application Services (EAS)
```bash
eas build --platform all
```

## Comparison with Web Version

| Feature | Web App | Mobile App |
|---------|---------|------------|
| Device Detection | Browser APIs | Native Expo APIs |
| Performance Monitoring | Web Performance API | React Native metrics |
| Offline Storage | Service Worker + IndexedDB | AsyncStorage |
| Theme Support | CSS variables | React Native themes |
| Export Options | Download links | Native sharing |
| Real-time Updates | Web Workers | React Native timers |

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test on both platforms
5. Submit a pull request

## License

This project is licensed under the MIT License.

## Support

For issues and feature requests, please create an issue in the repository.