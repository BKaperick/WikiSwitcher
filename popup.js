function sendResponse(htmlBody) {
    console.log("sending response");
    return htmlBody;
}
chrome.runtime.onMessage.addListener(function(request, sender, sendResponse) {
 sendResponse({dom: document.body.innerHTML});
});

// window.onload = onWindowLoad;

