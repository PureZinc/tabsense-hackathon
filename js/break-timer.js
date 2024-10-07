const BREAK_INITERVAL = 3 * 1000;

function startBreakTimer(){
    setInterval(() => {
         sendBreakNotification();
    }, BREAK_INITERVAL);
}

function sendBreakNotification(){
    chrome.notifications.create({
        type: "basic",
        iconUrl: imgURL("assets/dot.png"),
        title: `Take a Break!`,
        message: "You've been browsing for an hour. You should take a break and go touch grass",
        priority: 2,
    });
}

chrome.runtime.onStartup.addListener(startBreakTimer);
chrome.runtime.onInstalled.addListener(startBreakTimer);