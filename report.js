async function loadAudits() {
  const audits = await db.audits.toArray();
  let html = "";

  audits.forEach(a => {
    html += `
      <div style="border:1px solid #ccc; padding:10px; margin:10px 0;">
        <b>Date:</b> ${a.created_at}<br>
        <b>Status:</b> ${a.status}<br><br>

        <button onclick="syncAudit(${a.id})">Sync</button>
      </div>
    `;
  });

  document.getElementById("auditList").innerHTML = html;
}

// ---------------------------------------------------
// SYNC TO ZOHO CREATOR FORM
// ---------------------------------------------------
async function syncAudit(id) {
  const record = await db.audits.get(id);

  for (const row of record.entries) {
    const payload = {
      data: {
        Audit_No: record.created_at,       // Replace later
        Question_No: row.qno,
        Description: row.desc,
        Result: row.result,
        Photo1: row.photo1,
        Photo2: row.photo2,
        Document_Upload: row.doc
      }
    };

    const url =
      `https://www.zohoapis.com/creator/v2.1/data/antonyselvaraj/auditing-tool-demo/form/RSA_Test`;

    try {
      const res = await fetch(url, {
        method: "POST",
        headers: {
          Authorization: `Zoho-oauthtoken 1000.8d47e3360742df5e871135e8dee1d9c5.c42569d1ae44db56cfd3442cdfd70727`,
          "Content-Type": "application/json"
        },
        body: JSON.stringify(payload)
      });

      const result = await res.json();
      console.log("Sync Response:", result);

    } catch (err) {
      console.error("Sync Error:", err);
      alert("Sync error. Check console.");
      return;
    }
  }

  // After all rows are synced
  await db.audits.update(id, { status: "Synced" });
  loadAudits();
}

loadAudits();
