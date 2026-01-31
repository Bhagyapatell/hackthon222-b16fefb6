-- Add INSERT and UPDATE policies for users on vendor_bills
CREATE POLICY "Users can insert own vendor bills"
ON public.vendor_bills
FOR INSERT
TO authenticated
WITH CHECK ((user_id = auth.uid()) OR is_admin());

CREATE POLICY "Users can update own vendor bills"
ON public.vendor_bills
FOR UPDATE
TO authenticated
USING ((user_id = auth.uid()) OR is_admin());

-- Add policies for vendor_bill_lines to allow users to manage lines on their bills
CREATE POLICY "Users can manage own vendor bill lines"
ON public.vendor_bill_lines
FOR ALL
TO authenticated
USING (
  EXISTS (
    SELECT 1 FROM public.vendor_bills
    WHERE id = vendor_bill_lines.vendor_bill_id
    AND ((user_id = auth.uid()) OR is_admin())
  )
)
WITH CHECK (
  EXISTS (
    SELECT 1 FROM public.vendor_bills
    WHERE id = vendor_bill_lines.vendor_bill_id
    AND ((user_id = auth.uid()) OR is_admin())
  )
);