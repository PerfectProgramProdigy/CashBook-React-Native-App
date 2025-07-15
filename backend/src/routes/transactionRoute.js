import express from "express";
import { sql } from "../config/db.js";

const router = express.Router();

router.get("/:userID", async (req, res) => {
  try {
    const { userID } = req.params;

    const transactions = await sql`
      SELECT * FROM transactions
      WHERE userid = ${userID}
      ORDER by createdate DESC`;
    res.status(200).json(transactions);
  } catch (error) {
    console.log("Error getting transactions:", error);
    res.status(500).json({ message: "Internal server error" });
  }
});

router.post("/", async (req, res) => {
  try {
    const { title, amount, type, userid } = req.body;

    if (!title || amount === null || !type || !userid) {
      return res.status(400).json({ message: "All fields are required" });
    }

    const transaction = await sql`
      INSERT INTO transactions(userid, title, amount, type) 
      VALUES (${userid}, ${title}, ${amount}, ${type})
      RETURNING *
      `;
    res.status(201).json(transaction[0]);
  } catch (error) {
    console.log("Error creating transaction:", error);
    res.status(500).json({ message: "Internal server error" });
  }
});

router.delete("/:id", async (req, res) => {
  try {
    const { id } = req.params;

    if (isNaN(parseInt(id))) {
      return res.status(400).json({ message: "Invalid transaction ID" });
    }

    const result = await sql`
          DELETE FROM transactions
          WHERE id = ${id}
          RETURNING *
          `;

    if (result.length === 0) {
      return res.status(404).json({ message: "Transaction not found" });
    }

    res.status(200).json({ message: "Transaction deleted successfully" });
  } catch (error) {
    console.log("Error deleting transaction:", error);
    res.status(500).json({ message: "Internal server error" });
  }
});

router.get("/summary/:userID", async (req, res) => {
  try {
    const { userID } = req.params;

    const balanceResult = await sql`
      SELECT COALESCE(SUM(amount), 0) as balance
      FROM transactions
      WHERE userid = ${userID}
      `;

    const incomeResult = await sql`
      SELECT COALESCE(SUM(amount), 0) as income
      FROM transactions
      WHERE userid = ${userID} AND amount > 0
      `;

    const expenseResult = await sql`
      SELECT COALESCE(SUM(amount), 0) as expense
      FROM transactions
      WHERE userid = ${userID} AND amount < 0
      `;

    res.status(200).json({
      balance: balanceResult[0].balance,
      income: incomeResult[0].income,
      expense: expenseResult[0].expense,
    });
  } catch (error) {
    console.log("Error getting the summary", error);
    res.status(500).json({ message: "Internal server error" });
  }
});

export default router;
