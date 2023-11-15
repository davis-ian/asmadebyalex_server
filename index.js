import express from "express";
import "dotenv/config";

import bodyParser from "body-parser";
// import pkg from "express-openid-connect";
// const { auth, requiresAuth } = pkg;
import { auth } from "express-oauth2-jwt-bearer";
import cors from "cors";

import measurementRoutes from "./routes/measurementRoutes.js";
import recipeRoutes from "./routes/recipeRoutes.js";
import ingredientRoutes from "./routes/ingredientRoutes.js";
import articleRoutes from "./routes/articleRoutes.js";
import mediaRoutes from "./routes/mediaRoutes.js";

// Authorization middleware. When used, the Access Token must
// exist and be verified against the Auth0 JSON Web Key Set.
const checkJwt = auth({
  audience: process.env.AUD,
  issuerBaseURL: process.env.ISSUER_BASE_URL,
  tokenSigningAlg: process.env.ALG,
});

const app = express();

// app.use(express.json());

// Increase the payload limit to a larger value like '50mb'
app.use(bodyParser.json({ limit: "50mb" }));
app.use(bodyParser.urlencoded({ limit: "50mb", extended: true }));

// Get the allowed origins from the environment variable
const allowedOrigins = process.env.ALLOWED_ORIGINS?.split(",") || [];

const corsOptions = {
  origin: allowedOrigins,
  credentials: true,
};

app.use(cors(corsOptions));

// TODO: Protect admin routes
app.use("/api/measurements", measurementRoutes);
app.use("/api/recipes", recipeRoutes);
app.use("/api/ingredients", ingredientRoutes);
app.use("/api/articles", articleRoutes);
app.use("/api/media", mediaRoutes);

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
