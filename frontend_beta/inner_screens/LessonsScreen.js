import React, { useState } from 'react';
import { FlatList, StyleSheet, Text, TextInput, TouchableOpacity} from 'react-native';
import {SafeAreaView, SafeAreaProvider} from 'react-native-safe-area-context';
import { useContext } from 'react';
import { useNavigation } from '@react-navigation/native';

import Icon from 'react-native-vector-icons/Ionicons';

import { ContentContext } from '../context/ContentContext';
import { LinearGradient } from 'expo-linear-gradient';

export default function LessonsScreen() {
    // Retrieve the necessary information from the content context
    const { freeLessons, getFreeTasksByLesson } = useContext(ContentContext)

    // Set up navigation ability for the screen
    const navigation = useNavigation()

    // Set up state variables for searching capabilities
    const [searchItem, setSearchItem] = useState('')
    const [filteredData, setFilteredData] = useState([])

    /*
    * search -> This function searches through the freeLessons list for any lessons that match or include
    *   the user's seach keyword
    * 
    * FIELDS
    *   searchText (String) -> The keyword search input by the user
    */
    const search  = (searchText) => {
      setSearchItem(searchText)
      let filter = freeLessons.filter( obj => 
        obj.lesson_title.toLowerCase().includes(searchText.toLowerCase())
      )
      setFilteredData(filter)
    }

    /*
    * navigate_screens -> This function is used to retrieve the tasks from the lesson that was selected by the user
    * 
    * FIELDS 
    *   lesson_id (int) -> The id of the lesson whose tasks we want to retrieve from the backend
    * 
    * ADDITIONAL
    * This function should also take in that lesson id as a paramter and pass it as a route parameter to the next screen
    * in the stack.
    */
    const navigate_screens = async (lesson_id, lesson_title) => {
      try {
        const tasks = await getFreeTasksByLesson(lesson_id);
        // console.log("Tasks fetched:", tasks);
        // you can now check if tasks is a valid value (e.g., array, object)
        if (!tasks || tasks.length === 0) {
          console.warn("No tasks found for this lesson.");
        }
        else {
          navigation.navigate('task list screen', {lesson_id: lesson_id, lesson_title: lesson_title})
        }
      } catch (error) {
        console.error("Error navigating to task list page:", error);
    }
    }

    /*
    * renderItem -> This is used to render each lesson title in a flat list
    * 
    * FIELDS 
    *   item (object) -> The object containing all of the information about the lesson and whether 
    *       it has been completed
    */
    const renderItem =  ({ item }) => (
      <TouchableOpacity 
        style={[
            styles.item, 
            {
                borderColor: item.is_completed === true ? '#6EC175' : 'black', 
                borderWidth: item.is_completed === true ? 5 : 0
            }
        ]}
        onPress={() => navigate_screens(item.id, item.lesson_title)}
      >
        <Text style={styles.itemTitle}>{item.lesson_title}</Text>
        {item.is_completed ? (<Icon name="checkmark-circle-outline" size={35} style={styles.icon} />) : <></>}
      </TouchableOpacity>
    )



    return (
        <SafeAreaProvider>
        <LinearGradient 
                colors={["#2A1AD8", "#7231EC"]}
                style={styles.background}
        >
            <SafeAreaView style={styles.container}>

                <TextInput
                  style={styles.search}
                  round={true}
                  placeholder="Search..."
                  autoCapitalize='none'
                  autoCorrect={false}
                  onChangeText={search}
                  value={searchItem}
                />

                <FlatList 
                    data={filteredData && filteredData.length > 0 ? filteredData : freeLessons}
                    renderItem={renderItem}
                    keyExtractor={item => item.id}
                />
            
            </SafeAreaView>
        </LinearGradient>
        </SafeAreaProvider>
    )
}


const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
    background: {
        flex: 1,
    },
  search: {
    backgroundColor: "#FBFAF5",
    fontSize: 20,

    borderRadius: 20,
    paddingHorizontal: 20,
    
    marginHorizontal: 22,
    marginBottom: 25,
    marginTop: 20,
    padding: 16,

    flexDirection: 'row',
    width: '90%',
    color: 'black',

    shadowColor: '#000', // Shadow color
    shadowOffset: { width: 0, height: 4 }, // Shadow offset (x, y)
    shadowOpacity: 0.75, // Shadow opacity (0-1)
    shadowRadius: 3.84, // Shadow blur radius
  },
  item: {
    backgroundColor: '#FBFAF5',
    alignItems: 'center',
    justifyContent: 'center',

    width: "85%",

    flexDirection: 'row',
    
    borderRadius: 20,
    padding: 20,
    marginBottom: 71,
    marginHorizontal: 25,


    shadowColor: '#000', // Shadow color
    shadowOffset: { width: 0, height: 4 }, // Shadow offset (x, y)
    shadowOpacity: 0.25, // Shadow opacity (0-1)
    shadowRadius: 3.84, // Shadow blur radius
  },
  itemTitle: {
    fontSize: 25,
    fontWeight: 'bold',
    paddingRight: 15,
    textAlign: 'center',
  },
  icon: {
    color: "#6EC175"
  }
})