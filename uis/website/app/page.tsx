import {
  BrasaPointsSection,
  ContactSection,
  HeroSection,
  LocationsSection,
  MenuSection,
  StorySection,
  UniqueSection,
} from "@/components/home/HomeSections";

export default function HomePage() {
  return (
    <main id="main">
      <HeroSection />
      <StorySection />
      <UniqueSection />
      <LocationsSection />
      <MenuSection />
      <BrasaPointsSection />
      <ContactSection />
    </main>
  );
}
