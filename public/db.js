const db = new Dexie("AuditDB");
db.version(1).stores({
  questions: "questionNo,description,result"
});
