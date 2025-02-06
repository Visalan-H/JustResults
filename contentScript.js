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

document.addEventListener("AngularDataEvent", async function (event) {
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
    <style>
        body, h1, h2, h3, table, th, td, p {
            margin: 0;
            padding: 0;
            box-sizing: border-box;
        }

        body {
            display: flex;
            flex-direction: column;
            align-items: center;
            text-align: center;
            font-family: Arial, sans-serif;
            margin: 0;
            padding: 0;
            background-color: #f4f4f9;
        }

        h1 {
            margin: 0;
            color: #333;
        }

        h3 {
            margin: 10px 0;
            color: #555;
        }

        table {
            width: 80%;
            border-collapse: collapse;
            margin-top: 20px;
        }

        thead {
            background-color: #007BFF;
        }

        th, td {
            border: 1px solid #ddd;
            padding: 1%;
        }

        th {
            color: #FFFFFF;
        }

        tr:nth-child(even) td {
            background-color: #E3F2FD;
        }

        tr:nth-child(odd) td {
            background-color: #BBDEFB;
        }

        .gpa-cgpa-container {
            display: flex;
            justify-content: space-between;
            width: 80%;
            margin-top: 20px;
            padding: 0 50px;
        }

        .gpa-cgpa-container h2 {
            color: #333;
        }

        .gpa-cgpa-container p {
            font-size: 14px;
            color: #666;
        }

        #helper {
            position: absolute;
            right: 5px;
            top: 5px;
        }

        /* Responsive Design */
        @media (max-width: 592px) {
            body {
                font-size: 12px;
            }

            table {
                width: 95%;
            }

            th, td {
                padding: 8px 5px;
            }

            .gpa-cgpa-container {
                flex-direction: column;
                align-items: center;
                padding: 0;
            }

            .gpa-cgpa-container h2 {
                font-size: 14px;
                margin-bottom: 10px;
            }

            .gpa-cgpa-container p {
                font-size: 10px;
                text-align: center;
            }

            h1 {
                font-size: 18px;
            }

            h3 {
                font-size: 14px;
            }
        }

        @media (max-width: 380px) {
            body {
                font-size: 12px;
            }

            table, .gpa-cgpa-container {
                width: 100%;
            }

            th, td {
                font-size: 10px;
                padding: 8px 3.5px;
            }

            h1, h3 {
                font-size: 14px;
            }

            .gpa-cgpa-container h2 {
                font-size: 12px;
            }
        }
    </style>
</head>
<body>

    <div style="margin-top: 60px;">
        <h1>${name}</h1>
        <h3><strong>Reg No:</strong> ${regNum}</h3>
        <h3><strong>Course:</strong> ${course}</h3>
    </div>

    <table>
        <thead>
            <tr>
                <th>Subject Name</th>
                <th>Subject Code</th>
                <th>Grade</th>
                <th>Grade Point</th>
                <th>Credits</th>
                <th>Status</th>
            </tr>
        </thead>
        <tbody>
            ${tableData.map(exam =>`
              <tr>
                <td>${exam.subjectName}</td>
                <td>${exam.subjectCode}</td>
                <td>${exam.grade}</td>
                <td>${exam.gradePoint}</td>
                <td>${exam.credits}</td>
                <td>${exam.status}</td>
              </tr>`
            ).join('')}
        </tbody>
    </table>

    <div class="gpa-cgpa-container">
        <h2>GPA: ${GPA}</h2>
        <p>Please visit the official site with the extension turned off later to confirm. We could make mistakes.</p>
        <h2>CGPA: ${CGPA}</h2>
    </div>
    <p id="helper">Made by Robi and Vizz.</p>
</body>
</html>
`
    const blob = new Blob([myHtml], { type: "text/html" });
    const link = document.createElement('a');
    link.href = URL.createObjectURL(blob);
    link.download = `${regNum}.html`;
    link.click();

    setTimeout(() => {
      chrome.runtime.sendMessage({ action: "closeCurrentTab" }, (response) => {
        console.log("Background response:", response);
      });
    }, 10);

  } catch (error) {
    console.error("Error during fetch or download:", error);
  }
});

function injectScript(filePath) {
  const script = document.createElement("script");
  script.src = chrome.runtime.getURL(filePath);
  script.onload = function () {
    this.remove();
  };
  (document.head || document.documentElement).appendChild(script);
}

injectScript("inject.js");
