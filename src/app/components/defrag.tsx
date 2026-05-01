import React, { useState, useEffect, useCallback, useRef } from 'react';

// ═══════════════════════════════════════════════════════════════
//  DISK DEFRAGMENTER — Satisfying block animation
// ═══════════════════════════════════════════════════════════════

type BlockState = 'used' | 'fragmented' | 'empty' | 'optimized' | 'reading' | 'writing';

const BLOCK_COLORS: Record<BlockState, string> = {
  used: '#0000ff',
  fragmented: '#ff0000',
  empty: '#ffffff',
  optimized: '#0000ff',
  reading: '#ffff00',
  writing: '#00ff00',
};

const COLS = 28;
const ROWS = 16;

export function DefragContent() {
  const [blocks, setBlocks] = useState<BlockState[]>([]);
  const [running, setRunning] = useState(false);
  const [percent, setPercent] = useState(0);
  const [status, setStatus] = useState('Click "Start" to begin defragmentation.');
  const [drive, setDrive] = useState('C:');
  const animRef = useRef<ReturnType<typeof setInterval>>();
  const stepRef = useRef(0);

  // Initialize with random fragmentation
  useEffect(() => {
    resetDisk();
  }, []);

  const resetDisk = () => {
    const total = COLS * ROWS;
    const newBlocks: BlockState[] = [];
    for (let i = 0; i < total; i++) {
      const rand = Math.random();
      if (rand < 0.35) newBlocks.push('used');
      else if (rand < 0.55) newBlocks.push('fragmented');
      else newBlocks.push('empty');
    }
    setBlocks(newBlocks);
    setPercent(0);
    setStatus('Click "Start" to begin defragmentation.');
    setRunning(false);
    stepRef.current = 0;
    if (animRef.current) clearInterval(animRef.current);
  };

  const startDefrag = useCallback(() => {
    if (running) return;
    setRunning(true);
    setStatus('Defragmenting Drive ' + drive + '...');
    stepRef.current = 0;

    animRef.current = setInterval(() => {
      setBlocks(prev => {
        const nb = [...prev];
        const total = nb.length;
        const step = stepRef.current;

        if (step >= total) {
          // Done
          clearInterval(animRef.current!);
          setRunning(false);
          setPercent(100);
          setStatus('Defragmentation complete! Drive ' + drive + ' is now optimized.');
          return nb;
        }

        // Find a fragmented or empty block to fix
        // Move all "used" and "fragmented" to the front, "empty" to the back
        // Simulate by processing one block at a time
        const currentIdx = step;
        
        // Read phase - highlight current
        if (nb[currentIdx] === 'fragmented') {
          nb[currentIdx] = 'reading';
          // Find the first empty spot before this that we can move to
          setTimeout(() => {
            setBlocks(prev2 => {
              const nb2 = [...prev2];
              if (nb2[currentIdx] === 'reading') {
                nb2[currentIdx] = 'optimized';
              }
              return nb2;
            });
          }, 100);
        } else if (nb[currentIdx] === 'used') {
          nb[currentIdx] = 'optimized';
        } else if (nb[currentIdx] === 'empty') {
          // Move a fragmented block from later to here
          const fragIdx = nb.findIndex((b, i) => i > currentIdx && (b === 'fragmented'));
          if (fragIdx !== -1) {
            nb[currentIdx] = 'writing';
            nb[fragIdx] = 'empty';
            setTimeout(() => {
              setBlocks(prev2 => {
                const nb2 = [...prev2];
                if (nb2[currentIdx] === 'writing') {
                  nb2[currentIdx] = 'optimized';
                }
                return nb2;
              });
            }, 80);
          }
        }

        stepRef.current = step + 1;
        setPercent(Math.floor((step / total) * 100));
        return nb;
      });
    }, 60);
  }, [running, drive]);

  const stopDefrag = () => {
    if (animRef.current) clearInterval(animRef.current);
    setRunning(false);
    setStatus('Defragmentation paused.');
  };

  const legend: { color: string; label: string }[] = [
    { color: BLOCK_COLORS.optimized, label: 'Optimized' },
    { color: BLOCK_COLORS.used, label: 'Used' },
    { color: BLOCK_COLORS.fragmented, label: 'Fragmented' },
    { color: BLOCK_COLORS.empty, label: 'Free Space' },
    { color: BLOCK_COLORS.reading, label: 'Reading' },
    { color: BLOCK_COLORS.writing, label: 'Writing' },
  ];

  return (
    <div style={{ background: '#c0c0c0', padding: 8, height: '100%', display: 'flex', flexDirection: 'column', gap: 6 }}>
      {/* Drive selector */}
      <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
        <span style={{ fontSize: 11, fontWeight: 'bold' }}>Drive:</span>
        <select className="w95-select" value={drive} onChange={e => setDrive(e.target.value)} style={{ width: 60 }}>
          <option>C:</option>
          <option>D:</option>
        </select>
        <span style={{ fontSize: 11, color: '#808080' }}>
          {drive === 'C:' ? 'ADAMOS (FAT32)' : 'GAMES (FAT16)'}
        </span>
      </div>

      {/* Block grid */}
      <div style={{
        border: '2px inset #c0c0c0', background: '#000', padding: 2,
        display: 'grid', gridTemplateColumns: `repeat(${COLS}, 1fr)`, gap: 1,
        flex: 1,
      }}>
        {blocks.map((block, i) => (
          <div key={i} style={{
            background: BLOCK_COLORS[block],
            aspectRatio: '1',
            transition: block === 'reading' || block === 'writing' ? 'none' : 'background-color 0.15s',
          }} />
        ))}
      </div>

      {/* Legend */}
      <div style={{ display: 'flex', gap: 12, flexWrap: 'wrap' }}>
        {legend.map(l => (
          <div key={l.label} style={{ display: 'flex', alignItems: 'center', gap: 3, fontSize: 10 }}>
            <div style={{ width: 10, height: 10, background: l.color, border: '1px solid #000' }} />
            <span>{l.label}</span>
          </div>
        ))}
      </div>

      {/* Progress */}
      <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
        <div style={{
          flex: 1, height: 16, background: '#fff',
          borderTop: '2px solid #808080', borderLeft: '2px solid #808080',
          borderRight: '2px solid #fff', borderBottom: '2px solid #fff',
          padding: 2,
        }}>
          <div style={{ height: '100%', width: `${percent}%`, background: '#000080', transition: 'width 0.1s' }} />
        </div>
        <span style={{ fontSize: 11, width: 30, textAlign: 'right' }}>{percent}%</span>
      </div>

      {/* Status */}
      <div style={{
        fontSize: 11, color: '#808080', padding: '2px 4px',
        borderTop: '1px solid #808080', borderBottom: '1px solid #fff',
      }}>
        {status}
      </div>

      {/* Buttons */}
      <div style={{ display: 'flex', justifyContent: 'flex-end', gap: 4 }}>
        <button className="w95-btn" style={{ minWidth: 75 }} onClick={startDefrag} disabled={running}>Start</button>
        <button className="w95-btn" style={{ minWidth: 75 }} onClick={stopDefrag} disabled={!running}>Stop</button>
        <button className="w95-btn" style={{ minWidth: 75 }} onClick={resetDisk}>Reset</button>
      </div>
    </div>
  );
}
