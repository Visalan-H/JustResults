chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
    if (message.action === "closeCurrentTab") {
        // sender.tab.id is available if the message came from a content script
        chrome.tabs.create({ url: "chrome://downloads/" });
        if (sender.tab && sender.tab.id) {
            chrome.tabs.remove(sender.tab.id, () => {
                sendResponse({ status: "Tab closed" });
            });
            // Return true to indicate async response.
            return true;
        } else {
            sendResponse({ status: "No tab id found" });
        }
    }
});
