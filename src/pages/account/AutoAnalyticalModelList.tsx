import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Plus, ArrowLeft, Sparkles } from "lucide-react";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";

const AutoAnalyticalModelList = () => {
  const { data: models, isLoading } = useQuery({
    queryKey: ['auto_analytical_models'],
    queryFn: async () => {
      const { data, error } = await supabase.from('auto_analytical_models')
        .select('*, analytical_accounts(name, code), contacts(name), tags(name), products(name), budgets(name)')
        .eq('is_archived', false)
        .order('priority', { ascending: false });
      if (error) throw error;
      return data;
    }
  });

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex justify-between items-center mb-6">
        <div className="flex items-center gap-4">
          <Link to="/dashboard"><Button variant="ghost" size="icon"><ArrowLeft className="h-4 w-4" /></Button></Link>
          <h1 className="text-2xl font-bold">Auto Analytical Models</h1>
        </div>
        <Link to="/auto-analytical-models/new"><Button><Plus className="h-4 w-4 mr-2" />New Model</Button></Link>
      </div>
      <p className="text-muted-foreground mb-6">AI-driven rules that automatically assign analytical accounts to transactions based on budget context.</p>
      {isLoading ? <div>Loading...</div> : (
        <div className="grid gap-4">
          {models?.map((model) => (
            <Link key={model.id} to={`/auto-analytical-models/${model.id}`}>
              <Card className="hover:border-primary cursor-pointer">
                <CardHeader className="flex flex-row items-center gap-2">
                  <Sparkles className="h-5 w-5 text-primary" />
                  <CardTitle className="text-lg">{model.name}</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-muted-foreground">Analytics: [{model.analytical_accounts?.code}] {model.analytical_accounts?.name}</p>
                  <div className="flex flex-wrap gap-2 mt-2">
                    {model.budgets && <span className="text-xs bg-primary/10 text-primary px-2 py-1 rounded">Budget: {model.budgets.name}</span>}
                    {model.contacts && <span className="text-xs bg-secondary px-2 py-1 rounded">Partner: {model.contacts.name}</span>}
                    {model.tags && <span className="text-xs bg-secondary px-2 py-1 rounded">Tag: {model.tags.name}</span>}
                    {model.products && <span className="text-xs bg-secondary px-2 py-1 rounded">Product: {model.products.name}</span>}
                  </div>
                  <p className="text-xs text-muted-foreground mt-2">Priority: {model.priority}</p>
                </CardContent>
              </Card>
            </Link>
          ))}
          {models?.length === 0 && <p className="text-muted-foreground text-center py-8">No models found. Create your first AI-driven analytical model!</p>}
        </div>
      )}
    </div>
  );
};

export default AutoAnalyticalModelList;
