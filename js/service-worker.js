importScripts("./js/quick-close.js")
importScripts("./js/break-timer.js")

// Basic Internal Functions
const imgURL = (imgName) => chrome.runtime.getURL(`assets/${imgName}`); //Makes getting imgages easier.

// Define settings here
let tabTimes = {};
let maxTabLimit = 5;
let tabTimeLimit = 10 * 60 * 1000;

// Tests

// let testCount = 0
// setInterval(() => {
//   testCount += 1
//   console.log(5*testCount, "Seconds have passed!")
//   console.log("Tab Times: ", tabTimes)
// }, 5000)

// chrome.tabs.query({}, (tabs) => {
//   tabs.forEach((tab) => {
//     console.log(tab);
//   });
// });


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

// Tab Time Tracker
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

function notifyTabLimitExceeded(tab) {
  chrome.notifications.create({
    type: "basic",
    iconUrl: imgURL("dot.png"), // In the future, make this icon the favicon from the tab
    title: "Tab Reminder",
    message: `The ${tab.title} Tab has been open for more than ${tabTimeLimit / 60000} minutes. Consider closing or revisiting it`,
    priority: 1,
  });
}

setInterval(() => {
  const currentTime = Date.now();
  chrome.tabs.query({}, (tabs) => {
    tabs.forEach((tab) => {
      const timeElapsed = currentTime - tabTimes[tab.id];
      if (timeElapsed > tabTimeLimit && !tab.active) {  // Should now activate only if the tab is inactive!
        notifyTabLimitExceeded(tab);
      }
    });
  });
  console.log("Interval Passed!")
}, 30 * 1000); // Checks every 30 seconds.

// To many Tabs bozo your pc going to die....
// In other words, this is the Tab Count Tracker
function checkTabCount() {
  chrome.tabs.query({}, (tabs) => {
    if (tabs.length > maxTabLimit) {
      chrome.notifications.create({
        type: "basic",
        iconUrl: imgURL("dot.png"), //icon for this notification
        title: `You have more than ${maxTabLimit} tabs open.`,
        message: "You’ve got so many tabs open, I’m surprised your browser hasn’t filed for a restraining order. Close them all and actually get something done!",
        priority: 1,
      });
    }
  });
}