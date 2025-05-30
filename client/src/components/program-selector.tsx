import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";

interface ProgramSelectorProps {
  client: any;
  onProgramSelect: (program: string) => void;
  selectedProgram: string | null;
}

export default function ProgramSelector({ client, onProgramSelect, selectedProgram }: ProgramSelectorProps) {
  // For now, let's add multiple programs to test the selection
  const activePrograms = client.activePrograms || ["SimpleMSK", "SimpleEAP"];
  const getProgramLogo = (program: string) => {
    switch (program) {
      case "SimpleMSK":
        return (
          <img 
            src="https://www.simpletherapy.com/images/site/SimpleMSK/logo_brands.svg" 
            alt="SimpleMSK Logo" 
            className="h-8 w-auto"
          />
        );
      case "SimpleEAP":
        return (
          <img 
            src="https://www.simpletherapy.com/images/site/SimpleEAP/st-logo_brands.svg" 
            alt="SimpleEAP Logo" 
            className="h-8 w-auto"
          />
        );
      case "SimpleBehavioural":
        return (
          <img 
            src="https://www.simpletherapy.com/images/site/SimpleBehavioral/brandMain.svg" 
            alt="SimpleBehavioural Logo" 
            className="h-8 w-auto"
          />
        );
      case "SimpleWellbeing":
        return (
          <img 
            src="https://www.simpletherapy.com/images/site/SimpleWellbeing/st-logo_brands.svg" 
            alt="SimpleWellbeing Logo" 
            className="h-8 w-auto"
          />
        );
      default:
        return "📋";
    }
  };

  const getButtonStyle = (program: string, isSelected: boolean) => {
    const baseStyle = "bg-white dark:bg-card border-2 hover:bg-gray-50 dark:hover:bg-gray-800 transition-all duration-200";
    const selectedStyle = isSelected 
      ? "border-primary shadow-lg shadow-primary/25 scale-105" 
      : "border-gray-200 dark:border-gray-700 hover:border-gray-300 dark:hover:border-gray-600 hover:shadow-md";
    return `${baseStyle} ${selectedStyle}`;
  };

  // Always show program selection for multiple programs
  // Auto-select if only one program available
  if (activePrograms.length === 1 && !selectedProgram) {
    setTimeout(() => onProgramSelect(activePrograms[0]), 0);
    return null;
  }

  return (
    <Card className="mb-6">
      <CardContent className="p-6">
        <h3 className="text-xl font-semibold text-gray-900 dark:text-foreground mb-4">
          Select Your Program
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {activePrograms.map((program) => (
            <Button
              key={program}
              onClick={() => onProgramSelect(program)}
              className={`h-24 flex flex-col items-center justify-center ${getButtonStyle(program, selectedProgram === program)}`}
            >
              <span className="text-2xl mb-2">{getProgramLogo(program)}</span>
            </Button>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}