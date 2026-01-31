import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ArrowLeft } from "lucide-react";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";

const PortalUserList = () => {
  const { data: users, isLoading } = useQuery({
    queryKey: ['profiles'],
    queryFn: async () => {
      const { data, error } = await supabase.from('profiles').select('*').order('name');
      if (error) throw error;
      return data;
    }
  });

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex justify-between items-center mb-6">
        <div className="flex items-center gap-4">
          <Link to="/dashboard"><Button variant="ghost" size="icon"><ArrowLeft className="h-4 w-4" /></Button></Link>
          <h1 className="text-2xl font-bold">Portal Users</h1>
        </div>
      </div>
      <p className="text-muted-foreground mb-6">Users are created when they sign up. Portal users can only view their own data.</p>
      {isLoading ? <div>Loading...</div> : (
        <div className="grid gap-4">
          {users?.map((user) => (
            <Card key={user.id}>
              <CardHeader><CardTitle className="text-lg">{user.name}</CardTitle></CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground">Email: {user.email}</p>
                <p className="text-sm text-muted-foreground">Role: <span className={`px-2 py-1 rounded text-xs ${user.role === 'admin' ? 'bg-primary text-primary-foreground' : 'bg-secondary'}`}>{user.role}</span></p>
              </CardContent>
            </Card>
          ))}
          {users?.length === 0 && <p className="text-muted-foreground text-center py-8">No users found</p>}
        </div>
      )}
    </div>
  );
};

export default PortalUserList;
