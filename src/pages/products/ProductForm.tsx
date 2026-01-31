import { useState, useEffect } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent } from "@/components/ui/card";
import { ArrowLeft } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

const ProductForm = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(false);
  const [formData, setFormData] = useState({ name: "", sales_price: 0, purchase_price: 0, category_id: "" });

  useEffect(() => { if (id) loadProduct(); }, [id]);

  const loadProduct = async () => {
    if (!id) return;
    const { data, error } = await supabase.from('products').select('*').eq('id', id).single();
    if (error) { toast.error("Failed to load product"); return; }
    setFormData({ name: data.name, sales_price: data.sales_price, purchase_price: data.purchase_price, category_id: data.category_id || "" });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    try {
      const payload = { ...formData, category_id: formData.category_id || null };
      if (id) {
        const { error } = await supabase.from('products').update(payload).eq('id', id);
        if (error) throw error;
        toast.success("Product updated!");
      } else {
        const { error } = await supabase.from('products').insert([payload]);
        if (error) throw error;
        toast.success("Product created!");
      }
      navigate("/products");
    } catch (error: any) { toast.error(error.message); } finally { setIsLoading(false); }
  };

  return (
    <div className="container mx-auto px-4 py-8 max-w-2xl">
      <div className="flex items-center gap-4 mb-6">
        <Link to="/products"><Button variant="ghost" size="icon"><ArrowLeft className="h-4 w-4" /></Button></Link>
        <h1 className="text-2xl font-bold">{id ? "Edit Product" : "New Product"}</h1>
      </div>
      <Card><CardContent className="pt-6">
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2"><Label htmlFor="name">Name *</Label><Input id="name" value={formData.name} onChange={(e) => setFormData({ ...formData, name: e.target.value })} required /></div>
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2"><Label htmlFor="sales_price">Sales Price</Label><Input id="sales_price" type="number" value={formData.sales_price} onChange={(e) => setFormData({ ...formData, sales_price: parseFloat(e.target.value) || 0 })} /></div>
            <div className="space-y-2"><Label htmlFor="purchase_price">Purchase Price</Label><Input id="purchase_price" type="number" value={formData.purchase_price} onChange={(e) => setFormData({ ...formData, purchase_price: parseFloat(e.target.value) || 0 })} /></div>
          </div>
          <div className="flex gap-4"><Button type="submit" disabled={isLoading}>{isLoading ? "Saving..." : "Save"}</Button><Button type="button" variant="outline" onClick={() => navigate("/products")}>Cancel</Button></div>
        </form>
      </CardContent></Card>
    </div>
  );
};

export default ProductForm;
