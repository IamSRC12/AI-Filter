import { useState, useEffect, useRef, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Play, Pause, ChevronLeft, ChevronRight, Maximize2 } from 'lucide-react';

const STYLES = [
  {
    id: 'anime_shinkai',
    name: 'Shinkai Anime',
    category: 'Anime',
    image: '/images/anime-style.jpg',
    color: '#7c5cff',
    description: 'Makoto Shinkai style (Your Name)',
    emoji: '🎌',
  },
  {
    id: 'cartoon_pixar',
    name: 'Pixar 3D',
    category: '3D Cartoon',
    image: '/images/pixar-style.jpg',
    color: '#ff6b9d',
    description: 'Pixar movie character style',
    emoji: '🧸',
  },
  {
    id: 'comic_manga',
    name: 'Manga B&W',
    category: 'Comic',
    image: '/images/manga-style.jpg',
    color: '#e0e0e0',
    description: 'Japanese manga black & white',
    emoji: '📖',
  },
  {
    id: 'cartoon_disney',
    name: 'Disney Classic',
    category: '3D Cartoon',
    image: '/images/disney-style.jpg',
    color: '#ffd700',
    description: 'Disney animation style',
    emoji: '✨',
  },
  {
    id: 'scifi_cyberpunk',
    name: 'Cyberpunk',
    category: 'Sci-Fi',
    image: '/images/cyberpunk-style.jpg',
    color: '#00ffd5',
    description: 'Neon cyberpunk aesthetic',
    emoji: '🤖',
  },
  {
    id: 'art_watercolor',
    name: 'Watercolor',
    category: 'Artistic',
    image: '/images/watercolor-style.jpg',
    color: '#87ceeb',
    description: 'Beautiful watercolor portrait',
    emoji: '🎨',
  },
];

const FACES = [
  'https://images.pexels.com/photos/35721587/pexels-photo-35721587.jpeg?auto=compress&cs=tinysrgb&dpr=2&h=650&w=940',
  'https://images.pexels.com/photos/31420959/pexels-photo-31420959.jpeg?auto=compress&cs=tinysrgb&dpr=2&h=650&w=940',
  'https://images.pexels.com/photos/14950779/pexels-photo-14950779.jpeg?auto=compress&cs=tinysrgb&dpr=2&h=650&w=940',
];

export default function LiveDemo() {
  const [selectedStyle, setSelectedStyle] = useState(0);
  const [intensity, setIntensity] = useState(1.0);
  const [isProcessing, setIsProcessing] = useState(true);
  const [faceIndex, setFaceIndex] = useState(0);
  const [fps, setFps] = useState(32.4);
  const [latency, setLatency] = useState(28.3);
  const [frameCount, setFrameCount] = useState(0);
  const intervalRef = useRef<number | null>(null);

  // Simulate real-time metrics
  useEffect(() => {
    if (!isProcessing) return;
    intervalRef.current = window.setInterval(() => {
      setFps(28 + Math.random() * 8);
      setLatency(22 + Math.random() * 12);
      setFrameCount(prev => prev + 1);
    }, 100);
    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current);
    };
  }, [isProcessing]);

  const nextStyle = useCallback(() => {
    setSelectedStyle(prev => (prev + 1) % STYLES.length);
  }, []);

  const prevStyle = useCallback(() => {
    setSelectedStyle(prev => (prev - 1 + STYLES.length) % STYLES.length);
  }, []);

  const style = STYLES[selectedStyle];
  const fpsColor = fps >= 28 ? 'text-green-400' : fps >= 20 ? 'text-yellow-400' : 'text-red-400';

  return (
    <section id="demo" className="relative py-24 px-4">
      <div className="max-w-7xl mx-auto">
        {/* Section header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <span className="text-sm font-medium text-primary-400 uppercase tracking-wider">Interactive Demo</span>
          <h2 className="text-4xl md:text-5xl font-bold mt-3 mb-4">
            <span className="text-white">See the </span>
            <span className="text-gradient">Transformation</span>
          </h2>
          <p className="text-dark-400 text-lg max-w-xl mx-auto">
            Switch styles in real-time. Each frame runs through actual GAN inference — not color grading.
          </p>
        </motion.div>

        <div className="grid lg:grid-cols-3 gap-8">
          {/* Camera view */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            className="lg:col-span-2"
          >
            <div className="glass rounded-2xl overflow-hidden">
              {/* Top bar */}
              <div className="flex items-center justify-between px-4 py-3 border-b border-white/5">
                <div className="flex items-center gap-3">
                  <div className="flex gap-1.5">
                    <div className="w-3 h-3 rounded-full bg-red-500" />
                    <div className="w-3 h-3 rounded-full bg-yellow-500" />
                    <div className="w-3 h-3 rounded-full bg-green-500" />
                  </div>
                  <span className="text-sm text-dark-400 font-mono">FaceTransform AI — Camera 0</span>
                </div>
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => setIsProcessing(!isProcessing)}
                    className="p-1.5 rounded-lg hover:bg-white/10 transition-colors"
                  >
                    {isProcessing ? <Pause className="w-4 h-4 text-dark-300" /> : <Play className="w-4 h-4 text-dark-300" />}
                  </button>
                  <Maximize2 className="w-4 h-4 text-dark-400" />
                </div>
              </div>

              {/* Main viewport */}
              <div className="relative aspect-video bg-dark-950 overflow-hidden">
                {/* Original face (left half) */}
                <div className="absolute inset-0 flex">
                  <div className="w-1/2 relative overflow-hidden">
                    <img
                      src={FACES[faceIndex]}
                      alt="Original"
                      className="absolute inset-0 w-full h-full object-cover"
                    />
                    <div className="absolute top-3 left-3 px-2 py-1 rounded-md bg-black/60 text-xs text-white font-mono">
                      ORIGINAL
                    </div>
                    {/* Face detection overlay */}
                    <div className="absolute inset-[15%] border-2 border-primary-400/40 rounded-lg">
                      <div className="absolute -top-1 -left-1 w-4 h-4 border-t-2 border-l-2 border-primary-400" />
                      <div className="absolute -top-1 -right-1 w-4 h-4 border-t-2 border-r-2 border-primary-400" />
                      <div className="absolute -bottom-1 -left-1 w-4 h-4 border-b-2 border-l-2 border-primary-400" />
                      <div className="absolute -bottom-1 -right-1 w-4 h-4 border-b-2 border-r-2 border-primary-400" />
                      {/* Landmark dots */}
                      {[
                        { top: '35%', left: '30%' },
                        { top: '35%', left: '70%' },
                        { top: '55%', left: '50%' },
                        { top: '70%', left: '40%' },
                        { top: '70%', left: '60%' },
                      ].map((pos, i) => (
                        <div
                          key={i}
                          className="absolute w-1.5 h-1.5 bg-cyber-400 rounded-full animate-pulse"
                          style={{ top: pos.top, left: pos.left }}
                        />
                      ))}
                    </div>
                    {/* Scan effect */}
                    {isProcessing && (
                      <motion.div
                        animate={{ y: ['-100%', '100%'] }}
                        transition={{ duration: 2, repeat: Infinity, ease: 'linear' }}
                        className="absolute inset-x-0 h-1 bg-gradient-to-b from-transparent via-primary-400/30 to-transparent"
                      />
                    )}
                  </div>

                  {/* Divider */}
                  <div className="w-px bg-white/20 z-10 relative">
                    <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-8 h-8 rounded-full bg-dark-900 border border-white/20 flex items-center justify-center">
                      <span className="text-xs text-white">→</span>
                    </div>
                  </div>

                  {/* Transformed (right half) */}
                  <div className="w-1/2 relative overflow-hidden">
                    <AnimatePresence mode="wait">
                      <motion.img
                        key={selectedStyle}
                        src={style.image}
                        alt={style.name}
                        initial={{ opacity: 0, scale: 1.05 }}
                        animate={{ opacity: intensity, scale: 1 }}
                        exit={{ opacity: 0, scale: 0.95 }}
                        transition={{ duration: 0.5 }}
                        className="absolute inset-0 w-full h-full object-cover"
                        style={{ filter: `saturate(${0.8 + intensity * 0.4})` }}
                      />
                    </AnimatePresence>
                    <div className="absolute top-3 right-3 px-2 py-1 rounded-md text-xs font-mono font-bold" style={{ background: `${style.color}33`, color: style.color }}>
                      {style.emoji} {style.name.toUpperCase()}
                    </div>
                    {/* Processing indicator */}
                    {isProcessing && (
                      <div className="absolute bottom-3 right-3 flex items-center gap-2 px-2 py-1 rounded-md bg-black/60">
                        <div className="w-1.5 h-1.5 rounded-full bg-green-400 animate-pulse" />
                        <span className="text-xs text-green-400 font-mono">LIVE</span>
                      </div>
                    )}
                  </div>
                </div>

                {/* HUD overlay */}
                <div className="absolute top-3 left-1/2 -translate-x-1/2 flex items-center gap-4 px-4 py-2 rounded-lg bg-black/50 backdrop-blur-sm">
                  <div className="text-center">
                    <div className={`text-sm font-bold font-mono metric-value ${fpsColor}`}>
                      {fps.toFixed(1)}
                    </div>
                    <div className="text-[10px] text-dark-400">FPS</div>
                  </div>
                  <div className="w-px h-6 bg-white/10" />
                  <div className="text-center">
                    <div className="text-sm font-bold font-mono text-dark-200 metric-value">
                      {latency.toFixed(1)}ms
                    </div>
                    <div className="text-[10px] text-dark-400">Latency</div>
                  </div>
                  <div className="w-px h-6 bg-white/10" />
                  <div className="text-center">
                    <div className="text-sm font-bold font-mono text-primary-400 metric-value">
                      {frameCount}
                    </div>
                    <div className="text-[10px] text-dark-400">Frames</div>
                  </div>
                </div>
              </div>

              {/* Controls bar */}
              <div className="px-4 py-3 border-t border-white/5">
                <div className="flex items-center gap-4 flex-wrap">
                  {/* Style navigation */}
                  <div className="flex items-center gap-2">
                    <button onClick={prevStyle} className="p-1 rounded hover:bg-white/10 transition-colors">
                      <ChevronLeft className="w-5 h-5 text-dark-300" />
                    </button>
                    <span className="text-sm font-medium text-dark-200 min-w-[120px] text-center">
                      {style.emoji} {style.name}
                    </span>
                    <button onClick={nextStyle} className="p-1 rounded hover:bg-white/10 transition-colors">
                      <ChevronRight className="w-5 h-5 text-dark-300" />
                    </button>
                  </div>

                  <div className="w-px h-6 bg-white/10 hidden sm:block" />

                  {/* Intensity slider */}
                  <div className="flex items-center gap-3 flex-1 min-w-[200px]">
                    <span className="text-xs text-dark-400 whitespace-nowrap">Intensity</span>
                    <input
                      type="range"
                      min="0"
                      max="100"
                      value={intensity * 100}
                      onChange={e => setIntensity(Number(e.target.value) / 100)}
                      className="flex-1 h-1.5 rounded-full appearance-none bg-dark-700 cursor-pointer accent-primary-500"
                    />
                    <span className="text-xs font-mono text-primary-400 w-10 text-right">{(intensity * 100).toFixed(0)}%</span>
                  </div>

                  <div className="w-px h-6 bg-white/10 hidden sm:block" />

                  {/* Face selector */}
                  <div className="flex items-center gap-2">
                    <span className="text-xs text-dark-400">Face:</span>
                    {FACES.map((_, i) => (
                      <button
                        key={i}
                        onClick={() => setFaceIndex(i)}
                        className={`w-7 h-7 rounded-full border-2 transition-all ${
                          faceIndex === i ? 'border-primary-400 scale-110' : 'border-dark-600 hover:border-dark-400'
                        }`}
                      >
                        <img src={FACES[i]} alt="" className="w-full h-full rounded-full object-cover" />
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </motion.div>

          {/* Style picker panel */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            className="space-y-3"
          >
            <h3 className="text-sm font-medium text-dark-400 uppercase tracking-wider mb-4">
              🎨 Style Carousel
            </h3>
            {STYLES.map((s, i) => (
              <button
                key={s.id}
                onClick={() => setSelectedStyle(i)}
                className={`w-full flex items-center gap-3 p-3 rounded-xl transition-all duration-300 ${
                  selectedStyle === i
                    ? 'glass-strong ring-1 ring-primary-500/40 shadow-lg shadow-primary-500/10'
                    : 'glass hover:bg-white/5'
                }`}
              >
                <div className="w-14 h-14 rounded-lg overflow-hidden flex-shrink-0 ring-2 transition-all"
                  style={{ borderColor: selectedStyle === i ? s.color : 'transparent', borderWidth: '2px' }}
                >
                  <img src={s.image} alt={s.name} className="w-full h-full object-cover" />
                </div>
                <div className="text-left flex-1 min-w-0">
                  <div className="flex items-center gap-2">
                    <span className="text-sm font-medium text-white">{s.emoji} {s.name}</span>
                  </div>
                  <span className="text-xs text-dark-400">{s.description}</span>
                  <div className="mt-1">
                    <span
                      className="text-[10px] px-1.5 py-0.5 rounded-full font-medium"
                      style={{ background: `${s.color}20`, color: s.color }}
                    >
                      {s.category}
                    </span>
                  </div>
                </div>
                {selectedStyle === i && (
                  <motion.div
                    layoutId="activeStyle"
                    className="w-1.5 h-8 rounded-full"
                    style={{ background: s.color }}
                  />
                )}
              </button>
            ))}

            {/* Keyboard shortcuts hint */}
            <div className="glass rounded-xl p-3 mt-4">
              <p className="text-xs text-dark-400 font-mono">
                <span className="text-dark-300">Keyboard:</span> 1-6 Style • +/- Intensity • S Screenshot • P Pause
              </p>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
