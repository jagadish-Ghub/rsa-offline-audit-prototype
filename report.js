async function loadAudits() {
  const audits = await db.audits.toArray();

  let html = "";

  audits.forEach(a => {
    html += `
      <div style="border:1px solid #ccc; padding:10px; margin-bottom:10px;">
        <b>Audit No:</b> ${a.auditNo}<br>
        <b>Status:</b> ${a.status}<br><br>
        <button onclick="syncRecord(${a.id})">Sync</button>
      </div>
    `;
  });

  document.getElementById("auditList").innerHTML = html;
}

async function syncRecord(id) {
  // Later replace with Zoho API call
  await db.audits.update(id, { status: "Synced" });
  loadAudits();
}

loadAudits();
