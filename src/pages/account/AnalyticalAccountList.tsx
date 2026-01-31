import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Plus, ArrowLeft } from "lucide-react";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";

const AnalyticalAccountList = () => {
  const { data: accounts, isLoading } = useQuery({
    queryKey: ['analytical_accounts'],
    queryFn: async () => {
      const { data, error } = await supabase.from('analytical_accounts').select('*').eq('is_archived', false).order('code');
      if (error) throw error;
      return data;
    }
  });

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex justify-between items-center mb-6">
        <div className="flex items-center gap-4">
          <Link to="/dashboard"><Button variant="ghost" size="icon"><ArrowLeft className="h-4 w-4" /></Button></Link>
          <h1 className="text-2xl font-bold">Analytical Accounts</h1>
        </div>
        <Link to="/analytical-accounts/new"><Button><Plus className="h-4 w-4 mr-2" />New Account</Button></Link>
      </div>
      {isLoading ? <div>Loading...</div> : (
        <div className="grid gap-4">
          {accounts?.map((acc) => (
            <Link key={acc.id} to={`/analytical-accounts/${acc.id}`}>
              <Card className="hover:border-primary cursor-pointer">
                <CardHeader><CardTitle className="text-lg">[{acc.code}] {acc.name}</CardTitle></CardHeader>
                {acc.description && <CardContent><p className="text-sm text-muted-foreground">{acc.description}</p></CardContent>}
              </Card>
            </Link>
          ))}
          {accounts?.length === 0 && <p className="text-muted-foreground text-center py-8">No accounts found</p>}
        </div>
      )}
    </div>
  );
};

export default AnalyticalAccountList;
