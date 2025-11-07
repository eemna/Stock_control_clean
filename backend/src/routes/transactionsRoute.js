import express from "express";
import {getGlobalSummary, getTransactionsByProductrId, getSummaryByUserId,getALLProductr,deleteTransaction} from "../controllers/transactionController.js";
const router = express.Router();

router.get("/summary", getGlobalSummary);
router.get("/summary/:user_id", getSummaryByUserId);

router.get("/", getALLProductr);
router.get("/:product_id", getTransactionsByProductrId);
router.delete("/:id", deleteTransaction);



export default router;