import { motion } from 'framer-motion';
import { ExternalLink, Heart, Code } from 'lucide-react';

export default function Footer() {
  return (
    <footer className="relative py-16 px-4 border-t border-white/5">
      <div className="max-w-6xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center"
        >
          {/* Logo */}
          <div className="text-4xl mb-4">🎌</div>
          <h3 className="text-2xl font-bold text-gradient mb-2">FaceTransform AI</h3>
          <p className="text-dark-400 text-sm mb-8 max-w-md mx-auto">
            Real-time GAN-powered face transformation. Production-ready pipeline with TensorRT optimization, temporal smoothing, and seamless compositing.
          </p>

          {/* Key difference callout */}
          <div className="glass-strong rounded-xl p-6 max-w-2xl mx-auto mb-10">
            <p className="text-sm text-dark-200 leading-relaxed">
              <strong className="text-white">The key difference</strong> from a filter app: Each frame runs through an actual GAN inference that{' '}
              <span className="text-primary-400 font-medium">reconstructs the face</span> in anime/3D style — not color grading or overlays.
              The temporal smoother + optical flow ensures{' '}
              <span className="text-cyber-400 font-medium">zero flicker</span> at 30FPS, and Poisson blending makes the{' '}
              <span className="text-accent-400 font-medium">edges invisible</span>.
            </p>
          </div>

          {/* Links */}
          <div className="flex flex-wrap justify-center gap-4 mb-8">
            <a
              href="#demo"
              className="flex items-center gap-2 px-5 py-2.5 rounded-lg glass text-dark-200 hover:text-white transition-colors text-sm"
            >
              <ExternalLink className="w-4 h-4" />
              Live Demo
            </a>
            <a
              href="#architecture"
              className="flex items-center gap-2 px-5 py-2.5 rounded-lg glass text-dark-200 hover:text-white transition-colors text-sm"
            >
              <Code className="w-4 h-4" />
              Architecture
            </a>
          </div>

          {/* Nav links */}
          <div className="flex flex-wrap justify-center gap-6 text-sm text-dark-400 mb-8">
            {['Demo', 'Styles', 'Architecture', 'Performance', 'Code', 'Setup'].map(link => (
              <a
                key={link}
                href={`#${link.toLowerCase()}`}
                className="hover:text-white transition-colors"
              >
                {link}
              </a>
            ))}
          </div>

          {/* Bottom */}
          <div className="flex items-center justify-center gap-1 text-xs text-dark-500">
            <span>Built with</span>
            <Heart className="w-3 h-3 text-accent-400" />
            <span>using PyTorch, ONNX Runtime, MediaPipe & TensorRT</span>
          </div>
        </motion.div>
      </div>
    </footer>
  );
}
