import express from "express";
import {
  createProduct,
  getProducts,
  getProductById,
  updateProduct,
  deleteProduct,
  upload,
} from "../controllers/productControllers.js";

const router = express.Router();

// Upload + Create
router.post("/", upload.single("image"), createProduct);

router.get("/", getProducts);
router.get("/:id", getProductById);
router.put("/:id", upload.single("image"), updateProduct);
router.delete("/:id", deleteProduct);

export default router;
