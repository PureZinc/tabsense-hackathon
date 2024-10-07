const IDLE_TIME_LIMIT = 30 * 60 * 1000;

function closeIdleAndDuplicateTabs() {
  chrome.tabs.query({}, (tabs) => {
    let uniqueUrls = new Set();
    let idleTabs = [];

    tabs.forEach((tab) => {
      if (!uniqueUrls.has(tab.url)) {
        uniqueUrls.add(tab.url);
      } else {
        chrome.tabs.remove(tab.id); // closes any duplicate tabs
      }

      //this is checking if any tab is idle (not interacted with for a while)
      const timeElapsed = Date.now() - tabTimes[tab.id];
      if (timeElapsed > IDLE_TIME_LIMIT) {
        idleTabs.push(tab.id);
      }
    });

    idleTabs.forEach((tabId) => {
      chrome.tabs.remove(tabId);
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