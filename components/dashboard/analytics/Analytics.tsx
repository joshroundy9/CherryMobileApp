import {LoginResponse} from "../../../types/Auth";
import {ScrollView, Text, View} from "react-native";
import {useEffect, useState} from "react";
import {
    GetAverageDataResponse,
    GetGraphDataResponse,
    GetHeatMapDataResponse,
    GetHeatMapDataResponseItem
} from "../../../types/Analytics";
import {GetAverageData, GetGraphData, GetHeatMapData} from "../../../clients/AnalyticsClient";
import AnalyticsWidget from "../../generic/AnalyticsWidget";
import Loading from "../../generic/Loading";
import HeatMap from "./HeatMap";
import Graph from "./Graph";

function Analytics({loginResponse}: {loginResponse: () => LoginResponse | null}) {
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [graphData, setGraphData] = useState<GetGraphDataResponse[]>([]);
    const [heatMapData, setHeatMapData] = useState<GetHeatMapDataResponse>({ heatMapData: [] });
    const [averageData, setAverageData] = useState<GetAverageDataResponse>();
    const jwt = loginResponse()?.jwt || '';
    const [monthlyWeightTracking, setMonthlyWeightTracking] = useState<number>(0);
    const [monthlyNutritionTracking, setMonthlyNutritionTracking] = useState<number>(0);
    const [scrollEnabled, setScrollEnabled] = useState(true);
    useEffect(() => {
        const fetchData = async () => {
            setLoading(true);
            try {
                const heatMapDataResponse = await GetHeatMapData({
                    DaysBack: 365,
                    UserID: loginResponse()?.user.userID || ''
                }, jwt);
                setHeatMapData(heatMapDataResponse);

                const graphDataResponse = await GetGraphData({
                    DaysBack: 365,
                    UserID: loginResponse()?.user.userID || ''
                }, jwt);
                setGraphData(graphDataResponse);

                const averageData = await GetAverageData(loginResponse()?.user.userID || '', jwt);

                setAverageData(averageData);

                calculateMonthlyTracking({heatMap: heatMapDataResponse.heatMapData});            } catch (e) {
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
        <View className={"w-full h-full"}>
            <ScrollView className={"flex flex-col w-full h-full px-3"} scrollEnabled={scrollEnabled}>
                <Graph data={graphData} onChartInteraction={setScrollEnabled}/>
                <View className={"w-full flex flex-row mt-4"}>
                    <View className={"w-1/2 h-32 pr-1.5"}>
                        <AnalyticsWidget header={"Average Calorie Intake"} text={`${Math.round(averageData?.averageData.averageCalories || 0)} kcal`}/>
                    </View>
                    <View className={"w-1/2 h-32 pl-1.5"}>
                        <AnalyticsWidget
                            header={"Total Weight Change"}
                            text={`${(Number(loginResponse()?.user.weight) || 0) - (Number(loginResponse()?.user.startingWeight) || 0) > 0 ? '+' : ''}${(Number(loginResponse()?.user.weight) || 0) - (Number(loginResponse()?.user.startingWeight) || 0)} lbs`}
                        />
                    </View>
                </View>
                <View className={"w-full flex flex-row"}>
                    <View className={"w-1/2 h-32 pr-1.5 mt-3"}>
                        <AnalyticsWidget header={"Average Protein Intake"} text={`${Math.round(averageData?.averageData.averageProtein || 0)} grams`}/>
                    </View>
                    <View className={"w-1/2 h-32 pl-1.5 mt-3"}>
                        <AnalyticsWidget header={"Average Daily Weight"} text={`${Math.round(averageData?.averageData.averageWeight || 0)} lbs`}/>
                    </View>
                </View>
                <View className={"w-full flex flex-row"}>
                    <View className={"w-1/2 h-32 pr-1.5 mt-3"}>
                        <AnalyticsWidget header={"Monthly Weight Tracking"} text={`${monthlyWeightTracking} / 30 days`}/>
                    </View>
                    <View className={"w-1/2 h-32 pl-1.5 mt-3"}>
                        <AnalyticsWidget header={"Monthly Nutrition Tracking"} text={`${monthlyNutritionTracking} / 30 days`}/>
                    </View>
                </View>
                <Text className={"w-full text-start font-jomhuria text-white text-4xl mt-6"}>
                    Tracking History
                </Text>
                <HeatMap heatMapData={heatMapData.heatMapData}/>
            </ScrollView>
            {error && (
                <View className={"w-full"}>
                    <Text className={"text-red text-2xl font-jomhuria text-center"}>)
                        {error}
                    </Text>
                </View>
            )}
        </View>
    );
}
export default Analytics;