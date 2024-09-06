// OAuth and Google Classroom API setup
const CLIENT_ID = '664739251482-r95afusn4k56l01g6ajhffekkomt9pa0.apps.googleusercontent.com';
const REDIRECT_URI = 'https://njlr41.github.io/oauth2callback';
const SCOPES = 'https://www.googleapis.com/auth/classroom.courses.readonly https://www.googleapis.com/auth/classroom.coursework.me.readonly';

// Function to redirect the user to Google for OAuth authentication
function authenticate() {
    const authUrl = `https://accounts.google.com/o/oauth2/v2/auth?client_id=${CLIENT_ID}&redirect_uri=${REDIRECT_URI}&scope=${encodeURIComponent(SCOPES)}&response_type=token`;
    window.location.href = authUrl;  // Redirect user to Google's OAuth page
}

// Function to handle the OAuth callback and get the access token
function handleAuthCallback() {
    const urlParams = new URLSearchParams(window.location.hash.substring(1));
    const accessToken = urlParams.get('access_token');

    if (accessToken) {
        loadClassroomData(accessToken);  // Fetch Classroom data after successful auth
    }
}

// Function to fetch data from Google Classroom API
function loadClassroomData(accessToken) {
    fetch('https://classroom.googleapis.com/v1/courses', {
        headers: {
            'Authorization': `Bearer ${accessToken}`,
        },
    })
    .then(response => response.json())
    .then(data => {
        console.log('Google Classroom Data:', data);
        displayClassroomData(data);  // Display the data on your page
    })
    .catch(error => console.error('Error fetching Classroom data:', error));
}

// Function to display Google Classroom data on the page
function displayClassroomData(data) {
    const container = document.getElementById('classroomData');
    container.innerHTML = '';  // Clear any existing content

    if (data.courses && data.courses.length > 0) {
        data.courses.forEach(course => {
            const courseDiv = document.createElement('div');
            courseDiv.textContent = `Course: ${course.name}`;
            container.appendChild(courseDiv);
        });
    } else {
        container.textContent = 'No courses found.';
    }
}

// Set up button click handler to start the authentication process
document.getElementById('loginButton').addEventListener('click', authenticate);

// Run this when the page loads to handle OAuth callback after user login
window.onload = handleAuthCallback;
