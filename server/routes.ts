import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage-clean";
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
      
      // Add more sample assets to populate all categories
      const sampleVideoAssets = [
        // Intro Materials (categoryId: 1)
        {
          id: 999,
          name: "Welcome to Your MSK Program",
          categoryId: 1, // SimpleMSK Intro Materials
          type: "document",
          originalFileName: "welcome-guide.pdf",
          fileUrl: "/docs/welcome-guide.pdf",
          fileType: "pdf",
          version: "v1.0",
          description: "Complete introduction guide to get you started",
          language: "English",
          languageVariants: ["English", "Spanish"],
          vimeoUrl: null,
          createdAt: new Date(),
          updatedAt: new Date(),
          clientSpecific: null,
          downloadUrl: null
        },
        {
          id: 998,
          name: "Program Quick Start Guide",
          categoryId: 1, // SimpleMSK Intro Materials
          type: "flyer",
          originalFileName: "quick-start.pdf",
          fileUrl: "/docs/quick-start.pdf",
          fileType: "pdf",
          version: "v1.2",
          description: "Quick reference guide for immediate program benefits",
          language: "English",
          languageVariants: ["English", "Spanish"],
          vimeoUrl: null,
          createdAt: new Date(),
          updatedAt: new Date(),
          clientSpecific: null,
          downloadUrl: null
        },
        // Launch Campaign (categoryId: 2)
        {
          id: 997,
          name: "Launch Announcement Email",
          categoryId: 2, // SimpleMSK Launch Campaign
          type: "email",
          originalFileName: "launch-email.html",
          fileUrl: "/templates/launch-email.html",
          fileType: "html",
          version: "v2.0",
          description: "Professional email template for program launch",
          language: "English",
          languageVariants: ["English", "Spanish"],
          vimeoUrl: null,
          createdAt: new Date(),
          updatedAt: new Date(),
          clientSpecific: null,
          downloadUrl: null
        },
        {
          id: 996,
          name: "Launch Day Poster",
          categoryId: 2, // SimpleMSK Launch Campaign
          type: "poster",
          originalFileName: "launch-poster.jpg",
          fileUrl: "/images/launch-poster.jpg",
          fileType: "jpg",
          version: "v1.5",
          description: "Eye-catching poster for program launch day",
          language: "English",
          languageVariants: ["English", "Spanish"],
          vimeoUrl: null,
          createdAt: new Date(),
          updatedAt: new Date(),
          clientSpecific: null,
          downloadUrl: null
        },
        // Ongoing Promotion (categoryId: 3)
        {
          id: 995,
          name: "Monthly Wellness Tips",
          categoryId: 3, // SimpleMSK Ongoing Promotion
          type: "newsletter",
          originalFileName: "wellness-tips.pdf",
          fileUrl: "/newsletters/wellness-tips.pdf",
          fileType: "pdf",
          version: "v3.1",
          description: "Monthly tips for maintaining workplace wellness",
          language: "English",
          languageVariants: ["English", "Spanish"],
          vimeoUrl: null,
          createdAt: new Date(),
          updatedAt: new Date(),
          clientSpecific: null,
          downloadUrl: null
        },
        {
          id: 994,
          name: "Success Stories Showcase",
          categoryId: 3, // SimpleMSK Ongoing Promotion
          type: "flyer",
          originalFileName: "success-stories.pdf",
          fileUrl: "/docs/success-stories.pdf",
          fileType: "pdf",
          version: "v1.8",
          description: "Real employee success stories and testimonials",
          language: "English",
          languageVariants: ["English", "Spanish"],
          vimeoUrl: null,
          createdAt: new Date(),
          updatedAt: new Date(),
          clientSpecific: null,
          downloadUrl: null
        },
        // Videos (categoryId: 4)
        {
          id: 993,
          name: "Program Introduction Video",
          categoryId: 4, // SimpleMSK Videos
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
          id: 992,
          name: "Exercise Tutorial Series",
          categoryId: 4, // SimpleMSK Videos
          type: "video",
          originalFileName: "exercise-tutorials.mp4",
          fileUrl: "/videos/exercise-tutorials.mp4",
          fileType: "mp4",
          version: "v2.0",
          description: "Professional exercise demonstrations for workplace wellness",
          language: "English",
          languageVariants: ["English", "Spanish"],
          vimeoUrl: "https://vimeo.com/123456790",
          createdAt: new Date(),
          updatedAt: new Date(),
          clientSpecific: null,
          downloadUrl: null
        },
        // Additional diverse asset types
        {
          id: 991,
          name: "Program Launch Banner",
          categoryId: 2, // Launch Campaign
          type: "banner",
          originalFileName: "launch-banner.jpg",
          fileUrl: "/banners/launch-banner.jpg",
          fileType: "jpg",
          version: "v1.0",
          description: "Eye-catching web banner for program announcement",
          language: "English",
          languageVariants: ["English", "Spanish"],
          vimeoUrl: null,
          createdAt: new Date(),
          updatedAt: new Date(),
          clientSpecific: null,
          downloadUrl: null
        },
        {
          id: 990,
          name: "Employee Wellness Presentation",
          categoryId: 1, // Intro Materials
          type: "presentation",
          originalFileName: "wellness-presentation.pptx",
          fileUrl: "/presentations/wellness-presentation.pptx",
          fileType: "pptx",
          version: "v2.5",
          description: "Comprehensive presentation on workplace wellness benefits",
          language: "English",
          languageVariants: ["English", "Spanish"],
          vimeoUrl: null,
          createdAt: new Date(),
          updatedAt: new Date(),
          clientSpecific: null,
          downloadUrl: null
        },
        {
          id: 989,
          name: "Stress Management Webinar",
          categoryId: 4, // Videos
          type: "webinar",
          originalFileName: "stress-webinar.mp4",
          fileUrl: "/webinars/stress-webinar.mp4",
          fileType: "mp4",
          version: "v1.3",
          description: "Interactive webinar on effective stress management techniques",
          language: "English",
          languageVariants: ["English", "Spanish"],
          vimeoUrl: "https://vimeo.com/987654321",
          createdAt: new Date(),
          updatedAt: new Date(),
          clientSpecific: null,
          downloadUrl: null
        },
        {
          id: 988,
          name: "Wellness Program Virtual Display",
          categoryId: 3, // Ongoing Promotion
          type: "virtual_display",
          originalFileName: "wellness-vdm.jpg",
          fileUrl: "/displays/wellness-vdm.jpg",
          fileType: "jpg",
          version: "v1.7",
          description: "Digital display for lobby screens and virtual environments",
          language: "English",
          languageVariants: ["English", "Spanish"],
          vimeoUrl: null,
          createdAt: new Date(),
          updatedAt: new Date(),
          clientSpecific: null,
          downloadUrl: null
        },
        {
          id: 987,
          name: "Health Tips Information Flyer",
          categoryId: 3, // Ongoing Promotion
          type: "flyer",
          originalFileName: "health-tips-flyer.pdf",
          fileUrl: "/flyers/health-tips-flyer.pdf",
          fileType: "pdf",
          version: "v1.4",
          description: "Colorful flyer with daily health and wellness tips",
          language: "English",
          languageVariants: ["English", "Spanish"],
          vimeoUrl: null,
          createdAt: new Date(),
          updatedAt: new Date(),
          clientSpecific: null,
          downloadUrl: null
        }
      ];

      // Create bilingual versions of each template
      const assetsWithClientData = [];
      templates.forEach(template => {
        const clientAsset = clientAssets.find(ca => ca.templateId === template.id);
        
        // English version  
        assetsWithClientData.push({
          ...template,
          language: "English",
          languageVariants: ["English", "Spanish"],
          clientSpecific: clientAsset || null,
          downloadUrl: clientAsset ? clientAsset.personalizedFileUrl : null
        });
        
        // Spanish version
        const spanishNames: { [key: string]: string } = {
          "Executive Leader Email": "Correo Electrónico del Líder Ejecutivo",
          "Program Overview Flyer": "Folleto de Descripción del Programa", 
          "Mental Health Awareness": "Conciencia sobre Salud Mental",
          "Stress Management Tips": "Consejos para Manejo del Estrés",
          "Employee Wellness Week": "Semana de Bienestar del Empleado"
        };
        
        const spanishDescriptions: { [key: string]: string } = {
          "Ready-to-send email template for leadership announcement": "Plantilla de correo electrónico lista para enviar para anuncio de liderazgo",
          "Visual overview flyer highlighting key benefits": "Folleto visual que destaca los beneficios clave",
          "Mental health awareness campaign flyer": "Folleto de campaña de conciencia sobre salud mental",
          "Poster with stress management tips and techniques": "Póster con consejos y técnicas para el manejo del estrés",
          "Digital banner for employee wellness week promotion": "Banner digital para promoción de semana de bienestar del empleado"
        };
        
        assetsWithClientData.push({
          ...template,
          id: template.id + 1000, // Unique ID for Spanish version
          name: spanishNames[template.name] || template.name,
          description: spanishDescriptions[template.description || ""] || template.description,
          language: "Spanish",
          languageVariants: ["English", "Spanish"],
          clientSpecific: clientAsset || null,
          downloadUrl: clientAsset ? clientAsset.personalizedFileUrl : null
        });
      });

      // Add sample assets with bilingual versions
      const sampleAssetsWithLanguages = [];
      sampleVideoAssets.forEach(asset => {
        // English version
        sampleAssetsWithLanguages.push({
          ...asset,
          language: "English"
        });
        
        // Spanish version
        sampleAssetsWithLanguages.push({
          ...asset,
          id: asset.id + 2000, // Unique ID for Spanish version
          language: "Spanish"
        });
      });
      
      const allAssets = [...assetsWithClientData, ...sampleAssetsWithLanguages];

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
      // Provide categories directly while we fix the storage issue
      const categories = [
        { id: 1, name: "Intro Materials", slug: "intro-materials", description: "Introduction and overview materials", programType: "SimpleMSK", displayOrder: 1, status: "active" },
        { id: 2, name: "Launch Campaign", slug: "launch-campaign", description: "Campaign materials for program launch", programType: "SimpleMSK", displayOrder: 2, status: "active" },
        { id: 3, name: "Ongoing Promotion", slug: "ongoing-promotion", description: "Materials for ongoing program promotion", programType: "SimpleMSK", displayOrder: 3, status: "active" },
        { id: 4, name: "Videos", slug: "videos", description: "Video content and webinars", programType: "SimpleMSK", displayOrder: 4, status: "active" },
        { id: 5, name: "Intro Materials", slug: "intro-materials", description: "Introduction and overview materials", programType: "SimpleEAP", displayOrder: 1, status: "active" },
        { id: 6, name: "Launch Campaign", slug: "launch-campaign", description: "Campaign materials for program launch", programType: "SimpleEAP", displayOrder: 2, status: "active" },
        { id: 7, name: "Ongoing Promotion", slug: "ongoing-promotion", description: "Materials for ongoing program promotion", programType: "SimpleEAP", displayOrder: 3, status: "active" },
        { id: 8, name: "Videos", slug: "videos", description: "Video content and webinars", programType: "SimpleEAP", displayOrder: 4, status: "active" },
        { id: 9, name: "Intro Materials", slug: "intro-materials", description: "Introduction and overview materials", programType: "SimpleBehavioural", displayOrder: 1, status: "active" },
        { id: 10, name: "Launch Campaign", slug: "launch-campaign", description: "Campaign materials for program launch", programType: "SimpleBehavioural", displayOrder: 2, status: "active" },
        { id: 11, name: "Ongoing Promotion", slug: "ongoing-promotion", description: "Materials for ongoing program promotion", programType: "SimpleBehavioural", displayOrder: 3, status: "active" },
        { id: 12, name: "Videos", slug: "videos", description: "Video content and webinars", programType: "SimpleBehavioural", displayOrder: 4, status: "active" },
        { id: 13, name: "Intro Materials", slug: "intro-materials", description: "Introduction and overview materials", programType: "SimpleWellbeing", displayOrder: 1, status: "active" },
        { id: 14, name: "Launch Campaign", slug: "launch-campaign", description: "Campaign materials for program launch", programType: "SimpleWellbeing", displayOrder: 2, status: "active" },
        { id: 15, name: "Ongoing Promotion", slug: "ongoing-promotion", description: "Materials for ongoing program promotion", programType: "SimpleWellbeing", displayOrder: 3, status: "active" },
        { id: 16, name: "Videos", slug: "videos", description: "Video content and webinars", programType: "SimpleWellbeing", displayOrder: 4, status: "active" }
      ];
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
