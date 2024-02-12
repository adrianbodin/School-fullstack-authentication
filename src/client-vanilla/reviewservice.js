import { apiUrl } from "./authservice.js";

//Get
export async function getAllReviews() {
    
    const response = await fetch(`${apiUrl}/api/review`);
    
    if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);

    return await response.json();
}

//Get
export async function getReviewById(reviewId) {
    
    const response = await fetch(`${apiUrl}/api/review/${reviewId}`);
    
    if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
    
    return { status: 'success', data: await response.json() };
}

//Post
export async function addReview(review) {
    const response = await fetch(`${apiUrl}/api/review`, {
        method: 'Post',
        headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${localStorage.getItem('bearerToken')}`},
        body : JSON.stringify({ movieId: review.movieId, comment: review.comment, grade: review.grade})
    });

    if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);

    return { status: 'success', data: await response.json() };
}

//Put
export async function updateReview(review) {
    const response = await fetch(`${apiUrl}/api/review/${review.id}`, {
        method: 'Put',
        headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${localStorage.getItem('bearerToken')}`},
        body : JSON.stringify({ grade: review.grade, comment: review.comment })
    });

    if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);

    return { status: 'success', data: await response.json() };
}

//Delete
export async function deleteReview(reviewId) {
    const response = await fetch(`${apiUrl}/api/review/${reviewId}`, {
        method: 'Delete',
        headers: { 'Authorization': `Bearer ${localStorage.getItem('bearerToken')}`},
    });

    if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);

    return { status: 'success' };
}