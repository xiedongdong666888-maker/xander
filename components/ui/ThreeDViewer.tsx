import React, { useEffect, useRef, useState } from "react";
import * as THREE from "three";
import { Loader2 } from "lucide-react";

interface ThreeDViewerProps {
  imageSrc: string;
  fallbackSrc?: string;
  isAutoRotate?: boolean;
  showHint?: boolean;
  className?: string;
}

export default function ThreeDViewer({
  imageSrc,
  fallbackSrc,
  isAutoRotate = true,
  showHint = false,
  className = "",
}: ThreeDViewerProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Keep track of interaction states using refs to prevent triggering React renders
  const stateRef = useRef({
    lon: 0,
    lat: 0,
    targetLon: 0,
    targetLat: 0,
    isUserInteracting: false,
    onPointerDownPointerX: 0,
    onPointerDownPointerY: 0,
    onPointerDownLon: 0,
    onPointerDownLat: 0,
  });

  useEffect(() => {
    const container = containerRef.current;
    const canvas = canvasRef.current;
    if (!container || !canvas) return;

    setLoading(true);
    setError(null);

    // 1. Setup Three.js scene elements
    const width = container.clientWidth || 800;
    const height = container.clientHeight || 500;

    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(70, width / height, 1, 1100);
    const renderer = new THREE.WebGLRenderer({
      canvas,
      antialias: true,
      alpha: true,
      powerPreference: "high-performance",
      precision: "highp", // Use high precision shaders for best quality
    });
    renderer.setPixelRatio(window.devicePixelRatio || 1); // Use full device pixel ratio for maximum sharpness
    renderer.setSize(width, height);

    // Create inverted sphere geometry with high segment count for perfect rendering and texture mapping
    const geometry = new THREE.SphereGeometry(500, 128, 96);
    geometry.scale(-1, 1, 1); // Invert sphere so the texture is viewed from inside

    let sphereMaterial: THREE.MeshBasicMaterial | null = null;
    let mesh: THREE.Mesh | null = null;

    // Helper to configure and attach texture
    const applyTextureToScene = (texture: THREE.Texture) => {
      texture.colorSpace = THREE.SRGBColorSpace;
      texture.minFilter = THREE.LinearFilter;
      texture.magFilter = THREE.LinearFilter;
      texture.generateMipmaps = false;
      
      const maxAnisotropy = renderer.capabilities.getMaxAnisotropy();
      texture.anisotropy = maxAnisotropy;
      
      sphereMaterial = new THREE.MeshBasicMaterial({ map: texture });
      mesh = new THREE.Mesh(geometry, sphereMaterial);
      scene.add(mesh);
      setLoading(false);
    };

    // Fallback procedural canvas texture
    const renderProceduralFallback = () => {
      const canvasPlaceholder = document.createElement("canvas");
      canvasPlaceholder.width = 1024;
      canvasPlaceholder.height = 512;
      const pCtx = canvasPlaceholder.getContext("2d");
      if (pCtx) {
        const gradient = pCtx.createLinearGradient(0, 0, 0, 512);
        gradient.addColorStop(0, "#EFECE5");
        gradient.addColorStop(0.5, "#D7CEBE");
        gradient.addColorStop(1, "#EFECE5");
        pCtx.fillStyle = gradient;
        pCtx.fillRect(0, 0, 1024, 512);
        pCtx.strokeStyle = "rgba(45,45,45,0.1)";
        pCtx.lineWidth = 1;
        for (let i = 0; i < 1024; i += 32) {
          pCtx.beginPath();
          pCtx.moveTo(i, 0);
          pCtx.lineTo(i, 512);
          pCtx.stroke();
        }
        for (let j = 0; j < 512; j += 32) {
          pCtx.beginPath();
          pCtx.moveTo(0, j);
          pCtx.lineTo(1024, j);
          pCtx.stroke();
        }
        pCtx.fillStyle = "#2D2D2D";
        pCtx.font = "bold 32px sans-serif";
        pCtx.textAlign = "center";
        pCtx.fillText("720° Immersive Concept Space", 512, 240);
        pCtx.font = "18px sans-serif";
        pCtx.fillStyle = "rgba(45,45,45,0.6)";
        pCtx.fillText("Drag mouse to rotate • Select rooms below to tour", 512, 280);
      }

      const fallbackTexture = new THREE.CanvasTexture(canvasPlaceholder);
      applyTextureToScene(fallbackTexture);
    };

    // Load texture with fallback chain
    const loadTextureWithFallback = (primaryUrl: string, secondaryUrl?: string) => {
      const loader = new THREE.TextureLoader();
      if (primaryUrl.startsWith("http")) {
        loader.crossOrigin = "anonymous";
      }

      loader.load(
        primaryUrl,
        (texture) => {
          applyTextureToScene(texture);
        },
        undefined,
        () => {
          if (secondaryUrl && secondaryUrl !== primaryUrl) {
            console.warn(`Primary 360 texture (${primaryUrl}) failed to load. Retrying with fallback URL: ${secondaryUrl}`);
            const secondaryLoader = new THREE.TextureLoader();
            if (secondaryUrl.startsWith("http")) {
              secondaryLoader.crossOrigin = "anonymous";
            }
            secondaryLoader.load(
              secondaryUrl,
              (fallbackTexture) => {
                applyTextureToScene(fallbackTexture);
              },
              undefined,
              () => {
                renderProceduralFallback();
              }
            );
          } else {
            renderProceduralFallback();
          }
        }
      );
    };

    loadTextureWithFallback(imageSrc, fallbackSrc);

    // 2. Interactive Event Handlers
    const onPointerDown = (event: PointerEvent) => {
      if (event.isPrimary === false) return;
      stateRef.current.isUserInteracting = true;

      stateRef.current.onPointerDownPointerX = event.clientX;
      stateRef.current.onPointerDownPointerY = event.clientY;

      stateRef.current.onPointerDownLon = stateRef.current.targetLon;
      stateRef.current.onPointerDownLat = stateRef.current.targetLat;
    };

    const onPointerMove = (event: PointerEvent) => {
      if (event.isPrimary === false) return;
      if (stateRef.current.isUserInteracting === false) return;

      const clientX = event.clientX;
      const clientY = event.clientY;

      // Sensitivity factor
      const factor = 0.15;
      stateRef.current.targetLon =
        (stateRef.current.onPointerDownPointerX - clientX) * factor +
        stateRef.current.onPointerDownLon;
      stateRef.current.targetLat =
        (clientY - stateRef.current.onPointerDownPointerY) * factor +
        stateRef.current.onPointerDownLat;
    };

    const onPointerUp = (event: PointerEvent) => {
      if (event.isPrimary === false) return;
      stateRef.current.isUserInteracting = false;
    };

    // Listeners on container
    container.addEventListener("pointerdown", onPointerDown);
    container.addEventListener("pointermove", onPointerMove);
    container.addEventListener("pointerup", onPointerUp);

    // 3. Render and Animation loop
    let animationFrameId: number;

    const animate = () => {
      animationFrameId = requestAnimationFrame(animate);

      if (stateRef.current.isUserInteracting === false && isAutoRotate) {
        // Slow continuous horizontal spin
        stateRef.current.targetLon += 0.05;
      }

      // Smooth camera interpolation (Momentum / easing)
      stateRef.current.lat += (stateRef.current.targetLat - stateRef.current.lat) * 0.1;
      stateRef.current.lon += (stateRef.current.targetLon - stateRef.current.lon) * 0.1;

      // Clamp vertical camera latitude rotation between -85 and 85 to prevent camera flip
      stateRef.current.lat = Math.max(-85, Math.min(85, stateRef.current.lat));
      stateRef.current.targetLat = Math.max(-85, Math.min(85, stateRef.current.targetLat));

      // Calculate unit projection target vector
      const phi = THREE.MathUtils.degToRad(90 - stateRef.current.lat);
      const theta = THREE.MathUtils.degToRad(stateRef.current.lon);

      const x = 500 * Math.sin(phi) * Math.sin(theta);
      const y = 500 * Math.cos(phi);
      const z = 500 * Math.sin(phi) * Math.cos(theta);

      camera.lookAt(x, y, z);
      renderer.render(scene, camera);
    };

    animate();

    // 4. Resize Observer
    const resizeObserver = new ResizeObserver(() => {
      const w = container.clientWidth;
      const h = container.clientHeight;
      if (w && h) {
        camera.aspect = w / h;
        camera.updateProjectionMatrix();
        renderer.setSize(w, h);
      }
    });
    resizeObserver.observe(container);

    // Cleanup
    return () => {
      cancelAnimationFrame(animationFrameId);
      resizeObserver.disconnect();

      container.removeEventListener("pointerdown", onPointerDown);
      container.removeEventListener("pointermove", onPointerMove);
      container.removeEventListener("pointerup", onPointerUp);

      // Clean up ThreeJS assets to prevent memory leaks
      geometry.dispose();
      if (sphereMaterial) {
        if (sphereMaterial.map) sphereMaterial.map.dispose();
        sphereMaterial.dispose();
      }
      renderer.dispose();
    };
  }, [imageSrc, isAutoRotate]);

  return (
    <div
      ref={containerRef}
      className={`relative overflow-hidden cursor-grab active:cursor-grabbing select-none ${className}`}
    >
      <canvas ref={canvasRef} className="w-full h-full block" />

      {/* Modern High-End Loader Overlay */}
      {loading && (
        <div className="absolute inset-0 flex flex-col items-center justify-center bg-black/40 backdrop-blur-md z-10 text-white transition-opacity duration-300">
          <Loader2 className="w-10 h-10 animate-spin text-white/80 mb-3" />
          <span className="text-sm font-light tracking-widest text-white/90">
            正在载入 3D 空间全景...
          </span>
        </div>
      )}

      {/* Floating Interactive Instructions */}
      {!loading && !error && showHint && (
        <div className="absolute bottom-4 left-1/2 -translate-x-1/2 bg-black/60 backdrop-blur-md px-4 py-1.5 rounded-full text-[11px] text-white/80 font-normal pointer-events-none tracking-widest uppercase z-10">
          鼠标拖拽可 720° 旋转观看空间
        </div>
      )}
    </div>
  );
}
