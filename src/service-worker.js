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
//           return chrome.scripting.executeScript({
//               target: { tabId: activeTabId },
//               injectImmediately: true,  uncomment this to make it execute straight away, other wise it will wait for document_idle
//               func: DOMtoString,
//               args: ['body']  you can use this to target what element to get the html for
//           });
//       }).then(function (results) {
//           message.innerText = results[0].result;
//       }).catch(function (error) {
//           message.innerText = 'There was an error injecting script : \n' + error.message;
//       });
// }
});
chrome.tabs.onUpdated.addListener(function (tabId, changeInfo, tab) {

    if (changeInfo.status == 'complete' && tab.active && tab.url.includes("wikipedia.org")) {
        const re = /https:\/\/(\w\w)(\.wikipedia\.org\/wiki\/.*)/;
        var info = tab.url.match(re);
        var language = info[1];
        var article = info[2];
        
        var other = languages.filter((x) => x !== language)[0];
        var redirect = "https://" + other + article;
        chrome.tabs.create({
            url: redirect
        });
    }
});
