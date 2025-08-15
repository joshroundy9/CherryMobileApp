import React, { useEffect, useRef } from 'react';import {ScrollView, Text, View} from 'react-native';
import { GetHeatMapDataResponseItem } from '../../../types/Analytics';

interface HeatMapProps {
    heatMapData: GetHeatMapDataResponseItem[];
}

function HeatMap({ heatMapData }: HeatMapProps) {

    const scrollViewRef = useRef<ScrollView>(null);

    useEffect(() => {
        const timer = setTimeout(() => {
            if (scrollViewRef.current) {

                // Then create a gradual scroll with longer duration
                const gradualTimer = setTimeout(() => {
                    scrollViewRef.current?.scrollToEnd({ animated: true });
                }, 0);

                return () => clearTimeout(gradualTimer);
            }
        }, 0);

        return () => clearTimeout(timer);
    }, [heatMapData]);

    const getColorClass = (value: string) => {
        switch (value) {
            case 'WEIGHT':
                return 'heat-map-weight';
            case 'NUTRITION':
                return 'heat-map-nutrition';
            case 'BOTH':
                return 'background-red';
            default:
                return 'background-light-gray';
        }
    };

    const generateGrid = () => {
        const grid = [];
        const today = new Date();
        const startDate = new Date(today);
        startDate.setDate(today.getDate() - 209); // 30 weeks * 7 days = 210 days

        // Create a map for quick lookup
        const dataMap = new Map();
        heatMapData.forEach(item => {
            dataMap.set(item.date, item.value);
        });

        // Generate 30 columns (weeks) and 7 rows (days)
        for (let week = 0; week < 30; week++) {
            const weekColumn = [];
            for (let day = 0; day < 7; day++) {
                const currentDate = new Date(startDate);
                currentDate.setDate(startDate.getDate() + (week * 7) + day);
                const dateString = currentDate.toISOString().split('T')[0];
                const value = dataMap.get(dateString) || 'NONE';

                weekColumn.push(
                    <View
                        key={`${week}-${day}`}
                        className={`w-3 h-3 m-0.5 rounded-sm ${getColorClass(value)}`}
                    />
                );
            }
            grid.push(
                <View key={week} className="flex flex-col">
                    {weekColumn}
                </View>
            );
        }
        return grid;
    };

    return (
        <View className={"w-full flex flex-col"}>
            <ScrollView
                ref={scrollViewRef}
                className="w-full"
                horizontal>
                <View className="flex flex-row justify-center">
                    {generateGrid()}
                </View>
            </ScrollView>
            <View className={"flex flex-row w-full"}>
                <Text className={"text-2xl font-jomhuria text-white mr-2"}>
                    Key:
                </Text>
                <View
                    className={`w-3 h-3 mt-2 mx-1 rounded-sm ${getColorClass('NONE')}`}
                />
                <Text className={"text-2xl font-jomhuria text-white mr-3"}>
                    None
                </Text>
                <View
                    className={`w-3 h-3 mt-2 mx-1 rounded-sm ${getColorClass('WEIGHT')}`}
                />
                <Text className={"text-2xl font-jomhuria text-white mr-3"}>
                    Weight
                </Text>
                <View
                    className={`w-3 h-3 mt-2 mx-1 rounded-sm ${getColorClass('NUTRITION')}`}
                />
                <Text className={"text-2xl font-jomhuria text-white mr-3"}>
                    Nutrition
                </Text>
                <View
                    className={`w-3 h-3 mt-2 mx-1 rounded-sm ${getColorClass('BOTH')}`}
                />
                <Text className={"text-2xl font-jomhuria text-white mr-3"}>
                    Both
                </Text>
            </View>
        </View>
    );
}

export default HeatMap;