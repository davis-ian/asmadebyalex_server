import { PrismaClient } from "@prisma/client";
const prisma = new PrismaClient();
import { isSuperAdmin } from "./../authUtils.js";

const measurementController = {
  getMeasurements: async (req, res) => {
    const measurements = await prisma.measurementUnit.findMany({
      orderBy: { name: "asc" },
    });

    res.json(measurements);
  },

  postMeasurement: async (req, res) => {
    if (!(await isSuperAdmin(req))) {
      return res.status(401).json({ error: "Unauthorized Access" });
    }

    const { name } = req.body;

    const measurement = await prisma.measurementUnit.create({
      data: {
        name: name,
      },
    });

    return res.json(measurement);
  },
};

export default measurementController;
