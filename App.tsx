import React, { useState, useEffect } from 'react';
import { View, Text, Button, StyleSheet } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import Authorized from './components/Authorized';
import Unauthorized from './components/Unauthorized';

  export default function App() {
    const [jwt, setJwt] = useState<string | null>(null);

    useEffect(() => {
      const loadToken = async () => {
        const storedToken = await AsyncStorage.getItem('jwt');
        if (storedToken) {
          setJwt(storedToken);
        }
      };
      loadToken();
    }, []);

    const handleLogin = async () => {
      const token = 'fake-jwt-token';
      await AsyncStorage.setItem('jwt', token);
      setJwt(token);
    };

    const handleLogout = async () => {
      await AsyncStorage.removeItem('jwt');
      setJwt(null);
    };

    return (
        <View style={styles.container}>
          {jwt ? (
              <Authorized onLogout={handleLogout} children={undefined}/>
          ) : (
              <Unauthorized onLogin={handleLogin} children={undefined}/>
          )}
        </View>
    );
  }


const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },
});
