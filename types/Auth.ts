export interface RegisterRequest {
    username: string;
    password: string;
    email: string;
    weight: string;
}

export interface LoginRequest {
    username: string;
    password: string;
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
export interface LoginResponse {
    user: UserResponse;
    jwt: string;
}