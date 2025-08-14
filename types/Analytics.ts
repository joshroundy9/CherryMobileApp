export interface GetGraphDataRequest {
    UserID: string;
    DaysBack: number;
}

export interface GetHeatMapDataResponse {
    heatMapData: GetHeatMapDataResponseItem[];
}

export interface GetHeatMapDataResponseItem {
    date: string;
    value: string;
}

export interface GetAverageDataResponse {
    averageData: {
        averageCalories: number;
        averageProtein: number;
        averageWeight: number;
    };
}