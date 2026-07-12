import React, { useRef, useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Orbit, Compass, RefreshCw, Cpu, Maximize2, Zap, LayoutGrid, Info } from 'lucide-react';

// 3D Point and Line structures
interface Point3D {
  x: number;
  y: number;
  z: number;
  color?: string;
  size?: number;
  label?: string;
}

interface Line3D {
  u: number; // index of first point
  v: number; // index of second point
  color?: string;
  width?: number;
}

enum ModelShape {
  SPHERE = 'sphere',
  TESSERACT = 'tesseract',
  DNA = 'dna',
  QUANTUM = 'quantum'
}

export const ThreeDShowcase: React.FC = () => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const containerRef = useRef<HTMLDivElement | null>(null);

  // Interaction State
  const [activeShape, setActiveShape] = useState<ModelShape>(ModelShape.SPHERE);
  const [autoRotate, setAutoRotate] = useState<boolean>(true);
  const [rotateSpeed, setRotateSpeed] = useState<number>(1.0);
  const [zoom, setZoom] = useState<number>(1.2);
  const [particleCount, setParticleCount] = useState<number>(150);
  const [isHovered, setIsHovered] = useState<boolean>(false);
  const [showWireframe, setShowWireframe] = useState<boolean>(true);
  const [selectedNode, setSelectedNode] = useState<string | null>(null);

  // Rotation angles (Pitch & Yaw)
  const angleXRef = useRef<number>(0.3);
  const angleYRef = useRef<number>(0.5);
  const angleZRef = useRef<number>(0.1);

  // Mouse Drag Tracking
  const isDraggingRef = useRef<boolean>(false);
  const previousMousePositionRef = useRef<{ x: number; y: number }>({ x: 0, y: 0 });

  // 3D Geometry Data
  const pointsRef = useRef<Point3D[]>([]);
  const linesRef = useRef<Line3D[]>([]);

  // Telemetry logs
  const [telemetry, setTelemetry] = useState({
    pitch: '17.19°',
    yaw: '28.65°',
    fps: 60,
    renderTime: '0.12ms',
    points: 0,
    lines: 0
  });

  // Generator Functions for 3D geometries
  const generateGeometry = (shape: ModelShape, count: number) => {
    const pts: Point3D[] = [];
    const lns: Line3D[] = [];

    switch (shape) {
      case ModelShape.SPHERE: {
        // Create a Geodesic-style sphere (latitude/longitude coordinates)
        const rings = 8;
        const sectors = 12;
        const radius = 100;

        // Polar points
        pts.push({ x: 0, y: radius, z: 0, label: 'NORTH_POLE', size: 5, color: '#00f0ff' }); // North Pole
        pts.push({ x: 0, y: -radius, z: 0, label: 'SOUTH_POLE', size: 5, color: '#00f0ff' }); // South Pole

        for (let i = 1; i < rings; i++) {
          const theta = (i * Math.PI) / rings;
          const sinTheta = Math.sin(theta);
          const cosTheta = Math.cos(theta);

          for (let j = 0; j < sectors; j++) {
            const phi = (j * 2 * Math.PI) / sectors;
            const x = radius * sinTheta * Math.cos(phi);
            const z = radius * sinTheta * Math.sin(phi);
            const y = radius * cosTheta;

            // Randomize color slightly for organic tech feeling
            const label = `NODE_${String(pts.length).padStart(3, '0')}`;
            pts.push({ 
              x, y, z, 
              label, 
              size: Math.random() > 0.8 ? 4 : 2.5,
              color: j % 2 === 0 ? '#2997FF' : '#BF5AF2' 
            });
          }
        }

        // Generate Grid/Wireframe lines
        const poleIndexN = 0;
        const poleIndexS = 1;

        for (let i = 1; i < rings; i++) {
          const startIdx = 2 + (i - 1) * sectors;
          
          for (let j = 0; j < sectors; j++) {
            const currentIdx = startIdx + j;
            const nextIdx = startIdx + ((j + 1) % sectors);

            // Latitudinal Lines (Horizontal loops)
            lns.push({ u: currentIdx, v: nextIdx, color: 'rgba(41,151,255,0.25)', width: 1 });

            // Longitudinal Lines (Vertical arches)
            if (i === 1) {
              lns.push({ u: poleIndexN, v: currentIdx, color: 'rgba(191,90,242,0.25)', width: 1 });
            } else {
              const prevRowIdx = currentIdx - sectors;
              lns.push({ u: prevRowIdx, v: currentIdx, color: 'rgba(191,90,242,0.25)', width: 1 });
            }

            if (i === rings - 1) {
              lns.push({ u: currentIdx, v: poleIndexS, color: 'rgba(191,90,242,0.25)', width: 1 });
            }
          }
        }
        break;
      }

      case ModelShape.TESSERACT: {
        // Hypercube / Tesseract wireframe (16 vertices, inner and outer cube)
        const sizeOuter = 95;
        const sizeInner = 45;

        // Outer cube (8 points)
        const outer = [
          [-1, -1, -1], [1, -1, -1], [1, 1, -1], [-1, 1, -1],
          [-1, -1, 1],  [1, -1, 1],  [1, 1, 1],  [-1, 1, 1]
        ];

        outer.forEach((v, idx) => {
          pts.push({
            x: v[0] * sizeOuter,
            y: v[1] * sizeOuter,
            z: v[2] * sizeOuter,
            color: '#00f0ff',
            size: 4,
            label: `OUTER_V_${idx}`
          });
        });

        // Inner cube (8 points)
        outer.forEach((v, idx) => {
          pts.push({
            x: v[0] * sizeInner,
            y: v[1] * sizeInner,
            z: v[2] * sizeInner,
            color: '#BF5AF2',
            size: 4,
            label: `INNER_V_${idx}`
          });
        });

        // Add hypercube lines (12 lines for outer, 12 lines for inner, 8 joining lines)
        const addCubeLines = (offset: number, lineColor: string) => {
          const edges = [
            [0, 1], [1, 2], [2, 3], [3, 0], // Back face
            [4, 5], [5, 6], [6, 7], [7, 4], // Front face
            [0, 4], [1, 5], [2, 6], [3, 7]  // Connectors
          ];
          edges.forEach(([u, v]) => {
            lns.push({ u: u + offset, v: v + offset, color: lineColor, width: 1.5 });
          });
        };

        addCubeLines(0, 'rgba(41, 151, 255, 0.45)'); // Outer cube lines
        addCubeLines(8, 'rgba(191, 90, 242, 0.45)'); // Inner cube lines

        // Inter-dimensional bridges (joining outer to inner)
        for (let i = 0; i < 8; i++) {
          lns.push({ u: i, v: i + 8, color: 'rgba(255, 255, 255, 0.2)', width: 1 });
        }
        break;
      }

      case ModelShape.DNA: {
        // DNA Double Helix
        const segments = count / 6;
        const helixRadius = 50;
        const helixHeight = 160;

        for (let i = 0; i < segments; i++) {
          const t = i / segments;
          const y = (t - 0.5) * helixHeight;
          const angle = t * Math.PI * 4.5; // spirals 2.25 times

          // Strand A
          const xA = Math.cos(angle) * helixRadius;
          const zA = Math.sin(angle) * helixRadius;
          pts.push({ x: xA, y, z: zA, color: '#00f0ff', size: 4, label: `DNA_A_NUC_${i}` });

          // Strand B (180 deg shifted)
          const xB = Math.cos(angle + Math.PI) * helixRadius;
          const zB = Math.sin(angle + Math.PI) * helixRadius;
          pts.push({ x: xB, y, z: zB, color: '#BF5AF2', size: 4, label: `DNA_B_NUC_${i}` });

          const idxA = pts.length - 2;
          const idxB = pts.length - 1;

          // Watson-Crick Base Pair Connector
          if (i % 2 === 0) {
            lns.push({ u: idxA, v: idxB, color: 'rgba(255, 255, 255, 0.15)', width: 1 });
          }

          // Strand Backbone linkages
          if (i > 0) {
            lns.push({ u: idxA - 2, v: idxA, color: 'rgba(41, 151, 255, 0.5)', width: 1.5 });
            lns.push({ u: idxB - 2, v: idxB, color: 'rgba(191, 90, 242, 0.5)', width: 1.5 });
          }
        }
        break;
      }

      case ModelShape.QUANTUM: {
        // Quantum orbits and atom shell
        const orbitsCount = 4;
        const orbitalPoints = 24;
        const baseRadius = 80;

        // Central core particle
        pts.push({ x: 0, y: 0, z: 0, color: '#FFFFFF', size: 8, label: 'QUANTUM_CORE' });

        for (let o = 0; o < orbitsCount; o++) {
          const pitchShift = (o * Math.PI) / orbitsCount;
          const radius = baseRadius - (o * 10);
          const startIdx = pts.length;

          for (let i = 0; i < orbitalPoints; i++) {
            const step = (i * 2 * Math.PI) / orbitalPoints;
            
            // Standard 2D circle rotated in 3D space by orbit inclination
            const xVal = Math.cos(step) * radius;
            const zVal = Math.sin(step) * radius;

            // Apply inclination rotation on Y/Z plane
            const x = xVal;
            const y = zVal * Math.sin(pitchShift);
            const z = zVal * Math.cos(pitchShift);

            pts.push({
              x, y, z,
              color: o % 2 === 0 ? '#2997FF' : '#BF5AF2',
              size: i % 6 === 0 ? 3.5 : 1.5,
              label: `ORBIT_${o}_NODE_${i}`
            });

            // Connect circle points
            if (i > 0) {
              lns.push({ u: startIdx + i - 1, v: startIdx + i, color: `rgba(41, 151, 255, ${0.15 + (o * 0.05)})`, width: 1 });
            }
            if (i === orbitalPoints - 1) {
              lns.push({ u: startIdx + i, v: startIdx, color: `rgba(41, 151, 255, ${0.15 + (o * 0.05)})`, width: 1 });
            }
          }
        }
        break;
      }
    }

    pointsRef.current = pts;
    linesRef.current = lns;
    setTelemetry(prev => ({
      ...prev,
      points: pts.length,
      lines: lns.length
    }));
  };

  // Re-generate geometry whenever active shape or particle count changes
  useEffect(() => {
    generateGeometry(activeShape, particleCount);
  }, [activeShape, particleCount]);

  // Handle Resize and Main Loop Rendering
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animationFrameId: number;
    let lastTime = performance.now();
    let frameCount = 0;
    let fpsInterval = performance.now();

    const handleResize = () => {
      const parent = canvas.parentElement;
      if (parent) {
        canvas.width = parent.clientWidth;
        canvas.height = parent.clientHeight;
      }
    };

    window.addEventListener('resize', handleResize);
    handleResize();

    // The core 3D projection engine loop
    const render = (time: number) => {
      const startTime = performance.now();

      // FPS tracking
      frameCount++;
      if (time - fpsInterval >= 1000) {
        const currentFps = Math.round((frameCount * 1000) / (time - fpsInterval));
        setTelemetry(prev => ({ ...prev, fps: currentFps }));
        frameCount = 0;
        fpsInterval = time;
      }

      // Delta time calculations
      const delta = (time - lastTime) / 1000;
      lastTime = time;

      // Clear Canvas
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      // Apply auto-rotation
      if (autoRotate && !isDraggingRef.current) {
        angleXRef.current += 0.12 * rotateSpeed * delta;
        angleYRef.current += 0.25 * rotateSpeed * delta;
        angleZRef.current += 0.08 * rotateSpeed * delta;
      }

      // Trigger telemetry angle string output
      const pitchStr = `${((angleXRef.current * 180) / Math.PI % 360).toFixed(1)}°`;
      const yawStr = `${((angleYRef.current * 180) / Math.PI % 360).toFixed(1)}°`;
      
      const width = canvas.width;
      const height = canvas.height;
      const centerX = width / 2;
      const centerY = height / 2;

      // Project 3D points to 2D screen
      const cameraDistance = 350;
      const modelScale = Math.min(centerX, centerY) * 0.7 * zoom;

      const cosX = Math.cos(angleXRef.current);
      const sinX = Math.sin(angleXRef.current);
      const cosY = Math.cos(angleYRef.current);
      const sinY = Math.sin(angleYRef.current);
      const cosZ = Math.cos(angleZRef.current);
      const sinZ = Math.sin(angleZRef.current);

      interface ProjectedPoint {
        x: number;
        y: number;
        z: number;
        original: Point3D;
      }

      const projected: ProjectedPoint[] = pointsRef.current.map(p => {
        // 3D rotation sequence (Pitch, Yaw, Roll)
        // Rotate X
        let x1 = p.x;
        let y1 = p.y * cosX - p.z * sinX;
        let z1 = p.y * sinX + p.z * cosX;

        // Rotate Y
        let x2 = x1 * cosY + z1 * sinY;
        let y2 = y1;
        let z2 = -x1 * sinY + z1 * cosY;

        // Rotate Z
        let x3 = x2 * cosZ - y2 * sinZ;
        let y3 = x2 * sinZ + y2 * cosZ;
        let z3 = z2;

        // Perspective Projection
        const scaleFactor = cameraDistance / (cameraDistance + z3);
        const projX = centerX + x3 * scaleFactor * modelScale / 100;
        const projY = centerY + y3 * scaleFactor * modelScale / 100;

        return {
          x: projX,
          y: projY,
          z: z3, // keep Z depth for rendering order / lighting intensity
          original: p
        };
      });

      // Draw Grid / Coordinate lines underneath (Ambient Cyber Tech Deck Grid)
      ctx.strokeStyle = 'rgba(255, 255, 255, 0.02)';
      ctx.lineWidth = 1;
      
      // Draw grid ring
      ctx.beginPath();
      ctx.arc(centerX, centerY, modelScale * 0.95, 0, 2 * Math.PI);
      ctx.stroke();

      // Outer rings tick marks
      ctx.strokeStyle = 'rgba(41, 151, 255, 0.07)';
      ctx.beginPath();
      ctx.arc(centerX, centerY, modelScale * 1.1, 0, 2 * Math.PI);
      ctx.stroke();

      // Render 3D Lines / Wireframe edges
      if (showWireframe) {
        linesRef.current.forEach(line => {
          const ptU = projected[line.u];
          const ptV = projected[line.v];

          if (ptU && ptV) {
            // Calculate depth-based alpha transparency
            const avgZ = (ptU.z + ptV.z) / 2;
            const depthAlpha = Math.max(0.08, 0.6 - (avgZ / 250)); // fades far-away lines
            
            ctx.beginPath();
            ctx.moveTo(ptU.x, ptU.y);
            ctx.lineTo(ptV.x, ptV.y);
            
            const color = line.color || 'rgba(41, 151, 255, 0.3)';
            ctx.strokeStyle = color.replace(/[\d.]+\)$/, `${depthAlpha})`);
            ctx.lineWidth = line.width || 1;
            ctx.stroke();
          }
        });
      }

      // Draw projected nodes / vertices ordered by depth (Z-buffer paint order)
      const sortedProjected = [...projected].sort((a, b) => b.z - a.z);

      sortedProjected.forEach(pt => {
        // Calculate depth-based brightness & size
        const depthFactor = Math.max(0.1, 1.2 - (pt.z / 200));
        const size = (pt.original.size || 3) * depthFactor;
        const color = pt.original.color || '#00f0ff';

        ctx.beginPath();
        ctx.arc(pt.x, pt.y, size, 0, 2 * Math.PI);

        // Core fill with glow matching depth
        ctx.fillStyle = color;
        ctx.shadowBlur = depthFactor * 8;
        ctx.shadowColor = color;
        ctx.fill();
        ctx.shadowBlur = 0; // reset shadow for efficiency

        // Draw node rings for hovered or selected nodes
        if (selectedNode === pt.original.label) {
          ctx.strokeStyle = '#FFFFFF';
          ctx.lineWidth = 1.5;
          ctx.beginPath();
          ctx.arc(pt.x, pt.y, size * 2.5, 0, 2 * Math.PI);
          ctx.stroke();
          
          // Draw floating label text next to active node
          ctx.fillStyle = '#FFFFFF';
          ctx.font = '9px monospace';
          ctx.fillText(`[${pt.original.label} Z:${Math.round(pt.z)}]`, pt.x + 12, pt.y + 3);
        }
      });

      const renderingCost = `${(performance.now() - startTime).toFixed(2)}ms`;
      setTelemetry(prev => ({
        ...prev,
        pitch: pitchStr,
        yaw: yawStr,
        renderTime: renderingCost
      }));

      animationFrameId = requestAnimationFrame(render);
    };

    animationFrameId = requestAnimationFrame(render);

    return () => {
      window.removeEventListener('resize', handleResize);
      cancelAnimationFrame(animationFrameId);
    };
  }, [autoRotate, rotateSpeed, zoom, showWireframe, selectedNode]);

  // Handle Dragging
  const handleMouseDown = (e: React.MouseEvent<HTMLDivElement>) => {
    isDraggingRef.current = true;
    previousMousePositionRef.current = { x: e.clientX, y: e.clientY };
  };

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!isDraggingRef.current) {
      // Raycasting check for hovering nodes
      const canvas = canvasRef.current;
      if (!canvas) return;

      const rect = canvas.getBoundingClientRect();
      const mouseX = e.clientX - rect.left;
      const mouseY = e.clientY - rect.top;

      // Find closest projected point within 10px radius
      const cameraDistance = 350;
      const centerX = canvas.width / 2;
      const centerY = canvas.height / 2;
      const modelScale = Math.min(centerX, centerY) * 0.7 * zoom;

      const cosX = Math.cos(angleXRef.current);
      const sinX = Math.sin(angleXRef.current);
      const cosY = Math.cos(angleYRef.current);
      const sinY = Math.sin(angleYRef.current);
      const cosZ = Math.cos(angleZRef.current);
      const sinZ = Math.sin(angleZRef.current);

      let closestLabel: string | null = null;
      let closestDist = 12; // 12px threshold

      pointsRef.current.forEach(p => {
        let x1 = p.x;
        let y1 = p.y * cosX - p.z * sinX;
        let z1 = p.y * sinX + p.z * cosX;

        let x2 = x1 * cosY + z1 * sinY;
        let y2 = y1;
        let z2 = -x1 * sinY + z1 * cosY;

        let x3 = x2 * cosZ - y2 * sinZ;
        let y3 = x2 * sinZ + y2 * cosZ;
        let z3 = z2;

        const scaleFactor = cameraDistance / (cameraDistance + z3);
        const projX = centerX + x3 * scaleFactor * modelScale / 100;
        const projY = centerY + y3 * scaleFactor * modelScale / 100;

        const dx = mouseX - projX;
        const dy = mouseY - projY;
        const dist = Math.sqrt(dx * dx + dy * dy);

        if (dist < closestDist) {
          closestDist = dist;
          closestLabel = p.label || null;
        }
      });

      if (closestLabel !== selectedNode) {
        setSelectedNode(closestLabel);
      }
      return;
    }

    const deltaX = e.clientX - previousMousePositionRef.current.x;
    const deltaY = e.clientY - previousMousePositionRef.current.y;

    angleYRef.current += deltaX * 0.007;
    angleXRef.current += deltaY * 0.007;

    previousMousePositionRef.current = { x: e.clientX, y: e.clientY };
  };

  const handleMouseUp = () => {
    isDraggingRef.current = false;
  };

  return (
    <div className="w-full bg-[#050414]/90 rounded-3xl p-6 md:p-8 border border-white/10 shadow-[0_30px_70px_rgba(0,0,0,0.95)] text-white font-sans overflow-hidden relative">
      
      {/* Background neon radial blurs */}
      <div className="absolute top-0 right-0 w-72 h-72 rounded-full bg-cyan-500/5 blur-[120px] pointer-events-none" />
      <div className="absolute bottom-0 left-0 w-72 h-72 rounded-full bg-purple-500/5 blur-[120px] pointer-events-none" />

      {/* Header and Title */}
      <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center border-b border-white/10 pb-5 mb-6 gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1.5">
            <span className="w-2.5 h-2.5 rounded-full bg-neon-cyan animate-pulse shadow-[0_0_8px_#2997FF]" />
            <span className="font-orbitron text-xs text-neon-cyan tracking-[0.2em] uppercase font-bold">Vector Matrix Engine</span>
          </div>
          <h3 className="text-2xl md:text-3xl font-black font-orbitron tracking-wide text-white">
            全息 3D 智能粒子星系
          </h3>
          <p className="text-gray-400 font-rajdhani text-sm mt-0.5">
            使用原生 HTML5 Canvas 编写的轻量、超平滑 React 3D 渲染引擎。<strong>按住鼠标并拖拽</strong> 可以在数字虚空中进行三维视轨俯仰和偏航旋转。
          </p>
        </div>

        {/* Toggle Controls */}
        <div className="flex flex-wrap gap-2">
          {(Object.values(ModelShape) as ModelShape[]).map((shape) => (
            <button
              key={shape}
              onClick={() => setActiveShape(shape)}
              className={`px-3 py-1.5 rounded-lg border text-[10px] font-bold font-orbitron tracking-wider uppercase transition-all duration-300 cursor-pointer ${
                activeShape === shape
                  ? 'bg-neon-cyan text-black border-neon-cyan shadow-[0_0_12px_rgba(41,151,255,0.4)]'
                  : 'bg-white/5 border-white/5 text-gray-400 hover:text-white hover:border-white/15'
              }`}
            >
              {shape === 'sphere' ? '球形星核' : shape === 'tesseract' ? '超立方体' : shape === 'dna' ? '双螺旋' : '量子轨道'}
            </button>
          ))}
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-stretch">
        
        {/* Render Stage Window (Col-span 8) */}
        <div className="lg:col-span-8 flex flex-col gap-4">
          <div 
            ref={containerRef}
            onMouseDown={handleMouseDown}
            onMouseMove={handleMouseMove}
            onMouseUp={handleMouseUp}
            onMouseLeave={handleMouseUp}
            className="w-full h-[360px] md:h-[420px] bg-black/70 rounded-2xl border border-white/10 relative overflow-hidden flex items-center justify-center cursor-grab active:cursor-grabbing group shadow-inner"
          >
            {/* Ambient grid overlay */}
            <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.01)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.01)_1px,transparent_1px)] bg-[size:24px_24px] pointer-events-none" />

            {/* Corner Tech Decorators */}
            <div className="absolute top-4 left-4 w-4 h-4 border-t-2 border-l-2 border-white/15" />
            <div className="absolute top-4 right-4 w-4 h-4 border-t-2 border-r-2 border-white/15" />
            <div className="absolute bottom-4 left-4 w-4 h-4 border-b-2 border-l-2 border-white/15" />
            <div className="absolute bottom-4 right-4 w-4 h-4 border-b-2 border-r-2 border-white/15" />

            {/* 3D Canvas element */}
            <canvas ref={canvasRef} className="w-full h-full block absolute inset-0 z-10" />

            {/* Active Hover / Node Overlay */}
            <AnimatePresence>
              {selectedNode && (
                <motion.div 
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0 }}
                  className="absolute bottom-4 left-4 z-20 bg-black/85 border border-white/15 backdrop-blur-md rounded-lg px-3 py-1.5 font-mono text-[9px] text-neon-cyan flex items-center gap-2"
                >
                  <span className="w-1.5 h-1.5 rounded-full bg-green-400 animate-ping" />
                  <span>NODE_SELECTED: <strong className="text-white">{selectedNode}</strong></span>
                </motion.div>
              )}
            </AnimatePresence>

            {/* Stage Info Tag */}
            <div className="absolute top-4 left-1/2 -translate-x-1/2 bg-white/5 border border-white/10 px-3 py-1 rounded-full text-[9px] font-orbitron tracking-widest text-gray-400 z-20 flex items-center gap-1.5">
              <Compass size={10} className="text-neon-cyan animate-spin" style={{ animationDuration: '4s' }} />
              ASTR_CYCLES_ONLINE
            </div>
          </div>

          {/* Interactive sliders control bar */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="p-4 bg-white/5 border border-white/10 rounded-xl flex flex-col justify-center">
              <div className="flex justify-between text-[11px] font-mono text-gray-400 mb-1.5">
                <span>渲染缩放 (Render Zoom)</span>
                <span className="text-neon-cyan font-bold">{zoom.toFixed(1)}x</span>
              </div>
              <input 
                type="range" 
                min="0.5" 
                max="2.0" 
                step="0.1"
                value={zoom}
                onChange={(e) => setZoom(parseFloat(e.target.value))}
                className="w-full accent-neon-cyan cursor-pointer bg-white/10 h-1 rounded"
              />
            </div>

            <div className="p-4 bg-white/5 border border-white/10 rounded-xl flex flex-col justify-center">
              <div className="flex justify-between text-[11px] font-mono text-gray-400 mb-1.5">
                <span>旋转速率 (Orbit Pitch Speed)</span>
                <span className="text-neon-purple font-bold">{rotateSpeed.toFixed(1)}x</span>
              </div>
              <input 
                type="range" 
                min="0.0" 
                max="2.5" 
                step="0.1"
                value={rotateSpeed}
                onChange={(e) => setRotateSpeed(parseFloat(e.target.value))}
                className="w-full accent-neon-purple cursor-pointer bg-white/10 h-1 rounded"
              />
            </div>

            <div className="p-4 bg-white/5 border border-white/10 rounded-xl flex items-center justify-between">
              <span className="text-[11px] font-mono text-gray-400">线框网络 (Show Wireframe)</span>
              <button
                onClick={() => setShowWireframe(!showWireframe)}
                className={`w-12 h-6 rounded-full p-1 transition-colors duration-300 ${showWireframe ? 'bg-neon-cyan' : 'bg-white/10'}`}
              >
                <div className={`w-4 h-4 rounded-full bg-black transition-transform duration-300 ${showWireframe ? 'translate-x-6' : 'translate-x-0'}`} />
              </button>
            </div>
          </div>
        </div>

        {/* Telemetry log console side (Col-span 4) */}
        <div className="lg:col-span-4 flex flex-col justify-between gap-4">
          
          {/* Active Settings HUD */}
          <div className="p-5 bg-white/5 border border-white/10 rounded-2xl space-y-4">
            <div className="flex items-center gap-2 border-b border-white/10 pb-3 mb-1">
              <Cpu size={14} className="text-neon-cyan" />
              <h4 className="text-xs font-orbitron font-bold tracking-wider uppercase text-gray-300">系统内核设定 / INNER_CORE</h4>
            </div>

            {/* Auto rotate toggle */}
            <div className="flex items-center justify-between text-xs font-mono">
              <span className="text-gray-400">星轨自转 (Auto Spin)</span>
              <button 
                onClick={() => setAutoRotate(!autoRotate)}
                className={`px-3 py-1 rounded border text-[10px] font-bold transition-all ${
                  autoRotate ? 'border-neon-cyan/40 bg-neon-cyan/10 text-neon-cyan' : 'border-white/10 text-gray-500'
                }`}
              >
                {autoRotate ? 'ON' : 'OFF'}
              </button>
            </div>

            {/* Vector density */}
            <div className="space-y-1.5">
              <div className="flex justify-between text-xs font-mono">
                <span className="text-gray-400">核子密度 (Point Density)</span>
                <span className="text-white font-bold">{particleCount}</span>
              </div>
              <div className="flex gap-1.5">
                {[60, 150, 300].map(count => (
                  <button
                    key={count}
                    onClick={() => setParticleCount(count)}
                    disabled={activeShape === ModelShape.TESSERACT}
                    className={`flex-1 py-1 rounded border text-[9px] font-mono transition-all ${
                      particleCount === count && activeShape !== ModelShape.TESSERACT
                        ? 'border-neon-cyan text-neon-cyan'
                        : 'border-white/5 text-gray-500 hover:text-white disabled:opacity-30 disabled:cursor-not-allowed'
                    }`}
                  >
                    {count === 60 ? '低 (Eco)' : count === 150 ? '中 (Opt)' : '高 (Max)'}
                  </button>
                ))}
              </div>
            </div>

            {/* Reset button */}
            <button
              onClick={() => {
                angleXRef.current = 0.3;
                angleYRef.current = 0.5;
                angleZRef.current = 0.1;
                setZoom(1.2);
                setRotateSpeed(1.0);
                setAutoRotate(true);
                setShowWireframe(true);
              }}
              className="w-full py-2.5 rounded-lg border border-white/10 hover:border-white/30 text-xs font-orbitron font-bold tracking-widest flex items-center justify-center gap-2 hover:bg-white/5 transition-all"
            >
              <RefreshCw size={12} />
              重置视轨 / RESET_ORBIT
            </button>
          </div>

          {/* Telemetry Console Printout */}
          <div className="p-5 bg-black/90 border border-white/10 rounded-2xl flex-1 flex flex-col justify-between font-mono text-[10px] text-gray-400 min-h-[160px] relative shadow-2xl">
            <div className="flex items-center gap-1.5 border-b border-white/10 pb-2.5 mb-2.5">
              <Orbit size={12} className="text-neon-cyan animate-pulse" />
              <span className="text-[9px] font-bold tracking-wider uppercase text-gray-500">Telemetry Stream (ASTR_SYS)</span>
            </div>

            <div className="space-y-1.5 text-[9px]">
              <div className="flex justify-between">
                <span>GEOMETRY_TYPE:</span>
                <span className="text-white font-bold">{activeShape.toUpperCase()}</span>
              </div>
              <div className="flex justify-between">
                <span>PROJECT_NODES:</span>
                <span className="text-white font-bold">{telemetry.points}</span>
              </div>
              <div className="flex justify-between">
                <span>WIRE_LINES:</span>
                <span className="text-white font-bold">{telemetry.lines}</span>
              </div>
              <div className="flex justify-between">
                <span>ORBIT_PITCH:</span>
                <span className="text-neon-cyan font-bold">{telemetry.pitch}</span>
              </div>
              <div className="flex justify-between">
                <span>ORBIT_YAW:</span>
                <span className="text-neon-cyan font-bold">{telemetry.yaw}</span>
              </div>
              <div className="flex justify-between">
                <span>RENDER_CLOCK:</span>
                <span className="text-green-400 font-bold">{telemetry.renderTime}</span>
              </div>
              <div className="flex justify-between">
                <span>REFRESH_RATE:</span>
                <span className="text-green-400 font-bold">{telemetry.fps} FPS</span>
              </div>
            </div>

            <div className="flex gap-2 items-center border-t border-white/10 pt-2 text-[8px] text-gray-600 mt-3">
              <Info size={10} className="text-neon-cyan flex-shrink-0" />
              <span>Glow nodes recalculate matrices coordinates on each RAF frame ticks safely.</span>
            </div>
          </div>

        </div>

      </div>

    </div>
  );
};

export default ThreeDShowcase;
