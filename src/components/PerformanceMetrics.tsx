import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Cpu, MemoryStick, Gauge, Timer, MonitorSpeaker, Zap } from 'lucide-react';

const GPU_TARGETS = [
  { name: 'RTX 4080', fps: 60, bar: 100, color: '#00ffd5' },
  { name: 'RTX 3060', fps: 45, bar: 75, color: '#7c5cff' },
  { name: 'GTX 1080', fps: 30, bar: 50, color: '#ff6b9d' },
  { name: 'Apple M2', fps: 35, bar: 58, color: '#ffd700' },
  { name: 'iPhone 15', fps: 30, bar: 50, color: '#87ceeb' },
];

const PERFORMANCE_TABLE = [
  { stage: 'Face Detection', budget: '<5ms', technique: 'MediaPipe GPU', icon: '👁️' },
  { stage: 'Alignment + Tracking', budget: '<3ms', technique: 'Kalman + 3D Align', icon: '📐' },
  { stage: 'Segmentation', budget: '<2ms', technique: 'Parallel thread', icon: '✂️' },
  { stage: 'AI Transformation', budget: '<15ms', technique: 'ONNX + TensorRT', icon: '🧠' },
  { stage: 'Temporal Smoothing', budget: '<2ms', technique: 'Optical Flow EMA', icon: '🌊' },
  { stage: 'Poisson Compositing', budget: '<4ms', technique: 'GPU OpenCV', icon: '🖼️' },
  { stage: 'Display Overhead', budget: '<2ms', technique: 'Triple buffering', icon: '🖥️' },
];

function AnimatedCounter({ end, suffix = '', decimals = 0, duration = 2000 }: {
  end: number;
  suffix?: string;
  decimals?: number;
  duration?: number;
}) {
  const [value, setValue] = useState(0);

  useEffect(() => {
    let start = 0;
    const startTime = Date.now();

    const animate = () => {
      const elapsed = Date.now() - startTime;
      const progress = Math.min(elapsed / duration, 1);
      const eased = 1 - Math.pow(1 - progress, 3);
      const current = start + (end - start) * eased;
      setValue(current);

      if (progress < 1) {
        requestAnimationFrame(animate);
      }
    };

    requestAnimationFrame(animate);
  }, [end, duration]);

  return (
    <span className="metric-value">
      {value.toFixed(decimals)}{suffix}
    </span>
  );
}

export default function PerformanceMetrics() {
  const [isVisible, setIsVisible] = useState(false);

  return (
    <section id="performance" className="relative py-24 px-4">
      {/* Background accent */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[400px] bg-primary-600/5 rounded-full blur-[120px] pointer-events-none" />

      <div className="max-w-7xl mx-auto relative">
        {/* Section header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          onViewportEnter={() => setIsVisible(true)}
          className="text-center mb-16"
        >
          <span className="text-sm font-medium text-accent-400 uppercase tracking-wider">Performance</span>
          <h2 className="text-4xl md:text-5xl font-bold mt-3 mb-4">
            <span className="text-white">Blazing </span>
            <span className="text-gradient">Fast</span>
          </h2>
          <p className="text-dark-400 text-lg max-w-xl mx-auto">
            Real neural network inference at 30+ FPS with TensorRT optimization, adaptive quality, and zero-flicker temporal smoothing.
          </p>
        </motion.div>

        {/* Key metrics */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-16">
          {[
            { icon: Gauge, label: 'Max FPS', value: 60, suffix: '+', color: 'text-cyber-400', bgColor: 'bg-cyber-400/10' },
            { icon: Timer, label: 'Avg Latency', value: 28, suffix: 'ms', color: 'text-primary-400', bgColor: 'bg-primary-400/10' },
            { icon: MemoryStick, label: 'GPU Memory', value: 2, suffix: 'GB', color: 'text-accent-400', bgColor: 'bg-accent-400/10' },
            { icon: Cpu, label: 'AI Models', value: 17, suffix: '+', color: 'text-yellow-400', bgColor: 'bg-yellow-400/10' },
          ].map((metric, i) => (
            <motion.div
              key={metric.label}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.1 }}
              className="glass rounded-xl p-6 text-center"
            >
              <div className={`w-12 h-12 rounded-xl ${metric.bgColor} mx-auto mb-3 flex items-center justify-center`}>
                <metric.icon className={`w-6 h-6 ${metric.color}`} />
              </div>
              <div className={`text-3xl font-bold ${metric.color} mb-1`}>
                {isVisible ? (
                  <AnimatedCounter end={metric.value} suffix={metric.suffix} />
                ) : (
                  `0${metric.suffix}`
                )}
              </div>
              <div className="text-sm text-dark-400">{metric.label}</div>
            </motion.div>
          ))}
        </div>

        <div className="grid lg:grid-cols-2 gap-8">
          {/* Performance table */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            className="glass rounded-2xl overflow-hidden"
          >
            <div className="px-6 py-4 border-b border-white/5">
              <h3 className="font-semibold text-white flex items-center gap-2">
                <Zap className="w-4 h-4 text-cyber-400" />
                Per-Frame Breakdown
              </h3>
            </div>
            <div className="divide-y divide-white/5">
              {PERFORMANCE_TABLE.map((row, i) => (
                <motion.div
                  key={row.stage}
                  initial={{ opacity: 0, x: -10 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: i * 0.05 }}
                  className="flex items-center gap-4 px-6 py-3 hover:bg-white/3 transition-colors"
                >
                  <span className="text-lg">{row.icon}</span>
                  <div className="flex-1 min-w-0">
                    <div className="text-sm font-medium text-white">{row.stage}</div>
                    <div className="text-xs text-dark-400">{row.technique}</div>
                  </div>
                  <span className="text-sm font-mono font-bold text-primary-400">{row.budget}</span>
                </motion.div>
              ))}
            </div>
            <div className="px-6 py-4 border-t border-white/5 bg-white/2">
              <div className="flex items-center justify-between">
                <span className="text-sm font-semibold text-white">TOTAL</span>
                <span className="text-lg font-mono font-bold text-cyber-400">&lt;33ms = 30+ FPS ✅</span>
              </div>
            </div>
          </motion.div>

          {/* GPU targets */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            className="glass rounded-2xl p-6"
          >
            <h3 className="font-semibold text-white flex items-center gap-2 mb-6">
              <MonitorSpeaker className="w-4 h-4 text-primary-400" />
              GPU Performance Targets
            </h3>
            <div className="space-y-5">
              {GPU_TARGETS.map((gpu, i) => (
                <div key={gpu.name}>
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-sm font-medium text-dark-200">{gpu.name}</span>
                    <span className="text-sm font-mono font-bold" style={{ color: gpu.color }}>
                      {isVisible ? (
                        <AnimatedCounter end={gpu.fps} suffix="+ FPS" duration={1500 + i * 200} />
                      ) : (
                        '0 FPS'
                      )}
                    </span>
                  </div>
                  <div className="h-3 bg-dark-800 rounded-full overflow-hidden">
                    <motion.div
                      initial={{ width: 0 }}
                      whileInView={{ width: `${gpu.bar}%` }}
                      viewport={{ once: true }}
                      transition={{ duration: 1.5, delay: i * 0.15, ease: 'easeOut' }}
                      className="h-full rounded-full"
                      style={{ background: `linear-gradient(90deg, ${gpu.color}80, ${gpu.color})` }}
                    />
                  </div>
                </div>
              ))}
            </div>

            {/* Optimization techniques */}
            <div className="mt-8 pt-6 border-t border-white/5">
              <h4 className="text-sm font-semibold text-dark-300 mb-3">Optimization Stack</h4>
              <div className="flex flex-wrap gap-2">
                {[
                  'TensorRT FP16',
                  'ONNX Runtime',
                  'CUDA Streams',
                  'Optical Flow EMA',
                  'Adaptive Quality',
                  'Batch Processing',
                  'Memory Pool',
                  'Triple Buffering',
                ].map(tech => (
                  <span key={tech} className="text-xs px-2.5 py-1 rounded-full glass text-dark-300 hover:text-white transition-colors cursor-default">
                    {tech}
                  </span>
                ))}
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
