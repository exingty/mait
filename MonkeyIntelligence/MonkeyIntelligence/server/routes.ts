import type { Express } from "express";
import { createServer, type Server } from "http";
import { setupAuth } from "./auth";
import { storage } from "./storage";
import { generateLesson, getAIResponse } from "./ai";

export async function registerRoutes(app: Express): Promise<Server> {
  setupAuth(app);

  app.get("/api/progress/:userId", async (req, res) => {
    try {
      const progress = await storage.getProgress(parseInt(req.params.userId));
      res.json(progress);
    } catch (err) {
      res.status(500).json({ message: "Failed to fetch progress" });
    }
  });

  app.post("/api/progress", async (req, res) => {
    try {
      const progress = await storage.saveProgress(req.body);
      res.json(progress);
    } catch (err) {
      res.status(500).json({ message: "Failed to save progress" });
    }
  });

  app.get("/api/lessons/:teacherId", async (req, res) => {
    try {
      const lessons = await storage.getLessons(parseInt(req.params.teacherId));
      res.json(lessons);
    } catch (err) {
      res.status(500).json({ message: "Failed to fetch lessons" });
    }
  });

  app.post("/api/lessons", async (req, res) => {
    try {
      const lesson = await storage.createLesson(req.body);
      res.json(lesson);
    } catch (err) {
      res.status(500).json({ message: "Failed to create lesson" });
    }
  });

  app.post("/api/lessons/generate", async (req, res) => {
    try {
      const { subject, yearGroup } = req.body;
      if (!subject || !yearGroup) {
        return res.status(400).json({ message: "Missing required fields" });
      }
      const lesson = await generateLesson(subject, yearGroup);
      res.json(lesson);
    } catch (err) {
      console.error("Lesson generation error:", err);
      res.status(500).json({ message: "Failed to generate lesson" });
    }
  });

  app.post("/api/ai/chat", async (req, res) => {
    try {
      const { prompt } = req.body;
      const response = await getAIResponse(prompt);
      res.json({ response });
    } catch (err) {
      res.status(500).json({ message: "Failed to get response" });
    }
  });

  const httpServer = createServer(app);
  return httpServer;
}