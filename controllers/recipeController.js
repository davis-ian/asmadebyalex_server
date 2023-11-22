import { PrismaClient } from "@prisma/client";
const prisma = new PrismaClient();
import { isSuperAdmin } from "./../authUtils.js";

const recipeController = {
  getRecipes: async (req, res) => {
    const { featured } = req.query; // Get the 'featured' query parameter

    let recipes;

    if (featured === "true") {
      // Filter recipes where 'featured' is true
      recipes = await prisma.recipe.findMany({
        where: {
          featured: true,
        },
        orderBy: { createdAt: "desc" },
        include: {
          ingredients: {
            include: {
              ingredient: true,
              measurementUnit: true,
            },
          },
          photos: true,
        },
      });
    } else {
      recipes = await prisma.recipe.findMany({
        orderBy: { createdAt: "desc" },
        include: {
          ingredients: {
            include: {
              ingredient: true,
              measurementUnit: true,
            },
          },
          photos: true,
        },
      });
    }

    // Iterate through the recipes and update mainPhoto where mainPhotoId matches a photo's id
    const recipesWithMainPhoto = recipes.map((recipe) => {
      if (recipe.mainPhotoId !== null) {
        const mainPhoto = recipe.photos.find(
          (photo) => photo.id === recipe.mainPhotoId
        );
        if (mainPhoto) {
          recipe.mainPhoto = mainPhoto;
        }
      }
      recipe.photos = [];
      return recipe;
    });

    res.json(recipesWithMainPhoto);
  },

  getRecipe: async (req, res) => {
    const id = parseInt(req.params.id);

    if (typeof id != "number") {
      return res.status(400).json({ error: "Invalid ID type." });
    }
    const recipe = await prisma.recipe.findUnique({
      where: { id: Number(id) },
      include: {
        ingredients: {
          include: {
            ingredient: true,
            measurementUnit: true,
          },
        },
        photos: true,
      },
    });

    if (recipe.mainPhotoId !== null) {
      const mainPhoto = recipe.photos.find(
        (photo) => photo.id === recipe.mainPhotoId
      );
      if (mainPhoto) {
        recipe.mainPhoto = mainPhoto;
      }
    }
    res.json(recipe);
  },
  postRecipe: async (req, res) => {
    if (!(await isSuperAdmin(req))) {
      return res.status(401).json({ error: "Unauthorized Access" });
    }

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
    if (!(await isSuperAdmin(req))) {
      return res.status(401).json({ error: "Unauthorized Access" });
    }

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

  updateRecipe: async (req, res) => {
    if (!(await isSuperAdmin(req))) {
      return res.status(401).json({ error: "Unauthorized Access" });
    }

    const { id } = req.params;
    const { name, description, ingredients } = req.body;

    try {
      const recipe = await prisma.recipe.findUnique({
        where: { id: Number(id) },
        include: { ingredients: true },
      });

      if (!recipe) {
        return res.status(404).json({ error: "Recipe not found" });
      }

      const updatedIngredientIds = ingredients.map(
        (ingredient) => ingredient.ingredientId
      );

      const ingredientIdsToDelete = recipe.ingredients
        .filter(
          (ingredient) =>
            !updatedIngredientIds.includes(ingredient.ingredientId)
        )
        .map((ingredient) => ({
          ingredientId: ingredient.ingredientId,
        }));

      const newIngredients = ingredients.filter((ingredient) => {
        return !recipe.ingredients.some(
          (connectedIngredient) =>
            connectedIngredient.ingredientId === ingredient.ingredientId
        );
      });

      const updatedRecipe = await prisma.recipe.update({
        where: { id: Number(id) },
        data: {
          name: name || recipe.name,
          description: description || recipe.description,
          ingredients: {
            create: newIngredients.map((ingredient) => ({
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
            deleteMany: ingredientIdsToDelete,
          },
        },
      });

      res.json(updatedRecipe);
    } catch (error) {
      res.status(500).json({ error: "Something went wrong" });
    }
  },

  setMainPhoto: async (req, res) => {
    if (!(await isSuperAdmin(req))) {
      return res.status(401).json({ error: "Unauthorized Access" });
    }
    const recipeId = parseInt(req.params.recipeId);
    const photoId = parseInt(req.params.photoId);

    try {
      const recipe = await prisma.recipe.findUnique({
        where: {
          id: recipeId,
        },
      });

      const photo = await prisma.recipePhoto.findUnique({
        where: {
          id: photoId,
        },
      });

      if (!recipe) {
        throw new Error(`Recipe with ID: ${recipeId} not found.`);
      }

      if (!photo) {
        throw new Error(`Photo with ID: ${photoId} and not found.`);
      }

      if (photo.recipeId !== recipeId) {
        throw new Error(
          `Photo with ID ${photoId} does not belong to recipe with ID ${recipeId}.`
        );
      }

      const updatedRecipe = await prisma.recipe.update({
        where: {
          id: recipeId,
        },
        data: {
          mainPhotoId: photoId,
        },
      });

      res.json(updatedRecipe);
    } catch (error) {
      console.error("Error seeing main photo id for recide: ", error);
      throw error;
    } finally {
      await prisma.$disconnect();
    }
  },

  updateFeatured: async (req, res) => {
    if (!(await isSuperAdmin(req))) {
      return res.status(401).json({ error: "Unauthorized Access" });
    }
    const recipeId = parseInt(req.params.id);
    const featured = req.body.featured;

    try {
      // Find the existing todo item by its ID
      const recipe = await prisma.recipe.findUnique({
        where: { id: recipeId },
      });

      if (!recipe) {
        return res.status(404).json({ error: "Recipe not found" });
      }

      const updatedRecipe = await prisma.recipe.update({
        where: { id: recipeId },
        data: {
          featured: featured,
        },
      });
      res.json(updatedRecipe);
    } catch (error) {
      res.status(500).json({ error: "Something went wrong" });
    }
  },
};

export default recipeController;
