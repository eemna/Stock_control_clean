import { sql } from "../config/db.js";

export async function createSupplier(req, res) {
  try {
    const { supplier_id, name, contact, website_link } = req.body;

    if (!supplier_id || !name || !contact || !website_link) {
      return res.status(400).json({ message: "All fields are required" });
    }

    const existing = await sql`
      SELECT * FROM suppliers WHERE supplier_id = ${supplier_id}
    `;

    if (existing.length > 0) {
      return res.status(400).json({ message: "⚠️ Supplier already exists with this ID" });
    }

    const result = await sql`
      INSERT INTO suppliers (supplier_id, name, contact, website_link)
      VALUES (${supplier_id}, ${name}, ${contact}, ${website_link})
      RETURNING *
    `;

    res.status(201).json(result[0]);
  } catch (error) {
    console.error("❌ Error creating supplier:", error);
    res.status(500).json({ message: "Internal server error" });
  }
}

export async function getSupplier(req, res) {
  try {
    const suppliers = await sql`
      SELECT * FROM suppliers ORDER BY supplier_id DESC
    `;

    res.json(suppliers);
  } catch (error) {
    console.error("❌ Error fetching suppliers:", error);
    res.status(500).json({ message: "Internal server error" });
  }
}

export async function deleteSupplier(req, res) {
  const { supplier_id } = req.params;

  try {
    await sql`
      DELETE FROM suppliers WHERE supplier_id = ${supplier_id}
    `;

    res.json({ message: "✅ Supplier deleted successfully" });
  } catch (error) {
    console.error("❌ Error deleting supplier:", error);
    res.status(500).json({ error: "Internal server error" });
  }
}

export async function updateSupplier(req, res) {
  const { supplier_id } = req.params;
  const { name, contact, website_link } = req.body;

  try {
    await sql`
      UPDATE suppliers
      SET 
        name = ${name},
        contact = ${contact},
        website_link = ${website_link}
      WHERE supplier_id = ${supplier_id}
    `;

    res.json({ message: "✅ Supplier updated successfully" });
  } catch (error) {
    console.error("❌ Error updating supplier:", error);
    res.status(500).json({ error: "Internal server error during update" });
  }
}
