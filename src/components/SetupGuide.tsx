import { useState } from 'react';
import { motion } from 'framer-motion';
import { Terminal, Copy, Check } from 'lucide-react';

const SETUP_STEPS = [
  {
    step: 1,
    title: 'Environment Setup',
    commands: [
      '# Create virtual environment',
      'python -m venv venv',
      'source venv/bin/activate     # Linux/Mac',
      '',
      '# Install dependencies',
      'pip install -r requirements.txt',
    ],
  },
  {
    step: 2,
    title: 'Download Models',
    commands: [
      '# Download pretrained models from HuggingFace',
      'python -c "',
      '  from huggingface_hub import hf_hub_download',
      '  models = [',
      '    (\'bryandlee/animegan2-pytorch\', \'face_paint_512_v2.pt\'),',
      '  ]',
      '  for repo, f in models:',
      '    hf_hub_download(repo_id=repo, filename=f)',
      '"',
      '',
      '# Convert to ONNX (FP16)',
      'python export_models.py --model animegan --precision fp16',
    ],
  },
  {
    step: 3,
    title: 'Run Application',
    commands: [
      '# Start with default settings',
      'python main.py --style anime_shinkai --camera 0',
      '',
      '# With debug output',
      'python main.py --debug',
      '',
      '# Benchmark performance first',
      'python main.py --benchmark',
      '',
      '# Force CPU mode (no GPU)',
      'python main.py --no-gpu',
    ],
  },
];

const KEYBOARD_SHORTCUTS = [
  { key: '1', action: 'Anime (Shinkai)' },
  { key: '2', action: 'Pixar 3D' },
  { key: '3', action: 'Manga' },
  { key: '4', action: 'Disney' },
  { key: '5', action: 'Cyberpunk' },
  { key: '6', action: 'Watercolor' },
  { key: '7', action: 'Sketch' },
  { key: '8', action: 'Ghibli' },
  { key: '9', action: 'Chibi' },
  { key: '+/-', action: 'Intensity' },
  { key: 'S', action: 'Screenshot' },
  { key: 'P', action: 'Pause/Resume' },
  { key: 'Q', action: 'Quit' },
];

function CommandBlock({ commands, title }: { commands: string[]; title: string }) {
  const [copied, setCopied] = useState(false);

  const handleCopy = () => {
    const code = commands.filter(l => !l.startsWith('#') && l.trim()).join('\n');
    navigator.clipboard.writeText(code);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="rounded-xl bg-dark-950 border border-white/5 overflow-hidden">
      <div className="flex items-center justify-between px-4 py-2 border-b border-white/5">
        <div className="flex items-center gap-2">
          <Terminal className="w-3.5 h-3.5 text-dark-400" />
          <span className="text-xs text-dark-400 font-mono">{title}</span>
        </div>
        <button
          onClick={handleCopy}
          className="p-1 rounded hover:bg-white/10 transition-colors"
        >
          {copied ? (
            <Check className="w-3.5 h-3.5 text-green-400" />
          ) : (
            <Copy className="w-3.5 h-3.5 text-dark-400" />
          )}
        </button>
      </div>
      <div className="p-4 overflow-x-auto">
        <pre className="text-sm font-mono leading-relaxed">
          {commands.map((line, i) => (
            <div key={i}>
              {line.startsWith('#') ? (
                <span className="text-dark-500">{line}</span>
              ) : line.trim() === '' ? (
                <br />
              ) : (
                <span className="text-dark-200">
                  <span className="text-cyber-400 select-none">$ </span>
                  {line}
                </span>
              )}
            </div>
          ))}
        </pre>
      </div>
    </div>
  );
}

export default function SetupGuide() {
  return (
    <section id="setup" className="relative py-24 px-4">
      <div className="max-w-5xl mx-auto">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <span className="text-sm font-medium text-cyber-400 uppercase tracking-wider">Quick Start</span>
          <h2 className="text-4xl md:text-5xl font-bold mt-3 mb-4">
            <span className="text-white">Setup & </span>
            <span className="text-gradient">Run</span>
          </h2>
          <p className="text-dark-400 text-lg max-w-xl mx-auto">
            Get up and running in 3 steps. Requires Python 3.10+, CUDA-compatible GPU recommended.
          </p>
        </motion.div>

        <div className="grid lg:grid-cols-3 gap-6 mb-12">
          {SETUP_STEPS.map((step, i) => (
            <motion.div
              key={step.step}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.1 }}
              className="space-y-3"
            >
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-full bg-primary-500/20 border border-primary-500/30 flex items-center justify-center">
                  <span className="text-sm font-bold text-primary-400">{step.step}</span>
                </div>
                <h3 className="font-semibold text-white">{step.title}</h3>
              </div>
              <CommandBlock commands={step.commands} title={`Step ${step.step}`} />
            </motion.div>
          ))}
        </div>

        {/* Keyboard controls */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="glass rounded-2xl p-6"
        >
          <h3 className="font-semibold text-white mb-4 flex items-center gap-2">
            ⌨️ Keyboard Controls
          </h3>
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-3">
            {KEYBOARD_SHORTCUTS.map(shortcut => (
              <div
                key={shortcut.key}
                className="flex items-center gap-2 px-3 py-2 rounded-lg bg-dark-950/50 border border-white/5"
              >
                <kbd className="px-2 py-0.5 rounded bg-dark-800 border border-dark-600 text-xs font-mono text-primary-400 font-bold min-w-[28px] text-center">
                  {shortcut.key}
                </kbd>
                <span className="text-xs text-dark-300">{shortcut.action}</span>
              </div>
            ))}
          </div>
        </motion.div>
      </div>
    </section>
  );
}
