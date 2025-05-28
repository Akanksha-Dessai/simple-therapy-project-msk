import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { insertClientSchema, insertAssetTemplateSchema, insertAssetCategorySchema } from "@shared/schema";
import { z } from "zod";

export async function registerRoutes(app: Express): Promise<Server> {
  
  // Client access route
  app.post("/api/client/access", async (req, res) => {
    try {
      const { accessCode } = req.body;
      
      if (!accessCode) {
        return res.status(400).json({ message: "Access code is required" });
      }

      const client = await storage.getClientByAccessCode(accessCode);
      if (!client) {
        return res.status(404).json({ message: "Invalid access code" });
      }

      if (client.status !== "active") {
        return res.status(403).json({ message: "Client account is not active" });
      }

      res.json(client);
    } catch (error) {
      res.status(500).json({ message: "Internal server error" });
    }
  });

  // Get asset templates for client
  app.get("/api/client/:clientId/assets", async (req, res) => {
    try {
      const clientId = parseInt(req.params.clientId);
      const client = await storage.getClient(clientId);
      
      if (!client) {
        return res.status(404).json({ message: "Client not found" });
      }

      const templates = await storage.getAllAssetTemplates();
      const clientAssets = await storage.getClientAssets(clientId);
      
      // Add some sample video assets for testing
      const sampleVideoAssets = [
        {
          id: 999,
          name: "Program Introduction Video",
          category: "launch",
          type: "video",
          originalFileName: "program-intro.mp4",
          fileUrl: "/videos/program-intro.mp4",
          fileType: "mp4",
          version: "v1.0",
          description: "Engaging introduction video explaining program benefits",
          language: "English",
          languageVariants: ["English", "Spanish"],
          vimeoUrl: "https://vimeo.com/123456789",
          createdAt: new Date(),
          updatedAt: new Date(),
          clientSpecific: null,
          downloadUrl: null
        },
        {
          id: 998,
          name: "Video de Introducción del Programa",
          category: "launch", 
          type: "video",
          originalFileName: "programa-intro.mp4",
          fileUrl: "/videos/programa-intro.mp4",
          fileType: "mp4",
          version: "v1.0",
          description: "Video introductorio que explica los beneficios del programa",
          language: "Spanish",
          languageVariants: ["English", "Spanish"],
          vimeoUrl: "https://vimeo.com/123456790",
          createdAt: new Date(),
          updatedAt: new Date(),
          clientSpecific: null,
          downloadUrl: null
        }
      ];

      // Combine templates with client-specific data
      const assetsWithClientData = templates.map(template => {
        const clientAsset = clientAssets.find(ca => ca.templateId === template.id);
        return {
          ...template,
          clientSpecific: clientAsset || null,
          downloadUrl: clientAsset ? clientAsset.personalizedFileUrl : null
        };
      });

      // Add sample video assets
      const allAssets = [...assetsWithClientData, ...sampleVideoAssets];

      res.json({
        client,
        assets: allAssets
      });
    } catch (error) {
      res.status(500).json({ message: "Internal server error" });
    }
  });

  // Download asset
  app.get("/api/asset/download/:templateId/:clientId", async (req, res) => {
    try {
      const templateId = parseInt(req.params.templateId);
      const clientId = parseInt(req.params.clientId);
      
      const template = await storage.getAssetTemplate(templateId);
      const client = await storage.getClient(clientId);
      
      if (!template || !client) {
        return res.status(404).json({ message: "Asset or client not found" });
      }

      // In a real implementation, this would generate a personalized version
      // For now, we'll simulate by creating a client asset record and returning the template URL
      const clientAssets = await storage.getClientAssets(clientId);
      let clientAsset = clientAssets.find(ca => ca.templateId === templateId);
      
      if (!clientAsset) {
        // Create personalized asset
        const personalizedUrl = `/personalized/${client.accessCode}/${template.originalFileName}`;
        clientAsset = await storage.createClientAsset({
          clientId,
          templateId,
          personalizedFileUrl: personalizedUrl,
          downloadCount: 0
        });
      }

      // Update download count
      await storage.updateClientAssetDownload(clientAsset.id);

      res.json({
        downloadUrl: clientAsset.personalizedFileUrl,
        fileName: template.originalFileName,
        fileType: template.fileType
      });
    } catch (error) {
      res.status(500).json({ message: "Internal server error" });
    }
  });

  // Admin routes
  
  // Get all clients
  app.get("/api/admin/clients", async (req, res) => {
    try {
      const clients = await storage.getAllClients();
      
      // Add asset count for each client
      const clientsWithStats = await Promise.all(
        clients.map(async (client) => {
          const assets = await storage.getClientAssets(client.id);
          return {
            ...client,
            assetCount: assets.length
          };
        })
      );
      
      res.json(clientsWithStats);
    } catch (error) {
      res.status(500).json({ message: "Internal server error" });
    }
  });

  // Create client
  app.post("/api/admin/clients", async (req, res) => {
    try {
      const validatedData = insertClientSchema.parse(req.body);
      const client = await storage.createClient(validatedData);
      res.status(201).json(client);
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ message: "Validation error", errors: error.errors });
      }
      res.status(500).json({ message: "Internal server error" });
    }
  });

  // Update client
  app.put("/api/admin/clients/:id", async (req, res) => {
    try {
      const clientId = parseInt(req.params.id);
      const updates = insertClientSchema.partial().parse(req.body);
      
      const updatedClient = await storage.updateClient(clientId, updates);
      if (!updatedClient) {
        return res.status(404).json({ message: "Client not found" });
      }
      
      res.json(updatedClient);
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ message: "Validation error", errors: error.errors });
      }
      res.status(500).json({ message: "Internal server error" });
    }
  });

  // Delete client
  app.delete("/api/admin/clients/:id", async (req, res) => {
    try {
      const clientId = parseInt(req.params.id);
      const deleted = await storage.deleteClient(clientId);
      
      if (!deleted) {
        return res.status(404).json({ message: "Client not found" });
      }
      
      res.status(204).send();
    } catch (error) {
      res.status(500).json({ message: "Internal server error" });
    }
  });

  // Get all asset templates
  app.get("/api/admin/templates", async (req, res) => {
    try {
      const { category } = req.query;
      
      let templates;
      if (category) {
        templates = await storage.getAssetTemplatesByCategory(category as string);
      } else {
        templates = await storage.getAllAssetTemplates();
      }
      
      res.json(templates);
    } catch (error) {
      res.status(500).json({ message: "Internal server error" });
    }
  });

  // Create asset template
  app.post("/api/admin/templates", async (req, res) => {
    try {
      const validatedData = insertAssetTemplateSchema.parse(req.body);
      const template = await storage.createAssetTemplate(validatedData);
      res.status(201).json(template);
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ message: "Validation error", errors: error.errors });
      }
      res.status(500).json({ message: "Internal server error" });
    }
  });

  // Update asset template
  app.put("/api/admin/templates/:id", async (req, res) => {
    try {
      const templateId = parseInt(req.params.id);
      const updates = insertAssetTemplateSchema.partial().parse(req.body);
      
      const updatedTemplate = await storage.updateAssetTemplate(templateId, updates);
      if (!updatedTemplate) {
        return res.status(404).json({ message: "Template not found" });
      }
      
      res.json(updatedTemplate);
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ message: "Validation error", errors: error.errors });
      }
      res.status(500).json({ message: "Internal server error" });
    }
  });

  // Delete asset template
  app.delete("/api/admin/templates/:id", async (req, res) => {
    try {
      const templateId = parseInt(req.params.id);
      const deleted = await storage.deleteAssetTemplate(templateId);
      
      if (!deleted) {
        return res.status(404).json({ message: "Template not found" });
      }
      
      res.status(204).send();
    } catch (error) {
      res.status(500).json({ message: "Internal server error" });
    }
  });

  // Category management routes

  // Get all categories
  app.get("/api/admin/categories", async (req, res) => {
    try {
      const categories = await storage.getAllAssetCategories();
      res.json(categories);
    } catch (error) {
      res.status(500).json({ message: "Internal server error" });
    }
  });

  // Create category
  app.post("/api/admin/categories", async (req, res) => {
    try {
      const validatedData = insertAssetCategorySchema.parse(req.body);
      const category = await storage.createAssetCategory(validatedData);
      res.status(201).json(category);
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ message: "Validation error", errors: error.errors });
      }
      res.status(500).json({ message: "Internal server error" });
    }
  });

  // Update category
  app.put("/api/admin/categories/:id", async (req, res) => {
    try {
      const categoryId = parseInt(req.params.id);
      const updates = insertAssetCategorySchema.partial().parse(req.body);
      
      const updatedCategory = await storage.updateAssetCategory(categoryId, updates);
      if (!updatedCategory) {
        return res.status(404).json({ message: "Category not found" });
      }
      
      res.json(updatedCategory);
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ message: "Validation error", errors: error.errors });
      }
      res.status(500).json({ message: "Internal server error" });
    }
  });

  // Delete category
  app.delete("/api/admin/categories/:id", async (req, res) => {
    try {
      const categoryId = parseInt(req.params.id);
      const deleted = await storage.deleteAssetCategory(categoryId);
      
      if (!deleted) {
        return res.status(404).json({ message: "Category not found" });
      }
      
      res.status(204).send();
    } catch (error) {
      res.status(500).json({ message: "Internal server error" });
    }
  });

  const httpServer = createServer(app);
  return httpServer;
}
