import { Text, View, StyleSheet, TouchableOpacity, TextInput, Alert } from 'react-native';
import { SafeAreaView } from 'react-native';
import { useNavigation, useRoute } from '@react-navigation/native';
import { useState } from 'react';
import Icon from 'react-native-vector-icons/Ionicons';

import api from '../utils/api';

export default function VerificationCodeScreen() {
    const navigation = useNavigation()
    const route = useRoute();
    const email = route.params?.email;

    const [code, setCode] = useState('')


    const verifyCode = async (code) => {
        if (code.length == 6){
            try{
                const res = await api.get(`auth/password-reset-confirm/${email}/${code}/`)
                
                const data = res.data
                if (data.success) {
                    navigation.navigate('password confirmation screen', {email: email, code: code});
                } else {
                    Alert.alert("Verification Failed", data.error || "Unknown error");
                }
            } 
            catch (error) {
                let errorMessage = "Something went wrong";

                if (error.response && error.response.data && error.response.data.error) {
                    errorMessage = error.response.data.error;
                } else if (error.message) {
                    errorMessage = error.message;
                }

                Alert.alert("Unable to verify code", errorMessage);
            }
        }
        else {
            Alert.alert("Must be a valid code")
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
                <Text style={styles.title_text}>Verification</Text>
                <Text style={styles.normal_text}>We've sent an email with a verification code. Please enter the 6-digits you receive</Text>

                <View style={styles.inputContainer}>
                    <Icon name="lock-closed-outline" size={25} style={styles.icon} />
                    <TextInput
                        style={[styles.input, {fontSize: 15}]}
                        placeholder="Code"
                        keyboardType="numeric"
                        autoCapitalize='none'
                        onChangeText={setCode}
                        value={code}
                    />
                </View>

                <View style={{ flex: 1 }} />

                <TouchableOpacity
                    style={styles.button}
                    onPress={() => verifyCode(code)}
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