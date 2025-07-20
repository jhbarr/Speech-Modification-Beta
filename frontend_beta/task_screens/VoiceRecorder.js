import { View, StyleSheet, Text, TouchableOpacity, Modal } from 'react-native';
import { useEffect, useState } from 'react';
import { LinearGradient } from 'expo-linear-gradient';
import * as FileSystem from 'expo-file-system';

import {
  useAudioRecorder,
  AudioModule,
  RecordingPresets,
  setAudioModeAsync,
  useAudioRecorderState,
  useAudioPlayer
} from 'expo-audio';

import Ionicons from 'react-native-vector-icons/Ionicons';
import Constants from 'expo-constants';

export default function VoiceRecorder({ isVisible, onClose }) {

    // Audio Recorder constants
    const recorder = useAudioRecorder(RecordingPresets.HIGH_QUALITY);
    const state = useAudioRecorderState(recorder)

    // Audio File Path Constants
    const [audioUri, setAudioUri] = useState('')
    const [currentTime, setCurrentTime] = useState(0);
    const [progress, setProgress] = useState(0)
    const [isPlaying, setIsPlaying] = useState(false)

    // Audio Player constants
    const player = useAudioPlayer({ uri: audioUri})


    /*
    * This use effect is to ask for the user's microphone permissions before we can start recording with
    * the recorder
    * Otherwise I don't believe that we would be able to record anything
    */
    useEffect(() => {
        (async () => {
        const { granted } = await AudioModule.requestRecordingPermissionsAsync();
        if (!granted) {
            Alert.alert('Need mic permission');
        }
        await setAudioModeAsync({
            playsInSilentMode: true,
            allowsRecording: true,
        });
        })();
    }, []);


    // -------- AUDIO RECORDER FUNCTIONS -------
    /*
    * handleRecord -> This function takes in the state of the recorder and either begins
    * recording or stops it and saves that recording to a local mp4 file that can be accessed
    * by the audio player. 
    */
    const handleRecord = async () => {

        // Check if the recorder is already running
        // If so we want to stop the recording
        if (state.isRecording) {
            try {
                // Stop the recording
                await recorder.stop()
                // Set the global audioUri to the current recorder's uri
                setAudioUri(recorder.uri)

                console.log("Recorder URI: ", recorder.uri)
            }
            catch (e) {
                console.warn("Error stopping recording: ", e)
            }
        }
        // Otherwise we want to start recording
        else {
            try {
                // Check if there is an existent URI (meaning we have made a previous recording)
                // If so, delete it and reflect that change in the component
                if (audioUri !== '') {
                    await FileSystem.deleteAsync(audioUri)
                    setAudioUri('')
                }
                
                // Prepare the recorder and start the recording
                await recorder.prepareToRecordAsync()
                recorder.record()
            }
            catch (e) {
                console.warn("Error starting recording: ", e)
            }
        }
    } 



    // ---------- AUDIO PLAYER FUNCTIONS ---------
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
    if (parseFloat(currentTime.toFixed(2)) == parseFloat(player.duration.toFixed(2))){ 
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
        // We first want to check whether the player is already playing audio
        // If so, then we want to stop the audio from playing
        if (isPlaying) {
            try {
                // Pause the player and reflect that change in the global state
                await player.pause()
                setIsPlaying(false)
            }
            catch (e) {
                console.warn("Error pausing recording: ", e)
            }
        }
        // If it's not playing, then we want to start it
        else {
            try {
                // Start the player and reflect that change in the state variable
                await player.play()
                setIsPlaying(true)
            }
            catch (e) {
                console.warn("Error playing recording: ", e)
            }
        }
    }

    return (
        <View>
            <Modal animationType='slide' transparent={true} visible={isVisible}>
            <View style={styles.modalContent}>

                <LinearGradient colors={["#2A1AD8", "#7231EC"]} style={styles.header}>
                    <TouchableOpacity style={styles.header_container} onPress={onClose}>
                        <Ionicons style={{ color: 'white' }} name='chevron-back-outline' size={30}/>
                    </TouchableOpacity>
                    <Text style={styles.headerTitle}>Voice Recorder</Text>
                </LinearGradient>

                <View style={{flex: 1, alignItems: 'center'}}>
                    <LinearGradient colors={["#2A1AD8", "#7231EC"]} style={styles.buttonOutline}>
                        <TouchableOpacity style={styles.button} onPress={handleRecord}>
                            <Ionicons style={{ color: 'white' }} name={state.isRecording ? 'square-outline' : 'ellipse-outline'} size={30}/>
                            <Text style={styles.buttonText}>{state.isRecording ? "Stop" : "Record"}</Text>
                        </TouchableOpacity>
                    </LinearGradient>

                    {state.isRecording ? <Text>Recording</Text> : <></>}

                    <LinearGradient colors={["#2A1AD8", "#7231EC"]} style={styles.buttonOutline}>
                        <TouchableOpacity style={styles.button} onPress={handlePlay}>
                            <Ionicons style={{ color: 'white' }} name={isPlaying ? 'pause-outline' : 'play-outline'} size={30}/>
                            <Text style={styles.buttonText}>{isPlaying ? "Pause" : "Play"}</Text>
                        </TouchableOpacity>
                    </LinearGradient>

                    {
                        audioUri.uri !== ""?
                        (
                        <View style={styles.progressBar}>
                            <View style={[styles.progressFill, { flex: progress }]} />
                            <View style={{ flex: 1 - progress }} />
                        </View>
                        )
                    :
                        (<></>)
                    }
                    
                </View>
            </View>
            </Modal>
        </View>
    )
}

const styles = StyleSheet.create({
    header: {
      paddingTop: Constants.statusBarHeight,
      paddingLeft: 20,
      paddingBottom: 30,
      borderBottomRightRadius: 60,
      borderBottomLeftRadius: 60,
      marginBottom: 30,

      shadowColor: '#000', // Shadow color
      shadowOffset: { width: 0, height: 6 }, // Shadow offset (x, y)
      shadowOpacity: 0.25, // Shadow opacity (0-1)
      shadowRadius: 3.84, // Shadow blur radius
    },
    headerTitle: {
      fontSize: 35,
      fontWeight: 'bold',
      paddingTop: 15,
      paddingLeft: 20,
      color: 'white'
    },
    modalContent: {
        height: '100%',
        width: '100%',
        position: 'absolute',
        bottom: 0,
        backgroundColor: '#FBFAF5'
    },
    buttonOutline: {
        width: '80%',
        borderRadius: 20,
        marginBottom: 30,
        alignItems: 'center',
    },
    button: {
        flexDirection: 'row',
        alignItems: 'center',

        paddingVertical: 15,
        paddingHorizontal: 25,
    },
    buttonText: {
        paddingLeft: 20,
        fontSize: 30,
        fontWeight: 'bold',
        color: 'white',
    },
        progressBar: {
        width: '80%',
        flexDirection: 'row',
        height: 10,
        backgroundColor: '#eee',
        borderRadius: 5,
        overflow: 'hidden'
    },
    progressFill: {
        backgroundColor: '#4CAF50'
    },
  
})