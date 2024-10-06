document.getElementById('saveSettings').addEventListener('click', () => {
    const timeLimit = parseInt(document.getElementById("timeLimit").value)  * 60 * 1000;
    const tabLimit = parseInt(document.getElementById("tabLimit").value);

    chrome.storge.local.set({tabTimeLimit: timeLimit, maxTabLimit:tabLimit}, () =>{
        alert("Setting Saved!");
    });
});

document.addEventListener("DOMContentLoaded", () => {
    chrome.storge.local.get(["tabTimeLimit", "maxTabLimit"], (result) => {
        if (result.tabTimeLimit){
            document.getElementById("timeLimit").value = result.tabTimeLimit / (60* 1000);
        }
        if (result.maxTabLimit){
            document.getElementById("tabLimit").value = result.maxTabLimit;
        }
    });
});