import {View, Text, Linking, TouchableOpacity, Image} from "react-native";
import {LoginResponse} from "../../types/Auth";
import RedButton from "../generic/Buttons";

function AccountInformation({ loginResponse, onLogout } : {loginResponse: () => LoginResponse | null, onLogout: () => void}) {
    // @ts-ignore
    return (
        <View className={"w-full h-full flex flex-col items-center justify-start text-white pl-4 pr-4"}>
            <Text className={"text-white font-jomhuria text-5xl"}>Account Information</Text>
            <View className={"h-full w-full flex flex-col items-start justify-start mt-2"}>
                <Text className={"text-white font-jomhuria text-3xl pl-1"}>Username</Text>
                <View className={"background-light-gray w-full pl-1 pt-1 rounded"}>
                    <Text className={"text-white font-jomhuria text-3xl"}>{loginResponse()?.user.username}</Text>
                </View>
                <Text className={"text-white font-jomhuria text-3xl pl-1 mt-2"}>Email</Text>
                <View className={"background-light-gray w-full pl-1 pt-1 rounded"}>
                    <Text className={"text-white font-jomhuria text-3xl"}>{loginResponse()?.user.email}</Text>
                </View>
                <Text className={"text-white font-jomhuria text-3xl pl-1 mt-2"}>Starting Weight</Text>
                <View className={"background-light-gray w-full pl-1 pt-1 rounded"}>
                    <Text className={"text-white font-jomhuria text-3xl"}>{loginResponse()?.user.startingWeight}</Text>
                </View>
                <Text className={"text-white font-jomhuria text-3xl pl-1 mt-2"}>Email Verified</Text>
                <View className={"background-light-gray w-full pl-1 pt-1 rounded"}>
                    <Text className={"text-white font-jomhuria text-3xl"}>{loginResponse()?.user.isEmailVerified ? 'Yes' : 'No'}</Text>
                </View>
                <Text className={"text-white font-jomhuria text-3xl pl-1 mt-2"}>Account Created On</Text>
                <View className={"background-light-gray w-full pl-1 pt-1 rounded"}>
                    <Text className={"text-white font-jomhuria text-3xl"}>
                        {loginResponse()?.user.createdTS ?
                            new Date(loginResponse().user.createdTS.split('T')[0]).toLocaleDateString('en-US', {
                                year: 'numeric',
                                month: 'long',
                                day: 'numeric'
                            }).replace(/(\d+),/, '$1th,').replace(/1th/, '1st').replace(/2th/, '2nd').replace(/3th/, '3rd').replace(/21th/, '21st').replace(/22th/, '22nd').replace(/23th/, '23rd').replace(/31th/, '31st')
                            : ''
                        }
                    </Text>
                </View>
                <View className={"mt-4"}>
                    <RedButton title={"Sign Out"} onPress={onLogout}/>
                </View>
                <View className={"w-full mt-auto mb-20 flex flex-col items-center justify-center"}>
                    <Text className={"text-white font-jomhuria text-4xl text-center"}>Developed by <Text className={"text-red"}>Josh Roundy</Text> in Summer 2025</Text>
                    <View className={"pl-4 pr-4 w-80 flex flex-row justify-between items-center"}>
                        <TouchableOpacity className={"mt-2"} onPress={() => Linking.openURL('https://www.linkedin.com/in/joshroundy/')}>
                            <Image
                                source={require('../../assets/linkedin.png')}
                                style={{ width: 45, height: 45 }}
                            />
                        </TouchableOpacity>
                        <TouchableOpacity className={"mt-2"} onPress={() => Linking.openURL('https://github.com/joshroundy9')}>
                            <Image
                                source={require('../../assets/github.png')}
                                style={{ width: 45, height: 45 }}
                            />
                        </TouchableOpacity>
                        <TouchableOpacity className={"mt-2"} onPress={() => Linking.openURL('https://joshroundy.dev')}>
                            <Image
                                source={require('../../assets/portfolio.png')}
                                style={{ width: 45, height: 45 }}
                            />
                        </TouchableOpacity>
                    </View>
                </View>
            </View>
        </View>
    );
}

export default AccountInformation;