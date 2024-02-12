export const apiUrl = 'https://localhost:7069';

export let user = null;

export async function login(email, password) {
    const response = await fetch(`${apiUrl}/login`, {
        method: 'Post',
        headers: { 'Content-Type': 'application/json'},
        body : JSON.stringify({ email, password })
    });

    if (!response.ok) throw new Error("Login failed, please try again");

    const data = await response.json();
    localStorage.setItem('bearerToken', data.accessToken);

    user = { email: email };
    
    return { status: 'success', data };
}

export function logout() {
    localStorage.removeItem('bearerToken');
    user = null;
}

export async function testAuth() {
    const response = await fetch(`${apiUrl}/manage/info`, {
        method: 'Get',
        headers: { 'Authorization': `Bearer ${localStorage.getItem('bearerToken')}`}
    });

    if (!response.ok) throw new Error('Not authorized');
    
    const data = await response.json();
    
    user = { email: data.email}

    return { status: 'success', message: 'Authorized'};
}

export async function register(email, password) {
    const response = await fetch(`${apiUrl}/register`, {
        method: 'Post',
        headers: { 'Content-Type': 'application/json'},
        body : JSON.stringify({ email, password })
    });

    if (!response.ok) throw new Error("Registration failed, please try again");

    return { status: 'success', message: 'Authorized'};
}