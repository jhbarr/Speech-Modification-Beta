import React, { useState, useContext } from 'react';
import { Button, StyleSheet, Text, StatusBar, TouchableOpacity, View, Alert, Dimensions, Image, ScrollView } from 'react-native';
import {SafeAreaView, SafeAreaProvider} from 'react-native-safe-area-context';
import { useRoute, useNavigation } from '@react-navigation/native';
import { useBottomTabBarHeight } from '@react-navigation/bottom-tabs';
import { LinearGradient } from 'expo-linear-gradient';
import { useSafeAreaInsets } from 'react-native-safe-area-context';



import Constants from 'expo-constants';
import Ionicons from 'react-native-vector-icons/Ionicons';

import AudioRecorder from '../task_screens/AudioRecorder';
import VideoPlayer from '../task_screens/VideoPlayer';
import TextRenderer from '../task_screens/TextRenderer';


export default function TaskScreen() {
    // Instantiate the route
    const route = useRoute()

    // Instantiate the ability to use navigation
    const navigation = useNavigation()

    // Get the route params from the TaskListScreen
    const assignment = route.params?.assignment

    // global state variables for UX
    const [isEnlarged, setIsEnlarged] = useState(false);

    const tabBarHeight = useBottomTabBarHeight()

    /*
    * renderText -> This function is used to render the text from the task. 
    * 
    * FIELDS 
    *   content (String) -> The text content of the task
    */
    const renderText = (content) => {
        return (
            <ScrollView 
                style={{marginBottom: tabBarHeight + 20}}
                contentContainerStyle={{alignItems: 'center'}}
            >
                <View style={{backgroundColor: '#FBFAF5', padding: 20, borderRadius: 20, width: '90%'}}>
                    <Text style={styles.text}>{content}</Text>
                </View>
            </ScrollView>
        )
    }


    /*
    * renderImage -> This function is used to render an image from the website
    * 
    * FIELDS
    *   image (String) -> This is a url to the link from the website
    */
    const renderImage = (image) => {
        return (
        <TouchableOpacity 
            style={[styles.imageContainer, {alignSelf: 'center'}]}
            onPress={() => setIsEnlarged(!isEnlarged)}
        >
            <Image 
                source={{ uri: image }}
                style={[
                    styles.image,
                    {
                        height: isEnlarged ? Dimensions.get('window').height * 0.6 : Dimensions.get('window').height * 0.4,
                        width: isEnlarged ? Dimensions.get('window').width : Dimensions.get('window').width * 0.85
                    }
                ]}
            />
        </TouchableOpacity>
        )
    }


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
                return <TextRenderer content={item.content}/>
            case "Picture":
                return renderImage(item.content)
            case "Listening":
                return <AudioRecorder audioObject={item}/>
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
  imageContainer: {
    width: '90%',
    alignItems: 'center',
    justifyContent: 'center',

    // paddingHorizontal: 50,
    backgroundColor: "#FBFAF5",

    marginTop: 50,
    borderRadius: 20,
    shadowColor: '#000', // Shadow color
    shadowOffset: { width: 0, height: 6 }, // Shadow offset (x, y)
    shadowOpacity: 0.25, // Shadow opacity (0-1)
    shadowRadius: 3.84, // Shadow blur radius
  },
  image: {
    
    height: Dimensions.get('window').height * 0.4,
    width: Dimensions.get('window').width * 0.85,

    paddingHorizontal: 10,
    paddingVertical: 16,
  }
})

