import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent } from "@/components/ui/card";
import { clientApi } from "@/lib/api";
import ClientDashboard from "./client-dashboard";
import { KeyIcon } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

export default function ClientAccess() {
  const [accessCode, setAccessCode] = useState("");
  const [authenticatedClient, setAuthenticatedClient] = useState<any>(null);
  const { toast } = useToast();

  const handleAccess = async () => {
    if (!accessCode.trim()) {
      toast({
        title: "Error",
        description: "Please enter an access code",
        variant: "destructive",
      });
      return;
    }

    try {
      const client = await clientApi.access(accessCode);
      setAuthenticatedClient(client);
      toast({
        title: "Access Granted",
        description: `Welcome to ${client.name} toolkit`,
      });
    } catch (error) {
      toast({
        title: "Access Denied",
        description: "Invalid access code or client account not active",
        variant: "destructive",
      });
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") {
      handleAccess();
    }
  };

  if (authenticatedClient) {
    return <ClientDashboard client={authenticatedClient} />;
  }

  return (
    <div className="space-y-8">
      <Card className="max-w-md mx-auto">
        <CardContent className="pt-8 pb-8 text-center">
          <div className="w-16 h-16 bg-primary-dark rounded-full flex items-center justify-center mx-auto mb-4">
            <KeyIcon className="text-white text-xl h-6 w-6" />
          </div>
          <h2 className="text-2xl font-semibold text-gray-900 dark:text-foreground mb-2">
            Access Your Toolkit
          </h2>
          <p className="text-gray-600 dark:text-muted-foreground mb-6">
            Enter your unique client code to access your branded communications materials
          </p>

          <div className="space-y-4">
            <Input
              type="text"
              placeholder="Enter your access code"
              value={accessCode}
              onChange={(e) => setAccessCode(e.target.value)}
              onKeyPress={handleKeyPress}
              className="text-center text-lg font-mono tracking-wider"
            />
            <Button
              onClick={handleAccess}
              className="w-full bg-primary hover:bg-primary-dark text-white"
              size="lg"
            >
              Access Toolkit
            </Button>
          </div>

          <p className="text-sm text-gray-500 dark:text-muted-foreground mt-4">
            Don't have a code? Contact your SimpleTherapy representative.
          </p>
        </CardContent>
      </Card>
    </div>
  );
}
