import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";

const Index = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-background">
      <div className="text-center space-y-6">
        <h1 className="text-4xl font-bold text-foreground">BudgetWise ERP</h1>
        <p className="text-muted-foreground max-w-md">
          AI-Driven Budget-Aware ERP System with Auto Analytical Model Generation
        </p>
        <div className="flex gap-4 justify-center">
          <Button onClick={() => navigate("/auth")}>Sign In</Button>
          <Button variant="outline" onClick={() => navigate("/dashboard")}>
            Dashboard
          </Button>
        </div>
      </div>
    </div>
  );
};

export default Index;
