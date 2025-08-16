import React, { useState } from 'react';
import {View, Text, TouchableOpacity} from 'react-native';
import {GetGraphDataResponse} from "../../../types/Analytics";
import { Circle, useFont } from "@shopify/react-native-skia";
import { SharedValue, runOnJS, useDerivedValue } from "react-native-reanimated";
import {CartesianChart, Line, useChartPressState} from "victory-native";
import { formatDateToShortWithYear } from "../../../utils/AnalyticsUtil";

function Graph({data, timeframe = 365, onChartInteraction}: {
    data: GetGraphDataResponse[],
    timeframe?: number,
    onChartInteraction?: (enabled: boolean) => void
}) {
    const font = useFont(require("../../../assets/fonts/Jomhuria_400Regular.ttf"), 20);
    const [toolTipDate, setToolTipDate] = useState<string | null>(null);
    const [toolTipCalories, setToolTipCalories] = useState<number | null>(null);
    const [toolTipProtein, setToolTipProtein] = useState<number | null>(null);
    const [toolTipWeight, setToolTipWeight] = useState<number | null>(null);
    const [graphTimeframe, setGraphTimeframe] = useState(timeframe);

    const { state, isActive } = useChartPressState({
        x: "08/10/2025",
        y: {
            dailyCalories: 0,
            dailyProtein: 0,
            dailyWeight: 0
        }
    });

    const DATA = React.useMemo(() => {
        // Create array of all dates in timeframe
        const today = new Date();
        const allDates = Array.from({ length: graphTimeframe }, (_, i) => {
            const date = new Date(today);
            date.setDate(today.getDate() - i);
            return date.toLocaleDateString('en-CA'); // Format as YYYY-MM-DD
        }).reverse(); // Reverse to get chronological order

        // Create map of existing data for quick lookup
        const dataMap = new Map(
            data.map(item => [item.date, item])
        );

        // Fill in missing dates with null values
        return allDates.map(date => {
            const originalData = dataMap.get(date);
            return {
                date,
                dailyCalories: (originalData?.dailyCalories || originalData?.dailyCalories === 0) ? originalData.dailyCalories : null,
                dailyProtein: (originalData?.dailyProtein || originalData?.dailyProtein === 0) ? originalData.dailyProtein * 10 : null,
                dailyWeight: (originalData?.dailyWeight || originalData?.dailyWeight === 0) ? originalData.dailyWeight * 10 : null
            };
        });
    }, [data, graphTimeframe]);

    useDerivedValue(() => {
        if (isActive && state.x.value && state.y) {
            runOnJS(onChartInteraction)?.(false);
            runOnJS(setToolTipDate)(formatDateToShortWithYear(state.x.value.value));
            runOnJS(setToolTipCalories)(state.y.dailyCalories.value.value);
            runOnJS(setToolTipProtein)(state.y.dailyProtein.value.value/10);
            runOnJS(setToolTipWeight)(state.y.dailyWeight.value.value/10);
        } else {
            runOnJS(onChartInteraction)?.(true);
            const currentDate = new Date().toLocaleDateString('en-CA');
            const currentData = DATA.find(item => item.date === currentDate);

            runOnJS(setToolTipDate)(formatDateToShortWithYear(currentDate));
            runOnJS(setToolTipCalories)(currentData?.dailyCalories || 0);
            runOnJS(setToolTipProtein)(currentData?.dailyProtein ? currentData.dailyProtein/10 : 0);
            runOnJS(setToolTipWeight)(currentData?.dailyWeight ? currentData.dailyWeight/10 : 0);
        }
    }, [isActive]);

    return (
        <View className="w-full flex flex-col justify-between">
            <View>
                <Text className={"font-jomhuria text-5xl text-white px-4"}>
                    {toolTipDate}
                </Text>
                <View className={"w-full flex flex-row justify-between px-4"}>
                    <Text className={"font-jomhuria text-3xl text-red w-1/3"}>
                        {toolTipCalories} kcal
                    </Text>
                    <Text className={"font-jomhuria text-3xl protein-text w-1/3 text-center"}>
                        {toolTipProtein} g protein
                    </Text>
                    <Text className={"font-jomhuria text-3xl weight-text w-1/3 text-right"}>
                        {toolTipWeight} lbs BW </Text>
                </View>
                <View className={"w-full h-80"}>
                    <CartesianChart
                        data={DATA}
                        xKey="date"
                        yKeys={["dailyWeight", "dailyCalories", "dailyProtein"]}
                        chartPressState={state}>
                        {({ points }) => (
                            <>
                                <Line points={points.dailyWeight} color="#8fbfff" strokeWidth={1.5} connectMissingData={true}/>
                                <Line points={points.dailyCalories} color="#ff0606" strokeWidth={1.5} connectMissingData={true}/>
                                <Line points={points.dailyProtein} color="#8affa1" strokeWidth={1.5} connectMissingData={true}/>
                                {isActive && (
                                    <>
                                        <ToolTip x={state.x.position} y={state.y.dailyCalories.position} />
                                        <ToolTip x={state.x.position} y={state.y.dailyWeight.position} />
                                        <ToolTip x={state.x.position} y={state.y.dailyProtein.position} />
                                    </>
                                )}
                            </>
                        )}
                    </CartesianChart>
                </View>
                <View className={"w-full px-12 flex flex-row justify-between mt-1"}>
                    <TouchableOpacity>
                        <Text className={`font-jomhuria text-2xl px-2 pt-1 rounded ${graphTimeframe === 7 ? 'text-black background-red' : 'text-red'}`}
                              onPress={() => setGraphTimeframe(7)}>
                            7D
                        </Text>
                    </TouchableOpacity>
                    <TouchableOpacity>
                        <Text className={`font-jomhuria text-2xl px-2 pt-1 rounded ${graphTimeframe === 14 ? 'text-black background-red' : 'text-red'}`}
                              onPress={() => setGraphTimeframe(14)}>
                            14D
                        </Text>
                    </TouchableOpacity>
                    <TouchableOpacity>
                        <Text className={`font-jomhuria text-2xl px-2 pt-1 rounded ${graphTimeframe === 30 ? 'text-black background-red' : 'text-red'}`}
                              onPress={() => setGraphTimeframe(30)}>
                            1M
                        </Text>
                    </TouchableOpacity>
                    <TouchableOpacity>
                        <Text className={`font-jomhuria text-2xl px-2 pt-1 rounded ${graphTimeframe === 90 ? 'text-black background-red' : 'text-red'}`}
                              onPress={() => setGraphTimeframe(90)}>
                            3M
                        </Text>
                    </TouchableOpacity>
                    <TouchableOpacity>
                        <Text className={`font-jomhuria text-2xl px-2 pt-1 rounded ${graphTimeframe === 365 ? 'text-black background-red' : 'text-red'}`}
                              onPress={() => setGraphTimeframe(365)}>
                            1Y
                        </Text>
                    </TouchableOpacity>
                </View>
                <View className={"w-full px-4 mt-4"}>
                    <Text className={"font-jomhuria text-white text-2xl w-full text-center"}>
                        * TIP: Consistent tracking greatly improved these graphs!
                    </Text>
                </View>
            </View>
        </View>
    );
}

function ToolTip({ x, y }: { x: SharedValue<number>; y: SharedValue<number> }) {
    return <Circle cx={x} cy={y} r={3} color="white" />;
}

export default Graph;