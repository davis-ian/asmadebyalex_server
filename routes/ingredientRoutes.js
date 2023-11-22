import express from "express";
import ingredientController from "../controllers/ingredientController.js";

const router = express.Router();

router.get("/", ingredientController.getIngredients);
router.post("/", ingredientController.postIngredient);
router.put("/:id", ingredientController.updateIngredient);
router.delete("/:id", ingredientController.deleteIngredient);

export default router;
