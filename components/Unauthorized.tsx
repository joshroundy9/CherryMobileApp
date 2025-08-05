import {Button, Text, View} from "react-native";
import Logo from "./Logo";
import {useState} from "react";
import Register from "./auth/Register";
import Login from "./auth/Login";

function Unauthorized({ children, onLogin }: { children: React.ReactNode, onLogin: () => void }) {
    const [currentScreen, setCurrentScreen] = useState<string>('login');
    const [message, setMessage] = useState<string | null>(null);
    const changeScreen = ({ screen, message }: { screen: string, message?: string }) => {
        setCurrentScreen(screen);
        if (message) {
            setMessage(message);
        }
    }
    const getMessage = () : string | null => {
        return message;
    }

    return currentScreen === 'login' ? <Login setCurrentScreen={setCurrentScreen} getMessage={getMessage} /> : <Register setCurrentScreen={setCurrentScreen} setMessage={setMessage}/>;
}

export default Unauthorized;