import express from "express";
import recipeController from "../controllers/recipeController.js";

const router = express.Router();

router.get("/", recipeController.getRecipes);
router.get("/:id", recipeController.getRecipe);
router.post("/", recipeController.postRecipe);
router.delete("/:id", recipeController.deleteRecipe);
router.put("/:id", recipeController.updateRecipe);
router.put("/main-photo/:recipeId/:photoId", recipeController.setMainPhoto);

export default router;
