import { Button, Text, SafeAreaView } from 'react-native';
import { useContext, useEffect } from 'react';

import { AuthContext } from '../context/AuthContext';
import { ContentContext } from '../context/ContentContext'
import { SafeAreaProvider } from 'react-native-safe-area-context';

export default function HomeScreen() {
  const { logout } = useContext(AuthContext)
  const { retrieveFreeLessons, getFreeTasksByLesson, completeFreeTask, syncCompletedTasks, freeLessonLoadInit } = useContext(ContentContext)

  useEffect(() => {
    freeLessonLoadInit()
  }, [])

  return (
    <SafeAreaProvider>
    <SafeAreaView style={{flex: 1, justifyContent: 'center', alignItems: 'center'}}>
      <Text>Home Page Test</Text>
      <Button title="Logout" onPress={logout} />
      {/* <Button title='Get Lessons' onPress={() => retrieveFreeLessons()} />
      <Button title='Get Tasks "2020 New Years SMART Goals Challenge"' onPress={() => getFreeTasksByLesson(2)} />

      <Button title='Complete Task' onPress={() => completeFreeTask(2, 20)}/>
      <Button title='Sync Tasks' onPress={() => syncCompletedTasks()}/> */}
    </SafeAreaView>
    </SafeAreaProvider>
  );
}