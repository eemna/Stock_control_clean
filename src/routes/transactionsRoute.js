import express from "express";
import {getTransactionsByProductrId, getSummaryByUserId,getALLProductr,deleteTransaction} from "../controllers/transactionController.js";
const router = express.Router();

router.get("/:product_id",  getTransactionsByProductrId);
router.get("/",  getALLProductr);
router.get("/summary/:user_id", getSummaryByUserId);
router.delete("/:id", deleteTransaction);

export default router;