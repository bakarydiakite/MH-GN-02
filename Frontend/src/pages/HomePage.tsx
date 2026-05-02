import Hero from '../features/landing/components/Hero';
import ProblemSection from '../features/landing/components/ProblemSection';
import Solution from '../features/landing/components/Solution';
import OfflineFirst from '../features/landing/components/OfflineFirst';
import Blockchain from '../features/landing/components/Blockchain';
import BlockchainSecurity from '../features/landing/components/BlockchainSecurity';
import Users from '../features/landing/components/Users';
import Impact from '../features/landing/components/Impact';
import CTA from '../features/landing/components/CTA';

const HomePage = () => {
  return (
    <div style={{ fontFamily: 'Inter, sans-serif' }}>
      <Hero />
      <ProblemSection />
      <Solution />
      <OfflineFirst />
      <Blockchain />
      <BlockchainSecurity />
      <Users />
      <Impact />
      <CTA />
    </div>
  );
};

export default HomePage;
