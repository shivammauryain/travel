# Sports Travel - Client Application

A modern, responsive web application built with Next.js for booking premium sports travel experiences worldwide. This platform connects sports enthusiasts with exclusive events, VIP packages, and curated travel experiences.

## Features

### For Users
- **Browse Events & Packages**: Discover premium sports events and travel packages across different tiers (Economy, Basic, Standard, Premium)
- **Easy Booking**: Simple lead form with package selection and travel details
- **Responsive Design**: Seamless experience across all devices
- **Interactive UI**: Smooth animations and modern interface using Framer Motion
- **Contact Form**: Get in touch for custom quotes and inquiries

### For Admins
- **Comprehensive Dashboard**: Real-time analytics with revenue tracking, lead management, and quote overview
- **Lead Management**: View, filter, and manage all customer inquiries
- **Event Management**: Create and manage sports events
- **Package Management**: Configure travel packages with pricing tiers
- **Quote System**: Generate and track custom quotes
- **Authentication**: Secure admin access with JWT-based authentication

## Tech Stack

- **Framework**: Next.js 16.0.5 (with Turbopack)
- **Language**: TypeScript
- **Styling**: Tailwind CSS 4.0
- **Forms**: React Hook Form + Zod validation
- **Animations**: Framer Motion
- **Icons**: Lucide React
- **Notifications**: React Hot Toast
- **HTTP Client**: Axios

## Getting Started

### Prerequisites
- Node.js 18.x or 20.x
- npm or yarn

### Installation

1. Clone the repository:
```bash
git clone https://github.com/shivammauryain/travel.git
cd travel/client
```

2. Install dependencies:
```bash
npm install
```

3. Set up environment variables:
Create a `.env.local` file in the root directory:
```env
NEXT_PUBLIC_API_URL=http://localhost:5000/api
```

For production, use your deployed API URL:
```env
NEXT_PUBLIC_API_URL=https://sports-travel-backend-seven.vercel.app/api
```

4. Run the development server:
```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) to view the application.

## Available Scripts

- `npm run dev` - Start development server with Turbopack
- `npm run build` - Build for production
- `npm start` - Start production server
- `npm run lint` - Run ESLint

## Project Structure

```
client/
├── app/                      # Next.js app directory
│   ├── (root)/              # Public pages
│   │   └── page.tsx         # Homepage
│   ├── (auth)/              # Authentication pages
│   │   ├── login/           # Login page
│   │   └── register/        # Registration page
│   ├── admin/               # Admin dashboard
│   │   ├── events/          # Event management
│   │   ├── leads/           # Lead management
│   │   ├── packages/        # Package management
│   │   └── quotes/          # Quote management
│   └── user/                # User dashboard
├── src/
│   ├── components/          # Reusable components
│   │   ├── common/          # Common components
│   │   ├── sections/        # Page sections
│   │   └── ui/              # UI components
│   ├── contexts/            # React contexts
│   ├── layout/              # Layout components
│   ├── lib/                 # Utilities and helpers
│   └── types/               # TypeScript types
└── public/                  # Static assets
```

## Key Components

### User-Facing Components
- **Hero**: Landing page hero section with call-to-action
- **TopPackages**: Showcase of premium travel packages
- **FeaturedEvent**: Highlighted sports event
- **HowItWorks**: Step-by-step booking process
- **WhyChooseUs**: Value propositions
- **Contact**: Contact form with package selection

### Admin Components
- **Dashboard**: Overview with stats and charts
- **LeadTable**: Manage customer inquiries
- **EventManager**: Create and edit events
- **PackageManager**: Configure travel packages
- **QuoteManager**: Handle custom quotes

## Authentication

The application uses JWT-based authentication with the following flows:

- **Registration**: Create new admin accounts
- **Login**: Secure login with credentials
- **Protected Routes**: Admin dashboard requires authentication
- **Token Management**: Automatic token refresh and storage

## Form Validation

All forms use Zod schema validation with React Hook Form:

- Email format validation
- Password strength requirements
- Required field checking
- Number input coercion
- Date validation (future dates for travel)

## Deployment

### Vercel (Recommended)

1. Push your code to GitHub
2. Import project in Vercel
3. Add environment variable:
   - `NEXT_PUBLIC_API_URL`: Your API endpoint
4. Deploy!

The application is configured for automatic deployments on push to main branch.

## Environment Variables

| Variable | Description | Example |
|----------|-------------|---------|
| `NEXT_PUBLIC_API_URL` | Backend API URL | `https://sports-travel-backend-seven.vercel.app/api` |

## Browser Support

- Chrome (latest)
- Firefox (latest)
- Safari (latest)
- Edge (latest)

## Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## License

This project is licensed under the MIT License.

## Author

**Shivam Maurya**

## Acknowledgments

- Next.js team for the amazing framework
- Vercel for hosting
- All contributors and supporters
