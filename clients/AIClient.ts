import {API_URL} from "./TrackingClient";
import {AIDataResponse} from "../types/AI";

export const GetTextNutritionData = async (foodEntry: string, jwt: string): Promise<AIDataResponse> => {
    console.log('Getting text nutrition data for:', foodEntry);
    const response = await fetch(`${API_URL}/ai/nutritiondata`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': 'Bearer ' + jwt,
            'Food-Entry': foodEntry,
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

export const GetImageNutritionData = async (imageBase64: string, jwt: string): Promise<AIDataResponse> => {
    console.log('Getting image nutrition data.');
    const response = await fetch(`${API_URL}/ai/imagenutritiondata`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': 'Bearer ' + jwt,
        },
        body: json.stringify({ imageBase64: imageBase64 }),
    });

    if (response.ok) {
        const data = await response.json();
        return data as AIDataResponse;
    } else if (response.status === 400) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Invalid image data');
    } else {
        console.error('Failed to retrieve image nutrition data:', response.status, response.text());
        throw new Error('An unexpected error occurred while retrieving image nutrition data.');
    }
};