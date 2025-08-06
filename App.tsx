import React, { useState, useEffect } from 'react';
import { View, Text, Button, StyleSheet } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useFonts, Jomhuria_400Regular } from '@expo-google-fonts/jomhuria';
import Authorized from './components/Authorized';
import Unauthorized from './components/Unauthorized';
import "./global.css"
import {LoginResponse} from "./types/auth";

export default function App() {
    const [loginResponse, setLoginResponse] = useState<LoginResponse | null>(null);

  const [fontsLoaded] = useFonts({
    Jomhuria_400Regular,
  });

  useEffect(() => {
    const loadToken = async () => {
      const storedToken = await AsyncStorage.getItem('loginResponse');
      if (storedToken) {
        try {
          const parsedLoginResponse: LoginResponse = JSON.parse(storedToken);
          setLoginResponse(parsedLoginResponse);
        } catch (error) {
          console.error('Error parsing stored login response:', error);
          // Handle invalid stored data by removing it
          await AsyncStorage.removeItem('loginResponse');
        }
      }
    };
    loadToken();
  }, []);

  if (!fontsLoaded) {
    return null;
  }

  const handleLogin = async (loginResponse : LoginResponse) => {
    await AsyncStorage.setItem('loginResponse', JSON.stringify(loginResponse));
    setLoginResponse(loginResponse);
  };

  const handleLogout = async () => {
    await AsyncStorage.removeItem('loginResponse');
    setLoginResponse(null);
  };

  return (
      <View style={styles.container}>
        {loginResponse ? (
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
    backgroundColor: '#1E1E1E',
    alignItems: 'center',
    justifyContent: 'center',
    color: '#fff',
  },
});