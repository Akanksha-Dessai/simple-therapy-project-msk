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
  private assetTemplates: Map<number, AssetTemplate> = new Map();
  private clientAssets: Map<number, ClientAsset> = new Map();
  private users: Map<number, User> = new Map();
  private currentClientId = 1;
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

    const client3: Client = {
      id: this.currentClientId++,
      name: "HealthCare Plus",
      accessCode: "HEALTH24",
      contactEmail: "admin@healthcareplus.com",
      logoUrl: "https://images.unsplash.com/photo-1551288049-bebda4e38f71?ixlib=rb-4.0.3&auto=format&fit=crop&w=100&h=100",
      eligibilityLanguage: "Available to all staff members and immediate family",
      qrCodeUrl: null,
      programTypes: ["SimpleMSK", "SimpleBehavioural"],
      status: "pending",
      createdAt: new Date(),
      updatedAt: new Date()
    };

    this.clients.set(client1.id, client1);
    this.clients.set(client2.id, client2);
    this.clients.set(client3.id, client3);

    // Create sample asset templates
    const templates: AssetTemplate[] = [
      {
        id: this.currentTemplateId++,
        name: "Executive Leader Email",
        category: "launch",
        type: "email",
        originalFileName: "executive-email-template.docx",
        fileUrl: "/templates/executive-email.docx",
        fileType: "docx",
        version: "v2.1",
        description: "Ready-to-send email template for leadership announcement",
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        id: this.currentTemplateId++,
        name: "Program Overview Flyer",
        category: "launch",
        type: "flyer",
        originalFileName: "program-overview-flyer.pdf",
        fileUrl: "/templates/program-overview.pdf",
        fileType: "pdf",
        version: "v1.8",
        description: "Visual overview flyer highlighting key benefits",
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        id: this.currentTemplateId++,
        name: "Mental Health Awareness",
        category: "ongoing",
        type: "flyer",
        originalFileName: "mental-health-flyer.pdf",
        fileUrl: "/templates/mental-health.pdf",
        fileType: "pdf",
        version: "v3.2",
        description: "Mental health awareness campaign flyer",
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        id: this.currentTemplateId++,
        name: "Stress Management Tips",
        category: "ongoing",
        type: "poster",
        originalFileName: "stress-management-poster.png",
        fileUrl: "/templates/stress-management.png",
        fileType: "png",
        version: "v2.5",
        description: "Poster with stress management tips and techniques",
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        id: this.currentTemplateId++,
        name: "Employee Wellness Week",
        category: "ongoing",
        type: "banner",
        originalFileName: "wellness-week-banner.jpg",
        fileUrl: "/templates/wellness-week.jpg",
        fileType: "jpg",
        version: "v1.0",
        description: "Digital banner for employee wellness week promotion",
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        id: this.currentTemplateId++,
        name: "Program Introduction Video",
        categoryId: 5, // videos category
        type: "video",
        originalFileName: "program-intro-video.mp4",
        fileUrl: "/templates/program-intro.mp4",
        fileType: "mp4",
        version: "v1.0",
        description: "Engaging introduction video explaining program benefits",
        vimeoUrl: "https://vimeo.com/123456789",
        language: "English",
        languageVariants: ["English", "Spanish"],
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        id: this.currentTemplateId++,
        name: "Mental Health Awareness Video",
        categoryId: 5, // videos category
        type: "video",
        originalFileName: "mental-health-video.mp4",
        fileUrl: "/templates/mental-health-video.mp4",
        fileType: "mp4",
        version: "v2.0",
        description: "Educational video on mental health awareness",
        vimeoUrl: "https://vimeo.com/234567890",
        language: "English",
        languageVariants: ["English", "Spanish"],
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        id: this.currentTemplateId++,
        name: "Employee Testimonials",
        categoryId: 5, // videos category
        type: "video",
        originalFileName: "testimonials-video.mp4",
        fileUrl: "/templates/testimonials.mp4",
        fileType: "mp4",
        version: "v1.5",
        description: "Real employee stories and testimonials",
        vimeoUrl: "https://vimeo.com/345678901",
        language: "English",
        languageVariants: ["English", "Spanish"],
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        id: this.currentTemplateId++,
        name: "Employee Handbook",
        category: "launch",
        type: "document",
        originalFileName: "employee-handbook.pdf",
        fileUrl: "/templates/employee-handbook.pdf",
        fileType: "pdf",
        version: "v4.0",
        description: "Complete employee handbook with program details",
        language: "English",
        languageVariants: ["English", "Spanish"],
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        id: this.currentTemplateId++,
        name: "Social Media Banner",
        category: "ongoing",
        type: "banner",
        originalFileName: "social-media-banner.png",
        fileUrl: "/templates/social-banner.png",
        fileType: "png",
        version: "v1.5",
        description: "Banner optimized for social media platforms",
        language: "English",
        languageVariants: ["English", "Spanish"],
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        id: this.currentTemplateId++,
        name: "Wellness Workshop Poster",
        category: "ongoing",
        type: "poster",
        originalFileName: "workshop-poster.jpg",
        fileUrl: "/templates/workshop-poster.jpg",
        fileType: "jpg",
        version: "v2.0",
        description: "Eye-catching poster for wellness workshops",
        language: "English",
        languageVariants: ["English", "Spanish"],
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        id: this.currentTemplateId++,
        name: "Manager Toolkit",
        category: "launch",
        type: "document",
        originalFileName: "manager-toolkit.docx",
        fileUrl: "/templates/manager-toolkit.docx",
        fileType: "docx",
        version: "v3.1",
        description: "Comprehensive toolkit for managers and supervisors",
        language: "English",
        languageVariants: ["English", "Spanish"],
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        id: this.currentTemplateId++,
        name: "Website Header Banner",
        category: "launch",
        type: "banner",
        originalFileName: "website-header.jpg",
        fileUrl: "/templates/website-header.jpg",
        fileType: "jpg",
        version: "v1.3",
        description: "Header banner for internal website integration",
        language: "English",
        languageVariants: ["English", "Spanish"],
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        id: this.currentTemplateId++,
        name: "Benefits Enrollment Flyer",
        category: "launch",
        type: "flyer",
        originalFileName: "benefits-flyer.pdf",
        fileUrl: "/templates/benefits-flyer.pdf",
        fileType: "pdf",
        version: "v2.2",
        description: "Flyer explaining enrollment process and benefits",
        language: "English",
        languageVariants: ["English", "Spanish"],
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        id: this.currentTemplateId++,
        name: "Wellness Program Presentation",
        category: "launch",
        type: "presentation",
        originalFileName: "wellness-presentation.pptx",
        fileUrl: "/templates/wellness-presentation.pptx",
        fileType: "pptx",
        version: "v3.0",
        description: "Comprehensive presentation slides for wellness program introduction",
        language: "English",
        languageVariants: ["English", "Spanish"],
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        id: this.currentTemplateId++,
        name: "Mental Health Webinar Recording",
        category: "ongoing",
        type: "webinar",
        originalFileName: "mental-health-webinar.mp4",
        fileUrl: "/templates/mental-health-webinar.mp4",
        fileType: "mp4",
        version: "v1.0",
        description: "Expert-led webinar on mental health best practices",
        language: "English",
        languageVariants: ["English", "Spanish"],
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        id: this.currentTemplateId++,
        name: "Monthly Wellness Newsletter",
        category: "ongoing",
        type: "newsletter",
        originalFileName: "wellness-newsletter.pdf",
        fileUrl: "/templates/wellness-newsletter.pdf",
        fileType: "pdf",
        version: "v2.1",
        description: "Monthly newsletter with wellness tips and program updates",
        language: "English",
        languageVariants: ["English", "Spanish"],
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        id: this.currentTemplateId++,
        name: "Digital Display Screen Content",
        category: "ongoing",
        type: "virtual-display",
        originalFileName: "digital-display.jpg",
        fileUrl: "/templates/digital-display.jpg",
        fileType: "jpg",
        version: "v1.5",
        description: "Content optimized for office digital displays and monitors",
        language: "English",
        languageVariants: ["English", "Spanish"],
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        id: this.currentTemplateId++,
        name: "Leadership Training Presentation",
        category: "launch",
        type: "presentation",
        originalFileName: "leadership-training.pptx",
        fileUrl: "/templates/leadership-training.pptx",
        fileType: "pptx",
        version: "v2.0",
        description: "Training presentation for managers and team leaders",
        language: "English",
        languageVariants: ["English", "Spanish"],
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

  // Asset template operations
  async createAssetTemplate(template: InsertAssetTemplate): Promise<AssetTemplate> {
    const newTemplate: AssetTemplate = {
      ...template,
      id: this.currentTemplateId++,
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

  async getAssetTemplatesByCategory(category: string): Promise<AssetTemplate[]> {
    return Array.from(this.assetTemplates.values()).filter(template => template.category === category);
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
      id: this.currentUserId++
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

// Use the working storage for now
export const storage = new MemStorage();
