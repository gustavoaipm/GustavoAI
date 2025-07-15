-- Migration: Add tenant support for property owners
-- This allows property owners to also be tenants

-- Add is_tenant column to users table
ALTER TABLE public.users ADD COLUMN is_tenant BOOLEAN DEFAULT FALSE;

-- Update RLS policies to allow users to view their own tenant records
CREATE POLICY "Users can view their own tenant records" ON public.tenants
    FOR SELECT USING (
        EXISTS (
            SELECT 1 FROM public.users 
            WHERE users.id = auth.uid() 
            AND users.email = tenants.email
        )
    );

-- Update RLS policies to allow users to view their own payments
CREATE POLICY "Users can view their own payments" ON public.payments
    FOR SELECT USING (
        EXISTS (
            SELECT 1 FROM public.tenants 
            WHERE tenants.id = payments.tenant_id 
            AND tenants.email = (
                SELECT email FROM public.users WHERE users.id = auth.uid()
            )
        )
    );

-- Update RLS policies to allow users to view their own maintenance requests
CREATE POLICY "Users can view their own maintenance requests" ON public.maintenance
    FOR SELECT USING (
        EXISTS (
            SELECT 1 FROM public.tenants 
            WHERE tenants.id = maintenance.tenant_id 
            AND tenants.email = (
                SELECT email FROM public.users WHERE users.id = auth.uid()
            )
        )
    );

-- Update RLS policies to allow users to insert their own maintenance requests
CREATE POLICY "Users can insert their own maintenance requests" ON public.maintenance
    FOR INSERT WITH CHECK (
        EXISTS (
            SELECT 1 FROM public.tenants 
            WHERE tenants.id = maintenance.tenant_id 
            AND tenants.email = (
                SELECT email FROM public.users WHERE users.id = auth.uid()
            )
        )
    );

-- Update RLS policies to allow users to update their own maintenance requests
CREATE POLICY "Users can update their own maintenance requests" ON public.maintenance
    FOR UPDATE USING (
        EXISTS (
            SELECT 1 FROM public.tenants 
            WHERE tenants.id = maintenance.tenant_id 
            AND tenants.email = (
                SELECT email FROM public.users WHERE users.id = auth.uid()
            )
        )
    );

-- Create index for better performance on tenant lookups
CREATE INDEX idx_tenants_email ON public.tenants(email);

-- Update the handle_new_user function to set is_tenant to false by default
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
    INSERT INTO public.users (id, email, first_name, last_name, phone, role, is_tenant)
    VALUES (
        NEW.id,
        NEW.email,
        COALESCE(NEW.raw_user_meta_data->>'first_name', ''),
        COALESCE(NEW.raw_user_meta_data->>'last_name', ''),
        COALESCE(NEW.raw_user_meta_data->>'phone', NULL),
        COALESCE((NEW.raw_user_meta_data->>'role')::user_role, 'LANDLORD'),
        FALSE
    );
    RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

SELECT 'Tenant support added successfully!' as status; 