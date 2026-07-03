import { motion } from 'framer-motion';

const TECH_CATEGORIES = [
  {
    title: 'Core',
    items: [
      { name: 'PyTorch', version: '≥2.0', color: '#ee4c2c' },
      { name: 'ONNX Runtime', version: '≥1.16', color: '#005CED' },
      { name: 'OpenCV', version: '≥4.8', color: '#5C3EE8' },
      { name: 'NumPy', version: '≥1.24', color: '#013243' },
      { name: 'MediaPipe', version: '≥0.10', color: '#0097A7' },
    ],
  },
  {
    title: 'Face Analysis',
    items: [
      { name: 'InsightFace', version: '≥0.7', color: '#E91E63' },
      { name: 'Albumentations', version: '≥1.3', color: '#4CAF50' },
      { name: 'Pillow', version: '≥10.0', color: '#FF5722' },
    ],
  },
  {
    title: 'Optimization',
    items: [
      { name: 'TensorRT', version: '≥8.6', color: '#76B900' },
      { name: 'PyCUDA', version: '≥2022', color: '#76B900' },
      { name: 'ONNX', version: '≥1.14', color: '#005CED' },
    ],
  },
  {
    title: 'API / Server',
    items: [
      { name: 'FastAPI', version: '≥0.100', color: '#009688' },
      { name: 'Uvicorn', version: '≥0.23', color: '#2196F3' },
      { name: 'WebSockets', version: '≥11.0', color: '#FF9800' },
    ],
  },
];

export default function TechStack() {
  return (
    <section className="relative py-20 px-4">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-12"
        >
          <span className="text-sm font-medium text-dark-400 uppercase tracking-wider">Dependencies</span>
          <h2 className="text-3xl md:text-4xl font-bold mt-3 mb-4">
            <span className="text-white">Tech </span>
            <span className="text-gradient">Stack</span>
          </h2>
        </motion.div>

        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
          {TECH_CATEGORIES.map((cat, ci) => (
            <motion.div
              key={cat.title}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: ci * 0.1 }}
              className="glass rounded-xl p-5"
            >
              <h3 className="font-semibold text-white text-sm mb-4 uppercase tracking-wider">{cat.title}</h3>
              <div className="space-y-2">
                {cat.items.map(item => (
                  <div
                    key={item.name}
                    className="flex items-center justify-between px-3 py-2 rounded-lg bg-dark-950/40 hover:bg-dark-950/60 transition-colors"
                  >
                    <div className="flex items-center gap-2">
                      <div
                        className="w-2 h-2 rounded-full"
                        style={{ background: item.color }}
                      />
                      <span className="text-sm text-dark-200">{item.name}</span>
                    </div>
                    <span className="text-xs font-mono text-dark-400">{item.version}</span>
                  </div>
                ))}
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
