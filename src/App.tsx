import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { ThemeProvider } from "next-themes";
import { AuthProvider } from "@/contexts/AuthContext";
import { ProtectedRoute } from "@/components/auth/ProtectedRoute";
import Index from "./pages/Index";
import Auth from "./pages/Auth";
import Dashboard from "./pages/Dashboard";
import NotFound from "./pages/NotFound";

// Contacts
import ContactList from "./pages/contacts/ContactList";
import ContactForm from "./pages/contacts/ContactForm";

// Products
import ProductList from "./pages/products/ProductList";
import ProductForm from "./pages/products/ProductForm";
import ProductCategoryList from "./pages/products/ProductCategoryList";
import ProductCategoryForm from "./pages/products/ProductCategoryForm";

// Sales
import SalesOrderList from "./pages/sales/SalesOrderList";
import SalesOrderForm from "./pages/sales/SalesOrderForm";
import CustomerInvoiceList from "./pages/sales/CustomerInvoiceList";
import CustomerInvoiceForm from "./pages/sales/CustomerInvoiceForm";
import InvoicePaymentList from "./pages/sales/InvoicePaymentList";
import InvoicePaymentForm from "./pages/sales/InvoicePaymentForm";

// Purchases
import PurchaseOrderList from "./pages/purchases/PurchaseOrderList";
import PurchaseOrderForm from "./pages/purchases/PurchaseOrderForm";
import VendorBillList from "./pages/purchases/VendorBillList";
import VendorBillForm from "./pages/purchases/VendorBillForm";
import BillPaymentList from "./pages/purchases/BillPaymentList";
import BillPaymentForm from "./pages/purchases/BillPaymentForm";

// Account
import AnalyticalAccountList from "./pages/account/AnalyticalAccountList";
import AnalyticalAccountForm from "./pages/account/AnalyticalAccountForm";
import BudgetList from "./pages/account/BudgetList";
import BudgetForm from "./pages/account/BudgetForm";
import AutoAnalyticalModelList from "./pages/account/AutoAnalyticalModelList";
import AutoAnalyticalModelForm from "./pages/account/AutoAnalyticalModelForm";

// Settings
import TagList from "./pages/settings/TagList";
import TagForm from "./pages/settings/TagForm";
import PortalUserList from "./pages/settings/PortalUserList";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <ThemeProvider attribute="class" defaultTheme="system" enableSystem>
      <TooltipProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter>
          <AuthProvider>
            <Routes>
              <Route path="/" element={<Index />} />
              <Route path="/auth" element={<Auth />} />
              
              <Route path="/dashboard" element={<ProtectedRoute><Dashboard /></ProtectedRoute>} />
              
              {/* Contacts */}
              <Route path="/contacts" element={<ProtectedRoute><ContactList /></ProtectedRoute>} />
              <Route path="/contacts/new" element={<ProtectedRoute><ContactForm /></ProtectedRoute>} />
              <Route path="/contacts/:id" element={<ProtectedRoute><ContactForm /></ProtectedRoute>} />
              
              {/* Products */}
              <Route path="/products" element={<ProtectedRoute><ProductList /></ProtectedRoute>} />
              <Route path="/products/new" element={<ProtectedRoute><ProductForm /></ProtectedRoute>} />
              <Route path="/products/:id" element={<ProtectedRoute><ProductForm /></ProtectedRoute>} />
              <Route path="/product-categories" element={<ProtectedRoute><ProductCategoryList /></ProtectedRoute>} />
              <Route path="/product-categories/new" element={<ProtectedRoute><ProductCategoryForm /></ProtectedRoute>} />
              <Route path="/product-categories/:id" element={<ProtectedRoute><ProductCategoryForm /></ProtectedRoute>} />
              
              {/* Sales */}
              <Route path="/sales-orders" element={<ProtectedRoute><SalesOrderList /></ProtectedRoute>} />
              <Route path="/sales-orders/new" element={<ProtectedRoute><SalesOrderForm /></ProtectedRoute>} />
              <Route path="/sales-orders/:id" element={<ProtectedRoute><SalesOrderForm /></ProtectedRoute>} />
              <Route path="/customer-invoices" element={<ProtectedRoute><CustomerInvoiceList /></ProtectedRoute>} />
              <Route path="/customer-invoices/new" element={<ProtectedRoute><CustomerInvoiceForm /></ProtectedRoute>} />
              <Route path="/customer-invoices/:id" element={<ProtectedRoute><CustomerInvoiceForm /></ProtectedRoute>} />
              <Route path="/invoice-payments" element={<ProtectedRoute><InvoicePaymentList /></ProtectedRoute>} />
              <Route path="/invoice-payments/new" element={<ProtectedRoute><InvoicePaymentForm /></ProtectedRoute>} />
              <Route path="/invoice-payments/:id" element={<ProtectedRoute><InvoicePaymentForm /></ProtectedRoute>} />
              
              {/* Purchases */}
              <Route path="/purchase-orders" element={<ProtectedRoute><PurchaseOrderList /></ProtectedRoute>} />
              <Route path="/purchase-orders/new" element={<ProtectedRoute><PurchaseOrderForm /></ProtectedRoute>} />
              <Route path="/purchase-orders/:id" element={<ProtectedRoute><PurchaseOrderForm /></ProtectedRoute>} />
              <Route path="/vendor-bills" element={<ProtectedRoute><VendorBillList /></ProtectedRoute>} />
              <Route path="/vendor-bills/new" element={<ProtectedRoute><VendorBillForm /></ProtectedRoute>} />
              <Route path="/vendor-bills/:id" element={<ProtectedRoute><VendorBillForm /></ProtectedRoute>} />
              <Route path="/bill-payments" element={<ProtectedRoute><BillPaymentList /></ProtectedRoute>} />
              <Route path="/bill-payments/new" element={<ProtectedRoute><BillPaymentForm /></ProtectedRoute>} />
              <Route path="/bill-payments/:id" element={<ProtectedRoute><BillPaymentForm /></ProtectedRoute>} />
              
              {/* Account */}
              <Route path="/analytical-accounts" element={<ProtectedRoute><AnalyticalAccountList /></ProtectedRoute>} />
              <Route path="/analytical-accounts/new" element={<ProtectedRoute><AnalyticalAccountForm /></ProtectedRoute>} />
              <Route path="/analytical-accounts/:id" element={<ProtectedRoute><AnalyticalAccountForm /></ProtectedRoute>} />
              <Route path="/budgets" element={<ProtectedRoute><BudgetList /></ProtectedRoute>} />
              <Route path="/budgets/new" element={<ProtectedRoute><BudgetForm /></ProtectedRoute>} />
              <Route path="/budgets/:id" element={<ProtectedRoute><BudgetForm /></ProtectedRoute>} />
              <Route path="/auto-analytical-models" element={<ProtectedRoute><AutoAnalyticalModelList /></ProtectedRoute>} />
              <Route path="/auto-analytical-models/new" element={<ProtectedRoute><AutoAnalyticalModelForm /></ProtectedRoute>} />
              <Route path="/auto-analytical-models/:id" element={<ProtectedRoute><AutoAnalyticalModelForm /></ProtectedRoute>} />
              
              {/* Settings */}
              <Route path="/tags" element={<ProtectedRoute><TagList /></ProtectedRoute>} />
              <Route path="/tags/new" element={<ProtectedRoute><TagForm /></ProtectedRoute>} />
              <Route path="/tags/:id" element={<ProtectedRoute><TagForm /></ProtectedRoute>} />
              <Route path="/portal-users" element={<ProtectedRoute><PortalUserList /></ProtectedRoute>} />
              
              <Route path="*" element={<NotFound />} />
            </Routes>
          </AuthProvider>
        </BrowserRouter>
      </TooltipProvider>
    </ThemeProvider>
  </QueryClientProvider>
);

export default App;
