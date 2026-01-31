import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardHeader, CardTitle } from "@/components/ui/card";
import { Plus, ArrowLeft } from "lucide-react";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";

const ProductCategoryList = () => {
  const { data: categories, isLoading } = useQuery({
    queryKey: ['product_categories'],
    queryFn: async () => {
      const { data, error } = await supabase.from('product_categories').select('*').eq('is_archived', false).order('name');
      if (error) throw error;
      return data;
    }
  });

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex justify-between items-center mb-6">
        <div className="flex items-center gap-4">
          <Link to="/products"><Button variant="ghost" size="icon"><ArrowLeft className="h-4 w-4" /></Button></Link>
          <h1 className="text-2xl font-bold">Product Categories</h1>
        </div>
        <Link to="/product-categories/new"><Button><Plus className="h-4 w-4 mr-2" />New Category</Button></Link>
      </div>
      {isLoading ? <div>Loading...</div> : (
        <div className="grid gap-4">
          {categories?.map((cat) => (
            <Link key={cat.id} to={`/product-categories/${cat.id}`}>
              <Card className="hover:border-primary cursor-pointer"><CardHeader><CardTitle className="text-lg">{cat.name}</CardTitle></CardHeader></Card>
            </Link>
          ))}
          {categories?.length === 0 && <p className="text-muted-foreground text-center py-8">No categories found</p>}
        </div>
      )}
    </div>
  );
};

export default ProductCategoryList;
