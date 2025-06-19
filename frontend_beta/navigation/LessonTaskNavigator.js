import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { createNativeStackNavigator } from '@react-navigation/native-stack';

import LessonsScreen from '../inner_screens/LessonsScreen';
import TaskListScreen from '../inner_screens/TaskListScreen';
import TaskScreen from '../inner_screens/TaskScreen';

const Stack = createNativeStackNavigator()

export default function LessonTaskNavigator() {
    return (
        <Stack.Navigator>
            <Stack.Screen 
                name='lesson screen'
                component={LessonsScreen}
                options={{ headerShown: false }}
            />
            <Stack.Screen 
                name='task list screen'
                component={TaskListScreen}
                options={{ headerShown: false }}
            />
            <Stack.Screen 
                name='task screen'
                component={TaskScreen}
                options={{ headerShown: false }}
            />
        </Stack.Navigator>
    )
}