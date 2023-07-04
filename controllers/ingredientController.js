import { PrismaClient } from "@prisma/client";
const prisma = new PrismaClient();

const ingredientController = {
  getIngredients: async (req, res) => {
    const ingredients = await prisma.ingredient.findMany({
      orderBy: { name: "desc" },
    });

    res.json(ingredients);
  },

  postIngredient: async (req, res) => {
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
};

export default ingredientController;
