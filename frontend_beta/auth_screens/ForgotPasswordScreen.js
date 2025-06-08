import { Button, Text, View, StyleSheet, TouchableOpacity, TextInput, Alert } from 'react-native';
import { SafeAreaView } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { useState } from 'react';
import Icon from 'react-native-vector-icons/Ionicons';

import api from '../utils/api';

export default function ForgotPasswordScreen() {
    const navigation = useNavigation()
    const [email, setEmail] = useState('')


    const requestPasswordReset = async (email) => {
        if (email != ''){
            try{
                const res = await api.post('auth/request-password-reset/', { email })
                const status = res.status
                
                if (status == 200) {
                    navigation.navigate('verification code screen', { email: email })
                } else {
                    Alert.alert("Verification Failed", data.error || "Unknown error");
                }
            } 
            catch (error) {
                let errorMessage = 'Something went wrong'

                if (error.response && error.response.data && error.response.data.error) {
                    errorMessage = error.response.data.error;
                } else if (error.message) {
                    errorMessage = error.message;
                }

                Alert.alert("Account with email does not exist", errorMessage);
            }
        }
        else {
            Alert.alert("Must be a valid email")
        }

    }

    return (
        <SafeAreaView style={styles.main_container}>
            <TouchableOpacity
                onPress={() => navigation.goBack()}
                style={styles.header_container}
            >
                <Icon style={{ color: 'white' }} name='chevron-back-outline' size={30}/>
            </TouchableOpacity>

            <View style={styles.main_content}>
                <Text style={styles.title_text}>Forgot Password</Text>
                <Text style={styles.normal_text}>Please enter your email to get a verification code</Text>

                <View style={styles.inputContainer}>
                    <Icon name="mail-outline" size={25} style={styles.icon} />
                    <TextInput
                        style={[styles.input, {fontSize: 15}]}
                        placeholder="Email"
                        keyboardType="email-address"
                        autoCapitalize='none'
                        onChangeText={setEmail}
                        value={email}
                    />
                </View>

                <View style={{ flex: 1 }} />

                <TouchableOpacity
                    style={styles.button}
                    onPress={() => requestPasswordReset(email)}
                >
                    <Text style={styles.buttonText}>Continue</Text>
                </TouchableOpacity>
            </View>
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
  main_container: {
    flex: 1,
    backgroundColor: '#00B0FC'
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
    marginBottom: 20,
  },
  icon: {
    marginRight: 15,
  },
  input: {
    flex: 1,
    height: '100%',
  },
  button: {
    width: '100%',
    height: 50,
    backgroundColor: '#1E90FF',
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