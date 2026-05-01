import React, { useState, useEffect, useRef } from 'react';
import { IconClippy } from './win95-icons';

const CLIPPY_TIPS = [
  "It looks like you're writing a portfolio! Would you like help?",
  "Tip: Try typing 'doom' for a surprise! 🎮",
  "Did you know? You can right-click the desktop for more options!",
  "Try opening the Run dialog from the Start menu!",
  "You look like someone who appreciates good UI. This IS good UI.",
  "I see you're browsing. The Internet Explorer has a full homepage!",
  "Pro tip: Try dragging windows by their title bar!",
  "Fun fact: This portfolio runs on 100% nostalgia.",
  "Have you tried Minesweeper yet? It's in Programs!",
  "Tip: MS Paint lets you actually draw! Try it!",
  "Type 'matrix' anywhere for a cinematic experience.",
  "Did you know? The Calculator actually works!",
  "I'm Clippy! I've been annoying people since 1997! 📎",
  "The Defrag tool is strangely satisfying to watch...",
  "Try the CMD prompt! Type 'help' for a list of commands.",
  "You can resize windows by dragging their edges!",
  "Type 'bsod' if you dare... 💀",
  "The Skills.txt notepad is fully editable — go ahead, add your own!",
  "Type 'nyan' for a colorful experience! 🌈",
  "I see you haven't visited the Recycle Bin. It has... stuff.",
];

const CLIPPY_REACTIONS: Record<string, string> = {
  idle: "📎 *taps on screen*\nHello? Anyone there?",
  click: "Ouch! That tickles! 😄",
  drag: "Wheee! I'm being dragged! 🎢",
  minimize: "I saw you minimize a window.\nDon't worry, it's not gone forever!",
  close: "Another window closed...\nDo you want to save your work? Just kidding!",
  type: "I see you're typing!\nLet me watch... 👀",
};

interface ClippyProps {
  lastAction?: string;
}

export function Clippy({ lastAction }: ClippyProps) {
  const [visible, setVisible] = useState(false);
  const [message, setMessage] = useState('');
  const [showBubble, setShowBubble] = useState(false);
  const [pos, setPos] = useState({ x: -1, y: -1 });
  const [eyeOffset, setEyeOffset] = useState({ x: 0, y: 0 });
  const [dismissed, setDismissed] = useState(false);
  const [bouncing, setBouncing] = useState(false);
  const tipIndex = useRef(0);
  const idleTimer = useRef<ReturnType<typeof setTimeout>>();
  const dragging = useRef(false);
  const dragOffset = useRef({ x: 0, y: 0 });

  // Initial appearance
  useEffect(() => {
    const timer = setTimeout(() => {
      if (!dismissed) {
        setVisible(true);
        setMessage(CLIPPY_TIPS[0]);
        setShowBubble(true);
        // Position bottom-right
        setPos({
          x: window.innerWidth - 120,
          y: window.innerHeight - 160,
        });
      }
    }, 8000);
    return () => clearTimeout(timer);
  }, [dismissed]);

  // Cycle tips
  useEffect(() => {
    if (!visible || dismissed) return;
    const interval = setInterval(() => {
      tipIndex.current = (tipIndex.current + 1) % CLIPPY_TIPS.length;
      setMessage(CLIPPY_TIPS[tipIndex.current]);
      setShowBubble(true);
      setBouncing(true);
      setTimeout(() => setBouncing(false), 500);
    }, 20000);
    return () => clearInterval(interval);
  }, [visible, dismissed]);

  // React to actions
  useEffect(() => {
    if (!visible || !lastAction || dismissed) return;
    const reaction = CLIPPY_REACTIONS[lastAction];
    if (reaction) {
      setMessage(reaction);
      setShowBubble(true);
      setBouncing(true);
      setTimeout(() => setBouncing(false), 500);
    }
  }, [lastAction, visible, dismissed]);

  // Eye tracking
  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (!visible) return;
      const cx = pos.x + 30;
      const cy = pos.y + 25;
      const dx = e.clientX - cx;
      const dy = e.clientY - cy;
      const dist = Math.sqrt(dx * dx + dy * dy);
      const maxOffset = 2;
      setEyeOffset({
        x: (dx / Math.max(dist, 1)) * maxOffset,
        y: (dy / Math.max(dist, 1)) * maxOffset,
      });
    };
    window.addEventListener('mousemove', handler);
    return () => window.removeEventListener('mousemove', handler);
  }, [visible, pos]);

  // Idle reaction
  useEffect(() => {
    if (!visible || dismissed) return;
    const resetIdle = () => {
      if (idleTimer.current) clearTimeout(idleTimer.current);
      idleTimer.current = setTimeout(() => {
        setMessage(CLIPPY_REACTIONS.idle);
        setShowBubble(true);
        setBouncing(true);
        setTimeout(() => setBouncing(false), 500);
      }, 45000);
    };
    window.addEventListener('mousemove', resetIdle);
    window.addEventListener('keydown', resetIdle);
    resetIdle();
    return () => {
      window.removeEventListener('mousemove', resetIdle);
      window.removeEventListener('keydown', resetIdle);
      if (idleTimer.current) clearTimeout(idleTimer.current);
    };
  }, [visible, dismissed]);

  const onMouseDown = (e: React.MouseEvent) => {
    dragging.current = true;
    dragOffset.current = { x: e.clientX - pos.x, y: e.clientY - pos.y };
    const onMove = (ev: MouseEvent) => {
      if (!dragging.current) return;
      setPos({ x: ev.clientX - dragOffset.current.x, y: ev.clientY - dragOffset.current.y });
    };
    const onUp = () => {
      dragging.current = false;
      document.removeEventListener('mousemove', onMove);
      document.removeEventListener('mouseup', onUp);
    };
    document.addEventListener('mousemove', onMove);
    document.addEventListener('mouseup', onUp);
  };

  const handleDismiss = () => {
    setDismissed(true);
    setVisible(false);
  };

  const handleClick = () => {
    if (showBubble) {
      tipIndex.current = (tipIndex.current + 1) % CLIPPY_TIPS.length;
      setMessage(CLIPPY_TIPS[tipIndex.current]);
    } else {
      setShowBubble(true);
    }
    setBouncing(true);
    setTimeout(() => setBouncing(false), 300);
  };

  if (!visible || dismissed) return null;

  return (
    <div style={{ position: 'fixed', left: pos.x, top: pos.y, zIndex: 999990, userSelect: 'none' }}>
      {/* Speech Bubble */}
      {showBubble && (
        <div style={{
          position: 'absolute', bottom: '100%', right: -20, marginBottom: 4,
          background: '#ffffcc', border: '1px solid #000', padding: '6px 8px',
          fontSize: 11, fontFamily: '"W95FA", "MS Sans Serif", sans-serif',
          maxWidth: 220, lineHeight: 1.4, whiteSpace: 'pre-wrap',
          boxShadow: '2px 2px 0 #808080',
        }}>
          <div style={{ position: 'absolute', bottom: -6, left: 20, width: 0, height: 0, borderLeft: '6px solid transparent', borderRight: '6px solid transparent', borderTop: '6px solid #000' }} />
          <div style={{ position: 'absolute', bottom: -5, left: 21, width: 0, height: 0, borderLeft: '5px solid transparent', borderRight: '5px solid transparent', borderTop: '5px solid #ffffcc' }} />
          {message}
          <div style={{ display: 'flex', justifyContent: 'flex-end', gap: 4, marginTop: 4 }}>
            <button
              style={{ background: '#c0c0c0', border: '2px outset #c0c0c0', padding: '1px 8px', fontSize: 10, cursor: 'default', fontFamily: 'inherit' }}
              onClick={(e) => { e.stopPropagation(); setShowBubble(false); }}
            >OK</button>
            <button
              style={{ background: '#c0c0c0', border: '2px outset #c0c0c0', padding: '1px 8px', fontSize: 10, cursor: 'default', fontFamily: 'inherit' }}
              onClick={(e) => { e.stopPropagation(); handleDismiss(); }}
            >Go Away</button>
          </div>
        </div>
      )}
      {/* Clippy Body */}
      <div
        onMouseDown={onMouseDown}
        onClick={handleClick}
        style={{
          cursor: 'default',
          transform: bouncing ? 'translateY(-4px)' : 'translateY(0)',
          transition: 'transform 0.15s ease',
        }}
      >
        {/* Custom Clippy with eye tracking */}
        <svg width={60} height={80} viewBox="0 0 60 80" fill="none">
          {/* Shadow */}
          <ellipse cx="30" cy="78" rx="18" ry="2" fill="rgba(0,0,0,0.15)" />
          {/* Wire body */}
          <path d="M22 72 L22 28 Q22 12 32 12 Q42 12 42 28 L42 56 Q42 66 32 66 Q28 66 28 56 L28 32"
            fill="none" stroke="#a0a0a0" strokeWidth="5" strokeLinecap="round" />
          <path d="M22 72 L22 28 Q22 12 32 12 Q42 12 42 28 L42 56 Q42 66 32 66 Q28 66 28 56 L28 32"
            fill="none" stroke="#d0d0d0" strokeWidth="3" strokeLinecap="round" />
          {/* Left eye */}
          <circle cx="26" cy="24" r="4.5" fill="#fff" stroke="#000" strokeWidth="1" />
          <circle cx={26 + eyeOffset.x} cy={23 + eyeOffset.y} r="2" fill="#000" />
          <circle cx={25 + eyeOffset.x * 0.5} cy={22 + eyeOffset.y * 0.5} r="0.8" fill="#fff" />
          {/* Right eye */}
          <circle cx="36" cy="24" r="4.5" fill="#fff" stroke="#000" strokeWidth="1" />
          <circle cx={36 + eyeOffset.x} cy={23 + eyeOffset.y} r="2" fill="#000" />
          <circle cx={35 + eyeOffset.x * 0.5} cy={22 + eyeOffset.y * 0.5} r="0.8" fill="#fff" />
          {/* Eyebrows */}
          <line x1="22" y1="18" x2="28" y2="19" stroke="#000" strokeWidth="1.2" />
          <line x1="34" y1="19" x2="40" y2="18" stroke="#000" strokeWidth="1.2" />
          {/* Smile */}
          <path d="M28 30 Q31 34 34 30" fill="none" stroke="#000" strokeWidth="1" />
        </svg>
      </div>
    </div>
  );
}
