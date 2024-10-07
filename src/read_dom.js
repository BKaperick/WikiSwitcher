chrome.extension.onRequest.addListener(function(request, sender, sendResponse) {
 if (request.action == "getDOM")
   sendResponse({dom: document.body.innerHTML});
 else
   sendResponse({}); // Send nothing..
});

chrome.tabs.query({}, (tabs) => {
        var activeTab = tabs[0];
        var activeTabId = activeTab.id;

        return chrome.scripting.executeScript({
            target: { tabId: activeTabId },
            // injectImmediately: true,  // uncomment this to make it execute straight away, other wise it will wait for document_idle
            func: DOMtoString,
            // args: ['body']  // you can use this to target what element to get the html for
        });

    }).then(function (results) {
        message.innerText = results[0].result;
    }).catch(function (error) {
        message.innerText = 'There was an error injecting script : \n' + error.message;
    });

  const tabsList = document.createElement('ul');
  const tabsList = document.createElement('ul');

  for (let tab of tabs) {
    const listItem = document.createElement('li');
    listItem.innerText = tab.title;
    tabsList.append(listItem);
  }

  document.body.append(tabsList);
});

window.onload = onWindowLoad;

function DOMtoString(selector) {
    if (selector) {
        selector = document.querySelector(selector);
        if (!selector) return "ERROR: querySelector failed to find node"
    } else {
        selector = document.documentElement;
    }
    return selector.outerHTML;
};
