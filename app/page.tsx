import HeroSection from "./sections/hero";
import AboutSection from "./sections/about";
import ProjectsSection from "./sections/projects";
import ContactSection from "./sections/contact";

export default function Home() {
  return (
    <div className="bg-white">
      <HeroSection />
      <AboutSection />
      <ProjectsSection />
      <ContactSection />
    </div>
  );
}
