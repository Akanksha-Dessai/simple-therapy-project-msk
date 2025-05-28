import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Globe } from "lucide-react";

interface SimpleEAPCardProps {
  client: any;
}

export default function SimpleEAPCard({ client }: SimpleEAPCardProps) {
  return (
    <Card className="bg-gradient-to-r from-blue-50 to-indigo-50 dark:from-blue-950 dark:to-indigo-950 border-blue-200 dark:border-blue-800">
      <CardContent className="p-8">
        <div className="text-center space-y-6">
          <div className="flex justify-center">
            <img 
              src="https://www.simpletherapy.com/images/site/SimpleEAP/st-logo_brands.svg" 
              alt="SimpleEAP Logo" 
              className="h-16 w-auto"
            />
          </div>
          <div className="space-y-4">
            <h3 className="text-2xl font-bold text-gray-900 dark:text-foreground">
              SimpleEAP Communications Toolkit
            </h3>
            <p className="text-lg text-gray-700 dark:text-muted-foreground max-w-2xl mx-auto">
              Access all your branded SimpleEAP marketing materials and communication assets through our dedicated portal.
            </p>
            <p className="text-gray-600 dark:text-muted-foreground">
              Your customized materials are ready and waiting for you with your specific branding and messaging.
            </p>
          </div>
          <div className="pt-4">
            <Button 
              size="lg" 
              className="bg-blue-600 hover:bg-blue-700 text-white px-8 py-3 text-lg"
              onClick={() => {
                const groupCode = client.cualincCode || 'CUA-ACME-001';
                const url = `https://mysupportportal.com/communications-toolkit?group_code=${groupCode}`;
                window.open(url, '_blank');
              }}
            >
              <Globe className="mr-2 h-5 w-5" />
              Access SimpleEAP Toolkit
            </Button>
          </div>
          <p className="text-sm text-gray-500 dark:text-muted-foreground">
            You'll be redirected to the SimpleEAP communications portal where all your branded materials are hosted.
          </p>
        </div>
      </CardContent>
    </Card>
  );
}