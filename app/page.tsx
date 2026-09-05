import { Navbar } from "@/components/Navbar";
import { Hero } from "@/components/Hero";
import { FeatureSelfDriving } from "@/components/FeatureSelfDriving";
import { ShowcaseSection } from "@/components/ShowcaseSection";
import { Quicklinks } from "@/components/Quicklinks";
import { ChargingMap } from "@/components/ChargingMap";
import { StatsCharging } from "@/components/StatsCharging";
import { ContactForm } from "@/components/ContactForm";
import { Footer } from "@/components/Footer";
import { vehicleSlides, energySlides } from "@/lib/slides";

export default function HomePage() {
  return (
    <>
      <Navbar />
      <main id="main">
        <Hero />
        <FeatureSelfDriving />
        <ShowcaseSection id="vehicles" slides={vehicleSlides} />
        <Quicklinks />
        <ChargingMap />
        <StatsCharging />
        <ShowcaseSection id="energy" slides={energySlides} />
        <ContactForm />
      </main>
      <Footer />
    </>
  );
}
