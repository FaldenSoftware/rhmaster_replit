import { MainLayout } from "@/layouts/main-layout";
import { HeroSection } from "@/components/landing/hero-section";
import { FeaturesSection } from "@/components/landing/features-section";
import { DemoSection } from "@/components/landing/demo-section";
import { PricingSection } from "@/components/landing/pricing-section";
import { TestimonialsSection } from "@/components/landing/testimonials-section";
import { CTASection } from "@/components/landing/cta-section";
import { FAQSection } from "@/components/landing/faq-section";
import { ContactSection } from "@/components/landing/contact-section";
import { ExitPopup } from "@/components/landing/exit-popup";
import { useEffect, useState } from "react";

export default function LandingPage() {
  const [mounted, setMounted] = useState(false);
  
  // Montar o componente no cliente para evitar erros de hidratação
  useEffect(() => {
    setMounted(true);
  }, []);
  
  // Scroll to section if URL has hash
  useEffect(() => {
    if (window.location.hash) {
      const id = window.location.hash.substring(1);
      const element = document.getElementById(id);
      if (element) {
        element.scrollIntoView({ behavior: 'smooth' });
      }
    } else {
      // Reset scroll position to top when landing page loads without hash
      window.scrollTo(0, 0);
    }
  }, []);

  // Add metadata for SEO
  useEffect(() => {
    // Set page title
    document.title = "RH Master | Plataforma para mentores transformarem lideranças";
    
    // Update meta tags
    const metaDescription = document.querySelector('meta[name="description"]');
    if (metaDescription) {
      metaDescription.setAttribute("content", 
        "Transforme suas lideranças com o RH Master. Testes comportamentais, monitoramento inteligente e insights de IA para mentores profissionais. Comece grátis por 14 dias.");
    }
    
    // Create preload links for critical resources
    const createPreloadLink = (href: string, as: string) => {
      const link = document.createElement('link');
      link.rel = 'preload';
      link.href = href;
      link.as = as;
      document.head.appendChild(link);
    };
    
    // Preload critical images
    createPreloadLink("https://images.unsplash.com/photo-1557804506-669a67965ba0?ixlib=rb-4.0.3&auto=format&fit=crop&w=1674&q=80", "image");
  }, []);

  return (
    <MainLayout>
      <HeroSection />
      <FeaturesSection />
      <DemoSection />
      <TestimonialsSection />
      <PricingSection />
      <FAQSection />
      <CTASection />
      <ContactSection />
      
      {/* Exit popup - Só renderiza no cliente */}
      {mounted && <ExitPopup />}
    </MainLayout>
  );
}
