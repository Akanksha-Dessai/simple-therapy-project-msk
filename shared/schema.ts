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
  status: text("status").notNull().default("active"),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

export const assetTemplates = pgTable("asset_templates", {
  id: serial("id").primaryKey(),
  name: text("name").notNull(),
  category: text("category").notNull(), // 'launch', 'ongoing', 'future'
  type: text("type").notNull(), // 'flyer', 'poster', 'banner', 'email', 'video', etc.
  originalFileName: text("original_file_name").notNull(),
  fileUrl: text("file_url").notNull(),
  fileType: text("file_type").notNull(), // 'pdf', 'ppt', 'docx', 'png', 'jpg'
  version: text("version").notNull(),
  description: text("description"),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
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

export const insertAssetTemplateSchema = createInsertSchema(assetTemplates).omit({
  id: true,
  createdAt: true,
  updatedAt: true,
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
export type AssetTemplate = typeof assetTemplates.$inferSelect;
export type InsertAssetTemplate = z.infer<typeof insertAssetTemplateSchema>;
export type ClientAsset = typeof clientAssets.$inferSelect;
export type InsertClientAsset = z.infer<typeof insertClientAssetSchema>;
export type User = typeof users.$inferSelect;
export type InsertUser = z.infer<typeof insertUserSchema>;
