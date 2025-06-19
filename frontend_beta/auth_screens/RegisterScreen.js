import { View, TextInput, Button, StyleSheet, Text, TouchableOpacity, Alert } from 'react-native';
import {SafeAreaView, SafeAreaProvider} from 'react-native-safe-area-context';
import { useContext, useState } from 'react';
import { useNavigation } from '@react-navigation/native';
import Icon from 'react-native-vector-icons/Ionicons';

import { AuthContext } from '../context/AuthContext';
import { LinearGradient } from 'expo-linear-gradient';

export default function RegisterScreen() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [checkPassword, setCheckPassword] = useState('')
  const { register } = useContext(AuthContext)
  const navigation = useNavigation()

  const register_check = () => {
    if (password == checkPassword) {
      register(email, password)
    }
    else {
      Alert.alert("Passwords do not match")
    }
  }

  return (
    <SafeAreaProvider>
    <LinearGradient
      colors={["#2A1AD8", "#7231EC"]}
      style={styles.background}
    >
      <SafeAreaView style={styles.container}>

        <View style={styles.titleContainer}>
          <Text style={styles.titleText}>Welcome to Speech Modification</Text>
        </View>

        <View style={{ flex: 0.25 }}></View>
        
        <View style={styles.inputContainer}>
          <Icon name='mail-outline' size={25} style={styles.icon}/>
          <TextInput 
            style={styles.input}
            placeholder="Email"
            keyboardType="email-address"
            onChangeText={setEmail}
            autoCapitalize='none'
            value={email}
          />
        </View>

        <View style={styles.inputContainer}>
          <Icon name='lock-closed-outline' size={25} style={styles.icon}/>
          <TextInput 
            style={styles.input}
            placeholder="Password"
            secureTextEntry
            onChangeText={setPassword}
            autoCapitalize='none'
            value={password}
          />
        </View>

        <View 
          style={[
            styles.inputContainer,
            {
              borderWidth: password === checkPassword ? 0 : 4,
              borderColor: password === checkPassword ? 'green' : 'red'
            }
          ]}
        >
          <Icon name='lock-closed-outline' size={25} style={styles.icon}/>
          <TextInput 
            style={styles.input}
            placeholder="Re-type Password"
            secureTextEntry
            onChangeText={setCheckPassword}
            autoCapitalize='none'
            value={checkPassword}
          />
        </View>

        <TouchableOpacity
          style={styles.registerButton}
          onPress={register_check}
        >
          <Text style={styles.registerText}>Register</Text>
        </TouchableOpacity>

        <TouchableOpacity
          onPress={() => navigation.replace('login')}
        >
          <Text style={[styles.linkText, {fontWeight: '300'}]}>Back to Login</Text>
        </TouchableOpacity>

      </SafeAreaView>
    </LinearGradient>
    </SafeAreaProvider>
  );
}


const styles = StyleSheet.create({
  container: {
    flex: 1,
    // justifyContent: 'center',
    alignItems: 'center',
  },
  background: {
    flex: 1,
  },
  titleContainer: {
    flex: 0.5,
    width: "100%",
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 25,
  },
  titleText: {
    fontSize: 40,
    textAlign: "center",
    fontWeight: 'bold',
    color: "#FBFAF5",
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    width: '75%',
    backgroundColor: '#FBFAF5',
    paddingHorizontal: 17,
    paddingVertical: 13,
    borderRadius: 20,
    marginBottom: 50,

    shadowColor: '#000', // Shadow color
    shadowOffset: { width: 0, height: 3 }, // Shadow offset (x, y)
    shadowOpacity: 0.75, // Shadow opacity (0-1)
    shadowRadius: 3.84, // Shadow blur radius
  },
  input: {
    flex: 1,
    fontSize: 20, 
    fontWeight: 'bold', 
    paddingHorizontal: 15
  },
  registerButton: {
    width: "50%",
    backgroundColor: '#2A1AD8',
    opacity: 0.75,
    borderRadius: 10,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 20,
    marginTop: 25,

    paddingHorizontal: 30,
    paddingVertical: 20,

    shadowColor: '#000', // Shadow color
    shadowOffset: { width: 0, height: 7 }, // Shadow offset (x, y)
    shadowOpacity: 0.25, // Shadow opacity (0-1)
    shadowRadius: 3.84, // Shadow blur radius
  },
  registerText: {
    fontSize: 20,
    color: '#FBFAF5'
  },
  linkText: {
    fontSize: 16,
    color: '#FBFAF5',
  },
})