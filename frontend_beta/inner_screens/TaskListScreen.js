import React, { useState, useContext} from 'react';
import { useNavigation } from '@react-navigation/native';
import { useBottomTabBarHeight } from '@react-navigation/bottom-tabs';
import { SectionList, StyleSheet, Text, View, TouchableOpacity} from 'react-native';
import {SafeAreaView, SafeAreaProvider} from 'react-native-safe-area-context';
import { useRoute } from '@react-navigation/native';
import { LinearGradient } from 'expo-linear-gradient';
import Constants from 'expo-constants';
import Ionicons from 'react-native-vector-icons/Ionicons';

import { ContentContext } from '../context/ContentContext';

export default function TaskListScreen() {
  // Get the free tasks from the global state variable in Content Context
  const { freeTasks, completeFreeTask } = useContext(ContentContext)

  // Get the height of the tab bar for styling purposes
  const tabBarHeight = useBottomTabBarHeight()

  // Import navigation so that the user can navigate between screens
  const navigation = useNavigation()

  // Import the lesson_id to which the tasks to be displayed belong
  const route = useRoute();
  const lesson_id = route.params?.lesson_id;
  const lesson_title = route.params?.lesson_title

//   const freeTasks = {"2" :[ 
//     {"content": [
//       {
//         "type": "video",
//         "content": "https://player.vimeo.com/video/1058015668?title=0&byline=0&portrait=0&badge=0&autopause=0&player_id=0&app_id=58479"
//       },
//       {
//         "type": "paragraph",
//         "content": "\nIn fluent English speaking, we link words and reduce sounds. For example, in the phrase \"that is his,\" we contract \"that is\" to \"that's,\" and we reduce \"his\" to \"is.\" We link these together, and it sounds like \"that'siz.\" Use the video above to practice, and the playlist below for more quick fluency practice!\n\n"
//       },
//       {
//         "type": "video",
//         "content": "https://www.youtube.com/embed/videoseries?si=s-CrqBI81_CoYhaX&list=PLJXFLCasjYl5pWHo8N6LlFzyoG-xrRxCn"
//       },
//       {
//         "type": "image",
//         "content": "https://www.speechmodification.com/uploads/2/5/6/7/25671452/courses-3-24_orig.png"
//       },
//       {
//         "type": "paragraph",
//         "content": "\nLike this? Check out our \"Real Talk\" course for advanced fluency practice!\n\n"
//       }
// ], "id": 18, "is_completed": true, "lesson": 2, "task_title": "SMART Goals Challenge Lesson 2 - Meaningful"}, 
//     {"content": [4,5,6,7,8,9,10,11], "id": 19, "is_completed": true, "lesson": 2, "task_title": "SMART Goals Challenge Lesson 1 - Specific"}, 
//     {"content": [7,8,9], "id": 20, "is_completed": false, "lesson": 2, "task_title": "New Year's SMART Goals Challenge!"}
//   ]}


  const typeMapping = {
    paragraph: "Quick Read",
    image: "Picture",
    video: "Watch",
    table: "Mixed Practice",
    audio: "Listening",
  }

  const iconMapping = {
    "Quick Read": "book-outline",
    "Picture": "image-outline",
    "Watch": "videocam-outline",
    "Mixed Practice": "",
    "Listening": "mic-outline",
  }

  // This will alter convert the data retrieved from freeTasks and shape it so that it can be used by a
  // SectionList
  const sections = freeTasks[lesson_id].map(task => ({
    title: task.task_title,
    data: task.content.map(item => ({...item, type: typeMapping[item.type] || item.type})), // each item in the section
    is_completed: task.is_completed // extra info for the header
  }));

  /*
  * renderItem -> This function will be used to render each item under a header in the SectionList
  * 
  * FIELDS 
  *   item (object) -> The specific assignment under each task that needs to be completed
  */
  const renderItem = (item, index) => (
    <TouchableOpacity 
      style={[
        styles.item,
        {alignSelf: index % 2 === 0 ? 'flex-start' : 'flex-end'}
      ]}
    >
      <Text style={styles.itemText}>{item.type}</Text>
      <Ionicons name={iconMapping[item.type]} size={25} style={{ paddingLeft: 20,}}/>
    </TouchableOpacity>
  )

  /*
  * renderSectionHeader -> This function will be used to render each section header in the SectionList
  *   each section header will be the name of a specific task
  * 
  * FIELDS
  *   section (Object) -> The object whose information is to be rendered
  */
  const renderSectionHeader = ({ section }) => (
    <View style={[
      styles.sectionHeader,
      { borderWidth: section.is_completed ? 5 : 0,
        borderColor: section.is_completed ? '#6EC175' : null
      }
    ]}
    >
      <Text style={styles.sectionTitle}>
        {section.title}
      </Text>
       {section.is_completed ? (<Ionicons name="checkmark-circle-outline" size={30} style={{ color: '#6EC175', marginRight: 15,}} />) : <></>}
    </View>
  )

  return (
      <SafeAreaProvider>
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

          <Text style={styles.headerTitle}>{lesson_title}</Text>
        </View>

        <View style={[styles.container, { marginBottom: tabBarHeight }]}>

            <SectionList 
              sections={sections}
              keyExtractor={(item, index) => index.toString()}
              renderItem={({ item, index }) => renderItem(item, index)}
              renderSectionHeader={renderSectionHeader}
            />

        </View>

      </LinearGradient>
      </SafeAreaProvider>
  )
}

const styles = StyleSheet.create({
  container: {
      flex: 1,
      justifyContent: 'center',
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
      fontSize: 25,
      fontWeight: 'bold',
      paddingTop: 15
    },
    sectionHeader: {
      justifyContent: 'center',
      alignItems: 'center',
      flexDirection: 'row',

      backgroundColor: '#FBFAF5',
      marginHorizontal: 10,
      marginBottom: 40,
      padding: 15,
      borderRadius: 20,

      shadowColor: '#000', // Shadow color
      shadowOffset: { width: 0, height: 4 }, // Shadow offset (x, y)
      shadowOpacity: 0.25, // Shadow opacity (0-1)
      shadowRadius: 3.84, // Shadow blur radius
    },
    sectionTitle: {
      fontSize: 20,
      fontWeight: '500',
      textAlign: 'center',
    },
    item: {
      backgroundColor: '#FBFAF5',
      justifyContent:'center',
      alignItems: 'center',
      flexDirection: 'row',
      width: '50%',
      textAlign: 'center',

      marginHorizontal: 25,
      marginBottom: 40,
      padding: 20,

      borderRadius: 20,

      shadowColor: '#000', // Shadow color
      shadowOffset: { width: 0, height: 4 }, // Shadow offset (x, y)
      shadowOpacity: 0.25, // Shadow opacity (0-1)
      shadowRadius: 3.84, // Shadow blur radius
    },
    itemText: {
      fontSize: 18,
    }
})