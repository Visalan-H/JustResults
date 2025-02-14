chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
    if (message.action === "closeCurrentTab") {
        chrome.tabs.create({ url: "chrome://downloads/" });
        if (sender.tab && sender.tab.id) {
            chrome.tabs.remove(sender.tab.id, () => {
                sendResponse({ status: "Tab closed" });
            });
            return true;
        } else {
            sendResponse({ status: "No tab id found" });
        }
    }
});
