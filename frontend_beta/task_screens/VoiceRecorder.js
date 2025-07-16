import { View, StyleSheet, Text, TouchableOpacity } from 'react-native';
import { useEffect, useState } from 'react';
import { useFocusEffect } from '@react-navigation/native';
import { LinearGradient } from 'expo-linear-gradient';
import React, { useRef } from 'react';

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

export default function VoiceRecorder() {

    const recorder = useAudioRecorder(RecordingPresets.HIGH_QUALITY);
    const state = useAudioRecorderState(recorder);

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

     const toggle = async () => {
        if (state.isRecording) {
            await recorder.stop();
            console.log('Saved to URI:', recorder.uri);
        } else {
            await recorder.prepareToRecordAsync();
            recorder.record();
        }
    };

    return (
        <View style={{flex: 1, backgroundColor: '#FBFAF5'}}>
            <LinearGradient
                colors={["#2A1AD8", "#7231EC"]}
                style={styles.header}
            >
            <TouchableOpacity
                style={styles.header_container}
            >
                <Ionicons style={{ color: 'white' }} name='chevron-back-outline' size={30}/>
            </TouchableOpacity>

            <Text style={styles.headerTitle}>Voice Recorder</Text>
            </LinearGradient>

            <View style={{flex: 1, alignItems: 'center'}}>
                <LinearGradient
                    colors={["#2A1AD8", "#7231EC"]}
                    style={styles.buttonOutline}
                >
                <TouchableOpacity style={styles.button} onPress={toggle}>
                    <Ionicons style={{ color: 'white' }} name='ellipse' size={30}/>
                    <Text style={styles.buttonText}>Record</Text>
                </TouchableOpacity>
                </LinearGradient>

                <TouchableOpacity style={styles.noLinearButton} onPress={toggle}>
                    <Ionicons style={{ color: '#7231EC' }} name='square' size={30}/>
                    <Text style={[styles.buttonText, {color: '#7231EC'}]}>Stop</Text>
                </TouchableOpacity>

                {state.isRecording ? <Text>Recording</Text> : <></>}

                <LinearGradient
                    colors={["#2A1AD8", "#7231EC"]}
                    style={styles.buttonOutline}
                >
                <TouchableOpacity style={styles.button} onPress={playRecording}>
                    <Ionicons style={{ color: 'white' }} name='play' size={30}/>
                    <Text style={styles.buttonText}>Play</Text>
                </TouchableOpacity>
                </LinearGradient>

                <TouchableOpacity style={styles.noLinearButton} onPress={stopRecording}>
                    <Ionicons style={{ color: '#7231EC' }} name='pause' size={30}/>
                    <Text style={[styles.buttonText, {color: '#7231EC'}]}>Pause</Text>
                </TouchableOpacity>
            </View>
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
    noLinearButton: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        width: '80%',
        borderWidth: 2,

        paddingVertical: 15,
        paddingHorizontal: 25,
        borderRadius: 20,
        borderColor: "#7231EC",

        marginBottom: 100,
    }
  
})