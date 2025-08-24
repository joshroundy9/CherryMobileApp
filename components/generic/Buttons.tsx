import {TouchableOpacity, Text, ActivityIndicator, View} from "react-native";

function RedButton({ title, onPress, disabled = false }: { title: string, onPress: () => void, disabled?: boolean }) {
    return (
        <TouchableOpacity
            onPress={onPress}
            disabled={disabled}
            className={`px-4 py-1 rounded-sm text-red background-red text-black background-red`}
        >
            <View className="relative justify-center items-center">
                <Text className={`font-jomhuria text-3xl text-center ${disabled ? 'opacity-0' : ''}`}>{title}</Text>
                {disabled && (
                    <View className="absolute top-0 left-0 right-0 bottom-0 justify-center items-center">
                        <ActivityIndicator size="small" color="#2D2D2D" />
                    </View>
                )}
            </View>
        </TouchableOpacity>
    );
}
export default RedButton;

export function GoBackButton({ title, onPress }: { title: string, onPress: () => void}) {
    return (
        <TouchableOpacity
            onPress={onPress}
            className={`px-4 py-1 rounded-sm background-light-gray`}
        >
            <Text className={"font-jomhuria text-white text-3xl px-4"}> Go Back </Text>
        </TouchableOpacity>
    );
}