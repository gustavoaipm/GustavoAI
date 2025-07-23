-- Migration: Add Units Table for Multi-Unit Properties
-- This migration adds support for multi-unit properties

-- Add new enum for unit status
CREATE TYPE unit_status AS ENUM ('AVAILABLE', 'OCCUPIED', 'MAINTENANCE', 'UNAVAILABLE', 'RESERVED');

-- Update property_status enum to be more property-focused
ALTER TYPE property_status RENAME TO old_property_status;
CREATE TYPE property_status AS ENUM ('ACTIVE', 'INACTIVE', 'MAINTENANCE', 'UNAVAILABLE');

-- Create units table
CREATE TABLE public.units (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    unit_number TEXT NOT NULL,
    bedrooms INTEGER NOT NULL,
    bathrooms INTEGER NOT NULL,
    square_feet INTEGER,
    rent_amount DECIMAL(10,2) NOT NULL,
    status unit_status DEFAULT 'AVAILABLE',
    description TEXT,
    images TEXT[] DEFAULT '{}',
    property_id UUID REFERENCES public.properties(id) ON DELETE CASCADE NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    -- Ensure unique unit numbers within a property
    UNIQUE(property_id, unit_number)
);

-- Add total_units column to properties table
ALTER TABLE public.properties 
ADD COLUMN total_units INTEGER DEFAULT 1;

-- Remove unit-specific columns from properties table
ALTER TABLE public.properties 
DROP COLUMN bedrooms,
DROP COLUMN bathrooms,
DROP COLUMN square_feet,
DROP COLUMN rent_amount;

-- Update tenants table to reference units instead of properties
ALTER TABLE public.tenants 
DROP CONSTRAINT tenants_property_id_fkey,
ADD COLUMN unit_id UUID REFERENCES public.units(id) ON DELETE CASCADE;

-- Update payments table to reference units instead of properties
ALTER TABLE public.payments 
DROP CONSTRAINT payments_property_id_fkey,
ADD COLUMN unit_id UUID REFERENCES public.units(id) ON DELETE CASCADE;

-- Update maintenance table to reference units
ALTER TABLE public.maintenance 
ADD COLUMN unit_id UUID REFERENCES public.units(id) ON DELETE SET NULL;

-- Create indexes for units table
CREATE INDEX idx_units_property_id ON public.units(property_id);
CREATE INDEX idx_units_status ON public.units(status);
CREATE INDEX idx_tenants_unit_id ON public.tenants(unit_id);
CREATE INDEX idx_payments_unit_id ON public.payments(unit_id);
CREATE INDEX idx_maintenance_unit_id ON public.maintenance(unit_id);

-- Create trigger for units updated_at
CREATE TRIGGER update_units_updated_at BEFORE UPDATE ON public.units FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- Enable RLS on units table
ALTER TABLE public.units ENABLE ROW LEVEL SECURITY;

-- Units policies
CREATE POLICY "Landlords can view units of their properties" ON public.units
    FOR SELECT USING (EXISTS (
        SELECT 1 FROM public.properties WHERE id = units.property_id AND owner_id = auth.uid()
    ));

CREATE POLICY "Landlords can insert units for their properties" ON public.units
    FOR INSERT WITH CHECK (EXISTS (
        SELECT 1 FROM public.properties WHERE id = units.property_id AND owner_id = auth.uid()
    ));

CREATE POLICY "Landlords can update units of their properties" ON public.units
    FOR UPDATE USING (EXISTS (
        SELECT 1 FROM public.properties WHERE id = units.property_id AND owner_id = auth.uid()
    ));

CREATE POLICY "Landlords can delete units of their properties" ON public.units
    FOR DELETE USING (EXISTS (
        SELECT 1 FROM public.properties WHERE id = units.property_id AND owner_id = auth.uid()
    ));

-- Update existing RLS policies to work with units
-- Tenants policies (now based on unit ownership)
DROP POLICY "Landlords can view tenants of their properties" ON public.tenants;
CREATE POLICY "Landlords can view tenants of their units" ON public.tenants
    FOR SELECT USING (EXISTS (
        SELECT 1 FROM public.units u 
        JOIN public.properties p ON u.property_id = p.id 
        WHERE u.id = tenants.unit_id AND p.owner_id = auth.uid()
    ));

DROP POLICY "Landlords can insert tenants for their properties" ON public.tenants;
CREATE POLICY "Landlords can insert tenants for their units" ON public.tenants
    FOR INSERT WITH CHECK (EXISTS (
        SELECT 1 FROM public.units u 
        JOIN public.properties p ON u.property_id = p.id 
        WHERE u.id = tenants.unit_id AND p.owner_id = auth.uid()
    ));

DROP POLICY "Landlords can update tenants of their properties" ON public.tenants;
CREATE POLICY "Landlords can update tenants of their units" ON public.tenants
    FOR UPDATE USING (EXISTS (
        SELECT 1 FROM public.units u 
        JOIN public.properties p ON u.property_id = p.id 
        WHERE u.id = tenants.unit_id AND p.owner_id = auth.uid()
    ));

DROP POLICY "Landlords can delete tenants of their properties" ON public.tenants;
CREATE POLICY "Landlords can delete tenants of their units" ON public.tenants
    FOR DELETE USING (EXISTS (
        SELECT 1 FROM public.units u 
        JOIN public.properties p ON u.property_id = p.id 
        WHERE u.id = tenants.unit_id AND p.owner_id = auth.uid()
    ));

-- Payments policies (now based on unit ownership)
DROP POLICY "Landlords can view payments for their properties" ON public.payments;
CREATE POLICY "Landlords can view payments for their units" ON public.payments
    FOR SELECT USING (EXISTS (
        SELECT 1 FROM public.units u 
        JOIN public.properties p ON u.property_id = p.id 
        WHERE u.id = payments.unit_id AND p.owner_id = auth.uid()
    ));

DROP POLICY "Landlords can insert payments for their properties" ON public.payments;
CREATE POLICY "Landlords can insert payments for their units" ON public.payments
    FOR INSERT WITH CHECK (EXISTS (
        SELECT 1 FROM public.units u 
        JOIN public.properties p ON u.property_id = p.id 
        WHERE u.id = payments.unit_id AND p.owner_id = auth.uid()
    ));

DROP POLICY "Landlords can update payments for their properties" ON public.payments;
CREATE POLICY "Landlords can update payments for their units" ON public.payments
    FOR UPDATE USING (EXISTS (
        SELECT 1 FROM public.units u 
        JOIN public.properties p ON u.property_id = p.id 
        WHERE u.id = payments.unit_id AND p.owner_id = auth.uid()
    ));

-- Maintenance policies (now can reference both property and unit)
DROP POLICY "Landlords can view maintenance for their properties" ON public.maintenance;
CREATE POLICY "Landlords can view maintenance for their properties and units" ON public.maintenance
    FOR SELECT USING (auth.uid() = assigned_to_id OR EXISTS (
        SELECT 1 FROM public.properties WHERE id = maintenance.property_id AND owner_id = auth.uid()
    ) OR EXISTS (
        SELECT 1 FROM public.units u 
        JOIN public.properties p ON u.property_id = p.id 
        WHERE u.id = maintenance.unit_id AND p.owner_id = auth.uid()
    ));

DROP POLICY "Landlords can insert maintenance for their properties" ON public.maintenance;
CREATE POLICY "Landlords can insert maintenance for their properties and units" ON public.maintenance
    FOR INSERT WITH CHECK (EXISTS (
        SELECT 1 FROM public.properties WHERE id = maintenance.property_id AND owner_id = auth.uid()
    ) OR EXISTS (
        SELECT 1 FROM public.units u 
        JOIN public.properties p ON u.property_id = p.id 
        WHERE u.id = maintenance.unit_id AND p.owner_id = auth.uid()
    ));

DROP POLICY "Landlords can update maintenance for their properties" ON public.maintenance;
CREATE POLICY "Landlords can update maintenance for their properties and units" ON public.maintenance
    FOR UPDATE USING (auth.uid() = assigned_to_id OR EXISTS (
        SELECT 1 FROM public.properties WHERE id = maintenance.property_id AND owner_id = auth.uid()
    ) OR EXISTS (
        SELECT 1 FROM public.units u 
        JOIN public.properties p ON u.property_id = p.id 
        WHERE u.id = maintenance.unit_id AND p.owner_id = auth.uid()
    ));

-- Migration function to convert existing single-unit properties to new structure
CREATE OR REPLACE FUNCTION migrate_existing_properties()
RETURNS void AS $$
DECLARE
    prop RECORD;
BEGIN
    -- For each existing property, create a default unit
    FOR prop IN SELECT * FROM public.properties LOOP
        -- Create a default unit for the property
        INSERT INTO public.units (
            unit_number,
            bedrooms,
            bathrooms,
            square_feet,
            rent_amount,
            status,
            description,
            property_id
        ) VALUES (
            '1', -- Default unit number
            prop.bedrooms,
            prop.bathrooms,
            prop.square_feet,
            prop.rent_amount,
            prop.status::text::unit_status,
            prop.description,
            prop.id
        );
        
        -- Update property to have 1 total unit
        UPDATE public.properties 
        SET total_units = 1 
        WHERE id = prop.id;
    END LOOP;
END;
$$ LANGUAGE plpgsql;

-- Run the migration
SELECT migrate_existing_properties();

-- Clean up the migration function
DROP FUNCTION migrate_existing_properties();

-- Remove the old property_id columns (after ensuring data is migrated)
-- Note: These will be removed in a separate migration after confirming data is properly migrated
-- ALTER TABLE public.tenants DROP COLUMN property_id;
-- ALTER TABLE public.payments DROP COLUMN property_id; 