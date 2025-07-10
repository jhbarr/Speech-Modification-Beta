import { StyleSheet } from 'react-native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';

import LessonTaskNavigator from './LessonTaskNavigator';
import HomeScreen from '../inner_screens/HomeScreen';

import Ionicons from 'react-native-vector-icons/Ionicons';

const Tab = createBottomTabNavigator();

export default function InsideNavigator() {
    return (
        <Tab.Navigator
            screenOptions={({ route }) => ({
                tabBarStyle: {
                    backgroundColor: '#FBFAF5',
                    height: 90,
                    borderTopWidth: 0,
                    borderRadius: 50,

                    justifyContent: 'center',
                    alignItems: 'center',
                    position: 'absolute',
                },

                tabBarIcon: ({ focused, color, size }) => {
                let iconName;

                if (route.name === 'Home') {
                    iconName = focused
                    ? 'home'
                    : 'home-outline';
                }

                if (route.name == 'Free Lessons') {
                    iconName = focused 
                    ? 'school'
                    : 'school-outline'
                }

                    // You can return any component that you like here!
                    return <Ionicons name={iconName} size={42} color={color} style={{height: 42, width: 42, marginTop: 30}}/>;
                },
                tabBarActiveTintColor: '#7231EC',
                tabBarInactiveTintColor: '#2A1AD8',
                tabBarShowLabel: false,
        })}
        >
            <Tab.Screen 
                name='Home'
                component={HomeScreen}
                options={{ headerShown: false }}
            />
            <Tab.Screen 
                name='Free Lessons'
                component={LessonTaskNavigator}
                options={{ headerShown: false }}
            />
        </Tab.Navigator>
    )
}

const styles = StyleSheet.create({
    tabBarStyle: {
        backgroundColor: "red",
        height: 150,
    },
    tabBarItemStyle: {
        borderRadius: 50,
    }
})