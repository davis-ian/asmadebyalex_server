import express from "express";
import measurementController from "../controllers/measurementController.js";

const router = express.Router();

router.get("/", measurementController.getMeasurements);
router.post("/", measurementController.postMeasurement);

export default router;
