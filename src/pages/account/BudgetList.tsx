import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Plus, ArrowLeft } from "lucide-react";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { format } from "date-fns";

const BudgetList = () => {
  const { data: budgets, isLoading } = useQuery({
    queryKey: ['budgets'],
    queryFn: async () => {
      const { data, error } = await supabase.from('budgets').select('*, analytical_accounts(name)').eq('is_archived', false).order('name');
      if (error) throw error;
      return data;
    }
  });

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex justify-between items-center mb-6">
        <div className="flex items-center gap-4">
          <Link to="/dashboard"><Button variant="ghost" size="icon"><ArrowLeft className="h-4 w-4" /></Button></Link>
          <h1 className="text-2xl font-bold">Budgets</h1>
        </div>
        <Link to="/budgets/new"><Button><Plus className="h-4 w-4 mr-2" />New Budget</Button></Link>
      </div>
      {isLoading ? <div>Loading...</div> : (
        <div className="grid gap-4">
          {budgets?.map((budget) => (
            <Link key={budget.id} to={`/budgets/${budget.id}`}>
              <Card className="hover:border-primary cursor-pointer">
                <CardHeader><CardTitle className="text-lg">{budget.name}</CardTitle></CardHeader>
                <CardContent>
                  <p className="text-sm text-muted-foreground">Type: {budget.type} | State: {budget.state}</p>
                  <p className="text-sm text-muted-foreground">Amount: ₹{budget.budgeted_amount}</p>
                  <p className="text-sm text-muted-foreground">Period: {format(new Date(budget.start_date), 'dd/MM/yyyy')} - {format(new Date(budget.end_date), 'dd/MM/yyyy')}</p>
                  <p className="text-sm text-muted-foreground">Analytics: {budget.analytical_accounts?.name}</p>
                </CardContent>
              </Card>
            </Link>
          ))}
          {budgets?.length === 0 && <p className="text-muted-foreground text-center py-8">No budgets found</p>}
        </div>
      )}
    </div>
  );
};

export default BudgetList;
