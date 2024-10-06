chrome.tabs.query({}, (tabs) => {
    const tabCount = tabs.length;
    document.getElementById('tabCount').textContent = `You have ${tabCount} open tabs.`;
});