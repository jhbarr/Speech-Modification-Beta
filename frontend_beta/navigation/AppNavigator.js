import React, {useContext} from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { ActivityIndicator, View } from 'react-native';

import { AuthContext } from '../context/AuthContext';

import LoginScreen from '../auth_screens/LoginScreen';
import RegisterScreen from '../auth_screens/RegisterScreen';
import HomeScreen from '../inner_screens/HomeScreen';
import ForgotPasswordScreen from '../auth_screens/ForgotPasswordScreen';
import VerificationCodeScreen from '../auth_screens/VerificationCodeScreen';
import PasswordConfirmationScreen from '../auth_screens/PasswordConfirmationScreen';


const Stack = createNativeStackNavigator()

export default function AppNavigator() {
    // Import these from the AuthContext to see when the user is logged in properly or logged out
    const { isAuthenticated, authLoading } = useContext(AuthContext);

    // Check to see if authLoading is true. If so, then the backend and frontend are communicating regarding the 
    // user's credentials and so we do not want the user doing any other kinds of activities while this is happening
    if (authLoading) {
        // Return a generic splash loading screen
        return (
            <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
                <ActivityIndicator size="large" />
            </View>
        )
    }

    
    // If authloading is not true
    return (
        <NavigationContainer>
            <Stack.Navigator screenOptions={{headerShown: false}}>
                {/* 
                Conditionally render either the auth screens or the inner app screens 
                depending on the user's authentication status
                */}
                {isAuthenticated ? 
                (
                    <Stack.Screen name='home' component={HomeScreen}/>
                    // <Stack.Screen 
                    //     name='home' 
                    //     component={InsideNavigator}
                    //     options={{ headerShown: false }}
                    // />
                ) : (
                    <>
                    <Stack.Screen name='login' component={LoginScreen}/>
                    <Stack.Screen name='register' component={RegisterScreen}/>

                    <Stack.Screen name='forgot password screen' component={ForgotPasswordScreen}/>
                    <Stack.Screen name='verification code screen' component={VerificationCodeScreen}/>
                    <Stack.Screen name='password confirmation screen' component={PasswordConfirmationScreen}/>
                    </>
                )}
            </Stack.Navigator>
        </NavigationContainer>
    )

}