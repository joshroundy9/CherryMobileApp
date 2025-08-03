import {Button, Text, View} from "react-native";
import Logo from "./Logo";
import {useState} from "react";
import Register from "./auth/Register";
import Login from "./auth/Login";

function Unauthorized({ children, onLogin }: { children: React.ReactNode, onLogin: () => void }) {
    const [currentScreen, setCurrentScreen] = useState<string>('login');

    return currentScreen === 'login' ? <Login setCurrentScreen={setCurrentScreen} /> : <Register setCurrentScreen={setCurrentScreen}/>;
}

export default Unauthorized;