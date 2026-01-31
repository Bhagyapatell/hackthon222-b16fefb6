-- Drop existing conflicting policies on vendor_bills
DROP POLICY IF EXISTS "Admin can manage all bills" ON public.vendor_bills;
DROP POLICY IF EXISTS "Portal users can view own vendor bills" ON public.vendor_bills;
DROP POLICY IF EXISTS "Users can insert own bills" ON public.vendor_bills;
DROP POLICY IF EXISTS "Users can update own bills" ON public.vendor_bills;
DROP POLICY IF EXISTS "Users can view own bills" ON public.vendor_bills;

-- Drop existing conflicting policies on vendor_bill_lines
DROP POLICY IF EXISTS "Portal users can view own bill lines" ON public.vendor_bill_lines;
DROP POLICY IF EXISTS "Users can manage bill lines" ON public.vendor_bill_lines;

-- Enable RLS on vendor_bills and vendor_bill_lines
ALTER TABLE public.vendor_bills ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.vendor_bill_lines ENABLE ROW LEVEL SECURITY;

-- Admin can see and manage all vendor bills
CREATE POLICY "Admins can manage all vendor bills"
ON public.vendor_bills
FOR ALL
TO authenticated
USING (public.is_admin())
WITH CHECK (public.is_admin());

-- Portal users can see their own vendor bills (where user_id matches)
CREATE POLICY "Portal users can view their vendor bills"
ON public.vendor_bills
FOR SELECT
TO authenticated
USING (user_id = auth.uid());

-- Admin can manage all vendor bill lines
CREATE POLICY "Admins can manage all vendor bill lines"
ON public.vendor_bill_lines
FOR ALL
TO authenticated
USING (
  EXISTS (
    SELECT 1 FROM public.vendor_bills
    WHERE id = vendor_bill_lines.vendor_bill_id
    AND public.is_admin()
  )
);

-- Portal users can view their vendor bill lines
CREATE POLICY "Portal users can view their vendor bill lines"
ON public.vendor_bill_lines
FOR SELECT
TO authenticated
USING (
  EXISTS (
    SELECT 1 FROM public.vendor_bills
    WHERE id = vendor_bill_lines.vendor_bill_id
    AND user_id = auth.uid()
  )
);