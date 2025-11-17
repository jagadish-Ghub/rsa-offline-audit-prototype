// Detect mode
const isMobile = /Android|iPhone|iPad/i.test(navigator.userAgent);
document.getElementById("modeIndicator").innerHTML =
  isMobile ? "📱 Mobile Mode" : "🖥️ Web Mode";

// Convert file -> base64
function fileToBase64(file) {
  return new Promise((resolve) => {
    if (!file) return resolve(null);
    const r = new FileReader();
    r.onloadend = () => resolve(r.result);
    r.readAsDataURL(file);
  });
}

// ---------------------------------------------
// FETCH QUESTIONS FROM ZOHO REPORT
// ---------------------------------------------
async function loadQuestions() {
  const container = document.getElementById("questionContainer");
  container.innerHTML = "Loading questions...";

  const url =
    `https://www.zohoapis.com/creator/v2.1/data/antonyselvaraj/auditing-tool-demo/report/RSA_Test_Report`;

  try {
    const res = await fetch(url, {
      method: "GET",
      headers: {
        Authorization: `Zoho-oauthtoken 1000.8d47e3360742df5e871135e8dee1d9c5.c42569d1ae44db56cfd3442cdfd70727`
      }
    });

    const data = await res.json();
    console.log("Report Data: ", data);

    container.innerHTML = "";

    data.data.forEach((row, index) => {
      container.innerHTML += `
        <div style="border:1px solid #ccc; padding:10px; margin:10px 0;">
          <b>Q${index + 1}</b><br>

          <label>Question No</label><br>
          <input type="text" class="qno" value="${row.Question_No || ""}"><br><br>

          <label>Description</label><br>
          <textarea class="desc">${row.Description || ""}</textarea><br><br>

          <label>Result</label><br>
          <select class="result">
            <option value="Yes">Yes</option>
            <option value="No">No</option>
            <option value="NA">NA</option>
          </select><br><br>

          <label>Photo 1:</label><br>
          <input type="file" class="photo1" accept="image/*" capture="environment"><br><br>

          <label>Photo 2:</label><br>
          <input type="file" class="photo2" accept="image/*" capture="environment"><br><br>

          <label>Document:</label><br>
          <input type="file" class="doc"><br><br>
        </div>
      `;
    });

  } catch (err) {
    console.error("Fetch error:", err);
    container.innerHTML = "Error loading questions.";
  }
}

// ---------------------------------------------
// SUBMIT AUDIT TO INDEXEDDB
// ---------------------------------------------
async function submitAudit() {
  const questions = document.querySelectorAll("#questionContainer > div");

  let finalSubmission = [];

  for (const q of questions) {
    const qno = q.querySelector(".qno").value;
    const desc = q.querySelector(".desc").value;
    const result = q.querySelector(".result").value;

    const photo1File = q.querySelector(".photo1").files[0];
    const photo2File = q.querySelector(".photo2").files[0];
    const docFile = q.querySelector(".doc").files[0];

    const photo1 = await fileToBase64(photo1File);
    const photo2 = await fileToBase64(photo2File);
    const doc = await fileToBase64(docFile);

    finalSubmission.push({
      qno, desc, result, photo1, photo2, doc, status: "Pending"
    });
  }

  await db.audits.add({
    created_at: new Date().toISOString(),
    entries: finalSubmission,
    status: "Pending"
  });

  window.location.href = "report.html";
}
