import ParticleBackground from './components/ParticleBackground';
import Navbar from './components/Navbar';
import Hero from './components/Hero';
import LiveDemo from './components/LiveDemo';
import StyleGallery from './components/StyleGallery';
import PipelineArchitecture from './components/PipelineArchitecture';
import PerformanceMetrics from './components/PerformanceMetrics';
import Features from './components/Features';
import CodeShowcase from './components/CodeShowcase';
import ProjectStructure from './components/ProjectStructure';
import SetupGuide from './components/SetupGuide';
import TechStack from './components/TechStack';
import Footer from './components/Footer';

export default function App() {
  return (
    <div className="relative min-h-screen bg-dark-950 text-dark-100 overflow-x-hidden">
      <ParticleBackground />
      <Navbar />

      <main className="relative z-10">
        <Hero />

        {/* Divider */}
        <div className="max-w-6xl mx-auto px-4">
          <div className="h-px bg-gradient-to-r from-transparent via-primary-500/20 to-transparent" />
        </div>

        <LiveDemo />

        <div className="max-w-6xl mx-auto px-4">
          <div className="h-px bg-gradient-to-r from-transparent via-accent-500/20 to-transparent" />
        </div>

        <StyleGallery />

        <div className="max-w-6xl mx-auto px-4">
          <div className="h-px bg-gradient-to-r from-transparent via-cyber-400/20 to-transparent" />
        </div>

        <PipelineArchitecture />

        <div className="max-w-6xl mx-auto px-4">
          <div className="h-px bg-gradient-to-r from-transparent via-primary-500/20 to-transparent" />
        </div>

        <PerformanceMetrics />

        <div className="max-w-6xl mx-auto px-4">
          <div className="h-px bg-gradient-to-r from-transparent via-accent-500/20 to-transparent" />
        </div>

        <Features />

        <div className="max-w-6xl mx-auto px-4">
          <div className="h-px bg-gradient-to-r from-transparent via-cyber-400/20 to-transparent" />
        </div>

        <CodeShowcase />

        <div className="max-w-6xl mx-auto px-4">
          <div className="h-px bg-gradient-to-r from-transparent via-primary-500/20 to-transparent" />
        </div>

        <ProjectStructure />

        <div className="max-w-6xl mx-auto px-4">
          <div className="h-px bg-gradient-to-r from-transparent via-accent-500/20 to-transparent" />
        </div>

        <SetupGuide />

        <TechStack />
      </main>

      <Footer />
    </div>
  );
}
