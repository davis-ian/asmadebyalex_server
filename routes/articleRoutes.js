import express from "express";
import articleController from "../controllers/articleController.js";

const router = express.Router();

router.get("/", articleController.getArticles);
router.get("/:id", articleController.getArticle);
router.post("/", articleController.postArticle);
router.delete("/:id", articleController.deleteArticle);
router.put("/:id", articleController.updateArticle);

export default router;
