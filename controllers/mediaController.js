import { PrismaClient } from "@prisma/client";
const prisma = new PrismaClient();

import crypto from "crypto";
import { v4 as uuidv4 } from "uuid";

const cloudName = process.env.CLOUDINARY_CLOUD_NAME;
const cloudApiKey = process.env.CLOUDINARY_API_KEY;
const cloudSecret = process.env.CLOUDINARY_API_SECRET;

import cloudinary from "cloudinary/lib/cloudinary.js";
cloudinary.config({
  cloud_name: cloudName,
  api_key: cloudApiKey,
  api_secret: cloudSecret,
});

const mediaController = {
  getUploadSignature: async (req, res) => {
    const timestamp = Math.round(new Date().getTime() / 1000);

    const signature = cloudinary.utils.api_sign_request(
      {
        timestamp: timestamp,
      },
      cloudSecret
    );

    res.json({ signature, timestamp });
  },
  addToDb: async (req, res) => {
    try {
      const uploadResp = req.body;

      const { recipeId } = req.body;

      const data = {
        assetId: uploadResp.asset_id,
        publicId: uploadResp.public_id,
        width: uploadResp.width,
        height: uploadResp.height,
        format: uploadResp.format,
        resourceType: uploadResp.resource_type,
        createdAt: new Date(uploadResp.created_at),
        bytes: uploadResp.bytes,
        url: uploadResp.url,
        secureUrl: uploadResp.secure_url,
        folder: uploadResp.folder,
        originalFileName: uploadResp.original_filename,
        recipe: { connect: { id: parseInt(recipeId) } },
      };

      const media = await prisma.recipePhoto.create({
        data,
      });

      res.json(media);
    } catch (error) {
      console.log(error, "Error uploading media to  DB", error);
      res.status(500);
    }
  },
};

export default mediaController;
