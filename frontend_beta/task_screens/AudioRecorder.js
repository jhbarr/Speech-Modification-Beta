import React from 'react';
import { View, StyleSheet, Text, TouchableOpacity, Button, Modal } from 'react-native';
import { useAudioPlayer } from 'expo-audio';
import { useEffect, useState } from 'react';
import { useFocusEffect } from '@react-navigation/native';

import Ionicons from 'react-native-vector-icons/Ionicons';

import VoiceRecorder from './VoiceRecorder';
// import VoiceRecorder2 from './VoiceRecorder2';


export default function AudioRecorder({ audioObject }) {
  const player = useAudioPlayer(audioObject.content);

  const [isModalVisible, setIsModalVisible] = useState(false)

  /*
  * This code pauses the sound when the component is completely unmounted
  * But it also guards against the possibility that the audioPlayer has already
  * been disposed of
  */
  // useEffect(() => {
  //   return () => {
  //     // on unmount
  //     try {
  //       player.pause();
  //       player.unload();
  //     } catch (e) {
  //       console.warn('Could not pause/unload player on unmount', e);
  //     }
  //   };
  // }, [player]);

  /*
  * This is similar to the useEffect, however it runs not when the component is unmounted, 
  * but when the user simply navigates to another screen.
  */
  // useFocusEffect(
  //   React.useCallback(() => {
  //     // Screen is focused
  //     return () => {
  //       // Screen lost focus
  //       try {
  //         player.pause();
  //         setIsPlaying(false);
  //       } catch (e) {
  //         console.warn('Could not pause player on blur', e);
  //       }
  //     };
  //   }, [player])
  // );


  const [currentTime, setCurrentTime] = useState(0);
  const [progress, setProgress] = useState(0)
  const [isPlaying, setIsPlaying] = useState(false)

  /*
  * These two useEffects below handle the progress of the player bar
  * Every 500ms the progress of the player is updated and so then we can reclect that 
  * change in the actual progress bar 
  */
  useEffect(() => {
    const interval = setInterval(() => {
      if (player) {
        setCurrentTime(player.currentTime);
      }
    }, 250); // every 500ms

    return () => clearInterval(interval);
  }, [player]);


  useEffect(() => {
    setProgress(player.duration !== 0 ? 1 - (player.duration - player.currentTime) / player.duration : 0)
    if (parseFloat(currentTime.toFixed(3)) >= parseFloat(player.duration.toFixed(3)) - 0.1){
      setProgress(0)
      setIsPlaying(false)

      player.pause()
      player.seekTo(0)
    }
  }, [currentTime]);

  /*
    * handlePlay (async) -> This function handles the playback of the recording. 
    * If the recording is not yet playing, then it begins to play it
    * If it is already playing, then it stops the player
    */
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

  const onModalClose = () => {
    setIsModalVisible(false);
  };

  return (
    <View style={styles.audioContainer}>
        <Text style={styles.audioTitle}>{audioObject.title}</Text>

        <View style={styles.playerContainer}>
          <TouchableOpacity style={styles.playButton} onPress={handlePlay} >
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

        <Button title="Voice Recorder" onPress={() => setIsModalVisible(true)} color='#7231EC'/>

        <VoiceRecorder isVisible={isModalVisible} onClose={onModalClose} />

    </View>
  );
}

const styles = StyleSheet.create({
  audioContainer: {
    padding: 20,
    width: '90%',
    backgroundColor: '#FBFAF5',
    padding: 15,
    borderRadius: 15,

    alignSelf: 'center',

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
  voiceRecorderButton: {
    color: '#7231EC'
  },  
});