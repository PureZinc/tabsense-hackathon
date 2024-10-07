let tabTimes = {};
let maxTabLimit = 5;
let tabTimeLimit = 10 * 60 * 1000;

// Changes the max values as the settings change.
function updateLimits() {
  chrome.storage.local.get(["tabTimeLimit", "maxTabLimit"], (result) => {
    if (result.tabTimeLimit) {
      tabTimeLimit = result.tabTimeLimit;
    }
    if (result.maxTabLimit) {
      maxTabLimit = result.maxTabLimit;
    }
  });
}

updateLimits();

chrome.storage.onChanged.addListener((changes, area) => {
  if (area === "local" && (changes.tabTimeLimit || changes.maxTabLimit)) {
    updateLimits();
  }
});

chrome.tabs.onCreated.addListener((tab) => {
  const startTime = Date.now();
  tabTimes[tab.id] = startTime;
  checkTabCount();
});

chrome.tabs.onRemoved.addListener((tabId) => {
  delete tabTimes[tabId];
  checkTabCount();
});

chrome.tabs.onActivated.addListener((activeInfo) => {
  const tabId = activeInfo.tabId;
  tabTimes[tabId] = Date.now(); // this will be for reset timer when tab will become active
});

setInterval(() => {
  const currentTime = Date.now();
  for (let tabId in tabTimes) {
    const timeElapsed = currentTime - tabTimes[tabId];
    if (timeElapsed > tabTimeLimit) {
      notifyTabLimitExceeded(parseInt(tabId));
    }
  }
}, 6000);

function notifyTabLimitExceeded(tabId) {
  chrome.notifications.create({
    type: "basic",
    iconUrl: chrome.runtime.getURL("assets/dot.png"), //icon for this notification
    title: "Tab Reminder",
    message: `A Tab has been open for more than ${tabTimeLimit / 60000} minutes. Consider closing or revisiting it`,
    priority: 1,
  });
}

// To many Tabs bozo your pc going to die....
function checkTabCount() {
  chrome.tabs.query({}, (tabs) => {
    if (tabs.length > maxTabLimit) {
      chrome.notifications.create({
        type: "basic",
        iconUrl: chrome.runtime.getURL("assets/dot.png"), //icon for this notification
        title: `You have more than ${maxTabLimit} tabs open.`,
        message: "Consider closing some unused Tabs Bro!.",
        priority: 1,
      }, (notificationId) => {
        console.log("Notification created with ID:", notificationId);
      });
    }
  });
}
