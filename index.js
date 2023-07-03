import express from "express";
import { PrismaClient } from "@prisma/client";
import "dotenv/config";
// import pkg from "express-openid-connect";
// const { auth, requiresAuth } = pkg;
import { auth } from "express-oauth2-jwt-bearer";
import cors from "cors";

// Authorization middleware. When used, the Access Token must
// exist and be verified against the Auth0 JSON Web Key Set.
const checkJwt = auth({
  audience: process.env.AUD,
  issuerBaseURL: process.env.ISSUER_BASE_URL,
  tokenSigningAlg: process.env.ALG,
});

const app = express();

const prisma = new PrismaClient();

app.use(express.json());

// Get the allowed origins from the environment variable
const allowedOrigins = process.env.ALLOWED_ORIGINS?.split(",") || [];

const corsOptions = {
  origin: allowedOrigins,
  credentials: true,
};

app.use(cors(corsOptions));

app.get("/api/", (req, res) => {
  res.send("Choo Choo! Welcome to your Express app 🚅");
});

app.get("/api/json", (req, res) => {
  res.json({ "Choo Choo": "Welcome to your Express app 🚅" });
});

app.get("/api/todos", async (req, res) => {
  const todos = await prisma.todo.findMany({
    orderBy: { createdAt: "desc" },
  });

  res.json(todos);
});

app.post("/api/todos", async (req, res) => {
  const todo = await prisma.todo.create({
    data: {
      completed: false,
      createdAt: new Date(),
      text: req.body.text ?? "Empty todo",
    },
  });

  return res.json(todo);
  //   return res.json(req.body.text);
});

//Measurements
app.get("/api/measurements", async (req, res) => {
  const measurements = await prisma.measurementUnit.findMany({
    orderBy: { name: "asc" },
  });

  res.json(measurements);
});

app.post("/api/measurements", async (req, res) => {
  const { name } = req.body;

  const measurement = await prisma.measurementUnit.create({
    data: {
      name: name,
    },
  });

  return res.json(measurement);
  //   return res.json(req.body.text);
});

// Recipes
app.get("/api/recipes", async (req, res) => {
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
});

app.get("/api/recipes/:id", async (req, res) => {
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
});

app.post("/api/recipes", async (req, res) => {
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

  console.log(recipe);
  res.json(recipe);
});

// Ingredients
app.get("/api/ingredients", async (req, res) => {
  const ingredients = await prisma.ingredient.findMany({
    orderBy: { name: "desc" },
  });

  res.json(ingredients);
});

app.post("/api/ingredients", async (req, res) => {
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
});

// Private endpoint
app.get("/api/private", checkJwt, function (req, res) {
  res.json({
    message:
      "Hello from a private endpoint! You need to be authenticated and have a scope of read:messages to see this.",
  });
});

const port = process.env.PORT || 3000;

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`);
});
