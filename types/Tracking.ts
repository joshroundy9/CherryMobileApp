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
    weight: string;
}

export interface GetMealsRequest {
    userID: string;
    dateID: string;
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

export interface UpdateMealRequest {
    userID: string;
    mealID: string;
    calories: string;
    protein: string;
}

export interface GetMealItemsRequest {
    mealID: string;
    userID: string;
}

export interface DeleteMealItemRequest {
    userID: string;
    mealItemID: string;
}

export interface MealItemDTO {
    itemID?: string;
    mealID: string;
    dateID: string;
    userID: string;
    itemName: string;
    itemCalories: number;
    itemProtein: number;
    aiGenerated: boolean;
    createdTS?: string;
}

export interface UpdateDateRequest {
    userID: string;
    dateID: string;
    dailyWeight?: string;
    dailyCalories?: string;
    dailyProtein?: string;
}

export interface CreateMealRequest {
    mealName: string;
    userID: string;
    dateID: string;
    time: string; // Time of the meal in ISO 8601 format
}

export interface DeleteMealRequest {
    userID: string;
    mealID: string;
}