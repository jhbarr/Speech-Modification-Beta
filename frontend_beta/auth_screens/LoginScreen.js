import { useContext } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet } from 'react-native';
import { useState } from 'react';
import { useNavigation } from '@react-navigation/native';
import Icon from 'react-native-vector-icons/Ionicons';

import { AuthContext } from '../context/AuthContext';

export default function LoginScreen() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const { login } = useContext(AuthContext);
  const navigation = useNavigation()

  return (
    <View style={styles.main_container}>
      <View style={styles.titleContainer}>
        <Text style={[styles.titleText, {color: 'white'}]}>Welcome Back!</Text>
      </View>
    <View style={styles.container}>
      <Text style={styles.title}>Enter your credentials</Text>

      <View style={styles.inputContainer}>
        <Icon name='mail-outline' size={25} style={styles.icon}/>
        <TextInput 
          style={[styles.input, {fontSize: 15}]}
          placeholder="Email"
          keyboardType="email-address"
          onChangeText={setEmail}
          autoCapitalize='none'
          value={email}
        />
      </View>
      <View style={styles.inputContainer}>
          <Icon name="lock-closed-outline" size={25} style={styles.icon} />
          <TextInput
            style={[styles.input, {fontSize: 15}]}
            placeholder="Password"
            secureTextEntry
            autoCapitalize='none'
            onChangeText={setPassword}
            value={password}
          />
      </View>

      <TouchableOpacity
          onPress={() => navigation.navigate('forgot password screen')}
        >
        <Text style={styles.signUpLink}>Forgot Password</Text>
      </TouchableOpacity>

      <TouchableOpacity
          style={styles.button}
          onPress={() => login(email, password)}
        >
        <Text style={styles.buttonText}>Login</Text>
      </TouchableOpacity>

      <TouchableOpacity onPress={() => navigation.replace('register')}>
          <Text style={styles.signUp}>Don't have an account? 
            <Text style={styles.signUpLink}> Sign Up</Text>
          </Text>
      </TouchableOpacity>

    </View>
    </View>
  )
}

const styles = StyleSheet.create({
  main_container: {
    flex: 1,
    justifyContent: 'center',
    backgroundColor: '#00B0FC'
  },
  titleContainer: {
    flex: 0.2,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 25,
  },
  titleText: {
    fontSize: 50,
    fontWeight: 'bold'
  },
  container: {
    flex: 0.55,
    marginLeft: 15,
    marginRight: 15,
    marginBottom: 50,

    // borderTopLeftRadius: 75,
    // borderTopRightRadius: 75,
    // borderBottomLeftRadius: 30,
    // borderBottomRightRadius: 30,
    borderRadius: 75,

    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#fff',
    paddingHorizontal: 20,
  },
  logo: {
    height: 100,
    width: 100,
    resizeMode: 'contain',
    // marginBottom: 150,
  },
  name: {
    alignSelf: 'center',
  },
  title: {
    fontSize: 25,
    marginBottom: 40,
    color: 'black',
    marginBottom: 40,
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
  signUp: {
    color: '#000',
    fontSize: 16,
  },
  signUpLink: {
    color: '#1E90FF',
  },
})
