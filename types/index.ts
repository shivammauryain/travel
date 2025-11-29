export interface LeadFormData {
    name: string;
    email: string;
    phone: string;
    eventInterest?: string;
    message: string;
}

export interface Package {
    id: number;
    title: string;
    image: string;
    price: number;
    description: string;
    featured?: boolean;
}

export interface Stat {
    number: string;
    description: string;
    icon: string;
}

export interface Step {
    number: number;
    title: string;
    description: string;
    icon: string;
}

export interface ItineraryItem {
    id: number;
    title: string;
    description: string;
    image: string;
}
