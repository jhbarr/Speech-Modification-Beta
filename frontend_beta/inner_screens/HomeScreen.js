import { Button, Text, View } from 'react-native';
import { useContext, useEffect } from 'react';

import { AuthContext } from '../context/AuthContext';
import { ContentContext } from '../context/ContentContext'

export default function HomeScreen() {
  const { logout } = useContext(AuthContext)
  const { getFreeLessons, getFreeTasksByLesson } = useContext(ContentContext)

  return (
    <View style={{flex: 1, justifyContent: 'center', alignItems: 'center'}}>
      <Text>Home Page</Text>
      <Button title="Logout" onPress={logout} />
      <Button title='Get Lessons' onPress={getFreeLessons} />
      <Button title='Get Tasks' onPress={() => getFreeTasksByLesson("All")} />
    </View>
  );
}