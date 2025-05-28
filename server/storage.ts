import type { 
  Client, InsertClient,
  AssetCategory, InsertAssetCategory,
  AssetTemplate, InsertAssetTemplate,
  ClientAsset, InsertClientAsset,
  User, InsertUser 
} from "../shared/schema.js";

export interface IStorage {
  // Client operations
  createClient(client: InsertClient): Promise<Client>;
  getClient(id: number): Promise<Client | undefined>;
  getClientByAccessCode(accessCode: string): Promise<Client | undefined>;
  getAllClients(): Promise<Client[]>;
  updateClient(id: number, updates: Partial<InsertClient>): Promise<Client | undefined>;
  deleteClient(id: number): Promise<boolean>;

  // Asset category operations
  createAssetCategory(category: InsertAssetCategory): Promise<AssetCategory>;
  getAssetCategory(id: number): Promise<AssetCategory | undefined>;
  getAllAssetCategories(): Promise<AssetCategory[]>;
  getAssetCategoriesByProgram(programType: string): Promise<AssetCategory[]>;
  updateAssetCategory(id: number, updates: Partial<InsertAssetCategory>): Promise<AssetCategory | undefined>;
  deleteAssetCategory(id: number): Promise<boolean>;

  // Asset template operations
  createAssetTemplate(template: InsertAssetTemplate): Promise<AssetTemplate>;
  getAssetTemplate(id: number): Promise<AssetTemplate | undefined>;
  getAllAssetTemplates(): Promise<AssetTemplate[]>;
  getAssetTemplatesByCategory(categoryId: number): Promise<AssetTemplate[]>;
  updateAssetTemplate(id: number, updates: Partial<InsertAssetTemplate>): Promise<AssetTemplate | undefined>;
  deleteAssetTemplate(id: number): Promise<boolean>;

  // Client asset operations
  createClientAsset(clientAsset: InsertClientAsset): Promise<ClientAsset>;
  getClientAssets(clientId: number): Promise<ClientAsset[]>;
  getClientAssetsByTemplate(templateId: number): Promise<ClientAsset[]>;
  updateClientAssetDownload(id: number): Promise<ClientAsset | undefined>;

  // User operations
  createUser(user: InsertUser): Promise<User>;
  getUser(id: number): Promise<User | undefined>;
  getUserByUsername(username: string): Promise<User | undefined>;
}

export class MemStorage implements IStorage {
  private clients: Map<number, Client> = new Map();
  private assetCategories: Map<number, AssetCategory> = new Map();
  private assetTemplates: Map<number, AssetTemplate> = new Map();
  private clientAssets: Map<number, ClientAsset> = new Map();
  private users: Map<number, User> = new Map();
  private currentClientId = 1;
  private currentCategoryId = 1;
  private currentTemplateId = 1;
  private currentAssetId = 1;
  private currentUserId = 1;

  constructor() {
    this.seedData();
  }

  private seedData() {
    // Create admin user
    const adminUser: User = {
      id: this.currentUserId++,
      username: "admin",
      password: "admin123",
      role: "admin"
    };
    this.users.set(adminUser.id, adminUser);

    // Create sample clients
    const client1: Client = {
      id: this.currentClientId++,
      name: "Acme Corporation",
      accessCode: "ACME2024",
      contactEmail: "john.doe@acme.com",
      logoUrl: "https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?ixlib=rb-4.0.3&auto=format&fit=crop&w=100&h=100",
      eligibilityLanguage: "Available to all full-time employees and their families",
      qrCodeUrl: null,
      programTypes: ["SimpleMSK", "SimpleEAP", "SimpleBehavioural", "SimpleWellbeing"],
      status: "active",
      createdAt: new Date(),
      updatedAt: new Date()
    };

    const client2: Client = {
      id: this.currentClientId++,
      name: "TechStart Inc",
      accessCode: "TECH2024",
      contactEmail: "sarah.wilson@techstart.com",
      logoUrl: "https://images.unsplash.com/photo-1497366216548-37526070297c?ixlib=rb-4.0.3&auto=format&fit=crop&w=100&h=100",
      eligibilityLanguage: "Available to all employees working 20+ hours per week",
      qrCodeUrl: null,
      programTypes: ["SimpleEAP", "SimpleWellbeing"],
      status: "active",
      createdAt: new Date(),
      updatedAt: new Date()
    };

    this.clients.set(client1.id, client1);
    this.clients.set(client2.id, client2);

    // Create default categories for each program
    const categories: AssetCategory[] = [
      // SimpleMSK Categories
      { id: this.currentCategoryId++, name: "Intro Materials", slug: "intro-materials", description: "Introduction and overview materials", programType: "SimpleMSK", displayOrder: 1, status: "active", createdAt: new Date(), updatedAt: new Date() },
      { id: this.currentCategoryId++, name: "Launch Campaign", slug: "launch-campaign", description: "Campaign materials for program launch", programType: "SimpleMSK", displayOrder: 2, status: "active", createdAt: new Date(), updatedAt: new Date() },
      { id: this.currentCategoryId++, name: "Ongoing Promotion", slug: "ongoing-promotion", description: "Materials for ongoing program promotion", programType: "SimpleMSK", displayOrder: 3, status: "active", createdAt: new Date(), updatedAt: new Date() },
      { id: this.currentCategoryId++, name: "Videos", slug: "videos", description: "Video content and webinars", programType: "SimpleMSK", displayOrder: 4, status: "active", createdAt: new Date(), updatedAt: new Date() },
      
      // SimpleEAP Categories
      { id: this.currentCategoryId++, name: "Intro Materials", slug: "intro-materials", description: "Introduction and overview materials", programType: "SimpleEAP", displayOrder: 1, status: "active", createdAt: new Date(), updatedAt: new Date() },
      { id: this.currentCategoryId++, name: "Launch Campaign", slug: "launch-campaign", description: "Campaign materials for program launch", programType: "SimpleEAP", displayOrder: 2, status: "active", createdAt: new Date(), updatedAt: new Date() },
      { id: this.currentCategoryId++, name: "Ongoing Promotion", slug: "ongoing-promotion", description: "Materials for ongoing program promotion", programType: "SimpleEAP", displayOrder: 3, status: "active", createdAt: new Date(), updatedAt: new Date() },
      { id: this.currentCategoryId++, name: "Videos", slug: "videos", description: "Video content and webinars", programType: "SimpleEAP", displayOrder: 4, status: "active", createdAt: new Date(), updatedAt: new Date() },
      
      // SimpleBehavioural Categories
      { id: this.currentCategoryId++, name: "Intro Materials", slug: "intro-materials", description: "Introduction and overview materials", programType: "SimpleBehavioural", displayOrder: 1, status: "active", createdAt: new Date(), updatedAt: new Date() },
      { id: this.currentCategoryId++, name: "Launch Campaign", slug: "launch-campaign", description: "Campaign materials for program launch", programType: "SimpleBehavioural", displayOrder: 2, status: "active", createdAt: new Date(), updatedAt: new Date() },
      { id: this.currentCategoryId++, name: "Ongoing Promotion", slug: "ongoing-promotion", description: "Materials for ongoing program promotion", programType: "SimpleBehavioural", displayOrder: 3, status: "active", createdAt: new Date(), updatedAt: new Date() },
      { id: this.currentCategoryId++, name: "Videos", slug: "videos", description: "Video content and webinars", programType: "SimpleBehavioural", displayOrder: 4, status: "active", createdAt: new Date(), updatedAt: new Date() },
      
      // SimpleWellbeing Categories
      { id: this.currentCategoryId++, name: "Intro Materials", slug: "intro-materials", description: "Introduction and overview materials", programType: "SimpleWellbeing", displayOrder: 1, status: "active", createdAt: new Date(), updatedAt: new Date() },
      { id: this.currentCategoryId++, name: "Launch Campaign", slug: "launch-campaign", description: "Campaign materials for program launch", programType: "SimpleWellbeing", displayOrder: 2, status: "active", createdAt: new Date(), updatedAt: new Date() },
      { id: this.currentCategoryId++, name: "Ongoing Promotion", slug: "ongoing-promotion", description: "Materials for ongoing program promotion", programType: "SimpleWellbeing", displayOrder: 3, status: "active", createdAt: new Date(), updatedAt: new Date() },
      { id: this.currentCategoryId++, name: "Videos", slug: "videos", description: "Video content and webinars", programType: "SimpleWellbeing", displayOrder: 4, status: "active", createdAt: new Date(), updatedAt: new Date() }
    ];

    categories.forEach(category => {
      this.assetCategories.set(category.id, category);
    });

    // Create sample asset templates
    const templates: AssetTemplate[] = [
      {
        id: this.currentTemplateId++,
        name: "MSK Welcome Brochure",
        categoryId: 1,
        type: "document",
        originalFileName: "msk-welcome-brochure.pdf",
        fileUrl: "/templates/msk-welcome-brochure.pdf",
        fileType: "pdf",
        version: "v1.2",
        description: "Introduction brochure with MSK program overview",
        language: "English",
        languageVariants: ["English", "Spanish"],
        vimeoUrl: null,
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        id: this.currentTemplateId++,
        name: "MSK Launch Poster",
        categoryId: 2,
        type: "poster",
        originalFileName: "msk-launch-poster.jpg",
        fileUrl: "/templates/msk-launch-poster.jpg",
        fileType: "jpg",
        version: "v1.0",
        description: "Eye-catching poster to announce MSK program launch",
        language: "English",
        languageVariants: ["English", "Spanish"],
        vimeoUrl: null,
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        id: this.currentTemplateId++,
        name: "Program Introduction Video",
        categoryId: 4,
        type: "video",
        originalFileName: "program-intro.mp4",
        fileUrl: "/templates/program-intro.mp4",
        fileType: "mp4",
        version: "v1.0",
        description: "Video introduction to MSK program benefits",
        language: "English",
        languageVariants: ["English", "Spanish"],
        vimeoUrl: "https://vimeo.com/123456789",
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        id: this.currentTemplateId++,
        name: "Welcome Presentation",
        categoryId: 1,
        type: "presentation",
        originalFileName: "welcome-presentation.pptx",
        fileUrl: "/templates/welcome-presentation.pptx",
        fileType: "pptx",
        version: "v2.5",
        description: "Comprehensive presentation introducing wellness benefits",
        language: "English",
        languageVariants: ["English", "Spanish"],
        vimeoUrl: null,
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        id: this.currentTemplateId++,
        name: "Launch Email Template",
        categoryId: 2,
        type: "email",
        originalFileName: "launch-email.html",
        fileUrl: "/templates/launch-email.html",
        fileType: "html",
        version: "v2.0",
        description: "Professional email template for program announcements",
        language: "English",
        languageVariants: ["English", "Spanish"],
        vimeoUrl: null,
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        id: this.currentTemplateId++,
        name: "Program Launch Banner",
        categoryId: 2,
        type: "banner",
        originalFileName: "launch-banner.jpg",
        fileUrl: "/banners/launch-banner.jpg",
        fileType: "jpg",
        version: "v1.0",
        description: "Eye-catching web banner for program promotion",
        language: "English",
        languageVariants: ["English", "Spanish"],
        vimeoUrl: null,
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        id: this.currentTemplateId++,
        name: "Monthly Wellness Newsletter",
        categoryId: 3,
        type: "newsletter",
        originalFileName: "wellness-newsletter.pdf",
        fileUrl: "/newsletters/wellness-newsletter.pdf",
        fileType: "pdf",
        version: "v3.1",
        description: "Monthly tips for maintaining workplace wellness",
        language: "English",
        languageVariants: ["English", "Spanish"],
        vimeoUrl: null,
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        id: this.currentTemplateId++,
        name: "Health Tips Flyer",
        categoryId: 3,
        type: "flyer",
        originalFileName: "health-tips.pdf",
        fileUrl: "/flyers/health-tips.pdf",
        fileType: "pdf",
        version: "v1.4",
        description: "Colorful flyer with daily wellness tips",
        language: "English",
        languageVariants: ["English", "Spanish"],
        vimeoUrl: null,
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        id: this.currentTemplateId++,
        name: "Virtual Display Screen",
        categoryId: 3,
        type: "virtual_display",
        originalFileName: "wellness-display.jpg",
        fileUrl: "/displays/wellness-display.jpg",
        fileType: "jpg",
        version: "v1.7",
        description: "Digital display for lobby screens and virtual environments",
        language: "English",
        languageVariants: ["English", "Spanish"],
        vimeoUrl: null,
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        id: this.currentTemplateId++,
        name: "Exercise Tutorial Series",
        categoryId: 4,
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
        updatedAt: new Date()
      },
      {
        id: this.currentTemplateId++,
        name: "Stress Management Webinar",
        categoryId: 4,
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
        updatedAt: new Date()
      }
    ];

    templates.forEach(template => {
      this.assetTemplates.set(template.id, template);
    });
  }

  // Client operations
  async createClient(client: InsertClient): Promise<Client> {
    const newClient: Client = {
      ...client,
      id: this.currentClientId++,
      logoUrl: client.logoUrl || null,
      qrCodeUrl: client.qrCodeUrl || null,
      status: client.status || "active",
      programTypes: client.programTypes || [],
      createdAt: new Date(),
      updatedAt: new Date()
    };
    this.clients.set(newClient.id, newClient);
    return newClient;
  }

  async getClient(id: number): Promise<Client | undefined> {
    return this.clients.get(id);
  }

  async getClientByAccessCode(accessCode: string): Promise<Client | undefined> {
    return Array.from(this.clients.values()).find(client => client.accessCode === accessCode);
  }

  async getAllClients(): Promise<Client[]> {
    return Array.from(this.clients.values());
  }

  async updateClient(id: number, updates: Partial<InsertClient>): Promise<Client | undefined> {
    const client = this.clients.get(id);
    if (!client) return undefined;
    
    const updatedClient = { ...client, ...updates, updatedAt: new Date() };
    this.clients.set(id, updatedClient);
    return updatedClient;
  }

  async deleteClient(id: number): Promise<boolean> {
    return this.clients.delete(id);
  }

  // Asset Category operations
  async createAssetCategory(category: InsertAssetCategory): Promise<AssetCategory> {
    const newCategory: AssetCategory = {
      id: this.currentCategoryId++,
      ...category,
      status: category.status || "active",
      description: category.description || null,
      displayOrder: category.displayOrder || 1,
      createdAt: new Date(),
      updatedAt: new Date()
    };
    this.assetCategories.set(newCategory.id, newCategory);
    return newCategory;
  }

  async getAssetCategory(id: number): Promise<AssetCategory | undefined> {
    return this.assetCategories.get(id);
  }

  async getAllAssetCategories(): Promise<AssetCategory[]> {
    return Array.from(this.assetCategories.values());
  }

  async getAssetCategoriesByProgram(programType: string): Promise<AssetCategory[]> {
    return Array.from(this.assetCategories.values())
      .filter(category => category.programType === programType);
  }

  async updateAssetCategory(id: number, updates: Partial<InsertAssetCategory>): Promise<AssetCategory | undefined> {
    const category = this.assetCategories.get(id);
    if (!category) return undefined;

    const updatedCategory = {
      ...category,
      ...updates,
      updatedAt: new Date()
    };
    this.assetCategories.set(id, updatedCategory);
    return updatedCategory;
  }

  async deleteAssetCategory(id: number): Promise<boolean> {
    return this.assetCategories.delete(id);
  }

  // Asset template operations
  async createAssetTemplate(template: InsertAssetTemplate): Promise<AssetTemplate> {
    const newTemplate: AssetTemplate = {
      ...template,
      id: this.currentTemplateId++,
      description: template.description || null,
      language: template.language || "English",
      languageVariants: template.languageVariants || ["English"],
      vimeoUrl: template.vimeoUrl || null,
      createdAt: new Date(),
      updatedAt: new Date()
    };
    this.assetTemplates.set(newTemplate.id, newTemplate);
    return newTemplate;
  }

  async getAssetTemplate(id: number): Promise<AssetTemplate | undefined> {
    return this.assetTemplates.get(id);
  }

  async getAllAssetTemplates(): Promise<AssetTemplate[]> {
    return Array.from(this.assetTemplates.values());
  }

  async getAssetTemplatesByCategory(categoryId: number): Promise<AssetTemplate[]> {
    return Array.from(this.assetTemplates.values()).filter(template => template.categoryId === categoryId);
  }

  async updateAssetTemplate(id: number, updates: Partial<InsertAssetTemplate>): Promise<AssetTemplate | undefined> {
    const template = this.assetTemplates.get(id);
    if (!template) return undefined;
    
    const updatedTemplate = { ...template, ...updates, updatedAt: new Date() };
    this.assetTemplates.set(id, updatedTemplate);
    return updatedTemplate;
  }

  async deleteAssetTemplate(id: number): Promise<boolean> {
    return this.assetTemplates.delete(id);
  }

  // Client asset operations
  async createClientAsset(clientAsset: InsertClientAsset): Promise<ClientAsset> {
    const newAsset: ClientAsset = {
      id: this.currentAssetId++,
      ...clientAsset,
      downloadCount: clientAsset.downloadCount || 0,
      lastDownloaded: clientAsset.lastDownloaded || null,
      createdAt: new Date()
    };
    this.clientAssets.set(newAsset.id, newAsset);
    return newAsset;
  }

  async getClientAssets(clientId: number): Promise<ClientAsset[]> {
    return Array.from(this.clientAssets.values()).filter(asset => asset.clientId === clientId);
  }

  async getClientAssetsByTemplate(templateId: number): Promise<ClientAsset[]> {
    return Array.from(this.clientAssets.values()).filter(asset => asset.templateId === templateId);
  }

  async updateClientAssetDownload(id: number): Promise<ClientAsset | undefined> {
    const asset = this.clientAssets.get(id);
    if (!asset) return undefined;
    
    const updatedAsset = { 
      ...asset, 
      downloadCount: (asset.downloadCount || 0) + 1, 
      lastDownloaded: new Date() 
    };
    this.clientAssets.set(id, updatedAsset);
    return updatedAsset;
  }

  // User operations
  async createUser(user: InsertUser): Promise<User> {
    const newUser: User = {
      id: this.currentUserId++,
      ...user,
      role: user.role || "user"
    };
    this.users.set(newUser.id, newUser);
    return newUser;
  }

  async getUser(id: number): Promise<User | undefined> {
    return this.users.get(id);
  }

  async getUserByUsername(username: string): Promise<User | undefined> {
    return Array.from(this.users.values()).find(user => user.username === username);
  }
}

// DatabaseStorage implementation for PostgreSQL
export class DatabaseStorage implements IStorage {
  // Import the database connection
  private db = require('./db').db;

  // Client operations
  async createClient(client: InsertClient): Promise<Client> {
    const { clients } = await import('../shared/schema.js');
    const [newClient] = await this.db.insert(clients).values(client).returning();
    return newClient;
  }

  async getClient(id: number): Promise<Client | undefined> {
    const { clients } = await import('../shared/schema.js');
    const { eq } = await import('drizzle-orm');
    const [client] = await this.db.select().from(clients).where(eq(clients.id, id));
    return client || undefined;
  }

  async getClientByAccessCode(accessCode: string): Promise<Client | undefined> {
    const { clients } = await import('../shared/schema.js');
    const { eq } = await import('drizzle-orm');
    const [client] = await this.db.select().from(clients).where(eq(clients.accessCode, accessCode));
    return client || undefined;
  }

  async getAllClients(): Promise<Client[]> {
    const { clients } = await import('../shared/schema.js');
    return await this.db.select().from(clients);
  }

  async updateClient(id: number, updates: Partial<InsertClient>): Promise<Client | undefined> {
    const { clients } = await import('../shared/schema.js');
    const { eq } = await import('drizzle-orm');
    const [updatedClient] = await this.db
      .update(clients)
      .set(updates)
      .where(eq(clients.id, id))
      .returning();
    return updatedClient || undefined;
  }

  async deleteClient(id: number): Promise<boolean> {
    const { clients } = await import('../shared/schema.js');
    const { eq } = await import('drizzle-orm');
    const result = await this.db.delete(clients).where(eq(clients.id, id));
    return result.rowCount > 0;
  }

  // Asset category operations
  async createAssetCategory(category: InsertAssetCategory): Promise<AssetCategory> {
    const { assetCategories } = await import('../shared/schema.js');
    const [newCategory] = await this.db.insert(assetCategories).values(category).returning();
    return newCategory;
  }

  async getAssetCategory(id: number): Promise<AssetCategory | undefined> {
    const { assetCategories } = await import('../shared/schema.js');
    const { eq } = await import('drizzle-orm');
    const [category] = await this.db.select().from(assetCategories).where(eq(assetCategories.id, id));
    return category || undefined;
  }

  async getAllAssetCategories(): Promise<AssetCategory[]> {
    const { assetCategories } = await import('../shared/schema.js');
    return await this.db.select().from(assetCategories).orderBy(assetCategories.displayOrder);
  }

  async getAssetCategoriesByProgram(programType: string): Promise<AssetCategory[]> {
    const { assetCategories } = await import('../shared/schema.js');
    const { sql } = await import('drizzle-orm');
    return await this.db
      .select()
      .from(assetCategories)
      .where(sql`${assetCategories.programType} @> ARRAY[${programType}]`)
      .orderBy(assetCategories.displayOrder);
  }

  async updateAssetCategory(id: number, updates: Partial<InsertAssetCategory>): Promise<AssetCategory | undefined> {
    const { assetCategories } = await import('../shared/schema.js');
    const { eq } = await import('drizzle-orm');
    const [updatedCategory] = await this.db
      .update(assetCategories)
      .set(updates)
      .where(eq(assetCategories.id, id))
      .returning();
    return updatedCategory || undefined;
  }

  async deleteAssetCategory(id: number): Promise<boolean> {
    const { assetCategories } = await import('../shared/schema.js');
    const { eq } = await import('drizzle-orm');
    const result = await this.db.delete(assetCategories).where(eq(assetCategories.id, id));
    return result.rowCount > 0;
  }

  // Asset template operations
  async createAssetTemplate(template: InsertAssetTemplate): Promise<AssetTemplate> {
    const { assetTemplates } = await import('../shared/schema.js');
    const [newTemplate] = await this.db.insert(assetTemplates).values(template).returning();
    return newTemplate;
  }

  async getAssetTemplate(id: number): Promise<AssetTemplate | undefined> {
    const { assetTemplates } = await import('../shared/schema.js');
    const { eq } = await import('drizzle-orm');
    const [template] = await this.db.select().from(assetTemplates).where(eq(assetTemplates.id, id));
    return template || undefined;
  }

  async getAllAssetTemplates(): Promise<AssetTemplate[]> {
    const { assetTemplates } = await import('../shared/schema.js');
    return await this.db.select().from(assetTemplates);
  }

  async getAssetTemplatesByCategory(categoryId: number): Promise<AssetTemplate[]> {
    const { assetTemplates } = await import('../shared/schema.js');
    const { eq } = await import('drizzle-orm');
    return await this.db.select().from(assetTemplates).where(eq(assetTemplates.categoryId, categoryId));
  }

  async updateAssetTemplate(id: number, updates: Partial<InsertAssetTemplate>): Promise<AssetTemplate | undefined> {
    const { assetTemplates } = await import('../shared/schema.js');
    const { eq } = await import('drizzle-orm');
    const [updatedTemplate] = await this.db
      .update(assetTemplates)
      .set(updates)
      .where(eq(assetTemplates.id, id))
      .returning();
    return updatedTemplate || undefined;
  }

  async deleteAssetTemplate(id: number): Promise<boolean> {
    const { assetTemplates } = await import('../shared/schema.js');
    const { eq } = await import('drizzle-orm');
    const result = await this.db.delete(assetTemplates).where(eq(assetTemplates.id, id));
    return result.rowCount > 0;
  }

  // Client asset operations
  async createClientAsset(clientAsset: InsertClientAsset): Promise<ClientAsset> {
    const { clientAssets } = await import('../shared/schema.js');
    const [newAsset] = await this.db.insert(clientAssets).values(clientAsset).returning();
    return newAsset;
  }

  async getClientAssets(clientId: number): Promise<ClientAsset[]> {
    const { clientAssets } = await import('../shared/schema.js');
    const { eq } = await import('drizzle-orm');
    return await this.db.select().from(clientAssets).where(eq(clientAssets.clientId, clientId));
  }

  async getClientAssetsByTemplate(templateId: number): Promise<ClientAsset[]> {
    const { clientAssets } = await import('../shared/schema.js');
    const { eq } = await import('drizzle-orm');
    return await this.db.select().from(clientAssets).where(eq(clientAssets.templateId, templateId));
  }

  async updateClientAssetDownload(id: number): Promise<ClientAsset | undefined> {
    const { clientAssets } = await import('../shared/schema.js');
    const { eq, sql } = await import('drizzle-orm');
    const [updatedAsset] = await this.db
      .update(clientAssets)
      .set({
        downloadCount: sql`${clientAssets.downloadCount} + 1`,
        lastDownloaded: new Date()
      })
      .where(eq(clientAssets.id, id))
      .returning();
    return updatedAsset || undefined;
  }

  // User operations
  async createUser(user: InsertUser): Promise<User> {
    const { users } = await import('../shared/schema.js');
    const [newUser] = await this.db.insert(users).values(user).returning();
    return newUser;
  }

  async getUser(id: number): Promise<User | undefined> {
    const { users } = await import('../shared/schema.js');
    const { eq } = await import('drizzle-orm');
    const [user] = await this.db.select().from(users).where(eq(users.id, id));
    return user || undefined;
  }

  async getUserByUsername(username: string): Promise<User | undefined> {
    const { users } = await import('../shared/schema.js');
    const { eq } = await import('drizzle-orm');
    const [user] = await this.db.select().from(users).where(eq(users.username, username));
    return user || undefined;
  }
}

// Use MemStorage by default for development, change to DatabaseStorage for production
export const storage = new MemStorage();
// To use PostgreSQL database, uncomment the line below and comment the line above:
// export const storage = new DatabaseStorage();