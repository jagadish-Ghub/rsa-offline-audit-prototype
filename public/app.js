const { useState, useEffect } = React;

function App() {
  const [user, setUser] = useState(null);
  const [questions, setQuestions] = useState([]);
  const [online, setOnline] = useState(navigator.onLine);

  useEffect(() => {
    window.addEventListener("online", () => setOnline(true));
    window.addEventListener("offline", () => setOnline(false));
    initZoho();
  }, []);

  async function initZoho() {
    try {
      const res = await Zoho.CREATOR.init();
      setUser(res.user);
      if (navigator.onLine) fetchQuestions();
      else loadCachedQuestions();
    } catch (err) {
      console.error("Zoho init failed", err);
    }
  }

  async function fetchQuestions() {
    const res = await Zoho.CREATOR.API.getAllRecords({
      reportName: "DH_Question_Report"
    });

    const records = res.data.map(r => ({
      questionNo: r.Question_No,
      description: r.Description,
      result: ""
    }));

    setQuestions(records);
    await db.questions.clear();
    await db.questions.bulkAdd(records);
  }

  async function loadCachedQuestions() {
    const cached = await db.questions.toArray();
    setQuestions(cached);
  }

  async function updateResult(index, value) {
    const updated = [...questions];
    updated[index].result = value;
    setQuestions(updated);
    await db.questions.put(updated[index]);
  }

  async function syncNow() {
    if (!navigator.onLine) return alert("Offline!");
    const unsynced = await db.questions.toArray();
    for (const q of unsynced) {
      await Zoho.CREATOR.API.addRecord({
        formName: "Audit_Form",
        data: {
          Question_No: q.questionNo,
          Result: q.result
        }
      });
    }
    alert("Synced to Zoho!");
  }

  return React.createElement(
    "div",
    { style: { padding: "20px", fontFamily: "sans-serif" } },
    React.createElement("h2", null, "Offline Audit Prototype"),
    React.createElement("p", null, `User: ${user ? user.first_name : "..."}`),
    React.createElement("p", null, `Status: ${online ? "🟢 Online" : "🔴 Offline"}`),
    ...questions.map((q, i) =>
      React.createElement(
        "div",
        {
          key: i,
          style: { border: "1px solid #ccc", margin: "10px 0", padding: "10px" }
        },
        React.createElement("p", null, `${q.questionNo}: ${q.description}`),
        React.createElement(
          "select",
          {
            value: q.result,
            onChange: e => updateResult(i, e.target.value)
          },
          React.createElement("option", { value: "" }, "Select"),
          React.createElement("option", { value: "Yes" }, "Yes"),
          React.createElement("option", { value: "No" }, "No"),
          React.createElement("option", { value: "NA" }, "NA")
        )
      )
    ),
    React.createElement(
      "button",
      { onClick: syncNow, style: { marginTop: "10px" } },
      "Sync Now"
    )
  );
}

ReactDOM.render(React.createElement(App), document.getElementById("root"));
