// Detect mobile/web
const isMobile = /Android|iPhone|iPad/i.test(navigator.userAgent);
document.getElementById("modeIndicator").innerHTML =
  isMobile ? "📱 Mobile Mode" : "🖥️ Web Mode";

// Convert file → Base64
function fileToBase64(file) {
  return new Promise((resolve) => {
    if (!file) return resolve(null);

    const reader = new FileReader();
    reader.onloadend = () => resolve(reader.result);
    reader.readAsDataURL(file);
  });
}

document.getElementById("auditForm").addEventListener("submit", async (e) => {
  e.preventDefault();

  const auditNo = document.getElementById("auditNo").value;
  const qno = document.getElementById("qno").value;
  const desc = document.getElementById("desc").value;
  const result = document.getElementById("result").value;

  const photo1 = await fileToBase64(document.getElementById("photo1").files[0]);
  const photo2 = await fileToBase64(document.getElementById("photo2").files[0]);
  const doc = await fileToBase64(document.getElementById("doc").files[0]);

  await db.audits.add({
    auditNo,
    qno,
    desc,
    result,
    photo1,
    photo2,
    doc,
    status: "Pending"
  });

  window.location.href = "report.html";
});
