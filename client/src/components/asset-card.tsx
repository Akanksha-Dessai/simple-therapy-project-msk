import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { clientApi } from "@/lib/api";
import { useToast } from "@/hooks/use-toast";
import { FileText, FileImage, Video, Download, Link, Copy, Play } from "lucide-react";

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
      case "video":
        return "https://images.unsplash.com/photo-1574375927938-d5a98e8ffe85?ixlib=rb-4.0.3&auto=format&fit=crop&w=300&h=200";
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
      case "presentation":
        return "https://images.unsplash.com/photo-1560472354-b33ff0c44a43?ixlib=rb-4.0.3&auto=format&fit=crop&w=300&h=200";
      case "webinar":
        return "https://images.unsplash.com/photo-1516321318423-f06f85e504b3?ixlib=rb-4.0.3&auto=format&fit=crop&w=300&h=200";
      case "newsletter":
        return "https://images.unsplash.com/photo-1504711434969-e33886168f5c?ixlib=rb-4.0.3&auto=format&fit=crop&w=300&h=200";
      case "virtual-display":
        return "https://images.unsplash.com/photo-1560472355-536de3962603?ixlib=rb-4.0.3&auto=format&fit=crop&w=300&h=200";
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

  const handleCopyVimeoUrl = async () => {
    if (asset.vimeoUrl) {
      try {
        await navigator.clipboard.writeText(asset.vimeoUrl);
        toast({
          title: "Vimeo URL Copied",
          description: "Video URL has been copied to your clipboard",
        });
      } catch (error) {
        toast({
          title: "Copy Failed",
          description: "Please try again",
          variant: "destructive",
        });
      }
    }
  };

  const isVideo = asset.type === "video";

  const getAssetCTA = (type: string) => {
    switch (type) {
      case "flyer":
        return { text: "Download Flyer", icon: Download };
      case "poster":
        return { text: "Download Poster", icon: Download };
      case "banner":
        return { text: "Download Banner", icon: Download };
      case "email":
        return { text: "Download Template", icon: Download };
      case "document":
        return { text: "Download Document", icon: FileText };
      case "presentation":
        return { text: "Download Presentation", icon: Download };
      case "webinar":
        return { text: "Download Webinar", icon: Download };
      case "newsletter":
        return { text: "Download Newsletter", icon: Download };
      case "virtual-display":
        return { text: "Download Display", icon: Download };
      default:
        return { text: "Download", icon: Download };
    }
  };

  return (
    <div className="border border-gray-200 dark:border-border rounded-lg p-4 hover:shadow-md transition-shadow">
      {/* Preview Image with Play Icon for Videos */}
      <div className="relative mb-3">
        <img
          src={getPreviewImage(asset.type)}
          alt={`${asset.name} Preview`}
          className="w-full h-32 object-cover rounded"
        />
        {isVideo && (
          <div className="absolute inset-0 flex items-center justify-center bg-black bg-opacity-30 rounded">
            <div className="bg-white bg-opacity-90 rounded-full p-2 hover:bg-opacity-100 transition-all">
              <Play className="h-6 w-6 text-purple-600 ml-0.5" />
            </div>
          </div>
        )}
      </div>
      
      <div className="flex items-center justify-between mb-2">
        <div className="flex items-center">
          {getAssetIcon(asset.type, asset.fileType)}
          <span className="font-medium text-sm text-gray-900 dark:text-foreground">
            {asset.name}
          </span>
        </div>
        <div className="flex items-center space-x-2">
          <Badge 
            className={`text-xs ${
              asset.language === 'English' 
                ? 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300' 
                : 'bg-orange-100 text-orange-800 dark:bg-orange-900 dark:text-orange-300'
            }`}
          >
            {asset.language === 'English' ? '🇺🇸 EN' : '🇪🇸 ES'}
          </Badge>
          <Badge variant="secondary" className="text-xs bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300">
            v{asset.version}
          </Badge>
        </div>
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
        <div className="flex space-x-2">
          <Button 
            className="flex-1 bg-purple-600 hover:bg-purple-700 text-white"
            size="sm"
            onClick={() => handleDownload('mp4')}
          >
            <Download className="mr-1 h-3 w-3" /> Download
          </Button>
          <Button 
            className="flex-1 bg-blue-600 hover:bg-blue-700 text-white"
            size="sm"
            onClick={handleCopyVimeoUrl}
          >
            <Link className="mr-1 h-3 w-3" /> Vimeo URL
          </Button>
        </div>
      ) : (
        <div className="flex space-x-1">
          {(() => {
            const { text, icon: Icon } = getAssetCTA(asset.type);
            return (
              <Button
                className="flex-1 bg-primary hover:bg-primary-dark text-white"
                size="sm"
                onClick={() => handleDownload(asset.fileType)}
              >
                <Icon className="mr-1 h-3 w-3" />
                {text}
              </Button>
            );
          })()}
          
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
