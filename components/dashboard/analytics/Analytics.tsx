import {LoginResponse} from "../../../types/Auth";
import {Text, View} from "react-native";

function Analytics({loginResponse}: {loginResponse: () => LoginResponse | null}) {
    return (
        <View className={"flex flex-col items-center justify-start w-full h-full"}>
            <Text className={"text-center font-jomhuria text-5xl text-white w-full"}>Analytics</Text>
        </View>
    );
}
export default Analytics;