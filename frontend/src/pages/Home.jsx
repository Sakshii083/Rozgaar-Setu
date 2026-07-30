import Navbar from "../components/Navbar";
import Hero from "../components/Hero";
import RoleCards from "../components/RoleCards";
import AIFeatures from "../components/AIFeatures";
import Stats from "../components/Stats";
import HowItWorks from "../components/HowItWorks";

function Home() {
  return (
    <>
      <Navbar />
      <Hero />
      <RoleCards />
      <AIFeatures />
      <Stats />
      <HowItWorks />
    </>
  );
}

export default Home;