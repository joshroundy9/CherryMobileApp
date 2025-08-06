import {LoginRequest, LoginResponse, RegisterRequest, UserResponse} from '../types/auth';

export const RegisterUser = async (request: RegisterRequest): Promise<UserResponse> => {
    const API_URL = 'https://cherrywebserver.joshroundy.dev:8080';
    console.log('Full URL:', `${API_URL}/auth/register`);
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
    const API_URL = 'https://cherrywebserver.joshroundy.dev:8080';
    console.log('Full URL:', `${API_URL}/auth/login`);
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