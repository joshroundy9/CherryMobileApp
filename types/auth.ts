export interface RegisterRequest {
    username: string;
    password: string;
    email: string;
    weight: string;
}
export interface UserResponse {
    userID: string;
    username: string;
    email: string;
    isEmailVerified: boolean;
    weight: string;
    startingWeight: string;
    createdTS: string;
}