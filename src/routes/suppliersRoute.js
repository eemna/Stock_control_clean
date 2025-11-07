import express from "express";
import { createSupplier, getSupplier, deleteSupplier ,updateSupplier } from "../controllers/suppliersController.js";

const router = express.Router();
router.post("/", createSupplier);
router.get("/",getSupplier );
router.delete("/:supplier_id", deleteSupplier )
router.put("/:supplier_id", updateSupplier)


export default router;