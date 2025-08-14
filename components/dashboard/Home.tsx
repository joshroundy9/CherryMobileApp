import {LoginResponse} from "../../types/Auth";
import {Text, View} from "react-native";

function AccountInformation({ loginResponse } : {loginResponse: () => LoginResponse | null}) {
    const user = loginResponse()?.user;

    return (
      <View className={"p-4 w-full h-full flex flex-col items-center justify-start"}>
        <Text className={"text-white text-5xl font-jomhuria w-full text-start"}>Welcome back <Text className={"text-red"}>{user?.username}</Text>!</Text>
      </View>
    );
}
export default AccountInformation;