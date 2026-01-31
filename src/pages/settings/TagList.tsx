import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardHeader, CardTitle } from "@/components/ui/card";
import { Plus, ArrowLeft } from "lucide-react";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";

const TagList = () => {
  const { data: tags, isLoading } = useQuery({
    queryKey: ['tags'],
    queryFn: async () => {
      const { data, error } = await supabase.from('tags').select('*').order('name');
      if (error) throw error;
      return data;
    }
  });

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex justify-between items-center mb-6">
        <div className="flex items-center gap-4">
          <Link to="/dashboard"><Button variant="ghost" size="icon"><ArrowLeft className="h-4 w-4" /></Button></Link>
          <h1 className="text-2xl font-bold">Tags</h1>
        </div>
        <Link to="/tags/new"><Button><Plus className="h-4 w-4 mr-2" />New Tag</Button></Link>
      </div>
      {isLoading ? <div>Loading...</div> : (
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {tags?.map((tag) => (
            <Link key={tag.id} to={`/tags/${tag.id}`}>
              <Card className="hover:border-primary cursor-pointer">
                <CardHeader className="flex flex-row items-center gap-3">
                  <div className="w-4 h-4 rounded-full" style={{ backgroundColor: tag.color }} />
                  <CardTitle className="text-lg">{tag.name}</CardTitle>
                </CardHeader>
              </Card>
            </Link>
          ))}
          {tags?.length === 0 && <p className="text-muted-foreground text-center py-8 col-span-full">No tags found</p>}
        </div>
      )}
    </div>
  );
};

export default TagList;
