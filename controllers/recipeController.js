import { PrismaClient } from "@prisma/client";
const prisma = new PrismaClient();

const recipeController = {
  getRecipes: async (req, res) => {
    const recipes = await prisma.recipe.findMany({
      orderBy: { createdAt: "desc" },
      include: {
        ingredients: {
          include: {
            ingredient: true,
            measurementUnit: true,
          },
        },
      },
    });
    res.json(recipes);
  },

  getRecipe: async (req, res) => {
    const { id } = req.params;
    const recipes = await prisma.recipe.findUnique({
      where: { id: Number(id) },
      include: {
        ingredients: {
          include: {
            ingredient: true,
            measurementUnit: true,
          },
        },
      },
    });
    res.json(recipes);
  },
  postRecipe: async (req, res) => {
    const { name, description, ingredients } = req.body;

    // Create a new recipe with existing ingredients
    const recipe = await prisma.recipe.create({
      data: {
        name,
        description: description ?? "",
        ingredients: {
          create: ingredients.map((ingredient) => ({
            quantity: ingredient.quantity,
            ingredient: {
              connect: {
                id: ingredient.ingredientId,
              },
            },
            measurementUnit: {
              connect: {
                id: ingredient.measurementUnitId,
              },
            },
          })),
        },
      },
    });
    res.json(recipe);
  },

  deleteRecipe: async (req, res) => {
    const { id } = req.params;
    try {
      // Delete the item using Prisma
      const deletedItem = await prisma.recipe.delete({
        where: {
          id: Number(id),
        },
      });

      res.json(deletedItem);
    } catch (error) {
      res.json("Error deleting item:", error);
    }
  },
};

export default recipeController;
