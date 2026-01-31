import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Plus, ArrowLeft } from "lucide-react";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";

const CustomerInvoiceList = () => {
  const { data: invoices, isLoading } = useQuery({
    queryKey: ['customer_invoices'],
    queryFn: async () => {
      const { data, error } = await supabase.from('customer_invoices').select('*, contacts(name)').eq('is_archived', false).order('created_at', { ascending: false });
      if (error) throw error;
      return data;
    }
  });

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex justify-between items-center mb-6">
        <div className="flex items-center gap-4">
          <Link to="/dashboard"><Button variant="ghost" size="icon"><ArrowLeft className="h-4 w-4" /></Button></Link>
          <h1 className="text-2xl font-bold">Customer Invoices</h1>
        </div>
        <Link to="/customer-invoices/new"><Button><Plus className="h-4 w-4 mr-2" />New Invoice</Button></Link>
      </div>
      {isLoading ? <div>Loading...</div> : (
        <div className="grid gap-4">
          {invoices?.map((inv) => (
            <Link key={inv.id} to={`/customer-invoices/${inv.id}`}>
              <Card className="hover:border-primary cursor-pointer">
                <CardHeader><CardTitle className="text-lg">{inv.invoice_number}</CardTitle></CardHeader>
                <CardContent>
                  <p className="text-sm text-muted-foreground">Customer: {inv.contacts?.name}</p>
                  <p className="text-sm text-muted-foreground">Total: ₹{inv.total_amount} | Status: {inv.status}</p>
                </CardContent>
              </Card>
            </Link>
          ))}
          {invoices?.length === 0 && <p className="text-muted-foreground text-center py-8">No invoices found</p>}
        </div>
      )}
    </div>
  );
};

export default CustomerInvoiceList;
