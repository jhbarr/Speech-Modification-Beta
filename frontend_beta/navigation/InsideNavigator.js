import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { createStackNavigator } from '@react-navigation/stack';

import HomeScreen from '../inner_screens/HomeScreen';
import LessonTaskNavigator from './LessonTaskNavigator';

const Tab = createBottomTabNavigator();
const Stack = createStackNavigator();

export default function InsideNavigator() {
    return (
        <Tab.Navigator>
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