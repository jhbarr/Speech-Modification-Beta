import { useState } from 'react';
import { Button, StyleSheet, Text, TouchableOpacity, View, Alert, Dimensions, Image } from 'react-native';
import { useRoute, useNavigation } from '@react-navigation/native';
import { LinearGradient } from 'expo-linear-gradient';



import Constants from 'expo-constants';
import Ionicons from 'react-native-vector-icons/Ionicons';

import AudioRecorder from '../task_screens/AudioRecorder';
import VideoPlayer from '../task_screens/VideoPlayer';
import TextRenderer from '../task_screens/TextRenderer';
import ImageRenderer from '../task_screens/ImageRenderer';
import MixedPracticeRenderer from '../task_screens/MixedPracticeRenderer';


export default function TaskScreen() {
    // Instantiate the route
    const route = useRoute()

    // Instantiate the ability to use navigation
    const navigation = useNavigation()

    // Get the route params from the TaskListScreen
    const assignment = route.params?.assignment

    /*
    * renderItem -> This function is used to render each content item in the page's flatlist.
    *   This is so that if there are multiple modules per task, they can all be rendered correctly
    *  
    * FIELDS
    *   item (Object) -> The item to be rendered
    * 
    * ADDITIONAL
    * Based on the type of content of the item, this function should utilize the pre-built view renderers
    * for the different types of media. This should be done via a switch statement of some sort.
    */
    const renderItem = (item) => {
        switch (item.type) {
            case "Watch":
                return <VideoPlayer videoObject={item.content}/>
            case "Quick Read":
                // return renderText(item.content)
                return <TextRenderer textObject={item.content}/>
            case "Picture":
                // return renderImage(item.content)
                return <ImageRenderer imageObject={item.content}/>
            case "Listening":
                return <AudioRecorder audioObject={item}/>
            case "Mixed Practice":
                // console.log(item.content)
                return <MixedPracticeRenderer mixedObject={item.content}/>
            default:
                Alert.alert("No valid pre-built renderer found")
        }
    }
     

    return (
        <LinearGradient
            colors={["#2A1AD8", "#7231EC"]}
            style={styles.background}
        >
        <View style={styles.header}>
            
            <TouchableOpacity
                onPress={() => navigation.goBack()}
                style={styles.header_container}
            >
                <Ionicons style={{ color: 'black' }} name='chevron-back-outline' size={30}/>
            </TouchableOpacity>

            <Text style={styles.headerTitle}>{assignment.type}</Text>
        </View>
        
        {renderItem(assignment)}
        

        </LinearGradient>
    )
}

const styles = StyleSheet.create({
    background: {
        flex: 1,
    },
    header: {
      backgroundColor: '#FBFAF5',
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

      borderWidth: 3,
    },
    headerTitle: {
      fontSize: 30,
      fontWeight: 'bold',
      paddingTop: 15,
      paddingLeft: 50,
    },
  
})

