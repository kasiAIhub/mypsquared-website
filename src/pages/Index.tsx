import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import Hero from "@/components/home/Hero";
import P2LearningJourney from "@/components/P2LearningJourney";
import TwoPaths from "@/components/home/TwoPaths";
import MissionBanner from "@/components/home/MissionBanner";
import StatsBar from "@/components/home/StatsBar";
import DBEReadinessSection from "@/components/services/DBEReadinessSection";
import FounderStory from "@/components/about/FounderStory";
import ResearchBacked from "@/components/about/ResearchBacked";
import LearningCoachSpotlight from "@/components/services/LearningCoachSpotlight";
import PackageIncludes from "@/components/services/PackageIncludes";

const Index = () => {
  return (
    <main className="min-h-screen">
      <Navbar />
      <Hero />
      <P2LearningJourney />
      <TwoPaths />
      <MissionBanner />
      <Footer />
    </main>
  );
};

export default Index;
