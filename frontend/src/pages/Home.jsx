import Navbar from "../components/Navbar";
import Hero from "../components/Hero";
import Stats from "../components/Stats";
import HowItWorks from "../components/HowItWorks";
import RoleCards from "../components/RoleCards";
import AIFeatures from "../components/AIFeatures";
import Features from "../components/Features";
import Testimonials from "../components/Testimonials";
import CTA from "../components/CTA";
import Footer from "../components/Footer";

function Home() {
  return (
    <div className="min-h-screen overflow-x-hidden bg-[#F7F9FC]">
      <Navbar />

      <main>
        {/* Hero with interactive local worker finder */}
        <Hero />

        {/* Live statistics from database */}
        <Stats />

        {/* How Rozgaar Setu Works */}
        <HowItWorks />

        {/* Dedicated Rozgaar Saathi AI section */}
        <AIFeatures />

        {/* Portals for Workers & Employers */}
        <RoleCards />

        {/* Key Platform Benefits */}
        <Features />

        {/* Trust & Accessibility Principles */}
        <Testimonials />

        {/* Call to Action */}
        <CTA />
      </main>

      <Footer />
    </div>
  );
}

export default Home;
