import {LoginResponse} from "../../../types/Auth";
import {ScrollView, Text, TouchableOpacity, View} from "react-native";
import {useEffect, useState} from "react";
import {DateResponse} from "../../../types/Tracking";
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
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [graphData, setGraphData] = useState<GetGraphDataResponse[]>([]);
    const [heatMapData, setHeatMapData] = useState<GetHeatMapDataResponse>({ heatMapData: [] });
    const [averageData, setAverageData] = useState<GetAverageDataResponse>();
    const jwt = loginResponse()?.jwt || '';
    const [monthlyWeightTracking, setMonthlyWeightTracking] = useState<number>(0);
    const [monthlyNutritionTracking, setMonthlyNutritionTracking] = useState<number>(0);
    const [viewingGraph, setViewingGraph] = useState(false);
    const [graphLength, setGraphLength] = useState(7);

    useEffect(() => {
        const fetchData = async () => {
            setLoading(true);
            try {
                const heatMapDataResponse = await GetHeatMapData({
                    DaysBack: 252,
                    UserID: loginResponse()?.user.userID || ''
                }, jwt);

                setHeatMapData(heatMapDataResponse);

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
    const retrieveGraphData = async ({daysBack}: {daysBack: number}) => {
        try {
            return await GetGraphData({
                DaysBack: daysBack,
                UserID: loginResponse()?.user.userID || ''
            }, jwt);
        } catch (e) {
            if (e instanceof Error) {
                setError(e.message);
            } else {
                setError('An unexpected error occurred while retrieving graph data.');
            }
            setViewingGraph(false);
        }
    }
    const handleGraphButtonClick = (daysBack: number) => {
        setLoading(true);
        setGraphLength(daysBack);
        retrieveGraphData({daysBack})
            .then((returnedData) => {
                setLoading(false);
                setGraphData(returnedData || []);
                if (returnedData != undefined && returnedData.length > 0) {
                    setViewingGraph(true);
                }
            });
    }

    if (loading) {
        return <Loading/>
    }

    if (viewingGraph) {
        return (
            <Graph data={graphData} timeframe={graphLength} handleGoBack={() => {
                setViewingGraph(false);
                setGraphData([]);
            }}/>
        );
    }

    return (
        <View className={"w-full h-full"}>
            <ScrollView className={"flex flex-col w-full h-full px-3"}>
                <Text className={"text-center font-jomhuria text-5xl text-white w-full"}>Analytics</Text>
                <Text className={"w-full text-start font-jomhuria text-white text-4xl mt-4"}>
                    Nutrition and Weight Graphs
                </Text>
                <View className={"w-full flex flex-row justify-between mb-1.5"}>
                    <View className={"w-1/2 pr-1.5"}>
                        <TouchableOpacity className={"w-full background-light-gray rounded-xl pt-1"}
                                          onPress={() => handleGraphButtonClick(7)}>
                            <Text className={"text-white text-3xl font-jomhuria text-center"}>
                                Previous Week
                            </Text>
                        </TouchableOpacity>
                    </View>
                    <View className={"w-1/2 pl-1.5"}>
                        <TouchableOpacity className={"w-full background-light-gray rounded-xl pt-1"}
                                          onPress={() => handleGraphButtonClick(30)}>
                            <Text className={"text-white text-3xl font-jomhuria text-center"}>
                                Previous Month
                            </Text>
                        </TouchableOpacity>
                    </View>
                </View>
                <View className={"w-full flex flex-row justify-between mb-6"}>
                    <View className={"w-1/2 pr-1.5"}>
                        <TouchableOpacity className={"w-full background-light-gray rounded-xl pt-1"}
                                          onPress={() => handleGraphButtonClick(90)}>
                            <Text className={"text-white text-3xl font-jomhuria text-center"}>
                                Previous 90 Days
                            </Text>
                        </TouchableOpacity>
                    </View>
                    <View className={"w-1/2 pl-1.5"}>
                        <TouchableOpacity className={"w-full background-light-gray rounded-xl pt-1"}
                                          onPress={() => handleGraphButtonClick(365)}>
                            <Text className={"text-white text-3xl font-jomhuria text-center"}>
                                Previous Year
                            </Text>
                        </TouchableOpacity>
                    </View>
                </View>
                <View className={"w-full flex flex-row"}>
                    <View className={"w-1/2 h-32 pr-1.5"}>
                        <AnalyticsWidget header={"Average Calorie Intake"} text={`${Math.round(averageData?.averageData.averageCalories || 0)} kcal`}/>
                    </View>
                    <View className={"w-1/2 h-32 pl-1.5"}>
                        <AnalyticsWidget header={"Total Weight Change"} text={`${(Number(loginResponse()?.user.weight) || 0) - (Number(loginResponse()?.user.startingWeight) || 0)} lbs`}/>
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