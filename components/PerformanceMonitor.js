import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  Dimensions,
  TouchableOpacity,
} from 'react-native';
import { LineChart } from 'react-native-chart-kit';
import { Ionicons } from '@expo/vector-icons';
import { useTheme } from '../contexts/ThemeContext';
import usePerformanceMonitor from '../hooks/usePerformanceMonitor';

const PerformanceMonitor = () => {
  const { colors, isDark } = useTheme();
  const { performanceData, isMonitoring, toggleMonitoring, getAverageMetrics } = usePerformanceMonitor();
  const screenWidth = Dimensions.get('window').width;
  
  const metrics = getAverageMetrics();

  const chartConfig = {
    backgroundColor: colors.surface,
    backgroundGradientFrom: colors.surface,
    backgroundGradientTo: colors.surface,
    decimalPlaces: 1,
    color: (opacity = 1) => colors.primary + Math.round(opacity * 255).toString(16).padStart(2, '0'),
    labelColor: (opacity = 1) => colors.textSecondary + Math.round(opacity * 255).toString(16).padStart(2, '0'),
    style: {
      borderRadius: 16,
    },
    propsForDots: {
      r: "3",
      strokeWidth: "2",
      stroke: colors.primary,
    },
    propsForLabels: {
      fontSize: 10,
    },
  };

  const memoryData = {
    labels: performanceData.timestamps.length > 0 
      ? performanceData.timestamps.slice(-6).map(t => {
          const parts = t.split(':');
          return parts.length >= 3 ? parts[1] + ':' + parts[2] : t;
        })
      : ['00:00'],
    datasets: [
      {
        data: performanceData.memory.length > 0 
          ? performanceData.memory.slice(-6)
          : [0],
        color: (opacity = 1) => colors.warning + Math.round(opacity * 255).toString(16).padStart(2, '0'),
        strokeWidth: 2,
      },
    ],
  };

  const fpsData = {
    labels: performanceData.timestamps.length > 0 
      ? performanceData.timestamps.slice(-6).map(t => {
          const parts = t.split(':');
          return parts.length >= 3 ? parts[1] + ':' + parts[2] : t;
        })
      : ['00:00'],
    datasets: [
      {
        data: performanceData.fps.length > 0 
          ? performanceData.fps.slice(-6)
          : [0],
        color: (opacity = 1) => colors.success + Math.round(opacity * 255).toString(16).padStart(2, '0'),
        strokeWidth: 2,
      },
    ],
  };

  const styles = createStyles(colors);

  return (
    <View style={styles.container}>
      {/* Controls */}
      <View style={styles.header}>
        <Text style={styles.title}>Performance Metrics</Text>
        <TouchableOpacity
          onPress={toggleMonitoring}
          style={[
            styles.toggleButton,
            {
              backgroundColor: isMonitoring ? colors.success : colors.surface,
              borderColor: isMonitoring ? colors.success : colors.border,
            },
          ]}
        >
          <Ionicons
            name={isMonitoring ? 'pause' : 'play'}
            size={16}
            color={isMonitoring ? '#FFFFFF' : colors.text}
          />
          <Text
            style={[
              styles.toggleText,
              { color: isMonitoring ? '#FFFFFF' : colors.text },
            ]}
          >
            {isMonitoring ? 'Stop' : 'Start'}
          </Text>
        </TouchableOpacity>
      </View>

      {/* Metrics Cards */}
      <View style={styles.metricsGrid}>
        <View style={[styles.metricCard, { borderColor: colors.warning }]}>
          <View style={styles.metricHeader}>
            <Ionicons name="speedometer" size={20} color={colors.warning} />
            <Text style={[styles.metricLabel, { color: colors.textSecondary }]}>Memory</Text>
          </View>
          <Text style={[styles.metricValue, { color: colors.text }]}>
            {metrics.currentMemory} MB
          </Text>
          <Text style={[styles.metricAverage, { color: colors.textSecondary }]}>
            Avg: {metrics.avgMemory} MB
          </Text>
        </View>

        <View style={[styles.metricCard, { borderColor: colors.success }]}>
          <View style={styles.metricHeader}>
            <Ionicons name="pulse" size={20} color={colors.success} />
            <Text style={[styles.metricLabel, { color: colors.textSecondary }]}>FPS</Text>
          </View>
          <Text style={[styles.metricValue, { color: colors.text }]}>
            {metrics.currentFPS}
          </Text>
          <Text style={[styles.metricAverage, { color: colors.textSecondary }]}>
            Avg: {metrics.avgFPS}
          </Text>
        </View>
      </View>

      {/* Charts */}
      {performanceData.memory.length > 1 && (
        <View style={styles.chartContainer}>
          <Text style={[styles.chartTitle, { color: colors.text }]}>Memory Usage (MB)</Text>
          {memoryData.datasets[0].data.length > 0 && (
            <LineChart
              data={memoryData}
              width={screenWidth - 64}
              height={180}
              chartConfig={chartConfig}
              bezier
              style={styles.chart}
            />
          )}
        </View>
      )}

      {performanceData.fps.length > 1 && (
        <View style={styles.chartContainer}>
          <Text style={[styles.chartTitle, { color: colors.text }]}>Frame Rate (FPS)</Text>
          {fpsData.datasets[0].data.length > 0 && (
            <LineChart
              data={fpsData}
              width={screenWidth - 64}
              height={180}
              chartConfig={chartConfig}
              bezier
              style={styles.chart}
            />
          )}
        </View>
      )}

      {/* Status */}
      <View style={styles.status}>
        <View style={styles.statusItem}>
          <View
            style={[
              styles.statusDot,
              { backgroundColor: isMonitoring ? colors.success : colors.textSecondary },
            ]}
          />
          <Text style={[styles.statusText, { color: colors.textSecondary }]}>
            {isMonitoring ? 'Monitoring active' : 'Monitoring paused'}
          </Text>
        </View>
        <Text style={[styles.statusText, { color: colors.textSecondary }]}>
          {performanceData.memory.length} data points collected
        </Text>
      </View>
    </View>
  );
};

const createStyles = (colors) => StyleSheet.create({
  container: {
    padding: 16,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  title: {
    fontSize: 18,
    fontWeight: '600',
    color: colors.text,
  },
  toggleButton: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 6,
    borderWidth: 1,
  },
  toggleText: {
    marginLeft: 4,
    fontSize: 14,
    fontWeight: '500',
  },
  metricsGrid: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 20,
  },
  metricCard: {
    flex: 1,
    backgroundColor: colors.background,
    padding: 16,
    borderRadius: 8,
    borderLeftWidth: 4,
    marginHorizontal: 4,
  },
  metricHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  metricLabel: {
    marginLeft: 8,
    fontSize: 14,
    fontWeight: '500',
  },
  metricValue: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 4,
  },
  metricAverage: {
    fontSize: 12,
  },
  chartContainer: {
    marginBottom: 20,
    alignItems: 'center',
  },
  chartTitle: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 8,
    textAlign: 'center',
  },
  chart: {
    marginVertical: 8,
    borderRadius: 16,
  },
  status: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingTop: 16,
    borderTopWidth: 1,
    borderTopColor: colors.border,
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
    fontSize: 12,
  },
});

export default PerformanceMonitor;