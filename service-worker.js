chrome.tabs.onUpdated.addListener( function (tabId, changeInfo, tab) {
  if (changeInfo.status == 'complete' && tab.active) {
      chrome.tabs.create({url: "https://www.youtube.com"});
  }
})
