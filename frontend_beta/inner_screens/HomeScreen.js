import { Button, Text, SafeAreaView, StyleSheet, TouchableOpacity, View } from 'react-native';
import { useContext, useEffect, useState } from 'react';
import { LinearGradient } from 'expo-linear-gradient';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { useNavigation } from '@react-navigation/native';

import { Drawer } from 'react-native-drawer-layout';
import { Dimensions } from 'react-native';
import Constants from 'expo-constants';

import Ionicons from 'react-native-vector-icons/Ionicons';


import { AuthContext } from '../context/AuthContext';
import { ContentContext } from '../context/ContentContext'


export default function HomeScreen() {
  const { logout } = useContext(AuthContext)
  const { freeLessonLoadInit } = useContext(ContentContext)

  // Controls the state of the drawer
  const [open, setOpen] = useState(false);

  useEffect(() => {
    freeLessonLoadInit()
  }, [])

  /*
  * renderDrawerContent -> Render the content shown inside the drawer
  * 
  * FIELDS
  *   none
  */
  const renderDrawerContent = () => (
    <View style={styles.drawer}>
      <TouchableOpacity style={styles.drawerButton} onPress={logout} title="Logout">
        <Text style={styles.drawerText}>Logout</Text>
        <Ionicons name='log-out-outline' size={35} style={{ paddingLeft: 20,}}/>
      </TouchableOpacity>
    </View>
  )

  return (
    <SafeAreaProvider>
      <LinearGradient
        colors={["#2A1AD8", "#7231EC"]}
        style={styles.background}
      >
        <Drawer
          open={open}
          onOpen={() => setOpen(true)}
          onClose={() => setOpen(false)}
          renderDrawerContent={renderDrawerContent}
          drawerStyle={{
            width: Dimensions.get("window").width * 0.4
          }}
          >
            <SafeAreaView style={styles.container}>

              <TouchableOpacity
                onPress={() => setOpen((prevOpen) => !prevOpen)}
                style={styles.iconButton}
                >
                  <Ionicons style={{ color: '#FBFAF5' }} name='person-circle-outline' size={45}/>
              </TouchableOpacity>

              

            </SafeAreaView>
        </Drawer>

      </LinearGradient>
    </SafeAreaProvider>
  );
}

const styles = StyleSheet.create({
  container: {
      flex: 1,
    },
    background: {
        flex: 1,
    },
    iconButton: {
      margin: 25,
    },
    drawer: {
      flex: 1,
      backgroundColor: '#FBFAF5',
    },
    drawerButton: {
      flexDirection: 'row',
      justifyContent: 'center',
      alignItems: 'center',
      marginTop: Constants.statusBarHeight,

      shadowColor: '#000', // Shadow color
      shadowOffset: { width: 0, height: 3 }, // Shadow offset (x, y)
      shadowOpacity: 0.2, // Shadow opacity (0-1)
      shadowRadius: 3.84, // Shadow blur radius
    },
    drawerText: {
      fontSize: 20,
      fontWeight: 'bold',
    }
})