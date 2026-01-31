-- FIRST: Make sure is_admin function uses profiles table
CREATE OR REPLACE FUNCTION public.is_admin()
RETURNS BOOLEAN AS $$
BEGIN
  RETURN EXISTS (
    SELECT 1
    FROM public.profiles
    WHERE id = auth.uid()
    AND role = 'admin'
  );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER SET search_path = public;

-- SECOND: Drop existing policies if they exist
DROP POLICY IF EXISTS "Admins can manage all vendor bills" ON public.vendor_bills;
DROP POLICY IF EXISTS "Portal users can view their vendor bills" ON public.vendor_bills;
DROP POLICY IF EXISTS "Users can insert own vendor bills" ON public.vendor_bills;
DROP POLICY IF EXISTS "Users can update own vendor bills" ON public.vendor_bills;
DROP POLICY IF EXISTS "Admins can manage all vendor bill lines" ON public.vendor_bill_lines;
DROP POLICY IF EXISTS "Portal users can view their vendor bill lines" ON public.vendor_bill_lines;
DROP POLICY IF EXISTS "Users can manage own vendor bill lines" ON public.vendor_bill_lines;

-- THIRD: Enable RLS (already enabled but safe to run again)
ALTER TABLE public.vendor_bills ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.vendor_bill_lines ENABLE ROW LEVEL SECURITY;

-- FOURTH: Create NEW policies for admins - ALL operations
CREATE POLICY "admin_all_vendor_bills"
ON public.vendor_bills
FOR ALL
TO authenticated
USING (
  EXISTS (
    SELECT 1 FROM public.profiles
    WHERE id = auth.uid()
    AND role = 'admin'
  )
)
WITH CHECK (
  EXISTS (
    SELECT 1 FROM public.profiles
    WHERE id = auth.uid()
    AND role = 'admin'
  )
);

-- FIFTH: Portal users can SELECT their bills
CREATE POLICY "portal_select_vendor_bills"
ON public.vendor_bills
FOR SELECT
TO authenticated
USING (user_id = auth.uid());

-- SIXTH: Admin lines policy
CREATE POLICY "admin_all_vendor_bill_lines"
ON public.vendor_bill_lines
FOR ALL
TO authenticated
USING (
  EXISTS (
    SELECT 1 FROM public.profiles
    WHERE id = auth.uid()
    AND role = 'admin'
  )
)
WITH CHECK (
  EXISTS (
    SELECT 1 FROM public.profiles
    WHERE id = auth.uid()
    AND role = 'admin'
  )
);

-- SEVENTH: Portal users select lines
CREATE POLICY "portal_select_vendor_bill_lines"
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