'use client';

import React, { useRef, useEffect } from 'react';

interface AetherCoreProps {
  mode?: 'hero' | 'dashboard' | 'compact';
}

export const AetherCore: React.FC<AetherCoreProps> = ({ mode = 'hero' }) => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const containerRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animationFrameId: number;
    let width = (canvas.width = window.innerWidth);
    let height = (canvas.height = window.innerHeight);

    const mouse = { x: width / 2, y: height / 2, tx: width / 2, ty: height / 2, active: false };

    // Particles/Nodes definition
    interface Node {
      x: number;
      y: number;
      vx: number;
      vy: number;
      radius: number;
      pulseSpeed: number;
      pulseOffset: number;
      color: string;
      originalX: number;
      originalY: number;
    }

    const nodes: Node[] = [];
    const nodeCount = mode === 'compact' ? 40 : mode === 'dashboard' ? 80 : 130;
    const colors = [
      'rgba(0, 229, 255, 0.65)',  // Cyan
      'rgba(147, 51, 234, 0.6)',  // Purple
      'rgba(59, 130, 246, 0.55)', // Electric Blue
      'rgba(16, 185, 129, 0.45)', // Emerald Green
    ];

    // Initialize nodes
    for (let i = 0; i < nodeCount; i++) {
      const x = Math.random() * width;
      const y = Math.random() * height;
      nodes.push({
        x,
        y,
        originalX: x,
        originalY: y,
        vx: (Math.random() - 0.5) * 0.45,
        vy: (Math.random() - 0.5) * 0.45,
        radius: Math.random() * 2 + 1,
        pulseSpeed: 0.02 + Math.random() * 0.03,
        pulseOffset: Math.random() * Math.PI * 2,
        color: colors[Math.floor(Math.random() * colors.length)],
      });
    }

    // Core Sphere orbits definition
    let coreAngle = 0;
    let sphereRadius = mode === 'compact' ? 50 : mode === 'dashboard' ? 100 : 160;

    const handleMouseMove = (e: MouseEvent) => {
      mouse.tx = e.clientX;
      mouse.ty = e.clientY;
      mouse.active = true;
    };

    const handleMouseLeave = () => {
      mouse.active = false;
    };

    const handleResize = () => {
      if (!canvas) return;
      width = canvas.width = window.innerWidth;
      height = canvas.height = window.innerHeight;
      sphereRadius = mode === 'compact' ? 50 : mode === 'dashboard' ? 100 : 160;
    };

    window.addEventListener('mousemove', handleMouseMove);
    window.addEventListener('mouseleave', handleMouseLeave);
    window.addEventListener('resize', handleResize);

    // Frame rendering loop
    const render = () => {
      // Clear with very dark alpha trail for smooth motion blurring
      ctx.fillStyle = 'rgba(5, 7, 10, 0.08)';
      ctx.fillRect(0, 0, width, height);

      // Smooth mouse interpolation
      mouse.x += (mouse.tx - mouse.x) * 0.08;
      mouse.y += (mouse.ty - mouse.y) * 0.08;

      // Draw Aurora background lights using canvas gradients
      const centerGX = width / 2;
      const centerGY = height / 2;
      const auroraRad = mode === 'compact' ? width * 0.3 : width * 0.5;

      const bgGradient = ctx.createRadialGradient(
        centerGX + Math.sin(coreAngle * 0.2) * 50,
        centerGY + Math.cos(coreAngle * 0.2) * 50,
        10,
        centerGX,
        centerGY,
        auroraRad
      );
      bgGradient.addColorStop(0, 'rgba(10, 15, 30, 0.3)');
      bgGradient.addColorStop(0.5, 'rgba(13, 10, 28, 0.15)');
      bgGradient.addColorStop(1, 'rgba(5, 7, 10, 0)');
      ctx.fillStyle = bgGradient;
      ctx.fillRect(0, 0, width, height);

      // Draw the connections
      ctx.lineWidth = 0.5;
      for (let i = 0; i < nodes.length; i++) {
        const n1 = nodes[i];
        for (let j = i + 1; j < nodes.length; j++) {
          const n2 = nodes[j];
          const dx = n1.x - n2.x;
          const dy = n1.y - n2.y;
          const dist = Math.sqrt(dx * dx + dy * dy);

          const maxDist = mode === 'compact' ? 80 : 120;
          if (dist < maxDist) {
            const alpha = (1 - dist / maxDist) * 0.18;
            ctx.strokeStyle = `rgba(0, 229, 255, ${alpha})`;
            ctx.beginPath();
            ctx.moveTo(n1.x, n1.y);
            ctx.lineTo(n2.x, n2.y);
            ctx.stroke();
          }
        }
      }

      // Draw/Update nodes
      nodes.forEach((node) => {
        // Move nodes
        node.x += node.vx;
        node.y += node.vy;

        // Mouse attraction/repulsion
        if (mouse.active) {
          const dx = mouse.x - node.x;
          const dy = mouse.y - node.y;
          const dist = Math.sqrt(dx * dx + dy * dy);
          if (dist < 200) {
            // Soft attraction to mouse
            node.x += dx * 0.003;
            node.y += dy * 0.003;
          }
        }

        // Boundary bounce
        if (node.x < 0 || node.x > width) node.vx *= -1;
        if (node.y < 0 || node.y > height) node.vy *= -1;

        // Node pulse sizing
        const pulse = Math.sin(coreAngle * node.pulseSpeed + node.pulseOffset) * 0.5 + 0.5;
        const currentRadius = node.radius + pulse * 1.5;

        // Draw particle
        ctx.beginPath();
        ctx.arc(node.x, node.y, currentRadius, 0, Math.PI * 2);
        ctx.fillStyle = node.color;
        ctx.shadowBlur = 8;
        ctx.shadowColor = node.color;
        ctx.fill();
        ctx.shadowBlur = 0; // reset
      });

      // RENDER THE CENTRAL AI CORE CONSCIOUSNESS SPHERE
      if (mode !== 'compact') {
        const coreX = width / 2;
        const coreY = mode === 'hero' ? height / 2 : height / 2;

        coreAngle += 0.01;

        // Outer Glow Sphere
        ctx.beginPath();
        ctx.arc(coreX, coreY, sphereRadius, 0, Math.PI * 2);
        const glowGrad = ctx.createRadialGradient(coreX, coreY, sphereRadius * 0.2, coreX, coreY, sphereRadius);
        glowGrad.addColorStop(0, 'rgba(0, 229, 255, 0.15)');
        glowGrad.addColorStop(0.4, 'rgba(147, 51, 234, 0.06)');
        glowGrad.addColorStop(0.8, 'rgba(59, 130, 246, 0.02)');
        glowGrad.addColorStop(1, 'rgba(0, 0, 0, 0)');
        ctx.fillStyle = glowGrad;
        ctx.fill();

        // Core central pulsing circle
        const corePulse = Math.sin(coreAngle * 3) * 6 + sphereRadius * 0.15;
        ctx.beginPath();
        ctx.arc(coreX, coreY, corePulse, 0, Math.PI * 2);
        const centralGrad = ctx.createRadialGradient(coreX, coreY, 2, coreX, coreY, corePulse);
        centralGrad.addColorStop(0, 'rgba(255, 255, 255, 0.85)');
        centralGrad.addColorStop(0.4, 'rgba(0, 229, 255, 0.7)');
        centralGrad.addColorStop(1, 'rgba(147, 51, 234, 0)');
        ctx.fillStyle = centralGrad;
        ctx.shadowBlur = 25;
        ctx.shadowColor = '#00e5ff';
        ctx.fill();
        ctx.shadowBlur = 0;

        // Drawing Orbiting Holographic Rings
        // Ring 1 (Cyan, inclined)
        ctx.save();
        ctx.translate(coreX, coreY);
        ctx.rotate(coreAngle);
        ctx.scale(1, 0.35);
        ctx.strokeStyle = 'rgba(0, 229, 255, 0.6)';
        ctx.lineWidth = 1.5;
        ctx.shadowBlur = 10;
        ctx.shadowColor = '#00e5ff';
        ctx.beginPath();
        ctx.arc(0, 0, sphereRadius * 0.75, 0, Math.PI * 2);
        ctx.stroke();
        
        // Add floating nodes on this ring
        for (let a = 0; a < Math.PI * 2; a += Math.PI / 3) {
          const px = Math.cos(a + coreAngle * 2) * sphereRadius * 0.75;
          const py = Math.sin(a + coreAngle * 2) * sphereRadius * 0.75;
          ctx.beginPath();
          ctx.arc(px, py, 3, 0, Math.PI * 2);
          ctx.fillStyle = '#ffffff';
          ctx.fill();
        }
        ctx.restore();

        // Ring 2 (Purple, opposite inclination)
        ctx.save();
        ctx.translate(coreX, coreY);
        ctx.rotate(-coreAngle * 0.7);
        ctx.scale(0.35, 1);
        ctx.strokeStyle = 'rgba(147, 51, 234, 0.5)';
        ctx.lineWidth = 1.2;
        ctx.shadowBlur = 10;
        ctx.shadowColor = '#9333ea';
        ctx.beginPath();
        ctx.arc(0, 0, sphereRadius * 0.9, 0, Math.PI * 2);
        ctx.stroke();
        ctx.restore();

        // Ring 3 (Outer dotted Blue ring)
        ctx.save();
        ctx.translate(coreX, coreY);
        ctx.rotate(coreAngle * 0.3);
        ctx.strokeStyle = 'rgba(59, 130, 246, 0.25)';
        ctx.setLineDash([4, 12]);
        ctx.lineWidth = 2;
        ctx.beginPath();
        ctx.arc(0, 0, sphereRadius * 1.1, 0, Math.PI * 2);
        ctx.stroke();
        ctx.restore();
      }

      animationFrameId = requestAnimationFrame(render);
    };

    render();

    return () => {
      cancelAnimationFrame(animationFrameId);
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('mouseleave', handleMouseLeave);
      window.removeEventListener('resize', handleResize);
    };
  }, [mode]);

  return (
    <div
      ref={containerRef}
      style={{
        position: 'fixed',
        top: 0,
        left: 0,
        width: '100vw',
        height: '100vh',
        zIndex: 0,
        pointerEvents: 'none',
        overflow: 'hidden',
        backgroundColor: '#05070a',
      }}
    >
      <canvas
        ref={canvasRef}
        style={{
          display: 'block',
          width: '100%',
          height: '100%',
          pointerEvents: 'auto',
        }}
      />
      {/* Absolute Overlay Glow Auroras */}
      <div className="absolute top-[-10%] left-[-10%] w-[50%] h-[50%] bg-[#00e5ff]/5 rounded-full filter blur-[150px] mix-blend-screen animate-pulse pointer-events-none" />
      <div className="absolute bottom-[-10%] right-[-10%] w-[60%] h-[60%] bg-[#9333ea]/8 rounded-full filter blur-[180px] mix-blend-screen pointer-events-none" />
    </div>
  );
};

export default AetherCore;
