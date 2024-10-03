chrome.extension.onRequest.addListener(function(request, sender, sendResponse) {
 sendResponse({dom: document.body.innerHTML});
});

window.onload = onWindowLoad;

function sendResponse(htmlBody) {
    return htmlBody;
}
function DOMtoString(selector) {
    if (selector) {
        selector = document.querySelector(selector);
        if (!selector) return "ERROR: querySelector failed to find node"
    } else {
        selector = document.documentElement;
    }
    return selector.outerHTML;
};
