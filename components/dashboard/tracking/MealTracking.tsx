import {Text, View} from 'react-native';
import {LoginResponse} from "../../../types/Auth";
import RedButton, {GoBackButton} from "../../generic/Buttons";
import {useState, useEffect} from "react";
import {GetMeals, GetOrCreateDate} from '../../../clients/TrackingClient';
import {DateResponse, MealResponse} from "../../../types/Tracking";

function MealTracking({date, loginResponse, setScreen}: {
    date: string,
    loginResponse: () => LoginResponse | null,
    setScreen: ({newScreen, newDate}: {newScreen: string, newDate?: string}) => void }){

    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const [meals, setMeals] = useState<MealResponse[]>([]);
    const [dateResponse, setDateResponse] = useState<DateResponse | null>(null);

    const jwt = loginResponse()?.jwt || '';

    useEffect(() => {
        const fetchData = async () => {
            setLoading(true);
            try {
                const dateResponse = await GetOrCreateDate({
                    date: date,
                    userID: loginResponse()?.user.userID || ''
                }, jwt);

                setDateResponse(dateResponse);

                const mealsResponse = await GetMeals({
                    dateID: dateResponse.dateID,
                    userID: loginResponse()?.user.userID || ''
                }, jwt);

                setMeals(mealsResponse);
            } catch (e) {
                if (e instanceof Error) {
                    setError(e.message);
                } else {
                    setError('An unexpected error occurred');
                }
            } finally {
                setLoading(false);
            }
        };

        fetchData();
    }, [date, jwt]);

    const handleUpdateWeight = () => {
        console.log("Update weight button pressed");
    };

    const handleGoBack = () => {
        setScreen({newScreen: 'calendar'});
    }

    return (
        <View className={"w-full h-full flex flex-col items-center justify-between"}>
            <View className={"w-full flex flex-row justify-between items-center px-4"}>
                <Text className={"font-jomhuria text-4xl text-white"}>
                    {(() => {
                        const [year, month, day] = date.split('-').map(Number);
                        const dateObj = new Date(year, month - 1, day); // month - 1 because Date months are 0-indexed
                        const dayNum = dateObj.getDate();
                        const monthName = dateObj.toLocaleDateString('en-US', { month: 'long' });
                        const yearNum = dateObj.getFullYear();
                        const suffix = dayNum > 3 && dayNum < 21 ? 'th' : ['th', 'st', 'nd', 'rd'][dayNum % 10] || 'th';
                        return `${monthName} ${dayNum}${suffix}, ${yearNum}`;
                    })()}
                </Text>
                <Text className={"font-jomhuria text-4xl text-white"}>Tap a time to create a meal</Text>
            </View>

            <View className={"flex flex-row justify-between items-center w-full px-4 align-bottom mb-4"}>
                <RedButton title={'Update Weight'} onPress={handleUpdateWeight} />
                <GoBackButton title={"Go Back"} onPress={handleGoBack} />
            </View>
        </View>
    );
}

export default MealTracking;