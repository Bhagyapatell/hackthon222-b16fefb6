import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Plus, ArrowLeft } from "lucide-react";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";

const SalesOrderList = () => {
  const { data: orders, isLoading } = useQuery({
    queryKey: ['sales_orders'],
    queryFn: async () => {
      const { data, error } = await supabase.from('sales_orders').select('*, contacts(name)').eq('is_archived', false).order('created_at', { ascending: false });
      if (error) throw error;
      return data;
    }
  });

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex justify-between items-center mb-6">
        <div className="flex items-center gap-4">
          <Link to="/dashboard"><Button variant="ghost" size="icon"><ArrowLeft className="h-4 w-4" /></Button></Link>
          <h1 className="text-2xl font-bold">Sales Orders</h1>
        </div>
        <Link to="/sales-orders/new"><Button><Plus className="h-4 w-4 mr-2" />New Order</Button></Link>
      </div>
      {isLoading ? <div>Loading...</div> : (
        <div className="grid gap-4">
          {orders?.map((order) => (
            <Link key={order.id} to={`/sales-orders/${order.id}`}>
              <Card className="hover:border-primary cursor-pointer">
                <CardHeader><CardTitle className="text-lg">{order.order_number}</CardTitle></CardHeader>
                <CardContent>
                  <p className="text-sm text-muted-foreground">Customer: {order.contacts?.name}</p>
                  <p className="text-sm text-muted-foreground">Total: ₹{order.total_amount} | Status: {order.status}</p>
                </CardContent>
              </Card>
            </Link>
          ))}
          {orders?.length === 0 && <p className="text-muted-foreground text-center py-8">No orders found</p>}
        </div>
      )}
    </div>
  );
};

export default SalesOrderList;
