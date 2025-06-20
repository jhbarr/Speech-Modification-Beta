import React, { useState, useContext } from 'react';
import { Button, StyleSheet, Text, StatusBar, TouchableOpacity, View, Alert, Dimensions, Image } from 'react-native';
import {SafeAreaView, SafeAreaProvider} from 'react-native-safe-area-context';
import { useRoute, useNavigation } from '@react-navigation/native';
import { LinearGradient } from 'expo-linear-gradient';

import YoutubePlayer from 'react-native-youtube-iframe';
import { Vimeo } from 'react-native-vimeo-iframe';

import Constants from 'expo-constants';
import Ionicons from 'react-native-vector-icons/Ionicons';

const screenWidth = Dimensions.get('window').width;
const playerHeight = screenWidth * 9 / 16; // 16:9 aspect ratio

export default function TaskScreen() {
    // Instantiate the route
    const route = useRoute()

    // Instantiate the ability to use navigation
    const navigation = useNavigation()

    // Get the route params from the TaskListScreen
    const assignment = route.params?.assignment

    // global state variables for UX
    const [isEnlarged, setIsEnlarged] = useState(false);

    /*
    * extractVideoInfo -> This function extracts whether a video link is a youtube or vimeo link
    *   It additionally returns the video ID
    * 
    * FIELDS 
    *   link (String) -> The link to the video
    */
    const extractVideoInfo = (link) => {
        const youtubeRegex = /(?:youtube\.com\/(?:watch\?v=|embed\/|v\/)|youtu\.be\/)([a-zA-Z0-9_-]{11})/;
        const vimeoRegex = /vimeo\.com\/(?:video\/)?(\d+)/;

        const youtubeMatch = link.match(youtubeRegex);
        if (youtubeMatch) {
            return { platform: 'youtube', id: youtubeMatch[1] };
        }

        const vimeoMatch = link.match(vimeoRegex);
        if (vimeoMatch) {
            return { platform: 'vimeo', id: vimeoMatch[1] };
        }

        return { platform: 'unknown', id: null };
    }


    /*
    * videoPlayer -> This function will return a view with an embedded video player. This is so that the
    *   app can show videos using external links
    * 
    * FIELDS
    *   Content (String) -> The link to the external video
    */
    const videoPlayer = (platform, video_id) => {
        if (platform === "youtube") {
            return (
            <View style={styles.youtubeContainer}>
            <YoutubePlayer 
                height={playerHeight}
                // play={true}
                videoId={video_id} // just the YouTube ID
            />
            </View>
            )
        }
        else {
            return (
            <View style={styles.vimeoContainer}>
            <Vimeo
                videoId={video_id}
                // style={styles.vimeo}
            />
            </View>
            )
        }

    }


    /*
    * renderText -> This function is used to render the text from the task. 
    * 
    * FIELDS 
    *   content (String) -> The text content of the task
    */
    const renderText = (content) => {
        return (
            <View style={styles.textContainer}>
                <Text style={styles.text}>{content}</Text>
            </View>
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
            style={styles.imageContainer}
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
                const videoType = extractVideoInfo(item.content)
                return videoPlayer(videoType.platform, videoType.id)
            case "Quick Read":
                return renderText(item.content)
            case "Picture":
                return renderImage(item.content)
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

        <View style={styles.container}>
            
            {renderItem(assignment)}

        </View>
        </LinearGradient>
    )
}

const styles = StyleSheet.create({
  container: {
      flex: 1,
      alignItems: 'center',
    },
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
    vimeoContainer: {
        height: playerHeight,
        width: '95%', 
        backgroundColor: '#FBFAF5', 
        // overflow: 'hidden',
        borderRadius: 20,
        marginTop: 50,

        padding: 16,
        shadowColor: '#000', // Shadow color
        shadowOffset: { width: 0, height: 6 }, // Shadow offset (x, y)
        shadowOpacity: 0.25, // Shadow opacity (0-1)
        shadowRadius: 3.84, // Shadow blur radius
    },
    vimeo: {
        height: '100%', 
        width: '100%', 
        backgroundColor: '#FBFAF5',
    },
    youtubeContainer: {
        height: playerHeight,            // Controls the height of the video
        // overflow: 'hidden',
        width: '95%',          // Optional: full screen width
        backgroundColor: '#FBFAF5', // Avoid white flash behind iframe
        borderRadius: 20,       // Optional: rounded corners
        marginTop: 50,     // Optional: spacing

        padding: 16,
        shadowColor: '#000', // Shadow color
        shadowOffset: { width: 0, height: 6 }, // Shadow offset (x, y)
        shadowOpacity: 0.25, // Shadow opacity (0-1)
        shadowRadius: 3.84, // Shadow blur radius
  },
  textContainer: {
    width: '90%',
    alignItems: 'center',
    justifyContent: 'center',

    paddingHorizontal: 25,
    backgroundColor: "#FBFAF5",

    marginTop: 50,
    borderRadius: 20,
    shadowColor: '#000', // Shadow color
    shadowOffset: { width: 0, height: 6 }, // Shadow offset (x, y)
    shadowOpacity: 0.25, // Shadow opacity (0-1)
    shadowRadius: 3.84, // Shadow blur radius

  },
  text: {
    fontSize: 20,
    fontWeight: 'regular',
    lineHeight: 30,
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

