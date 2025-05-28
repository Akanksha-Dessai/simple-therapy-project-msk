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
      category: formData.get("category") as string,
      type: formData.get("type") as string,
      originalFileName: formData.get("originalFileName") as string,
      fileUrl: "/templates/" + formData.get("originalFileName"),
      fileType: formData.get("fileType") as string,
      version: formData.get("version") as string,
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

  const getCategoryStats = () => {
    const stats = templates.reduce((acc: any, template: any) => {
      acc[template.category] = (acc[template.category] || 0) + 1;
      return acc;
    }, {});
    
    return {
      launch: stats.launch || 0,
      ongoing: stats.ongoing || 0,
      future: stats.future || 0,
    };
  };

  const categoryStats = getCategoryStats();

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
                Manage clients, assets, and toolkit configurations
              </p>
            </div>
            <div className="flex space-x-3">
              <Dialog open={showClientDialog} onOpenChange={setShowClientDialog}>
                <DialogTrigger asChild>
                  <Button className="bg-secondary hover:bg-green-600 text-white">
                    <Plus className="mr-2 h-4 w-4" /> Add Client
                  </Button>
                </DialogTrigger>
                <DialogContent className="sm:max-w-[425px]">
                  <DialogHeader>
                    <DialogTitle>
                      {editingClient ? "Edit Client" : "Add New Client"}
                    </DialogTitle>
                  </DialogHeader>
                  <form onSubmit={handleClientSubmit} className="space-y-4">
                    <div>
                      <Label htmlFor="name">Company Name</Label>
                      <Input
                        id="name"
                        name="name"
                        defaultValue={editingClient?.name || ""}
                        required
                      />
                    </div>
                    <div>
                      <Label htmlFor="accessCode">Access Code</Label>
                      <Input
                        id="accessCode"
                        name="accessCode"
                        defaultValue={editingClient?.accessCode || ""}
                        required
                      />
                    </div>
                    <div>
                      <Label htmlFor="contactEmail">Contact Email</Label>
                      <Input
                        id="contactEmail"
                        name="contactEmail"
                        type="email"
                        defaultValue={editingClient?.contactEmail || ""}
                        required
                      />
                    </div>
                    <div>
                      <Label htmlFor="eligibilityLanguage">Eligibility Language</Label>
                      <Textarea
                        id="eligibilityLanguage"
                        name="eligibilityLanguage"
                        defaultValue={editingClient?.eligibilityLanguage || ""}
                        required
                      />
                    </div>
                    <div>
                      <Label htmlFor="logoUrl">Logo URL</Label>
                      <Input
                        id="logoUrl"
                        name="logoUrl"
                        defaultValue={editingClient?.logoUrl || ""}
                      />
                    </div>
                    <div>
                      <Label htmlFor="qrCodeUrl">QR Code URL</Label>
                      <Input
                        id="qrCodeUrl"
                        name="qrCodeUrl"
                        defaultValue={editingClient?.qrCodeUrl || ""}
                      />
                    </div>
                    <div>
                      <Label htmlFor="status">Status</Label>
                      <Select name="status" defaultValue={editingClient?.status || "active"}>
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="active">Active</SelectItem>
                          <SelectItem value="pending">Pending</SelectItem>
                          <SelectItem value="inactive">Inactive</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <Button
                      type="submit"
                      className="w-full"
                      disabled={createClientMutation.isPending || updateClientMutation.isPending}
                    >
                      {editingClient ? "Update Client" : "Create Client"}
                    </Button>
                  </form>
                </DialogContent>
              </Dialog>

              <Dialog open={showTemplateDialog} onOpenChange={setShowTemplateDialog}>
                <DialogTrigger asChild>
                  <Button className="bg-primary hover:bg-primary-dark text-white">
                    <Upload className="mr-2 h-4 w-4" /> Upload Assets
                  </Button>
                </DialogTrigger>
                <DialogContent className="sm:max-w-[425px]">
                  <DialogHeader>
                    <DialogTitle>Upload New Template</DialogTitle>
                  </DialogHeader>
                  <form onSubmit={handleTemplateSubmit} className="space-y-4">
                    <div>
                      <Label htmlFor="templateName">Template Name</Label>
                      <Input id="templateName" name="name" required />
                    </div>
                    <div>
                      <Label htmlFor="category">Category</Label>
                      <Select name="category" required>
                        <SelectTrigger>
                          <SelectValue placeholder="Select category" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="launch">Launch Materials</SelectItem>
                          <SelectItem value="ongoing">Ongoing Assets</SelectItem>
                          <SelectItem value="future">Future Phase</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div>
                      <Label htmlFor="type">Asset Type</Label>
                      <Select name="type" required>
                        <SelectTrigger>
                          <SelectValue placeholder="Select type" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="flyer">Flyer</SelectItem>
                          <SelectItem value="poster">Poster</SelectItem>
                          <SelectItem value="banner">Banner</SelectItem>
                          <SelectItem value="email">Email Template</SelectItem>
                          <SelectItem value="video">Video</SelectItem>
                          <SelectItem value="presentation">Presentation</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div>
                      <Label htmlFor="originalFileName">File Name</Label>
                      <Input id="originalFileName" name="originalFileName" required />
                    </div>
                    <div>
                      <Label htmlFor="fileType">File Type</Label>
                      <Select name="fileType" required>
                        <SelectTrigger>
                          <SelectValue placeholder="Select file type" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="pdf">PDF</SelectItem>
                          <SelectItem value="ppt">PowerPoint</SelectItem>
                          <SelectItem value="docx">Word Document</SelectItem>
                          <SelectItem value="png">PNG Image</SelectItem>
                          <SelectItem value="jpg">JPG Image</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div>
                      <Label htmlFor="version">Version</Label>
                      <Input id="version" name="version" placeholder="e.g., v1.0" required />
                    </div>
                    <div>
                      <Label htmlFor="templateDescription">Description</Label>
                      <Textarea id="templateDescription" name="description" />
                    </div>
                    <Button
                      type="submit"
                      className="w-full"
                      disabled={createTemplateMutation.isPending}
                    >
                      Create Template
                    </Button>
                  </form>
                </DialogContent>
              </Dialog>
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
              {/* Search and Filters */}
              <div className="flex flex-col sm:flex-row gap-4 mb-6">
                <div className="flex-1">
                  <Input
                    placeholder="Search clients..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                  />
                </div>
                <div className="flex space-x-2">
                  <Select defaultValue="all">
                    <SelectTrigger className="w-40">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Statuses</SelectItem>
                      <SelectItem value="active">Active</SelectItem>
                      <SelectItem value="pending">Pending</SelectItem>
                      <SelectItem value="inactive">Inactive</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              {/* Clients Table */}
              <div className="overflow-x-auto">
                {clientsLoading ? (
                  <div className="text-center py-8">Loading clients...</div>
                ) : (
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Client</TableHead>
                        <TableHead>Access Code</TableHead>
                        <TableHead>Assets Generated</TableHead>
                        <TableHead>Status</TableHead>
                        <TableHead>Actions</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {filteredClients.map((client: any) => (
                        <TableRow key={client.id}>
                          <TableCell>
                            <div className="flex items-center">
                              {client.logoUrl && (
                                <img
                                  src={client.logoUrl}
                                  alt={`${client.name} Logo`}
                                  className="w-10 h-10 rounded-lg object-cover mr-3"
                                />
                              )}
                              <div>
                                <div className="text-sm font-medium text-gray-900 dark:text-foreground">
                                  {client.name}
                                </div>
                                <div className="text-sm text-gray-500 dark:text-muted-foreground">
                                  {client.contactEmail}
                                </div>
                              </div>
                            </div>
                          </TableCell>
                          <TableCell>
                            <Badge variant="outline" className="font-mono">
                              {client.accessCode}
                            </Badge>
                          </TableCell>
                          <TableCell>
                            <span>{client.assetCount} assets</span>
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
                          required
                        />
                      </div>
                      <div>
                        <Label htmlFor="categorySlug">Category Slug</Label>
                        <Input
                          id="categorySlug"
                          name="slug"
                          defaultValue={editingCategory?.slug || ""}
                          placeholder="e.g., launch-materials"
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
              <CardTitle>Master Asset Templates</CardTitle>
              <p className="text-gray-600 dark:text-muted-foreground">
                Upload and manage template assets that will be customized for each client
              </p>
            </CardHeader>
            <CardContent>
              <UploadZone onUpload={(file) => console.log("Uploaded:", file)} />

              {/* Template Categories */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-8">
                <Card>
                  <CardContent className="p-4">
                    <div className="flex items-center mb-3">
                      <div className="w-8 h-8 bg-secondary rounded flex items-center justify-center mr-2">
                        <span className="text-white text-sm font-bold">L</span>
                      </div>
                      <h4 className="font-medium text-gray-900 dark:text-foreground">
                        Launch Materials
                      </h4>
                    </div>
                    <p className="text-sm text-gray-600 dark:text-muted-foreground mb-3">
                      {categoryStats.launch} templates
                    </p>
                    <div className="space-y-2 text-sm">
                      {templates
                        .filter((t: any) => t.category === "launch")
                        .slice(0, 3)
                        .map((template: any) => (
                          <div
                            key={template.id}
                            className="flex items-center justify-between"
                          >
                            <span>{template.name}</span>
                            <span className="text-gray-500 dark:text-muted-foreground">
                              {template.version}
                            </span>
                          </div>
                        ))}
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardContent className="p-4">
                    <div className="flex items-center mb-3">
                      <div className="w-8 h-8 bg-blue-600 rounded flex items-center justify-center mr-2">
                        <span className="text-white text-sm font-bold">O</span>
                      </div>
                      <h4 className="font-medium text-gray-900 dark:text-foreground">
                        Ongoing Assets
                      </h4>
                    </div>
                    <p className="text-sm text-gray-600 dark:text-muted-foreground mb-3">
                      {categoryStats.ongoing} templates
                    </p>
                    <div className="space-y-2 text-sm">
                      {templates
                        .filter((t: any) => t.category === "ongoing")
                        .slice(0, 3)
                        .map((template: any) => (
                          <div
                            key={template.id}
                            className="flex items-center justify-between"
                          >
                            <span>{template.name}</span>
                            <span className="text-gray-500 dark:text-muted-foreground">
                              {template.version}
                            </span>
                          </div>
                        ))}
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardContent className="p-4">
                    <div className="flex items-center mb-3">
                      <div className="w-8 h-8 bg-orange-500 rounded flex items-center justify-center mr-2">
                        <span className="text-white text-sm font-bold">F</span>
                      </div>
                      <h4 className="font-medium text-gray-900 dark:text-foreground">
                        Future Phase
                      </h4>
                    </div>
                    <p className="text-sm text-gray-600 dark:text-muted-foreground mb-3">
                      {categoryStats.future} templates
                    </p>
                    <div className="space-y-2 text-sm">
                      {templates
                        .filter((t: any) => t.category === "future")
                        .slice(0, 3)
                        .map((template: any) => (
                          <div
                            key={template.id}
                            className="flex items-center justify-between"
                          >
                            <span>{template.name}</span>
                            <span className="text-gray-500 dark:text-muted-foreground">
                              {template.version}
                            </span>
                          </div>
                        ))}
                    </div>
                  </CardContent>
                </Card>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="settings" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>System Settings</CardTitle>
              <p className="text-gray-600 dark:text-muted-foreground">
                Configure global platform settings and preferences
              </p>
            </CardHeader>
            <CardContent>
              <div className="space-y-6">
                <div>
                  <h4 className="text-lg font-medium mb-2">Branding Configuration</h4>
                  <p className="text-sm text-gray-600 dark:text-muted-foreground mb-4">
                    Configure how client logos and branding are displayed across all materials
                  </p>
                  <div className="space-y-4">
                    <div>
                      <Label>Logo Placement</Label>
                      <Select defaultValue="top">
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="top">SimpleMSK + Client at top, ST at bottom</SelectItem>
                          <SelectItem value="header">All logos in header</SelectItem>
                          <SelectItem value="footer">All logos in footer</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div>
                      <Label>QR Code Type</Label>
                      <Select defaultValue="app">
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="app">App Download Link</SelectItem>
                          <SelectItem value="registration">Registration Flow</SelectItem>
                          <SelectItem value="custom">Custom URL</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                </div>

                <div>
                  <h4 className="text-lg font-medium mb-2">Asset Management</h4>
                  <p className="text-sm text-gray-600 dark:text-muted-foreground mb-4">
                    Control how assets are versioned and updated
                  </p>
                  <div className="space-y-4">
                    <div className="flex items-center space-x-2">
                      <input type="checkbox" id="autoVersion" defaultChecked />
                      <Label htmlFor="autoVersion">Automatically version assets on upload</Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <input type="checkbox" id="autoGenerate" defaultChecked />
                      <Label htmlFor="autoGenerate">Auto-generate client assets from templates</Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <input type="checkbox" id="spanishSupport" />
                      <Label htmlFor="spanishSupport">Enable Spanish language support</Label>
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
