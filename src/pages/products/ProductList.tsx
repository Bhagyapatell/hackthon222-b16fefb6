import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Plus, ArrowLeft } from "lucide-react";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";

const ProductList = () => {
  const { data: products, isLoading } = useQuery({
    queryKey: ['products'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('products')
        .select('*, product_categories(name)')
        .eq('is_archived', false)
        .order('name');
      if (error) throw error;
      return data;
    }
  });

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex justify-between items-center mb-6">
        <div className="flex items-center gap-4">
          <Link to="/dashboard"><Button variant="ghost" size="icon"><ArrowLeft className="h-4 w-4" /></Button></Link>
          <h1 className="text-2xl font-bold">Products</h1>
        </div>
        <div className="flex gap-2">
          <Link to="/product-categories"><Button variant="outline">Categories</Button></Link>
          <Link to="/products/new"><Button><Plus className="h-4 w-4 mr-2" />New Product</Button></Link>
        </div>
      </div>
      {isLoading ? <div>Loading...</div> : (
        <div className="grid gap-4">
          {products?.map((product) => (
            <Link key={product.id} to={`/products/${product.id}`}>
              <Card className="hover:border-primary cursor-pointer">
                <CardHeader>
                  <CardTitle className="text-lg">{product.name}</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-muted-foreground">Sales: ₹{product.sales_price} | Purchase: ₹{product.purchase_price}</p>
                  {product.product_categories && <p className="text-sm text-muted-foreground">Category: {product.product_categories.name}</p>}
                </CardContent>
              </Card>
            </Link>
          ))}
          {products?.length === 0 && <p className="text-muted-foreground text-center py-8">No products found</p>}
        </div>
      )}
    </div>
  );
};

export default ProductList;
