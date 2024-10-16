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
