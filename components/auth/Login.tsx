import Logo from "../Logo";
import {View, Text, TouchableOpacity, TextInput, Linking} from 'react-native';
import RedButton from "../generic/RedButton";
import {useState} from "react";
import {LoginRequest, LoginResponse} from "../../types/auth";
import {LoginUser} from "../../clients/AuthClient";

function Login({ changeScreen, getMessage, onLogin }: { changeScreen: (screen: string, message?: string) => void, getMessage: () => string | null, onLogin: (loginResponse: LoginResponse) => Promise<void> }) {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState<string | null>(null);
    const [loading, setLoading] = useState(false);

    const handleLogin = async () => {
        const loginRequest: LoginRequest = {
            username: username,
            password: password,
        }

        setError(null); // Clear any previous errors
        setLoading(true);
        try {
            const response = await LoginUser(loginRequest);
            await onLogin(response);
            setLoading(false);
        } catch (e) {
            setLoading(false);
            if (e instanceof Error) {
                setError(e.message);
            } else {
                setError('An unexpected error occurred');
            }
        }
    }

    return (<View className="w-3/4 flex flex-col items-center">
            <Logo />
            <Text className="text-white pt-4 font-jomhuria text-5xl w-full text-center mb-8">
                Login
            </Text>

            <TextInput
                className="w-full background-light-gray h-12 max-h-12 pl-2 pt-3 pb-1 mb-8 rounded font-jomhuria text-white placeholder:text-gray-200 text-3xl"
                placeholder="Username"
                value={username}
                onChangeText={setUsername}
                keyboardType="default"
            />

            <TextInput
                className="w-full background-light-gray h-12 max-h-12 pl-2 pt-3 pb-1 rounded font-jomhuria text-white placeholder:text-gray-200 text-3xl"
                placeholder="Password"
                secureTextEntry={true}
                value={password}
                onChangeText={setPassword}
                keyboardType="default"
            />
            <TouchableOpacity className={"w-full mt-2"} onPress={() => Linking.openURL('https://cherry.joshroundy.dev/forgot-password')}>
                <Text className={"h-6 font-jomhuria text-red text-2xl mb-12 p-0 pl-2 w-full "}>
                    Forgot your password?
                </Text>
            </TouchableOpacity>

            <RedButton onPress={() => handleLogin()} title={"Login"} disabled={loading}/>

            <View className="flex-row items-center pt-10">
                <Text className="text-white text-3xl font-jomhuria">New here? </Text>
                <TouchableOpacity onPress={() => changeScreen('register', undefined)}>
                    <Text className="text-red text-3xl font-jomhuria">Register</Text>
                </TouchableOpacity>
            </View>

            <Text className="text-red text-3xl font-jomhuria mt-4 h-12">
                {error ? error : ''}
                {!error && getMessage() ? getMessage() : ''}
            </Text>

        </View>
    );
}

export default Login;