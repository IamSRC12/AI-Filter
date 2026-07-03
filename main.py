import os
import sys
import time
import argparse
import numpy as np
import cv2

# Global configuration
STYLES = {
    '1': {'name': 'Anime Shinkai', 'type': 'onnx', 'model_name': 'face_paint_512_v2.onnx', 'color': (255, 92, 124)},
    '2': {'name': 'Pixar 3D', 'type': 'onnx', 'model_name': 'paprika.onnx', 'color': (157, 107, 255)},
    '3': {'name': 'Manga B&W', 'type': 'classical', 'color': (220, 220, 220)},
    '4': {'name': 'Disney Classic', 'type': 'onnx', 'model_name': 'celeba_distill.onnx', 'color': (0, 215, 255)},
    '5': {'name': 'Cyberpunk', 'type': 'classical', 'color': (213, 255, 0)},
    '6': {'name': 'Watercolor', 'type': 'classical', 'color': (235, 206, 135)},
    '7': {'name': 'Sketch', 'type': 'classical', 'color': (180, 180, 180)},
    '8': {'name': 'Ghibli Style', 'type': 'onnx', 'model_name': 'face_paint_512_v2.onnx', 'color': (100, 255, 100), 'warm_filter': True},
    '9': {'name': 'Cartoonize', 'type': 'classical', 'color': (255, 150, 50)}
}

def apply_classical_style(img, style_key):
    if style_key == '3':  # Manga B&W
        gray = cv2.cvtColor(img, cv2.COLOR_BGR2GRAY)
        # Apply adaptive thresholding for ink/manga halftone feel
        manga = cv2.adaptiveThreshold(gray, 255, cv2.ADAPTIVE_THRESH_GAUSSIAN_C, cv2.THRESH_BINARY, 11, 2)
        return cv2.cvtColor(manga, cv2.COLOR_GRAY2BGR)
        
    elif style_key == '5':  # Cyberpunk
        # Shift channels to raise blues/pinks
        img_hsv = cv2.cvtColor(img, cv2.COLOR_BGR2HSV)
        h, s, v = cv2.split(img_hsv)
        # Shift hue to cyber pink/cyan range
        h = np.mod(h + 30, 180).astype(np.uint8)
        s = np.clip(s * 1.5, 0, 255).astype(np.uint8)
        v = np.clip(v * 1.1, 0, 255).astype(np.uint8)
        cyber = cv2.merge([h, s, v])
        cyber_bgr = cv2.cvtColor(cyber, cv2.COLOR_HSV2BGR)
        # Blend with edges
        gray = cv2.cvtColor(img, cv2.COLOR_BGR2GRAY)
        edges = cv2.Canny(gray, 50, 150)
        edges_color = cv2.merge([edges, np.zeros_like(edges), edges]) # Pink edges
        return cv2.addWeighted(cyber_bgr, 0.9, edges_color, 0.3, 0)
        
    elif style_key == '6':  # Watercolor
        # High bilateral filtering to smooth details but preserve edges
        smoothed = cv2.bilateralFilter(img, 9, 75, 75)
        # Boost saturation
        smoothed_hsv = cv2.cvtColor(smoothed, cv2.COLOR_BGR2HSV)
        h, s, v = cv2.split(smoothed_hsv)
        s = np.clip(s * 1.4, 0, 255).astype(np.uint8)
        water = cv2.merge([h, s, v])
        return cv2.cvtColor(water, cv2.COLOR_HSV2BGR)
        
    elif style_key == '7':  # Sketch
        gray = cv2.cvtColor(img, cv2.COLOR_BGR2GRAY)
        gray_inv = 255 - gray
        blur = cv2.GaussianBlur(gray_inv, (21, 21), 0)
        blur_inv = 255 - blur
        sketch = cv2.divide(gray, blur_inv, scale=256.0)
        return cv2.cvtColor(sketch, cv2.COLOR_GRAY2BGR)
        
    elif style_key == '9':  # Cartoonize
        # Bilateral filter + adaptive edges
        num_down = 2
        num_bilateral = 7
        
        img_color = img.copy()
        for _ in range(num_down):
            img_color = cv2.pyrDown(img_color)
            
        for _ in range(num_bilateral):
            img_color = cv2.bilateralFilter(img_color, d=9, sigmaColor=9, sigmaSpace=7)
            
        for _ in range(num_down):
            img_color = cv2.pyrUp(img_color)
            
        if img_color.shape != img.shape:
            img_color = cv2.resize(img_color, (img.shape[1], img.shape[0]))
            
        gray = cv2.cvtColor(img, cv2.COLOR_BGR2GRAY)
        blur = cv2.medianBlur(gray, 7)
        edges = cv2.adaptiveThreshold(blur, 255, cv2.ADAPTIVE_THRESH_MEAN_C, cv2.THRESH_BINARY, 9, 2)
        edges_bgr = cv2.cvtColor(edges, cv2.COLOR_GRAY2BGR)
        
        return cv2.bitwise_and(img_color, edges_bgr)
        
    return img

class InferenceEngine:
    def __init__(self, models_dir, use_gpu=True):
        self.models_dir = models_dir
        self.use_gpu = use_gpu
        self.sessions = {}
        self.import_onnxruntime()

    def import_onnxruntime(self):
        try:
            global ort
            import onnxruntime as ort
        except ImportError:
            print("onnxruntime is not installed. Attempting to run with fallback classical styles only.")
            ort = None

    def get_session(self, model_name):
        if ort is None:
            return None
            
        if model_name not in self.sessions:
            model_path = os.path.join(self.models_dir, model_name)
            if not os.path.exists(model_path):
                print(f"Model file not found at {model_path}. Please run 'python export_models.py' first.")
                return None
                
            providers = ['CPUExecutionProvider']
            if self.use_gpu and 'CUDAExecutionProvider' in ort.get_available_providers():
                providers = ['CUDAExecutionProvider'] + providers
                
            try:
                print(f"Loading ONNX model: {model_name} with providers {providers}")
                self.sessions[model_name] = ort.InferenceSession(model_path, providers=providers)
            except Exception as e:
                print(f"Error loading ONNX session: {e}")
                return None
                
        return self.sessions[model_name]

    def run_inference(self, face_bgr, model_name):
        session = self.get_session(model_name)
        if session is None:
            return None
            
        # Preprocessing: resize to 512x512, BGR to RGB, normalize to [-1, 1], transpose to CHW
        h, w = face_bgr.shape[:2]
        face_resized = cv2.resize(face_bgr, (512, 512))
        face_rgb = cv2.cvtColor(face_resized, cv2.COLOR_BGR2RGB)
        face_norm = (face_rgb.astype(np.float32) / 127.5) - 1.0
        face_input = np.transpose(face_norm, (2, 0, 1))
        face_input = np.expand_dims(face_input, axis=0)
        
        # Inference
        inputs = {session.get_inputs()[0].name: face_input}
        outputs = session.run(None, inputs)
        
        # Postprocessing: transpose back, rescale to [0, 255], RGB to BGR
        out = outputs[0][0]
        out = np.transpose(out, (1, 2, 0))
        out = (out + 1.0) * 127.5
        out = np.clip(out, 0, 255).astype(np.uint8)
        out_bgr = cv2.cvtColor(out, cv2.COLOR_RGB2BGR)
        
        # Resize back to original face crop size
        return cv2.resize(out_bgr, (w, h))

def main():
    parser = argparse.ArgumentParser(description="Real-Time AI Face Transformation App")
    parser.add_argument("--style", type=str, default="1", choices=list(STYLES.keys()),
                        help="Initial style filter key (1-9)")
    parser.add_argument("--camera", type=int, default=0,
                        help="Camera source index (default: 0)")
    parser.add_argument("--no-gpu", action="store_true",
                        help="Force CPU execution")
    parser.add_argument("--debug", action="store_true",
                        help="Show extra debugging information")
    parser.add_argument("--benchmark", action="store_true",
                        help="Run startup model speed benchmark")
    args = parser.parse_args()

    models_dir = os.path.join(os.path.dirname(__file__), "models")
    
    # Initialize inference engine
    engine = InferenceEngine(models_dir, use_gpu=not args.no_gpu)
    
    # Pre-check/auto-download face cascades
    cascade_path = cv2.data.haarcascades + 'haarcascade_frontalface_default.xml'
    face_cascade = cv2.CascadeClassifier(cascade_path)
    if face_cascade.empty():
        print("Error: Could not load Haar cascade classifier.")
        sys.exit(1)
        
    # Start Video Capture
    print(f"Opening camera index {args.camera}...")
    cap = cv2.VideoCapture(args.camera)
    if not cap.isOpened():
        print(f"Error: Could not open camera {args.camera}.")
        sys.exit(1)

    # Set camera resolution (optional, default standard)
    cap.set(cv2.CAP_PROP_FRAME_WIDTH, 640)
    cap.set(cv2.CAP_PROP_FRAME_HEIGHT, 480)

    # Warmup / Benchmark if requested
    if args.benchmark and not args.no_gpu:
        print("Benchmarking ONNX inference performance...")
        dummy_face = np.random.randint(0, 255, (256, 256, 3), dtype=np.uint8)
        t0 = time.time()
        for _ in range(10):
            engine.run_inference(dummy_face, STYLES['1']['model_name'])
        t1 = time.time()
        print(f"Benchmark average latency: {(t1 - t0) * 100:.2f} ms")

    current_style_key = args.style
    intensity = 1.0
    is_paused = False
    frame_count = 0
    fps_smooth = 30.0

    print("\n=== Controls ===")
    print("1-9: Switch styles")
    print("+/-: Adjust style intensity")
    print("S  : Take screenshot")
    print("P  : Pause / Resume")
    print("Q  : Quit application")
    print("================")

    cv2.namedWindow("FaceTransform AI", cv2.WINDOW_NORMAL)

    while True:
        if not is_paused:
            ret, frame = cap.read()
            if not ret:
                print("Failed to grab frame.")
                break
                
            frame = cv2.flip(frame, 1) # Mirror horizontal
            display_frame = frame.copy()
            h, w = frame.shape[:2]
            
            t_start = time.time()
            
            # Detect faces
            gray = cv2.cvtColor(frame, cv2.COLOR_BGR2GRAY)
            faces = face_cascade.detectMultiScale(gray, scaleFactor=1.2, minNeighbors=5, minSize=(80, 80))
            
            selected_style = STYLES[current_style_key]
            
            # Run transformation for each face
            for (x, y, fw, fh) in faces:
                # Add a little padding to the crop box for better neural network framing
                pad_x = int(fw * 0.1)
                pad_y = int(fh * 0.15)
                
                x1 = max(0, x - pad_x)
                y1 = max(0, y - pad_y)
                x2 = min(w, x + fw + pad_x)
                y2 = min(h, y + fh + pad_y)
                
                face_crop = frame[y1:y2, x1:x2]
                if face_crop.size == 0:
                    continue
                    
                transformed_face = None
                
                # Apply style logic
                if selected_style['type'] == 'onnx':
                    transformed_face = engine.run_inference(face_crop, selected_style['model_name'])
                    if transformed_face is not None and selected_style.get('warm_filter'):
                        # Apply Ghibli warm filter styling (bump red/yellow slightly)
                        transformed_face = cv2.transform(transformed_face, np.array([
                            [0.9, 0.05, 0.15],
                            [0.0, 1.0, 0.0],
                            [0.0, 0.0, 1.1]
                        ]))
                        transformed_face = np.clip(transformed_face, 0, 255).astype(np.uint8)
                else:
                    transformed_face = apply_classical_style(face_crop, current_style_key)
                    
                if transformed_face is not None:
                    # Apply blend intensity
                    if intensity < 1.0:
                        blended = cv2.addWeighted(face_crop, 1.0 - intensity, transformed_face, intensity, 0)
                    else:
                        blended = transformed_face
                        
                    display_frame[y1:y2, x1:x2] = blended
                    
                # Draw high-tech HUD framing around faces
                cv2.rectangle(display_frame, (x, y), (x + fw, y + fh), selected_style['color'], 2)
                # Cybernetic corner lines
                line_len = int(fw * 0.2)
                cv2.line(display_frame, (x, y), (x + line_len, y), selected_style['color'], 4)
                cv2.line(display_frame, (x, y), (x, y + line_len), selected_style['color'], 4)
                cv2.line(display_frame, (x + fw, y), (x + fw - line_len, y), selected_style['color'], 4)
                cv2.line(display_frame, (x + fw, y), (x + fw, y + line_len), selected_style['color'], 4)
                cv2.line(display_frame, (x, y + fh), (x + line_len, y + fh), selected_style['color'], 4)
                cv2.line(display_frame, (x, y + fh), (x, y + fh - line_len), selected_style['color'], 4)
                cv2.line(display_frame, (x + fw, y + fh), (x + fw - line_len, y + fh), selected_style['color'], 4)
                cv2.line(display_frame, (x + fw, y + fh), (x + fw, y + fh - line_len), selected_style['color'], 4)

            # Performance stats
            t_end = time.time()
            latency = (t_end - t_start) * 1000.0
            fps = 1.0 / max((t_end - t_start), 0.001)
            fps_smooth = 0.9 * fps_smooth + 0.1 * fps
            frame_count += 1
            
            # --- Rendering Premium HUD Overlay ---
            # Top status bar
            cv2.rectangle(display_frame, (0, 0), (w, 35), (20, 20, 20), -1)
            cv2.line(display_frame, (0, 35), (w, 35), selected_style['color'], 1)
            cv2.putText(display_frame, f"FaceTransform AI v1.0.0", (15, 23),
                        cv2.FONT_HERSHEY_SIMPLEX, 0.5, (255, 255, 255), 1, cv2.LINE_AA)
            
            # Active style label
            cv2.putText(display_frame, f"Active Style: {selected_style['name']}", (w - 280, 23),
                        cv2.FONT_HERSHEY_SIMPLEX, 0.5, selected_style['color'], 2, cv2.LINE_AA)
            
            # Left sidebar dashboard (HUD info panel)
            hud_bg = display_frame.copy()
            cv2.rectangle(hud_bg, (15, 55), (210, 240), (10, 10, 10), -1)
            cv2.addWeighted(hud_bg, 0.65, display_frame, 0.35, 0, display_frame)
            cv2.rectangle(display_frame, (15, 55), (210, 240), selected_style['color'], 1)
            
            # Write metrics
            metrics = [
                f"FPS: {fps_smooth:.1f}",
                f"Latency: {latency:.1f}ms",
                f"Intensity: {int(intensity * 100)}%",
                f"Frames: {frame_count}",
                f"Faces: {len(faces)}"
            ]
            for idx, text in enumerate(metrics):
                cv2.putText(display_frame, text, (25, 80 + idx * 25),
                            cv2.FONT_HERSHEY_SIMPLEX, 0.45, (230, 230, 230), 1, cv2.LINE_AA)
                            
            # Show standard status dots (green live light)
            cv2.circle(display_frame, (25, 215), 5, (0, 255, 0), -1)
            cv2.putText(display_frame, "LIVE MODE", (37, 220),
                        cv2.FONT_HERSHEY_SIMPLEX, 0.4, (0, 255, 0), 1, cv2.LINE_AA)

            # Help overlay in bottom corner
            cv2.putText(display_frame, "Keys: 1-9 Style | +/- Intensity | S Shot | P Pause | Q Quit",
                        (15, h - 15), cv2.FONT_HERSHEY_SIMPLEX, 0.4, (200, 200, 200), 1, cv2.LINE_AA)

        # Handle UI Keypresses
        key = cv2.waitKey(1) & 0xFF
        
        # Quit
        if key == ord('q') or key == ord('Q'):
            print("Quitting app...")
            break
            
        # Switch styles
        elif chr(key) in STYLES:
            current_style_key = chr(key)
            print(f"Switched style to: {STYLES[current_style_key]['name']}")
            
        # Adjust intensity
        elif key == ord('+') or key == ord('='):
            intensity = min(1.0, intensity + 0.05)
            print(f"Intensity: {int(intensity * 100)}%")
        elif key == ord('-'):
            intensity = max(0.0, intensity - 0.05)
            print(f"Intensity: {int(intensity * 100)}%")
            
        # Pause
        elif key == ord('p') or key == ord('P'):
            is_paused = not is_paused
            state = "PAUSED" if is_paused else "RUNNING"
            print(f"App stream is {state}")
            if is_paused:
                cv2.putText(display_frame, "STREAM PAUSED", (w // 2 - 80, h // 2),
                            cv2.FONT_HERSHEY_SIMPLEX, 0.8, (0, 0, 255), 2, cv2.LINE_AA)
                cv2.imshow("FaceTransform AI", display_frame)
                
        # Screenshot
        elif key == ord('s') or key == ord('S'):
            timestamp = time.strftime("%Y%m%d-%H%M%S")
            filename = f"screenshot_{timestamp}.jpg"
            cv2.imwrite(filename, display_frame)
            print(f"Screenshot saved as '{filename}'")
            # Briefly draw indicator overlay
            cv2.rectangle(display_frame, (0, 0), (w, h), (0, 255, 0), 5)
            cv2.putText(display_frame, "SCREENSHOT SAVED", (w // 2 - 100, h // 2),
                        cv2.FONT_HERSHEY_SIMPLEX, 0.7, (0, 255, 0), 2, cv2.LINE_AA)
            cv2.imshow("FaceTransform AI", display_frame)
            cv2.waitKey(300)

        if not is_paused:
            cv2.imshow("FaceTransform AI", display_frame)

    cap.release()
    cv2.destroyAllWindows()

if __name__ == "__main__":
    main()
