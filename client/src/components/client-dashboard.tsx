import { useQuery } from "@tanstack/react-query";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { clientApi } from "@/lib/api";
import AssetCard from "./asset-card";
import { useState } from "react";
import { Rocket, RotateCcw, Clock, QrCode } from "lucide-react";

interface ClientDashboardProps {
  client: any;
}

export default function ClientDashboard({ client }: ClientDashboardProps) {
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [selectedType, setSelectedType] = useState("all");

  const { data: assetsData, isLoading } = useQuery({
    queryKey: [`/api/client/${client.id}/assets`],
    queryFn: () => clientApi.getAssets(client.id),
  });

  const filterAssets = (assets: any[]) => {
    return assets.filter((asset) => {
      const categoryMatch = selectedCategory === "all" || asset.category === selectedCategory;
      const typeMatch = selectedType === "all" || asset.type === selectedType;
      return categoryMatch && typeMatch;
    });
  };

  const getCategoryIcon = (category: string) => {
    switch (category) {
      case "launch":
        return <Rocket className="text-white h-5 w-5" />;
      case "ongoing":
        return <RotateCcw className="text-white h-5 w-5" />;
      case "future":
        return <Clock className="text-white h-5 w-5" />;
      default:
        return <Rocket className="text-white h-5 w-5" />;
    }
  };

  const getCategoryColor = (category: string) => {
    switch (category) {
      case "launch":
        return "bg-secondary";
      case "ongoing":
        return "bg-blue-600";
      case "future":
        return "bg-orange-500";
      default:
        return "bg-secondary";
    }
  };

  const getCategoryTitle = (category: string) => {
    switch (category) {
      case "launch":
        return "Program Launch Materials";
      case "ongoing":
        return "Ongoing Campaign Assets";
      case "future":
        return "Future Phase Materials";
      default:
        return "Assets";
    }
  };

  const getCategoryDescription = (category: string) => {
    switch (category) {
      case "launch":
        return "Essential materials to introduce the program to your organization";
      case "ongoing":
        return "Regularly updated materials to maintain engagement";
      case "future":
        return "Upcoming materials and enhancements";
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
  const launchAssets = assets.filter((asset) => asset.category === "launch");
  const ongoingAssets = assets.filter((asset) => asset.category === "ongoing");
  const futureAssets = assets.filter((asset) => asset.category === "future");

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

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {launchAssets.map((asset) => (
                <AssetCard key={asset.id} asset={asset} client={client} />
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

            {/* Asset Type Filters */}
            <div className="flex flex-wrap gap-2 mb-6">
              <Button
                variant={selectedType === "all" ? "default" : "outline"}
                size="sm"
                onClick={() => setSelectedType("all")}
                className={selectedType === "all" ? "bg-primary text-white" : ""}
              >
                All
              </Button>
              <Button
                variant={selectedType === "flyer" ? "default" : "outline"}
                size="sm"
                onClick={() => setSelectedType("flyer")}
                className={selectedType === "flyer" ? "bg-primary text-white" : ""}
              >
                Flyers
              </Button>
              <Button
                variant={selectedType === "poster" ? "default" : "outline"}
                size="sm"
                onClick={() => setSelectedType("poster")}
                className={selectedType === "poster" ? "bg-primary text-white" : ""}
              >
                Posters
              </Button>
              <Button
                variant={selectedType === "banner" ? "default" : "outline"}
                size="sm"
                onClick={() => setSelectedType("banner")}
                className={selectedType === "banner" ? "bg-primary text-white" : ""}
              >
                Digital Banners
              </Button>
              <Button
                variant={selectedType === "campaign" ? "default" : "outline"}
                size="sm"
                onClick={() => setSelectedType("campaign")}
                className={selectedType === "campaign" ? "bg-primary text-white" : ""}
              >
                Campaigns
              </Button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              {filterAssets(ongoingAssets).map((asset) => (
                <AssetCard key={asset.id} asset={asset} client={client} />
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Future Phase Materials */}
      {futureAssets.length > 0 && (
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center mb-6">
              <div className={`w-10 h-10 ${getCategoryColor("future")} rounded-lg flex items-center justify-center mr-3`}>
                {getCategoryIcon("future")}
              </div>
              <div>
                <h3 className="text-xl font-semibold text-gray-900 dark:text-foreground">
                  {getCategoryTitle("future")}
                </h3>
                <p className="text-gray-600 dark:text-muted-foreground">
                  {getCategoryDescription("future")}
                </p>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {futureAssets.map((asset) => (
                <AssetCard key={asset.id} asset={asset} client={client} />
              ))}
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
