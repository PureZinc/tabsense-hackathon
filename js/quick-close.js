const IDLE_TIME_LIMIT = 30 * 60 * 1000; // 30 minutes

function closeIdleAndDuplicateTabs() {
  chrome.tabs.query({}, (tabs) => {
    let uniqueUrls = new Set();

    tabs.forEach((tab) => {
      if (!uniqueUrls.has(tab.url)) {
        uniqueUrls.add(tab.url);
      } else {
        chrome.tabs.remove(tab.id); // closes any duplicate tabs
      }

      //this is checking if any tab is idle (not interacted with for a while)
      const timeElapsed = Date.now() - tabTimes[tab.id];
      console.log(timeElapsed, "vs", IDLE_TIME_LIMIT);
      if (timeElapsed > IDLE_TIME_LIMIT && !tab.active) {
        chrome.tabs.remove(tab.id);
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