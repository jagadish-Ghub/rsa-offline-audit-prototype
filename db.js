const db = new Dexie("AuditDB");
db.version(1).stores({
  questions: "id,questionNo,description,result,synced" // blobs stored automatically
});
