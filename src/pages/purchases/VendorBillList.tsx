import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Plus, ArrowLeft } from "lucide-react";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";

const VendorBillList = () => {
  const { data: bills, isLoading } = useQuery({
    queryKey: ['vendor_bills'],
    queryFn: async () => {
      const { data, error } = await supabase.from('vendor_bills').select('*, contacts(name)').eq('is_archived', false).order('created_at', { ascending: false });
      if (error) throw error;
      return data;
    }
  });

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex justify-between items-center mb-6">
        <div className="flex items-center gap-4">
          <Link to="/dashboard"><Button variant="ghost" size="icon"><ArrowLeft className="h-4 w-4" /></Button></Link>
          <h1 className="text-2xl font-bold">Vendor Bills</h1>
        </div>
        <Link to="/vendor-bills/new"><Button><Plus className="h-4 w-4 mr-2" />New Bill</Button></Link>
      </div>
      {isLoading ? <div>Loading...</div> : (
        <div className="grid gap-4">
          {bills?.map((bill) => (
            <Link key={bill.id} to={`/vendor-bills/${bill.id}`}>
              <Card className="hover:border-primary cursor-pointer">
                <CardHeader><CardTitle className="text-lg">{bill.bill_number}</CardTitle></CardHeader>
                <CardContent>
                  <p className="text-sm text-muted-foreground">Vendor: {bill.contacts?.name}</p>
                  <p className="text-sm text-muted-foreground">Total: ₹{bill.total_amount} | Status: {bill.status}</p>
                </CardContent>
              </Card>
            </Link>
          ))}
          {bills?.length === 0 && <p className="text-muted-foreground text-center py-8">No bills found</p>}
        </div>
      )}
    </div>
  );
};

export default VendorBillList;
