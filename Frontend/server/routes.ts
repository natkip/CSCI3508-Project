import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { setupAuth } from "./auth";
import { z } from "zod";
import { filterPetsSchema, insertPetSchema } from "@shared/schema";

export async function registerRoutes(app: Express): Promise<Server> {
  // Setup authentication routes (/api/register, /api/login, /api/logout, /api/user)
  setupAuth(app);

  // Pet routes
  // Get all pets with optional filtering
  app.get("/api/pets", async (req, res) => {
    try {
      const filters = filterPetsSchema.parse(req.query);
      const pets = await storage.searchPets(filters);
      res.json(pets);
    } catch (error) {
      if (error instanceof z.ZodError) {
        console.error("Validation error:", error.errors);
        res.status(400).json({ error: "Invalid filter parameters", details: error.errors });
      } else {
        console.error("Server error:", error);
        res.status(500).json({ error: "Failed to fetch pets" });
      }
    }
  });

  // Get pet by ID
  app.get("/api/pets/:id", async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      if (isNaN(id)) {
        return res.status(400).json({ error: "Invalid pet ID" });
      }

      const pet = await storage.getPet(id);
      if (!pet) {
        return res.status(404).json({ error: "Pet not found" });
      }

      res.json(pet);
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch pet" });
    }
  });

  // Admin-only routes - require admin authentication
  // Create a new pet
  app.post("/api/pets", async (req, res) => {
    if (!req.isAuthenticated() || !req.user.isAdmin) {
      return res.status(403).json({ error: "Admin access required" });
    }

    try {
      const petData = insertPetSchema.parse(req.body);
      const pet = await storage.createPet(petData);
      res.status(201).json(pet);
    } catch (error) {
      if (error instanceof z.ZodError) {
        res.status(400).json({ error: "Invalid pet data", details: error.errors });
      } else {
        res.status(500).json({ error: "Failed to create pet" });
      }
    }
  });

  // Update a pet
  app.put("/api/pets/:id", async (req, res) => {
    if (!req.isAuthenticated() || !req.user.isAdmin) {
      return res.status(403).json({ error: "Admin access required" });
    }

    try {
      const id = parseInt(req.params.id);
      if (isNaN(id)) {
        return res.status(400).json({ error: "Invalid pet ID" });
      }

      const existingPet = await storage.getPet(id);
      if (!existingPet) {
        return res.status(404).json({ error: "Pet not found" });
      }

      // Validate update data
      const updateData = insertPetSchema.partial().parse(req.body);
      const updatedPet = await storage.updatePet(id, updateData);
      res.json(updatedPet);
    } catch (error) {
      if (error instanceof z.ZodError) {
        res.status(400).json({ error: "Invalid pet data", details: error.errors });
      } else {
        res.status(500).json({ error: "Failed to update pet" });
      }
    }
  });

  // Delete a pet
  app.delete("/api/pets/:id", async (req, res) => {
    if (!req.isAuthenticated() || !req.user.isAdmin) {
      return res.status(403).json({ error: "Admin access required" });
    }

    try {
      const id = parseInt(req.params.id);
      if (isNaN(id)) {
        return res.status(400).json({ error: "Invalid pet ID" });
      }

      const success = await storage.deletePet(id);
      if (!success) {
        return res.status(404).json({ error: "Pet not found" });
      }

      res.status(204).send();
    } catch (error) {
      res.status(500).json({ error: "Failed to delete pet" });
    }
  });

  const httpServer = createServer(app);

  return httpServer;
}
