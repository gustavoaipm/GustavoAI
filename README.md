# GustavoAI - AI-Powered Property Manager

An intelligent property management platform that automates tenant management, rent collection, and maintenance scheduling with AI assistance.

## 🚀 Features

### For Property Owners/Landlords
- **Automated Tenant Management**: Streamlined onboarding, communication, and payment tracking
- **Smart Rent Collection**: Automated payment reminders, late fee calculations, and secure online payments
- **AI-Powered Maintenance Scheduling**: Intelligent scheduling for cleaning, inspections, and repairs
- **Vendor Coordination**: Automatic vendor finding and communication for maintenance services
- **Comprehensive Analytics**: AI-generated insights on property performance and trends
- **Smart Notifications**: Intelligent alerts for important property events
- **Address Autocomplete**: Google Maps integration for accurate property addresses

### For Tenants
- **Easy Rent Payments**: Secure online payment processing
- **Maintenance Requests**: Simple maintenance request submission and tracking
- **Communication Portal**: Direct communication with property managers
- **Document Access**: Easy access to lease documents and payment history

## 🛠 Tech Stack

### Frontend
- **Next.js 14** - React framework with App Router
- **TypeScript** - Type safety and better developer experience
- **Tailwind CSS** - Utility-first CSS framework
- **React Hook Form** - Form handling with validation
- **Zod** - Schema validation
- **Supabase Auth** - Authentication and user management
- **React Query** - Server state management
- **Heroicons** - Beautiful icons
- **Recharts** - Data visualization

### Backend (Supabase)
- **Supabase** - Backend-as-a-Service platform
- **PostgreSQL** - Primary database
- **Row Level Security (RLS)** - Data security and access control
- **Real-time subscriptions** - Live data updates
- **Edge Functions** - Serverless API endpoints
- **Storage** - File uploads and management

### AI & Integrations
- **OpenAI API** - AI-powered automation and insights
- **Twilio** - SMS notifications
- **Stripe** - Payment processing
- **Google Calendar API** - Scheduling integration
- **SendGrid** - Email notifications

## 📁 Project Structure

```
GustavoAI/
├── app/                    # Next.js frontend (App Router)
│   ├── globals.css        # Global styles
│   ├── layout.tsx         # Root layout
│   └── page.tsx           # Homepage
├── lib/                   # Utility functions
│   ├── supabase.ts        # Supabase client configuration
│   └── supabase-utils.ts  # Database utilities and helpers
├── components/            # Reusable React components
├── types/                 # TypeScript type definitions
├── supabase/              # Supabase configuration
│   └── schema.sql         # Database schema
└── package.json           # Frontend dependencies
```

## 🚀 Getting Started

### Prerequisites
- Node.js 18+ 
- Supabase account
- Google Maps API key (for address autocomplete)
- npm or yarn

### 1. Set up Supabase

1. **Create a Supabase project**:
   - Go to [supabase.com](https://supabase.com)
   - Create a new project
   - Note your project URL and anon key

2. **Set up the database schema**:
   - Go to your Supabase dashboard
   - Navigate to SQL Editor
   - Copy and paste the contents of `supabase/schema.sql`
   - Run the SQL to create all tables and policies

### 2. Set up Google Maps API (for address autocomplete)

1. **Create a Google Cloud project**:
   - Go to [Google Cloud Console](https://console.cloud.google.com/)
   - Create a new project or select an existing one

2. **Enable the Places API**:
   - In the Google Cloud Console, go to "APIs & Services" > "Library"
   - Search for "Places API" and enable it

3. **Create API credentials**:
   - Go to "APIs & Services" > "Credentials"
   - Click "Create Credentials" > "API Key"
   - Copy your API key

4. **Restrict the API key** (recommended):
   - Click on your API key to edit it
   - Under "Application restrictions", select "HTTP referrers"
   - Add your domain (e.g., `localhost:3000/*` for development)
   - Under "API restrictions", select "Restrict key" and choose "Places API"

### 3. Frontend Setup

1. **Install dependencies**:
   ```bash
   npm install
   ```

2. **Set up environment variables**:
   Create a `.env.local` file in the root directory:
   ```env
   NEXT_PUBLIC_SUPABASE_URL=your-supabase-project-url
   NEXT_PUBLIC_SUPABASE_ANON_KEY=your-supabase-anon-key
   NEXT_PUBLIC_GOOGLE_MAPS_API_KEY=your-google-maps-api-key
   ```

3. **Start development server**:
   ```bash
   npm run dev
   ```

4. **Open your browser**:
   Navigate to [http://localhost:3000](http://localhost:3000)

## 🔧 Environment Variables

### Frontend (.env.local)
```env
NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key
NEXT_PUBLIC_GOOGLE_MAPS_API_KEY=your-google-maps-api-key

# Optional: AI and integrations
NEXT_PUBLIC_OPENAI_API_KEY=your-openai-api-key
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=your-stripe-publishable-key
```

## 📊 Database Schema

The application uses Supabase (PostgreSQL) with the following main entities:

- **Users**: Property owners, tenants, and administrators
- **Properties**: Property details, addresses, and specifications
- **Tenants**: Tenant information and lease details
- **Payments**: Rent payments, security deposits, and fees
- **Maintenance**: Maintenance requests and scheduling
- **Notifications**: System notifications and alerts
- **Vendors**: Service providers and contractors

### Key Features:
- **Row Level Security (RLS)**: Automatic data access control
- **Real-time subscriptions**: Live updates across the app
- **Automatic user profiles**: Created when users sign up
- **Optimized indexes**: Fast query performance

## 🔌 API Usage

With Supabase, you can interact with the database directly from the frontend:

```typescript
import { supabase } from '@/lib/supabase'

// Get all properties for the current user
const { data: properties, error } = await supabase
  .from('properties')
  .select('*')

// Create a new property
const { data, error } = await supabase
  .from('properties')
  .insert({
    name: 'Sunset Apartments',
    address: '123 Main St',
    city: 'Los Angeles',
    state: 'CA',
    zip_code: '90210',
    property_type: 'APARTMENT',
    bedrooms: 2,
    bathrooms: 1,
    rent_amount: 2500,
    owner_id: user.id
  })
```

## 🤖 AI Features

### Automated Tasks
- **Rent Reminders**: AI sends personalized payment reminders
- **Maintenance Scheduling**: Intelligent scheduling based on priority and availability
- **Vendor Communication**: Automated vendor outreach and quote collection
- **Document Generation**: AI-powered lease and report generation

### Smart Insights
- **Payment Predictions**: Predict late payments and suggest interventions
- **Maintenance Forecasting**: Predict maintenance needs based on property age and usage
- **Market Analysis**: Provide rental market insights and pricing recommendations
- **Tenant Behavior Analysis**: Identify patterns and suggest improvements

## 🔒 Security Features

- **Row Level Security (RLS)**: Automatic data access control based on user roles
- **Supabase Auth**: Secure authentication with email/password, OAuth, and magic links
- **Automatic user profiles**: User data is automatically created and managed
- **Real-time security**: All data access is validated in real-time
- **Built-in protection**: SQL injection protection, XSS prevention, and more

## 🔧 Development

```bash
# Type checking
npm run type-check

# Linting
npm run lint
```

## 📦 Deployment

### Frontend (Vercel)
1. Connect your GitHub repository to Vercel
2. Configure environment variables in Vercel dashboard
3. Deploy automatically on push

### Backend (Supabase)
- Your Supabase project is automatically deployed and scaled
- No additional deployment needed for the backend

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🆘 Support

For support, email support@gustavoai.com or create an issue in this repository.

## 🗺 Roadmap

### Phase 1 (Current)
- [x] Supabase backend setup
- [x] Authentication system
- [x] Property management CRUD
- [x] Database schema design
- [ ] Tenant management
- [ ] Payment processing

### Phase 2
- [ ] AI-powered automation
- [ ] SMS/Email notifications
- [ ] Maintenance scheduling
- [ ] Vendor management

### Phase 3
- [ ] Advanced analytics
- [ ] Mobile app
- [ ] Multi-language support
- [ ] Advanced AI features

## 🎯 Benefits of Using Supabase

### For Development
- **Faster Development**: No need to build custom backend APIs
- **Built-in Authentication**: Complete auth system with multiple providers
- **Real-time Features**: Live updates out of the box
- **Type Safety**: Auto-generated TypeScript types
- **Database Management**: Visual interface for data management

### For Production
- **Automatic Scaling**: Handles traffic spikes automatically
- **Global CDN**: Fast loading times worldwide
- **Built-in Security**: RLS, auth, and security best practices
- **Monitoring**: Built-in analytics and monitoring
- **Backup & Recovery**: Automatic backups and point-in-time recovery

---

Built with ❤️ by the GustavoAI Team