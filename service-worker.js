/*chrome.webRequest.onBeforeRequest.addListener(
  function(details) {
    if (details.url.includes("wikipedia.org")) {    // Do something with the details
        console.log(details.requestHeaders);
    },
  {urls: ["<all_urls>"]},
  ['blocking']
);
chrome.browserAction.onClicked.addListener(function(activeTab)
{
    var newURL = "http://stackoverflow.com/";
    chrome.tabs.create({ url: newURL });
});
*/
chrome.action.onClicked.addListener(function (tab) {
    console.log("Hello")
});
