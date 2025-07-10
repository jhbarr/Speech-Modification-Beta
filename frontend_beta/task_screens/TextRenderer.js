import React, { useState, useContext } from 'react';
import { Button, StyleSheet, Text, StatusBar, TouchableOpacity, View, Alert, Dimensions, Image, ScrollView } from 'react-native';
import {SafeAreaView, SafeAreaProvider} from 'react-native-safe-area-context';
import { useRoute, useNavigation } from '@react-navigation/native';
import { useBottomTabBarHeight } from '@react-navigation/bottom-tabs';
import { LinearGradient } from 'expo-linear-gradient';
import { useSafeAreaInsets } from 'react-native-safe-area-context';



import Constants from 'expo-constants';
import Ionicons from 'react-native-vector-icons/Ionicons';

export default function TextRenderer({ textObject }){ 

    const tabBarHeight = useBottomTabBarHeight()

    return (
        <ScrollView 
            style={{marginBottom: tabBarHeight + 20}}
            contentContainerStyle={{alignItems: 'center'}}
        >
            <View style={{backgroundColor: '#FBFAF5', padding: 20, borderRadius: 20, width: '90%'}}>
                <Text style={styles.text}>{textObject}</Text>
            </View>
        </ScrollView>
    )
}

styles = StyleSheet.create({
    textScollView: {
    backgroundColor: "#FBFAF5", 
    width: '90%',
    borderRadius: 20,

  },
  text: {
    fontSize: 20,
    fontWeight: 'regular',
    lineHeight: 30,
  },
})