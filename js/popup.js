document.getElementById('saveButton').addEventListener('click', () => {
    const timeLimit = parseInt(document.getElementById("timeLimit").value)  * 60 * 1000;
    const tabLimit = parseInt(document.getElementById("tabLimit").value);

    chrome.storage.local.set({tabTimeLimit: timeLimit, maxTabLimit:tabLimit}, () =>{
        alert("Setting Saved!");
    });
});

document.addEventListener("DOMContentLoaded", () => {
    chrome.storage.local.get(["tabTimeLimit", "maxTabLimit"], (result) => {
        if (result.tabTimeLimit){
            document.getElementById("timeLimit").value = result.tabTimeLimit / (60 * 1000);
        }
        if (result.maxTabLimit){
            document.getElementById("tabLimit").value = result.maxTabLimit;
        }
    });
});

chrome.tabs.query({}, (tabs) => {
    const tabCount = tabs.length;
    document.getElementById('tabCount').textContent = `You have ${tabCount} open tabs.`;
});

//Quick Close Button
document.getElementById("quickClose").addEventListener("click", () =>{
    chrome.runtime.sendMessage({ action: "closeIdleTabs" }, (reponse) => {
        if (reponse.status === "done") {
            alert("All useless tabs has been Closed");
        }
    });
});

async function accessAI(promp) {
    const API_URL = 'http://127.0.0.1:8000/api'; // Replace with hosted backend URL once deployed 

    const data = {
        content: promp
    }

    try {
        const response = await fetch(`${API_URL}/chat/`, {
            method: 'POST',
            headers: {'Content-Type': 'application/json'},
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
