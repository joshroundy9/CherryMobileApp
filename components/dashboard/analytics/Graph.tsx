import React, { useState } from 'react';
import { View, Text, Dimensions, ScrollView } from 'react-native';
import { LineChart } from 'react-native-chart-kit';
import { DateResponse } from "../../../types/Tracking";

const { width: screenWidth } = Dimensions.get('window');

function Graph({ data, timeframe = 365 }: { data: DateResponse[]; timeframe?: number }) {
    const [selectedData, setSelectedData] = useState<{
        date: string;
        calories: number;
        protein: number;
        weight: number;
    } | null>(null);

    // Generate array of dates for the timeframe
    const endDate = new Date();
    const startDate = new Date();
    startDate.setDate(endDate.getDate() - timeframe + 1);
    const dateArray: string[] = [];
    for (let d = new Date(startDate); d <= endDate; d.setDate(d.getDate() + 1)) {
        dateArray.push(new Date(d).toISOString().split('T')[0]);
    }

    // Map data to the date array, filling missing dates with zero/empty values
    const dataMap = Object.fromEntries(data.map(item => [item.date, item]));
    const filledData = dateArray.map(date => {
        const item = dataMap[date];
        return {
            date: new Date(date).toLocaleDateString('en-US', { month: 'short', day: 'numeric' }),
            calories: item ? Number(item.dailyCalories) || 0 : 0,
            protein: item ? Number(item.dailyProtein) || 0 : 0,
            weight: item ? Number(item.dailyWeight) || 0 : 0,
            originalDate: date,
            scaledProtein: item ? (Number(item.dailyProtein) || 0) * 10 : 0,
            scaledWeight: item ? (Number(item.dailyWeight) || 0) * 10 : 0
        };
    });

    // Create 5 evenly spaced labels
    const createLabels = (data: typeof filledData) => {
        if (data.length <= 5) return data.map(item => item.date);
        const step = Math.floor((data.length - 1) / 4);
        const indices = [0, step, step * 2, step * 3, data.length - 1];
        return indices.map(i => data[i]?.date || '');
    };
    const labels = createLabels(filledData);

    const chartConfig = {
        backgroundGradientFrom: "#1a1a1a",
        backgroundGradientTo: "#1a1a1a",
        color: (opacity = 1) => `rgba(255, 255, 255, ${opacity})`,
        strokeWidth: 3,
        barPercentage: 0.5,
        useShadowColorFromDataset: false,
        decimalPlaces: 0,
        style: {
            borderRadius: 16
        }
    };

    // Datasets for each metric
    const caloriesData = filledData.map(item => item.calories);
    const proteinData = filledData.map(item => item.scaledProtein);
    const weightData = filledData.map(item => item.scaledWeight);

    const combinedData = {
        labels,
        datasets: [
            ...(caloriesData.some(val => val > 0) ? [{
                data: caloriesData,
                color: (opacity = 1) => `rgba(255, 107, 107, ${opacity})`,
                strokeWidth: 3
            }] : []),
            ...(proteinData.some(val => val > 0) ? [{
                data: proteinData,
                color: (opacity = 1) => `rgba(78, 205, 196, ${opacity})`,
                strokeWidth: 3
            }] : []),
            ...(weightData.some(val => val > 0) ? [{
                data: weightData,
                color: (opacity = 1) => `rgba(69, 183, 209, ${opacity})`,
                strokeWidth: 3
            }] : [])
        ],
        legend: [
            ...(caloriesData.some(val => val > 0) ? ["Calories"] : []),
            ...(proteinData.some(val => val > 0) ? ["Protein (x10)"] : []),
            ...(weightData.some(val => val > 0) ? ["Weight (x10)"] : [])
        ]
    };

    if (filledData.length === 0) {
        return (
            <View className="w-full h-full bg-dark-gray flex justify-center items-center">
                <Text className="text-white text-2xl font-jomhuria text-center">
                    No data available to display
                </Text>
                <Text className="text-white text-lg font-jomhuria text-center opacity-70 mt-2">
                    Track your nutrition and weight to see trends
                </Text>
            </View>
        );
    }

    return (
        <View className="w-full h-full bg-dark-gray">
            <ScrollView contentContainerStyle={{ padding: 16 }}>
                <Text className="text-center font-jomhuria text-4xl text-white mb-6">
                    Nutrition & Weight Trends
                </Text>

                <View className="mb-6">
                    <LineChart
                        data={combinedData}
                        width={screenWidth - 32}
                        height={400}
                        chartConfig={chartConfig}
                        bezier
                        style={{
                            marginVertical: 8,
                            borderRadius: 16
                        }}
                        withInnerLines={true}
                        withOuterLines={true}
                        withVerticalLines={true}
                        withHorizontalLines={true}
                        withDots={true}
                        withShadow={false}
                        onDataPointClick={(data) => {
                            const index = data.index;
                            const dataPoint = filledData[index];
                            if (dataPoint) {
                                setSelectedData({
                                    date: dataPoint.date,
                                    calories: dataPoint.calories,
                                    protein: dataPoint.protein,
                                    weight: dataPoint.weight
                                });
                            }
                        }}
                        decorator={() => {
                            return null;
                        }}
                    />
                </View>

                {selectedData && (
                    <View className="mb-6 p-4 bg-light-gray rounded-xl">
                        <Text className="text-white text-xl font-jomhuria text-center mb-3">
                            Data for {selectedData.date}
                        </Text>
                        <View className="flex flex-row justify-between">
                            {selectedData.calories > 0 && (
                                <View className="flex-1 items-center">
                                    <Text className="text-red-400 text-lg font-jomhuria">Calories</Text>
                                    <Text className="text-white text-2xl font-jomhuria">{selectedData.calories}</Text>
                                </View>
                            )}
                            {selectedData.protein > 0 && (
                                <View className="flex-1 items-center">
                                    <Text className="text-teal-400 text-lg font-jomhuria">Protein</Text>
                                    <Text className="text-white text-2xl font-jomhuria">{selectedData.protein}g</Text>
                                </View>
                            )}
                            {selectedData.weight > 0 && (
                                <View className="flex-1 items-center">
                                    <Text className="text-blue-400 text-lg font-jomhuria">Weight</Text>
                                    <Text className="text-white text-2xl font-jomhuria">{selectedData.weight}lbs</Text>
                                </View>
                            )}
                        </View>
                    </View>
                )}

                <View className="mt-4 px-4">
                    <Text className="text-white font-jomhuria text-2xl text-center opacity-70">
                        * Only showing days with recorded data
                    </Text>
                    <Text className="text-white font-jomhuria text-2xl text-center opacity-70">
                        * Protein and Weight values are scaled by 10 for better visualization
                    </Text>
                    <Text className="text-white font-jomhuria text-xl text-center opacity-50 mt-2">
                        Tap on data points to view exact values
                    </Text>
                </View>
            </ScrollView>
        </View>
    );
}

export default Graph;