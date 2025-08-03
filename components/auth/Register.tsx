import Logo from "../Logo";
import { View, Text, Button, TouchableOpacity } from 'react-native';
import RedButton from "../generic/RedButton";

function Register({setCurrentScreen} : { setCurrentScreen: (register: string) => void}) {
    return (<View className="w-3/4 flex flex-col items-center">
            <Logo />
            <Text className="text-white font-jomhuria text-4xl w-full text-center mb-4">
                Register
            </Text>
            <RedButton onPress={() => setCurrentScreen('login')} title={"Register"}/>

            <View className="flex-row items-center">
                <Text className="text-white text-2xl font-jomhuria">Already have an account? </Text>
                <TouchableOpacity onPress={() => setCurrentScreen('login')}>
                    <Text className="text-red text-2xl font-jomhuria">Login</Text>
                </TouchableOpacity>
            </View>
        </View>
    );
}

export default Register;