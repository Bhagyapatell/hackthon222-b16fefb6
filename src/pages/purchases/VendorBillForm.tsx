import { useState, useEffect } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent } from "@/components/ui/card";
import { ArrowLeft } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

const VendorBillForm = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(false);
  const [formData, setFormData] = useState({ bill_number: "", vendor_id: "", due_date: "", notes: "" });
  const [vendors, setVendors] = useState<any[]>([]);

  useEffect(() => { loadVendors(); if (id) loadBill(); }, [id]);

  const loadVendors = async () => {
    const { data } = await supabase.from('contacts').select('id, name').eq('is_archived', false);
    setVendors(data || []);
  };

  const loadBill = async () => {
    if (!id) return;
    const { data, error } = await supabase.from('vendor_bills').select('*').eq('id', id).single();
    if (error) { toast.error("Failed to load bill"); return; }
    setFormData({ bill_number: data.bill_number, vendor_id: data.vendor_id, due_date: data.due_date, notes: data.notes || "" });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    try {
      if (id) {
        const { error } = await supabase.from('vendor_bills').update(formData).eq('id', id);
        if (error) throw error;
        toast.success("Bill updated!");
      } else {
        const { error } = await supabase.from('vendor_bills').insert([formData]);
        if (error) throw error;
        toast.success("Bill created!");
      }
      navigate("/vendor-bills");
    } catch (error: any) { toast.error(error.message); } finally { setIsLoading(false); }
  };

  return (
    <div className="container mx-auto px-4 py-8 max-w-2xl">
      <div className="flex items-center gap-4 mb-6">
        <Link to="/vendor-bills"><Button variant="ghost" size="icon"><ArrowLeft className="h-4 w-4" /></Button></Link>
        <h1 className="text-2xl font-bold">{id ? "Edit Bill" : "New Bill"}</h1>
      </div>
      <Card><CardContent className="pt-6">
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2"><Label>Bill Number *</Label><Input value={formData.bill_number} onChange={(e) => setFormData({ ...formData, bill_number: e.target.value })} required /></div>
          <div className="space-y-2">
            <Label>Vendor *</Label>
            <select className="w-full border rounded-md p-2" value={formData.vendor_id} onChange={(e) => setFormData({ ...formData, vendor_id: e.target.value })} required>
              <option value="">Select vendor</option>
              {vendors.map(v => <option key={v.id} value={v.id}>{v.name}</option>)}
            </select>
          </div>
          <div className="space-y-2"><Label>Due Date *</Label><Input type="date" value={formData.due_date} onChange={(e) => setFormData({ ...formData, due_date: e.target.value })} required /></div>
          <div className="space-y-2"><Label>Notes</Label><Input value={formData.notes} onChange={(e) => setFormData({ ...formData, notes: e.target.value })} /></div>
          <div className="flex gap-4"><Button type="submit" disabled={isLoading}>{isLoading ? "Saving..." : "Save"}</Button><Button type="button" variant="outline" onClick={() => navigate("/vendor-bills")}>Cancel</Button></div>
        </form>
      </CardContent></Card>
    </div>
  );
};

export default VendorBillForm;
