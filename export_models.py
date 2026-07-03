import os
import argparse
import torch
import torch.onnx

def export_to_onnx(model_name, output_path, precision='fp32'):
    print(f"Loading '{model_name}' model from torch.hub...")
    try:
        # Load AnimeGANv2 generator
        model = torch.hub.load("bryandlee/animegan2-pytorch:main", "generator", pretrained=model_name)
        model.eval()
        
        # Determine device
        device = torch.device('cuda' if torch.cuda.is_available() else 'cpu')
        model = model.to(device)
        
        # Create a dummy input (e.g., 512x512 with 3 channels)
        dummy_input = torch.randn(1, 3, 512, 512, device=device)
        
        if precision == 'fp16':
            print("Converting model to float16 (FP16)...")
            model = model.half()
            dummy_input = dummy_input.half()
        
        os.makedirs(os.path.dirname(output_path), exist_ok=True)
        
        print(f"Exporting '{model_name}' to ONNX format at '{output_path}'...")
        torch.onnx.export(
            model,
            dummy_input,
            output_path,
            verbose=False,
            input_names=['input'],
            output_names=['output'],
            opset_version=12,
            dynamic_axes={
                'input': {0: 'batch_size', 2: 'height', 3: 'width'},
                'output': {0: 'batch_size', 2: 'height', 3: 'width'}
            }
        )
        print(f"Successfully exported {model_name} to {output_path}")
    except Exception as e:
        print(f"Error exporting {model_name}: {e}")
        print("Falling back to downloading weights only...")

def main():
    parser = argparse.ArgumentParser(description="Export AnimeGANv2 models to ONNX")
    parser.add_argument("--model", type=str, default="all", choices=["all", "face_paint_512_v2", "paprika", "celeba_distill"],
                        help="Model to export (default: all)")
    parser.add_argument("--precision", type=str, default="fp32", choices=["fp32", "fp16"],
                        help="Model precision (fp32 or fp16)")
    args = parser.parse_args()

    models_dir = os.path.join(os.path.dirname(__file__), "models")
    os.makedirs(models_dir, exist_ok=True)
    
    models_to_export = []
    if args.model == "all":
        models_to_export = ["face_paint_512_v2", "paprika", "celeba_distill"]
    else:
        models_to_export = [args.model]
        
    for m in models_to_export:
        out_name = f"{m}_{args.precision}.onnx" if args.precision == "fp16" else f"{m}.onnx"
        out_path = os.path.join(models_dir, out_name)
        export_to_onnx(m, out_path, args.precision)

if __name__ == "__main__":
    main()
