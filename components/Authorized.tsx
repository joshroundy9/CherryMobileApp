import {Button, Image, Text, TouchableOpacity, View, Animated} from "react-native";
import LargeLogo, { SmallLogo } from "./generic/Logo";
import { useState, useRef, useEffect } from "react";
import {LoginResponse} from "../types/Auth";
import AccountInformation from "./dashboard/AccountInformation";
import Home from "./dashboard/Home";
import Tracking from "./dashboard/tracking/Tracking";
import Analytics from "./dashboard/analytics/Analytics";

function Authorized({ children, onLogout, loginResponse, setLoginResponse }: { children: React.ReactNode, onLogout: () => void, loginResponse: () => LoginResponse | null, setLoginResponse: (loginResponse: LoginResponse | null) => void }) {
    const [screen, setScreen] = useState('home');
    const fadeAnim = useRef(new Animated.Value(1)).current;

    const changeScreen = (newScreen: string) => {
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

        setTimeout(() => {
            if (newScreen === screen && screen !== '' && (screen === 'home' || screen === 'analytics')) {
                // Force re-render by temporarily setting to null then back to current screen
                setScreen('');
                setTimeout(() => setScreen(newScreen), 10);
            } else {
                setScreen(newScreen);
            }
        }, 150);
    };

    const renderContent = () => {
        switch(screen) {
            case 'home':
                return (
                    <Home loginResponse={loginResponse} changeScreen={changeScreen}/>
                );
            case 'tracking':
                return (
                    <Tracking loginResponse={loginResponse} setLoginResponse={setLoginResponse} initialScreen={'calendar'} initialDate={undefined}/>
                );
            case 'profile':
                return (
                    <AccountInformation loginResponse={loginResponse} onLogout={onLogout}/>
                );
                case 'analytics':
                return (
                    <Analytics loginResponse={loginResponse} />
                );
            default:
                return null;
        }
    };

    return (
        <View className={"w-full h-full flex flex-col"}>
            <View className={"w-full flex flex-row justify-between items-center px-4 pt-4"}>
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
                <TouchableOpacity onPress={() => changeScreen('tracking')}>
                    <Image
                        className={"w-16 h-16"}
                        source={screen === 'tracking' ? require('../assets/calendar-filled.png') : require('../assets/calendar.png')}
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