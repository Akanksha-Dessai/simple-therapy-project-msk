import { useState } from "react";
import { Button } from "@/components/ui/button";
import ClientAccess from "@/components/client-access";
import AdminPanel from "@/components/admin-panel";

export default function Home() {
  const [currentView, setCurrentView] = useState<"client" | "admin">("client");

  return (
    <div className="min-h-screen bg-neutral-light dark:bg-background">
      {/* Header */}
      <header className="bg-white dark:bg-card shadow-sm border-b border-gray-200 dark:border-border">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center space-x-4">
              <div className="flex items-center">
                <div className="w-10 h-10 bg-primary rounded-lg flex items-center justify-center">
                  <span className="text-white font-bold text-lg">ST</span>
                </div>
                <span className="ml-2 text-xl font-semibold text-gray-900 dark:text-foreground">
                  SimpleTherapy Care Marketing Toolkit
                </span>
              </div>
            </div>

          </div>
        </div>
      </header>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* View Toggle */}
        <div className="mb-8">
          <div className="bg-white dark:bg-card rounded-lg shadow-sm p-1 inline-flex">
            <Button
              variant={currentView === "client" ? "default" : "ghost"}
              size="sm"
              onClick={() => setCurrentView("client")}
              className={`${
                currentView === "client"
                  ? "bg-primary text-white"
                  : "text-gray-500 hover:text-gray-700 dark:text-muted-foreground dark:hover:text-foreground"
              }`}
            >
              Client Access
            </Button>
            <Button
              variant={currentView === "admin" ? "default" : "ghost"}
              size="sm"
              onClick={() => setCurrentView("admin")}
              className={`${
                currentView === "admin"
                  ? "bg-primary text-white"
                  : "text-gray-500 hover:text-gray-700 dark:text-muted-foreground dark:hover:text-foreground"
              }`}
            >
              Admin Panel
            </Button>
          </div>
        </div>

        {/* Content Views */}
        {currentView === "client" ? <ClientAccess /> : <AdminPanel />}
      </div>

      {/* Footer */}
      <footer className="bg-white dark:bg-card border-t border-gray-200 dark:border-border mt-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <img 
                src="https://www.simpletherapy.com/images/logo/SimpleTherapy.svg" 
                alt="SimpleTherapy Logo" 
                className="h-8 w-auto"
              />
              <span className="text-sm text-gray-600 dark:text-muted-foreground">
                SimpleTherapy Care Marketing Toolkit Platform
              </span>
            </div>
            <div className="text-sm text-gray-500 dark:text-muted-foreground flex flex-col items-end">
              <div>© 2025 SimpleTherapy. All rights reserved.</div>
              <div className="mt-1">
                Account Support: <a href="mailto:account.support@simpletherapy.com" className="text-primary hover:underline">account.support@simpletherapy.com</a>
              </div>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
