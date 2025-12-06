'use client';

import { useState } from 'react';
import Navbar from '@/layout/Header';
import Hero from '@/components/sections/Hero';
import TopPackages from '@/components/sections/TopPackages';
import WhyChooseUs from '@/components/sections/WhyChooseUs';
import HowItWorks from '@/components/sections/HowItWorks';
import SampleItinerary from '@/components/sections/SampleItinerary';
import Footer from '@/layout/Footer';
import WhatsAppButton from '@/components/common/WhatsAppButton';
import Modal from '@/components/ui/Modal';
import LeadForm from '@/components/common/LeadForm';
import Contact from '@/components/sections/Contact';

export default function Home() {
    const [isLeadFormOpen, setIsLeadFormOpen] = useState(false);
    const [preFilledEvent, setPreFilledEvent] = useState<string | undefined>();
    const [selectedPackageId, setSelectedPackageId] = useState<string | undefined>();
    const [selectedEventId, setSelectedEventId] = useState<string | undefined>();

    const handleOpenLeadForm = (eventTitle?: string, packageId?: string, eventId?: string) => {
        setPreFilledEvent(eventTitle);
        setSelectedPackageId(packageId);
        setSelectedEventId(eventId);
        setIsLeadFormOpen(true);
    };

    const handleCloseLeadForm = () => {
        setIsLeadFormOpen(false);
        setPreFilledEvent(undefined);
        setSelectedPackageId(undefined);
        setSelectedEventId(undefined);
    };

    return (
        <main className="min-h-screen">
            <Navbar onOpenLeadForm={() => handleOpenLeadForm()} />

            <Hero onOpenLeadForm={() => handleOpenLeadForm()} />

            <TopPackages onOpenLeadForm={handleOpenLeadForm} />

            <WhyChooseUs />

            <SampleItinerary />

            <HowItWorks />

            <Contact />
            
            <Footer />

            <WhatsAppButton />

            <Modal
                isOpen={isLeadFormOpen}
                onClose={handleCloseLeadForm}
                title="Get Your Custom Package"
            >
                <LeadForm
                    preFilledEvent={preFilledEvent}
                    packageId={selectedPackageId}
                    eventId={selectedEventId}
                    onSuccess={handleCloseLeadForm}
                />
            </Modal>
        </main>
    );
}
