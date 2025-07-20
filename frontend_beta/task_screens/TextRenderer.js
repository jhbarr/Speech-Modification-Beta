import { StyleSheet, Text, View, ScrollView } from 'react-native';
import { useBottomTabBarHeight } from '@react-navigation/bottom-tabs';


export default function TextRenderer({ textObject, useBottomMargin }){ 

    const tabBarHeight = useBottomTabBarHeight()

    return (
        <ScrollView 
            style={{marginBottom: useBottomMargin ? tabBarHeight + 20 : 0}}
            contentContainerStyle={{alignItems: 'center'}}
        >
            <View style={{backgroundColor: '#FBFAF5', padding: 20, borderRadius: 20, width: '90%'}}>
                <Text style={styles.text}>{textObject.trimEnd()}</Text>
            </View>
        </ScrollView>
    )
}

const styles = StyleSheet.create({
    textScollView: {
    backgroundColor: "#FBFAF5", 
    width: '90%',
    borderRadius: 20,

  },
  text: {
    fontSize: 25,
    fontWeight: 'regular',
    lineHeight: 30,
  },
})