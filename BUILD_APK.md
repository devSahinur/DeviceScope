# DeviceScope APK Build Instructions

## Method 1: Using Expo Go App (Recommended for Testing)

1. **Install Expo Go** on your Android phone from Google Play Store

2. **Start Development Server**:
   ```bash
   npm start
   ```

3. **Connect to Your App**:
   - Scan the QR code displayed in terminal with Expo Go app
   - Your app will load directly in Expo Go for testing

## Method 2: EAS Build (Cloud Build) - Requires Expo Account

1. **Create Expo Account** (if you don't have one):
   - Go to https://expo.dev and sign up

2. **Login to EAS**:
   ```bash
   npx eas login
   ```

3. **Initialize EAS Project**:
   ```bash
   npx eas init
   ```

4. **Build APK**:
   ```bash
   npx eas build --platform android --profile preview
   ```

5. **Download APK**:
   - After build completes, you'll get a download link
   - Download and install on your phone

## Method 3: Local Build (Advanced)

1. **Install Android Studio** and setup Android SDK

2. **Setup NDK**:
   - Install Android NDK through Android Studio
   - Set ANDROID_NDK_HOME environment variable

3. **Build Locally**:
   ```bash
   npx expo prebuild --platform android
   cd android
   ./gradlew assembleDebug
   ```

4. **APK Location**:
   ```
   android/app/build/outputs/apk/debug/app-debug.apk
   ```

## Method 4: Instant Testing with Expo Development Build

1. **Install Expo Development Build** on your phone:
   ```bash
   npx eas build --profile development --platform android
   ```

2. **Install the development build APK** on your phone

3. **Start development server**:
   ```bash
   npx expo start --dev-client
   ```

## Recommended Approach

For immediate testing, use **Method 1** with Expo Go app. It's the fastest and requires no additional setup.

For a standalone APK that works without Expo Go, use **Method 2** with EAS Build.

## Troubleshooting

If you encounter NDK issues with local builds:
1. Update Android Studio to latest version
2. Install NDK through SDK Manager in Android Studio
3. Set proper environment variables
4. Clear gradle cache: `cd android && ./gradlew clean`

## App Details

- **App Name**: DeviceScope
- **Package**: com.sahinur.devicescope
- **Version**: 1.0.0
- **Features**: Device information, real-time monitoring, search functionality