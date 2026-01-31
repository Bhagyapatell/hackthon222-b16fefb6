-- 1. Create the Model Status Enum
DO $$ BEGIN
  CREATE TYPE public.model_status AS ENUM ('draft', 'confirmed', 'archived');
EXCEPTION
  WHEN duplicate_object THEN null;
END $$;

-- 2. Add status column to auto_analytical_models
ALTER TABLE public.auto_analytical_models 
ADD COLUMN IF NOT EXISTS status public.model_status NOT NULL DEFAULT 'draft';

-- 3. Sync existing data (optional but recommended)
UPDATE public.auto_analytical_models 
SET status = CASE 
  WHEN is_archived = true THEN 'archived'::public.model_status 
  ELSE 'confirmed'::public.model_status 
END
WHERE status = 'draft';

-- 4. Upgrade the Matching Function
CREATE OR REPLACE FUNCTION public.find_matching_analytical_account(
  p_partner_id UUID,
  p_product_id UUID
)
RETURNS UUID AS $$
DECLARE
  v_partner_tag_ids UUID[];
  v_product_category_id UUID;
  v_result UUID;
BEGIN
  -- Get partner tags
  IF p_partner_id IS NOT NULL THEN
    v_partner_tag_ids := get_contact_tag_ids(p_partner_id);
  ELSE
    v_partner_tag_ids := ARRAY[]::UUID[];
  END IF;

  -- Get product category
  IF p_product_id IS NOT NULL THEN
    v_product_category_id := get_product_category_id(p_product_id);
  END IF;

  -- Find best matching model using specificity-based priority
  SELECT m.analytical_account_id INTO v_result
  FROM public.auto_analytical_models m
  WHERE m.status = 'confirmed' -- ONLY confirmed models are applied
    -- All selected conditions must match (AND logic)
    AND (m.partner_id IS NULL OR m.partner_id = p_partner_id)
    AND (m.partner_tag_id IS NULL OR m.partner_tag_id = ANY(v_partner_tag_ids))
    AND (m.product_id IS NULL OR m.product_id = p_product_id)
    AND (m.product_category_id IS NULL OR m.product_category_id = v_product_category_id)
    -- Must have at least one condition defined
    AND (
      m.partner_id IS NOT NULL OR 
      m.partner_tag_id IS NOT NULL OR 
      m.product_id IS NOT NULL OR 
      m.product_category_id IS NOT NULL
    )
  ORDER BY 
    -- Higher specificity wins (count of defined fields)
    (CASE WHEN m.partner_id IS NOT NULL THEN 1 ELSE 0 END +
     CASE WHEN m.partner_tag_id IS NOT NULL THEN 1 ELSE 0 END +
     CASE WHEN m.product_id IS NOT NULL THEN 1 ELSE 0 END +
     CASE WHEN m.product_category_id IS NOT NULL THEN 1 ELSE 0 END) DESC,
    -- Then by explicit priority
    m.priority DESC,
    -- Then by creation order (first wins)
    m.created_at ASC
  LIMIT 1;

  RETURN v_result;
END;
$$ LANGUAGE plpgsql STABLE SECURITY DEFINER SET search_path = public;

-- Refresh Supabase Cache
NOTIFY pgrst, 'reload schema';