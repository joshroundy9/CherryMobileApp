export interface DateRequest {
    userID: string;
    date: string; // ISO 8601 format
}

export interface DateResponse {
    userID: string;
    dateID: string;
    date: string; // ISO 8601 format
    dailyWeight: string;
    dailyCalories: string;
    dailyProtein: string;
}

export interface UpdateWeightRequest {
    userID: string;
    weight: string; // New weight to update
}

export interface GetMealsRequest {
    userID: string;
    dateID: string; // ID of the date for which meals are requested
}

export interface MealResponse {
    mealID: string;
    mealName: string;
    userID: string;
    dateID: string;
    mealCalories: number;
    mealProtein: number;
    time: string;
}

export interface UpdateDateRequest {
    userID: string;
    dateID: string; // ID of the date to update
    dailyWeight?: string; // Optional new weight for the date
    dailyCalories?: string; // Optional new calories for the date
    dailyProtein?: string; // Optional new protein for the date
}

export interface CreateMealRequest {
    mealName: string;
    userID: string;
    dateID: string; // ID of the date to which the meal belongs
    time: string; // Time of the meal in ISO 8601 format
}

export interface DeleteMealRequest {
    userID: string;
    mealID: string; // ID of the meal to delete
}