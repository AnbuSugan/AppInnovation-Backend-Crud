import express from "express";
import ProductController from "../controllers/products";
import upload from "../middleware/multerConfig"

const router = express.Router();

router.get("/:productId", ProductController.getProduct);
router.post("/", upload.fields([{ name: 'images', maxCount: 10 }]), ProductController.createProduct);
router.patch("/:productId", upload.array("images", 10), ProductController.updateProduct);
router.delete("/:productId", ProductController.deleteProduct);
router.get("/", ProductController.getProducts); 


export default router;








