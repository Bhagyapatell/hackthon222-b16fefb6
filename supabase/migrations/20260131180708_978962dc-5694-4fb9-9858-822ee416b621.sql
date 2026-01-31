-- Add product_category_id column if it doesn't exist
ALTER TABLE public.auto_analytical_models 
ADD COLUMN IF NOT EXISTS product_category_id UUID;

-- Drop existing foreign key constraints
ALTER TABLE public.auto_analytical_models 
DROP CONSTRAINT IF EXISTS auto_analytical_models_product_category_id_fkey,
DROP CONSTRAINT IF EXISTS auto_analytical_models_product_id_fkey,
DROP CONSTRAINT IF EXISTS auto_analytical_models_partner_id_fkey,
DROP CONSTRAINT IF EXISTS auto_analytical_models_partner_tag_id_fkey,
DROP CONSTRAINT IF EXISTS auto_analytical_models_analytical_account_id_fkey,
DROP CONSTRAINT IF EXISTS auto_analytical_models_budget_id_fkey;

-- Re-add foreign key constraints
ALTER TABLE public.auto_analytical_models
ADD CONSTRAINT auto_analytical_models_product_category_id_fkey 
  FOREIGN KEY (product_category_id) REFERENCES public.product_categories(id),
ADD CONSTRAINT auto_analytical_models_product_id_fkey 
  FOREIGN KEY (product_id) REFERENCES public.products(id),
ADD CONSTRAINT auto_analytical_models_partner_id_fkey 
  FOREIGN KEY (partner_id) REFERENCES public.contacts(id),
ADD CONSTRAINT auto_analytical_models_partner_tag_id_fkey 
  FOREIGN KEY (partner_tag_id) REFERENCES public.tags(id),
ADD CONSTRAINT auto_analytical_models_analytical_account_id_fkey 
  FOREIGN KEY (analytical_account_id) REFERENCES public.analytical_accounts(id),
ADD CONSTRAINT auto_analytical_models_budget_id_fkey 
  FOREIGN KEY (budget_id) REFERENCES public.budgets(id);

-- Refresh Supabase Cache
NOTIFY pgrst, 'reload schema';