console.log("Content Scrip loading");

async function getFinalResult(studId, inId) {
    const url = "https://www.mycamu.co.in/api/ExamResult/get-final-result-by-student";
    const body = {
        "studId": studId,
        "InId": inId,
        "lastReslt": true,
        "vwStus": "shwHdr"
    };

    try {
        const response = await fetch(url, {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify(body)
        });

        if (!response.ok) {
            throw new Error(`HTTP error! Status: ${response.status}`);
        }

        return await response.json();
    } catch (error) {
        console.error("Error fetching the final result:", error);
        return null;
    }
}

// Listen for the custom event dispatched from the injected script
document.addEventListener("AngularDataEvent", async function (event) {
  // Get the data from the event detail
  const angularData = event.detail;
  console.log("Content script received Angular data:", angularData);

    const firstResponse = await getFinalResult(angularData.stuId, angularData.inId);

    if (!firstResponse) {
        console.error("Failed to fetch initial student result.");
        return;
    }
    semData = firstResponse.output.data.aFinalData[0];

const url = "https://www.mycamu.co.in/api/ExamResult/get-final-result-by-student";

// Create the request payload
const requestData = {
  studId: angularData.stuId,
  InId: angularData.inId,
  lastReslt: true,
  vwStus: "vw",
  //planID: "28d6f9d0edfd7d081b59e946",
  semId: semData.SemID,
  exmMonth: semData.ExMnth
};

fetch(url, {
  method: "POST",
  headers: {
    "Content-Type": "application/json"
  },
  body: JSON.stringify(requestData)
})
  .then(response => {
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    return response.json();
  })
  .then(data => {
    // Convert the JSON data into a string
    const jsonString = JSON.stringify(data, null, 2); // The 'null, 2' makes it nicely formatted

    // Create a Blob from the JSON string
    const blob = new Blob([jsonString], { type: "application/json" });
    const link = document.createElement('a');
    link.href = URL.createObjectURL(blob);
    link.download = `result.html`;
    link.click();
  })
  .catch(error => {
    console.error("Error during fetch or download:", error);
  });
  // Now send the data to the popup or background script
  setTimeout(() => {
    chrome.runtime.sendMessage({ data: `StuId: ${angularData.stuId}` }, function (response) {
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
