import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Plus, ArrowLeft } from "lucide-react";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";

const BillPaymentList = () => {
  const { data: payments, isLoading } = useQuery({
    queryKey: ['bill_payments'],
    queryFn: async () => {
      const { data, error } = await supabase.from('bill_payments').select('*, vendor_bills(bill_number)').order('created_at', { ascending: false });
      if (error) throw error;
      return data;
    }
  });

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex justify-between items-center mb-6">
        <div className="flex items-center gap-4">
          <Link to="/dashboard"><Button variant="ghost" size="icon"><ArrowLeft className="h-4 w-4" /></Button></Link>
          <h1 className="text-2xl font-bold">Bill Payments</h1>
        </div>
        <Link to="/bill-payments/new"><Button><Plus className="h-4 w-4 mr-2" />New Payment</Button></Link>
      </div>
      {isLoading ? <div>Loading...</div> : (
        <div className="grid gap-4">
          {payments?.map((payment) => (
            <Link key={payment.id} to={`/bill-payments/${payment.id}`}>
              <Card className="hover:border-primary cursor-pointer">
                <CardHeader><CardTitle className="text-lg">{payment.payment_number}</CardTitle></CardHeader>
                <CardContent>
                  <p className="text-sm text-muted-foreground">Bill: {payment.vendor_bills?.bill_number}</p>
                  <p className="text-sm text-muted-foreground">Amount: ₹{payment.amount} | Status: {payment.status}</p>
                </CardContent>
              </Card>
            </Link>
          ))}
          {payments?.length === 0 && <p className="text-muted-foreground text-center py-8">No payments found</p>}
        </div>
      )}
    </div>
  );
};

export default BillPaymentList;
