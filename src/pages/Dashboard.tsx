import { useAuth } from "@/contexts/AuthContext";
import { Button } from "@/components/ui/button";
import { Card, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Link } from "react-router-dom";
import { Users, Package, ShoppingCart, FileText, PieChart, Target, Sparkles, Tags, Settings, LogOut } from "lucide-react";

const Dashboard = () => {
  const { user, signOut } = useAuth();

  const menuItems = [
    { title: "Contacts", icon: Users, path: "/contacts", description: "Manage partners and customers" },
    { title: "Products", icon: Package, path: "/products", description: "Product catalog management" },
    { title: "Sales Orders", icon: ShoppingCart, path: "/sales-orders", description: "Customer sales orders" },
    { title: "Customer Invoices", icon: FileText, path: "/customer-invoices", description: "Invoice management" },
    { title: "Purchase Orders", icon: ShoppingCart, path: "/purchase-orders", description: "Vendor purchases" },
    { title: "Vendor Bills", icon: FileText, path: "/vendor-bills", description: "Bill management" },
    { title: "Analytical Accounts", icon: PieChart, path: "/analytical-accounts", description: "Cost center tracking" },
    { title: "Budgets", icon: Target, path: "/budgets", description: "Budget planning" },
    { title: "Auto Analytical Models", icon: Sparkles, path: "/auto-analytical-models", description: "AI-driven analytics" },
    { title: "Tags", icon: Tags, path: "/tags", description: "Contact categorization" },
    { title: "Portal Users", icon: Settings, path: "/portal-users", description: "User management" },
  ];

  return (
    <div className="min-h-screen bg-background">
      <header className="border-b">
        <div className="container mx-auto px-4 py-4 flex justify-between items-center">
          <h1 className="text-2xl font-bold">BudgetWise ERP</h1>
          <div className="flex items-center gap-4">
            <span className="text-sm text-muted-foreground">{user?.email}</span>
            <Button variant="outline" size="sm" onClick={signOut}><LogOut className="h-4 w-4 mr-2" />Sign Out</Button>
          </div>
        </div>
      </header>
      <main className="container mx-auto px-4 py-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {menuItems.map((item) => (
            <Link key={item.path} to={item.path}>
              <Card className="hover:border-primary transition-colors cursor-pointer h-full">
                <CardHeader className="flex flex-row items-center gap-4">
                  <item.icon className="h-8 w-8 text-primary" />
                  <div><CardTitle className="text-lg">{item.title}</CardTitle><CardDescription>{item.description}</CardDescription></div>
                </CardHeader>
              </Card>
            </Link>
          ))}
        </div>
      </main>
    </div>
  );
};

export default Dashboard;
