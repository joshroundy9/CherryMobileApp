import React, { useState } from 'react';
import { View, Text, Dimensions, ScrollView } from 'react-native';
import { LineChart } from 'react-native-chart-kit';
import { DateResponse } from "../../../types/Tracking";

const { width: screenWidth } = Dimensions.get('window');

function Graph({ data }: { data: DateResponse[] }) {
    const [selectedData, setSelectedData] = useState<{
        date: string;
        calories: number;
        protein: number;
        weight: number;
    } | null>(null);

    // Transform and filter data - only include entries with positive values
    const transformedData = data
        .map((item) => ({
            date: new Date(item.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric' }),
            calories: Number(item.dailyCalories) || 0,
            protein: Number(item.dailyProtein) || 0,
            weight: Number(item.dailyWeight) || 0,
            originalDate: item.date
        }))
        .filter((item) =>
            item.calories > 0 || item.protein > 0 || item.weight > 0
        )
        .map((item) => ({
            ...item,
            scaledProtein: item.protein * 10, // Scale protein for visibility
            scaledWeight: item.weight * 10,   // Scale weight for visibility
        }));

    // Create 5 evenly spaced labels to avoid overlap
    const createLabels = (data: typeof transformedData) => {
        if (data.length <= 5) return data.map(item => item.date);

        const step = Math.floor(data.length / 4); // 4 intervals = 5 points
        const indices = [0, step, step * 2, step * 3, data.length - 1];
        return indices.map(i => data[i]?.date || '');
    };

    const labels = createLabels(transformedData);

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

    // Create separate datasets for each metric, filtering out zero values
    const caloriesData = transformedData.filter(item => item.calories > 0).map(item => item.calories);
    const proteinData = transformedData.filter(item => item.protein > 0).map(item => item.scaledProtein);
    const weightData = transformedData.filter(item => item.weight > 0).map(item => item.scaledWeight);

    const combinedData = {
        labels,
        datasets: [
            ...(caloriesData.length > 0 ? [{
                data: transformedData.map(item => item.calories > 0 ? item.calories : null).filter(val => val !== null) as number[],
                color: (opacity = 1) => `rgba(255, 107, 107, ${opacity})`,
                strokeWidth: 3
            }] : []),
            ...(proteinData.length > 0 ? [{
                data: transformedData.map(item => item.protein > 0 ? item.scaledProtein : null).filter(val => val !== null) as number[],
                color: (opacity = 1) => `rgba(78, 205, 196, ${opacity})`,
                strokeWidth: 3
            }] : []),
            ...(weightData.length > 0 ? [{
                data: transformedData.map(item => item.weight > 0 ? item.scaledWeight : null).filter(val => val !== null) as number[],
                color: (opacity = 1) => `rgba(69, 183, 209, ${opacity})`,
                strokeWidth: 3
            }] : [])
        ],
        legend: [
            ...(caloriesData.length > 0 ? ["Calories"] : []),
            ...(proteinData.length > 0 ? ["Protein (x10)"] : []),
            ...(weightData.length > 0 ? ["Weight (x10)"] : [])
        ]
    };

    if (transformedData.length === 0) {
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
                            const dataPoint = transformedData[index];
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