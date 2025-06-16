import { View, TextInput, Button, StyleSheet, Text, TouchableOpacity, Alert } from 'react-native';
import { useContext, useState } from 'react';
import { useNavigation } from '@react-navigation/native';
import Icon from 'react-native-vector-icons/Ionicons';

import { AuthContext } from '../context/AuthContext';

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
    <View style={styles.main_container}>
      <View style={styles.titleContainer}>
        <Text style={[styles.titleText, {color: 'white'}]}>Get started now</Text>
      </View>
      <View style={styles.container}>
        <Text style={styles.title}>Enter an email & password</Text>

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
        {checkPassword !== '' && password != checkPassword ? 
        (<Text style={{color: 'red'}}>Passwords do not match</Text>) :
        (<></>)
        }
        <TouchableOpacity
            style={styles.button}
            onPress={register_check}
          >
          <Text style={styles.buttonText}>Register</Text>
        </TouchableOpacity>
        <TouchableOpacity onPress={() => navigation.replace('login')}>
          <Text style={styles.register}>Back to Login</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
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
    fontSize: 15,
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
  register: {
    color: '#000',
    fontSize: 16,
    color: '#1E90FF',
  },
})