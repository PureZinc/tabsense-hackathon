const IDLE_TIME_LIMIT = 10 * 60 * 1000; // 10 minutes

const removeTab = (tabId) => {
  chrome.tabs.remove(tabId);
  delete tabTimes[tabId];
}

function closeIdleAndDuplicateTabs() {
  chrome.tabs.query({}, (tabs) => {
    let uniqueUrls = new Set();

    tabs.forEach((tab) => {
      if (!uniqueUrls.has(tab.url)) {
        uniqueUrls.add(tab.url);
      } else {
        removeTab(tab.id); // closes any duplicate tabs
      }

      //this is checking if any tab is idle (not interacted with for a while)
      const timeElapsed = Date.now() - tabTimes[tab.id];
      if (tab && timeElapsed > IDLE_TIME_LIMIT && !tab.active) {
        removeTab(tab.id);
      }
    });
  });
}

//for lising for messages from popup.js 
chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
    if (request.action === "closeIdleTabs"){
        closeIdleAndDuplicateTabs();
        sendResponse({status: "done"})
    }
})