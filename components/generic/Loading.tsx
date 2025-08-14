import { View, ActivityIndicator } from "react-native";

function Loading() {
    return (
        <View className={"w-full h-full background-gray flex-1 justify-center items-center"}>
            <ActivityIndicator size="large" color="#2D2D2D" />
        </View>
    );
}

export default Loading;