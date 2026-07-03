import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

const CATEGORIES = [
  { id: 'all', name: 'All Styles', emoji: '🎭' },
  { id: 'anime', name: 'Anime', emoji: '🎌' },
  { id: 'cartoon_3d', name: '3D Cartoon', emoji: '🧸' },
  { id: 'comic', name: 'Comic', emoji: '📖' },
  { id: 'artistic', name: 'Artistic', emoji: '🎨' },
  { id: 'scifi', name: 'Sci-Fi', emoji: '🤖' },
];

const ALL_STYLES = [
  {
    id: 'anime_shinkai',
    name: 'Shinkai',
    category: 'anime',
    description: 'Makoto Shinkai style (Your Name, Weathering With You)',
    image: '/images/anime-style.jpg',
    inputSize: '512×512',
    precision: 'FP16',
    color: '#7c5cff',
  },
  {
    id: 'anime_ghibli',
    name: 'Ghibli',
    category: 'anime',
    description: 'Studio Ghibli warm, hand-drawn aesthetic',
    image: '/images/anime-style.jpg',
    inputSize: '512×512',
    precision: 'FP16',
    color: '#4ade80',
  },
  {
    id: 'anime_shonen',
    name: 'Shonen',
    category: 'anime',
    description: 'Bold action anime style with dynamic lines',
    image: '/images/anime-style.jpg',
    inputSize: '256×256',
    precision: 'FP16',
    color: '#f97316',
  },
  {
    id: 'anime_chibi',
    name: 'Chibi',
    category: 'anime',
    description: 'Super deformed cute style',
    image: '/images/anime-style.jpg',
    inputSize: '256×256',
    precision: 'FP16',
    color: '#f472b6',
  },
  {
    id: 'anime_webtoon',
    name: 'Webtoon',
    category: 'anime',
    description: 'Korean webtoon digital art style',
    image: '/images/anime-style.jpg',
    inputSize: '512×512',
    precision: 'FP16',
    color: '#38bdf8',
  },
  {
    id: 'cartoon_pixar',
    name: 'Pixar',
    category: 'cartoon_3d',
    description: 'Pixar movie 3D character render',
    image: '/images/pixar-style.jpg',
    inputSize: '512×512',
    precision: 'FP16',
    color: '#ff6b9d',
  },
  {
    id: 'cartoon_disney',
    name: 'Disney',
    category: 'cartoon_3d',
    description: 'Disney classic animation style',
    image: '/images/disney-style.jpg',
    inputSize: '512×512',
    precision: 'FP16',
    color: '#ffd700',
  },
  {
    id: 'cartoon_clay',
    name: 'Clay',
    category: 'cartoon_3d',
    description: 'Clay / stop-motion sculpted look',
    image: '/images/pixar-style.jpg',
    inputSize: '256×256',
    precision: 'FP16',
    color: '#d97706',
  },
  {
    id: 'cartoon_lowpoly',
    name: 'Low Poly',
    category: 'cartoon_3d',
    description: 'Low-polygon geometric art style',
    image: '/images/pixar-style.jpg',
    inputSize: '256×256',
    precision: 'FP16',
    color: '#22d3ee',
  },
  {
    id: 'comic_manga',
    name: 'Manga',
    category: 'comic',
    description: 'Japanese manga black & white ink',
    image: '/images/manga-style.jpg',
    inputSize: '512×512',
    precision: 'FP16',
    color: '#e0e0e0',
  },
  {
    id: 'comic_marvel',
    name: 'Marvel',
    category: 'comic',
    description: 'Western superhero comic book',
    image: '/images/manga-style.jpg',
    inputSize: '256×256',
    precision: 'FP16',
    color: '#ef4444',
  },
  {
    id: 'art_watercolor',
    name: 'Watercolor',
    category: 'artistic',
    description: 'Delicate watercolor portrait painting',
    image: '/images/watercolor-style.jpg',
    inputSize: '512×512',
    precision: 'FP16',
    color: '#87ceeb',
  },
  {
    id: 'art_oil_paint',
    name: 'Oil Paint',
    category: 'artistic',
    description: 'Classical oil painting portrait',
    image: '/images/watercolor-style.jpg',
    inputSize: '512×512',
    precision: 'FP16',
    color: '#b8860b',
  },
  {
    id: 'art_sketch',
    name: 'Sketch',
    category: 'artistic',
    description: 'Pencil sketch line drawing',
    image: '/images/manga-style.jpg',
    inputSize: '256×256',
    precision: 'FP16',
    color: '#a0a0a0',
  },
  {
    id: 'scifi_cyberpunk',
    name: 'Cyberpunk',
    category: 'scifi',
    description: 'Neon cyberpunk futuristic aesthetic',
    image: '/images/cyberpunk-style.jpg',
    inputSize: '512×512',
    precision: 'FP16',
    color: '#00ffd5',
  },
  {
    id: 'scifi_fantasy',
    name: 'Fantasy',
    category: 'scifi',
    description: 'Fantasy elf / warrior transformation',
    image: '/images/cyberpunk-style.jpg',
    inputSize: '512×512',
    precision: 'FP16',
    color: '#a855f7',
  },
  {
    id: 'comic_retro',
    name: 'Retro',
    category: 'comic',
    description: 'Retro pop-art comic style',
    image: '/images/manga-style.jpg',
    inputSize: '256×256',
    precision: 'FP16',
    color: '#fb923c',
  },
];

export default function StyleGallery() {
  const [activeCategory, setActiveCategory] = useState('all');
  const [hoveredStyle, setHoveredStyle] = useState<string | null>(null);

  const filtered = activeCategory === 'all'
    ? ALL_STYLES
    : ALL_STYLES.filter(s => s.category === activeCategory);

  return (
    <section id="styles" className="relative py-24 px-4">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-12"
        >
          <span className="text-sm font-medium text-yellow-400 uppercase tracking-wider">Model Registry</span>
          <h2 className="text-4xl md:text-5xl font-bold mt-3 mb-4">
            <span className="text-white">17+ </span>
            <span className="text-gradient">Transformation Styles</span>
          </h2>
          <p className="text-dark-400 text-lg max-w-xl mx-auto">
            Each style is a trained GAN model (AnimeGAN, StyleGAN variants) converted to ONNX
            with FP16 precision for real-time inference.
          </p>
        </motion.div>

        {/* Category tabs */}
        <div className="flex flex-wrap justify-center gap-2 mb-10">
          {CATEGORIES.map(cat => (
            <button
              key={cat.id}
              onClick={() => setActiveCategory(cat.id)}
              className={`px-4 py-2 rounded-full text-sm font-medium transition-all duration-300 ${
                activeCategory === cat.id
                  ? 'bg-primary-500 text-white shadow-lg shadow-primary-500/25'
                  : 'glass text-dark-300 hover:text-white hover:bg-white/5'
              }`}
            >
              {cat.emoji} {cat.name}
            </button>
          ))}
        </div>

        {/* Style grid */}
        <motion.div layout className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
          <AnimatePresence mode="popLayout">
            {filtered.map(style => (
              <motion.div
                key={style.id}
                layout
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.9 }}
                transition={{ duration: 0.3 }}
                className="style-card glass rounded-xl overflow-hidden cursor-pointer group"
                onMouseEnter={() => setHoveredStyle(style.id)}
                onMouseLeave={() => setHoveredStyle(null)}
              >
                {/* Image */}
                <div className="relative aspect-square overflow-hidden">
                  <img
                    src={style.image}
                    alt={style.name}
                    className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                  />
                  {/* Overlay */}
                  <div className={`absolute inset-0 bg-gradient-to-t from-dark-950/90 via-dark-950/20 to-transparent transition-opacity duration-300 ${
                    hoveredStyle === style.id ? 'opacity-100' : 'opacity-60'
                  }`} />

                  {/* Active indicator */}
                  {hoveredStyle === style.id && (
                    <motion.div
                      initial={{ opacity: 0, scale: 0.8 }}
                      animate={{ opacity: 1, scale: 1 }}
                      className="absolute inset-0 flex items-center justify-center"
                    >
                      <div className="px-4 py-2 rounded-lg bg-black/60 backdrop-blur-sm border border-white/10">
                        <span className="text-sm font-medium text-white">Preview Style</span>
                      </div>
                    </motion.div>
                  )}

                  {/* Tech badges */}
                  <div className="absolute top-2 right-2 flex flex-col gap-1">
                    <span className="text-[10px] px-1.5 py-0.5 rounded bg-black/60 text-dark-200 font-mono">
                      {style.inputSize}
                    </span>
                    <span className="text-[10px] px-1.5 py-0.5 rounded bg-black/60 font-mono" style={{ color: style.color }}>
                      {style.precision}
                    </span>
                  </div>
                </div>

                {/* Info */}
                <div className="p-3">
                  <div className="flex items-center justify-between mb-1">
                    <h4 className="font-semibold text-sm text-white">{style.name}</h4>
                    <div
                      className="w-2.5 h-2.5 rounded-full"
                      style={{ background: style.color }}
                    />
                  </div>
                  <p className="text-xs text-dark-400 line-clamp-2">{style.description}</p>
                </div>
              </motion.div>
            ))}
          </AnimatePresence>
        </motion.div>
      </div>
    </section>
  );
}
