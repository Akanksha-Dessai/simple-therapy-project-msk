import { useQuery } from "@tanstack/react-query";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { clientApi } from "@/lib/api";
import AssetCard from "./asset-card";
import ProgramSelector from "./program-selector";
import { useState } from "react";
import { Rocket, RotateCcw, Clock, QrCode, Globe, Video } from "lucide-react";

interface ClientDashboardProps {
  client: any;
}

export default function ClientDashboard({ client }: ClientDashboardProps) {
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [selectedType, setSelectedType] = useState("all");
  const [selectedProgram, setSelectedProgram] = useState<string | null>(null);
  const [selectedLanguage, setSelectedLanguage] = useState("English");
  const [categoryFilters, setCategoryFilters] = useState<{[key: string]: string}>({});

  const { data: assetsData, isLoading } = useQuery({
    queryKey: [`/api/client/${client.id}/assets`],
    queryFn: () => clientApi.getAssets(client.id),
  });

  const { data: categoriesData } = useQuery({
    queryKey: ['/api/admin/categories'],
    queryFn: () => fetch('/api/admin/categories').then(res => res.json()),
  });

  // Helper function to get unique asset types for a category
  const getAssetTypesForCategory = (assets: any[]) => {
    const types = Array.from(new Set(assets.map(asset => asset.type)));
    return types.sort();
  };

  // Helper function to filter assets by type within a category
  const filterAssetsByType = (assets: any[], selectedFilter: string) => {
    if (selectedFilter === "all") return assets;
    return assets.filter(asset => asset.type === selectedFilter);
  };

  // Helper function to set category filter
  const setCategoryFilter = (categoryName: string, filter: string) => {
    setCategoryFilters(prev => ({
      ...prev,
      [categoryName]: filter
    }));
  };

  const getAssetsInSelectedLanguage = (assets: any[]) => {
    // Filter assets to show only the selected language
    return assets.filter(asset => {
      // If asset has a language property, match it to selected language
      if (asset.language) {
        return asset.language === selectedLanguage;
      }
      // If no language property, show the asset (backward compatibility)
      return true;
    });
  };

  const filterAssets = (assets: any[]) => {
    const assetsInLanguage = getAssetsInSelectedLanguage(assets);
    return assetsInLanguage.filter((asset) => {
      // Map categoryId to category names for filtering
      let categoryName = "all";
      if (asset.categoryId) {
        switch (asset.categoryId) {
          case 1: case 5: case 9: case 13: categoryName = "intro"; break;
          case 2: case 6: case 10: case 14: categoryName = "launch"; break;
          case 3: case 7: case 11: case 15: categoryName = "ongoing"; break;
          case 4: case 8: case 12: case 16: categoryName = "videos"; break;
        }
      }
      
      const categoryMatch = selectedCategory === "all" || categoryName === selectedCategory;
      const typeMatch = selectedType === "all" || asset.type === selectedType;
      return categoryMatch && typeMatch;
    });
  };

  const getCategoryIcon = (category: string) => {
    switch (category) {
      case "intro":
        return <Clock className="text-white h-5 w-5" />;
      case "launch":
        return <Rocket className="text-white h-5 w-5" />;
      case "ongoing":
        return <RotateCcw className="text-white h-5 w-5" />;
      case "videos":
        return <Video className="text-white h-5 w-5" />;
      default:
        return <Rocket className="text-white h-5 w-5" />;
    }
  };

  const getCategoryColor = (category: string) => {
    switch (category) {
      case "intro":
        return "bg-green-600";
      case "launch":
        return "bg-secondary";
      case "ongoing":
        return "bg-blue-600";
      case "videos":
        return "bg-purple-600";
      default:
        return "bg-secondary";
    }
  };

  const getCategoryTitle = (category: string) => {
    switch (category) {
      case "intro":
        return "Introduction Materials";
      case "launch":
        return "Program Launch Materials";
      case "ongoing":
        return "Ongoing Campaign Assets";
      case "future":
        return "Future Phase Materials";
      case "videos":
        return "Video Resources";
      default:
        return "Assets";
    }
  };

  const getCategoryDescription = (category: string) => {
    switch (category) {
      case "intro":
        return "Overview materials to get started with the program";
      case "launch":
        return "Essential materials to introduce the program to your organization";
      case "ongoing":
        return "Regularly updated materials to maintain engagement";
      case "videos":
        return "Educational and promotional video content";
      default:
        return "";
    }
  };

  if (isLoading) {
    return (
      <div className="space-y-8">
        <div className="animate-pulse">
          <div className="bg-white dark:bg-card rounded-xl shadow-sm p-6 mb-8">
            <div className="h-16 bg-gray-200 dark:bg-muted rounded"></div>
          </div>
        </div>
      </div>
    );
  }

  if (!assetsData) {
    return (
      <div className="text-center py-8">
        <p className="text-gray-600 dark:text-muted-foreground">Failed to load assets</p>
      </div>
    );
  }

  const { assets } = assetsData;
  const filteredAssets = filterAssets(assets);
  
  // Helper function to get category name from categoryId
  const getCategoryName = (categoryId: number) => {
    switch (categoryId) {
      case 1: case 5: case 9: case 13: return "intro";
      case 2: case 6: case 10: case 14: return "launch";
      case 3: case 7: case 11: case 15: return "ongoing";
      case 4: case 8: case 12: case 16: return "videos";
      default: return "other";
    }
  };
  
  const introAssets = filteredAssets.filter((asset) => getCategoryName(asset.categoryId) === "intro");
  const launchAssets = filteredAssets.filter((asset) => getCategoryName(asset.categoryId) === "launch");
  const ongoingAssets = filteredAssets.filter((asset) => getCategoryName(asset.categoryId) === "ongoing");
  const videoAssets = filteredAssets.filter((asset) => getCategoryName(asset.categoryId) === "videos");

  return (
    <div className="space-y-8">
      {/* Client Branding Header */}
      <Card>
        <CardContent className="p-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              {client.logoUrl && (
                <img
                  src={client.logoUrl}
                  alt={`${client.name} Logo`}
                  className="w-16 h-16 object-cover rounded-lg"
                />
              )}
              <div>
                <h1 className="text-2xl font-semibold text-gray-900 dark:text-foreground">
                  {client.name}
                </h1>
                <p className="text-gray-600 dark:text-muted-foreground">
                  {client.eligibilityLanguage}
                </p>
              </div>
            </div>
            <div className="text-right">
              <div className="w-24 h-24 bg-gray-100 dark:bg-muted rounded-lg flex items-center justify-center">
                {client.qrCodeUrl ? (
                  <img
                    src={client.qrCodeUrl}
                    alt="QR Code"
                    className="w-20 h-20 object-cover"
                  />
                ) : (
                  <QrCode className="text-3xl text-gray-400 dark:text-muted-foreground h-8 w-8" />
                )}
              </div>
              <p className="text-xs text-gray-500 dark:text-muted-foreground mt-1">
                Your QR Code
              </p>
            </div>
          </div>
        </CardContent>
      </Card>


      {/* Communications Toolkit Description */}
      <Card className="mb-8">
        <CardContent className="p-8">
          <h2 className="text-2xl font-bold text-gray-900 dark:text-foreground mb-4">
            Communications Toolkit
          </h2>
          <div className="text-gray-700 dark:text-muted-foreground space-y-4">
            <p>Consistent and positive messaging is an important component of a successful promotional strategy for SimpleTherapy Programs. In order to maximize the visibility of your program, providers must make it appealing to everyone, whether they have an acute concern or just need support with everyday challenges.</p>
            <p>
              With that in mind, the SimpleTherapy Care Marketing Toolkit includes a variety of flyers, posters, brochures, and digital displays that maximize awareness of your program. The tools below are customized specifically for <strong>{client.name}</strong> and can be downloaded by selecting your program type and clicking the "Download" button on any asset.
            </p>
            <p>
              These materials represent a portion of your program's comprehensive engagement strategy, designed to reach your audience effectively across multiple touchpoints.
            </p>
            <p className="text-sm italic">
              For more information, or to discuss a specific promotional initiative, contact your account manager or reach out to our support team at{" "}
              <a href="mailto:account.support@simpletherapy.com" className="text-primary hover:underline">
                account.support@simpletherapy.com
              </a>
            </p>
          </div>
        </CardContent>
      </Card>
      {/* Program Selection */}
      <ProgramSelector 
        client={client} 
        onProgramSelect={setSelectedProgram}
        selectedProgram={selectedProgram}
      />
      {/* Only show assets after a program is selected */}
      {selectedProgram && (
        <>
          {/* Language Selector - appears after program selection */}
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <Globe className="h-5 w-5 text-gray-600 dark:text-muted-foreground" />
                  <span className="text-sm font-medium text-gray-700 dark:text-foreground">Language / Idioma:</span>
                </div>
                <Select value={selectedLanguage} onValueChange={setSelectedLanguage}>
                  <SelectTrigger className="w-48">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="English">🇺🇸 English</SelectItem>
                    <SelectItem value="Spanish">🇪🇸 Español</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </CardContent>
          </Card>
          {/* Launch Materials */}
          {launchAssets.length > 0 && (
            <Card>
          <CardContent className="p-6">
            <div className="flex items-center mb-6">
              <div className={`w-10 h-10 ${getCategoryColor("launch")} rounded-lg flex items-center justify-center mr-3`}>
                {getCategoryIcon("launch")}
              </div>
              <div>
                <h3 className="text-xl font-semibold text-gray-900 dark:text-foreground">
                  {getCategoryTitle("launch")}
                </h3>
                <p className="text-gray-600 dark:text-muted-foreground">
                  {getCategoryDescription("launch")}
                </p>
              </div>
            </div>

            {/* Asset Type Filter Buttons */}
            <div className="mb-4 p-3 bg-gray-50 dark:bg-gray-800 rounded-lg border border-red-200">
              <div className="flex flex-wrap gap-2">
                {(() => {
                  const availableTypes = getAssetTypesForCategory(launchAssets);
                  const currentFilter = categoryFilters["launch"] || "all";
                  return (
                    <>
                      <Button
                        variant={currentFilter === "all" ? "default" : "outline"}
                        size="sm"
                        onClick={() => setCategoryFilter("launch", "all")}
                        className="text-xs"
                      >
                        All ({launchAssets.length})
                      </Button>
                      {availableTypes.map(type => {
                        const count = launchAssets.filter(asset => asset.type === type).length;
                        return (
                          <Button
                            key={type}
                            variant={currentFilter === type ? "default" : "outline"}
                            size="sm"
                            onClick={() => setCategoryFilter("launch", type)}
                            className="text-xs capitalize"
                          >
                            {type} ({count})
                          </Button>
                        );
                      })}
                    </>
                  );
                })()}
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {filterAssetsByType(launchAssets, categoryFilters["launch"] || "all").map((asset) => (
                <AssetCard key={asset.id} asset={asset} client={client} categories={categoriesData || []} />
              ))}
            </div>
          </CardContent>
        </Card>
      )}

          {/* Ongoing Assets */}
          {ongoingAssets.length > 0 && (
            <Card>
              <CardContent className="p-6">
                <div className="flex items-center mb-6">
                  <div className={`w-10 h-10 ${getCategoryColor("ongoing")} rounded-lg flex items-center justify-center mr-3`}>
                    {getCategoryIcon("ongoing")}
                  </div>
                  <div>
                    <h3 className="text-xl font-semibold text-gray-900 dark:text-foreground">
                      {getCategoryTitle("ongoing")}
                    </h3>
                    <p className="text-gray-600 dark:text-muted-foreground">
                      {getCategoryDescription("ongoing")}
                    </p>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                  {ongoingAssets.map((asset) => (
                    <AssetCard key={asset.id} asset={asset} client={client} categories={categoriesData || []} />
                  ))}
                </div>
              </CardContent>
            </Card>
          )}

          {/* Videos */}
          {videoAssets.length > 0 && (
            <Card>
              <CardContent className="p-6">
                <div className="flex items-center mb-6">
                  <div className={`w-10 h-10 ${getCategoryColor("videos")} rounded-lg flex items-center justify-center mr-3`}>
                    {getCategoryIcon("videos")}
                  </div>
                  <div>
                    <h3 className="text-xl font-semibold text-gray-900 dark:text-foreground">
                      {getCategoryTitle("videos")}
                    </h3>
                    <p className="text-gray-600 dark:text-muted-foreground">
                      {getCategoryDescription("videos")}
                    </p>
                  </div>
                </div>

                {/* Asset Type Filter Buttons */}
                <div className="mb-4 p-3 bg-gray-50 dark:bg-gray-800 rounded-lg border border-red-200">
                  <div className="flex flex-wrap gap-2">
                    {(() => {
                      const availableTypes = getAssetTypesForCategory(videoAssets);
                      const currentFilter = categoryFilters["videos"] || "all";
                      return (
                        <>
                          <Button
                            variant={currentFilter === "all" ? "default" : "outline"}
                            size="sm"
                            onClick={() => setCategoryFilter("videos", "all")}
                            className="text-xs"
                          >
                            All ({videoAssets.length})
                          </Button>
                          {availableTypes.map(type => {
                            const count = videoAssets.filter(asset => asset.type === type).length;
                            return (
                              <Button
                                key={type}
                                variant={currentFilter === type ? "default" : "outline"}
                                size="sm"
                                onClick={() => setCategoryFilter("videos", type)}
                                className="text-xs capitalize"
                              >
                                {type} ({count})
                              </Button>
                            );
                          })}
                        </>
                      );
                    })()}
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                  {videoAssets.map((asset) => (
                    <AssetCard key={asset.id} asset={asset} client={client} categories={categoriesData || []} />
                  ))}
                </div>
              </CardContent>
            </Card>
          )}

          {/* Intro Materials */}
          {introAssets.length > 0 && (
            <Card>
              <CardContent className="p-6">
                <div className="flex items-center mb-6">
                  <div className={`w-10 h-10 ${getCategoryColor("intro")} rounded-lg flex items-center justify-center mr-3`}>
                    {getCategoryIcon("intro")}
                  </div>
                  <div>
                    <h3 className="text-xl font-semibold text-gray-900 dark:text-foreground">
                      {getCategoryTitle("intro")}
                    </h3>
                    <p className="text-gray-600 dark:text-muted-foreground">
                      {getCategoryDescription("intro")}
                    </p>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {introAssets.map((asset) => (
                    <AssetCard key={asset.id} asset={asset} client={client} categories={categoriesData || []} />
                  ))}
                </div>
              </CardContent>
            </Card>
          )}
        </>
      )}
    </div>
  );
}
