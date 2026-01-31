import { useState, useEffect } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent } from "@/components/ui/card";
import { ArrowLeft } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

const SalesOrderForm = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(false);
  const [formData, setFormData] = useState({ order_number: "", customer_id: "", notes: "" });
  const [customers, setCustomers] = useState<any[]>([]);

  useEffect(() => {
    loadCustomers();
    if (id) loadOrder();
  }, [id]);

  const loadCustomers = async () => {
    const { data } = await supabase.from('contacts').select('id, name').eq('is_archived', false);
    setCustomers(data || []);
  };

  const loadOrder = async () => {
    if (!id) return;
    const { data, error } = await supabase.from('sales_orders').select('*').eq('id', id).single();
    if (error) { toast.error("Failed to load order"); return; }
    setFormData({ order_number: data.order_number, customer_id: data.customer_id, notes: data.notes || "" });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    try {
      if (id) {
        const { error } = await supabase.from('sales_orders').update(formData).eq('id', id);
        if (error) throw error;
        toast.success("Order updated!");
      } else {
        const { error } = await supabase.from('sales_orders').insert([formData]);
        if (error) throw error;
        toast.success("Order created!");
      }
      navigate("/sales-orders");
    } catch (error: any) { toast.error(error.message); } finally { setIsLoading(false); }
  };

  return (
    <div className="container mx-auto px-4 py-8 max-w-2xl">
      <div className="flex items-center gap-4 mb-6">
        <Link to="/sales-orders"><Button variant="ghost" size="icon"><ArrowLeft className="h-4 w-4" /></Button></Link>
        <h1 className="text-2xl font-bold">{id ? "Edit Order" : "New Order"}</h1>
      </div>
      <Card><CardContent className="pt-6">
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2"><Label>Order Number *</Label><Input value={formData.order_number} onChange={(e) => setFormData({ ...formData, order_number: e.target.value })} required /></div>
          <div className="space-y-2">
            <Label>Customer *</Label>
            <select className="w-full border rounded-md p-2" value={formData.customer_id} onChange={(e) => setFormData({ ...formData, customer_id: e.target.value })} required>
              <option value="">Select customer</option>
              {customers.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
            </select>
          </div>
          <div className="space-y-2"><Label>Notes</Label><Input value={formData.notes} onChange={(e) => setFormData({ ...formData, notes: e.target.value })} /></div>
          <div className="flex gap-4"><Button type="submit" disabled={isLoading}>{isLoading ? "Saving..." : "Save"}</Button><Button type="button" variant="outline" onClick={() => navigate("/sales-orders")}>Cancel</Button></div>
        </form>
      </CardContent></Card>
    </div>
  );
};

export default SalesOrderForm;
