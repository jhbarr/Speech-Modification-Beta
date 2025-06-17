import React, { useState } from 'react';
import { FlatList, StyleSheet, Text, StatusBar, TextInput, TouchableOpacity} from 'react-native';
import {SafeAreaView, SafeAreaProvider} from 'react-native-safe-area-context';
import { useContext } from 'react';
import { useNavigation } from '@react-navigation/native';

import { ContentContext } from '../context/ContentContext';

export default function LessonsScreen() {
    // Retrieve the necessary information from the content context
    const { freeLessons, getFreeTasksByLesson } = useContext(ContentContext)

    // Set up navigation ability for the screen
    const navigation = useNavigation()

    const navigate_screens = async (lesson_id) => {
        await getFreeTasksByLesson(lesson_id)
        navigation.navigate('task screen', {lesson_id: lesson_id})
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
                borderColor: item.is_completed === true ? 'green' : null, 
                borderWidth: item.is_completed === true ? 3 : 0
            }
        ]}
        onPress={() => navigate_screens(item.id)}
      >
        <Text style={styles.title}>{item.lesson_title}</Text>
      </TouchableOpacity>
    )



    return (
        <SafeAreaProvider>
        <SafeAreaView>

            <FlatList 
                data={freeLessons}
                renderItem={renderItem}
                keyExtractor={item => item.id}
            />

        </SafeAreaView>
        </SafeAreaProvider>
    )
}


const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    // alignItems: 'center',
    marginTop: StatusBar.currentHeight || 0,
    backgroundColor: '#00B0FC',
  },
  item: {
    backgroundColor: '#FAF9F6',
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 30,
    padding: 20,
    marginVertical: 8,
    marginHorizontal: 16,
    borderWidth: 3,
  },
  title: {
    fontSize: 25,
    fontWeight: 'bold',
  },
  search: {
    flexDirection: 'row',
    alignItems: 'center',
    width: '100%',
    height: 65,
    fontSize: 25,
    backgroundColor: '#f1f1f1',
    borderRadius: 20,
    paddingHorizontal: 10,
    
    // margin: 25,
    marginBottom: 25,
  },
})