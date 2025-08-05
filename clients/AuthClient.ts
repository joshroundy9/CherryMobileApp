import { RegisterRequest, UserResponse } from '../types/auth';

// const API_URL = 'https://cherrywebserver.joshroundy.dev:8080';
export const RegisterUser = async (request: RegisterRequest): Promise<UserResponse> => {
    console.log('Full URL:', `https://cherrywebserver.joshroundy.dev:8080/auth/register`);
    const response = await fetch(`https://cherrywebserver.joshroundy.dev:8080/auth/register`, {
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