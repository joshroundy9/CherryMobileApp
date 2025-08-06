import {Image, View} from "react-native";

function Logo() {
    return (
        <View>
            <Image source={require('../assets/logo.png')} style={{ width: 250, height: 100, transform: [{scale: 0.6}] }} />
        </View>
    );
}
export default Logo;