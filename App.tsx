import React, { useState, useEffect } from 'react';
import { View, Text, Button, StyleSheet } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useFonts, Jomhuria_400Regular } from '@expo-google-fonts/jomhuria';
import Authorized from './components/Authorized';
import Unauthorized from './components/Unauthorized';
import "./global.css"
import {LoginResponse} from "./types/Auth";
import {ValidateToken} from "./clients/AuthClient";
import Loading from "./components/generic/Loading";

export default function App() {
    const [loginResponse, setLoginResponse] = useState<LoginResponse | null>(null);
    const [loading, setLoading] = useState(true);

  const getLoginResponse = (): LoginResponse | null => {
    return loginResponse;
  };

  const [fontsLoaded] = useFonts({
    Jomhuria_400Regular,
  });

  useEffect(() => {
    const loadToken = async () => {
      const storedToken = await AsyncStorage.getItem('loginResponse');
      if (storedToken) {
        try {
          const parsedLoginResponse: LoginResponse = await JSON.parse(storedToken);
          await ValidateToken(parsedLoginResponse?.jwt || '');
          setLoginResponse(parsedLoginResponse);
          setLoading(false);
        } catch (error) {
          console.error('Invalid token:', error);
          // Handle invalid stored data by removing it
          await AsyncStorage.removeItem('loginResponse');
          setLoading(false);
        }
      } else {
        setLoading(false);
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

  if (loading) {
    return <Loading/>;
  }

  return (
      <View className={"w-full h-full flex-1 background-gray items-center justify-center text-white"}>
        {loginResponse ? (
            <Authorized onLogout={handleLogout} children={undefined} loginResponse={getLoginResponse} setLoginResponse={setLoginResponse}/>
        ) : (
            <Unauthorized onLogin={handleLogin} children={undefined}/>
        )}
      </View>
  );
}