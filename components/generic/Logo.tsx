import {Image, View} from "react-native";

export function LargeLogo() {
    return (
        <View>
            <Image source={require('../../assets/logo.png')} style={{ width: 250, height: 100, transform: [{scale: 0.6}] }} />
        </View>
    );
}
export default LargeLogo;

export function SmallLogo() {
    return (
        <View>
            <Image source={require('../../assets/logo.png')} style={{ width: 150, height: 60, transform: [{scale: 0.9}] }} />
        </View>
    );
}