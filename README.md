# Sports Travel

A modern, responsive website for booking sports travel packages and experiences. Built with Next.js, featuring email integration for lead and contact forms.

## 🚀 Features

- **Responsive Design**: Fully responsive across all devices with mobile-first approach
- **Interactive Hero Section**: Animated hero with featured event card
- **Package Listings**: Curated sports travel packages with pricing and details
- **Lead Generation**: Modal-based lead forms with pre-filled templates
- **Contact Forms**: Professional contact forms with email and phone fields
- **Email Integration**: Automated email notifications using Gmail SMTP
- **WhatsApp Integration**: Direct WhatsApp contact button
- **Modern UI**: Clean, professional design with animations and gradients

## 🛠 Tech Stack

- **Framework**: Next.js 16.0.5 with App Router
- **Language**: TypeScript
- **Styling**: Tailwind CSS v4 with custom gradients
- **Animations**: Framer Motion
- **Forms**: React Hook Form with Zod validation
- **Email**: Nodemailer with Gmail SMTP
- **Icons**: Lucide React
- **Notifications**: React Hot Toast
- **Fonts**: Geist Sans & Mono

## 📁 Folder Structure

```
sports-travel/
├── app/                          # Next.js App Router
│   ├── api/                      # API Routes
│   │   ├── contact/              # Contact form endpoint
│   │   │   └── route.ts          # POST handler for contact submissions
│   │   └── leads/                # Lead form endpoint
│   │       └── route.ts          # POST handler for lead submissions
│   ├── globals.css               # Global Tailwind styles
│   ├── layout.tsx                # Root layout with metadata and providers
│   └── page.tsx                  # Home page component
├── components/                   # Reusable React components
│   ├── common/                   # Common components
│   │   ├── LeadForm.tsx          # Lead generation form with pre-filled templates
│   │   └── WhatsAppButton.tsx    # WhatsApp contact button
│   ├── sections/                 # Page sections
│   │   ├── Contact.tsx           # Contact section with form and gallery
│   │   ├── Hero.tsx              # Hero section with background and featured card
│   │   ├── HowItWorks.tsx        # Process explanation section
│   │   ├── SampleItinerary.tsx   # Sample itinerary showcase
│   │   ├── TopPackages.tsx       # Package listings section
│   │   └── WhyChooseUs.tsx       # Benefits section
│   └── ui/                       # UI components
│       ├── Button.tsx            # Reusable button component
│       ├── Card.tsx              # Card component for packages
│       ├── Input.tsx             # Form input component
│       └── Modal.tsx             # Modal component with animations
├── layout/                       # Layout components
│   ├── Footer.tsx                # Site footer
│   └── Header.tsx                # Navigation header
├── lib/                          # Utility libraries
│   ├── data.ts                   # Static data (packages, featured events)
│   └── utils.ts                  # Helper functions (price formatting)
├── public/                       # Static assets
├── types/                        # TypeScript type definitions
│   └── index.ts                  # Shared interfaces
├── .env.local.example            # Environment variables template
├── eslint.config.mjs             # ESLint configuration
├── next.config.ts                # Next.js configuration
├── package.json                  # Dependencies and scripts
├── postcss.config.mjs            # PostCSS configuration
├── README.md                     # This file
└── tsconfig.json                 # TypeScript configuration
```

## 🚀 Setup Instructions

### Prerequisites

- Node.js 18+ and npm/yarn/pnpm
- A Gmail account for email functionality

### Installation

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd sports-travel
   ```

2. **Install dependencies**
   ```bash
   npm install
   # or
   yarn install
   # or
   pnpm install
   ```

3. **Set up environment variables**
   ```bash
   cp .env.local.example .env.local
   ```

   Edit `.env.local` and add your Gmail credentials:
   ```env
   EMAIL_USER="your-email@gmail.com"
   EMAIL_PASS="your-gmail-app-password"
   RECEIVER_EMAIL="your-email@gmail.com"
   ```

   **Note**: For Gmail, you need to:
   - Enable 2-factor authentication
   - Generate an App Password (not your regular password)
   - Use the App Password in `EMAIL_PASS`

4. **Run the development server**
   ```bash
   npm run dev
   # or
   yarn dev
   # or
   pnpm dev
   ```

   Open [http://localhost:3000](http://localhost:3000) in your browser.

### Build for Production

```bash
npm run build
npm start
```

## 📡 API Documentation

### POST /api/contact

Handles contact form submissions.

**Request Body:**
```json
{
  "name": "string (min 2 chars)",
  "email": "valid email",
  "phone": "string (min 6 chars)",
  "eventType": "string (optional)",
  "message": "string (min 5 chars, optional)"
}
```

**Response:**
- Success: `{ "success": true, "message": "Thanks! We received your message..." }`
- Error: `{ "success": false, "error": "validation errors" }`

**Actions:**
- Sends email to `RECEIVER_EMAIL` with form data
- Sends confirmation email to user

### POST /api/leads

Handles lead form submissions.

**Request Body:**
```json
{
  "name": "string (min 2 chars)",
  "email": "valid email",
  "phone": "string (min 6 chars)",
  "eventInterest": "string (optional)",
  "message": "string (min 5 chars, optional)"
}
```

**Response:**
- Success: `{ "success": true, "message": "Thanks! We received your message..." }`
- Error: `{ "success": false, "error": "validation errors" }`

**Actions:**
- Sends email to `RECEIVER_EMAIL` with lead data
- Sends confirmation email to user

## 🧪 Testing

### Manual Testing

1. **Forms**: Submit contact and lead forms, check email delivery
2. **Responsiveness**: Test on various screen sizes
3. **Navigation**: Verify all links and buttons work

### API Testing with curl

```bash
# Test contact API
curl -X POST http://localhost:3000/api/contact \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Test User",
    "email": "test@example.com",
    "phone": "+91-9876543210",
    "message": "Test message"
  }'

# Test leads API
curl -X POST http://localhost:3000/api/leads \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Test Lead",
    "email": "lead@example.com",
    "phone": "+91-9876543210",
    "eventInterest": "F1 Grand Prix",
    "message": "Interested in premium package"
  }'
```

## 🚀 Deployment

### Vercel (Recommended)

1. Push to GitHub
2. Connect to Vercel
3. Add environment variables in Vercel dashboard
4. Deploy

### Other Platforms

The app can be deployed to any platform supporting Next.js:
- Netlify
- Railway
- DigitalOcean App Platform

Ensure environment variables are set in your deployment platform.

## 🤔 Assumptions Made

1. **Email Service**: Uses Gmail SMTP for email sending. Assumes user has Gmail account with 2FA enabled and App Password generated.

2. **Indian Market**: Placeholders and examples use Indian phone formats (+91) and cultural references.

3. **Static Data**: Package data is hardcoded in `lib/data.ts`. In production, this could be moved to a CMS or database.

4. **No Authentication**: No user authentication required - forms are public.

5. **Single Language**: English-only interface. No internationalization.

6. **No Database**: No persistent storage - all data handled via email. Could be extended with database integration.

7. **WhatsApp Integration**: Assumes WhatsApp Web/app is available for the contact button.

8. **Image Sources**: Uses Unsplash for demo images. In production, replace with licensed images.

## 📝 Development Notes

- Uses Next.js App Router for file-based routing
- TypeScript for type safety
- ESLint for code quality
- Tailwind for responsive styling
- Framer Motion for smooth animations
- React Hook Form + Zod for form validation
- Nodemailer for email functionality

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make changes
4. Test thoroughly
5. Submit a pull request

## 📄 License

This project is private and proprietary.</content>
<filePath">c:\Users\shiva\OneDrive\Documents\Desktop\Startups\sports-travel\README.md
#   t r a v e l  
 