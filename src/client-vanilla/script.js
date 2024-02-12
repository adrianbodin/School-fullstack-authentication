import {login, register, testAuth, logout, user} from "./authservice.js";
import {getAllMovies, deleteMovie, addMovie, updateMovie, getMovieById} from "./movieservice.js";
import {addReview, deleteReview, getAllReviews, getReviewById, updateReview} from "./reviewservice.js";
//^^^^^^^^^^^^^^Imports^^^^^^^^^^^^^^

//Shows the current state of the table and what it shows
let currentView = 'movies';

//Bringing in all the elements for use in functions
const container = document.querySelector(".container");

const loginHeader = document.getElementById("login-header");

const movieTableButton = document.getElementById("movies-button");
const reviewTableButton = document.getElementById("reviews-button");

const emailInput = document.getElementById("login-email");
const emailErrorMessage = document.getElementById("login-email-error");

const passwordInput = document.getElementById("login-password");
const passwordErrorMessage = document.getElementById("login-password-error");

const loginButton = document.getElementById("login-button");
const loginErrorMessage = document.getElementById("login-error");

const registerLink = document.getElementById("register-link");

const movieButton = document.getElementById("movies-button");
const reviewButton = document.getElementById("reviews-button");

const getByIdInput = document.getElementById("get-by-id-input");

//Displays all the movies and checks if the user is logged in by checking localstorage for bearer
window.onload = async function() {
    await displayAllMovies();
    
    showCurrentShowingTable();
    
    const result = await testAuth();
    
    if(result.status === "success"){
        showLogoutForm();
        await displayLoggedInContent("movies");
    }
}

//Sets highlighting on the current table showing
function showCurrentShowingTable(){
    if(currentView === 'movies'){
        reviewTableButton.style.color = "black";
        reviewTableButton.style.textDecoration = "none";
        movieTableButton.style.color = "black";
        movieTableButton.style.textDecoration = "underline";
    } else if(currentView === 'reviews'){
        movieTableButton.style.color = "black";
        movieTableButton.style.textDecoration = "none";
        reviewTableButton.style.color = "black";
        reviewTableButton.style.textDecoration = "underline";
    }
}

//Makes error messages go away if you click anything but the login button
window.addEventListener("click",  (event)  => {

    if (event.target === loginButton) return;

    emailErrorMessage.innerHTML = ""
    passwordErrorMessage.innerHTML = ""
    loginErrorMessage.innerHTML = ""
    loginErrorMessage.style.color = "red";
});

//Listening for the click on the login 
loginButton.addEventListener("click", formLogin);

//Changes the login form to a register form instead
registerLink.addEventListener("click", (e) => {
    e.preventDefault();
    showRegisterForm();
});

//Listening for click events
movieButton.addEventListener("click", displayContent.bind(null, 'movies'));
reviewButton.addEventListener("click", displayContent.bind(null, 'reviews'));

//Listens for the input event on the get by id input and lists depending on what table is showing
getByIdInput.addEventListener("input", async (e) => {
    const value = getByIdInput.value;
    
    if(value === ""){
        if(currentView === 'movies'){
            await displayAllMovies();
            await displayLoggedInContent("movies");
        } else if (currentView === 'reviews'){
            await displayAllReviews();
            await displayLoggedInContent("reviews");
        }
    }
    else{
        try{
            if(currentView === 'movies'){
                const response = await getMovieById(value);
                const movie = response.data;

                const movieTableBody = document.getElementById("movie-table-body");

                movieTableBody.innerHTML = '';

                const row = document.createElement("tr");

                ['id','title', 'releaseYear'].forEach(prop => {
                    const cell = document.createElement("td");
                    cell.textContent = movie[prop]; // Set the text content directly
                    row.appendChild(cell);
                });

                const rating = document.createElement("td");
                rating.innerHTML = movie.reviews.length !== 0
                    ? (movie.reviews.reduce((acc, review) => acc + review.grade, 0) / movie.reviews.length).toFixed(2)
                    : "No reviews";
                row.appendChild(rating);

                movieTableBody.appendChild(row);
            } else if(currentView === 'reviews'){
                const response = await getReviewById(value);
                const review = response.data;
                const movieTableBody = document.getElementById("movie-table-body");

                // Clear existing reviews from the DOM
                movieTableBody.innerHTML = '';
                
                const row = document.createElement("tr");
                
                ['id', 'movieId', 'grade', 'comment'].forEach(prop => {
                    const cell = document.createElement("td");
                    cell.textContent = review[prop]; // Set the text content directly
                    row.appendChild(cell);
                });
                    
                movieTableBody.appendChild(row);
            }
        } catch(e){
            console.log(e);
            
            const movieTableBody = document.getElementById("movie-table-body");
            movieTableBody.innerHTML = '';
            
            const row = document.createElement("tr");
            const cell = document.createElement("td");
            cell.innerHTML = "No movie found";
            row.appendChild(cell);
            movieTableBody.appendChild(row);
        }
    }
});

//Shows the login form, i need this because i change between login and registration
function showLoginForm() {
    
    loginHeader.innerHTML = "Login";
    loginButton.innerHTML = "Login";
    registerLink.innerHTML = "Don't have an account? Register here";
    
    loginButton.removeEventListener( "click", formRegister);
    loginButton.addEventListener("click", formLogin);
    
    registerLink.removeEventListener("click", showLoginForm);
    registerLink.addEventListener("click", showRegisterForm);
}

//Same as the login
function showRegisterForm() {

    loginHeader.innerHTML = "Register";
    loginButton.innerHTML = "Register";
    registerLink.innerHTML = "Already have an account? Login here";
    
    loginButton.removeEventListener( "click", formLogin);
    loginButton.addEventListener("click", formRegister);
    
    registerLink.removeEventListener("click", showRegisterForm);
    registerLink.addEventListener("click", showLoginForm);
}

//Same as login, just changes the content in the box
async function showLogoutForm(){
    document.getElementById("login-form").style.display = "none";
    
    await displayLoggedInContent("movies");
    
    const welcomeMessage = document.createElement("h2");
    const logoutButton = document.createElement("button");
    logoutButton.addEventListener("click", logoutUser);
    
    welcomeMessage.innerHTML = `Welcome, ${user.email}`;
    logoutButton.innerHTML = "Logout";
    container.insertAdjacentElement("afterbegin", logoutButton);
    container.insertAdjacentElement("afterbegin", welcomeMessage);
}

//Log out the user
function logoutUser(){
    logout();
    window.location.reload();
}

//Is used to change table content depending on what button is clicked
async function displayContent(type, e) {
    e.preventDefault();

    currentView = type;
    
    showCurrentShowingTable();

    if (type === 'movies') {
        await displayAllMovies();
    } else if (type === 'reviews') {
        await displayAllReviews();
    }

    const result = await testAuth();
    if(result.status === "success"){
        await displayLoggedInContent(type);
    }
}

//Registers the user and validates the input
async function formRegister(e){
    e.preventDefault();
    
    if(!validateInput(emailInput.value, passwordInput.value)){
        return;
    }
    
    try{
        await register(emailInput.value, passwordInput.value);
        
        emailInput.value = "";
        passwordInput.value = "";
        loginErrorMessage.innerHTML = "Registration successful, please login";
        loginErrorMessage.style.color = "green";
        showLoginForm();
            
    } catch(e){
        console.log(e);
        loginErrorMessage.innerHTML = "Registration failed, please try again";
    }
}

//Log in the user, and validate the input
async function formLogin(e){
    e.preventDefault();
    
    if(!validateInput(emailInput.value, passwordInput.value)){
        return;
    }
    try{
        await login(emailInput.value, passwordInput.value);
        
        showLogoutForm();
    } catch(e){
        console.log(e);
        loginErrorMessage.innerHTML = "Login failed, please try again";
    }
}

//Function to validate the user input on registration and login
function validateInput(email, password){
    
    if(email.trim() === "" && password.trim() === "") {
        emailErrorMessage.innerHTML = "Please enter an email address";
        passwordErrorMessage.innerHTML = "Please enter a password";
        return false;
    }
    if(email.trim() === "") {
        emailErrorMessage.innerHTML = "Please enter an email address";
        return false;
    }
    if(password.trim() === "") {
        passwordErrorMessage.innerHTML = "Please enter a password";
        return false;
    }
    
    return true;
}

//Creates elements and displays all the elements
async function displayAllMovies() {
    try {
        const movies = await getAllMovies();
        const movieTableBody = document.getElementById("movie-table-body");


        // Clear existing movies from the DOM
        movieTableBody.innerHTML = '';

        renderTableHeaders('movies');  // To display movie headers

        movies.forEach(movie => {
            const row = document.createElement("tr");
            
            ['id','title', 'releaseYear'].forEach(prop => {
                const cell = document.createElement("td");
                cell.textContent = movie[prop]; // Set the text content directly
                row.appendChild(cell);
            });

            const rating = document.createElement("td");
            
            //Counts the grade for the movie on all the reviews for it
            rating.innerHTML = movie.reviews.length !== 0
                ? (movie.reviews.reduce((acc, review) => acc + review.grade, 0) / movie.reviews.length).toFixed(2)
                : "No reviews";
            row.appendChild(rating);

            const editButton = document.createElement("button");
            editButton.innerHTML = "Edit";
            editButton.style.display = "none";
            editButton.addEventListener("click", () => showMovieForm(movie));
            row.appendChild(editButton);
            
            const deleteButton = document.createElement("button");
            deleteButton.innerHTML = "Delete";
            deleteButton.style.display = "none";
            deleteButton.setAttribute("class", "delete-button")
            
            deleteButton.addEventListener("click", async (e)  => {
                try{
                    await deleteMovie( movie.id );
                    await displayAllMovies();
                    await displayLoggedInContent();
                } catch(e){
                    console.log(e);
                }
            });
            row.appendChild(deleteButton);

            movieTableBody.appendChild(row);
        });
    } catch (e) {
        console.log(e);
    }
}

//Very alike the displayAllMovies function
async function displayAllReviews() {
    try {
        const reviews = await getAllReviews();
        const movieTableBody = document.getElementById("movie-table-body");

        // Clear existing reviews from the DOM
        movieTableBody.innerHTML = '';

        renderTableHeaders('reviews'); // To display review headers

        reviews.forEach(review => {
            const row = document.createElement("tr");
            ['id','movieId', 'grade', 'comment'].forEach(prop => {
                const cell = document.createElement("td");
                cell.textContent = review[prop]; // Set the text content directly
                row.appendChild(cell);
            });

            const editButton = document.createElement("button");
            editButton.innerHTML = "Edit";
            editButton.style.display = "none";
            editButton.addEventListener("click", () => showReviewForm(review));
            row.appendChild(editButton);
            
            const deleteButton = document.createElement("button");
            deleteButton.innerHTML = "Delete";
            deleteButton.style.display = "none";
            deleteButton.setAttribute("class", "delete-button")
            deleteButton.addEventListener("click", async (e)  => {
                try{
                    await deleteReview( review.id );
                    await displayAllReviews();
                    await displayLoggedInContent();
                } catch(e){
                    console.log(e);
                }
            });
            row.appendChild(deleteButton);

            movieTableBody.appendChild(row);
        });
    } catch (e) {
        console.log(e);
    }
}

//Displays the add, delete, edit buttons for the logged in user
async function displayLoggedInContent(type){
    //sets all the delete buttons to show when we have successfully logged in
    const deleteButtons = document.querySelectorAll(".delete-button")
    deleteButtons.forEach((b) => b.style.display = "block");

    const editButtons = document.querySelectorAll("button");
    editButtons.forEach((b) => b.style.display = "block");

    const existingAddMovieButton = document.getElementById('add-movie-button');
    if (existingAddMovieButton) {
        existingAddMovieButton.remove();
    }

    const existingAddReviewButton = document.getElementById('add-review-button');
    if (existingAddReviewButton) {
        existingAddReviewButton.remove();
    }

    if (type === 'movies') {
        const addMovieButton = document.createElement("button");
        addMovieButton.id = 'add-movie-button';
        addMovieButton.addEventListener("click", () => showMovieForm());
        addMovieButton.innerHTML = "Add Movie";
        document.querySelector(".crud-box").appendChild(addMovieButton);
    } else if (type === 'reviews') {
        const addReviewButton = document.createElement("button");
        addReviewButton.id = 'add-review-button';
        addReviewButton.addEventListener("click", () => showReviewForm());
        addReviewButton.innerHTML = "Add Review";
        document.querySelector(".crud-box").appendChild(addReviewButton);
    }
}

//Shows the form to add or edit the movie
function showMovieForm(movie = null) {
    // If the form already exists, don't create it again
    if (document.getElementById('movie-form')) {
        return;
    }

    // Create form
    const form = document.createElement('form');
    form.id = 'movie-form';
    form.style.display = "flex";
    form.style.flexDirection = "column";

    // Create input for movie title
    const titleInput = document.createElement('input');
    titleInput.type = 'text';
    titleInput.name = 'title';
    titleInput.placeholder = 'Movie Title';
    titleInput.value = movie ? movie.title : ''; // Pre-fill with current value if editing
    form.appendChild(titleInput);

    // Create input for movie release year
    const releaseYearInput = document.createElement('input');
    releaseYearInput.type = 'number';
    releaseYearInput.name = 'releaseYear';
    releaseYearInput.placeholder = 'Release Year';
    releaseYearInput.value = movie ? movie.releaseYear : ''; // Pre-fill with current value if editing
    form.appendChild(releaseYearInput);

    // Create submit button
    const submitButton = document.createElement('button');
    submitButton.type = 'submit';
    submitButton.textContent = movie ? 'Edit Movie' : 'Add Movie'; // Change button text based on action
    form.appendChild(submitButton);

    const cancelButton = document.createElement("button");
    cancelButton.innerHTML = "Cancel";
    cancelButton.addEventListener("click", () => {
        form.remove();
        document.getElementById('add-movie-button').style.display = "block";
    });
    form.appendChild(cancelButton);

    document.getElementById('add-movie-button').style.display = "none";

    // Append form to container
    document.querySelector(".crud-box").appendChild(form);

    // Add event listener to handle form submission
    form.addEventListener('submit', movie ? (e) => handleEditMovieFormSubmit(e, movie.id) : handleAddMovieFormSubmit);
}

//Shows the form to add or edit the review
function showReviewForm(review = null) {
    // If the form already exists, don't create it again
    if (document.getElementById('review-form')) {
        return;
    }

    // Create form
    const form = document.createElement('form');
    form.id = 'review-form';
    form.style.display = "flex";
    form.style.flexDirection = "column";

    if(!review){
        const movieIdInput = document.createElement('input');
        movieIdInput.type = 'number';
        movieIdInput.name = 'movieId';
        movieIdInput.placeholder = 'Movie Id';
        movieIdInput.value = review ? review.movieId : ''; // Pre-fill with current value if editing
        form.appendChild(movieIdInput);
    }

    // Create input for review comment
    const commentInput = document.createElement('input');
    commentInput.type = 'text';
    commentInput.name = 'comment';
    commentInput.placeholder = 'Review Comment';
    commentInput.value = review ? review.comment : ''; // Pre-fill with current value if editing
    form.appendChild(commentInput);

    // Create input for review grade
    const gradeInput = document.createElement('input');
    gradeInput.type = 'number';
    gradeInput.name = 'grade';
    gradeInput.placeholder = 'Review Grade';
    gradeInput.value = review ? review.grade : ''; // Pre-fill with current value if editing
    form.appendChild(gradeInput);

    // Create submit button
    const submitButton = document.createElement('button');
    submitButton.type = 'submit';
    submitButton.textContent = review ? 'Edit Review' : 'Add Review'; // Change button text based on action
    form.appendChild(submitButton);

    const cancelButton = document.createElement("button");
    cancelButton.innerHTML = "Cancel";
    cancelButton.addEventListener("click", () => {
        form.remove();
        document.getElementById('add-review-button').style.display = "block";
    });
    form.appendChild(cancelButton);

    document.getElementById('add-review-button').style.display = "none";

    // Append form to container
    document.querySelector(".crud-box").appendChild(form);

    // Add event listener to handle form submission
    form.addEventListener('submit', review ? (e) => handleEditReviewFormSubmit(e, review.id) : handleAddReviewFormSubmit);
}

//Is ran when the edit review is submit
async function handleEditReviewFormSubmit(e, id){
    e.preventDefault();

    document.getElementById('add-review-button').style.display = "block";
    
    const form = document.getElementById("review-form");
    const comment = form.elements.comment.value;
    const grade = form.elements.grade.value;
    
    try {
        await updateReview({ comment,grade, id })
        form.remove();
        await displayAllReviews();
        await displayLoggedInContent()
    } catch (e){
        console.log(e);
    }
    
}

//is ran when an edited movies is submit 
async function handleEditMovieFormSubmit(e, id) {
    e.preventDefault();
    
    document.getElementById("add-movie-button").style.display = "block";
    const form = document.getElementById('movie-form');
    const title = form.elements.title.value;
    const releaseYear = form.elements.releaseYear.value;

    try {
        await updateMovie({ title, releaseYear, id });
        form.remove();
        await displayAllMovies();
        await displayLoggedInContent();
    } catch (e) {
        console.log(e);
    }
}

//is ran when you submit the add review
async function handleAddReviewFormSubmit(e){
    e.preventDefault();
    
    document.getElementById('add-review-button').style.display = "block";

    const form = document.getElementById("review-form");
    const movieId = form.elements.movieId.value;
    const comment = form.elements.comment.value;
    const grade = form.elements.grade.value;

    try {
        await addReview({ movieId, comment, grade })
        form.remove();
        await displayAllReviews();
        await displayLoggedInContent()
    } catch (e){
        console.log(e);
        const errorMessage = document.createElement('span');
        errorMessage.textContent = 'Failed to add review';
        errorMessage.style.color = 'red';
        form.appendChild(errorMessage);
    }
}

//is ran when you submit the add movie
async function handleAddMovieFormSubmit(e) {
    e.preventDefault();

    // Get form and its values
    const form = document.getElementById('movie-form');
    const title = form.elements.title.value;
    const releaseYear = form.elements.releaseYear.value;

    try{
        await addMovie({ title, releaseYear });
        form.remove();
        await displayAllMovies();
        await displayLoggedInContent();
    } catch(e){
        console.log(e);
        
        const errorMessage = document.createElement('span');
        errorMessage.textContent = 'Failed to add movie';
        errorMessage.style.color = 'red';
        form.appendChild(errorMessage);
    }
}

//is used to render the headers for the form, for reviews and movies
function renderTableHeaders(type) {
    // Clear existing headers
    const tableHead = document.getElementById('table-head');
    tableHead.innerHTML = '';

    // Define headers for each type
    const headers = {
        movies: ['Id', 'Title', 'Release Year', 'Rating', ''],
        reviews: ['Id', 'MovieId', 'Review', 'Rating', '']
    };

    // Create new row
    const row = document.createElement('tr');

    // Add headers to the row
    headers[type].forEach(header => {
        const th = document.createElement('th');
        th.textContent = header;
        row.appendChild(th);
    });

    // Append the row to the table head
    tableHead.appendChild(row);
}