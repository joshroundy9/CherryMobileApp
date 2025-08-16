import {LoginRequest, LoginResponse, RegisterRequest, UserResponse} from '../types/Auth';
const API_URL = 'https://cherrywebserver.joshroundy.dev:8080';

export const RegisterUser = async (request: RegisterRequest): Promise<UserResponse> => {
    const response = await fetch(`${API_URL}/auth/register`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(request),
    });

    if (response.ok) {
        const data = await response.json();
        console.log('User registered successfully:', data);
        return data as UserResponse;
    } else if (response.status === 400) {
        const errorData = await response.text();
        throw new Error(errorData);
    } else {
        console.error('Failed to register user:', response.status, response.text());
        throw new Error('An unexpected error occurred while registering the user.');
    }
};

export const LoginUser = async (request: LoginRequest): Promise<LoginResponse> => {
    const response = await fetch(`${API_URL}/auth/login`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(request),
    });

    if (response.ok) {
        const data = await response.json();
        console.log('User login was successful: ', data);
        return data as LoginResponse;
    } else if (response.status === 400) {
        const errorData = await response.text();
        throw new Error(errorData);
    } else {
        console.error('Failed to login user:', response.status, response.text());
        throw new Error('An unexpected error occurred while logging in the user.');
    }
};

export const ValidateToken = async (jwt: string) => {
    const response = await fetch(`${API_URL}/auth/validate`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'JWT-Token': jwt,
        },
        body: null,
    });
    console.log(jwt);
    if (response.ok) {
        console.log('Token validation was successful.');
        return;
    } else if (response.status === 400) {
        const errorData = await response.text();
        throw new Error(errorData);
    } else {
        console.error('Failed to validate token:', response.status, response.text());
        throw new Error('An unexpected error occurred while validating the token.');
    }
};
