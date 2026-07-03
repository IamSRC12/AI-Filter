import { useState } from 'react';
import { motion } from 'framer-motion';
import { Copy, Check, Terminal } from 'lucide-react';

const CODE_TABS = [
  {
    id: 'pipeline',
    label: 'Pipeline',
    filename: 'core/pipeline.py',
    language: 'python',
    code: `class RealTimeTransformPipeline:
    def process_frame(self, frame: np.ndarray) -> FrameResult:
        """Process single frame — Target: <33ms for 30 FPS"""
        t_start = time.perf_counter()
        
        # Stage 1: Detect faces (5ms)
        faces_raw = self.detector.detect(frame)
        
        # Stage 2: Track + Align (3ms)
        tracked = self.tracker.update(faces_raw, frame)
        aligned = [self.aligner.align(frame, f) for f in tracked]
        
        # Stage 3: Segment (2ms, parallel)
        seg_future = self.pool.submit(
            self.segmentor.segment_faces, frame, tracked
        )
        
        # Stage 4: Transform faces (15ms, GPU)
        transformed = self._transform_all_faces(
            aligned, self.current_style, self.intensity
        )
        
        # Stage 5: Temporal smoothing (2ms)
        smoothed = self.smoother.smooth_faces(transformed, tracked)
        
        # Stage 6: Composite back (3ms)
        segments = seg_future.result()
        result = self._composite_frame(
            frame, smoothed, tracked, segments
        )
        
        return FrameResult(
            transformed=result,
            fps=1.0 / (time.perf_counter() - t_start),
            ...
        )`,
  },
  {
    id: 'detector',
    label: 'Detection',
    filename: 'core/face_detector.py',
    language: 'python',
    code: `class HybridFaceDetector:
    """MediaPipe primary + RetinaFace fallback"""
    
    def detect(self, frame: np.ndarray) -> List[dict]:
        # Full detection every N frames, tracking between
        if self.frame_count % 3 == 0 or not self.last:
            faces = self._full_detect(frame)
        else:
            faces = self.roi_predictor.predict(self.last, frame)
        
        self.last_detections = faces
        return faces
    
    def _estimate_head_pose(self, landmarks_3d, h, w):
        """solvePnP for accurate 3D head pose"""
        model_pts = np.array([
            [0, 0, 0],         # Nose tip
            [-30, -30, -30],   # Left eye
            [30, -30, -30],    # Right eye
            ...
        ])
        success, rvec, tvec = cv2.solvePnP(
            model_pts, image_pts, cam_matrix, dist
        )
        rmat, _ = cv2.Rodrigues(rvec)
        angles, _, _, _, _, _ = cv2.RQDecomp3x3(rmat)
        return (angles[1], angles[0], angles[2])  # yaw, pitch, roll`,
  },
  {
    id: 'smoother',
    label: 'Smoothing',
    filename: 'optimization/temporal_smoother.py',
    language: 'python',
    code: `class TemporalSmoother:
    """Optical flow + EMA for zero-flicker output"""
    
    def _smooth_single_face(self, current, face_id):
        prev = self.face_history[face_id][-1]
        
        # Compute optical flow
        flow = cv2.calcOpticalFlowFarneback(
            prev_gray, curr_gray, None,
            pyr_scale=0.5, levels=3, winsize=15,
            iterations=3, poly_n=5, poly_sigma=1.2
        )
        
        # Warp previous to align with current
        flow_map = np.zeros_like(flow)
        flow_map[:,:,0] = np.arange(w)
        flow_map[:,:,1] = np.arange(h)[:, np.newaxis]
        flow_map += flow
        
        warped = cv2.remap(prev, flow_map[...,0], flow_map[...,1],
                           cv2.INTER_LINEAR)
        
        # Blend: current * alpha + warped_prev * (1-alpha)
        return cv2.addWeighted(current, 0.65, warped, 0.35, 0)`,
  },
  {
    id: 'blender',
    label: 'Compositing',
    filename: 'rendering/face_blender.py',
    language: 'python',
    code: `class SeamlessBlender:
    """Poisson blending + color matching"""
    
    def blend(self, background, face_transformed, face_data, ...):
        # Precise mask from 468 face landmarks
        mask = self._create_precise_mask(landmarks, size, offset)
        
        # LAB color space matching
        face_matched = self._match_color(face_resized, bg_roi)
        
        # Poisson seamless clone — invisible edges
        result = cv2.seamlessClone(
            face_matched, background, mask,
            center, cv2.MIXED_CLONE
        )
        return result
    
    def _match_color(self, transformed, original_roi):
        """Match color stats in LAB space"""
        orig_lab = cv2.cvtColor(original_roi, cv2.COLOR_BGR2LAB)
        trans_lab = cv2.cvtColor(transformed, cv2.COLOR_BGR2LAB)
        
        for c in range(3):
            ratio = 0.5  # 50% color matching strength
            trans_lab[:,:,c] = (
                trans_lab[:,:,c] * (1-ratio) +
                ((trans_lab[:,:,c] - t_mean) * 
                 (o_std / t_std) + o_mean) * ratio
            ).clip(0, 255)`,
  },
];

export default function CodeShowcase() {
  const [activeTab, setActiveTab] = useState('pipeline');
  const [copied, setCopied] = useState(false);

  const activeCode = CODE_TABS.find(t => t.id === activeTab)!;

  const handleCopy = () => {
    navigator.clipboard.writeText(activeCode.code);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <section id="code" className="relative py-24 px-4">
      <div className="max-w-5xl mx-auto">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-12"
        >
          <span className="text-sm font-medium text-cyber-400 uppercase tracking-wider">Source Code</span>
          <h2 className="text-4xl md:text-5xl font-bold mt-3 mb-4">
            <span className="text-white">Under the </span>
            <span className="text-gradient">Hood</span>
          </h2>
          <p className="text-dark-400 text-lg max-w-xl mx-auto">
            Clean, production-ready Python with type hints, docstrings, and comprehensive error handling.
          </p>
        </motion.div>

        {/* Code editor */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="glass rounded-2xl overflow-hidden shadow-2xl shadow-primary-500/5"
        >
          {/* Tab bar */}
          <div className="flex items-center justify-between px-4 py-2 border-b border-white/5 bg-dark-950/50">
            <div className="flex items-center gap-1">
              {CODE_TABS.map(tab => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`px-3 py-1.5 rounded-lg text-sm transition-all ${
                    activeTab === tab.id
                      ? 'bg-primary-500/20 text-primary-300 font-medium'
                      : 'text-dark-400 hover:text-dark-200 hover:bg-white/5'
                  }`}
                >
                  {tab.label}
                </button>
              ))}
            </div>
            <div className="flex items-center gap-3">
              <span className="text-xs text-dark-500 font-mono">{activeCode.filename}</span>
              <button
                onClick={handleCopy}
                className="p-1.5 rounded-lg hover:bg-white/10 transition-colors"
              >
                {copied ? (
                  <Check className="w-4 h-4 text-green-400" />
                ) : (
                  <Copy className="w-4 h-4 text-dark-400" />
                )}
              </button>
            </div>
          </div>

          {/* Code content */}
          <div className="overflow-x-auto p-6 bg-dark-950/80">
            <pre className="text-sm font-mono leading-relaxed">
              {activeCode.code.split('\n').map((line, i) => (
                <div key={`${activeTab}-${i}`} className="flex">
                  <span className="w-8 text-right pr-4 text-dark-600 select-none text-xs leading-relaxed">
                    {i + 1}
                  </span>
                  <span className="flex-1">
                    <CodeLine line={line} />
                  </span>
                </div>
              ))}
            </pre>
          </div>

          {/* Bottom bar */}
          <div className="flex items-center gap-4 px-4 py-2 border-t border-white/5 bg-dark-950/50">
            <div className="flex items-center gap-2">
              <Terminal className="w-3.5 h-3.5 text-dark-500" />
              <span className="text-xs text-dark-500 font-mono">Python 3.10+</span>
            </div>
            <span className="text-xs text-dark-600">|</span>
            <span className="text-xs text-dark-500">
              {activeCode.code.split('\n').length} lines
            </span>
          </div>
        </motion.div>
      </div>
    </section>
  );
}

function CodeLine({ line }: { line: string }) {
  // Simple syntax highlighting
  const highlighted = line
    .replace(/(class |def |return |from |import |if |else|for |in |not |and |or )/g, '<kw>$1</kw>')
    .replace(/(self)/g, '<self>$1</self>')
    .replace(/(#.*$)/gm, '<comment>$1</comment>')
    .replace(/(".*?"|'.*?')/g, '<str>$1</str>')
    .replace(/(\d+\.?\d*)/g, '<num>$1</num>')
    .replace(/(None|True|False)/g, '<const>$1</const>');

  const parts: React.ReactNode[] = [];
  let remaining = highlighted;
  let key = 0;

  const tagMap: Record<string, string> = {
    kw: 'text-primary-400',
    self: 'text-accent-400',
    comment: 'text-dark-500 italic',
    str: 'text-green-400',
    num: 'text-yellow-400',
    const: 'text-cyber-400',
  };

  const regex = /<(\w+)>(.*?)<\/\1>/g;
  let match;
  let lastIndex = 0;

  while ((match = regex.exec(remaining)) !== null) {
    if (match.index > lastIndex) {
      parts.push(
        <span key={key++} className="text-dark-200">
          {remaining.slice(lastIndex, match.index)}
        </span>
      );
    }
    parts.push(
      <span key={key++} className={tagMap[match[1]] || 'text-dark-200'}>
        {match[2]}
      </span>
    );
    lastIndex = match.index + match[0].length;
  }

  if (lastIndex < remaining.length) {
    parts.push(
      <span key={key++} className="text-dark-200">
        {remaining.slice(lastIndex)}
      </span>
    );
  }

  return <>{parts}</>;
}
