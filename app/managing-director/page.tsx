import SubHeroSection from '../components/SubHeroSection';
import HeroSection from './sections/HeroSection';
import StatsBar from './sections/StatsBar';
import CareerTimeline from './sections/CareerTimeline';
import EducationSection from './sections/EducationSection';
import PublicationsSection from './sections/PublicationsSection';
import TravelSection from './sections/TravelSection';
import PatronagesSection from './sections/PatronagesSection';

export const metadata = {
  title: 'About Managing Director - Dolindra Prasad Sharma',
};

export default function ManagingDirectorPage() {
  return (
    <main>
      <SubHeroSection
        breadcrumbs={[
          { label: 'Home', href: '/' },
          { label: 'About Managing Director', href: '/managing-director', active: true },
        ]}
        title="About Managing Director"
        subtitle="Our Leader's Vision for Agricultural Excellence"
        imageUrl="/managing-director.jpg"
      />

      <HeroSection imageSrc="/managing-director.jpg" />

      <StatsBar />
      <CareerTimeline />
      <EducationSection />
      <PublicationsSection />
      <TravelSection />
      <PatronagesSection />
    </main>
  );
}
