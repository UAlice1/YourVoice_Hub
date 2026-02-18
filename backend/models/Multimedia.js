const { pool } = require("../config/db");
const { v4: uuidv4 } = require("uuid");

const Multimedia = {
  // ── Create one file record ────────────────────────────────────────────────────
  async create({ caseId, fileType, fileName, filePath, fileSize, mimeType }) {
    const uuid = uuidv4();
    const [result] = await pool.query(
      `INSERT INTO multimedia (uuid, case_id, file_type, file_name, file_path, file_size, mime_type)
       VALUES (?, ?, ?, ?, ?, ?, ?)`,
      [uuid, caseId, fileType, fileName, filePath, fileSize, mimeType]
    );
    return { id: result.insertId, uuid, fileType, fileName };
  },

  // ── Bulk create from multer file array ────────────────────────────────────────
  async bulkCreate(caseId, files) {
    const saved = [];
    for (const file of files) {
      const fileType = Multimedia.getCategory(file.mimetype);
      const relativePath = `uploads/cases/${file.filename}`;
      const record = await Multimedia.create({
        caseId,
        fileType,
        fileName: file.originalname,
        filePath: relativePath,
        fileSize: file.size,
        mimeType: file.mimetype,
      });
      saved.push(record);
    }
    return saved;
  },

  // ── Find all files for a case ─────────────────────────────────────────────────
  async findByCaseId(caseId) {
    const [rows] = await pool.query(
      `SELECT uuid, file_type, file_name, file_path, file_size, mime_type, date_uploaded
       FROM multimedia WHERE case_id = ?`,
      [caseId]
    );
    return rows;
  },

  // ── Find by UUID ─────────────────────────────────────────────────────────────
  async findByUuid(uuid) {
    const [rows] = await pool.query(
      "SELECT * FROM multimedia WHERE uuid = ?",
      [uuid]
    );
    return rows[0] || null;
  },

  // ── Count files for a case ────────────────────────────────────────────────────
  async countByCaseId(caseId) {
    const [[row]] = await pool.query(
      "SELECT COUNT(*) AS count FROM multimedia WHERE case_id = ?",
      [caseId]
    );
    return row.count;
  },

  // ── Delete ────────────────────────────────────────────────────────────────────
  async delete(uuid) {
    const [result] = await pool.query("DELETE FROM multimedia WHERE uuid = ?", [uuid]);
    return result.affectedRows > 0;
  },

  // ── Helper: categorise MIME type ──────────────────────────────────────────────
  getCategory(mimetype) {
    if (mimetype.startsWith("image/")) return "image";
    if (mimetype.startsWith("audio/")) return "audio";
    if (mimetype.startsWith("video/")) return "video";
    return "document";
  },
};

module.exports = Multimedia;