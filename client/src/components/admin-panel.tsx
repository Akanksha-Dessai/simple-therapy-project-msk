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
      accessCode: formData.get("accessCode") as string,
      contactEmail: formData.get("contactEmail") as string,
      eligibilityLanguage: formData.get("eligibilityLanguage") as string,
      logoUrl: formData.get("logoUrl") as string || null,
      qrCodeUrl: formData.get("qrCodeUrl") as string || null,
      status: formData.get("status") as string,
    };

    if (editingClient) {
      updateClientMutation.mutate({ id: editingClient.id, data: clientData });
    } else {
      createClientMutation.mutate(clientData);
    }
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
    const categoryData = {
      name: formData.get("name") as string,
      slug: formData.get("slug") as string,
      description: formData.get("description") as string || null,
      programType: formData.get("programType") as string,
      displayOrder: parseInt(formData.get("displayOrder") as string) || 0,
      status: formData.get("status") as string,
    };

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
              </div>

              <div className="overflow-x-auto">
                {clientsLoading ? (
                  <div className="text-center py-8">Loading clients...</div>
                ) : (
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Client</TableHead>
                        <TableHead>Access Code</TableHead>
                        <TableHead>Status</TableHead>
                        <TableHead>Actions</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {filteredClients.map((client: any) => (
                        <TableRow key={client.id}>
                          <TableCell>{client.name}</TableCell>
                          <TableCell>
                            <code className="bg-gray-100 dark:bg-gray-800 px-2 py-1 rounded text-sm">
                              {client.accessCode}
                            </code>
                          </TableCell>
                          <TableCell>
                            <Badge className={getStatusColor(client.status)}>
                              {client.status}
                            </Badge>
                          </TableCell>
                          <TableCell>
                            <div className="flex space-x-2">
                              <Button variant="outline" size="sm">
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
                        <Label htmlFor="programType">Assign to Program</Label>
                        <Select name="programType" defaultValue={editingCategory?.programType || ""} required>
                          <SelectTrigger>
                            <SelectValue placeholder="Select program" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="SimpleMSK">SimpleMSK</SelectItem>
                            <SelectItem value="SimpleEAP">SimpleEAP</SelectItem>
                            <SelectItem value="SimpleBehavioural">SimpleBehavioural</SelectItem>
                            <SelectItem value="SimpleWellbeing">SimpleWellbeing</SelectItem>
                          </SelectContent>
                        </Select>
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
                    const programCategories = categories.filter((cat: any) => cat.programType === program);
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
                      <Plus className="mr-2 h-4 w-4" /> Add Template
                    </Button>
                  </DialogTrigger>
                  <DialogContent className="sm:max-w-[425px]">
                    <DialogHeader>
                      <DialogTitle>Upload New Asset Template</DialogTitle>
                      <p className="text-sm text-gray-600 dark:text-muted-foreground">
                        Create a template asset that will be customized with client branding and made available in both English and Spanish
                      </p>
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
                        <Input id="version" name="version" defaultValue="1.0" required />
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
                            <Badge className="bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300">
                              {template.language}
                            </Badge>
                          </div>
                          <p className="text-sm text-gray-500 dark:text-muted-foreground mt-1">
                            Version {template.version} • {template.fileType?.toUpperCase()}
                          </p>
                          {template.description && (
                            <p className="text-sm text-gray-600 dark:text-muted-foreground mt-1">{template.description}</p>
                          )}
                        </div>
                        <div className="flex items-center space-x-2">
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