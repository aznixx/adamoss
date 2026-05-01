import React, { useEffect, useRef } from 'react';

// ═══════════════════════════════════════════════════════════════
//  STARFIELD SCREENSAVER — Activates after idle timeout
// ═══════════════════════════════════════════════════════════════
export function StarfieldScreensaver({ onDismiss }: { onDismiss: () => void }) {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d')!;
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;

    const NUM_STARS = 400;
    const stars: { x: number; y: number; z: number; pz: number }[] = [];
    for (let i = 0; i < NUM_STARS; i++) {
      stars.push({
        x: (Math.random() - 0.5) * canvas.width,
        y: (Math.random() - 0.5) * canvas.height,
        z: Math.random() * canvas.width,
        pz: 0,
      });
    }

    let animFrame: number;
    const draw = () => {
      ctx.fillStyle = 'rgba(0, 0, 0, 0.2)';
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      const cx = canvas.width / 2;
      const cy = canvas.height / 2;
      const speed = 8;

      for (const star of stars) {
        star.pz = star.z;
        star.z -= speed;

        if (star.z <= 0) {
          star.x = (Math.random() - 0.5) * canvas.width;
          star.y = (Math.random() - 0.5) * canvas.height;
          star.z = canvas.width;
          star.pz = star.z;
        }

        const sx = (star.x / star.z) * canvas.width * 0.5 + cx;
        const sy = (star.y / star.z) * canvas.height * 0.5 + cy;
        const px = (star.x / star.pz) * canvas.width * 0.5 + cx;
        const py = (star.y / star.pz) * canvas.height * 0.5 + cy;

        const brightness = Math.min(255, Math.floor((1 - star.z / canvas.width) * 255));
        const size = Math.max(0.5, (1 - star.z / canvas.width) * 3);

        ctx.strokeStyle = `rgb(${brightness},${brightness},${brightness})`;
        ctx.lineWidth = size;
        ctx.beginPath();
        ctx.moveTo(px, py);
        ctx.lineTo(sx, sy);
        ctx.stroke();
      }

      animFrame = requestAnimationFrame(draw);
    };

    // Initial black fill
    ctx.fillStyle = '#000';
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    draw();

    return () => cancelAnimationFrame(animFrame);
  }, []);

  return (
    <div
      onClick={onDismiss}
      onMouseMove={onDismiss}
      onKeyDown={onDismiss}
      tabIndex={0}
      style={{
        position: 'fixed', inset: 0, zIndex: 9999998, cursor: 'none',
      }}
    >
      <canvas ref={canvasRef} style={{ width: '100%', height: '100%' }} />
      <div style={{
        position: 'absolute', bottom: 16, left: '50%', transform: 'translateX(-50%)',
        color: '#333', fontSize: 11, fontFamily: '"W95FA", sans-serif',
      }}>
        Move mouse or press any key to exit screensaver
      </div>
    </div>
  );
}

// ═══════════════════════════════════════════════════════════════
//  PIPES SCREENSAVER (alternate)
// ═══════════════════════════════════════════════════════════════
export function PipesScreensaver({ onDismiss }: { onDismiss: () => void }) {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d')!;
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;

    ctx.fillStyle = '#000';
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    let x = canvas.width / 2;
    let y = canvas.height / 2;
    let dir = Math.floor(Math.random() * 4); // 0=right 1=down 2=left 3=up
    const colors = ['#ff0000', '#00ff00', '#0000ff', '#ffff00', '#ff00ff', '#00ffff', '#ff8000', '#8000ff'];
    let color = colors[Math.floor(Math.random() * colors.length)];
    const pipeWidth = 6;
    const segmentLen = 20;
    let segments = 0;

    const drawSegment = () => {
      ctx.strokeStyle = color;
      ctx.lineWidth = pipeWidth;
      ctx.lineCap = 'round';
      ctx.lineJoin = 'round';

      const dx = [segmentLen, 0, -segmentLen, 0][dir];
      const dy = [0, segmentLen, 0, -segmentLen][dir];
      const nx = x + dx;
      const ny = y + dy;

      ctx.beginPath();
      ctx.moveTo(x, y);
      ctx.lineTo(nx, ny);
      ctx.stroke();

      // Joint ball
      ctx.fillStyle = color;
      ctx.beginPath();
      ctx.arc(nx, ny, pipeWidth / 2 + 1, 0, Math.PI * 2);
      ctx.fill();

      // Highlight
      ctx.strokeStyle = 'rgba(255,255,255,0.3)';
      ctx.lineWidth = 2;
      ctx.beginPath();
      ctx.moveTo(x + (dir === 0 || dir === 2 ? 0 : -2), y + (dir === 1 || dir === 3 ? 0 : -2));
      ctx.lineTo(nx + (dir === 0 || dir === 2 ? 0 : -2), ny + (dir === 1 || dir === 3 ? 0 : -2));
      ctx.stroke();

      x = nx;
      y = ny;
      segments++;

      // Change direction sometimes
      if (Math.random() < 0.3) {
        const turn = Math.random() < 0.5 ? 1 : -1;
        dir = (dir + turn + 4) % 4;
      }

      // Out of bounds or long pipe → new pipe
      if (x < 10 || x > canvas.width - 10 || y < 10 || y > canvas.height - 10 || segments > 40) {
        x = Math.random() * canvas.width;
        y = Math.random() * canvas.height;
        dir = Math.floor(Math.random() * 4);
        color = colors[Math.floor(Math.random() * colors.length)];
        segments = 0;
      }
    };

    const interval = setInterval(drawSegment, 50);
    return () => clearInterval(interval);
  }, []);

  return (
    <div onClick={onDismiss} onMouseMove={onDismiss} onKeyDown={onDismiss} tabIndex={0}
      style={{ position: 'fixed', inset: 0, zIndex: 9999998, cursor: 'none' }}>
      <canvas ref={canvasRef} style={{ width: '100%', height: '100%' }} />
    </div>
  );
}
