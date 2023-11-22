import express from "express";
import ingredientController from "../controllers/ingredientController.js";

const router = express.Router();

router.get("/", ingredientController.getIngredients);
router.post("/", ingredientController.postIngredient);
router.put("/:id", ingredientController.updateIngredient);

export default router;
