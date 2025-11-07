import { sql } from "../config/db.js";

export async function getTransactionsByProductrId(req, res ){
   
        try {
            const { product_id } = req.params;
            const transactions = await sql ` 
            SELECT * FROM transactions WHERE product_id = ${product_id} ORDER BY created_at DESC
            `;
            res.status(200).json(transactions);
        }catch (error) { console.log("Error getting the transaction", error);
            res.status(500).json({message: "Internal server error"});
        
    
        }
    
}
export async function getALLProductr(req, res ){
   
       try {
    const produits = await sql`SELECT * FROM transactions ORDER BY created_at DESC`;
    res.status(200).json(produits);
  } catch (error) {
    console.error("Error fetching products:", error);
    res.status(500).json({ message: "Internal server error" });
  }
    
}
export async function getSummaryByUserId(req, res) {
  try {
    const {user_id } = req.params;

    const balanceResult = await sql`
      SELECT COALESCE(SUM(amount * quantity), 0) as balance FROM transactions WHERE user_id = ${user_id}
    `;

    const incomeResult = await sql`
      SELECT COALESCE(SUM(amount * quantity), 0) as income FROM transactions
      WHERE user_id = ${user_id} AND amount > 0
    `;

    const expensesResult = await sql`
      SELECT COALESCE(SUM(amount * quantity), 0) as expenses FROM transactions
      WHERE user_id = ${user_id} AND amount < 0
    `;

    res.status(200).json({
      balance: balanceResult[0].balance,
      income: incomeResult[0].income,
      expenses: expensesResult[0].expenses,
    });
  } catch (error) {
    console.log("Error getting the summary", error);
    res.status(500).json({ message: "Internal server error" });
  }
}
export async function deleteTransaction(req, res) {
  const { id } = req.params;

  try {
    const result = await sql`
      DELETE FROM transactions 
      WHERE id = ${id}
      RETURNING *;
    `;

    if (result.length === 0) {
      return res.status(404).json({ message: "Transaction not found" });
    }

    res.status(200).json({ message: "Transaction deleted successfully" });
  } catch (error) {
    console.error("Error deleting transaction:", error);
    res.status(500).json({ message: "Internal server error" });
  }
}