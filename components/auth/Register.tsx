import LargeLogo from "../generic/Logo";
import {View, Text, TouchableOpacity, TextInput} from 'react-native';
import RedButton from "../generic/Buttons";
import {useState} from "react";
import {RegisterRequest} from "../../types/Auth";
import {RegisterUser} from "../../clients/AuthClient";

function Register({ changeScreen }: { changeScreen: (screen: string, message?: string) => void }) {
    const [username, setUsername] = useState('');
    const [email, setEmail] = useState('');
    const [confirmEmail, setConfirmEmail] = useState('');
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [bodyWeight, setBodyWeight] = useState('');
    const [error, setError] = useState<string | null>(null);
    const [loading, setLoading] = useState(false);

    const handleRegister = async () => {
        const registerRequest: RegisterRequest = {
            username: username,
            email: email,
            password: password,
            weight: bodyWeight,
        }
        if (email !== confirmEmail) {
            setError("Emails do not match");
            return;
        }
        if (password !== confirmPassword) {
            setError("Passwords do not match");
            return;
        }
        if (!username || !email || !password || !bodyWeight) {
            setError("All fields are required");
            return;
        }
        setError(null); // Clear any previous errors
        setLoading(true);
        try {
            const response = await RegisterUser(registerRequest);
            changeScreen('login', 'Registration successful! Please verify your email.');
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
            <LargeLogo />
            <Text className="text-white pt-4 font-jomhuria text-5xl w-full text-center mb-4">
                Register
            </Text>
            <TextInput
                className="w-full background-light-gray h-12 max-h-12 pl-2 pt-3 pb-1 rounded font-jomhuria text-white placeholder:text-gray-200 text-3xl"
                placeholder="Username"
                value={username}
                onChangeText={setUsername}
            />
            <Text
                className={"h-6 font-jomhuria text-red text-2xl mb-2 p-0 pl-2 w-full"}
            >
                {username.length > 18 ? "Username must be less than 18 characters" : ""}
            </Text>

            <TextInput
                className="w-full background-light-gray h-12 max-h-12 pl-2 pt-3 pb-1 mb-8 rounded font-jomhuria text-white placeholder:text-gray-200 text-3xl"
                placeholder="Email"
                value={email}
                onChangeText={setEmail}
                keyboardType="email-address"
            />

            <TextInput
                className="w-full background-light-gray h-12 max-h-12 pl-2 pt-3 pb-1 rounded font-jomhuria text-white placeholder:text-gray-200 text-3xl"
                placeholder="Confirm Email"
                value={confirmEmail}
                onChangeText={setConfirmEmail}
                keyboardType="email-address"
            />
            <Text
                className={"h-6 font-jomhuria text-red text-2xl mb-2 p-0 pl-2 w-full"}
            >
                {email !== confirmEmail ? "Emails do not match" : ""}
            </Text>

            <TextInput
                className="w-full background-light-gray h-12 max-h-12 pl-2 pt-3 pb-1 rounded font-jomhuria text-white placeholder:text-gray-200 text-3xl"
                placeholder="Password"
                value={password}
                onChangeText={setPassword}
                secureTextEntry
            />
            <Text
                className={"h-6 font-jomhuria text-red text-2xl mb-2 p-0 pl-2 w-full"}
            >
                {!password.match('^(?=.*[a-z])(?=.*[A-Z])(?=.*\\d).{8,}$') && password ? "Passwords must have a num, capital, and special char" : ""}
            </Text>

            <TextInput
                className="w-full background-light-gray h-12 max-h-12 pl-2 pt-3 pb-1 rounded font-jomhuria text-white placeholder:text-gray-200 text-3xl"
                placeholder="Confirm Password"
                value={confirmPassword}
                onChangeText={setConfirmPassword}
                secureTextEntry
            />
            <Text
                className={"h-6 font-jomhuria text-red text-2xl mb-2 p-0 pl-2 w-full"}
                >
                {password !== confirmPassword ? "Passwords do not match" : ""}
            </Text>

            <TextInput
                className="w-full background-light-gray h-12 max-h-12 pl-2 pt-3 pb-1 mb-8 rounded font-jomhuria text-white placeholder:text-gray-200 text-3xl"
                placeholder="Body Weight (LBS)"
                value={bodyWeight}
                onChangeText={setBodyWeight}
                keyboardType="numeric"
            />
            <RedButton onPress={() => handleRegister()} title={"Register"} disabled={loading}/>

            <View className="flex-row items-center pt-10">
                <Text className="text-white text-3xl font-jomhuria">Already have an account? </Text>
                <TouchableOpacity onPress={() => changeScreen('login', undefined)}>
                    <Text className="text-red text-3xl font-jomhuria">Login</Text>
                </TouchableOpacity>
            </View>

                <Text className="text-red text-3xl w-full font-jomhuria mt-4 h-24 text-center">
                    {error ? error : ''}
                </Text>

        </View>
    );
}

export default Register;