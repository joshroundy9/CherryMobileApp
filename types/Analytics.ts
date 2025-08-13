export interface getGraphDataRequest {
    UserID: string;
    DaysBack: number;
}

export interface GetHeatMapDataRequest {
    UserID: string;
    DaysBack: number;
}

export interface GetHeatMapDataResponse {
    heatMapData: {
        [date: string]: string;
    }
}

export interface GetAverageDataResponse {
    averageData: {
        averageCalories: number;
        averageProtein: number;
        averageWeight: number;
    };
}