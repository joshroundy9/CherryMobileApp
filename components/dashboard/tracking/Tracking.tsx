import {useRef, useState} from "react";
import {View, Text, Animated} from "react-native";
import Calendar from "./Calendar";
import AccountInformation from "../AccountInformation";
import {LoginResponse} from "../../../types/Auth";
import MealTracking from "./MealTracking";

function Tracking({loginResponse, setLoginResponse, initialScreen, initialDate}: {loginResponse: () => LoginResponse | null, setLoginResponse: (loginResponse: LoginResponse | null) => void, initialScreen: string, initialDate?: string}) {
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');

    const [screen, setScreen] = useState(initialScreen);
    const [date, setDate] = useState(initialDate);

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

    const changeScreenUpdateDate = ({newScreen, newDate, mealID}: {newScreen: string, newDate?: string, mealID?: string}) => {
        if (newScreen === screen && newDate === date) return;
        if (newDate) {
            setDate(newDate);
        }
        changeScreen(newScreen);
    };

    const renderContent = () => {
        switch(screen) {
            case 'calendar':
                return (
                    <Calendar loginResponse={loginResponse} setScreen={changeScreenUpdateDate}/>
                );
            case 'meal':
                return (
                    <MealTracking date={date || ''} loginResponse={loginResponse} setLoginResponse={setLoginResponse} setScreen={changeScreenUpdateDate}/>
                );
            case 'mealitem':
                return (
                    <Text className={"text-white"}>meal item panel</Text>
                );
            default:
                return null;
        }
    };

    return (
        <Animated.View style={{ flex: 1, opacity: fadeAnim }}>
            {renderContent()}
        </Animated.View>
    );
}

export default Tracking;