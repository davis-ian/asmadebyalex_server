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

app.get("api/", (req, res) => {
  res.send("Choo Choo! Welcome to your Express app 🚅");
});

app.get("api/json", (req, res) => {
  res.json({ "Choo Choo": "Welcome to your Express app 🚅" });
});

app.get("api/todos", async (req, res) => {
  const todos = await prisma.todo.findMany({
    orderBy: { createdAt: "desc" },
  });

  res.json(todos);
});

app.post("api/todos", async (req, res) => {
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

const port = process.env.PORT || 3000;

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`);
});
