import {LoginResponse} from "../../../types/Auth";
import {Text, View} from "react-native";
import {useEffect, useState} from "react";
import {DateResponse} from "../../../types/Tracking";
import {GetAverageDataResponse, GetHeatMapDataResponse} from "../../../types/Analytics";
import {GetAverageData, GetGraphData, GetHeatMapData} from "../../../clients/AnalyticsClient";
import AnalyticsWidget from "../../generic/AnalyticsWidget";

function Analytics({loginResponse}: {loginResponse: () => LoginResponse | null}) {
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [graphData, setGraphData] = useState<DateResponse[]>([]);
    const [heatMapData, setHeatMapData] = useState<GetHeatMapDataResponse>();
    const [averageData, setAverageData] = useState<GetAverageDataResponse>();
    const jwt = loginResponse()?.jwt || '';

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
    }, [loginResponse(), jwt]);

    return (
        <View className={"flex flex-col items-center justify-start w-full h-full px-3"}>
            <Text className={"text-center font-jomhuria text-5xl text-white w-full"}>Analytics</Text>
            <Text className={"w-full text-start font-jomhuria text-white text-4xl mt-4"}>
                Nutrition and Weight Graphs
            </Text>
            <View className={"w-full flex flex-row"}>
                <View className={"w-1/2 h-32 pr-1.5"}>
                    <AnalyticsWidget header={"Average Daily Calorie Intake"} text={`${Math.round(averageData?.averageData.averageCalories || 0)} kcal`}/>
                </View>
                <View className={"w-1/2 h-32 pl-1.5"}>
                    <AnalyticsWidget header={"Average Daily Protein Intake"} text={`${Math.round(averageData?.averageData.averageProtein || 0)} grams`}/>
                </View>
            </View>
        </View>
    );
}
export default Analytics;