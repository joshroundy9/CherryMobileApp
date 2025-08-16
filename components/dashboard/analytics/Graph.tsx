import React, { useState, useEffect } from 'react';
import { View, Text, Dimensions, ScrollView } from 'react-native';
import { LineChart } from 'react-native-chart-kit';
import { DateResponse } from "../../../types/Tracking";
import {GetGraphDataResponse} from "../../../types/Analytics";
import { Circle, useFont } from "@shopify/react-native-skia";
import { SharedValue, runOnJS, useDerivedValue } from "react-native-reanimated";
import {CartesianChart, Line, useChartPressState} from "victory-native";
import { formatDateToShort, getTimeframeName, formatDateToShortWithYear } from "../../../utils/AnalyticsUtil";
import {GoBackButton} from "../../generic/Buttons";

function Graph({ data, timeframe = 365, handleGoBack }: { data: GetGraphDataResponse[], timeframe?: number, handleGoBack: () => void }) {
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
        return allDates.map(date => ({
            date,
            dailyCalories: (dataMap.get(date)?.dailyCalories || dataMap.get(date)?.dailyCalories === 0) ?? null,
            dailyProtein: (dataMap.get(date)?.dailyProtein || dataMap.get(date)?.dailyProtein === 0) ?? null,
            dailyWeight: (dataMap.get(date)?.dailyWeight || dataMap.get(date)?.dailyWeight === 0) ?? null
        }));
    }, [data, graphTimeframe]);

    useDerivedValue(() => {
        if (isActive && state.x.value && state.y) {
            runOnJS(setToolTipDate)(formatDateToShortWithYear(state.x.value.value));
            runOnJS(setToolTipCalories)(state.y.dailyCalories.value.value);
            runOnJS(setToolTipProtein)(state.y.dailyProtein.value.value);
            runOnJS(setToolTipWeight)(state.y.dailyWeight.value.value);
        } else {
            const currentDate = new Date().toLocaleDateString('en-CA'); // Get today's date in YYYY-MM-DD format
            const currentData = DATA.find(item => item.date === currentDate);

            runOnJS(setToolTipDate)(formatDateToShortWithYear(currentDate));
            runOnJS(setToolTipCalories)(currentData?.dailyCalories || 0);
            runOnJS(setToolTipProtein)(currentData?.dailyProtein || 0);
            runOnJS(setToolTipWeight)(currentData?.dailyWeight || 0);
        }
    }, [isActive]);

    return (
        <View className="w-full h-full flex flex-col justify-between">
            <View>
                <Text className={"font-jomhuria text-4xl text-white w-full text-center"}>
                    {getTimeframeName(graphTimeframe)} Weight and Nutrition Graph
                </Text>
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
                                <Line points={points.dailyWeight} color="#70aeff" strokeWidth={1.5} connectMissingData={true}/>
                                <Line points={points.dailyCalories} color="#ff0606" strokeWidth={1.5} connectMissingData={true}/>
                                <Line points={points.dailyProtein} color="#69ff87" strokeWidth={1.5} connectMissingData={true}/>
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
                <View className={"w-full px-4 mt-4"}>
                    <Text className={"font-jomhuria text-white text-2xl w-full text-center"}>
                        Tap and hold on the graph to see details for a specific date.
                    </Text>
                    <Text className={"font-jomhuria text-white text-2xl w-full text-center"}>
                        * TIP: Consistent tracking greatly improved these graphs!
                    </Text>
                </View>
            </View>
            <View className={"flex flex-row justify-end items-center w-full px-4 align-bottom mb-4"}>
                <GoBackButton title={"Go Back"} onPress={handleGoBack} />
            </View>
        </View>
    );
}

function ToolTip({ x, y }: { x: SharedValue<number>; y: SharedValue<number> }) {
    return <Circle cx={x} cy={y} r={3} color="white" />;
}

export default Graph;