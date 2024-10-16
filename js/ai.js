const API_URL = 'http://127.0.0.1:8000/api'; // Replace with hosted backend URL once deployed 

async function getAuthToken() {
    return await new Promise((resolve, reject) => {
        chrome.storage.local.get('authToken', (result) => {
            if (result.authToken) {
                resolve(result.authToken);
            } else {
                reject("No access token found");
            }
        });
    });
}

async function accessAI(promp) {
    const authToken = await getAuthToken();  // This is where I run into issues
    
    const data = {
        content: promp
    }

    try {
        const response = await fetch(`${API_URL}/chat/`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${authToken}`
            },
            credentials: 'include',
            body: JSON.stringify(data)
        });

        if (!response.ok) {
            throw new Error(`Server error: ${response.statusText}`);
        }

        return await response.json();

    } catch (error) {
        return { response: 'Failed to connect to the server.' };
    }
}

async function getChatHistory(userId) { 
    const data = {
        user_id: userId
    }

    try {
        const response = await fetch(`${API_URL}/chat-history/`, {
            method: 'POST',
            headers: {'Content-Type': 'application/json'},
            credentials: 'include',
            body: JSON.stringify(data)
        });

        if (!response.ok) {
            throw new Error(`Server error: ${response.statusText}`);
        }

        return await response.json();

    } catch (error) {
        return { response: 'Failed to connect to the server.' };
    }
}

document.addEventListener('DOMContentLoaded', () => {
    const prompted = document.getElementById('input-text');
    const response = document.getElementById('response');

    document.getElementById('ask-btn').addEventListener('click', async () => {
        const userInput = prompted.value;
        response.innerHTML = 'Loading...';
        const result = await accessAI(userInput);
        response.innerHTML = result.response;
    });
});
