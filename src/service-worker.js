var languages = [];

// Watch for changes to the user's options & apply them
chrome.storage.onChanged.addListener((changes, area) => {
        if (area === 'sync' && changes.options?.newValue) {
        console.log(JSON.stringify(changes.options.newValue));
        languages = changes.options.newValue.languages;
        console.log("Updated languages: " + languages);
        }
        });

function DOMtoString(selector) {
    console.log("DOMtoString");
    if (selector) {
        selector = document.querySelector(selector);
        if (!selector) return "ERROR: querySelector failed to find node"
    } else {
        selector = document.documentElement;
    }
    return selector.outerHTML;
};
chrome.tabs.onUpdated.addListener( function (tabId, changeInfo, tab) {
        const activeTab = chrome.tabs.query({ currentWindow: true, active: true });
        var activeTabId = activeTab.id;
});
