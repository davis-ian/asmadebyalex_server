import express from "express";
import mediaController from "../controllers/mediaController.js";

const router = express.Router();

router.get("/upload-signature", mediaController.getUploadSignature);
router.post("/", mediaController.addToDb);
// router.post("/", measurementController.postMeasurement);

export default router;
