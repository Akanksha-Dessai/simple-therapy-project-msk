import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { adminApi } from "@/lib/api";
import { useToast } from "@/hooks/use-toast";
import UploadZone from "./upload-zone";
import { Plus, Upload, Edit, Trash2, Download } from "lucide-react";

export default function AdminPanel() {
  const [searchTerm, setSearchTerm] = useState("");
  const [showClientDialog, setShowClientDialog] = useState(false);
  const [showTemplateDialog, setShowTemplateDialog] = useState(false);
  const [showCategoryDialog, setShowCategoryDialog] = useState(false);
  const [editingClient, setEditingClient] = useState<any>(null);
  const [editingCategory, setEditingCategory] = useState<any>(null);
  const [selectedAssetType, setSelectedAssetType] = useState<string>("");
  const [selectedAssetScope, setSelectedAssetScope] = useState<string>("template");
  const [showLanguageDialog, setShowLanguageDialog] = useState(false);
  const [selectedTemplate, setSelectedTemplate] = useState<any>(null);
  const [showVersionDialog, setShowVersionDialog] = useState(false);
  const [selectedPrograms, setSelectedPrograms] = useState<string[]>([]);
  const { toast } = useToast();
  const queryClient = useQueryClient();

  // Client management
  const { data: clients = [], isLoading: clientsLoading } = useQuery({
    queryKey: ["/api/admin/clients"],
    queryFn: () => adminApi.getClients(),
  });

  // Template management
  const { data: templates = [], isLoading: templatesLoading } = useQuery({
    queryKey: ["/api/admin/templates"],
    queryFn: () => adminApi.getTemplates(),
  });

  // Category management
  const { data: categories = [], isLoading: categoriesLoading } = useQuery({
    queryKey: ["/api/admin/categories"],
    queryFn: () => adminApi.getCategories(),
  });

  const createClientMutation = useMutation({
    mutationFn: adminApi.createClient,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/admin/clients"] });
      setShowClientDialog(false);
      toast({ title: "Success", description: "Client created successfully" });
    },
    onError: () => {
      toast({ title: "Error", description: "Failed to create client", variant: "destructive" });
    },
  });

  const updateClientMutation = useMutation({
    mutationFn: ({ id, data }: { id: number; data: any }) => adminApi.updateClient(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/admin/clients"] });
      setShowClientDialog(false);
      setEditingClient(null);
      toast({ title: "Success", description: "Client updated successfully" });
    },
    onError: () => {
      toast({ title: "Error", description: "Failed to update client", variant: "destructive" });
    },
  });

  const deleteClientMutation = useMutation({
    mutationFn: adminApi.deleteClient,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/admin/clients"] });
      toast({ title: "Success", description: "Client deleted successfully" });
    },
    onError: () => {
      toast({ title: "Error", description: "Failed to delete client", variant: "destructive" });
    },
  });

  const createTemplateMutation = useMutation({
    mutationFn: adminApi.createTemplate,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/admin/templates"] });
      setShowTemplateDialog(false);
      toast({ title: "Success", description: "Template created successfully" });
    },
    onError: () => {
      toast({ title: "Error", description: "Failed to create template", variant: "destructive" });
    },
  });

  const createCategoryMutation = useMutation({
    mutationFn: adminApi.createCategory,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/admin/categories"] });
      setShowCategoryDialog(false);
      setEditingCategory(null);
      toast({ title: "Success", description: "Category created successfully" });
    },
    onError: () => {
      toast({ title: "Error", description: "Failed to create category", variant: "destructive" });
    },
  });

  const updateCategoryMutation = useMutation({
    mutationFn: ({ id, data }: { id: number; data: any }) => adminApi.updateCategory(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/admin/categories"] });
      setShowCategoryDialog(false);
      setEditingCategory(null);
      toast({ title: "Success", description: "Category updated successfully" });
    },
    onError: () => {
      toast({ title: "Error", description: "Failed to update category", variant: "destructive" });
    },
  });

  const deleteCategoryMutation = useMutation({
    mutationFn: adminApi.deleteCategory,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/admin/categories"] });
      toast({ title: "Success", description: "Category deleted successfully" });
    },
    onError: () => {
      toast({ title: "Error", description: "Failed to delete category", variant: "destructive" });
    },
  });

  const handleClientSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    const clientData = {
      name: formData.get("name") as string,
      clientId: formData.get("clientId") as string,
      clientCode: formData.get("clientCode") as string,
      cualincCode: formData.get("cualincCode") as string || null,
      marqueeCode: formData.get("marqueeCode") as string || null,
      accessCode: formData.get("accessCode") as string,
      contactEmail: formData.get("contactEmail") as string,
      landingPageUrl: formData.get("landingPageUrl") as string || null,
      eligibilityLanguage: formData.get("eligibilityLanguage") as string,
      logoUrl: formData.get("logoUrl") as string || null,
      qrCodeUrl: formData.get("qrCodeUrl") as string || null,
      activePrograms: selectedPrograms.length > 0 ? selectedPrograms : ["SimpleMSK"],
      status: formData.get("status") as string || "active",
    };

    console.log('Client Data to be submitted:', clientData);

    if (editingClient) {
      updateClientMutation.mutate({ id: editingClient.id, data: clientData });
    } else {
      createClientMutation.mutate(clientData);
      toast({
        title: "Client added!",
        description: "New client has been created successfully.",
        variant: "default",
      });
    }
    setShowClientDialog(false);
    setSelectedPrograms([]);
  };

  const handleTemplateSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    const templateData = {
      name: formData.get("name") as string,
      categoryId: parseInt(formData.get("categoryId") as string),
      type: formData.get("type") as string,
      originalFileName: formData.get("originalFileName") as string,
      fileUrl: "/templates/" + formData.get("originalFileName"),
      fileType: formData.get("fileType") as string,
      version: formData.get("version") as string,
      language: formData.get("language") as string,
      languageVariants: [formData.get("language") as string],
      description: formData.get("description") as string || null,
    };

    createTemplateMutation.mutate(templateData);
  };

  const handleCategorySubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);

    // Get all selected program types
  const selectedPrograms = formData.getAll("programTypes") as string[];

    const categoryData = {
      name: formData.get("name") as string,
      slug: formData.get("slug") as string,
      description: formData.get("description") as string || null,
      programTypes: selectedPrograms.length > 0 ? selectedPrograms : ["SimpleMSK"], // Ensure at least one program type,
      displayOrder: parseInt(formData.get("displayOrder") as string) || 0,
      status: formData.get("status") as string,
    };

    console.log('Category Data to be submitted:', categoryData);

    if (editingCategory) {
      updateCategoryMutation.mutate({ id: editingCategory.id, data: categoryData });
    } else {
      createCategoryMutation.mutate(categoryData);
    }
  };

  const filteredClients = clients.filter((client: any) =>
    client.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    client.contactEmail.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const getStatusColor = (status: string) => {
    switch (status) {
      case "active":
        return "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300";
      case "pending":
        return "bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-300";
      case "inactive":
        return "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300";
      default:
        return "bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-300";
    }
  };

  return (
    <div className="space-y-8">
      {/* Admin Dashboard Header */}
      <Card>
        <CardContent className="p-6">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-semibold text-gray-900 dark:text-foreground">
                Admin Dashboard
              </h1>
              <p className="text-gray-600 dark:text-muted-foreground mt-1">
                Manage clients, categories, and multi-language asset templates
              </p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Admin Navigation Tabs */}
      <Tabs defaultValue="clients" className="space-y-6">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="clients">Client Management</TabsTrigger>
          <TabsTrigger value="categories">Categories</TabsTrigger>
          <TabsTrigger value="templates">Asset Templates</TabsTrigger>
          <TabsTrigger value="settings">System Settings</TabsTrigger>
        </TabsList>

        <TabsContent value="clients" className="space-y-6">
          <Card>
            <CardContent className="p-6">
              <div className="flex flex-col sm:flex-row gap-4 mb-6">
                <div className="flex-1">
                  <Input
                    placeholder="Search clients..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                  />
                </div>
                <Dialog open={showClientDialog} 
                onOpenChange={(open) => {
                  setShowClientDialog(open);
                  if (!open) {
                    setEditingClient(null);
                    setSelectedPrograms([]); // Reset when dialog is closed
                  }
                }}
                >
                  <DialogTrigger asChild>
                    <Button className="bg-secondary hover:bg-green-600 text-white">
                      <Plus className="mr-2 h-4 w-4" /> Add New Client
                    </Button>
                  </DialogTrigger>
                  <DialogContent className="sm:max-w-[500px] max-h-[85vh] overflow-y-auto">
                    <DialogHeader>
                    <DialogTitle>{editingClient ? "Edit Client" : "Add New Client"}</DialogTitle>
                        <p className="text-sm text-gray-600 dark:text-muted-foreground">
                          {editingClient ? "Update client information" : "Create a new client with access credentials and configuration"}
                        </p>
                    </DialogHeader>
                    <form onSubmit={handleClientSubmit} className="space-y-4">
                      <div>
                        <Label htmlFor="clientName">Client Name</Label>
                        <Input id="clientName" 
                        name="name" 
                        defaultValue={editingClient?.name || ""}
                        required />
                      </div>
                      <div>
                        <Label htmlFor="clientId">Client ID</Label>
                        <Input
                         id="clientId"
                          name="clientId" 
                          defaultValue={editingClient?.clientId || ""}
                          required />
                        <p className="text-xs text-gray-500 mt-1">
                          Unique identifier for this client
                        </p>
                      </div>
                      <div>
                        <Label htmlFor="contactEmail">Contact Email</Label>
                        <Input 
                        id="contactEmail"
                         name="contactEmail" 
                         type="email" 
                         defaultValue={editingClient?.contactEmail || ""}
                         required />
                      </div>
                      <div>
                        <Label htmlFor="clientCode">Client Code</Label>
                        <Input 
                        id="clientCode" 
                        name="clientCode"
                        defaultValue={editingClient?.clientCode || ""}
                        required />
                        <p className="text-xs text-gray-500 mt-1">
                          Unique code from SimpleTherapy's client list
                        </p>
                      </div>
                      <div>
                          <Label htmlFor="accessCode">Access Code</Label>
                          <Input 
                          id="accessCode"
                           name="accessCode"
                           defaultValue={editingClient?.accessCode || ""}
                           required />
                          <p className="text-xs text-gray-500 mt-1">
                            Unique access code for client login
                          </p>
                        </div>
                      {selectedPrograms.includes('SimpleEAP') && (
                        <div>
                          <Label htmlFor="cualincCode">
                            Cualinc Code 
                            <span className="text-red-500">*</span>
                          </Label>
                          <Input
                           id="cualincCode" 
                           name="cualincCode"
                           defaultValue={editingClient?.cualincCode || ""}
                           required />
                          <p className="text-xs text-gray-500 mt-1">
                            Required for SimpleEAP program
                          </p>
                        </div>
                      )}
                      {selectedPrograms.includes('SimpleWellbeing') && (
                        <div>
                          <Label htmlFor="marqueeCode">
                            Marquee Code 
                            <span className="text-red-500">*</span>
                          </Label>
                          <Input 
                          id="marqueeCode" 
                          name="marqueeCode" 
                          defaultValue={editingClient?.marqueeCode || ""}
                          required />
                          <p className="text-xs text-gray-500 mt-1">
                            Required for SimpleWellbeing program
                          </p>
                        </div>
                      )}
                      <div>
                        <Label htmlFor="landingPageUrl">Landing Page URL</Label>
                        <Input
                         id="landingPageUrl"
                          name="landingPageUrl"
                           type="url"
                           defaultValue={editingClient?.landingPageUrl || ""}
                           placeholder="https://example.com" />
                        <p className="text-xs text-gray-500 mt-1">
                          URL where clients will be redirected (optional)
                        </p>
                      </div>
                      <div>
                        <Label htmlFor="activePrograms">Active Programs</Label>
                        <div className="space-y-2">
                          <p className="text-xs text-gray-500">
                            Select which programs this client can access
                          </p>
                          <div className="grid grid-cols-2 gap-2">
                          {["SimpleMSK", "SimpleEAP", "SimpleBehavioural", "SimpleWellbeing"].map((program) => (
                              <div key={program} className="flex items-center space-x-2">
                                <input 
                                  type="checkbox" 
                                  id={program.toLowerCase()} 
                                  name="activePrograms" 
                                  value={program} 
                                  className="rounded"
                                  defaultChecked={editingClient?.activePrograms?.includes(program)}
                                  onChange={(e) => {
                                    if (e.target.checked) {
                                      setSelectedPrograms(prev => [...prev, program]);
                                    } else {
                                      setSelectedPrograms(prev => prev.filter(p => p !== program));
                                    }
                                  }}
                                />
                                <label htmlFor={program.toLowerCase()} className="text-sm">{program}</label>
                              </div>
                            ))}
                          </div>
                        </div>
                      </div>
                      <div>
                        <Label htmlFor="eligibilityLanguage">Eligibility Language</Label>
                        <Textarea
                         id="eligibilityLanguage" 
                         name="eligibilityLanguage" 
                         defaultValue={editingClient?.eligibilityLanguage || ""}
                         rows={3} placeholder="Enter eligibility text..." />
                      </div>
                      <div className="flex justify-end space-x-2">
                        <Button type="button" variant="outline" onClick={() => setShowClientDialog(false)}>
                          Cancel
                        </Button>
                        <Button type="submit">
                          Add Client
                        </Button>
                      </div>
                    </form>
                  </DialogContent>
                </Dialog>
              </div>

              <div className="overflow-x-auto">
                {clientsLoading ? (
                  <div className="text-center py-8">Loading clients...</div>
                ) : (
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Client</TableHead>
                        <TableHead>Client ID</TableHead>
                        <TableHead>Client Code</TableHead>
                        <TableHead>Cualinc Code</TableHead>
                        <TableHead>Marquee Code</TableHead>
                        <TableHead>Active Programs</TableHead>
                        <TableHead>Access Code</TableHead>
                        <TableHead>Landing Page</TableHead>
                        <TableHead>Status</TableHead>
                        <TableHead>Actions</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {filteredClients.map((client: any) => (
                        <TableRow key={client.id}>
                          <TableCell>{client.name}</TableCell>
                          <TableCell>
                            <code className="bg-blue-50 dark:bg-blue-900 px-2 py-1 rounded text-sm text-blue-700 dark:text-blue-300">
                              {client.clientId || 'ST-001'}
                            </code>
                          </TableCell>
                          <TableCell>
                            <code className="bg-purple-50 dark:bg-purple-900 px-2 py-1 rounded text-sm text-purple-700 dark:text-purple-300">
                              {client.clientCode || 'ACME-MSK-2024'}
                            </code>
                          </TableCell>
                          <TableCell>
                            <code className="bg-orange-50 dark:bg-orange-900 px-2 py-1 rounded text-sm text-orange-700 dark:text-orange-300">
                              {client.cualincCode || 'CUA-ACME-001'}
                            </code>
                          </TableCell>
                          <TableCell>
                            <code className="bg-green-50 dark:bg-green-900 px-2 py-1 rounded text-sm text-green-700 dark:text-green-300">
                              {client.marqueeCode || 'MQ-ACME-2024'}
                            </code>
                          </TableCell>
                          <TableCell>
                            <div className="flex flex-wrap gap-1">
                              {(client.activePrograms || ['SimpleMSK', 'SimpleEAP']).map((program: string) => (
                                <Badge key={program} variant="secondary" className="text-xs">
                                  {program}
                                </Badge>
                              ))}
                            </div>
                          </TableCell>
                          <TableCell>
                            <code className="bg-gray-100 dark:bg-gray-800 px-2 py-1 rounded text-sm">
                              {client.accessCode}
                            </code>
                          </TableCell>
                          <TableCell>
                            {client.landingPageUrl ? (
                              <a 
                                href={client.landingPageUrl} 
                                target="_blank" 
                                rel="noopener noreferrer"
                                className="text-blue-600 hover:text-blue-800 dark:text-blue-400 dark:hover:text-blue-300 text-sm truncate max-w-[150px] block"
                              >
                                {client.landingPageUrl.replace('https://', '').replace('http://', '')}
                              </a>
                            ) : (
                              <span className="text-gray-400 text-sm">No URL</span>
                            )}
                          </TableCell>
                          <TableCell>
                            <Badge className={getStatusColor(client.status)}>
                              {client.status}
                            </Badge>
                          </TableCell>
                          <TableCell>
                            <div className="flex space-x-2">
                              <Button 
                              variant="outline" 
                              size="sm"
                              onClick={() => {
                                setEditingClient(client);
                                setSelectedPrograms(client.activePrograms || ['SimpleMSK']);
                                setShowClientDialog(true);
                              }}
                              >
                                <Edit className="h-3 w-3" />
                              </Button>
                              <Button
                                variant="outline"
                                size="sm"
                                onClick={() => deleteClientMutation.mutate(client.id)}
                              >
                                <Trash2 className="h-3 w-3" />
                              </Button>
                            </div>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                )}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="categories" className="space-y-6">
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle>Program Categories</CardTitle>
                  <p className="text-gray-600 dark:text-muted-foreground">
                    Create and manage categories for each program. Categories will only appear in their assigned program.
                  </p>
                </div>
                <Dialog open={showCategoryDialog} onOpenChange={setShowCategoryDialog}>
                  <DialogTrigger asChild>
                    <Button className="bg-secondary hover:bg-green-600 text-white">
                      <Plus className="mr-2 h-4 w-4" /> Add Category
                    </Button>
                  </DialogTrigger>
                  <DialogContent className="sm:max-w-[425px]">
                    <DialogHeader>
                      <DialogTitle>
                        {editingCategory ? "Edit Category" : "Add New Category"}
                      </DialogTitle>
                    </DialogHeader>
                    <form onSubmit={handleCategorySubmit} className="space-y-4">
                      <div>
                        <Label htmlFor="categoryName">Category Name</Label>
                        <Input
                          id="categoryName"
                          name="name"
                          defaultValue={editingCategory?.name || ""}
                          placeholder="e.g., Launch Materials"
                          onChange={(e) => {
                            const nameValue = e.target.value;
                            const slugInput = document.getElementById('categorySlug') as HTMLInputElement;
                            if (slugInput && !editingCategory) {
                              const baseSlug = nameValue
                                .toLowerCase()
                                .replace(/[^a-z0-9\s-]/g, '')
                                .replace(/\s+/g, '-')
                                .replace(/-+/g, '-')
                                .trim()
                                .replace(/^-|-$/g, '');
                              
                              const existingSlugs = categories.map((cat: any) => cat.slug);
                              let finalSlug = baseSlug;
                              let counter = 1;
                              while (existingSlugs.includes(finalSlug)) {
                                finalSlug = `${baseSlug}-${counter}`;
                                counter++;
                              }
                              
                              slugInput.value = finalSlug;
                            }
                          }}
                          required
                        />
                      </div>
                      <div>
                        <Label htmlFor="categorySlug">Category Slug (Auto-generated)</Label>
                        <Input
                          id="categorySlug"
                          name="slug"
                          defaultValue={editingCategory?.slug || ""}
                          placeholder="auto-generated-from-name"
                          readOnly={!editingCategory}
                          className={!editingCategory ? "bg-gray-50 dark:bg-gray-800" : ""}
                          required
                        />
                      </div>
                      <div>
                        <Label htmlFor="programTypes">Assign to Programs</Label>
                        <div className="space-y-2">
                          {["SimpleMSK", "SimpleEAP", "SimpleBehavioural", "SimpleWellbeing"].map((program) => (
                            <div key={program} className="flex items-center space-x-2">
                              <input
                                type="checkbox"
                                id={program}
                                name="programTypes"
                                value={program}
                                defaultChecked={editingCategory?.programTypes?.includes(program)}
                                className="rounded"
                              />
                              <label htmlFor={program} className="text-sm">{program}</label>
                            </div>
                          ))}
                        </div>
                      </div>
                      <div>
                        <Label htmlFor="categoryDescription">Description</Label>
                        <Textarea
                          id="categoryDescription"
                          name="description"
                          defaultValue={editingCategory?.description || ""}
                          placeholder="Optional description..."
                          rows={3}
                        />
                      </div>
                      <div>
                        <Label htmlFor="displayOrder">Display Order</Label>
                        <Input
                          id="displayOrder"
                          name="displayOrder"
                          type="number"
                          defaultValue={editingCategory?.displayOrder || 0}
                          min="0"
                        />
                      </div>
                      <div>
                        <Label htmlFor="categoryStatus">Status</Label>
                        <Select name="status" defaultValue={editingCategory?.status || "active"} required>
                          <SelectTrigger>
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="active">Active</SelectItem>
                            <SelectItem value="inactive">Inactive</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                      <div className="flex justify-end space-x-2">
                        <Button type="button" variant="outline" onClick={() => setShowCategoryDialog(false)}>
                          Cancel
                        </Button>
                        <Button type="submit" disabled={createCategoryMutation.isPending || updateCategoryMutation.isPending}>
                          {editingCategory ? "Update" : "Create"} Category
                        </Button>
                      </div>
                    </form>
                  </DialogContent>
                </Dialog>
              </div>
            </CardHeader>
            <CardContent>
              {categoriesLoading ? (
                <div className="text-center py-8">Loading categories...</div>
              ) : (
                <div className="space-y-4">
                  {["SimpleMSK", "SimpleEAP", "SimpleBehavioural", "SimpleWellbeing"].map(program => {
                    const programCategories = categories.filter((cat: any) => cat.programTypes.includes(program));
                    return (
                      <Card key={program} className="border-l-4 border-l-secondary">
                        <CardHeader className="pb-3">
                          <div className="flex items-center justify-between">
                            <h3 className="text-lg font-semibold text-gray-900 dark:text-foreground">{program}</h3>
                            <Badge variant="outline">{programCategories.length} categories</Badge>
                          </div>
                        </CardHeader>
                        <CardContent className="pt-0">
                          {programCategories.length === 0 ? (
                            <p className="text-gray-500 dark:text-muted-foreground italic">No categories assigned to this program</p>
                          ) : (
                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
                              {programCategories.map((category: any) => (
                                <div key={category.id} className="p-3 border rounded-lg bg-gray-50 dark:bg-gray-800">
                                  <div className="flex items-center justify-between">
                                    <div>
                                      <h4 className="font-medium text-gray-900 dark:text-foreground">{category.name}</h4>
                                      <p className="text-sm text-gray-500 dark:text-muted-foreground">{category.slug}</p>
                                      {category.description && (
                                        <p className="text-xs text-gray-400 dark:text-muted-foreground mt-1">{category.description}</p>
                                      )}
                                    </div>
                                    <div className="flex space-x-1">
                                      <Button
                                        variant="outline"
                                        size="sm"
                                        onClick={() => {
                                          setEditingCategory(category);
                                          setShowCategoryDialog(true);
                                        }}
                                      >
                                        <Edit className="h-3 w-3" />
                                      </Button>
                                      <Button
                                        variant="outline"
                                        size="sm"
                                        onClick={() => deleteCategoryMutation.mutate(category.id)}
                                      >
                                        <Trash2 className="h-3 w-3" />
                                      </Button>
                                    </div>
                                  </div>
                                  <div className="flex items-center justify-between mt-2">
                                    <Badge className={getStatusColor(category.status)}>
                                      {category.status}
                                    </Badge>
                                    <span className="text-xs text-gray-400 dark:text-muted-foreground">
                                      Order: {category.displayOrder}
                                    </span>
                                  </div>
                                </div>
                              ))}
                            </div>
                          )}
                        </CardContent>
                      </Card>
                    );
                  })}
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="templates" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Multi-Language Asset Templates</CardTitle>
              <p className="text-gray-600 dark:text-muted-foreground">
                Upload and manage asset templates with English and Spanish language support
              </p>
            </CardHeader>
            <CardContent>
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-semibold text-gray-900 dark:text-foreground">Asset Templates</h3>
                <Dialog open={showTemplateDialog} onOpenChange={setShowTemplateDialog}>
                  <DialogTrigger asChild>
                    <Button className="bg-secondary hover:bg-green-600 text-white">
                      <Plus className="mr-2 h-4 w-4" /> Add New Asset
                    </Button>
                  </DialogTrigger>
                  <DialogContent className="sm:max-w-[700px] max-h-[85vh] overflow-y-auto">
                    <DialogHeader>
                      <DialogTitle>Upload New Asset Template</DialogTitle>
                      <div className="space-y-2">
                        <p className="text-sm text-gray-600 dark:text-muted-foreground">
                          Create a template asset that will be customized with client branding and made available in both English and Spanish
                        </p>
                        <div className="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 rounded-lg p-3">
                          <p className="text-sm font-medium text-blue-900 dark:text-blue-100 mb-2">📋 Upload Workflow:</p>
                          <ol className="text-xs text-blue-800 dark:text-blue-200 space-y-1 list-decimal list-inside">
                            <li><strong>Start here:</strong> Upload your first language version (English or Spanish)</li>
                            <li><strong>Add language:</strong> Use the green "Add Language" button to upload the other language</li>
                            <li><strong>Update versions:</strong> Use the blue "New Version" button to upload newer versions</li>
                            <li><strong>Version sync:</strong> All language versions share the same version number</li>
                          </ol>
                        </div>
                      </div>
                    </DialogHeader>
                    <form onSubmit={handleTemplateSubmit} className="space-y-4">
                      <div>
                        <Label htmlFor="templateName">Template Name</Label>
                        <Input id="templateName" name="name" required />
                      </div>
                      <div>
                        <Label htmlFor="category">Category</Label>
                        <Select name="categoryId" required>
                          <SelectTrigger>
                            <SelectValue placeholder="Select category" />
                          </SelectTrigger>
                          <SelectContent>
                            {categories.map((category: any) => (
                              <SelectItem key={category.id} value={category.id.toString()}>
                                {category.name} ({category.programType})
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </div>
                      <div>
                        <Label htmlFor="language">Language Version</Label>
                        <Select name="language" defaultValue="English" required>
                          <SelectTrigger>
                            <SelectValue placeholder="Select language" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="English">English</SelectItem>
                            <SelectItem value="Spanish">Spanish (Español)</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                      <div>
                        <Label htmlFor="type">Asset Type</Label>
                        <Select name="type" required onValueChange={setSelectedAssetType}>
                          <SelectTrigger>
                            <SelectValue placeholder="Select asset type" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="flyer">📄 Flyer</SelectItem>
                            <SelectItem value="poster">🖼️ Poster</SelectItem>
                            <SelectItem value="banner">🏷️ Banner</SelectItem>
                            <SelectItem value="email">📧 Email Template</SelectItem>
                            <SelectItem value="document">📋 Document</SelectItem>
                            <SelectItem value="presentation">📊 Presentation</SelectItem>
                            <SelectItem value="newsletter">📰 Newsletter</SelectItem>
                            <SelectItem value="virtual-display">🖥️ Virtual Display (VDM)</SelectItem>
                            <SelectItem value="video">🎥 Video</SelectItem>
                            <SelectItem value="webinar">📹 Webinar</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                      
                      {/* Template vs Client-Specific Selection */}
                      <div className="space-y-3">
                        <Label htmlFor="assetScope">Asset Scope</Label>
                        <Select name="assetScope" required defaultValue="template" onValueChange={setSelectedAssetScope}>
                          <SelectTrigger>
                            <SelectValue placeholder="Choose asset scope" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="template">
                              <div className="flex items-center space-x-2">
                                <span>🔄</span>
                                <div>
                                  <div className="font-medium">Template Asset</div>
                                  <div className="text-xs text-gray-500">Customizable for all clients (logo, URL, eligibility language)</div>
                                </div>
                              </div>
                            </SelectItem>
                            <SelectItem value="client-specific">
                              <div className="flex items-center space-x-2">
                                <span>👤</span>
                                <div>
                                  <div className="font-medium">Client-Specific Asset</div>
                                  <div className="text-xs text-gray-500">Directly assigned to one client without customization</div>
                                </div>
                              </div>
                            </SelectItem>
                          </SelectContent>
                        </Select>
                      </div>

                      {/* Client Selection - only show for client-specific assets */}
                      {selectedAssetScope === "client-specific" && (
                        <div>
                          <Label htmlFor="clientId">Select Client</Label>
                          <Select name="clientId" required>
                            <SelectTrigger>
                              <SelectValue placeholder="Choose a client" />
                            </SelectTrigger>
                            <SelectContent>
                              {clients.map((client: any) => (
                                <SelectItem key={client.id} value={client.id.toString()}>
                                  <div className="flex items-center space-x-2">
                                    <span>👤</span>
                                    <span>{client.name}</span>
                                  </div>
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                          <p className="text-sm text-gray-500 mt-1">
                            This asset will be directly assigned to the selected client
                          </p>
                        </div>
                      )}
                      <div>
                        <Label htmlFor="originalFileName">File Name</Label>
                        <Input id="originalFileName" name="originalFileName" required />
                      </div>
                      
                      {/* File Upload Zone */}
                      <div>
                        <Label>Upload Asset File</Label>
                        <UploadZone onUpload={(file) => {
                          // Auto-populate file name if empty
                          const fileNameInput = document.getElementById('originalFileName') as HTMLInputElement;
                          if (fileNameInput && !fileNameInput.value) {
                            fileNameInput.value = file.name;
                          }
                          
                          // Auto-select file type based on extension
                          const extension = file.name.split('.').pop()?.toLowerCase();
                          const fileTypeSelect = document.querySelector('[name="fileType"]') as HTMLSelectElement;
                          if (fileTypeSelect && extension) {
                            const typeMap: Record<string, string> = {
                              'pdf': 'pdf',
                              'ppt': 'ppt',
                              'pptx': 'ppt',
                              'docx': 'docx',
                              'png': 'png',
                              'jpg': 'jpg',
                              'jpeg': 'jpg',
                              'mp4': 'mp4',
                              'mov': 'mov',
                              'avi': 'avi',
                              'html': 'html'
                            };
                            if (typeMap[extension]) {
                              fileTypeSelect.value = typeMap[extension];
                              fileTypeSelect.dispatchEvent(new Event('change', { bubbles: true }));
                            }
                          }
                        }} />
                      </div>
                      <div>
                        <Label htmlFor="fileType">File Type</Label>
                        <Select name="fileType" required>
                          <SelectTrigger>
                            <SelectValue placeholder="Select file format" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="pdf">📄 PDF Document</SelectItem>
                            <SelectItem value="ppt">📊 PowerPoint (.ppt/.pptx)</SelectItem>
                            <SelectItem value="docx">📝 Word Document (.docx)</SelectItem>
                            <SelectItem value="png">🖼️ PNG Image</SelectItem>
                            <SelectItem value="jpg">📸 JPEG Image</SelectItem>
                            <SelectItem value="mp4">🎥 MP4 Video</SelectItem>
                            <SelectItem value="mov">🎬 MOV Video</SelectItem>
                            <SelectItem value="avi">📹 AVI Video</SelectItem>
                            <SelectItem value="html">🌐 HTML Display</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                      <div>
                        <Label htmlFor="version">Version</Label>
                        <Input id="version" name="version" value="1.0" readOnly className="bg-gray-50 dark:bg-gray-800 text-gray-600 cursor-not-allowed" />
                        <p className="text-xs text-gray-500 mt-1">
                          New templates always start at version 1.0
                        </p>
                      </div>
                      <div>
                        <Label htmlFor="description">Description</Label>
                        <Textarea id="description" name="description" rows={3} />
                      </div>
                      
                      {/* Conditional Vimeo URL field for videos and webinars */}
                      {(selectedAssetType === "video" || selectedAssetType === "webinar") && (
                        <div>
                          <Label htmlFor="vimeoUrl">Vimeo URL (Optional)</Label>
                          <Input 
                            id="vimeoUrl" 
                            name="vimeoUrl" 
                            placeholder="https://vimeo.com/..." 
                            type="url"
                          />
                          <p className="text-sm text-gray-500 mt-1">
                            Add a Vimeo link for clients to watch online in addition to downloading
                          </p>
                        </div>
                      )}
                      
                      <div className="flex justify-end space-x-2">
                        <Button type="button" variant="outline" onClick={() => {
                          setShowTemplateDialog(false);
                          setSelectedAssetType("");
                        }}>
                          Cancel
                        </Button>
                        <Button type="submit" disabled={createTemplateMutation.isPending}>
                          Upload Template
                        </Button>
                      </div>
                    </form>
                  </DialogContent>
                </Dialog>

                {/* Add Language Version Dialog */}
                <Dialog open={showLanguageDialog} onOpenChange={setShowLanguageDialog}>
                  <DialogContent className="sm:max-w-[500px] max-h-[85vh] overflow-y-auto">
                    <DialogHeader>
                      <DialogTitle>Add Language Version</DialogTitle>
                      <p className="text-sm text-gray-600 dark:text-muted-foreground">
                        Upload the {selectedTemplate?.language === "English" ? "Spanish" : "English"} version for "{selectedTemplate?.name}"
                      </p>
                    </DialogHeader>
                    <form onSubmit={(e) => {
                      e.preventDefault();
                      setShowLanguageDialog(false);
                      toast({
                        title: "Language version added!",
                        description: `${selectedTemplate?.language === "English" ? "Spanish" : "English"} version uploaded successfully.`,
                      });
                    }} className="space-y-4">
                      <div>
                        <Label htmlFor="languageVersion">Language</Label>
                        <Select name="language" required defaultValue={selectedTemplate?.language === "English" ? "Spanish" : "English"}>
                          <SelectTrigger>
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="English">🇺🇸 English</SelectItem>
                            <SelectItem value="Spanish">🇪🇸 Spanish (Español)</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                      
                      <div>
                        <Label htmlFor="languageFileName">File Name</Label>
                        <Input 
                          id="languageFileName" 
                          name="originalFileName" 
                          defaultValue={selectedTemplate?.originalFileName ? selectedTemplate.originalFileName.replace(/\.(pdf|ppt|docx|png|jpg|mp4)$/i, `_${selectedTemplate?.language === "English" ? "ES" : "EN"}.$1`) : ""}
                          required 
                        />
                      </div>
                      
                      <div>
                        <Label>Upload Language File</Label>
                        <UploadZone onUpload={(file) => {
                          const fileNameInput = document.getElementById('languageFileName') as HTMLInputElement;
                          if (fileNameInput && !fileNameInput.value) {
                            fileNameInput.value = file.name;
                          }
                        }} />
                      </div>
                      
                      <div className="flex justify-end space-x-2">
                        <Button type="button" variant="outline" onClick={() => setShowLanguageDialog(false)}>
                          Cancel
                        </Button>
                        <Button type="submit">
                          Upload Language Version
                        </Button>
                      </div>
                    </form>
                  </DialogContent>
                </Dialog>

                {/* Upload New Version Dialog */}
                <Dialog open={showVersionDialog} onOpenChange={setShowVersionDialog}>
                  <DialogContent className="sm:max-w-[500px] max-h-[85vh] overflow-y-auto">
                    <DialogHeader>
                      <DialogTitle>Upload New Version</DialogTitle>
                      <div className="space-y-2">
                        <p className="text-sm text-gray-600 dark:text-muted-foreground">
                          Upload a new version of "{selectedTemplate?.name}" (Current: v{selectedTemplate?.version})
                        </p>
                        <div className="bg-gray-50 dark:bg-gray-800 border rounded-lg p-3">
                          <p className="text-sm font-medium text-gray-900 dark:text-foreground mb-2">📋 Upload Instructions:</p>
                          <ol className="text-xs text-gray-600 dark:text-muted-foreground space-y-1 list-decimal list-inside">
                            <li>Upload the updated file for this language ({selectedTemplate?.language})</li>
                            <li>Version will auto-increment to v{(parseFloat(selectedTemplate?.version || "1.0") + 0.1).toFixed(1)} for both EN and ES</li>
                            <li>If you have both languages, remember to upload the other language version separately</li>
                            <li>Clients will see the updated version across all their selected languages</li>
                          </ol>
                        </div>
                      </div>
                    </DialogHeader>
                    <form onSubmit={(e) => {
                      e.preventDefault();
                      const nextVersion = parseFloat(selectedTemplate?.version || "1.0") + 0.1;
                      setShowVersionDialog(false);
                      toast({
                        title: "New version uploaded!",
                        description: `Version ${nextVersion.toFixed(1)} of "${selectedTemplate?.name}" uploaded successfully.`,
                      });
                    }} className="space-y-4">
                      <div>
                        <Label htmlFor="newVersion">New Version Number</Label>
                        <Input 
                          id="newVersion" 
                          name="version" 
                          defaultValue={(parseFloat(selectedTemplate?.version || "1.0") + 0.1).toFixed(1)}
                          required 
                        />
                        <p className="text-xs text-gray-500 mt-1">
                          Version will auto-increment from {selectedTemplate?.version} to {(parseFloat(selectedTemplate?.version || "1.0") + 0.1).toFixed(1)}
                        </p>
                      </div>
                      
                      <div>
                        <Label htmlFor="versionFileName">File Name</Label>
                        <Input 
                          id="versionFileName" 
                          name="originalFileName" 
                          defaultValue={selectedTemplate?.originalFileName || ""}
                          required 
                        />
                      </div>
                      
                      <div>
                        <Label>Upload New Version File</Label>
                        <UploadZone onUpload={(file) => {
                          const fileNameInput = document.getElementById('versionFileName') as HTMLInputElement;
                          if (fileNameInput && !fileNameInput.value) {
                            fileNameInput.value = file.name;
                          }
                        }} />
                        <p className="text-sm text-gray-500 mt-1">
                          This will replace the current file for this language version ({selectedTemplate?.language})
                        </p>
                      </div>
                      
                      <div className="bg-blue-50 border border-blue-200 rounded-lg p-3">
                        <p className="text-sm text-blue-800">
                          <strong>Shared Version System:</strong> Both English and Spanish versions will be updated to v{(parseFloat(selectedTemplate?.version || "1.0") + 0.1).toFixed(1)}. This keeps all language variants synchronized.
                        </p>
                      </div>
                      
                      <div className="flex justify-end space-x-2">
                        <Button type="button" variant="outline" onClick={() => setShowVersionDialog(false)}>
                          Cancel
                        </Button>
                        <Button type="submit">
                          Upload Version {(parseFloat(selectedTemplate?.version || "1.0") + 0.1).toFixed(1)}
                        </Button>
                      </div>
                    </form>
                  </DialogContent>
                </Dialog>
              </div>

              {templatesLoading ? (
                <div className="text-center py-8">Loading templates...</div>
              ) : (
                <div className="space-y-4">
                  {templates.map((template: any) => (
                    <Card key={template.id} className="p-4">
                      <div className="flex items-center justify-between">
                        <div className="flex-1">
                          <div className="flex items-center space-x-3">
                            <h4 className="font-medium text-gray-900 dark:text-foreground">{template.name}</h4>
                            <Badge variant="outline">{template.type}</Badge>
                          </div>
                          <p className="text-sm text-gray-500 dark:text-muted-foreground mt-1">
                            Version {template.version} • {template.fileType?.toUpperCase()} • Last updated {new Date(template.updatedAt || template.createdAt || Date.now()).toLocaleDateString()}
                          </p>
                          {template.description && (
                            <p className="text-sm text-gray-600 dark:text-muted-foreground mt-1">{template.description}</p>
                          )}
                        </div>
                        <div className="flex items-center space-x-2">
                          <Button 
                            variant="outline" 
                            size="sm" 
                            className="bg-blue-50 hover:bg-blue-100 text-blue-700 border-blue-200"
                            onClick={() => {
                              setSelectedTemplate(template);
                              setShowVersionDialog(true);
                            }}
                          >
                            <Plus className="h-3 w-3 mr-1" />
                            New Version
                          </Button>
                          <Button 
                            variant="outline" 
                            size="sm" 
                            className="bg-green-50 hover:bg-green-100 text-green-700 border-green-200"
                            onClick={() => {
                              setSelectedTemplate(template);
                              setShowLanguageDialog(true);
                            }}
                          >
                            <Plus className="h-3 w-3 mr-1" />
                            Add Language
                          </Button>
                          <Button variant="outline" size="sm">
                            <Download className="h-3 w-3" />
                          </Button>
                          <Button variant="outline" size="sm">
                            <Edit className="h-3 w-3" />
                          </Button>
                          <Button variant="outline" size="sm">
                            <Trash2 className="h-3 w-3" />
                          </Button>
                        </div>
                      </div>
                      
                      {/* Language Versions Indicator */}
                      <div className="mt-3 pt-3 border-t">
                        <div className="flex items-center justify-between">
                          <div className="flex items-center space-x-2">
                            <span className="text-xs text-gray-500 dark:text-muted-foreground">Available Languages:</span>
                            <div className="flex space-x-1">
                              {template.languageVariants?.map((lang: string) => (
                                <Badge key={lang} variant="secondary" className="text-xs">
                                  {lang === "English" ? "EN" : "ES"}
                                </Badge>
                              ))}
                            </div>
                          </div>
                          <div className="flex space-x-1">
                            {!template.languageVariants?.includes("English") && (
                              <Button variant="outline" size="sm" className="text-xs">
                                + Add English
                              </Button>
                            )}
                            {!template.languageVariants?.includes("Spanish") && (
                              <Button variant="outline" size="sm" className="text-xs">
                                + Add Spanish
                              </Button>
                            )}
                          </div>
                        </div>
                      </div>
                    </Card>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="settings" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>System Settings</CardTitle>
              <p className="text-gray-600 dark:text-muted-foreground">
                Configure platform settings and multi-language preferences
              </p>
            </CardHeader>
            <CardContent>
              <p className="text-gray-500 dark:text-muted-foreground">Settings panel coming soon...</p>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}