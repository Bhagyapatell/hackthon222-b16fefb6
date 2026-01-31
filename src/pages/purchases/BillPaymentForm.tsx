import { useState, useEffect } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent } from "@/components/ui/card";
import { ArrowLeft } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import type { Database } from "@/integrations/supabase/types";

type PaymentMode = Database["public"]["Enums"]["payment_mode"];

const BillPaymentForm = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(false);
  const [formData, setFormData] = useState({ payment_number: "", vendor_bill_id: "", amount: 0, mode: "cash" as PaymentMode, reference: "", notes: "" });
  const [bills, setBills] = useState<any[]>([]);

  useEffect(() => { loadBills(); if (id) loadPayment(); }, [id]);

  const loadBills = async () => {
    const { data } = await supabase.from('vendor_bills').select('id, bill_number').eq('is_archived', false);
    setBills(data || []);
  };

  const loadPayment = async () => {
    if (!id) return;
    const { data, error } = await supabase.from('bill_payments').select('*').eq('id', id).single();
    if (error) { toast.error("Failed to load payment"); return; }
    setFormData({ payment_number: data.payment_number, vendor_bill_id: data.vendor_bill_id, amount: data.amount, mode: data.mode, reference: data.reference || "", notes: data.notes || "" });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    try {
      if (id) {
        const { error } = await supabase.from('bill_payments').update(formData).eq('id', id);
        if (error) throw error;
        toast.success("Payment updated!");
      } else {
        const { error } = await supabase.from('bill_payments').insert([formData]);
        if (error) throw error;
        toast.success("Payment created!");
      }
      navigate("/bill-payments");
    } catch (error: any) { toast.error(error.message); } finally { setIsLoading(false); }
  };

  return (
    <div className="container mx-auto px-4 py-8 max-w-2xl">
      <div className="flex items-center gap-4 mb-6">
        <Link to="/bill-payments"><Button variant="ghost" size="icon"><ArrowLeft className="h-4 w-4" /></Button></Link>
        <h1 className="text-2xl font-bold">{id ? "Edit Payment" : "New Payment"}</h1>
      </div>
      <Card><CardContent className="pt-6">
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2"><Label>Payment Number *</Label><Input value={formData.payment_number} onChange={(e) => setFormData({ ...formData, payment_number: e.target.value })} required /></div>
          <div className="space-y-2">
            <Label>Bill *</Label>
            <select className="w-full border rounded-md p-2" value={formData.vendor_bill_id} onChange={(e) => setFormData({ ...formData, vendor_bill_id: e.target.value })} required>
              <option value="">Select bill</option>
              {bills.map(b => <option key={b.id} value={b.id}>{b.bill_number}</option>)}
            </select>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2"><Label>Amount *</Label><Input type="number" value={formData.amount} onChange={(e) => setFormData({ ...formData, amount: parseFloat(e.target.value) || 0 })} required /></div>
            <div className="space-y-2">
              <Label>Mode *</Label>
              <select className="w-full border rounded-md p-2" value={formData.mode} onChange={(e) => setFormData({ ...formData, mode: e.target.value as PaymentMode })}>
                <option value="cash">Cash</option>
                <option value="bank_transfer">Bank Transfer</option>
                <option value="cheque">Cheque</option>
                <option value="online">Online</option>
              </select>
            </div>
          </div>
          <div className="space-y-2"><Label>Reference</Label><Input value={formData.reference} onChange={(e) => setFormData({ ...formData, reference: e.target.value })} /></div>
          <div className="flex gap-4"><Button type="submit" disabled={isLoading}>{isLoading ? "Saving..." : "Save"}</Button><Button type="button" variant="outline" onClick={() => navigate("/bill-payments")}>Cancel</Button></div>
        </form>
      </CardContent></Card>
    </div>
  );
};

export default BillPaymentForm;
