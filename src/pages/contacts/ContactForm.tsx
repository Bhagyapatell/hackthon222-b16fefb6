import { useState, useEffect } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent } from "@/components/ui/card";
import { ArrowLeft } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

const ContactForm = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(false);
  const [formData, setFormData] = useState({ name: "", email: "", phone: "", street: "", city: "", state: "", country: "", pincode: "" });

  useEffect(() => { if (id) loadContact(); }, [id]);

  const loadContact = async () => {
    if (!id) return;
    const { data, error } = await supabase.from('contacts').select('*').eq('id', id).single();
    if (error) { toast.error("Failed to load contact"); return; }
    setFormData({ name: data.name || "", email: data.email || "", phone: data.phone || "", street: data.street || "", city: data.city || "", state: data.state || "", country: data.country || "", pincode: data.pincode || "" });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    try {
      if (id) {
        const { error } = await supabase.from('contacts').update(formData).eq('id', id);
        if (error) throw error;
        toast.success("Contact updated!");
      } else {
        const { error } = await supabase.from('contacts').insert([formData]);
        if (error) throw error;
        toast.success("Contact created!");
      }
      navigate("/contacts");
    } catch (error: any) { toast.error(error.message); } finally { setIsLoading(false); }
  };

  return (
    <div className="container mx-auto px-4 py-8 max-w-2xl">
      <div className="flex items-center gap-4 mb-6">
        <Link to="/contacts"><Button variant="ghost" size="icon"><ArrowLeft className="h-4 w-4" /></Button></Link>
        <h1 className="text-2xl font-bold">{id ? "Edit Contact" : "New Contact"}</h1>
      </div>
      <Card><CardContent className="pt-6">
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2"><Label htmlFor="name">Name *</Label><Input id="name" value={formData.name} onChange={(e) => setFormData({ ...formData, name: e.target.value })} required /></div>
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2"><Label htmlFor="email">Email</Label><Input id="email" type="email" value={formData.email} onChange={(e) => setFormData({ ...formData, email: e.target.value })} /></div>
            <div className="space-y-2"><Label htmlFor="phone">Phone</Label><Input id="phone" value={formData.phone} onChange={(e) => setFormData({ ...formData, phone: e.target.value })} /></div>
          </div>
          <div className="space-y-2"><Label htmlFor="street">Street</Label><Input id="street" value={formData.street} onChange={(e) => setFormData({ ...formData, street: e.target.value })} /></div>
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2"><Label htmlFor="city">City</Label><Input id="city" value={formData.city} onChange={(e) => setFormData({ ...formData, city: e.target.value })} /></div>
            <div className="space-y-2"><Label htmlFor="state">State</Label><Input id="state" value={formData.state} onChange={(e) => setFormData({ ...formData, state: e.target.value })} /></div>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2"><Label htmlFor="country">Country</Label><Input id="country" value={formData.country} onChange={(e) => setFormData({ ...formData, country: e.target.value })} /></div>
            <div className="space-y-2"><Label htmlFor="pincode">Pincode</Label><Input id="pincode" value={formData.pincode} onChange={(e) => setFormData({ ...formData, pincode: e.target.value })} /></div>
          </div>
          <div className="flex gap-4"><Button type="submit" disabled={isLoading}>{isLoading ? "Saving..." : "Save"}</Button><Button type="button" variant="outline" onClick={() => navigate("/contacts")}>Cancel</Button></div>
        </form>
      </CardContent></Card>
    </div>
  );
};

export default ContactForm;
