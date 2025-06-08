import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet, ActivityIndicator } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import Slider from '@react-native-community/slider';
import { APP_COLOR } from '@/utils/constant';

// Định dạng thời gian từ milliseconds (vd: 90000 -> "1:30")
const formatTime = (millis: number) => {
  if (!millis) return '0:00';
  const totalSeconds = Math.floor(millis / 1000);
  const seconds = totalSeconds % 60;
  const minutes = Math.floor(totalSeconds / 60);
  return `${minutes}:${seconds < 10 ? '0' : ''}${seconds}`;
};

interface AudioPlayerProps {
  isPlaying: boolean;
  isLoading: boolean;
  duration: number;
  position: number;
  onPlayPause: () => void;
  onSeek: (value: number) => void;
}

const AudioPlayer = ({
  isPlaying,
  isLoading,
  duration,
  position,
  onPlayPause,
  onSeek,
}: AudioPlayerProps) => {
  return (
    <View style={styles.container}>
      <TouchableOpacity onPress={onPlayPause} disabled={isLoading} style={styles.playButton}>
        {isLoading ? (
          <ActivityIndicator size="small" color={APP_COLOR.WHITE} />
        ) : (
          <Ionicons name={isPlaying ? 'pause' : 'play'} size={24} color="white" />
        )}
      </TouchableOpacity>
      <View style={styles.sliderContainer}>
        <Slider
          style={styles.slider}
          value={position}
          minimumValue={0}
          maximumValue={duration}
          onSlidingComplete={onSeek}
          minimumTrackTintColor={APP_COLOR.PINK}
          maximumTrackTintColor="rgba(255, 255, 255, 0.3)"
          thumbTintColor={APP_COLOR.WHITE}
        />
        <View style={styles.timeContainer}>
          <Text style={styles.timeText}>{formatTime(position)}</Text>
          <Text style={styles.timeText}>{formatTime(duration)}</Text>
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    borderRadius: 12,
    paddingHorizontal: 10,
    paddingVertical: 8,
    marginTop: 8,
  },
  playButton: {
    width: 40,
    height: 40,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    borderRadius: 20,
  },
  sliderContainer: {
    flex: 1,
    marginLeft: 10,
  },
  slider: {
    width: '100%',
    height: 20, // Giảm chiều cao để dễ tương tác
  },
  timeContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingHorizontal: 5, // Thêm padding để không bị sát lề
  },
  timeText: {
    color: '#ccc',
    fontSize: 12,
  },
});

export default AudioPlayer;