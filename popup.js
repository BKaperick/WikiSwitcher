function sendResponse(htmlBody) {
    console.log("sending response");
    return htmlBody;
}
chrome.runtime.onMessage.addListener(function(request, sender, sendResponse) {
 sendResponse({dom: document.body.innerHTML});
});

// window.onload = onWindowLoad;

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
