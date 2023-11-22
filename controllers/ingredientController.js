import { PrismaClient } from "@prisma/client";
const prisma = new PrismaClient();

import { isSuperAdmin } from "./../authUtils.js";

const ingredientController = {
  getIngredients: async (req, res, next) => {
    const ingredients = await prisma.ingredient.findMany({
      orderBy: { name: "desc" },
    });

    res.json(ingredients);
  },

  postIngredient: async (req, res) => {
    if (!(await isSuperAdmin(req))) {
      return res.status(401).json({ error: "Unauthorized Access" });
    }
    const { name } = req.body;

    if (name) {
      const ingredient = await prisma.ingredient.create({
        data: {
          name: name,
        },
      });
      res.json(ingredient);
    } else {
      res.status(400).json({
        error: "Bad Request",
        message: "Ingredient name cannot be null",
      });
    }
  },

  updateIngredient: async (req, res) => {
    try {
      if (!(await isSuperAdmin(req))) {
        return res.status(401).json({ error: "Unauthorized Access" });
      }

      const ingredientId = parseInt(req.params.id);
      const newName = req.body.name;

      if (!ingredientId || !newName) {
        return res.status(400).json({
          error: "Bad Request",
          message: "Ingredient ID and new name are required",
        });
      }

      // Check if the ingredient with the specified ID exists
      const existingIngredient = await prisma.ingredient.findUnique({
        where: { id: ingredientId },
      });

      if (!existingIngredient) {
        return res.status(404).json({
          error: "Not Found",
          message: "Ingredient not found",
        });
      }

      // Update the ingredient's name
      const updatedIngredient = await prisma.ingredient.update({
        where: { id: ingredientId },
        data: {
          name: newName,
        },
      });

      res.json(updatedIngredient);
    } catch (error) {
      console.error("Error updating ingredient:", error);
      res.status(500).json({ error: "Internal Server Error" });
    } finally {
      // Make sure to disconnect from the Prisma Client after the operation
      await prisma.$disconnect();
    }
  },
};

export default ingredientController;
