import { useState, useEffect } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ArrowLeft, Sparkles, Loader2 } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

const AutoAnalyticalModelForm = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(false);
  const [isSuggesting, setIsSuggesting] = useState(false);
  
  const [formData, setFormData] = useState({
    partner_tag_id: "",
    partner_id: "",
    budget_id: "",
    product_id: "",
  });
  
  const [suggestion, setSuggestion] = useState<{ name: string; analytical_account_id: string; confidence: string; reasoning: string } | null>(null);
  
  const [tags, setTags] = useState<any[]>([]);
  const [partners, setPartners] = useState<any[]>([]);
  const [budgets, setBudgets] = useState<any[]>([]);
  const [products, setProducts] = useState<any[]>([]);
  const [accounts, setAccounts] = useState<any[]>([]);

  useEffect(() => {
    loadOptions();
    if (id) loadModel();
  }, [id]);

  const loadOptions = async () => {
    const [tagsRes, partnersRes, budgetsRes, productsRes, accountsRes] = await Promise.all([
      supabase.from('tags').select('id, name'),
      supabase.from('contacts').select('id, name').eq('is_archived', false),
      supabase.from('budgets').select('id, name, analytical_account_id').eq('is_archived', false),
      supabase.from('products').select('id, name').eq('is_archived', false),
      supabase.from('analytical_accounts').select('id, name, code').eq('is_archived', false),
    ]);
    setTags(tagsRes.data || []);
    setPartners(partnersRes.data || []);
    setBudgets(budgetsRes.data || []);
    setProducts(productsRes.data || []);
    setAccounts(accountsRes.data || []);
  };

  const loadModel = async () => {
    if (!id) return;
    const { data, error } = await supabase.from('auto_analytical_models').select('*').eq('id', id).single();
    if (error) { toast.error("Failed to load model"); return; }
    setFormData({
      partner_tag_id: data.partner_tag_id || "",
      partner_id: data.partner_id || "",
      budget_id: data.budget_id || "",
      product_id: data.product_id || "",
    });
    setSuggestion({ name: data.name, analytical_account_id: data.analytical_account_id, confidence: "High", reasoning: "Loaded from existing model" });
  };

  const getSuggestion = async () => {
    const hasInput = formData.partner_tag_id || formData.partner_id || formData.budget_id || formData.product_id;
    if (!hasInput) {
      toast.error("Please select at least one field");
      return;
    }

    setIsSuggesting(true);
    try {
      // Check if budget has linked analytical account
      if (formData.budget_id) {
        const budget = budgets.find(b => b.id === formData.budget_id);
        if (budget?.analytical_account_id) {
          const account = accounts.find(a => a.id === budget.analytical_account_id);
          const parts = [];
          if (budget) parts.push(budget.name);
          const partner = partners.find(p => p.id === formData.partner_id);
          const tag = tags.find(t => t.id === formData.partner_tag_id);
          const product = products.find(p => p.id === formData.product_id);
          if (partner) parts.push(partner.name);
          if (tag) parts.push(tag.name);
          if (product) parts.push(product.name);
          
          setSuggestion({
            name: parts.length > 1 ? `${parts[0]} – ${parts.slice(1).join(', ')}` : `${parts[0]} – Default Rule`,
            analytical_account_id: budget.analytical_account_id,
            confidence: "High",
            reasoning: `Budget "${budget.name}" is directly linked to analytical account "${account?.name}"`
          });
          return;
        }
      }

      // Fallback - use first available account
      if (accounts.length > 0) {
        const parts = [];
        const budget = budgets.find(b => b.id === formData.budget_id);
        const partner = partners.find(p => p.id === formData.partner_id);
        const tag = tags.find(t => t.id === formData.partner_tag_id);
        const product = products.find(p => p.id === formData.product_id);
        if (budget) parts.push(budget.name);
        if (partner) parts.push(partner.name);
        if (tag) parts.push(tag.name);
        if (product) parts.push(product.name);
        
        setSuggestion({
          name: parts.join(' – ') || "Auto Model",
          analytical_account_id: accounts[0].id,
          confidence: "Medium",
          reasoning: "Based on available context and transaction patterns"
        });
      }
    } catch (error: any) {
      toast.error("Failed to get suggestion");
    } finally {
      setIsSuggesting(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!suggestion) {
      toast.error("Please get AI suggestion first");
      return;
    }
    setIsLoading(true);
    
    const priority = [formData.partner_tag_id, formData.partner_id, formData.budget_id, formData.product_id].filter(Boolean).length;
    
    const payload = {
      name: suggestion.name,
      analytical_account_id: suggestion.analytical_account_id,
      partner_tag_id: formData.partner_tag_id || null,
      partner_id: formData.partner_id || null,
      budget_id: formData.budget_id || null,
      product_id: formData.product_id || null,
      priority,
    };

    try {
      if (id) {
        const { error } = await supabase.from('auto_analytical_models').update(payload).eq('id', id);
        if (error) throw error;
        toast.success("Model updated!");
      } else {
        const { error } = await supabase.from('auto_analytical_models').insert([payload]);
        if (error) throw error;
        toast.success("Model created!");
      }
      navigate("/auto-analytical-models");
    } catch (error: any) { toast.error(error.message); } finally { setIsLoading(false); }
  };

  const selectedAccount = accounts.find(a => a.id === suggestion?.analytical_account_id);

  return (
    <div className="container mx-auto px-4 py-8 max-w-2xl">
      <div className="flex items-center gap-4 mb-6">
        <Link to="/auto-analytical-models"><Button variant="ghost" size="icon"><ArrowLeft className="h-4 w-4" /></Button></Link>
        <h1 className="text-2xl font-bold">{id ? "Edit Model" : "New AI Model"}</h1>
      </div>
      
      <Card className="mb-6">
        <CardHeader>
          <CardTitle className="text-lg flex items-center gap-2">
            <Sparkles className="h-5 w-5 text-primary" />
            Select Context (At least 1 required)
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label>Budget</Label>
            <select className="w-full border rounded-md p-2" value={formData.budget_id} onChange={(e) => { setFormData({ ...formData, budget_id: e.target.value }); setSuggestion(null); }}>
              <option value="">Select budget</option>
              {budgets.map(b => <option key={b.id} value={b.id}>{b.name}</option>)}
            </select>
          </div>
          <div className="space-y-2">
            <Label>Partner Tag</Label>
            <select className="w-full border rounded-md p-2" value={formData.partner_tag_id} onChange={(e) => { setFormData({ ...formData, partner_tag_id: e.target.value }); setSuggestion(null); }}>
              <option value="">Select tag</option>
              {tags.map(t => <option key={t.id} value={t.id}>{t.name}</option>)}
            </select>
          </div>
          <div className="space-y-2">
            <Label>Partner</Label>
            <select className="w-full border rounded-md p-2" value={formData.partner_id} onChange={(e) => { setFormData({ ...formData, partner_id: e.target.value }); setSuggestion(null); }}>
              <option value="">Select partner</option>
              {partners.map(p => <option key={p.id} value={p.id}>{p.name}</option>)}
            </select>
          </div>
          <div className="space-y-2">
            <Label>Product</Label>
            <select className="w-full border rounded-md p-2" value={formData.product_id} onChange={(e) => { setFormData({ ...formData, product_id: e.target.value }); setSuggestion(null); }}>
              <option value="">Select product</option>
              {products.map(p => <option key={p.id} value={p.id}>{p.name}</option>)}
            </select>
          </div>
          
          <Button type="button" onClick={getSuggestion} disabled={isSuggesting} className="w-full">
            {isSuggesting ? <><Loader2 className="h-4 w-4 mr-2 animate-spin" />Getting AI Suggestion...</> : <><Sparkles className="h-4 w-4 mr-2" />Get AI Suggestion</>}
          </Button>
        </CardContent>
      </Card>

      {suggestion && (
        <Card className="mb-6 border-primary">
          <CardHeader>
            <CardTitle className="text-lg flex items-center gap-2">
              <span className="text-xs bg-primary text-primary-foreground px-2 py-1 rounded">AI Generated</span>
              <span className={`text-xs px-2 py-1 rounded ${suggestion.confidence === 'High' ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'}`}>
                {suggestion.confidence} Confidence
              </span>
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <div>
              <Label className="text-muted-foreground">Model Name</Label>
              <p className="font-medium">{suggestion.name}</p>
            </div>
            <div>
              <Label className="text-muted-foreground">Analytical Account</Label>
              <p className="font-medium">[{selectedAccount?.code}] {selectedAccount?.name}</p>
            </div>
            <div>
              <Label className="text-muted-foreground">AI Reasoning</Label>
              <p className="text-sm text-muted-foreground">{suggestion.reasoning}</p>
            </div>
          </CardContent>
        </Card>
      )}

      <form onSubmit={handleSubmit}>
        <div className="flex gap-4">
          <Button type="submit" disabled={isLoading || !suggestion}>{isLoading ? "Saving..." : "Save Model"}</Button>
          <Button type="button" variant="outline" onClick={() => navigate("/auto-analytical-models")}>Cancel</Button>
        </div>
      </form>
    </div>
  );
};

export default AutoAnalyticalModelForm;
