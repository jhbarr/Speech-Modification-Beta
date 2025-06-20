import { View, TextInput, StyleSheet, Text, TouchableOpacity, SafeAreaView, Alert } from 'react-native';
import { useState } from 'react';
import { useNavigation, useRoute } from '@react-navigation/native';
import Icon from 'react-native-vector-icons/Ionicons';

import api from '../utils/api';
import { LinearGradient } from 'expo-linear-gradient';

export default function PasswordConfirmationScreen() {
    const [password, setPassword] = useState('');
    const [checkPassword, setCheckPassword] = useState('')

    const navigation = useNavigation()
    const route = useRoute();
    const email = route.params?.email;
    const code = route.params?.code;

    const submitNewPassword = async (password) => {
        if (password == checkPassword) {
            try {
                const res = await api.patch('auth/set-new-password/', {password, email, code})

                const data = res.data
                if (data.success) {
                    navigation.navigate('login');
                } else {
                    Alert.alert("Create new password failed", data.error || "Unknown error");
                }
            }
            catch (error) {
                let errorMessage = "Something went wrong";

                if (error.response && error.response.data && error.response.data.error) {
                    errorMessage = error.response.data.error;
                } else if (error.message) {
                    errorMessage = error.message;
                }

                Alert.alert("Unable to create new password", errorMessage);
            }
        }
        else {
            Alert.alert("Passwords must match")
        }
    }   

    return (
        <LinearGradient
            colors={["#2A1AD8", "#7231EC"]}
            style={styles.background}
        >
        <SafeAreaView style={styles.main_container}>
            <TouchableOpacity
                onPress={() => navigation.goBack()}
                style={styles.header_container}
            >
                <Icon style={{ color: 'white' }} name='chevron-back-outline' size={30}/>
            </TouchableOpacity>
                
        <View style={styles.main_content}>
            <Text style={styles.title_text}>Create New Password</Text>
            <Text style={styles.normal_text}>Create and confirm a new password for your account</Text>

            <View style={styles.inputContainer}>
                <Icon name="lock-closed-outline" size={25} style={styles.icon} />
                <TextInput
                    style={styles.input}
                    placeholder="Password"
                    secureTextEntry
                    autoCapitalize='none'
                    onChangeText={setPassword}
                    value={password}
                />
            </View>

            <View 
                style={[
                styles.inputContainer, 
                {
                    borderWidth: 2, 
                    borderColor: password == checkPassword ? 'green' : 'red',
                }
                ]}
            >
                <Icon name="lock-closed-outline" size={25} style={styles.icon} />
                <TextInput
                    style={styles.input}
                    placeholder="Re-type Password"
                    secureTextEntry
                    autoCapitalize='none'
                    onChangeText={setCheckPassword}
                    value={checkPassword}
                />
            </View>

            <View style={{ flex: 1 }} />
            
            <TouchableOpacity
                style={styles.button}
                onPress={() => submitNewPassword(password)}
            >
                <Text style={styles.buttonText}>Continue</Text>
            </TouchableOpacity>
        </View>

        </SafeAreaView>
        </LinearGradient>
    )
}

const styles = StyleSheet.create({
    background: {
        flex: 1,
    },  
    main_container: {
        flex: 1,
    },
    header_container: {
        justifyContent: 'center',
        padding: 15
    },
    main_content: {
        flex: 1,
        padding: 20,
        flexDirection: 'column',
    }, 
    title_text: {
        fontSize: 35,
        color: 'white',
        fontWeight: 'bold',
        marginBottom: 25,
    },
    normal_text: {
        fontSize: 20,
        fontWeight: '300',
        color: 'white',
        marginBottom: 25,
    },
    inputContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        width: '100%',
        height: 50,
        backgroundColor: '#f1f1f1',
        borderRadius: 20,
        paddingHorizontal: 10,
        marginBottom: 50,
    },
    icon: {
        marginRight: 15,
    },
    input: {
        flex: 1,
        height: '100%',
        fontSize: 15,
    },
    button: {
        width: '100%',
        height: 50,
        backgroundColor: '#2A1AD8',
        borderRadius: 20,

        justifyContent: 'center',
        alignItems: 'center',
        marginBottom: 20,
        marginTop: 25,
    },
    buttonText: {
        color: '#fff',
        fontSize: 20,
    },
})