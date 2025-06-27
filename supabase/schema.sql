-- Enable necessary extensions
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Create custom types/enums
CREATE TYPE user_role AS ENUM ('LANDLORD', 'TENANT', 'ADMIN');
CREATE TYPE property_type AS ENUM ('APARTMENT', 'HOUSE', 'CONDO', 'TOWNHOUSE', 'COMMERCIAL');
CREATE TYPE property_status AS ENUM ('AVAILABLE', 'OCCUPIED', 'MAINTENANCE', 'UNAVAILABLE');
CREATE TYPE tenant_status AS ENUM ('ACTIVE', 'INACTIVE', 'EVICTED', 'MOVED_OUT');
CREATE TYPE payment_type AS ENUM ('RENT', 'SECURITY_DEPOSIT', 'LATE_FEE', 'MAINTENANCE_FEE', 'UTILITY_FEE');
CREATE TYPE payment_status AS ENUM ('PENDING', 'PAID', 'OVERDUE', 'CANCELLED');
CREATE TYPE maintenance_type AS ENUM ('CLEANING', 'REPAIR', 'INSPECTION', 'PEST_CONTROL', 'HVAC', 'PLUMBING', 'ELECTRICAL', 'LANDSCAPING', 'OTHER');
CREATE TYPE priority AS ENUM ('LOW', 'MEDIUM', 'HIGH', 'URGENT');
CREATE TYPE maintenance_status AS ENUM ('REQUESTED', 'SCHEDULED', 'IN_PROGRESS', 'COMPLETED', 'CANCELLED');
CREATE TYPE notification_type AS ENUM ('PAYMENT_DUE', 'PAYMENT_OVERDUE', 'MAINTENANCE_SCHEDULED', 'MAINTENANCE_COMPLETED', 'LEASE_EXPIRING', 'GENERAL');

-- Create users table (extends Supabase auth.users)
CREATE TABLE public.users (
    id UUID REFERENCES auth.users(id) ON DELETE CASCADE PRIMARY KEY,
    email TEXT UNIQUE NOT NULL,
    first_name TEXT NOT NULL,
    last_name TEXT NOT NULL,
    phone TEXT,
    role user_role DEFAULT 'LANDLORD',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create properties table
CREATE TABLE public.properties (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    name TEXT NOT NULL,
    address TEXT NOT NULL,
    city TEXT NOT NULL,
    state TEXT NOT NULL,
    zip_code TEXT NOT NULL,
    property_type property_type NOT NULL,
    bedrooms INTEGER NOT NULL,
    bathrooms INTEGER NOT NULL,
    square_feet INTEGER,
    rent_amount DECIMAL(10,2) NOT NULL,
    status property_status DEFAULT 'AVAILABLE',
    description TEXT,
    images TEXT[] DEFAULT '{}',
    owner_id UUID REFERENCES public.users(id) ON DELETE CASCADE NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create tenants table
CREATE TABLE public.tenants (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    email TEXT UNIQUE NOT NULL,
    first_name TEXT NOT NULL,
    last_name TEXT NOT NULL,
    phone TEXT NOT NULL,
    date_of_birth DATE,
    emergency_contact TEXT,
    emergency_phone TEXT,
    status tenant_status DEFAULT 'ACTIVE',
    lease_start DATE NOT NULL,
    lease_end DATE NOT NULL,
    rent_amount DECIMAL(10,2) NOT NULL,
    security_deposit DECIMAL(10,2) NOT NULL,
    property_id UUID REFERENCES public.properties(id) ON DELETE CASCADE NOT NULL,
    landlord_id UUID REFERENCES public.users(id) ON DELETE CASCADE NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create payments table
CREATE TABLE public.payments (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    amount DECIMAL(10,2) NOT NULL,
    type payment_type NOT NULL,
    status payment_status DEFAULT 'PENDING',
    due_date DATE NOT NULL,
    paid_date DATE,
    late_fee DECIMAL(10,2) DEFAULT 0,
    description TEXT,
    stripe_payment_id TEXT,
    tenant_id UUID REFERENCES public.tenants(id) ON DELETE CASCADE NOT NULL,
    property_id UUID REFERENCES public.properties(id) ON DELETE CASCADE NOT NULL,
    landlord_id UUID REFERENCES public.users(id) ON DELETE CASCADE NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create maintenance table
CREATE TABLE public.maintenance (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    title TEXT NOT NULL,
    description TEXT NOT NULL,
    type maintenance_type NOT NULL,
    priority priority DEFAULT 'MEDIUM',
    status maintenance_status DEFAULT 'REQUESTED',
    scheduled_date TIMESTAMP WITH TIME ZONE,
    completed_date TIMESTAMP WITH TIME ZONE,
    cost DECIMAL(10,2),
    vendor_name TEXT,
    vendor_phone TEXT,
    vendor_email TEXT,
    notes TEXT,
    images TEXT[] DEFAULT '{}',
    property_id UUID REFERENCES public.properties(id) ON DELETE CASCADE NOT NULL,
    tenant_id UUID REFERENCES public.tenants(id) ON DELETE SET NULL,
    assigned_to_id UUID REFERENCES public.users(id) ON DELETE SET NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create notifications table
CREATE TABLE public.notifications (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    title TEXT NOT NULL,
    message TEXT NOT NULL,
    type notification_type NOT NULL,
    is_read BOOLEAN DEFAULT FALSE,
    user_id UUID REFERENCES public.users(id) ON DELETE CASCADE NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create vendors table
CREATE TABLE public.vendors (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    name TEXT NOT NULL,
    email TEXT,
    phone TEXT NOT NULL,
    services TEXT[] NOT NULL,
    rating DECIMAL(3,2),
    is_verified BOOLEAN DEFAULT FALSE,
    address TEXT,
    city TEXT,
    state TEXT,
    zip_code TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create indexes for better performance
CREATE INDEX idx_properties_owner_id ON public.properties(owner_id);
CREATE INDEX idx_tenants_property_id ON public.tenants(property_id);
CREATE INDEX idx_tenants_landlord_id ON public.tenants(landlord_id);
CREATE INDEX idx_payments_tenant_id ON public.payments(tenant_id);
CREATE INDEX idx_payments_property_id ON public.payments(property_id);
CREATE INDEX idx_payments_status ON public.payments(status);
CREATE INDEX idx_maintenance_property_id ON public.maintenance(property_id);
CREATE INDEX idx_maintenance_status ON public.maintenance(status);
CREATE INDEX idx_notifications_user_id ON public.notifications(user_id);
CREATE INDEX idx_notifications_is_read ON public.notifications(is_read);

-- Create updated_at trigger function
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Create triggers for updated_at
CREATE TRIGGER update_users_updated_at BEFORE UPDATE ON public.users FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_properties_updated_at BEFORE UPDATE ON public.properties FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_tenants_updated_at BEFORE UPDATE ON public.tenants FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_payments_updated_at BEFORE UPDATE ON public.payments FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_maintenance_updated_at BEFORE UPDATE ON public.maintenance FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_vendors_updated_at BEFORE UPDATE ON public.vendors FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- Row Level Security (RLS) policies

-- Enable RLS on all tables
ALTER TABLE public.users ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.properties ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.tenants ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.payments ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.maintenance ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.notifications ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.vendors ENABLE ROW LEVEL SECURITY;

-- Users policies
CREATE POLICY "Users can view their own profile" ON public.users
    FOR SELECT USING (auth.uid() = id);

CREATE POLICY "Users can update their own profile" ON public.users
    FOR UPDATE USING (auth.uid() = id);

-- Properties policies
CREATE POLICY "Landlords can view their own properties" ON public.properties
    FOR SELECT USING (auth.uid() = owner_id);

CREATE POLICY "Landlords can insert their own properties" ON public.properties
    FOR INSERT WITH CHECK (auth.uid() = owner_id);

CREATE POLICY "Landlords can update their own properties" ON public.properties
    FOR UPDATE USING (auth.uid() = owner_id);

CREATE POLICY "Landlords can delete their own properties" ON public.properties
    FOR DELETE USING (auth.uid() = owner_id);

-- Tenants policies
CREATE POLICY "Landlords can view tenants of their properties" ON public.tenants
    FOR SELECT USING (auth.uid() = landlord_id);

CREATE POLICY "Landlords can insert tenants for their properties" ON public.tenants
    FOR INSERT WITH CHECK (auth.uid() = landlord_id);

CREATE POLICY "Landlords can update tenants of their properties" ON public.tenants
    FOR UPDATE USING (auth.uid() = landlord_id);

CREATE POLICY "Landlords can delete tenants of their properties" ON public.tenants
    FOR DELETE USING (auth.uid() = landlord_id);

-- Payments policies
CREATE POLICY "Landlords can view payments for their properties" ON public.payments
    FOR SELECT USING (auth.uid() = landlord_id);

CREATE POLICY "Landlords can insert payments for their properties" ON public.payments
    FOR INSERT WITH CHECK (auth.uid() = landlord_id);

CREATE POLICY "Landlords can update payments for their properties" ON public.payments
    FOR UPDATE USING (auth.uid() = landlord_id);

-- Maintenance policies
CREATE POLICY "Landlords can view maintenance for their properties" ON public.maintenance
    FOR SELECT USING (auth.uid() = assigned_to_id OR EXISTS (
        SELECT 1 FROM public.properties WHERE id = maintenance.property_id AND owner_id = auth.uid()
    ));

CREATE POLICY "Landlords can insert maintenance for their properties" ON public.maintenance
    FOR INSERT WITH CHECK (EXISTS (
        SELECT 1 FROM public.properties WHERE id = maintenance.property_id AND owner_id = auth.uid()
    ));

CREATE POLICY "Landlords can update maintenance for their properties" ON public.maintenance
    FOR UPDATE USING (auth.uid() = assigned_to_id OR EXISTS (
        SELECT 1 FROM public.properties WHERE id = maintenance.property_id AND owner_id = auth.uid()
    ));

-- Notifications policies
CREATE POLICY "Users can view their own notifications" ON public.notifications
    FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can update their own notifications" ON public.notifications
    FOR UPDATE USING (auth.uid() = user_id);

-- Vendors policies (read-only for now, can be expanded)
CREATE POLICY "Anyone can view vendors" ON public.vendors
    FOR SELECT USING (true);

-- Create function to handle user creation
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
    INSERT INTO public.users (id, email, first_name, last_name, role)
    VALUES (
        NEW.id,
        NEW.email,
        COALESCE(NEW.raw_user_meta_data->>'first_name', ''),
        COALESCE(NEW.raw_user_meta_data->>'last_name', ''),
        COALESCE((NEW.raw_user_meta_data->>'role')::user_role, 'LANDLORD')
    );
    RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Create trigger for new user creation
CREATE TRIGGER on_auth_user_created
    AFTER INSERT ON auth.users
    FOR EACH ROW EXECUTE FUNCTION public.handle_new_user(); 