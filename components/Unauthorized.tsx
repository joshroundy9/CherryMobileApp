import {Button, Text, View} from "react-native";

function Unauthorized({ children, onLogin }: { children: React.ReactNode, onLogin: () => void }) {
    return (
        <View>
            <Text>You are unauthorized to view this area.</Text>
            <Button title="Log In" onPress={onLogin} />
        </View>
    );
}

export default Unauthorized;