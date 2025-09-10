#!/usr/bin/env python3
"""
Convert a video file (e.g., MP4) to an animated WebP using ffmpeg.

Usage:
  python3 video2webp.py /absolute/path/to/input.mp4 [-o /path/to/output.webp]

Defaults:
  - fps: 12
  - max width: 800px (keeps aspect ratio)
  - quality: 80 (0-100, lower = smaller file; ignored if --lossless)
  - compression level: 6 (0-6)
  - preset: picture (default), others: default, photo, drawing, icon, text
  - loop: infinite (0)
"""

from __future__ import annotations

import argparse
import os
import shutil
import subprocess
import sys
from pathlib import Path
import tempfile
import time
import numpy as np


def ensure_ffmpeg_exists() -> str:
    ffmpeg_path = shutil.which("ffmpeg")
    if ffmpeg_path is None:
        print(
            "Error: ffmpeg not found. Please install ffmpeg (with libwebp) first, e.g.:\n"
            "  brew install ffmpeg\n",
            file=sys.stderr,
        )
        sys.exit(1)
    return ffmpeg_path


def build_vf_filter(
    fps: int,
    max_width: int | None,
    remove_bg: bool = False,
    bg_color_hex: str | None = None,
    similarity: float = 0.08,
    blend: float = 0.02,
) -> str:
    parts = [f"fps={fps}"]
    if max_width and max_width > 0:
        # Ensure width does not exceed max_width while preserving aspect ratio
        parts.append(f"scale='min({max_width},iw)':-1:flags=lanczos")
    else:
        parts.append("scale=iw:-1:flags=lanczos")

    if remove_bg and bg_color_hex:
        # Convert background to transparent via colorkey, keep alpha
        # Note: we use RGBA for filtering then hand off alpha to encoder
        parts.append("format=rgba")
        parts.append(f"colorkey={bg_color_hex}:{similarity}:{blend}")
    return ",".join(parts)


def parse_args() -> argparse.Namespace:
    parser = argparse.ArgumentParser(
        description="Convert video to animated WebP using ffmpeg"
    )
    parser.add_argument("input", help="Input video file path")
    parser.add_argument("-o", "--output", help="Output .webp file path")
    parser.add_argument(
        "--fps", type=int, default=12, help="Frames per second (default: 12)"
    )
    parser.add_argument(
        "--max-width",
        type=int,
        default=800,
        help="Maximum output width in pixels, keeps aspect ratio (default: 800)",
    )
    parser.add_argument(
        "--quality",
        type=int,
        default=80,
        help="Quality for lossy mode 0-100 (lower = smaller, default: 80)",
    )
    parser.add_argument(
        "--compression-level",
        type=int,
        default=6,
        help="Compression level 0-6 (default: 6)",
    )
    parser.add_argument(
        "--preset",
        choices=["default", "picture", "photo", "drawing", "icon", "text"],
        default="picture",
        help="Encoder preset (default: picture)",
    )
    parser.add_argument(
        "--lossless",
        action="store_true",
        help="Use lossless WebP (larger file, ignores quality)",
    )
    parser.add_argument(
        "--remove-bg",
        action="store_true",
        help="Remove a solid background color to make it transparent",
    )
    parser.add_argument(
        "--bg-color",
        default="white",
        help="Background color to remove. Accepts names (white, black, red, green, blue) or hex like #FFFFFF",
    )
    parser.add_argument(
        "--similarity",
        type=float,
        default=0.08,
        help="Tolerance 0-1 for color keying (higher removes broader range, default: 0.08)",
    )
    parser.add_argument(
        "--blend",
        type=float,
        default=0.02,
        help="Blending 0-1 for smooth edges (default: 0.02)",
    )
    parser.add_argument(
        "--bg-method",
        choices=["colorkey", "borderfill"],
        default="borderfill",
        help="Background removal method when --remove-bg is set (default: borderfill)",
    )
    parser.add_argument(
        "--white-threshold",
        type=int,
        default=245,
        help="RGB threshold 0-255 to consider pixel as near-white for borderfill (default: 245)",
    )
    parser.add_argument(
        "-v",
        "--verbose",
        action="store_true",
        help="Print verbose logs and progress",
    )
    return parser.parse_args()


def main() -> None:
    args = parse_args()

    input_path = Path(args.input).expanduser()
    if not input_path.exists():
        print(f"Error: input file not found: {input_path}", file=sys.stderr)
        sys.exit(1)

    if args.output:
        output_path = Path(args.output).expanduser()
        if output_path.suffix.lower() != ".webp":
            output_path = output_path.with_suffix(".webp")
    else:
        output_path = input_path.with_suffix(".webp")

    def normalize_color_to_ffmpeg_hex(value: str) -> str:
        named = {
            "white": "0xFFFFFF",
            "black": "0x000000",
            "red": "0xFF0000",
            "green": "0x00FF00",
            "blue": "0x0000FF",
        }
        v = value.strip().lower()
        if v in named:
            return named[v]
        if v.startswith("#"):
            v = v[1:]
        if len(v) == 6 and all(c in "0123456789abcdef" for c in v):
            return "0x" + v.upper()
        # Fallback to white when invalid
        return "0xFFFFFF"

    if args.remove_bg and args.bg_method == "borderfill":
        convert_with_borderfill(input_path, output_path, args)
        print(f"OK: {output_path}")
        return
    else:
        ffmpeg = ensure_ffmpeg_exists()
        bg_hex = (
            normalize_color_to_ffmpeg_hex(args.bg_color) if args.remove_bg else None
        )

        vf = build_vf_filter(
            args.fps,
            args.max_width,
            remove_bg=bool(args.remove_bg),
            bg_color_hex=bg_hex,
            similarity=float(args.similarity),
            blend=float(args.blend),
        )

        cmd = [
            ffmpeg,
            "-v",
            "error",
            "-y",
            "-i",
            str(input_path),
            "-vf",
            vf,
            "-an",  # no audio for webp
            "-c:v",
            "libwebp",
            "-pix_fmt",
            "yuva420p",
            "-compression_level",
            str(args.compression_level),
            "-preset",
            args.preset,
            "-loop",
            "0",
            "-threads",
            "0",
        ]

        if args.lossless:
            cmd += ["-lossless", "1"]
        else:
            cmd += ["-lossless", "0", "-q:v", str(args.quality)]

        cmd.append(str(output_path))

        try:
            subprocess.run(cmd, check=True)
        except subprocess.CalledProcessError as exc:
            print("Conversion failed with ffmpeg.", file=sys.stderr)
            # Surface the command for debugging
            print("Command:", " ".join(cmd), file=sys.stderr)
            sys.exit(exc.returncode or 1)

        print(f"OK: {output_path}")


def convert_with_borderfill(
    input_path: Path, output_path: Path, args: argparse.Namespace
) -> None:
    try:
        import cv2  # type: ignore
        from PIL import Image  # type: ignore
    except Exception as e:  # pragma: no cover
        print(
            "Error: This mode requires OpenCV (cv2), Pillow, and numpy. Install with:\n"
            "  pip3 install opencv-python pillow numpy\n",
            file=sys.stderr,
        )
        raise

    if args.verbose:
        print(f"[video2webp] Starting borderfill conversion", flush=True)
        print(
            f"[video2webp] params: fps={args.fps}, max_width={args.max_width}, lossless={args.lossless}, quality={args.quality}, compression={args.compression_level}",
            flush=True,
        )

    cap = cv2.VideoCapture(str(input_path))
    if not cap.isOpened():
        print("Error: Cannot open input video", file=sys.stderr)
        sys.exit(1)

    src_fps = cap.get(cv2.CAP_PROP_FPS)
    if not src_fps or src_fps <= 0:
        src_fps = float(args.fps)
    target_fps = float(args.fps)
    frame_interval = max(1, int(round(src_fps / target_fps)))

    tmp_dir = Path(tempfile.mkdtemp(prefix="v2w_"))
    frame_index = 0
    saved_index = 0
    last_report = time.time()
    total_frames = int(cap.get(cv2.CAP_PROP_FRAME_COUNT) or 0)
    if args.verbose:
        print(
            f"[video2webp] src_fps={src_fps:.3f}, target_fps={target_fps:.3f}, interval={frame_interval}, total_frames={total_frames}",
            flush=True,
        )

    def resize_keep_aspect(img_bgr: np.ndarray, max_w: int | None) -> np.ndarray:
        if not max_w or max_w <= 0:
            return img_bgr
        h, w = img_bgr.shape[:2]
        if w <= max_w:
            return img_bgr
        scale = max_w / float(w)
        new_size = (int(round(w * scale)), int(round(h * scale)))
        return cv2.resize(img_bgr, new_size, interpolation=cv2.INTER_AREA)

    def build_bg_mask(bgr: np.ndarray, white_threshold: int) -> np.ndarray:
        # near-white if all channels >= threshold
        mask = (
            (bgr[:, :, 0] >= white_threshold)
            & (bgr[:, :, 1] >= white_threshold)
            & (bgr[:, :, 2] >= white_threshold)
        )
        return mask.astype(np.uint8)  # 0/1

    def keep_only_border_connected(mask01: np.ndarray) -> np.ndarray:
        # connected components on 0/1 mask (1 indicates near-white)
        import cv2  # local import for type hints

        mask_u8 = (mask01 * 255).astype(np.uint8)
        num_labels, labels = cv2.connectedComponents(mask_u8)
        h, w = mask01.shape
        border_labels = set()
        # top/bottom rows
        border_labels.update(np.unique(labels[0, :]).tolist())
        border_labels.update(np.unique(labels[h - 1, :]).tolist())
        # left/right cols
        border_labels.update(np.unique(labels[:, 0]).tolist())
        border_labels.update(np.unique(labels[:, w - 1]).tolist())

        # Build background mask: pixels whose label is in border_labels
        bg_mask = np.isin(labels, list(border_labels))
        return bg_mask.astype(np.uint8)  # 0/1

    images: list[Image.Image] = []

    while True:
        ret, frame_bgr = cap.read()
        if not ret:
            break
        if frame_index % frame_interval != 0:
            frame_index += 1
            continue
        frame_index += 1

        frame_bgr = resize_keep_aspect(frame_bgr, args.max_width)

        bg_candidate = build_bg_mask(frame_bgr, args.white_threshold)
        bg_connected = keep_only_border_connected(bg_candidate)

        # Create RGBA: alpha 0 where background, 255 elsewhere
        frame_rgba = cv2.cvtColor(frame_bgr, cv2.COLOR_BGR2RGBA)
        alpha = np.where(bg_connected == 1, 0, 255).astype(np.uint8)
        frame_rgba[:, :, 3] = alpha

        # Optional: feather edges slightly by distance transform
        # Could be added in future; keep simple now

        img = Image.fromarray(frame_rgba)
        images.append(img)
        saved_index += 1

        now = time.time()
        if args.verbose and (now - last_report) >= 0.5:
            pct = (
                (frame_index / float(total_frames)) * 100.0 if total_frames > 0 else 0.0
            )
            print(
                f"[video2webp] processed frames: {frame_index}, kept: {saved_index}, {pct:.1f}%",
                flush=True,
            )
            last_report = now

    cap.release()

    if not images:
        print("Error: No frames produced.", file=sys.stderr)
        sys.exit(1)

    # Encode to animated webp using Pillow to preserve alpha easily
    duration_ms = int(round(1000.0 / target_fps))
    first, rest = images[0], images[1:]
    lossless_flag = bool(args.lossless)
    quality_val = int(args.quality)
    if args.verbose:
        print(
            f"[video2webp] encoding webp: frames={len(images)}, duration_ms={duration_ms}, loop=0",
            flush=True,
        )
    first.save(
        str(output_path),
        format="WEBP",
        save_all=True,
        append_images=rest,
        loop=0,
        duration=duration_ms,
        lossless=lossless_flag,
        quality=None if lossless_flag else quality_val,
        method=int(args.compression_level),
    )
    if args.verbose:
        print(f"[video2webp] done: {output_path}", flush=True)


if __name__ == "__main__":
    main()
