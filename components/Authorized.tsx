import {Button, Image, Text, TouchableOpacity, View, Animated} from "react-native";
import LargeLogo, { SmallLogo } from "./generic/Logo";
import { useState, useRef, useEffect } from "react";
import {LoginResponse} from "../types/auth";
import AccountInformation from "./dashboard/AccountInformation";
import Home from "./dashboard/Home";

function Authorized({ children, onLogout, loginResponse }: { children: React.ReactNode, onLogout: () => void, loginResponse: () => LoginResponse | null }) {
    const [screen, setScreen] = useState('home');
    const fadeAnim = useRef(new Animated.Value(1)).current;

    const changeScreen = (newScreen: string) => {
        if (newScreen === screen) return;

        Animated.sequence([
            Animated.timing(fadeAnim, {
                toValue: 0,
                duration: 150,
                useNativeDriver: true,
            }),
            Animated.timing(fadeAnim, {
                toValue: 1,
                duration: 150,
                useNativeDriver: true,
            }),
        ]).start();

        setTimeout(() => setScreen(newScreen), 150);
    };

    const renderContent = () => {
        switch(screen) {
            case 'home':
                return (
                    <Home loginResponse={loginResponse}/>
                );
            case 'calendar':
                return (
                    <View>
                        <Text className="text-white font-jomhuria text-2xl justify-center">Calendar Screen</Text>
                    </View>
                );
            case 'profile':
                return (
                    <AccountInformation loginResponse={loginResponse} onLogout={onLogout}/>
                );
            default:
                return null;
        }
    };

    return (
        <View className={"w-full h-full flex flex-col"}>
            <View className={"w-full flex flex-row justify-between items-center p-4"}>
                <SmallLogo />
                <Text className="text-red font-jomhuria text-4xl">{loginResponse()?.user.username}</Text>
            </View>

            <Animated.View style={{ flex: 1, opacity: fadeAnim }}>
                {renderContent()}
            </Animated.View>

            <View className={"w-full flex flex-row justify-between items-center p-0 pl-1 pr-1 pb-8 background-light-gray mt-auto"}>
                <TouchableOpacity onPress={() => changeScreen('home')}>
                    <Image
                        className={"w-16 h-16"}
                        source={screen === 'home' ? require('../assets/home-filled.png') : require('../assets/home.png')}
                        style={{ width: 55, height: 55, transform: [{scale: 0.70}] }}
                    />
                </TouchableOpacity>
                <TouchableOpacity onPress={() => changeScreen('calendar')}>
                    <Image
                        className={"w-16 h-16"}
                        source={screen === 'calendar' ? require('../assets/calendar-filled.png') : require('../assets/calendar.png')}
                        style={{ width: 55, height: 55, transform: [{scale: 0.70}] }}
                    />
                </TouchableOpacity>
                <TouchableOpacity onPress={() => changeScreen('analytics')}>
                    <Image
                        className={"w-16 h-16"}
                        source={screen === 'analytics' ? require('../assets/graph-filled.png') : require('../assets/graph.png')}
                        style={{ width: 55, height: 55, transform: [{scale: 0.70}] }}
                    />
                </TouchableOpacity>
                <TouchableOpacity onPress={() => changeScreen('profile')}>
                    <Image
                        className={"w-16 h-16 pt-1"}
                        source={screen === 'profile' ? require('../assets/profile-filled.png') : require('../assets/profile.png')}
                        style={{ width: 55, height: 60, transform: [{scale: 0.75}] }}
                    />
                </TouchableOpacity>
            </View>
        </View>
    );
}
export default Authorized;