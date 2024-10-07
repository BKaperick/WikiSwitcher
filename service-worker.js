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
//  if (changeInfo.status == 'complete' && tab.active) {
      // chrome.tabs.create({url: "https://www.youtube.com"});
    
    const active_tab = chrome.tabs.query({ currentWindow: true, active: true })
    // chrome.tabs.query({}, (tabs) => void);
        // console.log("doing shit");
//    );
//    chrome.tabs.query({}, (tabs) => {
//            var activeTab = tabs[0];
//            var activeTabId = activeTab.id;
//
//            return chrome.scripting.executeScript({
//                target: { tabId: activeTabId },
//                // injectImmediately: true,  // uncomment this to make it execute straight away, other wise it will wait for document_idle
//                func: DOMtoString,
//                // args: ['body']  // you can use this to target what element to get the html for
//            });
//
//        }).then(function (results) {
//            message.innerText = results[0].result;
//        }).catch(function (error) {
//            message.innerText = 'There was an error injecting script : \n' + error.message;
//        });
//  }
});
