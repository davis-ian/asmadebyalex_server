import { PrismaClient } from "@prisma/client";
const prisma = new PrismaClient();
import { isSuperAdmin } from "./../authUtils.js";

const articleController = {
  getArticles: async (req, res) => {
    const articles = await prisma.article.findMany({
      orderBy: { createdAt: "desc" },
    });
    res.json(articles);
  },

  getArticle: async (req, res) => {
    const { id } = req.params;
    const article = await prisma.article.findUnique({
      where: { id: Number(id) },
    });
    res.json(article);
  },
  postArticle: async (req, res) => {
    if (!(await isSuperAdmin(req))) {
      return res.status(401).json({ error: "Unauthorized Access" });
    }
    const { title, content } = req.body;

    // Create a new recipe with existing ingredients
    const article = await prisma.article.create({
      data: {
        title,
        content: content ?? "",
      },
    });
    res.json(article);
  },

  deleteArticle: async (req, res) => {
    if (!(await isSuperAdmin(req))) {
      return res.status(401).json({ error: "Unauthorized Access" });
    }
    const { id } = req.params;
    try {
      // Delete the item using Prisma
      const deletedItem = await prisma.article.delete({
        where: {
          id: Number(id),
        },
      });

      res.json(deletedItem);
    } catch (error) {
      res.json("Error deleting item:", error);
    }
  },

  updateArticle: async (req, res) => {
    if (!(await isSuperAdmin(req))) {
      return res.status(401).json({ error: "Unauthorized Access" });
    }
    const { id } = req.params;
    const { title, content } = req.body;
    try {
      // Find the existing todo item by its ID
      const article = await prisma.article.findUnique({
        where: { id: Number(id) },
      });

      if (!article) {
        return res.status(404).json({ error: "Article not found" });
      }

      const updatedArticle = await prisma.article.update({
        where: { id: Number(id) },
        data: {
          name: title || article.title,
          content: content || article.content,
        },
      });
      res.json(updatedArticle);
    } catch (error) {
      res.status(500).json({ error: "Something went wrong" });
    }
  },
};

export default articleController;
