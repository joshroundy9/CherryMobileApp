import {
    CreateMealRequest,
    DateRequest,
    DateResponse, DeleteMealItemRequest, DeleteMealRequest, GetMealItemsRequest,
    GetMealsRequest, MealItemDTO,
    MealResponse,
    UpdateDateRequest, UpdateMealRequest,
    UpdateWeightRequest
} from "../types/Tracking";
import {UserResponse} from "../types/Auth";

export const API_URL = 'https://cherrywebserver.joshroundy.dev:8080';

export const GetOrCreateDate = async (request: DateRequest, jwt: string): Promise<DateResponse> => {
    const response = await fetch(`${API_URL}/data/date/from-user-and-date?date=${request.date}`, {
        method: 'GET',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': 'Bearer ' + jwt,
            'User-ID': request.userID,
        },
        body: null,
    });

    if (response.ok) {
        const data = await response.json();
        console.log('Date retrieved or created successfully:', data);
        return data as DateResponse;
    } else if (response.status === 400) {
        const errorData = await response.text();
        throw new Error(errorData);
    } else {
        console.error('Failed to retrieve date:', response.status, response.text());
        throw new Error('An unexpected error occurred while creating the date.');
    }
};

export const UpdateUserWeight = async (request: UpdateWeightRequest, jwt: string): Promise<UserResponse> => {
    const response = await fetch(`${API_URL}/data/user/update-weight?weight=` + request.weight, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': 'Bearer ' + jwt,
            'User-ID': request.userID,
        },
        body: null,
    });

    if (response.ok) {
        const data = await response.json();
        return data as UserResponse;
    } else if (response.status === 400) {
        const errorData = await response.text();
        throw new Error(errorData);
    } else {
        console.error('Failed to update weight:', response.status, response.text());
        throw new Error('An unexpected error occurred while updating the user\'s weight.');
    }
};

export const GetMeals = async (request: GetMealsRequest, jwt: string): Promise<MealResponse[]> => {
    const response = await fetch(`${API_URL}/data/meal?dateid=${request.dateID}`, {
        method: 'GET',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': 'Bearer ' + jwt,
            'User-ID': request.userID,
        },
        body: null,
    });

    if (response.ok) {
        const data = await response.json();
        console.log('Meals retrieved successfully:', data);
        return data as MealResponse[];
    } else if (response.status === 400) {
        const errorData = await response.text();
        throw new Error(errorData);
    } else {
        console.error('Failed to get meals:', response.status, response.text());
        throw new Error('An unexpected error occurred while retrieving meals.');
    }
};

export const UpdateDateWeight = async (request: UpdateDateRequest, jwt: string): Promise<DateResponse> => {
    const response = await fetch(`${API_URL}/data/date/update-weight?dateid=` + request.dateID + '&weight=' + request.dailyWeight, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': 'Bearer ' + jwt,
            'User-ID': request.userID,
        },
        body: null,
    });

    if (response.ok) {
        const data = await response.json();
        return data as DateResponse;
    } else if (response.status === 400) {
        const errorData = await response.text();
        throw new Error(errorData);
    } else {
        console.error('Failed to update date weight:', response.status, response.text());
        throw new Error('An unexpected error occurred while updating date weight.');
    }
};

export const UpdateDateNutrition = async (request: UpdateDateRequest, jwt: string): Promise<DateResponse> => {
    const response = await fetch(`${API_URL}/data/date/update-nutrition?dateid=` + request.dateID + '&calories=' + request.dailyCalories + '&protein=' + request.dailyProtein, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': 'Bearer ' + jwt,
            'User-ID': request.userID,
        },
        body: null,
    });

    if (response.ok) {
        const data = await response.json();
        return data as DateResponse;
    } else if (response.status === 400) {
        const errorData = await response.text();
        throw new Error(errorData);
    } else {
        console.error('Failed to update date nutrition:', response.status, response.text());
        throw new Error('An unexpected error occurred while updating date nutrition.');
    }
};

export const UpdateMealNutrition = async (request: UpdateMealRequest, jwt: string): Promise<MealResponse> => {
    const response = await fetch(`${API_URL}/data/meal/update-nutrition?mealid=` + request.mealID + '&calories=' + request.calories + '&protein=' + request.protein, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': 'Bearer ' + jwt,
            'User-ID': request.userID,
        },
        body: null,
    });

    if (response.ok) {
        const data = await response.json();
        return data as MealResponse;
    } else if (response.status === 400) {
        const errorData = await response.text();
        throw new Error(errorData);
    } else {
        console.error('Failed to update date nutrition:', response.status, response.text());
        throw new Error('An unexpected error occurred while updating date nutrition.');
    }
};

export const CreateMeal = async (request: CreateMealRequest, jwt: string): Promise<MealResponse> => {
    console.log('Creating meal with request:', request);
    const response = await fetch(`${API_URL}/data/meal`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': 'Bearer ' + jwt,
            'User-ID': request.userID,
        },
        body: JSON.stringify(request),
    });

    if (response.ok) {
        const data = await response.json();
        return data as MealResponse;
    } else if (response.status === 400) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Invalid request data');
    } else {
        console.error('Failed to create meal:', response.status, response.text());
        throw new Error('An unexpected error occurred while creating the meal.');
    }
};

export const DeleteMeal = async (request: DeleteMealRequest, jwt: string): Promise<void> => {
    const response = await fetch(`${API_URL}/data/meal/delete?mealid=` + request.mealID, {
        method: 'DELETE',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': 'Bearer ' + jwt,
            'User-ID': request.userID,
        },
        body: null,
    });

    if (response.ok) {
        return;
    } else if (response.status === 400) {
        const errorData = await response.text();
        throw new Error(errorData);
    } else {
        console.error('Failed to delete meal:', response.status, response.text());
        throw new Error('An unexpected error occurred while deleting the meal.');
    }
};

export const GetMealItems = async (request: GetMealItemsRequest, jwt: string): Promise<MealItemDTO[]> => {
    const response = await fetch(`${API_URL}/data/meal-item?mealid=${request.mealID}`, {
        method: 'GET',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': 'Bearer ' + jwt,
            'User-ID': request.userID,
        },
        body: null,
    });

    if (response.ok) {
        const data = await response.json();
        console.log('Meal items retrieved successfully:', data);
        return data as MealItemDTO[];
    } else if (response.status === 400) {
        const errorData = await response.text();
        throw new Error(errorData);
    } else {
        console.error('Failed to get meal items:', response.status, response.text());
        throw new Error('An unexpected error occurred while retrieving meal items.');
    }
};

export const CreateMealItem = async (request: MealItemDTO, jwt: string): Promise<MealItemDTO> => {
    console.log('Creating meal item with request:', request);
    const response = await fetch(`${API_URL}/data/meal-item`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': 'Bearer ' + jwt,
            'User-ID': request.userID,
        },
        body: JSON.stringify(request),
    });

    if (response.ok) {
        const data = await response.json();
        return data as MealItemDTO;
    } else if (response.status === 400) {
        const errorData = await response.json();
        console.log('Error data:', errorData);
        throw new Error(errorData.error || 'Invalid request data');
    } else {
        console.error('Failed to create meal item:', response.status, response.text());
        throw new Error('An unexpected error occurred while creating the meal item.');
    }
};

export const DeleteMealItem = async (request: DeleteMealItemRequest, jwt: string): Promise<void> => {
    const response = await fetch(`${API_URL}/data/meal-item/delete?mealitemid=` + request.mealItemID, {
        method: 'DELETE',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': 'Bearer ' + jwt,
            'User-ID': request.userID,
        },
        body: null,
    });

    if (response.ok) {
        return;
    } else if (response.status === 400) {
        const errorData = await response.text();
        throw new Error(errorData);
    } else {
        console.error('Failed to delete meal item:', response.status, response.text());
        throw new Error('An unexpected error occurred while deleting the meal item.');
    }
};

export const GetMealItemRecents = async (userID: string, jwt: string): Promise<MealItemDTO[]> => {
    const response = await fetch(`${API_URL}/data/meal-item/recents`, {
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
        console.log('Meal item recents retrieved successfully:', data);
        return data as MealItemDTO[];
    } else if (response.status === 400) {
        const errorData = await response.text();
        throw new Error(errorData);
    } else {
        console.error('Failed to get meal item recents:', response.status, response.text());
        throw new Error('An unexpected error occurred while retrieving meal item recents.');
    }
};
