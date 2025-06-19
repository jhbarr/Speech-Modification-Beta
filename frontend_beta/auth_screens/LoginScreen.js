import { useContext } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet } from 'react-native';
import {SafeAreaView, SafeAreaProvider} from 'react-native-safe-area-context';
import { useState } from 'react';
import { useNavigation } from '@react-navigation/native';
import Icon from 'react-native-vector-icons/Ionicons';

import { AuthContext } from '../context/AuthContext';
import { LinearGradient } from 'expo-linear-gradient';

export default function LoginScreen() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const { login } = useContext(AuthContext);
  const navigation = useNavigation()

  return (
    <SafeAreaProvider>
    <LinearGradient
      colors={["#2A1AD8", "#7231EC"]}
      style={styles.background}
    >

      <SafeAreaView style={styles.container}>

        <View style={styles.titleContainer}>
          <Text style={styles.titleText}>Welcome Back</Text>
        </View>

        <View style={{ flex: 0.5 }}></View>

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

        <TouchableOpacity
          onPress={() => navigation.navigate('forgot password screen')}
        >
          <Text style={[styles.linkText, {fontWeight: '500'}]}>Forgot Password</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.loginButton}
          onPress={() => login(email, password)}
        >
          <Text style={styles.loginText}>Login</Text>
        </TouchableOpacity>

        <TouchableOpacity
          onPress={() => navigation.replace('register')}
        >
          <Text style={[styles.linkText, {fontWeight: '300'}]}>Sign Up</Text>
        </TouchableOpacity>

      </SafeAreaView>

    </LinearGradient>
    </SafeAreaProvider>
  )
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
    flex: 0.2,
    justifyContent: 'center',
    alignItems: 'center',
    // marginBottom: 25,
    marginTop: 100,
  },
  titleText: {
    fontSize: 50,
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
    shadowOffset: { width: 0, height: 4 }, // Shadow offset (x, y)
    shadowOpacity: 0.75, // Shadow opacity (0-1)
    shadowRadius: 3.84, // Shadow blur radius
  },
  input: {
    flex: 1,
    fontSize: 20, 
    fontWeight: 'bold', 
    paddingHorizontal: 15
  },
  linkText: {
    fontSize: 16,
    color: '#FBFAF5',
  },
  loginButton: {
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
  loginText: {
    fontSize: 20,
    color: '#FBFAF5'
  }
})
