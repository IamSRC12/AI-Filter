import { motion } from 'framer-motion';
import {
  Brain,
  Layers,
  ShieldCheck,
  Smartphone,
  Sliders,
  Zap,
  Eye,
  Paintbrush,
  BarChart3,
  Blend,
  Waves,
  MonitorPlay,
} from 'lucide-react';

const FEATURES = [
  {
    icon: Brain,
    title: 'Real GAN Inference',
    description: 'Each frame runs through actual neural network inference that reconstructs faces — not color grading or overlays.',
    color: '#7c5cff',
  },
  {
    icon: Waves,
    title: 'Zero-Flicker Smoothing',
    description: 'Optical flow warping + exponential moving average ensures temporally coherent output with no flicker at 30 FPS.',
    color: '#00ffd5',
  },
  {
    icon: Blend,
    title: 'Poisson Blending',
    description: 'Seamless cloning composites transformed faces back with invisible edges and matched lighting.',
    color: '#ff6b9d',
  },
  {
    icon: Eye,
    title: 'Multi-Face Tracking',
    description: 'Track up to 4 faces simultaneously with Kalman filter prediction and ID persistence across frames.',
    color: '#ffd700',
  },
  {
    icon: Sliders,
    title: 'Intensity Control',
    description: 'Smoothly blend between original and transformed at any ratio. Cross-fade transitions between styles.',
    color: '#87ceeb',
  },
  {
    icon: Zap,
    title: 'TensorRT + FP16',
    description: 'Models quantized to FP16 and optimized with NVIDIA TensorRT for maximum GPU throughput.',
    color: '#ef4444',
  },
  {
    icon: Layers,
    title: 'Semantic Segmentation',
    description: 'Hair/skin/background segmentation for precise mask boundaries and natural-looking transitions.',
    color: '#a855f7',
  },
  {
    icon: BarChart3,
    title: 'Adaptive Quality',
    description: 'Dynamically adjusts processing resolution to maintain target FPS when GPU load increases.',
    color: '#f97316',
  },
  {
    icon: Paintbrush,
    title: 'Color Matching',
    description: 'LAB color space statistics matching ensures transformed faces match ambient lighting naturally.',
    color: '#22d3ee',
  },
  {
    icon: ShieldCheck,
    title: '3D Head Pose',
    description: 'solvePnP-based head pose estimation for correct transformation under extreme angles.',
    color: '#4ade80',
  },
  {
    icon: Smartphone,
    title: 'Cross-Platform',
    description: 'CoreML for iOS, NNAPI for Android, TensorRT for desktop. Same quality everywhere.',
    color: '#fb923c',
  },
  {
    icon: MonitorPlay,
    title: 'Expression Aware',
    description: 'Detects smiles, blinks, and mouth opening to preserve natural expressions in transformed output.',
    color: '#e879f9',
  },
];

export default function Features() {
  return (
    <section id="features" className="relative py-24 px-4">
      <div className="absolute bottom-0 right-0 w-96 h-96 bg-accent-500/5 rounded-full blur-[120px] pointer-events-none" />

      <div className="max-w-7xl mx-auto relative">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <span className="text-sm font-medium text-primary-400 uppercase tracking-wider">Core Features</span>
          <h2 className="text-4xl md:text-5xl font-bold mt-3 mb-4">
            <span className="text-white">Production </span>
            <span className="text-gradient">Engineering</span>
          </h2>
          <p className="text-dark-400 text-lg max-w-xl mx-auto">
            Every component is built for real-time performance. No shortcuts — real AI, real tracking, real compositing.
          </p>
        </motion.div>

        {/* Feature grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
          {FEATURES.map((feature, i) => (
            <motion.div
              key={feature.title}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.05 }}
              className="glass rounded-xl p-5 hover:bg-white/5 transition-all duration-300 group cursor-default"
            >
              <div
                className="w-10 h-10 rounded-lg mb-4 flex items-center justify-center transition-all duration-300 group-hover:scale-110"
                style={{ background: `${feature.color}15`, border: `1px solid ${feature.color}25` }}
              >
                <feature.icon className="w-5 h-5" style={{ color: feature.color }} />
              </div>
              <h3 className="font-semibold text-white mb-2">{feature.title}</h3>
              <p className="text-sm text-dark-400 leading-relaxed">{feature.description}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
