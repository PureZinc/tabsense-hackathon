// Creates a 1 to 1 user object between the chrome extension and the backend server
API_URL = 'http://127.0.0.1:8000/api';


async function login(username) {  // Gets or Creates a user connection once the extension opens.
    const response = await fetch(`${API_URL}/token/`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username })
    });

    if (!response.ok) {
        throw new Error(`Login failed: ${response.statusText}`);
    }

    const data = await response.json();

    // Stores Tokens in a Reusable Place
    await chrome.storage.local.set({ authToken: data.access, refreshToken: data.refresh });
}

async function refreshToken() {
    const refreshToken = await getRefreshToken(); // Function to get refresh token

    const response = await fetch(`${API_URL}/api/token/refresh/`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({ refresh: refreshToken }),
    });

    if (!response.ok) {
        console.error("Failed to refresh token:", response.statusText);
        return;
    }

    const data = await response.json();
    await chrome.storage.local.set({ authToken: data.access });
    console.log("New access token stored:", data.access);
}