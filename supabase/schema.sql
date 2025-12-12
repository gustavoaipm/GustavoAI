-- Enable necessary extensions
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Create custom types/enums
CREATE TYPE user_role AS ENUM ('LANDLORD', 'TENANT', 'ADMIN');
CREATE TYPE property_type AS ENUM ('APARTMENT', 'HOUSE', 'CONDO', 'TOWNHOUSE', 'COMMERCIAL');
CREATE TYPE property_status AS ENUM ('ACTIVE', 'INACTIVE', 'MAINTENANCE', 'UNAVAILABLE');
CREATE TYPE unit_status AS ENUM ('AVAILABLE', 'OCCUPIED', 'MAINTENANCE', 'UNAVAILABLE', 'RESERVED');
CREATE TYPE tenant_status AS ENUM ('ACTIVE', 'INACTIVE', 'EVICTED', 'MOVED_OUT');
CREATE TYPE payment_type AS ENUM ('RENT', 'SECURITY_DEPOSIT', 'LATE_FEE', 'MAINTENANCE_FEE', 'UTILITY_FEE');
CREATE TYPE payment_status AS ENUM ('PENDING', 'PAID', 'OVERDUE', 'CANCELLED');
CREATE TYPE maintenance_type AS ENUM ('CLEANING', 'REPAIR', 'INSPECTION', 'PEST_CONTROL', 'HVAC', 'PLUMBING', 'ELECTRICAL', 'LANDSCAPING', 'OTHER');
CREATE TYPE priority AS ENUM ('LOW', 'MEDIUM', 'HIGH', 'URGENT');
CREATE TYPE maintenance_status AS ENUM ('REQUESTED', 'SCHEDULED', 'IN_PROGRESS', 'COMPLETED', 'CANCELLED');
CREATE TYPE notification_type AS ENUM ('PAYMENT_DUE', 'PAYMENT_OVERDUE', 'MAINTENANCE_SCHEDULED', 'MAINTENANCE_COMPLETED', 'LEASE_EXPIRING', 'GENERAL');
CREATE TYPE blog_category AS ENUM ('Industry Insights', 'Investment Tips', 'Tenant Management', 'Maintenance', 'Technology', 'Tax & Finance');
CREATE TYPE utility_type AS ENUM ('ELECTRICITY', 'GAS', 'WATER', 'SEWER', 'TRASH', 'INTERNET', 'CABLE', 'OTHER');

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
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    name TEXT NOT NULL,
    address TEXT NOT NULL,
    city TEXT NOT NULL,
    state TEXT NOT NULL,
    zip_code TEXT NOT NULL,
    property_type property_type NOT NULL,
    total_units INTEGER DEFAULT 1,
    status property_status DEFAULT 'ACTIVE',
    description TEXT,
    images TEXT[] DEFAULT '{}',
    owner_id UUID REFERENCES public.users(id) ON DELETE CASCADE NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create units table
CREATE TABLE public.units (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
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

-- Create tenants table
CREATE TABLE public.tenants (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    user_id UUID REFERENCES public.users(id) ON DELETE CASCADE NOT NULL,
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
    unit_id UUID REFERENCES public.units(id) ON DELETE CASCADE NOT NULL,
    property_id UUID REFERENCES public.properties(id) ON DELETE CASCADE NOT NULL,
    landlord_id UUID REFERENCES public.users(id) ON DELETE CASCADE NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create payments table
CREATE TABLE public.payments (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    amount DECIMAL(10,2) NOT NULL,
    type payment_type NOT NULL,
    status payment_status DEFAULT 'PENDING',
    due_date DATE NOT NULL,
    paid_date DATE,
    late_fee DECIMAL(10,2) DEFAULT 0,
    description TEXT,
    stripe_payment_id TEXT,
    tenant_id UUID REFERENCES public.tenants(id) ON DELETE CASCADE NOT NULL,
    unit_id UUID REFERENCES public.units(id) ON DELETE CASCADE NOT NULL,
    landlord_id UUID REFERENCES public.users(id) ON DELETE CASCADE NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create maintenance table
CREATE TABLE public.maintenance (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
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
    unit_id UUID REFERENCES public.units(id) ON DELETE SET NULL,
    tenant_id UUID REFERENCES public.tenants(id) ON DELETE SET NULL,
    assigned_to_id UUID REFERENCES public.users(id) ON DELETE SET NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create notifications table
CREATE TABLE public.notifications (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    title TEXT NOT NULL,
    message TEXT NOT NULL,
    type notification_type NOT NULL,
    is_read BOOLEAN DEFAULT FALSE,
    user_id UUID REFERENCES public.users(id) ON DELETE CASCADE NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create vendors table
CREATE TABLE public.vendors (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
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

-- Create tenant invitations table
CREATE TABLE public.tenant_invitations (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    email TEXT NOT NULL,
    first_name TEXT NOT NULL,
    last_name TEXT NOT NULL,
    phone TEXT NOT NULL,
    date_of_birth DATE,
    emergency_contact TEXT,
    emergency_phone TEXT,
    lease_start DATE NOT NULL,
    lease_end DATE NOT NULL,
    rent_amount DECIMAL(10,2) NOT NULL,
    security_deposit DECIMAL(10,2) NOT NULL,
    unit_id UUID REFERENCES public.units(id) ON DELETE CASCADE NOT NULL,
    landlord_id UUID REFERENCES public.users(id) ON DELETE CASCADE NOT NULL,
    verification_token TEXT UNIQUE NOT NULL,
    expires_at TIMESTAMP WITH TIME ZONE NOT NULL,
    is_verified BOOLEAN DEFAULT FALSE,
    verified_at TIMESTAMP WITH TIME ZONE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create blog_articles table
CREATE TABLE public.blog_articles (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    title TEXT NOT NULL,
    slug TEXT UNIQUE NOT NULL,
    excerpt TEXT NOT NULL,
    content TEXT NOT NULL, -- Store full article content as plain text
    author TEXT NOT NULL DEFAULT 'GustavoAI Team',
    category blog_category NOT NULL,
    featured BOOLEAN DEFAULT FALSE,
    published BOOLEAN DEFAULT TRUE,
    published_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    read_time TEXT NOT NULL DEFAULT '5 min read',
    image_url TEXT,
    meta_description TEXT,
    tags TEXT[] DEFAULT '{}',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create utilities table
CREATE TABLE public.utilities (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    utility_name TEXT NOT NULL,
    utility_type utility_type NOT NULL,
    provider_name TEXT NOT NULL,
    provider_contact TEXT,
    account_number TEXT,
    unit_of_measurement TEXT NOT NULL, -- e.g., 'kWh', 'therms', 'gallons'
    rate_per_unit DECIMAL(10,4) DEFAULT 0,
    is_active BOOLEAN DEFAULT TRUE,
    unit_id UUID REFERENCES public.units(id) ON DELETE CASCADE NOT NULL,
    tenant_id UUID REFERENCES public.tenants(id) ON DELETE SET NULL,
    landlord_id UUID REFERENCES public.users(id) ON DELETE CASCADE NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create utility_bills table
CREATE TABLE public.utility_bills (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    utility_id UUID REFERENCES public.utilities(id) ON DELETE CASCADE NOT NULL,
    unit_id UUID REFERENCES public.units(id) ON DELETE CASCADE NOT NULL,
    tenant_id UUID REFERENCES public.tenants(id) ON DELETE SET NULL,
    billing_period_start DATE NOT NULL,
    billing_period_end DATE NOT NULL,
    usage_amount DECIMAL(12,4) NOT NULL,
    rate_per_unit DECIMAL(10,4) NOT NULL,
    base_charge DECIMAL(10,2) DEFAULT 0,
    taxes DECIMAL(10,2) DEFAULT 0,
    fees DECIMAL(10,2) DEFAULT 0,
    total_amount DECIMAL(10,2) NOT NULL,
    due_date DATE NOT NULL,
    paid_date DATE,
    is_paid BOOLEAN DEFAULT FALSE,
    notes TEXT,
    bill_image_url TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create indexes for better performance
CREATE INDEX idx_properties_owner_id ON public.properties(owner_id);
CREATE INDEX idx_units_property_id ON public.units(property_id);
CREATE INDEX idx_units_status ON public.units(status);
CREATE INDEX idx_tenants_unit_id ON public.tenants(unit_id);
CREATE INDEX idx_tenants_property_id ON public.tenants(property_id);
CREATE INDEX idx_tenants_landlord_id ON public.tenants(landlord_id);
CREATE INDEX idx_tenants_user_id ON public.tenants(user_id);
CREATE INDEX idx_payments_tenant_id ON public.payments(tenant_id);
CREATE INDEX idx_payments_unit_id ON public.payments(unit_id);
CREATE INDEX idx_payments_status ON public.payments(status);
CREATE INDEX idx_maintenance_property_id ON public.maintenance(property_id);
CREATE INDEX idx_maintenance_unit_id ON public.maintenance(unit_id);
CREATE INDEX idx_maintenance_status ON public.maintenance(status);
CREATE INDEX idx_notifications_user_id ON public.notifications(user_id);
CREATE INDEX idx_notifications_is_read ON public.notifications(is_read);
CREATE INDEX idx_tenant_invitations_email ON public.tenant_invitations(email);
CREATE INDEX idx_tenant_invitations_token ON public.tenant_invitations(verification_token);
CREATE INDEX idx_tenant_invitations_landlord_id ON public.tenant_invitations(landlord_id);
CREATE INDEX idx_blog_articles_slug ON public.blog_articles(slug);
CREATE INDEX idx_blog_articles_published ON public.blog_articles(published);
CREATE INDEX idx_blog_articles_category ON public.blog_articles(category);
CREATE INDEX idx_blog_articles_featured ON public.blog_articles(featured);
CREATE INDEX idx_blog_articles_published_at ON public.blog_articles(published_at DESC);
CREATE INDEX idx_utilities_unit_id ON public.utilities(unit_id);
CREATE INDEX idx_utilities_tenant_id ON public.utilities(tenant_id);
CREATE INDEX idx_utilities_landlord_id ON public.utilities(landlord_id);
CREATE INDEX idx_utilities_type ON public.utilities(utility_type);
CREATE INDEX idx_utility_bills_utility_id ON public.utility_bills(utility_id);
CREATE INDEX idx_utility_bills_unit_id ON public.utility_bills(unit_id);
CREATE INDEX idx_utility_bills_tenant_id ON public.utility_bills(tenant_id);
CREATE INDEX idx_utility_bills_due_date ON public.utility_bills(due_date);
CREATE INDEX idx_utility_bills_billing_period ON public.utility_bills(billing_period_start, billing_period_end);

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
CREATE TRIGGER update_units_updated_at BEFORE UPDATE ON public.units FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_tenants_updated_at BEFORE UPDATE ON public.tenants FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_payments_updated_at BEFORE UPDATE ON public.payments FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_maintenance_updated_at BEFORE UPDATE ON public.maintenance FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_vendors_updated_at BEFORE UPDATE ON public.vendors FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_tenant_invitations_updated_at BEFORE UPDATE ON public.tenant_invitations FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_blog_articles_updated_at BEFORE UPDATE ON public.blog_articles FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_utilities_updated_at BEFORE UPDATE ON public.utilities FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_utility_bills_updated_at BEFORE UPDATE ON public.utility_bills FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- Row Level Security (RLS) policies

-- Enable RLS on all tables
ALTER TABLE public.users ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.properties ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.units ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.tenants ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.payments ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.maintenance ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.notifications ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.vendors ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.tenant_invitations ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.blog_articles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.utilities ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.utility_bills ENABLE ROW LEVEL SECURITY;

-- Users policies
CREATE POLICY "Users can view their own profile" ON public.users
    FOR SELECT USING (auth.uid() = id);

CREATE POLICY "Users can update their own profile" ON public.users
    FOR UPDATE USING (auth.uid() = id);

CREATE POLICY "Users can insert their own profile" ON public.users
    FOR INSERT WITH CHECK (auth.uid() = id);

CREATE POLICY "Allow trigger function to insert user profiles" ON public.users
    FOR INSERT WITH CHECK (true);

-- Properties policies
CREATE POLICY "Landlords can view their own properties" ON public.properties
    FOR SELECT USING (auth.uid() = owner_id);

CREATE POLICY "Landlords can insert their own properties" ON public.properties
    FOR INSERT WITH CHECK (auth.uid() = owner_id);

CREATE POLICY "Landlords can update their own properties" ON public.properties
    FOR UPDATE USING (auth.uid() = owner_id);

CREATE POLICY "Landlords can delete their own properties" ON public.properties
    FOR DELETE USING (auth.uid() = owner_id);

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

-- Tenants policies
CREATE POLICY "Landlords can view tenants of their units" ON public.tenants
    FOR SELECT USING (
        landlord_id = auth.uid() OR EXISTS (
            SELECT 1 FROM public.units u 
            JOIN public.properties p ON u.property_id = p.id 
            WHERE u.id = tenants.unit_id AND p.owner_id = auth.uid()
        )
    );

CREATE POLICY "Landlords can insert tenants for their units" ON public.tenants
    FOR INSERT WITH CHECK (
        landlord_id = auth.uid() OR EXISTS (
            SELECT 1 FROM public.units u 
            JOIN public.properties p ON u.property_id = p.id 
            WHERE u.id = tenants.unit_id AND p.owner_id = auth.uid()
        )
    );

CREATE POLICY "Landlords can update tenants of their units" ON public.tenants
    FOR UPDATE USING (
        landlord_id = auth.uid() OR EXISTS (
            SELECT 1 FROM public.units u 
            JOIN public.properties p ON u.property_id = p.id 
            WHERE u.id = tenants.unit_id AND p.owner_id = auth.uid()
        )
    );

CREATE POLICY "Landlords can delete tenants of their units" ON public.tenants
    FOR DELETE USING (
        landlord_id = auth.uid() OR EXISTS (
            SELECT 1 FROM public.units u 
            JOIN public.properties p ON u.property_id = p.id 
            WHERE u.id = tenants.unit_id AND p.owner_id = auth.uid()
        )
    );

-- Payments policies
CREATE POLICY "Landlords can view payments for their units" ON public.payments
    FOR SELECT USING (EXISTS (
        SELECT 1 FROM public.units u 
        JOIN public.properties p ON u.property_id = p.id 
        WHERE u.id = payments.unit_id AND p.owner_id = auth.uid()
    ));

CREATE POLICY "Landlords can insert payments for their units" ON public.payments
    FOR INSERT WITH CHECK (EXISTS (
        SELECT 1 FROM public.units u 
        JOIN public.properties p ON u.property_id = p.id 
        WHERE u.id = payments.unit_id AND p.owner_id = auth.uid()
    ));

CREATE POLICY "Landlords can update payments for their units" ON public.payments
    FOR UPDATE USING (EXISTS (
        SELECT 1 FROM public.units u 
        JOIN public.properties p ON u.property_id = p.id 
        WHERE u.id = payments.unit_id AND p.owner_id = auth.uid()
    ));

-- Maintenance policies
CREATE POLICY "Landlords can view maintenance for their properties and units" ON public.maintenance
    FOR SELECT USING (auth.uid() = assigned_to_id OR EXISTS (
        SELECT 1 FROM public.properties WHERE id = maintenance.property_id AND owner_id = auth.uid()
    ) OR EXISTS (
        SELECT 1 FROM public.units u 
        JOIN public.properties p ON u.property_id = p.id 
        WHERE u.id = maintenance.unit_id AND p.owner_id = auth.uid()
    ));

CREATE POLICY "Landlords can insert maintenance for their properties and units" ON public.maintenance
    FOR INSERT WITH CHECK (EXISTS (
        SELECT 1 FROM public.properties WHERE id = maintenance.property_id AND owner_id = auth.uid()
    ) OR EXISTS (
        SELECT 1 FROM public.units u 
        JOIN public.properties p ON u.property_id = p.id 
        WHERE u.id = maintenance.unit_id AND p.owner_id = auth.uid()
    ));

CREATE POLICY "Landlords can update maintenance for their properties and units" ON public.maintenance
    FOR UPDATE USING (auth.uid() = assigned_to_id OR EXISTS (
        SELECT 1 FROM public.properties WHERE id = maintenance.property_id AND owner_id = auth.uid()
    ) OR EXISTS (
        SELECT 1 FROM public.units u 
        JOIN public.properties p ON u.property_id = p.id 
        WHERE u.id = maintenance.unit_id AND p.owner_id = auth.uid()
    ));

-- Notifications policies
CREATE POLICY "Users can view their own notifications" ON public.notifications
    FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can update their own notifications" ON public.notifications
    FOR UPDATE USING (auth.uid() = user_id);

-- Vendors policies (read-only for now, can be expanded)
CREATE POLICY "Anyone can view vendors" ON public.vendors
    FOR SELECT USING (true);

-- Tenant invitation policies
CREATE POLICY "Tenant invitations are viewable by landlord" ON public.tenant_invitations
    FOR SELECT USING (landlord_id = auth.uid());

CREATE POLICY "Tenant invitations are insertable by landlord" ON public.tenant_invitations
    FOR INSERT WITH CHECK (landlord_id = auth.uid());

CREATE POLICY "Tenant invitations are updatable by landlord" ON public.tenant_invitations
    FOR UPDATE USING (landlord_id = auth.uid());

CREATE POLICY "Tenant invitations are deletable by landlord" ON public.tenant_invitations
    FOR DELETE USING (landlord_id = auth.uid());

-- Allow tenants to view their own invitation by token (for verification)
CREATE POLICY "Tenant invitations are viewable by token" ON public.tenant_invitations
    FOR SELECT USING (true); -- This will be filtered by token in the application

-- Blog articles policies
CREATE POLICY "Blog articles are publicly readable" ON public.blog_articles
    FOR SELECT USING (published = true);

-- Allow admin users to manage blog articles (you can customize this based on your admin role logic)
CREATE POLICY "Admins can manage blog articles" ON public.blog_articles
    FOR ALL USING (true); -- You may want to add proper admin role checking here

-- Utilities policies
CREATE POLICY "Landlords can view utilities for their units" ON public.utilities
    FOR SELECT USING (EXISTS (
        SELECT 1 FROM public.units u 
        JOIN public.properties p ON u.property_id = p.id 
        WHERE u.id = utilities.unit_id AND p.owner_id = auth.uid()
    ));

CREATE POLICY "Landlords can insert utilities for their units" ON public.utilities
    FOR INSERT WITH CHECK (EXISTS (
        SELECT 1 FROM public.units u 
        JOIN public.properties p ON u.property_id = p.id 
        WHERE u.id = utilities.unit_id AND p.owner_id = auth.uid()
    ));

CREATE POLICY "Landlords can update utilities for their units" ON public.utilities
    FOR UPDATE USING (EXISTS (
        SELECT 1 FROM public.units u 
        JOIN public.properties p ON u.property_id = p.id 
        WHERE u.id = utilities.unit_id AND p.owner_id = auth.uid()
    ));

CREATE POLICY "Landlords can delete utilities for their units" ON public.utilities
    FOR DELETE USING (EXISTS (
        SELECT 1 FROM public.units u 
        JOIN public.properties p ON u.property_id = p.id 
        WHERE u.id = utilities.unit_id AND p.owner_id = auth.uid()
    ));

-- Utility bills policies
CREATE POLICY "Landlords can view utility bills for their units" ON public.utility_bills
    FOR SELECT USING (EXISTS (
        SELECT 1 FROM public.units u 
        JOIN public.properties p ON u.property_id = p.id 
        WHERE u.id = utility_bills.unit_id AND p.owner_id = auth.uid()
    ));

CREATE POLICY "Landlords can insert utility bills for their units" ON public.utility_bills
    FOR INSERT WITH CHECK (EXISTS (
        SELECT 1 FROM public.units u 
        JOIN public.properties p ON u.property_id = p.id 
        WHERE u.id = utility_bills.unit_id AND p.owner_id = auth.uid()
    ));

CREATE POLICY "Landlords can update utility bills for their units" ON public.utility_bills
    FOR UPDATE USING (EXISTS (
        SELECT 1 FROM public.units u 
        JOIN public.properties p ON u.property_id = p.id 
        WHERE u.id = utility_bills.unit_id AND p.owner_id = auth.uid()
    ));

CREATE POLICY "Landlords can delete utility bills for their units" ON public.utility_bills
    FOR DELETE USING (EXISTS (
        SELECT 1 FROM public.units u 
        JOIN public.properties p ON u.property_id = p.id 
        WHERE u.id = utility_bills.unit_id AND p.owner_id = auth.uid()
    ));

-- Note: User creation is now handled manually in the API
-- No trigger needed for automatic public.users creation 