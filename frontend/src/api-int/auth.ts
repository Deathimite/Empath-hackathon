const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5001';

export interface User {
    id: number;
    email: string;
    username: string;
}

export const authApi = {
    login: async (email: string, password: string): Promise<{ user: User }> => {
        const response = await fetch(`${API_URL}/auth/login`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            credentials: 'include',
            body: JSON.stringify({ email, password }),
        });
        const data = await response.json();
        if (!response.ok) throw new Error(data.error || 'Login failed');
        return data;
    },

    register: async (email: string, username: string, password: string): Promise<{ user: User }> => {
        const response = await fetch(`${API_URL}/auth/register`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            credentials: 'include',
            body: JSON.stringify({ email, username, password }),
        });
        const data = await response.json();
        if (!response.ok) throw new Error(data.error || 'Registration failed');
        return data;
    },

    logout: async (): Promise<void> => {
        await fetch(`${API_URL}/auth/logout`, {
            method: 'POST',
            credentials: 'include',
        });
    },

    checkStatus: async (): Promise<{ authenticated: boolean; user?: User }> => {
        const response = await fetch(`${API_URL}/auth/check`, {
            credentials: 'include',
        });
        return response.json();
    }
};
