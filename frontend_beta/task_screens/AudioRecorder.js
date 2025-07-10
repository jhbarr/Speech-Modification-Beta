import { View, StyleSheet, Text, TouchableOpacity } from 'react-native';
import { useAudioPlayer } from 'expo-audio';
import { useEffect, useState } from 'react';

import Ionicons from 'react-native-vector-icons/Ionicons';
import { LinearGradient } from 'expo-linear-gradient';

const audioSource = {
    uri: "https://www.speechmodification.com/uploads/2/5/6/7/25671452/r-blends_phrases.mp3"
}

export default function AudioRecorder({ audioObject }) {
  const player = useAudioPlayer(audioSource);

  // useFocusEffect(
  //   React.useCallback(() => {
  //     // Screen is focused
  //     return () => {
  //       // Screen is unfocused
  //       player.pause();
  //     };
  //   }, [])
  // );

  const [currentTime, setCurrentTime] = useState(0);
  const [progress, setProgress] = useState(0)
  const [isPlaying, setIsPlaying] = useState(false)

  useEffect(() => {
    const interval = setInterval(() => {
      if (player) {
        setCurrentTime(player.currentTime);
      }
    }, 500); // every 500ms

    return () => clearInterval(interval);
  }, [player]);

  useEffect(() => {
    setProgress(player.duration !== 0 ? 1 - (player.duration - player.currentTime) / player.duration : 0)
  }, [currentTime]);


  const handlePlay = async () => {
    setIsPlaying(!isPlaying)
    if (isPlaying) {
       try {
          await player.pause();
        } catch (e) {
          console.error("Error playing sound:", e);
        }
    }
    else {
       try {
          await player.play();
        } catch (e) {
          console.error("Error playing sound:", e);
        }
    }
  }

  return (
    <View style={styles.audioContainer}>
      <Text style={styles.audioTitle}>{audioObject.title}</Text>

      <View style={styles.playerContainer}>
        <TouchableOpacity 
          style={styles.playButton}
          onPress={handlePlay}
        >
          <Ionicons name={isPlaying ? 'pause-outline' : 'play-outline'} size={35}/>
        </TouchableOpacity>

        {/* Progress bar container */}
        <View style={styles.progressBar}>
          <View style={[styles.progressFill, { flex: progress }]} />
          <View style={{ flex: 1 - progress }} />
        </View>

        <TouchableOpacity 
          style={styles.playButton}
          onPress={() => {
            player.seekTo(0)
            player.play()
            setIsPlaying(true)
          }}
        >
          <Ionicons name='refresh-outline' size={35}/>
        </TouchableOpacity>
        
      </View>

    </View>
  );
}

const styles = StyleSheet.create({
  audioContainer: {
    padding: 20,
    width: '100%',
    backgroundColor: '#FBFAF5',
    padding: 15,
    borderRadius: 15,

    shadowColor: '#000', // Shadow color
    shadowOffset: { width: 0, height: 3 }, // Shadow offset (x, y)
    shadowOpacity: 0.2, // Shadow opacity (0-1)
    shadowRadius: 3.84, // Shadow blur radius
  },
  audioTitle: {
    fontSize: 25,
    fontWeight: 'bold',
  },
  playerContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    width: '100%',

    // backgroundColor: 'green',
    borderRadius: 10,
    padding: 3,
  },
  playButton: {
    paddingHorizontal: 5,
  },
  progressBar: {
    flex: 1,
    flexDirection: 'row',
    height: 10,
    backgroundColor: '#eee',
    borderRadius: 5,
    overflow: 'hidden'
  },
  progressFill: {
    backgroundColor: '#4CAF50'
  },
});