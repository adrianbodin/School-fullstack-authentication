import { apiUrl } from "./authservice.js";

//TODO Needs to be checked to return the right data
//Use try catch to handle errors when calling these functions


//Get
export async function getAllMovies() {
    const response = await fetch(`${apiUrl}/api/movie`, {
        method: 'Get'
    });

    if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);

    return await response.json();
}

//Get
export async function getMovieById(movieId) {
    const response = await fetch(`${apiUrl}/api/movie/${movieId}`, {
        method: 'Get'
    });

    if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);

    return { status: 'success', data: await response.json() };
}

//Get
export async function getMovieReviewsById(movieId) {
    const response = await fetch(`${apiUrl}/api/movie/${movieId}/reviews`, {
        method: 'Get'
    });

    if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);

    return { status: 'success', data: await response.json() };
}

//Post
export async function addMovie(movie) {
    const response = await fetch(`${apiUrl}/api/movie`, {
        method: 'Post',
        headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${localStorage.getItem('bearerToken')}`},
        body : JSON.stringify({ title: movie.title, releaseYear: movie.releaseYear })
    });

    if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);

    return { status: 'success', data: await response.json() };
}

//Put
export async function updateMovie(movie) {
    const response = await fetch(`${apiUrl}/api/movie/${movie.id}`, {
        method: 'Put',
        headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${localStorage.getItem('bearerToken')}`},
        body : JSON.stringify({ title: movie.title, releaseYear: movie.releaseYear })
    });

    if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);

    return { status: 'success' };
}

//Delete
export async function deleteMovie(movieId) {
    const response = await fetch(`${apiUrl}/api/movie/${movieId}`, {
        method: 'Delete',
        headers: { 'Authorization': `Bearer ${localStorage.getItem('bearerToken')}`},
    });

    if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);

    return { status: 'success' };
}