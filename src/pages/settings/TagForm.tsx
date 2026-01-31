import { useState, useEffect } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent } from "@/components/ui/card";
import { ArrowLeft } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

const TagForm = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(false);
  const [formData, setFormData] = useState({ name: "", color: "#3b82f6" });

  useEffect(() => { if (id) loadTag(); }, [id]);

  const loadTag = async () => {
    if (!id) return;
    const { data, error } = await supabase.from('tags').select('*').eq('id', id).single();
    if (error) { toast.error("Failed to load tag"); return; }
    setFormData({ name: data.name, color: data.color });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    try {
      if (id) {
        const { error } = await supabase.from('tags').update(formData).eq('id', id);
        if (error) throw error;
        toast.success("Tag updated!");
      } else {
        const { error } = await supabase.from('tags').insert([formData]);
        if (error) throw error;
        toast.success("Tag created!");
      }
      navigate("/tags");
    } catch (error: any) { toast.error(error.message); } finally { setIsLoading(false); }
  };

  return (
    <div className="container mx-auto px-4 py-8 max-w-2xl">
      <div className="flex items-center gap-4 mb-6">
        <Link to="/tags"><Button variant="ghost" size="icon"><ArrowLeft className="h-4 w-4" /></Button></Link>
        <h1 className="text-2xl font-bold">{id ? "Edit Tag" : "New Tag"}</h1>
      </div>
      <Card><CardContent className="pt-6">
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2"><Label>Name *</Label><Input value={formData.name} onChange={(e) => setFormData({ ...formData, name: e.target.value })} required /></div>
          <div className="space-y-2">
            <Label>Color</Label>
            <div className="flex gap-2 items-center">
              <input type="color" value={formData.color} onChange={(e) => setFormData({ ...formData, color: e.target.value })} className="w-12 h-10 rounded cursor-pointer" />
              <Input value={formData.color} onChange={(e) => setFormData({ ...formData, color: e.target.value })} className="flex-1" />
            </div>
          </div>
          <div className="flex gap-4"><Button type="submit" disabled={isLoading}>{isLoading ? "Saving..." : "Save"}</Button><Button type="button" variant="outline" onClick={() => navigate("/tags")}>Cancel</Button></div>
        </form>
      </CardContent></Card>
    </div>
  );
};

export default TagForm;
