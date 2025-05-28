import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";

interface ProgramSelectorProps {
  client: any;
  onProgramSelect: (program: string) => void;
  selectedProgram: string | null;
}

export default function ProgramSelector({ client, onProgramSelect, selectedProgram }: ProgramSelectorProps) {
  // For now, let's add multiple programs to test the selection
  const programTypes = client.programTypes || ["SimpleMSK", "SimpleEAP"];

  const getProgramLogo = (program: string) => {
    switch (program) {
      case "SimpleMSK":
        return "🦴"; // Bone/MSK icon
      case "SimpleEAP":
        return "🧠"; // Brain/mental health icon
      case "SimpleBehavioural":
        return "💭"; // Thought bubble icon
      case "SimpleWellbeing":
        return "🌿"; // Wellness icon
      default:
        return "📋";
    }
  };

  const getProgramColor = (program: string) => {
    switch (program) {
      case "SimpleMSK":
        return "bg-blue-600 hover:bg-blue-700";
      case "SimpleEAP":
        return "bg-purple-600 hover:bg-purple-700";
      case "SimpleBehavioural":
        return "bg-green-600 hover:bg-green-700";
      case "SimpleWellbeing":
        return "bg-orange-600 hover:bg-orange-700";
      default:
        return "bg-gray-600 hover:bg-gray-700";
    }
  };

  // Always show program selection for multiple programs
  // Auto-select if only one program available
  if (programTypes.length === 1 && !selectedProgram) {
    setTimeout(() => onProgramSelect(programTypes[0]), 0);
    return null;
  }

  return (
    <Card className="mb-6">
      <CardContent className="p-6">
        <h3 className="text-xl font-semibold text-gray-900 dark:text-foreground mb-4">
          Select Your Program
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {programTypes.map((program) => (
            <Button
              key={program}
              onClick={() => onProgramSelect(program)}
              className={`h-24 flex flex-col items-center justify-center text-white ${
                selectedProgram === program 
                  ? getProgramColor(program) + " ring-2 ring-offset-2 ring-primary" 
                  : getProgramColor(program)
              }`}
            >
              <span className="text-2xl mb-2">{getProgramLogo(program)}</span>
              <span className="text-sm font-medium">{program}</span>
            </Button>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}