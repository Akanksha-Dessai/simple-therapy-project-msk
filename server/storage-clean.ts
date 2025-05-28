import type { 
  Client, InsertClient,
  AssetCategory, InsertAssetCategory,
  AssetTemplate, InsertAssetTemplate,
  ClientAsset, InsertClientAsset,
  User, InsertUser 
} from "../shared/schema";

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

export const storage = new MemStorage();