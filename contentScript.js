console.log("Content Scrip loading");

// content.js

// Listen for the custom event dispatched from the injected script
document.addEventListener("AngularDataEvent", function (event) {
  // Get the data from the event detail
  const angularData = event.detail;
  console.log("Content script received Angular data:", angularData);

  // Now send the data to the popup or background script
  setTimeout(() => {
    chrome.runtime.sendMessage({ data: `StuId: ${angularData.id}` }, function (response) {
      console.log("Response from popup/background:", response);
    });
    console.log("Waited 5 seconds!");
  }, 5000);
});

// Function to inject the script into the page
function injectScript(filePath) {
  const script = document.createElement("script");
  script.src = chrome.runtime.getURL(filePath);
  script.onload = function () {
    // Remove the script element after it has executed
    this.remove();
  };
  // Append the script to the document to run it in page context
  (document.head || document.documentElement).appendChild(script);
}

// Inject your script (ensure the filename is correct)
injectScript("inject.js");
