import { useState } from 'react';
import { Button, StyleSheet, Text, TouchableOpacity, View, Alert, Dimensions, Image, FlatList } from 'react-native';
import { useRoute, useNavigation } from '@react-navigation/native';
import { LinearGradient } from 'expo-linear-gradient';
import { useBottomTabBarHeight } from '@react-navigation/bottom-tabs';

import AudioRecorder from './AudioRecorder';
import TextRenderer from './TextRenderer';
import VideoPlayer from './VideoPlayer';
import ImageRenderer from './ImageRenderer';

export default function MixedPracticeRenderer({ mixedObject }) {

    const tabBarHeight = useBottomTabBarHeight()

    const tasksList = mixedObject.map((item, index) => ({
        ...item,
        id: index + 1
    }))

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
    const renderItem = ({ item } ) => {
        switch (item.type) {
            case "video":
                return <VideoPlayer videoObject={item.content}/>
            case "paragraph":
                return <TextRenderer textObject={item.content}/>
            case "image":
                // return renderImage(item.content)
                return <ImageRenderer imageObject={item.content}/>
            case "audio":
                return <AudioRecorder audioObject={item}/>
            default:
                Alert.alert("No valid pre-built renderer found (in mixed practice renderer)")
        }
    }

    return (
        <FlatList 
            data={tasksList}
            renderItem={renderItem}
            keyExtractor={item => item.id}
            style={{marginBottom: tabBarHeight + 20}}
        />
    )
}