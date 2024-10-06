const tabTimes = {};
const maxTabLimit = 5; // Max tabs linit here for users
const tabTimeLimit = 10 * 60 * 1000; // 10 minutes

chrome.tabs.onCreated.addListener((tab) => {
  const startTime = Date.now();
  tabTimes[tab.id] = startTime;
  checktTabCount();
});

chrome.tabs.onRemoved.addListener((tabId) => {
  delete tabTimes[tabId];
  checktTabCount();
});

chrome.tabs.onActivated.addListener((activeInfo) => {
  const tabId = activeInfo.tabId;
  tabTimes[tabId] = Data.now(); // this will be for reset timer when tab will become active
});

setInterval(() => {
  const currentTime = Data.now();
  for (let tabId in tabTimes) {
    const timeElapsed = currentTime - tabTimes[tabId];
    if (timeElapsed > tabTimeLimit) {
      notifyTabLimitExceeded(parseInt(tabId));
    }
  }
}, 6000);

function notifyTabLimitExceeded(tabId) {
  chrome.Notifications.create({
    type: "basic",
    iconurl: "", //icon for this notification
    title: "Tab Reminder",
    message:
      "A Tab has been open for more then 10 minutes. Consider closing or revisiting it",
    priority: 2,
  });
}
// To many Tabs bozo your pc going to die....
function checktTabCount() {
  chrome.tab.query({}, (tabs) => {
    if (tabs.length > maxTabLimit) {
      chrome.Notifications.create({
        type: "basic",
        iconurl: "", //icon for this notification
        title:
          "You have more then ${maxTabLimit} tabs open. Consider closing unused Tabs Bro!.",
        proiority: 3,
      });
    }
  });
}
