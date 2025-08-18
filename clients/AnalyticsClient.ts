import {API_URL} from "./TrackingClient";
import {
    GetAverageDataResponse,
    GetGraphDataRequest,
    GetGraphDataResponse,
    GetHeatMapDataResponse
} from "../types/Analytics";

export const GetGraphData = async (request: GetGraphDataRequest, jwt: string): Promise<GetGraphDataResponse[]> => {
    console.log('Getting graph data for user ID:', request.UserID);
    const response = await fetch(`${API_URL}/graphs/data?daysback=${request.DaysBack}`, {
        method: 'GET',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': 'Bearer ' + jwt,
            'User-ID': request.UserID,
        },
        body: null,
    });

    if (response.ok) {
        const data = await response.json();
        console.log('Graph data retrieved successfully:', data);
        return data as GetGraphDataResponse[];
    } else if (response.status === 400) {
        throw new Error('Invalid request data');
    } else {
        console.error('Failed to retrieve graph data:', response.status, response.text());
        throw new Error('An unexpected error occurred while retrieving graph data.');
    }
};

export const GetHeatMapData = async (request: GetGraphDataRequest, jwt: string): Promise<GetHeatMapDataResponse> => {
    console.log('Getting heat map data for user ID:', request.UserID);
    const response = await fetch(`${API_URL}/graphs/heatmap?daysback=${request.DaysBack}`, {
        method: 'GET',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': 'Bearer ' + jwt,
            'User-ID': request.UserID,
        },
        body: null,
    });

    if (response.ok) {
        const data = await response.json();
        console.log('Heat map data retrieved successfully:', data);
        return data as GetHeatMapDataResponse;
    } else if (response.status === 400) {
        throw new Error('Invalid request data');
    } else {
        console.error('Failed to retrieve heat map data:', response.status, response.text());
        throw new Error('An unexpected error occurred while retrieving heat map data.');
    }
};

export const GetAverageData = async (userID: string, jwt: string): Promise<GetAverageDataResponse> => {
    console.log('Getting average data for user ID:', userID);
    const response = await fetch(`${API_URL}/graphs/average`, {
        method: 'GET',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': 'Bearer ' + jwt,
            'User-ID': userID,
        },
        body: null,
    });

    if (response.ok) {
        const data = await response.json();
        return data as GetAverageDataResponse;
    } else if (response.status === 400) {
        throw new Error('Invalid request data');
    } else {
        console.error('Failed to retrieve average data:', response.status, response.text());
        throw new Error('An unexpected error occurred while retrieving average data.');
    }
};
