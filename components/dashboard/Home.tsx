import {LoginResponse} from "../../types/Auth";
import {Text, View} from "react-native";
import {useEffect, useState} from "react";
import {GetHeatMapData} from "../../clients/AnalyticsClient";
import {GetHeatMapDataResponse, GetHeatMapDataResponseItem} from "../../types/Analytics";
import Loading from "../generic/Loading";
import HeatMap from "./analytics/HeatMap";
import AnalyticsWidget from "../generic/AnalyticsWidget";
import RedButton from "../generic/Buttons";

function Home({ loginResponse, changeScreen } : {loginResponse: () => LoginResponse | null, changeScreen: (newScreen: string) => void}) {
    const user = loginResponse()?.user;
    const jwt = loginResponse()?.jwt || '';
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [heatMapData, setHeatMapData] = useState<GetHeatMapDataResponse>({ heatMapData: [] });
    const [monthlyWeightTracking, setMonthlyWeightTracking] = useState<number>(0);
    const [monthlyNutritionTracking, setMonthlyNutritionTracking] = useState<number>(0);

    useEffect(() => {
        const fetchData = async () => {
            setLoading(true);
            try {
                const heatMapDataResponse = await GetHeatMapData({
                    DaysBack: 365,
                    UserID: loginResponse()?.user.userID || ''
                }, jwt);
                setHeatMapData(heatMapDataResponse);

                calculateMonthlyTracking({heatMap: heatMapDataResponse.heatMapData});
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
        const calculateMonthlyTracking = ({heatMap}: {heatMap: GetHeatMapDataResponseItem[]}) => {
            const thirtyDaysAgo = new Date();
            thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);

            let weightDays = 0;
            let nutritionDays = 0;

            Object.entries(heatMap).forEach(([dateString, value]) => {
                const date = new Date(dateString);
                if (date <= thirtyDaysAgo) {
                    if (value.value === 'WEIGHT' || value.value === 'BOTH') {
                        weightDays++;
                    }
                    if (value.value === 'NUTRITION' || value.value === 'BOTH') {
                        nutritionDays++;
                    }
                }
            });

            setMonthlyWeightTracking(weightDays);
            setMonthlyNutritionTracking(nutritionDays);
        };

        fetchData();
    }, [loginResponse(), jwt]);

    if (loading) {
        return <Loading/>
    }

    return (
      <View className={"px-4 w-full h-full flex flex-col items-center justify-start"}>
        <View className={"flex flex-col justify-between w-full h-full"}>
            <Text className={"text-white text-5xl font-jomhuria w-full text-start"}>Welcome back <Text className={"text-red"}>{user?.username}</Text></Text>
            { (heatMapData.heatMapData && heatMapData.heatMapData.length > 0 && heatMapData.heatMapData[heatMapData.heatMapData.length-1].value === 'BOTH') ?                (
                    <View className={"w-full"}>
                        <Text className={"text-white text-4xl font-jomhuria"}>
                            You have completed your tracking for today! Great job!
                        </Text>
                    </View>
                ): (
                    <View>
                        <View className={"w-full flex flex-col items-start"}>
                            <Text className={"text-white text-4xl font-jomhuria"}>
                                You have <Text className={"text-red"}>not</Text> completed your tracking for today. </Text>
                            <RedButton title={"Start Tracking"} onPress={() => {changeScreen("tracking")}}/>
                        </View>
                    </View>
                )}
            <View className={"flex flex-col w-full"}>
                <View className={"w-full flex flex-row items-start"}>
                    <View className={"w-1/2 h-32 pr-1.5 mt-3"}>
                        <AnalyticsWidget header={"Monthly Weight Tracking"} text={`${monthlyWeightTracking} / 30 days`}/>
                    </View>
                    <View className={"w-1/2 h-32 pl-1.5 mt-3"}>
                        <AnalyticsWidget header={"Monthly Nutrition Tracking"} text={`${monthlyNutritionTracking} / 30 days`}/>
                    </View>
                </View>
                <View className={"w-60 mt-3.5"}>
                    <RedButton title={"View Full Tracking Analytics"} onPress={() => {changeScreen("analytics")}}/>
                </View>
            </View>
            <View className={"flex flex-col w-full"}>
            {error && (
                <View className={"w-full"}>
                    <Text className={"text-red text-2xl font-jomhuria text-center"}>)
                        {error}
                    </Text>
                </View>
            )}
                <Text className={"w-full text-start font-jomhuria text-white text-4xl mt-6"}>
                    Tracking History
                </Text>
                <HeatMap heatMapData={heatMapData.heatMapData}/>
            </View>
        </View>
      </View>
    );
}
export default Home;