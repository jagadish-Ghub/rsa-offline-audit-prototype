const db = new Dexie("RSA_Audit_DB");

db.version(1).stores({
    audits: "++id, auditNo, status"
});
