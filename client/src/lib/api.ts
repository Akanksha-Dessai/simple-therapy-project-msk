import { apiRequest } from "./queryClient";

export interface ClientAccessResponse {
  id: number;
  name: string;
  accessCode: string;
  logoUrl: string | null;
  eligibilityLanguage: string;
  qrCodeUrl: string | null;
}

export interface AssetWithClientData {
  id: number;
  name: string;
  category: string;
  type: string;
  fileType: string;
  version: string;
  description: string | null;
  downloadUrl: string | null;
  clientSpecific: any;
}

export interface ClientAssetsResponse {
  client: ClientAccessResponse;
  assets: AssetWithClientData[];
}

export const clientApi = {
  access: async (accessCode: string): Promise<ClientAccessResponse> => {
    const response = await apiRequest("POST", "/api/client/access", { accessCode });
    return response.json();
  },

  getAssets: async (clientId: number): Promise<ClientAssetsResponse> => {
    const response = await apiRequest("GET", `/api/client/${clientId}/assets`);
    return response.json();
  },

  downloadAsset: async (templateId: number, clientId: number) => {
    const response = await apiRequest("GET", `/api/asset/download/${templateId}/${clientId}`);
    return response.json();
  }
};

export const adminApi = {
  getClients: async () => {
    const response = await apiRequest("GET", "/api/admin/clients");
    return response.json();
  },

  createClient: async (clientData: any) => {
    const response = await apiRequest("POST", "/api/admin/clients", clientData);
    return response.json();
  },

  updateClient: async (id: number, updates: any) => {
    const response = await apiRequest("PUT", `/api/admin/clients/${id}`, updates);
    return response.json();
  },

  deleteClient: async (id: number) => {
    await apiRequest("DELETE", `/api/admin/clients/${id}`);
  },

  getTemplates: async (category?: string) => {
    const url = category ? `/api/admin/templates?category=${category}` : "/api/admin/templates";
    const response = await apiRequest("GET", url);
    return response.json();
  },

  createTemplate: async (templateData: any) => {
    const response = await apiRequest("POST", "/api/admin/templates", templateData);
    return response.json();
  },

  updateTemplate: async (id: number, updates: any) => {
    const response = await apiRequest("PUT", `/api/admin/templates/${id}`, updates);
    return response.json();
  },

  deleteTemplate: async (id: number) => {
    await apiRequest("DELETE", `/api/admin/templates/${id}`);
  }
};
