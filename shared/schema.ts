import { pgTable, text, serial, integer, boolean, timestamp } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

export const clients = pgTable("clients", {
  id: serial("id").primaryKey(),
  name: text("name").notNull(),
  accessCode: text("access_code").notNull().unique(),
  contactEmail: text("contact_email").notNull(),
  logoUrl: text("logo_url"),
  eligibilityLanguage: text("eligibility_language").notNull(),
  qrCodeUrl: text("qr_code_url"),
  programTypes: text("program_types").array().notNull().default(["SimpleMSK"]), // Programs client has access to
  status: text("status").notNull().default("active"),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

export const assetCategories = pgTable("asset_categories", {
  id: serial("id").primaryKey(),
  name: text("name").notNull(),
  slug: text("slug").notNull().unique(),
  description: text("description"),
  programType: text("program_type").notNull(), // SimpleMSK, SimpleBehavioural, etc.
  displayOrder: integer("display_order").notNull().default(0),
  status: text("status").notNull().default("active"), // active, inactive
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

export const assetTemplates = pgTable("asset_templates", {
  id: serial("id").primaryKey(),
  name: text("name").notNull(),
  categoryId: integer("category_id").notNull().references(() => assetCategories.id),
  type: text("type").notNull(), // 'flyer', 'poster', 'banner', 'email', 'video', etc.
  originalFileName: text("original_file_name").notNull(),
  fileUrl: text("file_url").notNull(),
  fileType: text("file_type").notNull(), // 'pdf', 'ppt', 'docx', 'png', 'jpg'
  version: text("version").notNull(),
  description: text("description"),
  language: text("language").notNull().default("English"), // English, Spanish
  languageVariants: text("language_variants").array().notNull().default(["English"]), // Track all available language versions
  vimeoUrl: text("vimeo_url"), // For video assets only
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

// New table to store language-specific file URLs for each template
export const assetLanguageVersions = pgTable("asset_language_versions", {
  id: serial("id").primaryKey(),
  templateId: integer("template_id").notNull().references(() => assetTemplates.id),
  language: text("language").notNull(), // English, Spanish
  fileName: text("file_name").notNull(),
  fileUrl: text("file_url").notNull(),
  createdAt: timestamp("created_at").defaultNow(),
});

export const clientAssets = pgTable("client_assets", {
  id: serial("id").primaryKey(),
  clientId: integer("client_id").notNull().references(() => clients.id),
  templateId: integer("template_id").notNull().references(() => assetTemplates.id),
  personalizedFileUrl: text("personalized_file_url").notNull(),
  downloadCount: integer("download_count").default(0),
  lastDownloaded: timestamp("last_downloaded"),
  createdAt: timestamp("created_at").defaultNow(),
});

export const users = pgTable("users", {
  id: serial("id").primaryKey(),
  username: text("username").notNull().unique(),
  password: text("password").notNull(),
  role: text("role").notNull().default("admin"), // 'admin', 'client'
});

export const insertClientSchema = createInsertSchema(clients).omit({
  id: true,
  createdAt: true,
  updatedAt: true,
});

export const insertAssetCategorySchema = createInsertSchema(assetCategories).omit({
  id: true,
  createdAt: true,
  updatedAt: true,
});

export const insertAssetTemplateSchema = createInsertSchema(assetTemplates).omit({
  id: true,
  createdAt: true,
  updatedAt: true,
});

export const insertAssetLanguageVersionSchema = createInsertSchema(assetLanguageVersions).omit({
  id: true,
  createdAt: true,
});

export const insertClientAssetSchema = createInsertSchema(clientAssets).omit({
  id: true,
  createdAt: true,
});

export const insertUserSchema = createInsertSchema(users).omit({
  id: true,
});

export type Client = typeof clients.$inferSelect;
export type InsertClient = z.infer<typeof insertClientSchema>;
export type AssetCategory = typeof assetCategories.$inferSelect;
export type InsertAssetCategory = z.infer<typeof insertAssetCategorySchema>;
export type AssetTemplate = typeof assetTemplates.$inferSelect;
export type InsertAssetTemplate = z.infer<typeof insertAssetTemplateSchema>;
export type AssetLanguageVersion = typeof assetLanguageVersions.$inferSelect;
export type InsertAssetLanguageVersion = z.infer<typeof insertAssetLanguageVersionSchema>;
export type ClientAsset = typeof clientAssets.$inferSelect;
export type InsertClientAsset = z.infer<typeof insertClientAssetSchema>;
export type User = typeof users.$inferSelect;
export type InsertUser = z.infer<typeof insertUserSchema>;
