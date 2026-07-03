import { motion } from 'framer-motion';
import { Camera, Zap, Cpu, Sparkles } from 'lucide-react';

export default function Hero() {
  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden px-4 py-20">
      {/* Gradient orbs */}
      <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-primary-600/20 rounded-full blur-[120px] pointer-events-none" />
      <div className="absolute bottom-1/4 right-1/4 w-80 h-80 bg-accent-500/15 rounded-full blur-[100px] pointer-events-none" />
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] bg-cyber-400/10 rounded-full blur-[150px] pointer-events-none" />

      <div className="relative z-10 max-w-6xl mx-auto text-center">
        {/* Badge */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="inline-flex items-center gap-2 px-4 py-2 rounded-full glass mb-8"
        >
          <span className="w-2 h-2 rounded-full bg-cyber-400 animate-pulse" />
          <span className="text-sm text-dark-200">v2.0 — Production Ready</span>
          <span className="text-sm text-primary-400 font-medium">30+ FPS Real-Time</span>
        </motion.div>

        {/* Main title */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.1 }}
        >
          <h1 className="text-5xl md:text-7xl lg:text-8xl font-black tracking-tight mb-4">
            <span className="text-white">Face</span>
            <span className="text-gradient">Transform</span>
          </h1>
          <h2 className="text-3xl md:text-5xl lg:text-6xl font-bold text-dark-300 mb-2">
            AI <span className="text-primary-400">Ultimate</span>
          </h2>
        </motion.div>

        {/* Subtitle */}
        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.3 }}
          className="text-lg md:text-xl text-dark-400 max-w-2xl mx-auto mb-10 leading-relaxed"
        >
          Real-time GAN-powered face transformation. Not filters — actual neural network inference
          that <span className="text-primary-300">reconstructs your face</span> in anime, Pixar, manga, and 15+ artistic styles.
        </motion.p>

        {/* Stats row */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.5 }}
          className="flex flex-wrap justify-center gap-6 md:gap-10 mb-12"
        >
          {[
            { icon: Zap, label: 'Latency', value: '<33ms', color: 'text-cyber-400' },
            { icon: Camera, label: 'FPS Target', value: '30+', color: 'text-primary-400' },
            { icon: Cpu, label: 'GPU Accel', value: 'TensorRT', color: 'text-accent-400' },
            { icon: Sparkles, label: 'Styles', value: '17+', color: 'text-yellow-400' },
          ].map((stat, i) => (
            <div key={i} className="flex items-center gap-3 glass rounded-xl px-5 py-3">
              <stat.icon className={`w-5 h-5 ${stat.color}`} />
              <div className="text-left">
                <div className={`text-xl font-bold ${stat.color} metric-value`}>{stat.value}</div>
                <div className="text-xs text-dark-400">{stat.label}</div>
              </div>
            </div>
          ))}
        </motion.div>

        {/* CTA buttons */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.7 }}
          className="flex flex-wrap justify-center gap-4"
        >
          <a
            href="#demo"
            className="px-8 py-4 bg-gradient-to-r from-primary-500 to-primary-600 rounded-xl font-semibold text-white hover:from-primary-400 hover:to-primary-500 transition-all duration-300 shadow-lg shadow-primary-500/25 hover:shadow-primary-500/40 hover:-translate-y-0.5"
          >
            🎬 Live Demo
          </a>
          <a
            href="#architecture"
            className="px-8 py-4 glass-strong rounded-xl font-semibold text-dark-200 hover:text-white hover:bg-white/10 transition-all duration-300"
          >
            📐 Architecture
          </a>
          <a
            href="#performance"
            className="px-8 py-4 glass rounded-xl font-semibold text-dark-300 hover:text-white transition-all duration-300"
          >
            ⚡ Performance
          </a>
        </motion.div>

        {/* Scroll indicator */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1.5 }}
          className="absolute bottom-8 left-1/2 -translate-x-1/2"
        >
          <div className="w-6 h-10 border-2 border-dark-600 rounded-full flex items-start justify-center p-1">
            <motion.div
              animate={{ y: [0, 16, 0] }}
              transition={{ duration: 2, repeat: Infinity }}
              className="w-1.5 h-1.5 rounded-full bg-primary-400"
            />
          </div>
        </motion.div>
      </div>
    </section>
  );
}
