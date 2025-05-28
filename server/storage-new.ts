import { 
  clients, 
  assetCategories,
  assetTemplates, 
  clientAssets, 
  users,
  type Client, 
  type InsertClient,
  type AssetCategory,
  type InsertAssetCategory,
  type AssetTemplate,
  type InsertAssetTemplate,
  type ClientAsset,
  type InsertClientAsset,
  type User,
  type InsertUser
} from "@shared/schema";

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
      password: "admin123", // In production, this should be hashed
      role: "admin"
    };
    this.users.set(adminUser.id, adminUser);

    // Create sample clients with program types
    const client1: Client = {
      id: this.currentClientId++,
      name: "Acme Corporation",
      accessCode: "ACME2024",
      contactEmail: "john.doe@acme.com",
      logoUrl: "https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?ixlib=rb-4.0.3&auto=format&fit=crop&w=100&h=100",
      eligibilityLanguage: "Available to all full-time employees and their families",
      qrCodeUrl: null,
      programTypes: ["SimpleMSK", "SimpleEAP"],
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
      programTypes: ["SimpleBehavioural", "SimpleWellbeing"],
      status: "active",
      createdAt: new Date(),
      updatedAt: new Date()
    };

    const client3: Client = {
      id: this.currentClientId++,
      name: "HealthCare Plus",
      accessCode: "HEALTH24",
      contactEmail: "admin@healthcareplus.com",
      logoUrl: "https://images.unsplash.com/photo-1551288049-bebda4e38f71?ixlib=rb-4.0.3&auto=format&fit=crop&w=100&h=100",
      eligibilityLanguage: "Available to all staff members and immediate family",
      qrCodeUrl: null,
      programTypes: ["SimpleMSK"],
      status: "pending",
      createdAt: new Date(),
      updatedAt: new Date()
    };

    this.clients.set(client1.id, client1);
    this.clients.set(client2.id, client2);
    this.clients.set(client3.id, client3);

    // Create asset categories for different programs
    const categories: AssetCategory[] = [
      // SimpleMSK Categories
      {
        id: this.currentCategoryId++,
        name: "Intro Materials",
        slug: "intro-materials",
        description: "Essential materials to introduce the program",
        programType: "SimpleMSK",
        displayOrder: 1,
        status: "active",
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        id: this.currentCategoryId++,
        name: "Program Features",
        slug: "program-features",
        description: "Materials highlighting specific program features",
        programType: "SimpleMSK",
        displayOrder: 2,
        status: "active",
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        id: this.currentCategoryId++,
        name: "2025 Calendar Promos",
        slug: "calendar-promos",
        description: "Monthly promotional calendar materials",
        programType: "SimpleMSK",
        displayOrder: 3,
        status: "active",
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        id: this.currentCategoryId++,
        name: "Campaigns",
        slug: "campaigns",
        description: "Awareness campaigns and topic-specific materials",
        programType: "SimpleMSK",
        displayOrder: 4,
        status: "active",
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        id: this.currentCategoryId++,
        name: "Interactive Toolkits",
        slug: "interactive-toolkits",
        description: "Interactive digital resources and toolkits",
        programType: "SimpleMSK",
        displayOrder: 5,
        status: "active",
        createdAt: new Date(),
        updatedAt: new Date()
      },
      // SimpleEAP Categories
      {
        id: this.currentCategoryId++,
        name: "Intro Materials",
        slug: "eap-intro-materials",
        description: "EAP program introduction materials",
        programType: "SimpleEAP",
        displayOrder: 1,
        status: "active",
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        id: this.currentCategoryId++,
        name: "2025 Calendar Promos",
        slug: "eap-calendar-promos",
        description: "EAP monthly promotional materials",
        programType: "SimpleEAP",
        displayOrder: 2,
        status: "active",
        createdAt: new Date(),
        updatedAt: new Date()
      }
    ];

    categories.forEach(category => {
      this.assetCategories.set(category.id, category);
    });

    // Create sample asset templates linked to categories
    const templates: AssetTemplate[] = [
      {
        id: this.currentTemplateId++,
        name: "Program flyer",
        categoryId: 1, // Intro Materials
        type: "flyer",
        originalFileName: "program-flyer.pdf",
        fileUrl: "/templates/program-flyer.pdf",
        fileType: "pdf",
        version: "v2.1",
        description: "Visual overview flyer highlighting key benefits",
        supportedLanguages: ["English", "Spanish"],
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        id: this.currentTemplateId++,
        name: "Supervisor intro letter",
        categoryId: 1, // Intro Materials
        type: "email",
        originalFileName: "supervisor-intro.docx",
        fileUrl: "/templates/supervisor-intro.docx",
        fileType: "docx",
        version: "v1.8",
        description: "Introduction letter for supervisors",
        supportedLanguages: ["English", "Spanish"],
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        id: this.currentTemplateId++,
        name: "January Flyer 2025",
        categoryId: 3, // Calendar Promos
        type: "flyer",
        originalFileName: "january-2025-flyer.pdf",
        fileUrl: "/templates/january-2025.pdf",
        fileType: "pdf",
        version: "v1.0",
        description: "January 2025 promotional flyer",
        supportedLanguages: ["English", "Spanish"],
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        id: this.currentTemplateId++,
        name: "Mental Health Awareness",
        categoryId: 4, // Campaigns
        type: "flyer",
        originalFileName: "mental-health-campaign.pdf",
        fileUrl: "/templates/mental-health.pdf",
        fileType: "pdf",
        version: "v3.2",
        description: "Mental health awareness campaign materials",
        supportedLanguages: ["English", "Spanish"],
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        id: this.currentTemplateId++,
        name: "Grief and Loss Toolkit",
        categoryId: 5, // Interactive Toolkits
        type: "toolkit",
        originalFileName: "grief-loss-toolkit.pdf",
        fileUrl: "/templates/grief-loss-toolkit.pdf",
        fileType: "pdf",
        version: "v2.0",
        description: "Interactive toolkit for grief and loss support",
        supportedLanguages: ["English", "Spanish"],
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
      programTypes: client.programTypes || ["SimpleMSK"],
      status: client.status || "active",
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

  // Asset category operations
  async createAssetCategory(category: InsertAssetCategory): Promise<AssetCategory> {
    const newCategory: AssetCategory = {
      ...category,
      id: this.currentCategoryId++,
      description: category.description || null,
      displayOrder: category.displayOrder || 0,
      status: category.status || "active",
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
      .filter(category => category.programType === programType && category.status === "active")
      .sort((a, b) => a.displayOrder - b.displayOrder);
  }

  async updateAssetCategory(id: number, updates: Partial<InsertAssetCategory>): Promise<AssetCategory | undefined> {
    const category = this.assetCategories.get(id);
    if (!category) return undefined;
    
    const updatedCategory = { ...category, ...updates, updatedAt: new Date() };
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
      supportedLanguages: template.supportedLanguages || ["English"],
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
      ...clientAsset,
      id: this.currentAssetId++,
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
      ...user,
      id: this.currentUserId++,
      role: user.role || "admin"
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