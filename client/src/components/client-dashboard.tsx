import { useQuery } from "@tanstack/react-query";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { clientApi } from "@/lib/api";
import AssetCard from "./asset-card";
import ProgramSelector from "./program-selector";
import SimpleEAPCard from "./simple-eap-card";
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

  // Helper function to filter assets by category, type, and language
  const filterAssets = (assets: any[]) => {
    return assets.filter((asset: any) => {
      const categoryMatch = selectedCategory === "all" || asset.category === selectedCategory;
      const typeMatch = selectedType === "all" || asset.type === selectedType;
      return categoryMatch && typeMatch;
    });
  };

  if (isLoading) {
    return (
      <div className="space-y-8">
        <div className="animate-pulse">
          <div className="bg-white dark:bg-card rounded-xl shadow-sm p-6 mb-8">
            <div className="h-6 bg-gray-200 dark:bg-gray-700 rounded w-1/4 mb-4"></div>
            <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-3/4"></div>
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
                <p className="text-gray-600 dark:text-muted-foreground mb-2">
                  {client.eligibilityLanguage}
                </p>
                <div className="flex flex-col space-y-1">
                  <div className="flex items-center space-x-2">
                    <span className="text-sm text-gray-500 dark:text-muted-foreground">Client Code:</span>
                    <code className="bg-purple-50 dark:bg-purple-900 px-2 py-1 rounded text-sm text-purple-700 dark:text-purple-300">
                      {client.clientCode || 'ACME-MSK-2024'}
                    </code>
                  </div>
                  {(client.landingPageUrl || 'https://acme-corp.com/wellness') && (
                    <div className="flex items-center space-x-2">
                      <Globe className="h-4 w-4 text-gray-500 dark:text-muted-foreground" />
                      <a 
                        href={client.landingPageUrl || 'https://acme-corp.com/wellness'} 
                        target="_blank" 
                        rel="noopener noreferrer"
                        className="text-blue-600 hover:text-blue-800 dark:text-blue-400 dark:hover:text-blue-300 text-sm hover:underline"
                      >
                        {(client.landingPageUrl || 'https://acme-corp.com/wellness').replace('https://', '').replace('http://', '')}
                      </a>
                    </div>
                  )}
                </div>
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
          {/* SimpleEAP External Platform Card */}
          {selectedProgram === 'SimpleEAP' && (
            <SimpleEAPCard client={client} />
          )}

          {/* Regular asset interface for other programs */}
          {selectedProgram !== 'SimpleEAP' && (
            <>
              {/* Language Selector */}
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

              {/* Simple asset grid for other programs */}
              <Card>
                <CardContent className="p-6">
                  <h3 className="text-xl font-semibold mb-4">Assets for {selectedProgram}</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {filteredAssets.map((asset: any) => (
                      <AssetCard key={asset.id} asset={asset} client={client} categories={categoriesData || []} />
                    ))}
                  </div>
                </CardContent>
              </Card>
            </>
          )}
        </>
      )}
    </div>
  );
}