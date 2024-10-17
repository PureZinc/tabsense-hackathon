const API_URL = 'http://127.0.0.1:8000/api'; // Replace with hosted backend URL once deployed 

async function accessAI(promp) {
    const data = {
        content: promp
    }

    try {
        const response = await fetch(`${API_URL}/chat/`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
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

const keywordContainer = document.getElementById('keyword-container');

function addKeywordTemplate(kw) {
    const keyword = document.createElement('p');
    const name = document.createElement('span');
    name.innerHTML = `${kw.name}: `
    keyword.appendChild(name);
    const description = document.createTextNode(kw.description);
    keyword.appendChild(description);
    keywordContainer.appendChild(keyword);
}

async function makeKeywords() {
    const keywords = await fetch(`${API_URL}/chat/`, {
        method: 'GET',
        headers: {'Content-Type': 'application/json'}
    }) 

    if (!keywords.ok) {
        throw new Error(`Error: ${keywords.status} ${keywords.statusText}`);
    }

    const data = await keywords.json();
    console.log(keywords);
    for (const kw of data.keywords) {
        addKeywordTemplate(kw);
    }
}

document.addEventListener('DOMContentLoaded', () => {
    const prompted = document.getElementById('input-text');
    const response = document.getElementById('response');

    makeKeywords();

    document.getElementById('ask-btn').addEventListener('click', async () => {
        const userInput = prompted.value;
        response.innerHTML = 'Loading...';
        const result = await accessAI(userInput);
        response.innerHTML = result.response;
    });
});
