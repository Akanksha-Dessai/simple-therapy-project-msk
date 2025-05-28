import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { clientApi } from "@/lib/api";
import { useToast } from "@/hooks/use-toast";
import { FileText, FileImage, Video, Download } from "lucide-react";

interface AssetCardProps {
  asset: any;
  client: any;
}

export default function AssetCard({ asset, client }: AssetCardProps) {
  const { toast } = useToast();

  const getAssetIcon = (type: string, fileType: string) => {
    if (type === "video") {
      return <Video className="text-purple-500 mr-2 h-4 w-4" />;
    }
    if (fileType === "pdf" || fileType === "docx") {
      return <FileText className="text-red-500 mr-2 h-4 w-4" />;
    }
    return <FileImage className="text-blue-500 mr-2 h-4 w-4" />;
  };

  const getPreviewImage = (type: string) => {
    switch (type) {
      case "flyer":
        if (asset.name.toLowerCase().includes("mental health")) {
          return "https://images.unsplash.com/photo-1506905925346-21bda4d32df4?ixlib=rb-4.0.3&auto=format&fit=crop&w=300&h=200";
        }
        return "https://images.unsplash.com/photo-1586953208448-b95a79798f07?ixlib=rb-4.0.3&auto=format&fit=crop&w=300&h=200";
      case "poster":
        return "https://images.unsplash.com/photo-1497486751825-1233686d5d80?ixlib=rb-4.0.3&auto=format&fit=crop&w=300&h=200";
      case "banner":
        return "https://images.unsplash.com/photo-1551288049-bebda4e38f71?ixlib=rb-4.0.3&auto=format&fit=crop&w=300&h=200";
      case "email":
        return "https://images.unsplash.com/photo-1586953208448-b95a79798f07?ixlib=rb-4.0.3&auto=format&fit=crop&w=300&h=200";
      default:
        return "https://images.unsplash.com/photo-1586953208448-b95a79798f07?ixlib=rb-4.0.3&auto=format&fit=crop&w=300&h=200";
    }
  };

  const handleDownload = async (format: string) => {
    try {
      const response = await clientApi.downloadAsset(asset.id, client.id);
      
      // Simulate file download
      toast({
        title: "Download Started",
        description: `Downloading ${asset.name} as ${format.toUpperCase()}`,
      });
      
      // In a real implementation, this would trigger an actual file download
      console.log("Download URL:", response.downloadUrl);
    } catch (error) {
      toast({
        title: "Download Failed",
        description: "Unable to download asset. Please try again.",
        variant: "destructive",
      });
    }
  };

  const isVideo = asset.type === "video";

  return (
    <div className="border border-gray-200 dark:border-border rounded-lg p-4 hover:shadow-md transition-shadow">
      {!isVideo && (
        <img
          src={getPreviewImage(asset.type)}
          alt={`${asset.name} Preview`}
          className="w-full h-32 object-cover rounded mb-3"
        />
      )}
      
      <div className="flex items-center justify-between mb-2">
        <div className="flex items-center">
          {getAssetIcon(asset.type, asset.fileType)}
          <span className="font-medium text-sm text-gray-900 dark:text-foreground">
            {asset.name}
          </span>
        </div>
        <Badge variant="secondary" className="text-xs">
          {asset.version}
        </Badge>
      </div>
      
      <p className="text-xs text-gray-600 dark:text-muted-foreground mb-3 capitalize">
        {asset.type} • {asset.category}
      </p>
      
      {asset.description && (
        <p className="text-xs text-gray-600 dark:text-muted-foreground mb-3">
          {asset.description}
        </p>
      )}

      {isVideo ? (
        <Button 
          className="w-full bg-purple-600 hover:bg-purple-700 text-white"
          size="sm"
        >
          <Video className="mr-1 h-3 w-3" /> View Video
        </Button>
      ) : (
        <div className="flex space-x-1">
          <Button
            className="flex-1 bg-primary hover:bg-primary-dark text-white"
            size="sm"
            onClick={() => handleDownload(asset.fileType)}
          >
            <Download className="mr-1 h-3 w-3" />
            {asset.fileType.toUpperCase()}
          </Button>
          
          {asset.fileType !== "png" && asset.fileType !== "jpg" && (
            <Button
              variant="outline"
              className="flex-1"
              size="sm"
              onClick={() => handleDownload("png")}
            >
              <Download className="mr-1 h-3 w-3" />
              PNG
            </Button>
          )}
        </div>
      )}
    </div>
  );
}
