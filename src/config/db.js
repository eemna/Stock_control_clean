import {neon} from "@neondatabase/serverless"
import "dotenv/config";
export const sql = neon(process.env.DATABASE_URL);
export async function initDB() {
    try {
         await sql`
      CREATE TABLE IF NOT EXISTS users(
        id SERIAL PRIMARY KEY,
        user_id VARCHAR(255) UNIQUE NOT NULL,
        name VARCHAR(255) NOT NULL,
        role VARCHAR(255) NOT NULL,
        password VARCHAR(255) NOT NULL,
        created_at DATE NOT NULL DEFAULT CURRENT_DATE
      )
    `;

 
    await sql`
    CREATE TABLE IF NOT EXISTS suppliers (
    supplier_id VARCHAR(255) PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    contact VARCHAR(255) NOT NULL,
    website_link VARCHAR(255) NOT NULL,
    created_at DATE DEFAULT CURRENT_DATE
  )
`;

await sql`
  CREATE TABLE IF NOT EXISTS products (
  
    product_id VARCHAR(255) NOT NULL,
    supplier_id VARCHAR(255) NOT NULL REFERENCES suppliers(supplier_id) ON DELETE CASCADE,
    title VARCHAR(255) NOT NULL,
    amount DECIMAL(10,2) NOT NULL, -- prix unitaire
    quantity INTEGER NOT NULL DEFAULT 0,
    PRIMARY KEY (product_id, supplier_id) -- clé composée
  )
`;

await sql`
  CREATE TABLE IF NOT EXISTS transactions(
    id SERIAL PRIMARY KEY,
    product_id VARCHAR(255) NOT NULL,
    supplier_id VARCHAR(255) NOT NULL,
    title VARCHAR(255) NOT NULL,
    amount DECIMAL(10,2) NOT NULL,
    quantity INTEGER NOT NULL,
    created_at DATE NOT NULL DEFAULT CURRENT_DATE,
    user_id VARCHAR(255) REFERENCES users(user_id) ON DELETE CASCADE,
    FOREIGN KEY (product_id, supplier_id) REFERENCES products(product_id, supplier_id) ON DELETE CASCADE
  )
`;

        console.log("Database initialized successfully");
    }catch (error){
          console.log("Error initializing DB", error);
          process.exit(1);
    }
}