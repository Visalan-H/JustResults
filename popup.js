console.log("Script loading");

chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
  if (request.data) {
    // For example, display the message in an element with id "message"
    document.getElementById("message").innerText = request.data;
    console.log("Popup received message:", request.data);

    // Optionally send a response back
    sendResponse("Message received in popup!");
  }
});
