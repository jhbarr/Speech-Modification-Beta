import { Button, Text, View } from 'react-native';
import { useContext, useEffect } from 'react';

import { AuthContext } from '../context/AuthContext';

export default function HomeScreen() {
  const { logout } = useContext(AuthContext)

  return (
    <View style={{flex: 1, justifyContent: 'center', alignItems: 'center'}}>
      <Text>Home Page</Text>
      <Button title="Logout" onPress={logout} />
    </View>
  );
}