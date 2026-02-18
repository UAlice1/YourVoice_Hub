const { pool } = require("../config/db");

const NgoOrganization = {
  // ── Find by user ID ───────────────────────────────────────────────────────────
  async findByUserId(userId) {
    const [rows] = await pool.query(
      "SELECT * FROM ngo_organizations WHERE user_id = ?",
      [userId]
    );
    return rows[0] || null;
  },

  // ── Upsert (create or update) ─────────────────────────────────────────────────
  async upsert(userId, { orgName, description, contactEmail, contactPhone, location }) {
    const existing = await NgoOrganization.findByUserId(userId);
    if (existing) {
      await pool.query(
        `UPDATE ngo_organizations
         SET org_name      = COALESCE(?, org_name),
             description   = COALESCE(?, description),
             contact_email = COALESCE(?, contact_email),
             contact_phone = COALESCE(?, contact_phone),
             location      = COALESCE(?, location)
         WHERE user_id = ?`,
        [orgName, description, contactEmail, contactPhone, location, userId]
      );
    } else {
      await pool.query(
        `INSERT INTO ngo_organizations
           (user_id, org_name, description, contact_email, contact_phone, location)
         VALUES (?, ?, ?, ?, ?, ?)`,
        [userId, orgName, description, contactEmail, contactPhone, location]
      );
    }
    return NgoOrganization.findByUserId(userId);
  },

  // ── Verify / unverify an NGO (admin action) ───────────────────────────────────
  async setVerified(userId, isVerified) {
    await pool.query(
      "UPDATE ngo_organizations SET is_verified = ? WHERE user_id = ?",
      [isVerified ? 1 : 0, userId]
    );
  },
};

module.exports = NgoOrganization;