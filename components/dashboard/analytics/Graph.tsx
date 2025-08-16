import React, { useState, useEffect } from 'react';
import { View, Text, Dimensions, ScrollView } from 'react-native';
import { LineChart } from 'react-native-chart-kit';
import { DateResponse } from "../../../types/Tracking";
import {GetGraphDataResponse} from "../../../types/Analytics";
import { Circle, useFont } from "@shopify/react-native-skia";
import { SharedValue, runOnJS, useDerivedValue } from "react-native-reanimated";
import {CartesianChart, Line, useChartPressState} from "victory-native";
import jomhuria from "../../../assets/fonts/Jomhuria_400Regular.ttf";
function Graph({ data, timeframe = 365 }: { data: GetGraphDataResponse[]; timeframe?: number }) {
    const font = useFont(jomhuria, 20);
    const [toolTipDate, setToolTipDate] = useState<string | null>(null);
    const [toolTipCalories, setToolTipCalories] = useState<number | null>(null);
    const [toolTipProtein, setToolTipProtein] = useState<number | null>(null);
    const [toolTipWeight, setToolTipWeight] = useState<number | null>(null);


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
        const allDates = Array.from({ length: timeframe }, (_, i) => {
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
            dailyCalories: dataMap.get(date)?.dailyCalories ?? null,
            dailyProtein: dataMap.get(date)?.dailyProtein ?? null,
            dailyWeight: dataMap.get(date)?.dailyWeight ?? null
        }));
    }, [data, timeframe]);

    useDerivedValue(() => {
        if (isActive && state.x.value && state.y) {
            runOnJS(setToolTipDate)(state.x.value.value);
            runOnJS(setToolTipCalories)(state.y.dailyCalories.value.value);
            runOnJS(setToolTipProtein)(state.y.dailyProtein.value.value);
            runOnJS(setToolTipWeight)(state.y.dailyWeight.value.value);
        } else {
            const currentDate = new Date().toLocaleDateString('en-CA'); // YYYY-MM-DD format in local time
            const currentData = DATA.find(item => item.date === currentDate);

            runOnJS(setToolTipDate)(currentDate);
            runOnJS(setToolTipCalories)(currentData?.dailyCalories || 0);
            runOnJS(setToolTipProtein)(currentData?.dailyProtein || 0);
            runOnJS(setToolTipWeight)(currentData?.dailyWeight || 0);
        }
    }, [isActive]);

    return (
        <View className="w-full h-full">
            <View className={"w-full h-80"}>
            <CartesianChart
                data={DATA}
                xKey="date"
                yKeys={["dailyWeight", "dailyCalories", "dailyProtein"]}
                axisOptions={{font,
                    lineColor: {grid: '#ffffff'},
                labelColor: '#ffffff',}}
                chartPressState={state}>
                {/* 👇 render function exposes various data, such as points. */}
                {({ points }) => (
                    // 👇 and we'll use the Line component to render a line path.
                    <>
                        <Line points={points.dailyWeight} color="#69ff87" strokeWidth={1.5} />
                        <Line points={points.dailyCalories} color="#ff0606" strokeWidth={1.5} />
                        <Line points={points.dailyProtein} color="#70aeff" strokeWidth={1.5} />
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
            <View className={"w-full px-4"}>
                <Text className={"font-jomhuria text-white text-3xl"}>
                    {toolTipDate ? `Date: ${toolTipDate}` : "Select a point for details"}
                </Text>
            </View>
        </View>
    );
}
function ToolTip({ x, y }: { x: SharedValue<number>; y: SharedValue<number> }) {
    return <Circle cx={x} cy={y} r={4} color="white" />;
}

export default Graph;