import { useState, useRef } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { CloudUpload, X } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

interface UploadZoneProps {
  onUpload: (file: File) => void;
}

export default function UploadZone({ onUpload }: UploadZoneProps) {
  const [isDragOver, setIsDragOver] = useState(false);
  const [uploadedFiles, setUploadedFiles] = useState<File[]>([]);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const { toast } = useToast();

  const allowedTypes = [
    "application/pdf",
    "application/vnd.openxmlformats-officedocument.presentationml.presentation",
    "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
    "image/png",
    "image/jpeg",
  ];

  const maxFileSize = 10 * 1024 * 1024; // 10MB

  const validateFile = (file: File): boolean => {
    if (!allowedTypes.includes(file.type)) {
      toast({
        title: "Invalid File Type",
        description: "Please upload PDF, PPT, DOCX, PNG, or JPG files only",
        variant: "destructive",
      });
      return false;
    }

    if (file.size > maxFileSize) {
      toast({
        title: "File Too Large",
        description: "File size must be less than 10MB",
        variant: "destructive",
      });
      return false;
    }

    return true;
  };

  const handleFiles = (files: FileList | null) => {
    if (!files) return;

    const validFiles: File[] = [];
    
    for (let i = 0; i < files.length; i++) {
      const file = files[i];
      if (validateFile(file)) {
        validFiles.push(file);
      }
    }

    if (validFiles.length > 0) {
      setUploadedFiles(prev => [...prev, ...validFiles]);
      validFiles.forEach(file => onUpload(file));
      toast({
        title: "Files Uploaded",
        description: `Successfully uploaded ${validFiles.length} file(s)`,
      });
    }
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(true);
  };

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(false);
    handleFiles(e.dataTransfer.files);
  };

  const handleFileInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    handleFiles(e.target.files);
  };

  const removeFile = (index: number) => {
    setUploadedFiles(prev => prev.filter((_, i) => i !== index));
  };

  const getFileTypeIcon = (file: File) => {
    if (file.type.includes("pdf")) return "📄";
    if (file.type.includes("presentation")) return "📊";
    if (file.type.includes("document")) return "📝";
    if (file.type.includes("image")) return "🖼️";
    return "📎";
  };

  const formatFileSize = (bytes: number) => {
    if (bytes === 0) return "0 Bytes";
    const k = 1024;
    const sizes = ["Bytes", "KB", "MB", "GB"];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + " " + sizes[i];
  };

  return (
    <div className="space-y-4">
      <Card
        className={`border-2 border-dashed transition-colors cursor-pointer ${
          isDragOver
            ? "border-primary bg-primary/5"
            : "border-gray-300 dark:border-border hover:border-primary"
        }`}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
        onClick={() => fileInputRef.current?.click()}
      >
        <CardContent className="p-8 text-center">
          <CloudUpload className="mx-auto h-12 w-12 text-gray-400 dark:text-muted-foreground mb-4" />
          <h4 className="text-lg font-medium text-gray-900 dark:text-foreground mb-2">
            Upload New Template Assets
          </h4>
          <p className="text-gray-600 dark:text-muted-foreground mb-4">
            Drag and drop files here, or click to browse
          </p>
          <Button className="bg-primary hover:bg-primary-dark text-white">
            Choose Files
          </Button>
          <p className="text-sm text-gray-500 dark:text-muted-foreground mt-2">
            Supports: PDF, PPT, DOCX, PNG, JPG (Max: 10MB per file)
          </p>
        </CardContent>
      </Card>

      <input
        ref={fileInputRef}
        type="file"
        multiple
        accept=".pdf,.ppt,.pptx,.doc,.docx,.png,.jpg,.jpeg"
        onChange={handleFileInput}
        className="hidden"
      />

      {uploadedFiles.length > 0 && (
        <Card>
          <CardContent className="p-4">
            <h4 className="font-medium mb-3">Uploaded Files</h4>
            <div className="space-y-2">
              {uploadedFiles.map((file, index) => (
                <div
                  key={index}
                  className="flex items-center justify-between p-2 bg-gray-50 dark:bg-muted rounded"
                >
                  <div className="flex items-center space-x-3">
                    <span className="text-lg">{getFileTypeIcon(file)}</span>
                    <div>
                      <p className="text-sm font-medium">{file.name}</p>
                      <p className="text-xs text-gray-500 dark:text-muted-foreground">
                        {formatFileSize(file.size)}
                      </p>
                    </div>
                  </div>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => removeFile(index)}
                  >
                    <X className="h-4 w-4" />
                  </Button>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
