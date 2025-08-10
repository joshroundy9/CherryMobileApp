import React, {useState, useEffect} from "react";
import {Image, Text, TextInput, TouchableOpacity, View} from "react-native";
import RedButton, {GoBackButton} from "../../generic/Buttons";
import {MealItemDTO} from "../../../types/Tracking";
import {GetMealItemRecents} from "../../../clients/TrackingClient";
import Loading from "../../generic/Loading";

interface ManualMealEntryProps {
    onSubmit: (name: string, calories: string, protein: string, aiGenerated: boolean) => void
    onCancel: () => void;
    userID: string,
    jwt: string
}
function RecentsMealEntry({ properties }: {properties: ManualMealEntryProps}) {
    const [loading, setLoading] = useState(false);
    const [mealItemRecents, setMealItemRecents] = useState<MealItemDTO[]>([]);
    const [error, setError] = useState<string | null>(null);

    const handleSubmit = (text, calories, protein) => {
        if(loading) return;
        setLoading(true);
        properties.onSubmit(text, calories, protein, true);
        setLoading(false);
    };
    useEffect(() => {
        const fetchMealItemRecents = async () => {
            try {
                const response = await GetMealItemRecents(properties.userID, properties.jwt);
                setMealItemRecents(response);
            } catch (error) {
                console.error('Error fetching recent meal items:', error);
                setError()
            } finally {
                setLoading(false);
            }
        }
        setLoading(true);
        fetchMealItemRecents();
    }, [properties]);

    if (loading) {
        return (<Loading/>);
    }

    return (
        <View className="rounded-lg p-4 w-full">
            <Text className={"font-jomhuria text-5xl text-white text-center"}>
                Recents Entry Mode
            </Text>
            <View className={"px-3 w-full flex flex-row justify-between items-center"}>
                <Text className={"text-white font-jomhuria text-4xl ml-11"}>Description</Text>
                <View className={"flex flex-row"}>
                    <Text className={"text-white font-jomhuria text-4xl mr-6"}>CALS</Text>
                    <Text className={"text-white font-jomhuria text-4xl"}>PROTEIN</Text>
                </View>
            </View>
            <View className={"w-full flex-col flex gap-1"}>
                {mealItemRecents.map((item, index) => (
                    <TouchableOpacity key={index} className={"flex flex-row justify-between items-center px-2 py-4 rounded background-light-gray w-full"} onPress={() => handleSubmit(item.itemName, item.itemCalories, item.itemProtein)}>
                        <View className={"flex flex-row gap-2.5"}>
                            <Image
                                source={require('../../../assets/plus.png')}
                                style={{ width: 32, height: 32 }}
                            />
                            <Text className={"text-red font-jomhuria text-4xl w-52"}
                            numberOfLines={1}
                            ellipsizeMode={"tail"}>
                                {item.itemName}
                            </Text>
                        </View>
                        <View className={"flex flex-row"}>
                            <Text className={"text-white font-jomhuria text-4xl mr-4"}>{item.itemCalories} </Text>
                            <Text className={"text-white font-jomhuria text-4xl w-20 text-right"}>{item.itemProtein}g </Text>
                        </View>
                    </TouchableOpacity>
                ))}
            </View>
            <View className={"flex flex-row justify-end mt-2"}>
                <View className={"flex flex-row"}>
                    <GoBackButton title={" Go Back "} onPress={properties.onCancel} />
                </View>
            </View>
            {error && <Text className="text-red font-jomhuria text-2xl mt-2 text-center">{error}</Text>}
        </View>
    );
}

export default RecentsMealEntry;
