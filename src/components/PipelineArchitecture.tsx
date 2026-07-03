import { motion } from 'framer-motion';
import { Camera, Eye, Move, Scissors, Sparkles, Clock, Layers, Monitor } from 'lucide-react';

const PIPELINE_STAGES = [
  {
    icon: Camera,
    name: 'Capture',
    time: '~1ms',
    detail: 'Triple-buffered camera capture thread',
    color: '#7c5cff',
    tech: 'OpenCV',
  },
  {
    icon: Eye,
    name: 'Detect',
    time: '<5ms',
    detail: 'MediaPipe FaceMesh + RetinaFace fallback',
    color: '#ff4081',
    tech: 'MediaPipe',
  },
  {
    icon: Move,
    name: 'Track + Align',
    time: '<3ms',
    detail: 'Kalman filter + 3D face alignment',
    color: '#ffd700',
    tech: 'Kalman',
  },
  {
    icon: Scissors,
    name: 'Segment',
    time: '<2ms',
    detail: 'Hair/skin/BG semantic segmentation',
    color: '#00ffd5',
    tech: 'Parallel',
  },
  {
    icon: Sparkles,
    name: 'Transform',
    time: '<15ms',
    detail: 'GAN neural network inference (GPU)',
    color: '#ff6b9d',
    tech: 'ONNX + TRT',
  },
  {
    icon: Clock,
    name: 'Smooth',
    time: '<2ms',
    detail: 'Optical flow + EMA temporal smoothing',
    color: '#87ceeb',
    tech: 'OpenCV',
  },
  {
    icon: Layers,
    name: 'Composite',
    time: '<4ms',
    detail: 'Poisson seamless cloning + color match',
    color: '#b8860b',
    tech: 'Poisson',
  },
  {
    icon: Monitor,
    name: 'Display',
    time: '<2ms',
    detail: 'OpenGL accelerated rendering',
    color: '#9370db',
    tech: 'OpenGL',
  },
];

export default function PipelineArchitecture() {
  return (
    <section id="architecture" className="relative py-24 px-4">
      <div className="max-w-7xl mx-auto">
        {/* Section header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <span className="text-sm font-medium text-cyber-400 uppercase tracking-wider">System Architecture</span>
          <h2 className="text-4xl md:text-5xl font-bold mt-3 mb-4">
            <span className="text-white">Multi-Threaded </span>
            <span className="text-gradient">Pipeline</span>
          </h2>
          <p className="text-dark-400 text-lg max-w-2xl mx-auto">
            8-stage processing pipeline with parallel execution. Each stage runs in its own thread,
            connected by lock-free frame buffers for zero-copy throughput.
          </p>
        </motion.div>

        {/* Pipeline visualization */}
        <div className="relative">
          {/* Connection line */}
          <div className="hidden lg:block absolute top-1/2 left-0 right-0 h-0.5 bg-gradient-to-r from-primary-500/0 via-primary-500/30 to-primary-500/0 -translate-y-1/2" />

          <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-8 gap-4">
            {PIPELINE_STAGES.map((stage, index) => (
              <motion.div
                key={stage.name}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.08 }}
                className="pipeline-node glass rounded-xl p-4 text-center relative group cursor-default"
              >
                {/* Arrow connector (on larger screens) */}
                {index < PIPELINE_STAGES.length - 1 && (
                  <div className="hidden lg:block absolute -right-3 top-1/2 -translate-y-1/2 text-dark-600 z-10">
                    →
                  </div>
                )}

                {/* Icon */}
                <div
                  className="w-12 h-12 rounded-xl mx-auto mb-3 flex items-center justify-center transition-all duration-300"
                  style={{ background: `${stage.color}15`, border: `1px solid ${stage.color}30` }}
                >
                  <stage.icon className="w-6 h-6" style={{ color: stage.color }} />
                </div>

                {/* Name */}
                <h4 className="text-sm font-semibold text-white mb-1">{stage.name}</h4>

                {/* Time budget */}
                <div
                  className="text-xs font-mono font-bold mb-2"
                  style={{ color: stage.color }}
                >
                  {stage.time}
                </div>

                {/* Tech badge */}
                <span
                  className="inline-block text-[10px] px-2 py-0.5 rounded-full font-medium"
                  style={{ background: `${stage.color}15`, color: stage.color }}
                >
                  {stage.tech}
                </span>

                {/* Hover tooltip */}
                <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none z-20">
                  <div className="bg-dark-900 border border-white/10 rounded-lg px-3 py-2 text-xs text-dark-200 whitespace-nowrap shadow-xl">
                    {stage.detail}
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>

        {/* Total time */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mt-12"
        >
          <div className="inline-flex items-center gap-4 glass-strong rounded-xl px-8 py-4">
            <span className="text-dark-400 text-sm">Total Pipeline:</span>
            <span className="text-3xl font-bold text-gradient">&lt;33ms</span>
            <span className="text-dark-400 text-sm">=</span>
            <span className="text-3xl font-bold text-cyber-400">30+ FPS ✅</span>
          </div>
        </motion.div>

        {/* Thread architecture diagram */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="mt-16 glass rounded-2xl p-6 md:p-8"
        >
          <h3 className="text-lg font-semibold text-white mb-6">Thread Architecture</h3>
          <div className="grid md:grid-cols-4 gap-4">
            {[
              { name: 'Capture Thread', desc: 'Camera → Raw frames', icon: '📷', color: '#7c5cff' },
              { name: 'Detection Thread', desc: 'Face detection + tracking', icon: '👁️', color: '#ff4081' },
              { name: 'Transform Thread', desc: 'GPU inference + smoothing', icon: '🧠', color: '#00ffd5' },
              { name: 'Display Thread', desc: 'Composite + render', icon: '🖥️', color: '#ffd700' },
            ].map((thread, i) => (
              <div
                key={thread.name}
                className="rounded-xl p-4 border transition-all hover:scale-105"
                style={{ borderColor: `${thread.color}30`, background: `${thread.color}08` }}
              >
                <div className="text-2xl mb-2">{thread.icon}</div>
                <h4 className="font-semibold text-sm text-white mb-1">{thread.name}</h4>
                <p className="text-xs text-dark-400">{thread.desc}</p>
                {i < 3 && (
                  <div className="mt-3 flex items-center gap-1">
                    <div className="h-0.5 flex-1 rounded" style={{ background: thread.color }} />
                    <span className="text-xs" style={{ color: thread.color }}>→</span>
                    <span className="text-[10px] text-dark-400">buffer</span>
                  </div>
                )}
              </div>
            ))}
          </div>

          {/* Code snippet */}
          <div className="mt-6 rounded-xl bg-dark-950 p-4 overflow-x-auto border border-white/5">
            <pre className="text-xs font-mono text-dark-300 leading-relaxed">
              <span className="text-primary-400">{'class'}</span>{' '}
              <span className="text-cyber-400">RealTimeTransformPipeline</span>
              <span className="text-dark-500">:</span>
              {'\n    '}
              <span className="text-dark-500">{'"""'}</span>
              {'\n    '}
              <span className="text-dark-500">┌──────────┐   ┌──────────┐   ┌──────────┐   ┌──────────┐</span>
              {'\n    '}
              <span className="text-dark-500">│</span><span className="text-primary-400"> Capture  </span><span className="text-dark-500">│──▶│</span><span className="text-accent-400"> Detect   </span><span className="text-dark-500">│──▶│</span><span className="text-cyber-400">Transform </span><span className="text-dark-500">│──▶│</span><span className="text-yellow-400"> Display  </span><span className="text-dark-500">│</span>
              {'\n    '}
              <span className="text-dark-500">│</span><span className="text-primary-400"> Thread   </span><span className="text-dark-500">│   │</span><span className="text-accent-400"> Thread   </span><span className="text-dark-500">│   │</span><span className="text-cyber-400">  Thread  </span><span className="text-dark-500">│   │</span><span className="text-yellow-400">  Thread  </span><span className="text-dark-500">│</span>
              {'\n    '}
              <span className="text-dark-500">└──────────┘   └──────────┘   └──────────┘   └──────────┘</span>
              {'\n    '}
              <span className="text-dark-500">     │              │               │               │</span>
              {'\n    '}
              <span className="text-dark-500">     └──────────────┴───────────────┴───────────────┘</span>
              {'\n    '}
              <span className="text-dark-500">                        Frame Buffers</span>
              {'\n    '}
              <span className="text-dark-500">{'"""'}</span>
            </pre>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
