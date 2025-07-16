import { useState } from 'react';
import { StyleSheet, TouchableOpacity, View, Dimensions, Image } from 'react-native';
import { useBottomTabBarHeight } from '@react-navigation/bottom-tabs';

export default function ImageRenderer({ imageObject, useStyle }) {
    // global state variables for UX
    const [isEnlarged, setIsEnlarged] = useState(false);

    const tabBarHeight = useBottomTabBarHeight()

    return (
        <View style={useStyle ? { flex: 1, marginBottom: tabBarHeight + 50, justifyContent:'center'} : {}}>
        <TouchableOpacity 
            style={[styles.imageContainer, {alignSelf: 'center'}]}
            onPress={() => setIsEnlarged(!isEnlarged)}
        >
            <Image 
                source={{ uri: imageObject }}
                style={[
                    styles.image,
                    {
                        height: isEnlarged ? Dimensions.get('window').height * 0.6 : Dimensions.get('window').height * 0.4,
                        width: isEnlarged ? Dimensions.get('window').width : Dimensions.get('window').width * 0.85
                    }
                ]}
            />
        </TouchableOpacity>
        </View>
    )
}

styles = StyleSheet.create({
    imageContainer: {
    width: '90%',
    alignItems: 'center',
    justifyContent: 'center',
    // paddingHorizontal: 50,
    backgroundColor: "#FBFAF5",
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