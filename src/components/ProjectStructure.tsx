import { useState } from 'react';
import { motion } from 'framer-motion';
import { Folder, FolderOpen, FileText, ChevronRight, ChevronDown } from 'lucide-react';

interface TreeNode {
  name: string;
  type: 'folder' | 'file';
  description?: string;
  children?: TreeNode[];
  color?: string;
}

const PROJECT_TREE: TreeNode[] = [
  {
    name: 'core/',
    type: 'folder',
    color: '#7c5cff',
    children: [
      { name: 'pipeline.py', type: 'file', description: 'Master processing pipeline' },
      { name: 'face_detector.py', type: 'file', description: 'Multi-model face detection' },
      { name: 'face_aligner.py', type: 'file', description: '3D face alignment' },
      { name: 'face_segmentor.py', type: 'file', description: 'Hair/skin/bg segmentation' },
      { name: 'face_tracker.py', type: 'file', description: 'Kalman temporal tracking' },
      { name: 'camera_manager.py', type: 'file', description: 'Triple-buffered camera' },
    ],
  },
  {
    name: 'models/',
    type: 'folder',
    color: '#ff4081',
    children: [
      { name: 'base_model.py', type: 'file', description: 'Abstract model base' },
      { name: 'anime_transformer.py', type: 'file', description: 'AnimeGAN v3' },
      { name: 'pixar_transformer.py', type: 'file', description: 'Pixar 3D style' },
      { name: 'manga_transformer.py', type: 'file', description: 'Manga/Comic' },
      { name: 'disney_transformer.py', type: 'file', description: 'Disney classic' },
      { name: 'cyberpunk_transformer.py', type: 'file', description: 'Sci-fi styles' },
      { name: 'model_manager.py', type: 'file', description: 'Load/switch/cache models' },
    ],
  },
  {
    name: 'optimization/',
    type: 'folder',
    color: '#00ffd5',
    children: [
      { name: 'tensorrt_engine.py', type: 'file', description: 'TensorRT optimization' },
      { name: 'quantizer.py', type: 'file', description: 'INT8/FP16 quantization' },
      { name: 'temporal_smoother.py', type: 'file', description: 'Anti-flicker smoothing' },
      { name: 'frame_interpolator.py', type: 'file', description: 'RIFE interpolation' },
      { name: 'gpu_manager.py', type: 'file', description: 'GPU memory management' },
    ],
  },
  {
    name: 'rendering/',
    type: 'folder',
    color: '#ffd700',
    children: [
      { name: 'face_blender.py', type: 'file', description: 'Seamless compositing' },
      { name: 'face_3d_renderer.py', type: 'file', description: 'Neural rendering' },
      { name: 'lighting_engine.py', type: 'file', description: 'Real-time lighting' },
      { name: 'background_handler.py', type: 'file', description: 'BG replacement' },
    ],
  },
  {
    name: 'mobile/',
    type: 'folder',
    color: '#87ceeb',
    children: [
      {
        name: 'ios/', type: 'folder', children: [
          { name: 'FaceTransformPlugin.swift', type: 'file', description: 'iOS plugin' },
          { name: 'MetalRenderer.swift', type: 'file', description: 'Metal GPU' },
          { name: 'CoreMLManager.swift', type: 'file', description: 'CoreML inference' },
        ],
      },
      {
        name: 'android/', type: 'folder', children: [
          { name: 'FaceTransformPlugin.kt', type: 'file', description: 'Android plugin' },
          { name: 'NNAPIManager.kt', type: 'file', description: 'NNAPI runtime' },
        ],
      },
    ],
  },
  {
    name: 'api/',
    type: 'folder',
    color: '#f97316',
    children: [
      { name: 'server.py', type: 'file', description: 'FastAPI backend' },
      { name: 'websocket_handler.py', type: 'file', description: 'WebSocket streaming' },
      { name: 'inference_server.py', type: 'file', description: 'Triton server config' },
    ],
  },
  { name: 'config.yaml', type: 'file', description: 'Global configuration' },
  { name: 'requirements.txt', type: 'file', description: 'Python dependencies' },
  { name: 'main.py', type: 'file', description: 'Entry point' },
];

function TreeItem({ node, depth = 0 }: { node: TreeNode; depth?: number }) {
  const [open, setOpen] = useState(depth < 1);
  const isFolder = node.type === 'folder';

  return (
    <div>
      <button
        onClick={() => isFolder && setOpen(!open)}
        className={`w-full flex items-center gap-2 py-1.5 px-2 rounded-lg text-sm transition-colors hover:bg-white/5 ${
          isFolder ? 'cursor-pointer' : 'cursor-default'
        }`}
        style={{ paddingLeft: `${depth * 16 + 8}px` }}
      >
        {isFolder ? (
          <>
            {open ? (
              <ChevronDown className="w-3.5 h-3.5 text-dark-400 flex-shrink-0" />
            ) : (
              <ChevronRight className="w-3.5 h-3.5 text-dark-400 flex-shrink-0" />
            )}
            {open ? (
              <FolderOpen className="w-4 h-4 flex-shrink-0" style={{ color: node.color || '#ffd700' }} />
            ) : (
              <Folder className="w-4 h-4 flex-shrink-0" style={{ color: node.color || '#ffd700' }} />
            )}
          </>
        ) : (
          <>
            <span className="w-3.5 flex-shrink-0" />
            <FileText className="w-4 h-4 text-dark-400 flex-shrink-0" />
          </>
        )}
        <span className={`font-mono text-xs ${isFolder ? 'text-white font-medium' : 'text-dark-300'}`}>
          {node.name}
        </span>
        {node.description && (
          <span className="text-xs text-dark-500 ml-2 truncate hidden sm:inline">
            — {node.description}
          </span>
        )}
      </button>
      {isFolder && open && node.children && (
        <motion.div
          initial={{ opacity: 0, height: 0 }}
          animate={{ opacity: 1, height: 'auto' }}
          exit={{ opacity: 0, height: 0 }}
          transition={{ duration: 0.2 }}
        >
          {node.children.map((child, i) => (
            <TreeItem key={`${child.name}-${i}`} node={child} depth={depth + 1} />
          ))}
        </motion.div>
      )}
    </div>
  );
}

export default function ProjectStructure() {
  return (
    <section id="structure" className="relative py-24 px-4">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-12"
        >
          <span className="text-sm font-medium text-accent-400 uppercase tracking-wider">Project Layout</span>
          <h2 className="text-4xl md:text-5xl font-bold mt-3 mb-4">
            <span className="text-white">Clean </span>
            <span className="text-gradient">Architecture</span>
          </h2>
          <p className="text-dark-400 text-lg max-w-xl mx-auto">
            Modular design with separated concerns: detection, transformation, optimization, rendering, and UI.
          </p>
        </motion.div>

        {/* File tree */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="glass rounded-2xl overflow-hidden"
        >
          {/* Title bar */}
          <div className="flex items-center gap-3 px-4 py-3 border-b border-white/5 bg-dark-950/50">
            <div className="flex gap-1.5">
              <div className="w-3 h-3 rounded-full bg-red-500" />
              <div className="w-3 h-3 rounded-full bg-yellow-500" />
              <div className="w-3 h-3 rounded-full bg-green-500" />
            </div>
            <span className="text-sm text-dark-400 font-mono">face-transform-ultimate/</span>
          </div>

          {/* Tree */}
          <div className="p-4 max-h-[500px] overflow-y-auto">
            {PROJECT_TREE.map((node, i) => (
              <TreeItem key={`${node.name}-${i}`} node={node} />
            ))}
          </div>

          {/* Stats */}
          <div className="flex flex-wrap items-center gap-6 px-4 py-3 border-t border-white/5 bg-dark-950/50">
            <span className="text-xs text-dark-400">
              📁 <span className="text-dark-300 font-medium">6 modules</span>
            </span>
            <span className="text-xs text-dark-400">
              📄 <span className="text-dark-300 font-medium">30+ files</span>
            </span>
            <span className="text-xs text-dark-400">
              🧠 <span className="text-dark-300 font-medium">17 AI models</span>
            </span>
            <span className="text-xs text-dark-400">
              📱 <span className="text-dark-300 font-medium">3 platforms</span>
            </span>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
