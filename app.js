const { useState, useEffect } = React;

const SAMPLE_DATA = [
  {
    id: 1,
    questionNo: "DH-001",
    description: "Are fire extinguishers available at designated locations?",
    result: "",
    photo1: null,
    photo2: null,
    document: null,
    synced: false
  },
  {
    id: 2,
    questionNo: "DH-002",
    description: "Is emergency exit signage clearly visible?",
    result: "",
    photo1: null,
    photo2: null,
    document: null,
    synced: false
  },
  {
    id: 3,
    questionNo: "EHS-101",
    description: "Are PPE items worn by all employees in hazardous zones?",
    result: "",
    photo1: null,
    photo2: null,
    document: null,
    synced: false
  }
];

function App() {
  const [records, setRecords] = useState([]);
  const [online, setOnline] = useState(navigator.onLine);

  useEffect(() => {
    window.addEventListener("online", () => setOnline(true));
    window.addEventListener("offline", () => setOnline(false));

    // load sample data directly
    setRecords(SAMPLE_DATA);
  }, []);

  function updateField(index, field, value) {
    const updated = [...records];
    updated[index][field] = value;
    updated[index].synced = false;
    setRecords(updated);
  }

  function simulateSync() {
    alert("Simulated sync: All unsynced items marked as synced");
    const updated = records.map(r => ({ ...r, synced: true }));
    setRecords(updated);
  }

  return React.createElement(
    "div",
    { style: { padding: "20px", fontFamily: "Arial" } },

    React.createElement("h2", null, "Prototype Offline Audit (Sample Data)"),
    React.createElement("p", null, online ? "🟢 Online" : "🔴 Offline"),

    ...records.map((q, i) =>
      React.createElement(
        "div",
        {
          key: i,
          style: {
            border: "1px solid #ccc",
            padding: "10px",
            margin: "10px 0",
            borderRadius: "8px"
          }
        },

        React.createElement("h3", null, `${q.questionNo}`),
        React.createElement("p", null, q.description),

        React.createElement(
          "label",
          null,
          "Result:",
          React.createElement(
            "select",
            {
              value: q.result,
              onChange: e => updateField(i, "result", e.target.value),
              style: { marginLeft: "10px" }
            },
            React.createElement("option", { value: "" }, "Select"),
            React.createElement("option", { value: "Yes" }, "Yes"),
            React.createElement("option", { value: "No" }, "No"),
            React.createElement("option", { value: "NA" }, "NA")
          )
        ),

        React.createElement("p", { style: { marginTop: "10px" } }, "Photo 1:"),
        React.createElement("input", {
          type: "file",
          accept: "image/*",
          capture: "camera",
          onChange: e => updateField(i, "photo1", e.target.files[0])
        }),

        React.createElement("p", null, "Photo 2:"),
        React.createElement("input", {
          type: "file",
          accept: "image/*",
          capture: "camera",
          onChange: e => updateField(i, "photo2", e.target.files[0])
        }),

        React.createElement("p", null, "Document Upload:"),
        React.createElement("input", {
          type: "file",
          onChange: e => updateField(i, "document", e.target.files[0])
        }),

        !q.synced &&
          React.createElement(
            "p",
            { style: { color: "red", marginTop: "8px" } },
            "Pending Sync"
          )
      )
    ),

    React.createElement(
      "button",
      {
        onClick: simulateSync,
        style: {
          padding: "10px 20px",
          marginTop: "15px",
          background: "#007bff",
          color: "white",
          border: "none",
          borderRadius: "5px",
          cursor: "pointer"
        }
      },
      "Simulate Sync"
    )
  );
}

ReactDOM.render(React.createElement(App), document.getElementById("root"));
