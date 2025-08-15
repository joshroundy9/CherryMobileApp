import React, { useState, useEffect } from 'react';
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

    const selectDataPoint = (index: number) => {
        const dataPoint = filledData[index];
        if (dataPoint) {
            setSelectedData({
                date: dataPoint.date,
                calories: dataPoint.calories,
                protein: dataPoint.protein,
                weight: dataPoint.weight
            });
        }
    };

    useEffect(() => {
        if (filledData.length > 0) {
            selectDataPoint(filledData.length - 1);
        }
    }, [data, timeframe]);
    const getHeader = () => {
        switch (timeframe) {
            case 7: return "Weekly"
            case 30: return "Monthly"
            case 90: return "Quarterly"
            case 365: return "Yearly"
            default: return timeframe + " Day"
        }
    }

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
            date: (() => {
                const [year, month, day] = date.split('-').map(Number);
                return new Date(year, month - 1, day).toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
            })(),
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
        backgroundGradientFrom: "#1e1e1e",
        backgroundGradientTo: "#1e1e1e",
        color: (opacity = 1) => `rgba(255, 255, 255, ${opacity})`,
        strokeWidth: 3,
        barPercentage: 0.5,
        useShadowColorFromDataset: false,
        decimalPlaces: 0,
        style: {
            borderRadius: 16
        }
    };

    // Datasets for each metric (do not change input data, just transform for chart)
    const caloriesData = filledData.map(item => item.calories);
    const proteinData = filledData.map(item => item.scaledProtein);
    const weightData = filledData.map(item => item.scaledWeight);

    const combinedData = {
        labels,
        datasets: [
            ...(caloriesData.some(val => val && val > 0) ? [{
                data: caloriesData,
                color: (opacity = 1) => `rgba(255, 6, 6, ${opacity})`,
                strokeWidth: 3
            }] : []),
            ...(proteinData.some(val => val && val > 0) ? [{
                data: proteinData,
                color: (opacity = 1) => `rgba(112, 174, 255, ${opacity})`,
                strokeWidth: 3
            }] : []),
            ...(weightData.some(val => val > 0) ? [{
                data: weightData,
                color: (opacity = 1) => `rgba(105, 255, 135, ${opacity})`,
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
            <Text className="text-center font-jomhuria text-4xl text-white">
                {getHeader()} Nutrition & Weight Trends
            </Text>
            <ScrollView>
                <View className="w-full">
                    <LineChart
                        data={combinedData}
                        width={screenWidth}
                        height={400}
                        chartConfig={chartConfig}
                        bezier
                        style={{
                            marginVertical: 8,
                            borderRadius: 16
                        }}
                        withInnerLines={true}
                        withOuterLines={true}
                        withVerticalLines={false}
                        withHorizontalLines={true}
                        withDots={true}
                        withShadow={false}
                        onDataPointClick={(data) => {
                            selectDataPoint(data.index);}}
                        decorator={() => {
                            return null;
                        }}
                    />
                </View>

                {selectedData && (
                    <View className="mb-6 px-4 bg-light-gray rounded-xl">
                        <Text className="text-white text-2xl font-jomhuria text-center mb-3">
                            Data for {selectedData.date}
                        </Text>
                        <View className="flex flex-row justify-between">
                            <View className="flex-1 items-center">
                                <Text className="text-red text-2xl font-jomhuria">Calories</Text>
                                <Text className="text-white text-3xl font-jomhuria">{selectedData.calories ? selectedData.calories + 'kcal' : ' N/A '}</Text>
                            </View>
                            <View className="flex-1 items-center">
                                <Text className="text-blue text-2xl font-jomhuria">Protein</Text>
                                <Text className="text-white text-3xl font-jomhuria">{selectedData.protein ? selectedData.protein + 'g' : ' N/A '}</Text>
                            </View>
                            <View className="flex-1 items-center">
                                <Text className="text-green text-2xl font-jomhuria">Weight</Text>
                                <Text className="text-white text-3xl font-jomhuria">{selectedData.weight ? selectedData.weight + 'lbs' : ' N/A '}</Text>
                            </View>
                        </View>
                    </View>
                )}

                <View className="mt-4 px-4">
                    <Text className="text-white font-jomhuria text-2xl text-center opacity-70">
                        * Protein and Weight values are scaled by 10 for better visualization
                    </Text>
                </View>
            </ScrollView>
        </View>
    );
}

export default Graph;