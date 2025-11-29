// Package data
export interface Package {
    id: number;
    title: string;
    image: string;
    price: number;
    description: string;
    featured?: boolean;
    tags?: string[];
    duration?: string;
    location?: string;
    inclusions?: string[];
}

export const packages: Package[] = [
    {
        id: 1,
        title: "F1 Monaco Grand Prix 2025",
        image: "https://images.unsplash.com/photo-1541443131876-44b03de101c5?w=800&q=80",
        price: 3499,
        description: "Experience the glitz and glamour of F1's most prestigious race from a private yacht.",
        tags: ["Motorsport", "Luxury", "Yacht"],
        duration: "4 Days",
        location: "Monte Carlo, Monaco",
        inclusions: ["4 Nights Stay", "Race Tickets", "Yacht Party", "Transport"]
    },
    {
        id: 2,
        title: "FIFA World Cup Finals 2026",
        image: "https://images.unsplash.com/photo-1579952363873-27f3bade9f55?w=800&q=80",
        price: 4299,
        description: "Witness history in the making with premium seats for the biggest match in football.",
        tags: ["Football", "Global Event", "Finals"],
        duration: "6 Days",
        location: "New York, USA",
        inclusions: ["5 Nights Stay", "Finals Tickets", "Fan Zone", "City Tour"]
    },
    {
        id: 3,
        title: "Wimbledon Championship 2025",
        image: "https://images.unsplash.com/photo-1554068865-24cecd4e34b8?w=800&q=80",
        price: 2799,
        description: "Enjoy strawberries and cream at Centre Court with exclusive hospitality access.",
        tags: ["Tennis", "Tradition", "VIP"],
        duration: "5 Days",
        location: "London, UK",
        inclusions: ["4 Nights Stay", "Centre Court", "Museum Tour", "Transport"]
    },
    {
        id: 4,
        title: "Super Bowl LX 2026",
        image: "https://images.unsplash.com/photo-1566577134770-3d85bb3a9cc4?w=800&q=80",
        price: 5499,
        description: "The ultimate American football experience with pre-game parties and halftime show.",
        tags: ["NFL", "Entertainment", "USA"],
        duration: "4 Days",
        location: "Santa Clara, USA",
        inclusions: ["3 Nights Stay", "Premium Seats", "Pre-game Party", "Transport"]
    },
    {
        id: 5,
        title: "The Masters 2025",
        image: "https://images.unsplash.com/photo-1587174486073-ae5e5cff23aa?w=800&q=80",
        price: 3899,
        description: "Walk the hallowed grounds of Augusta National and witness golf history.",
        tags: ["Golf", "Exclusive", "Major"],
        duration: "5 Days",
        location: "Augusta, USA",
        inclusions: ["4 Nights Stay", "Tournament Pass", "Hospitality", "Transport"]
    },
    {
        id: 6,
        title: "NBA Finals 2025",
        image: "https://images.unsplash.com/photo-1504450758481-7338eba7524a?w=800&q=80",
        price: 2999,
        description: "Courtside seats to see the world's best basketball players compete for the ring.",
        tags: ["Basketball", "Courtside", "Finals"],
        duration: "3 Days",
        location: "TBD, USA",
        inclusions: ["2 Nights Stay", "Courtside Seats", "Meet & Greet", "Transport"]
    },
];

export const featuredEvent: Package = {
    id: 7,
    title: "F1 Japanese Grand Prix 2025",
    image: "https://images.unsplash.com/photo-1603584173870-7f23fdae1b7a?w=1200&q=80",
    price: 3799,
    description: "4 nights in Tokyo + Suzuka Circuit tickets + cultural tours + traditional Ryokan stay",
    featured: true,
};

// Stats data
export interface Stat {
    number: string;
    description: string;
    icon: string;
}

export const stats: Stat[] = [
    {
        number: "500+",
        description: "Happy Travelers",
        icon: "users",
    },
    {
        number: "50+",
        description: "Events Covered",
        icon: "trophy",
    },
    {
        number: "4.9",
        description: "Average Rating",
        icon: "star",
    },
    {
        number: "100%",
        description: "Satisfaction Guaranteed",
        icon: "shield",
    },
];

// How it works steps
export interface Step {
    number: number;
    title: string;
    description: string;
    icon: string;
}

export const howItWorksSteps: Step[] = [
    {
        number: 1,
        title: "Choose Your Event",
        description: "Browse our curated selection of premium sporting events worldwide",
        icon: "calendar",
    },
    {
        number: 2,
        title: "Customize Package",
        description: "Select accommodations, tickets, and add-ons tailored to your preferences",
        icon: "settings",
    },
    {
        number: 3,
        title: "Book & Travel",
        description: "Confirm your booking and prepare for an unforgettable experience",
        icon: "plane",
    },
];

// Itinerary items
export interface ItineraryItem {
    id: number;
    title: string;
    description: string;
    image: string;
}

export const itineraryItems: ItineraryItem[] = [
    {
        id: 1,
        title: "Luxury Hotels",
        description: "5-star accommodations near venues",
        image: "https://images.unsplash.com/photo-1566073771259-6a8506099945?w=600&q=80",
    },
    {
        id: 2,
        title: "Premium Tickets",
        description: "Best seats in the house guaranteed",
        image: "https://images.unsplash.com/photo-1459749411175-04bf5292ceea?w=600&q=80",
    },
    {
        id: 3,
        title: "City Tours",
        description: "Guided tours of iconic landmarks",
        image: "https://images.unsplash.com/photo-1503220317375-aaad61436b1b?w=600&q=80",
    },
    {
        id: 4,
        title: "Fine Dining",
        description: "Reservations at top restaurants",
        image: "https://images.unsplash.com/photo-1414235077428-338989a2e8c0?w=600&q=80",
    },
    {
        id: 5,
        title: "Private Transport",
        description: "Comfortable transfers included",
        image: "https://images.unsplash.com/photo-1549317661-bd32c8ce0db2?w=600&q=80",
    },
    {
        id: 6,
        title: "VIP Experiences",
        description: "Exclusive meet & greets available",
        image: "https://images.unsplash.com/photo-1492684223066-81342ee5ff30?w=600&q=80",
    },
    {
        id: 7,
        title: "Travel Insurance",
        description: "Comprehensive coverage included",
        image: "https://images.unsplash.com/photo-1450101499163-c8848c66ca85?w=600&q=80",
    },
    {
        id: 8,
        title: "24/7 Support",
        description: "Concierge service throughout trip",
        image: "https://images.unsplash.com/photo-1516321318423-f06f85e504b3?w=600&q=80",
    },
];
