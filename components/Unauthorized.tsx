import {useState} from "react";
import Register from "./auth/Register";
import Login from "./auth/Login";
import {LoginResponse} from "../types/Auth";

function Unauthorized({ children, onLogin }: { children: React.ReactNode, onLogin: (loginResponse : LoginResponse) => Promise<void> }) {
    const [currentScreen, setCurrentScreen] = useState<string>('login');
    const [message, setMessage] = useState<string | null>(null);
    const changeScreen = (screen: string, message?: string) => {
        setCurrentScreen(screen);
        if (message) {
            setMessage(message);
        }
    };
    const getMessage = () : string | null => {
        return message;
    }

    return currentScreen === 'login' ? <Login changeScreen={setCurrentScreen} getMessage={getMessage} onLogin={onLogin} /> : <Register changeScreen={changeScreen}/>;
}

export default Unauthorized;