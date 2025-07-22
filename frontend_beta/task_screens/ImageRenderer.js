import { useEffect, useState } from 'react';
import { StyleSheet, TouchableOpacity, View, Dimensions, Image } from 'react-native';
import { useBottomTabBarHeight } from '@react-navigation/bottom-tabs';

export default function ImageRenderer({ imageObject, useStyle }) {
    // global state variables for UX
    const [isEnlarged, setIsEnlarged] = useState(false);
    const [imageHeight, setImageHeight] = useState(0)
    const [imageWidth, setImageWidth] = useState(0)

    const ImageRefactor = Dimensions.get('screen').width * 0.9

    const tabBarHeight = useBottomTabBarHeight()

    useEffect(() => {
        Image.getSize(
            imageObject,
            (width, height) => {
                setImageHeight(height)
                setImageWidth(width)
            },
            (error) => {
                console.log("Failed to get image size", error)
            }
        )
    }, [])

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
                        height: (imageHeight) * (ImageRefactor / imageWidth),
                        width: (imageWidth) * (ImageRefactor / imageWidth)
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
    paddingHorizontal: 10,
    paddingVertical: 16,
  }
})