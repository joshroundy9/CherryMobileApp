import Logo from "../Logo";
import { View, Text, Button, TouchableOpacity } from 'react-native';

function Login({setCurrentScreen, getMessage } : { setCurrentScreen: (register: string) => void, getMessage: () => string | null }) {
    return (<View className="w-3/4 flex flex-col items-center">
        <Logo />
        <Text className="text-white font-jomhuria text-3xl w-full text-center mb-4">
            Login
        </Text>
        <Button title="Log In" />
        <TouchableOpacity
            onPress={() => setCurrentScreen('register')}
            className="mt-4"
        >
            <Text className="text-white underline">
                Don't have an account? Register here
            </Text>
        </TouchableOpacity>
        {getMessage() && (
            <Text className="text-red mt-4">
                {getMessage()}
            </Text>
        )}
    </View>
    );
}

export default Login;