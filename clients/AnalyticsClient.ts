import {AIDataResponse} from "../types/AI";
import {API_URL} from "./TrackingClient";

export const GetGraphData = async (foodEntry: string, jwt: string): Promise<AIDataResponse> => {
    console.log('Getting text nutrition data for:', foodEntry);
    const response = await fetch(`${API_URL}/graphs/data`, {
        method: 'GET',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': 'Bearer ' + jwt,
            'User-ID': foodEntry,
        },
        body: null,
    });

    if (response.ok) {
        const data = await response.json();
        return data as AIDataResponse;
    } else if (response.status === 400) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Invalid request data');
    } else {
        console.error('Failed to retrieve text nutrition data:', response.status, response.text());
        throw new Error('An unexpected error occurred while retrieving nutrition data.');
    }
};