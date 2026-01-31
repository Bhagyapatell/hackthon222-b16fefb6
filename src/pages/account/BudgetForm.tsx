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

type BudgetType = Database["public"]["Enums"]["budget_type"];

const BudgetForm = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(false);
  const [formData, setFormData] = useState({ name: "", budgeted_amount: 0, start_date: "", end_date: "", type: "expense" as BudgetType, analytical_account_id: "" });
  const [accounts, setAccounts] = useState<any[]>([]);

  useEffect(() => { loadAccounts(); if (id) loadBudget(); }, [id]);

  const loadAccounts = async () => {
    const { data } = await supabase.from('analytical_accounts').select('id, name, code').eq('is_archived', false).order('code');
    setAccounts(data || []);
  };

  const loadBudget = async () => {
    if (!id) return;
    const { data, error } = await supabase.from('budgets').select('*').eq('id', id).single();
    if (error) { toast.error("Failed to load budget"); return; }
    setFormData({ name: data.name, budgeted_amount: data.budgeted_amount, start_date: data.start_date, end_date: data.end_date, type: data.type, analytical_account_id: data.analytical_account_id });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    try {
      if (id) {
        const { error } = await supabase.from('budgets').update(formData).eq('id', id);
        if (error) throw error;
        toast.success("Budget updated!");
      } else {
        const { error } = await supabase.from('budgets').insert([formData]);
        if (error) throw error;
        toast.success("Budget created!");
      }
      navigate("/budgets");
    } catch (error: any) { toast.error(error.message); } finally { setIsLoading(false); }
  };

  return (
    <div className="container mx-auto px-4 py-8 max-w-2xl">
      <div className="flex items-center gap-4 mb-6">
        <Link to="/budgets"><Button variant="ghost" size="icon"><ArrowLeft className="h-4 w-4" /></Button></Link>
        <h1 className="text-2xl font-bold">{id ? "Edit Budget" : "New Budget"}</h1>
      </div>
      <Card><CardContent className="pt-6">
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2"><Label>Name *</Label><Input value={formData.name} onChange={(e) => setFormData({ ...formData, name: e.target.value })} required /></div>
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2"><Label>Budgeted Amount *</Label><Input type="number" value={formData.budgeted_amount} onChange={(e) => setFormData({ ...formData, budgeted_amount: parseFloat(e.target.value) || 0 })} required /></div>
            <div className="space-y-2">
              <Label>Type *</Label>
              <select className="w-full border rounded-md p-2" value={formData.type} onChange={(e) => setFormData({ ...formData, type: e.target.value as BudgetType })}>
                <option value="expense">Expense</option>
                <option value="income">Income</option>
              </select>
            </div>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2"><Label>Start Date *</Label><Input type="date" value={formData.start_date} onChange={(e) => setFormData({ ...formData, start_date: e.target.value })} required /></div>
            <div className="space-y-2"><Label>End Date *</Label><Input type="date" value={formData.end_date} onChange={(e) => setFormData({ ...formData, end_date: e.target.value })} required /></div>
          </div>
          <div className="space-y-2">
            <Label>Analytical Account *</Label>
            <select className="w-full border rounded-md p-2" value={formData.analytical_account_id} onChange={(e) => setFormData({ ...formData, analytical_account_id: e.target.value })} required>
              <option value="">Select account</option>
              {accounts.map(a => <option key={a.id} value={a.id}>[{a.code}] {a.name}</option>)}
            </select>
          </div>
          <div className="flex gap-4"><Button type="submit" disabled={isLoading}>{isLoading ? "Saving..." : "Save"}</Button><Button type="button" variant="outline" onClick={() => navigate("/budgets")}>Cancel</Button></div>
        </form>
      </CardContent></Card>
    </div>
  );
};

export default BudgetForm;
