import express from "express";
import {getProducts, deleteProducts,updateProducts, createProduct, getAllProducts} from "../controllers/productsController.js";
const router = express.Router();
router.post("/",createProduct);
router.get("/", getAllProducts);
router.get("/:product_id/:supplier_id",getProducts);
router.delete("/:product_id",deleteProducts);
router.put("/:product_id/:supplier_id",updateProducts);
export default router;

