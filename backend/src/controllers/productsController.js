import { sql } from "../config/db.js";

export async function createProduct(req, res) {
  try {
    const { title, amount, product_id, user_id, quantity, supplier_id } = req.body;

    if (!product_id || !user_id || !supplier_id || amount === undefined || quantity === undefined) {
      return res.status(400).json({ message: "All fields are required" });
    }

    if (isNaN(quantity) || quantity <= 0) {
      return res.status(400).json({ message: "Quantity must be a positive number" });
    }

    const existingProduct = await sql`
      SELECT * FROM products WHERE product_id = ${product_id} AND supplier_id = ${supplier_id}
    `;

    const isSale = amount < 0; // si amount négatif → vente
    const qty = Math.abs(quantity); // s'assure que c'est positif

    if (existingProduct.length > 0) {
      if (isSale) {
        // vente → soustraire qty
        await sql`
          UPDATE products
          SET quantity = quantity - ${qty}
          WHERE product_id = ${product_id} AND supplier_id = ${supplier_id}
        `;
      } else {
        // achat → ajouter qty
        await sql`
          UPDATE products
          SET quantity = quantity + ${qty}
          WHERE product_id = ${product_id} AND supplier_id = ${supplier_id}
        `;
      }
    } else {
      // Nouveau produit → créer avec quantité initiale
      await sql`
        INSERT INTO products (product_id, title, amount, quantity, supplier_id)
        VALUES (${product_id}, ${title}, ${amount}, ${qty}, ${supplier_id})
      `;
    }

    // Enregistrer la transaction dans la table `transactions`
    const transaction = await sql`
      INSERT INTO transactions (product_id, title, amount, user_id, quantity, supplier_id)
      VALUES (${product_id}, ${title}, ${amount}, ${user_id}, ${qty}, ${supplier_id})
      RETURNING *
    `;

    console.log(" Transaction saved:", transaction[0]);
    res.status(201).json(transaction[0]);

  } catch (error) {
    console.error("❌ Error while creating:", error);
    res.status(500).json({ message: error.message });
  }
}
export async function getAllProducts(req, res) {
  try {
    const products = await sql`SELECT * FROM products ORDER BY product_id DESC`;
    res.json(products);
  } catch (error) {
    console.error(" Error fetching products:", error);
    res.status(500).json({ message: "Internal server error" });
  }
}

export async function getProducts(req, res) {
  const { product_id, supplier_id } = req.params;

  try {
    const product = await sql`
      SELECT * FROM products 
      WHERE product_id = ${product_id} AND supplier_id = ${supplier_id}
    `;

    if (product.length === 0) {
      return res.status(404).json({ message: "Product not found" });
    }

    res.json(product[0]);
  } catch (error) {
    console.error(" Error retrieving product:", error);
    res.status(500).json({ message: "Internal server error" });
  }
}




export async function deleteProducts(req, res) {
  const { product_id } = req.params;
  const { supplier_id } = req.query; 
  
  try {
    // Vérifie que supplier_id est fourni
    if (!supplier_id) {
      return res.status(400).json({ error: "supplier_id is required" });
    }

    // Supprime le produit avec la clé composée
    await sql`
      DELETE FROM products 
      WHERE product_id = ${product_id} AND supplier_id = ${supplier_id};
    `;

    res.json({ message: "Product deleted successfully" });
  } catch (error) {
    console.error("Error deleting product:", error);
    res.status(500).json({ error: "Internal server error while deleting product" });
  }
}




export async function updateProducts(req, res) {
  const { product_id, supplier_id } = req.params;
  const { title, amount, quantity } = req.body;

  try {
    // Vérifier si le produit existe
    const existing = await sql`
      SELECT * FROM products
      WHERE product_id = ${product_id} AND supplier_id = ${supplier_id}
    `;

    if (existing.length === 0) {
      return res.status(404).json({ message: "Product not found" });
    }

    // Mettre à jour le produit
    const updated = await sql`
      UPDATE products
      SET title = ${title}, amount = ${amount}, quantity = ${quantity}
      WHERE product_id = ${product_id} AND supplier_id = ${supplier_id}
      RETURNING *
    `;

    res.json({ message: "Product updated successfully", product: updated[0] });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
}
