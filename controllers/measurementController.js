import { PrismaClient } from "@prisma/client";
const prisma = new PrismaClient();

const measurementController = {
  getMeasurements: async (req, res) => {
    const measurements = await prisma.measurementUnit.findMany({
      orderBy: { name: "asc" },
    });

    res.json(measurements);
  },

  postMeasurement: async (req, res) => {
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
