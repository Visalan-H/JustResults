console.log("Content Scrip loading");

async function getFinalResult(studId, inId) {
  const url =
    "https://www.mycamu.co.in/api/ExamResult/get-final-result-by-student";
  const body = {
    studId: studId,
    InId: inId,
    lastReslt: true,
    vwStus: "shwHdr",
  };

  try {
    const response = await fetch(url, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(body),
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

  const firstResponse = await getFinalResult(
    angularData.stuId,
    angularData.inId,
  );

  if (!firstResponse) {
    console.error("Failed to fetch initial student result.");
    return;
  }
  semData = firstResponse.output.data.aFinalData[0];

  const url =
    "https://www.mycamu.co.in/api/ExamResult/get-final-result-by-student";

  // Create the request payload
  const requestData = {
    studId: angularData.stuId,
    InId: angularData.inId,
    lastReslt: true,
    vwStus: "vw",
    //planID: "28d6f9d0edfd7d081b59e946",
    semId: semData.SemID,
    exmMonth: semData.ExMnth,
  };

  try {
    const response = await fetch(url, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(requestData)
    });
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    const result = await response.json();

    // const result = JSON.stringify(data, null, 2);
    const examList = result.output.data.aFinalData[0].exmLst

    const tableData = examList.map(exam => ({
      subjectName: exam.exmNm,
      subjectCode: exam.exmCd,
      grade: exam.grd,
      gradePoint: exam.grdPnt,
      credits: exam.crdt,
      status: exam.status
    }))

    const name = result.output.data.aFinalData[0].studNm;
    const regNum = result.output.data.aFinalData[0].AplnNum;
    const course = result.output.data.aFinalData[0].courseNm;
    const GPA = result.output.data.aFinalData[0].GPA;
    const CGPA = result.output.data.aFinalData[0].CGPA;
    const myHtml = `<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Result of ${name}</title>
</head>
<body style="display: flex; flex-direction: column; align-items: center; text-align: center; font-family: Arial, sans-serif; margin: 0; padding: 0;">

    <div style="margin-top: 60px;">
        <h1>${name}</h1>
        <h3><strong>Reg No:</strong> ${regNum}</h3>
        <h3><strong>Course:</strong> ${course}</h3>
    </div>

    <table style="width: 80%; border-collapse: collapse; margin-top: 20px;">
        <thead>
            <tr style="background: #007BFF;">
                <th style="border: 1px solid #ddd; padding: 10px; color:#FFFFFF;">Subject Name</th>
                <th style="border: 1px solid #ddd; padding: 10px; color:#FFFFFF;">Subject Code</th>
                <th style="border: 1px solid #ddd; padding: 10px; color:#FFFFFF;">Grade</th>
                <th style="border: 1px solid #ddd; padding: 10px; color:#FFFFFF;">Grade Point</th>
                <th style="border: 1px solid #ddd; padding: 10px; color:#FFFFFF;">Credits</th>
                <th style="border: 1px solid #ddd; padding: 10px; color:#FFFFFF;">Status</th>
            </tr>
        </thead>
        <tbody>
            ${tableData.map(exam => `
            <tr>
                <td style="border: 1px solid #ddd; padding: 10px; background-color:#E3F2FD">${exam.subjectName}</td>
                <td style="border: 1px solid #ddd; padding: 10px; background-color:#BBDEFB">${exam.subjectCode}</td>
                <td style="border: 1px solid #ddd; padding: 10px; background-color:#E3F2FD">${exam.grade}</td>
                <td style="border: 1px solid #ddd; padding: 10px; background-color:#BBDEFB">${exam.gradePoint}</td>
                <td style="border: 1px solid #ddd; padding: 10px; background-color:#E3F2FD">${exam.credits}</td>
                <td style="border: 1px solid #ddd; padding: 10px; background-color:#BBDEFB">${exam.status}</td>
            </tr>
            `).join('')}
        </tbody>
    </table>
    <div style="display: flex; width:80%; justify-content: space-between; margin-top: 20px; padding: 0 50px;">
    <h2 style="color: #333;">GPA: ${GPA}</h2>
    <p>Please visit the official site with the extension turned off later to confirm.We could make mistakes.
    <h2 style="color: #333; text-align: right;">CGPA: ${CGPA}</h2>
    </div>
</body>
</html>
`
//THIS WE COULD USE BUT I THINK ILL STYLE IT BETTER
      // < tr >
      //         <td style="border: 1px solid #ddd; padding: 10px; background-color:#E3F2FD">CGPA</td>
      //         <td style="border: 1px solid #ddd; padding: 10px; background-color:#BBDEFB">${CGPA}</td>
      //         <td style="border: 1px solid #ddd; padding: 10px; background-color:#E3F2FD" colspan="4">GPA</td>
      //         <td style="border: 1px solid #ddd; padding: 10px; background-color:#BBDEFB" colspan="2">${GPA}</td>
      //       </tr >

    // Create a Blob and trigger the download
    const blob = new Blob([myHtml], { type: "text/html" });
    const link = document.createElement('a');
    link.href = URL.createObjectURL(blob);
    link.download = `${regNum}.html`;
    link.click();

    setTimeout(() => {
      chrome.runtime.sendMessage({ action: "closeCurrentTab" }, (response) => {
        console.log("Background response:", response);
      });
    }, 1000);

  } catch (error) {
    console.error("Error during fetch or download:", error);
  }
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
