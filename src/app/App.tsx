/* Win95 Portfolio v3 — The Ultimate Edition */
import React, { useState, useEffect, useRef, useCallback, createContext, useContext } from 'react';
import '../styles/win95.css';
import {
  IconComputer, IconFolder, IconFolderOpen, IconNotepad, IconMail, IconWordpad,
  IconRecycleBin, IconRecycleBinFull, IconUser, WinFlag, IconHelp, IconSettings,
  IconFind, IconPrograms, IconRun, IconShutdown, IconIE, IconMinesweeper,
  IconPaint, IconSolitaire, IconInfo, IconWarning, IconError, IconClipboard,
  IconCalculator, IconCMD, IconDefrag, IconMediaPlayer, IconClippy,
  IconBeer, IconMap, IconRobot, IconChip, IconTrain, IconChat, IconGlobe, IconVolume, IconGithub, IconPrinter, IconFloppy,
  IconHome, IconRefresh, IconStar
} from './components/win95-icons';
import { Clippy } from './components/clippy';
import { StarfieldScreensaver, PipesScreensaver } from './components/screensaver';
import { CalculatorContent } from './components/calculator';
import { CMDContent } from './components/cmd';
import { DefragContent } from './components/defrag';

// ═══════════════════════════════════════════════════════════════
//  TYPES
// ═══════════════════════════════════════════════════════════════
type WindowType = 'ABOUT' | 'PROJECTS' | 'SKILLS' | 'CONTACT' | 'RESUME' | 'HELP' | 'RUN' | 'FIND' | 'MINESWEEPER' | 'PAINT' | 'IE' | 'SOLITAIRE' | 'SETTINGS' | 'CALCULATOR' | 'CMD' | 'DEFRAG';

interface WinState {
  id: string;
  type: WindowType;
  title: string;
  isOpen: boolean;
  isMinimized: boolean;
  isMaximized: boolean;
  zIndex: number;
  x: number;
  y: number;
  w: number;
  h: number;
  icon: React.ReactNode;
}

interface DialogState {
  title: string;
  message: string;
  icon: 'info' | 'warning' | 'error';
  buttons: { label: string; onClick: () => void }[];
}

interface ContextMenuItem {
  label: string;
  onClick: () => void;
  separator?: boolean;
  disabled?: boolean;
}

// ═══════════════════════════════════════════════════════════════
//  CLIPBOARD CONTEXT (for Copy/Paste across windows)
// ═══════════════════════════════════════════════════════════════
const ClipboardContext = createContext<{
  clipboard: string;
  setClipboard: (s: string) => void;
}>({ clipboard: '', setClipboard: () => { } });

// ═══════════════════════════════════════════════════════════════
//  DESKTOP ICON CONFIG — easy to edit!
// ═══════════════════════════════════════════════════════════════
const DESKTOP_ICONS: {
  type: WindowType | null;
  label: string;
  icon: React.ReactNode;
  menuIcon: React.ReactNode;
  w: number;
  h: number;
}[] = [
    { type: 'ABOUT', label: 'About Me', icon: <IconUser size={48} />, menuIcon: <IconUser size={20} />, w: 720, h: 500 },
    { type: 'PROJECTS', label: 'My Projects', icon: <IconFolder size={48} />, menuIcon: <IconFolder size={20} />, w: 760, h: 560 },
    { type: 'SKILLS', label: 'Skills.txt', icon: <IconNotepad size={48} />, menuIcon: <IconNotepad size={20} />, w: 600, h: 480 },
    { type: 'CONTACT', label: 'Contact Me', icon: <IconMail size={48} />, menuIcon: <IconMail size={20} />, w: 540, h: 500 },
    { type: 'RESUME', label: 'Resume.doc', icon: <IconWordpad size={48} />, menuIcon: <IconWordpad size={20} />, w: 680, h: 620 },
    { type: 'IE', label: 'Internet\nExplorer', icon: <IconIE size={48} />, menuIcon: <IconIE size={20} />, w: 700, h: 550 },
    { type: null, label: 'Recycle Bin', icon: <IconRecycleBin size={48} />, menuIcon: <IconRecycleBin size={20} />, w: 0, h: 0 },
  ];

// ═══════════════════════════════════════════════════════════════
//  DRAG HOOK
// ═══════════════════════════════════════════════════════════════
function useDrag(initialX: number, initialY: number, onFocus: () => void, disabled: boolean) {
  const posRef = useRef({ x: initialX, y: initialY });
  const [pos, setPos] = useState({ x: initialX, y: initialY });
  const dragging = useRef(false);
  const offset = useRef({ x: 0, y: 0 });

  const onMouseDown = useCallback((e: React.MouseEvent) => {
    if (disabled || e.button !== 0) return;
    onFocus();
    dragging.current = true;
    offset.current = { x: e.clientX - posRef.current.x, y: e.clientY - posRef.current.y };
    const move = (ev: MouseEvent) => {
      if (!dragging.current) return;
      const nx = ev.clientX - offset.current.x;
      const ny = ev.clientY - offset.current.y;
      posRef.current = { x: nx, y: ny };
      setPos({ x: nx, y: ny });
    };
    const up = () => {
      dragging.current = false;
      document.removeEventListener('mousemove', move);
      document.removeEventListener('mouseup', up);
    };
    document.addEventListener('mousemove', move);
    document.addEventListener('mouseup', up);
  }, [disabled, onFocus]);

  return { pos, onMouseDown };
}

// ═══════════════════════════════════════════════════════════════
//  RESIZE HOOK
// ═══════════════════════════════════════════════════════════════
function useResize(initialW: number, initialH: number, minW = 200, minH = 150) {
  const [size, setSize] = useState({ w: initialW, h: initialH });
  const sizeRef = useRef({ w: initialW, h: initialH });

  const onResizeStart = useCallback((e: React.MouseEvent, dir: string) => {
    e.preventDefault();
    e.stopPropagation();
    const startX = e.clientX;
    const startY = e.clientY;
    const startW = sizeRef.current.w;
    const startH = sizeRef.current.h;
    const move = (ev: MouseEvent) => {
      let nw = startW;
      let nh = startH;
      if (dir.includes('e')) nw = Math.max(minW, startW + (ev.clientX - startX));
      if (dir.includes('s')) nh = Math.max(minH, startH + (ev.clientY - startY));
      sizeRef.current = { w: nw, h: nh };
      setSize({ w: nw, h: nh });
    };
    const up = () => {
      document.removeEventListener('mousemove', move);
      document.removeEventListener('mouseup', up);
    };
    document.addEventListener('mousemove', move);
    document.addEventListener('mouseup', up);
  }, [minW, minH]);

  return { size, onResizeStart };
}

// ═══════════════════════════════════════════════════════════════
//  WIN95 WINDOW
// ═══════════════════════════════════════════════════════════════
function Win95Window({
  win, isActive, onFocus, onMinimize, onMaximize, onClose, children, menuItems,
}: {
  win: WinState;
  isActive: boolean;
  onFocus: () => void;
  onMinimize: () => void;
  onMaximize: () => void;
  onClose: () => void;
  children: React.ReactNode;
  menuItems?: { label: string; items: { label: string; onClick: () => void; disabled?: boolean; separator?: boolean; shortcut?: string }[] }[];
}) {
  const { pos, onMouseDown } = useDrag(win.x, win.y, onFocus, win.isMaximized);
  const { size, onResizeStart } = useResize(win.w, win.h);
  const [openMenu, setOpenMenu] = useState<string | null>(null);
  const menuRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(e.target as Node)) setOpenMenu(null);
    };
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, []);

  const style: React.CSSProperties = win.isMaximized
    ? { position: 'absolute', left: 0, top: 0, width: '100%', height: 'calc(100% - 32px)', zIndex: win.zIndex }
    : { position: 'absolute', left: pos.x, top: pos.y, width: size.w, height: size.h, zIndex: win.zIndex };

  return (
    <div style={style} className="w95-outset" onMouseDown={onFocus}>
      <div style={{ background: '#c0c0c0', padding: 2, display: 'flex', flexDirection: 'column', height: '100%', position: 'relative' }}>
        {/* Title Bar */}
        <div
          onMouseDown={onMouseDown}
          onDoubleClick={onMaximize}
          className={isActive ? 'w95-titlebar-active' : 'w95-titlebar-inactive'}
          style={{ height: 24, display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '0 4px', marginBottom: 1, flexShrink: 0, userSelect: 'none' }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: 3, overflow: 'hidden' }}>
            <div style={{ width: 20, height: 20, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
              {win.icon}
            </div>
            <span style={{ fontSize: 14, fontWeight: 'bold', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{win.title}</span>
          </div>
          <div style={{ display: 'flex', gap: 2, flexShrink: 0 }}>
            <button className="w95-title-btn" onClick={(e) => { e.stopPropagation(); onMinimize(); }}><span style={{ marginTop: 4 }}>_</span></button>
            <button className="w95-title-btn" onClick={(e) => { e.stopPropagation(); onMaximize(); }}><span style={{ fontSize: 8 }}>□</span></button>
            <button className="w95-title-btn" onClick={(e) => { e.stopPropagation(); onClose(); }}><span>×</span></button>
          </div>
        </div>

        {/* Menu Bar */}
        {menuItems && (
          <div ref={menuRef} style={{ display: 'flex', gap: 0, padding: '1px 0', marginBottom: 1, flexShrink: 0, position: 'relative' }}>
            {menuItems.map(menu => (
              <div key={menu.label} style={{ position: 'relative' }}>
                <span
                  style={{
                    padding: '2px 8px', fontSize: 14, cursor: 'default',
                    background: openMenu === menu.label ? '#000080' : 'transparent',
                    color: openMenu === menu.label ? '#fff' : '#000',
                  }}
                  onMouseDown={(e) => { e.stopPropagation(); setOpenMenu(openMenu === menu.label ? null : menu.label); }}
                  onMouseEnter={() => openMenu && setOpenMenu(menu.label)}
                >
                  {menu.label}
                </span>
                {openMenu === menu.label && (
                  <div className="w95-outset" style={{
                    position: 'absolute', top: '100%', left: 0, background: '#c0c0c0',
                    minWidth: 180, padding: 2, zIndex: 99999,
                  }}>
                    {menu.items.map((item, i) => item.separator ? (
                      <div key={i} style={{ borderTop: '1px solid #808080', borderBottom: '1px solid #fff', margin: '2px 2px' }} />
                    ) : (
                      <div
                        key={i}
                        onClick={() => { if (!item.disabled) { item.onClick(); setOpenMenu(null); } }}
                        style={{
                          display: 'flex', justifyContent: 'space-between', padding: '4px 24px 4px 8px', fontSize: 14, cursor: 'default',
                          color: item.disabled ? '#808080' : '#000',
                        }}
                        onMouseEnter={e => { if (!item.disabled) { (e.currentTarget).style.background = '#000080'; (e.currentTarget).style.color = '#fff'; } }}
                        onMouseLeave={e => { (e.currentTarget).style.background = ''; (e.currentTarget).style.color = item.disabled ? '#808080' : '#000'; }}
                      >
                        <span>{item.label}</span>
                        {item.shortcut && <span style={{ color: item.disabled ? '#808080' : '#808080', marginLeft: 20 }}>{item.shortcut}</span>}
                      </div>
                    ))}
                  </div>
                )}
              </div>
            ))}
          </div>
        )}

        {/* Content */}
        <div className="w95-inset w95-scroll" style={{ flex: 1, overflow: 'auto', background: '#fff', position: 'relative' }}>
          {children}
        </div>

        {/* Status Bar */}
        <div style={{ display: 'flex', gap: 2, marginTop: 2, flexShrink: 0 }}>
          <div className="w95-groove" style={{ flex: 1, padding: '2px 6px', fontSize: 13, color: '#808080' }}>Ready</div>
          <div className="w95-groove" style={{ width: 120, padding: '2px 6px', fontSize: 13, color: '#808080' }}>My Computer</div>
        </div>

        {/* Resize Handle */}
        {!win.isMaximized && (
          <>
            <div style={{ position: 'absolute', right: 0, bottom: 0, width: 12, height: 12, cursor: 'se-resize' }} onMouseDown={e => onResizeStart(e, 'se')} />
            <div style={{ position: 'absolute', right: 0, top: 20, bottom: 12, width: 4, cursor: 'e-resize' }} onMouseDown={e => onResizeStart(e, 'e')} />
            <div style={{ position: 'absolute', left: 0, bottom: 0, right: 12, height: 4, cursor: 's-resize' }} onMouseDown={e => onResizeStart(e, 's')} />
          </>
        )}
      </div>
    </div>
  );
}

// ═══════════════════════════════════════════════════════════════
//  DIALOG BOX
// ═══════════════════════════════════════════════════════════════
function DialogBox({ dialog, onClose }: { dialog: DialogState; onClose: () => void }) {
  const iconEl = dialog.icon === 'info' ? <IconInfo size={48} /> : dialog.icon === 'warning' ? <IconWarning size={48} /> : <IconError size={48} />;
  return (
    <div style={{ position: 'fixed', inset: 0, zIndex: 999999, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
      <div style={{ position: 'absolute', inset: 0 }} onClick={onClose} />
      <div className="w95-outset" style={{ background: '#c0c0c0', padding: 2, minWidth: 320, position: 'relative', zIndex: 1 }}>
        <div className="w95-titlebar-active" style={{ height: 18, display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '0 4px', marginBottom: 2 }}>
          <span style={{ fontSize: 14, fontWeight: 'bold', color: '#fff' }}>{dialog.title}</span>
          <button className="w95-title-btn" onClick={onClose}><span>×</span></button>
        </div>
        <div style={{ padding: '12px 16px', display: 'flex', gap: 16, alignItems: 'flex-start' }}>
          <div style={{ flexShrink: 0 }}>{iconEl}</div>
          <div style={{ fontSize: 14, lineHeight: 1.5, whiteSpace: 'pre-wrap' }}>{dialog.message}</div>
        </div>
        <div style={{ display: 'flex', justifyContent: 'center', gap: 8, padding: '8px 16px 12px' }}>
          {dialog.buttons.map((btn, i) => (
            <button key={i} className="w95-btn" style={{ minWidth: 75, padding: '2px 8px' }} onClick={() => { btn.onClick(); onClose(); }}>
              {btn.label}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}

// ═══════════════════════════════════════════════════════════════
//  CONTEXT MENU
// ═══════════════════════════════════════════════════════════════
function ContextMenu({ items, x, y, onClose }: { items: ContextMenuItem[]; x: number; y: number; onClose: () => void }) {
  useEffect(() => {
    const handler = () => onClose();
    document.addEventListener('click', handler);
    return () => document.removeEventListener('click', handler);
  }, [onClose]);

  return (
    <div className="w95-outset" style={{
      position: 'fixed', left: x, top: y, background: '#c0c0c0', minWidth: 160, padding: 2, zIndex: 999998,
    }}>
      {items.map((item, i) => item.separator ? (
        <div key={i} style={{ borderTop: '1px solid #808080', borderBottom: '1px solid #fff', margin: '2px 2px' }} />
      ) : (
        <div
          key={i}
          onClick={(e) => { e.stopPropagation(); if (!item.disabled) { item.onClick(); onClose(); } }}
          style={{ padding: '2px 20px 2px 6px', fontSize: 11, cursor: 'default', color: item.disabled ? '#808080' : '#000' }}
          onMouseEnter={e => { if (!item.disabled) { (e.currentTarget).style.background = '#000080'; (e.currentTarget).style.color = '#fff'; } }}
          onMouseLeave={e => { (e.currentTarget).style.background = ''; (e.currentTarget).style.color = item.disabled ? '#808080' : '#000'; }}
        >
          {item.label}
        </div>
      ))}
    </div>
  );
}

// ═══════════════════════════════════════════════════════════════
//  SHUTDOWN SCREEN
// ═══════════════════════════════════════════════════════════════
function ShutdownScreen({ onCancel }: { onCancel: () => void }) {
  const [phase, setPhase] = useState<'ask' | 'shutting' | 'off'>('ask');

  if (phase === 'off') {
    return (
      <div style={{ position: 'fixed', inset: 0, background: '#000', zIndex: 9999999, display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'default' }}
        onClick={() => { setPhase('ask'); onCancel(); }}
      >
        <div style={{ color: '#ff8000', fontSize: 18, fontFamily: '"W95FA", monospace', textAlign: 'center' }}>
          <div>It's now safe to turn off</div>
          <div>your computer.</div>
          <div style={{ fontSize: 11, color: '#808080', marginTop: 16 }}>(Click anywhere to restart)</div>
        </div>
      </div>
    );
  }

  if (phase === 'shutting') {
    return (
      <div style={{ position: 'fixed', inset: 0, background: '#000080', zIndex: 9999999, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center' }}>
        <div style={{ color: '#fff', fontSize: 16, fontFamily: '"W95FA", monospace', marginBottom: 20 }}>adamOS is shutting down...</div>
        <div style={{ width: 200, height: 16, background: '#c0c0c0', border: '1px solid #808080', padding: 2 }}>
          <ShutdownProgress onDone={() => setPhase('off')} />
        </div>
      </div>
    );
  }

  return (
    <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.5)', zIndex: 9999999, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
      <div className="w95-outset" style={{ background: '#c0c0c0', padding: 2, width: 340 }}>
        <div className="w95-titlebar-active" style={{ height: 18, display: 'flex', alignItems: 'center', padding: '0 4px', marginBottom: 2 }}>
          <span style={{ fontSize: 11, fontWeight: 'bold', color: '#fff' }}>Shut Down adamOS</span>
        </div>
        <div style={{ padding: 16, display: 'flex', gap: 16, alignItems: 'flex-start' }}>
          <IconComputer size={48} />
          <div style={{ fontSize: 11, lineHeight: 1.6 }}>
            <div style={{ fontWeight: 'bold', marginBottom: 8 }}>What do you want the computer to do?</div>
            <label style={{ display: 'flex', alignItems: 'center', gap: 6, marginBottom: 4, cursor: 'default' }}>
              <input type="radio" name="shutdown" defaultChecked style={{ margin: 0 }} /> Shut down
            </label>
            <label style={{ display: 'flex', alignItems: 'center', gap: 6, marginBottom: 4, cursor: 'default' }}>
              <input type="radio" name="shutdown" style={{ margin: 0 }} /> Restart
            </label>
            <label style={{ display: 'flex', alignItems: 'center', gap: 6, cursor: 'default' }}>
              <input type="radio" name="shutdown" style={{ margin: 0 }} /> Restart in MS-DOS mode
            </label>
          </div>
        </div>
        <div style={{ display: 'flex', justifyContent: 'flex-end', gap: 6, padding: '4px 12px 12px' }}>
          <button className="w95-btn" style={{ minWidth: 75 }} onClick={() => setPhase('shutting')}>OK</button>
          <button className="w95-btn" style={{ minWidth: 75 }} onClick={onCancel}>Cancel</button>
          <button className="w95-btn" style={{ minWidth: 75 }} onClick={onCancel}>Help</button>
        </div>
      </div>
    </div>
  );
}

function ShutdownProgress({ onDone }: { onDone: () => void }) {
  const [pct, setPct] = useState(0);
  useEffect(() => {
    const t = setInterval(() => {
      setPct(prev => {
        if (prev >= 100) { clearInterval(t); onDone(); return 100; }
        return prev + 4;
      });
    }, 80);
    return () => clearInterval(t);
  }, [onDone]);
  return <div style={{ height: '100%', width: `${pct}%`, background: '#000080' }} />;
}

// ═══════════════════════════════════════════════════════════════
//  BOOT SCREEN
// ═══════════════════════════════════════════════════════════════
function BootScreen({ onDone }: { onDone: () => void }) {
  const [phase, setPhase] = useState(0);
  const [memCount, setMemCount] = useState(0);
  const [bootProgress, setBootProgress] = useState(0);

  // We use an empty dependency array here just like the original BootScreen
  // so that if the parent re-renders (e.g. clock update), it doesn't clear our timeouts.
  useEffect(() => {
    // BIOS Sequence Phase 0: Initial text
    const t1 = setTimeout(() => setPhase(1), 600);

    // Phase 1: Memory counting
    let memInterval: number | undefined;
    const t2 = setTimeout(() => {
      setPhase(2);
      memInterval = window.setInterval(() => {
        setMemCount((prev) => {
          if (prev >= 65536) {
            clearInterval(memInterval!);
            return 65536;
          }
          return prev + 4096;
        });
      }, 20);
    }, 1200);

    // Phase 3: Hardware detection
    const t3 = setTimeout(() => setPhase(3), 2800);

    // Phase 4: PCI Listing
    const t4 = setTimeout(() => setPhase(4), 4000);

    // Phase 5: Starting Windows 95...
    const t5 = setTimeout(() => setPhase(5), 5500);

    // Phase 6: The graphical Win95 boot screen
    const t6 = setTimeout(() => setPhase(6), 7000);

    // End boot
    const t7 = setTimeout(() => onDone(), 11000);

    return () => {
      clearTimeout(t1); clearTimeout(t2); clearTimeout(t3);
      clearTimeout(t4); clearTimeout(t5); clearTimeout(t6); clearTimeout(t7);
      if (memInterval) clearInterval(memInterval);
    };
  }, []); // <--- Fix: Empty dependency array

  // Loading bar for Win95 screen
  useEffect(() => {
    if (phase !== 6) return;
    const interval = setInterval(() => {
      setBootProgress(p => (p >= 100 ? -20 : p + 5));
    }, 50);
    return () => clearInterval(interval);
  }, [phase]);

  if (phase < 6) {
    return (
      <div style={{ position: 'fixed', inset: 0, background: '#000', zIndex: 99999999, padding: '40px 60px', fontFamily: 'monospace', color: '#c0c0c0', fontSize: 18 }}>
        {/* Fake Energy Star Logo */}
        <div style={{ position: 'absolute', top: 40, right: 60, border: '2px solid #c0c0c0', padding: '6px 16px', textAlign: 'center', fontSize: 16 }}>
          <div style={{ fontStyle: 'italic', fontWeight: 'bold' }}>EPA</div>
          <div>POLLUTION PREVENTER</div>
        </div>

        <div>Award Modular BIOS v4.51PG, An Energy Star Ally</div>
        <div style={{ marginBottom: 24 }}>Copyright (C) 1984-95, Award Software, Inc.</div>

        {phase >= 1 && (
          <div style={{ marginBottom: 24 }}>
            <div>PENTIUM-S CPU at 133MHz</div>
            <div>Memory Test :  {phase >= 2 ? memCount : 0}K OK</div>
          </div>
        )}

        {phase >= 3 && (
          <div style={{ marginBottom: 24 }}>
            <div>Award Plug and Play BIOS Extension v1.0A</div>
            <div>Initialize Plug and Play Cards...</div>
            <div>PNP Init Completed</div>
          </div>
        )}

        {phase >= 4 && (
          <div style={{ marginBottom: 24 }}>
            <div>Detecting IDE Primary Master   ... WDC AC21200H</div>
            <div>Detecting IDE Primary Slave    ... None</div>
            <div>Detecting IDE Secondary Master ... ATAPI CDROM</div>
            <div>Detecting IDE Secondary Slave  ... None</div>
          </div>
        )}

        {phase >= 5 && (
          <div style={{ marginTop: 40, border: '1px solid #c0c0c0', display: 'inline-block', padding: '2px 8px' }}>
            Starting adamOS...
          </div>
        )}
      </div>
    );
  }

  // Windows 95 Graphical Boot Screen
  return (
    <div style={{ position: 'fixed', inset: 0, background: '#000', zIndex: 99999999, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center' }}>
      <div style={{ textAlign: 'center', marginBottom: 80, display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
        <img
          src="/windows95.png"
          alt="Windows 95 Logo"
          style={{ width: 350, height: 'auto', marginBottom: 20 }}
          onError={(e) => {
            e.currentTarget.style.display = 'none';
            const fallback = document.getElementById('win-logo-fallback');
            if (fallback) fallback.style.display = 'block';
          }}
        />
        <div id="win-logo-fallback" style={{ display: 'none' }}>
          <WinFlag size={100} />
        </div>
        <div style={{ color: '#fff', fontSize: 32, fontWeight: 'bold', fontFamily: '"W95FA", sans-serif', marginTop: 16, letterSpacing: 2 }}>
          adamOS
        </div>
      </div>

      {/* Classic scrolling loading bar */}
      <div className="w95-inset" style={{ width: 300, height: 20, background: '#c0c0c0', position: 'relative', overflow: 'hidden', padding: 2 }}>
        <div style={{
          height: '100%',
          width: 50,
          background: 'linear-gradient(90deg, #000080, #0000ff 50%, #000080)',
          position: 'absolute',
          left: `${bootProgress}%`,
        }} />
      </div>
    </div>
  );
}

// ═══════════════════════════════════════════════════════════════
//  ABOUT ME CONTENT
// ═══════════════════════════════════════════════════════════════
function AboutContent() {
  const [selected, setSelected] = useState('about');
  const [expandedNodes, setExpandedNodes] = useState<Set<string>>(new Set(['desktop', 'computer', 'c']));

  const toggleNode = (id: string) => {
    setExpandedNodes(prev => {
      const next = new Set(prev);
      next.has(id) ? next.delete(id) : next.add(id);
      return next;
    });
  };

  type TreeNode = { id: string; label: string; icon: React.ReactNode; children?: TreeNode[] };
  const tree: TreeNode[] = [{
    id: 'desktop', label: 'Desktop', icon: <IconComputer size={20} />,
    children: [{
      id: 'computer', label: 'My Computer', icon: <IconComputer size={20} />,
      children: [
        {
          id: 'c', label: '(C:)', icon: <IconFolder size={20} />, children: [
            { id: 'about', label: 'about_me.txt', icon: <IconNotepad size={20} /> },
            { id: 'bio', label: 'biography.txt', icon: <IconNotepad size={20} /> },
            { id: 'hobbies', label: 'hobbies.txt', icon: <IconNotepad size={20} /> },
          ]
        },
        { id: 'panel', label: 'Control Panel', icon: <IconSettings size={20} /> },
      ]
    }]
  }];

  const renderTree = (nodes: TreeNode[], depth: number) => (
    <>
      {nodes.map(node => {
        const hasChildren = node.children && node.children.length > 0;
        const expanded = expandedNodes.has(node.id);
        return (
          <React.Fragment key={node.id}>
            <div
              onClick={() => { setSelected(node.id); if (hasChildren) toggleNode(node.id); }}
              style={{
                paddingLeft: 6 + depth * 20, display: 'flex', alignItems: 'center', gap: 6,
                padding: '2px 4px 2px ' + (6 + depth * 20) + 'px', cursor: 'default', fontSize: 14,
                background: selected === node.id ? '#000080' : 'transparent',
                color: selected === node.id ? '#fff' : '#000',
              }}
            >
              {hasChildren && <span style={{ width: 14, fontSize: 12, textAlign: 'center', flexShrink: 0 }}>{expanded ? '▼' : '▶'}</span>}
              {!hasChildren && <span style={{ width: 14, flexShrink: 0 }} />}
              <span style={{ flexShrink: 0 }}>{node.icon}</span>
              <span>{node.label}</span>
            </div>
            {hasChildren && expanded && renderTree(node.children!, depth + 1)}
          </React.Fragment>
        );
      })}
    </>
  );

  const contentMap: Record<string, React.ReactNode> = {
    about: (
      <>
        <div style={{ display: 'flex', gap: 10, marginBottom: 10 }}>
          <div style={{ width: 72, height: 72, background: '#c0c0c0', border: '2px solid #808080', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
            <IconUser size={48} />
          </div>
          <div>
            <div style={{ fontSize: 20, fontWeight: 'bold' }}>Adam</div>
            <div style={{ fontSize: 14, color: '#808080' }}>Full Stack Developer (trying to be one)</div>
            <div style={{ fontSize: 14, color: '#808080' }}>Nijmegen, NL</div>
          </div>
        </div>
        <HR />
        <p style={{ margin: '8px 0', fontSize: 14 }}>Welcome to my personal homepage on the World Wide Web!</p>
        <p style={{ margin: '8px 0', fontSize: 14 }}>I am a passionate developer who builds real projects — from production web apps used by actual businesses, to AI-powered desktop tools and interactive maps. I love going beyond what school teaches and building things that actually work.</p>
        <p style={{ margin: '8px 0', fontSize: 14 }}>Feel free to explore my directories. If you want to chat, send me an electronic mail via the Contact shortcut on the desktop.</p>
        <HR />
        <table style={{ fontSize: 14, borderCollapse: 'collapse', marginTop: 6 }}>
          <tbody>
            <tr><td style={{ padding: '4px 12px 4px 0', fontWeight: 'bold' }}><div style={{ display: 'flex', alignItems: 'center', gap: 6 }}><IconGlobe size={20} /> Location:</div></td><td>Rotterdam, Netherlands</td></tr>
            <tr><td style={{ padding: '4px 12px 4px 0', fontWeight: 'bold' }}><div style={{ display: 'flex', alignItems: 'center', gap: 6 }}><IconGithub size={20} /> GitHub:</div></td><td><a href="https://github.com/aznixx" target="_blank" rel="noreferrer" style={{ color: '#0000ff' }}>github.com/aznixx</a></td></tr>
            <tr><td style={{ padding: '4px 12px 4px 0', fontWeight: 'bold' }}><div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>Status:</div></td><td>Building Jarvis AI</td></tr>
            <tr><td style={{ padding: '4px 12px 4px 0', fontWeight: 'bold' }}><div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>Visitors:</div></td><td>13,370</td></tr>
          </tbody>
        </table>
      </>
    ),
    bio: (
      <>
        <div style={{ fontSize: 16, fontWeight: 'bold', marginBottom: 6 }}>Biography</div>
        <HR />
        <p style={{ fontSize: 14, margin: '8px 0' }}>Hey, I'm Adam. I'm a developer based out of Nijmegen who just genuinely loves building things. I started getting into coding outside of my classes, and eventually built my first major full-stack app while still in school (which somehow, a real company is actually using today).</p>
        <p style={{ fontSize: 14, margin: '8px 0' }}>I like working on projects that have real users and real data. Over the past couple of years, I've hacked together everything from interactive geo-maps for a nature park to custom AI vision models that can detect what's happening on my screen in real-time.</p>
        <p style={{ fontSize: 14, margin: '8px 0' }}>Right now, my main obsession is Jarvis. I'm basically trying to use Python to build my own version of Iron Man's assistant—complete with voice integration and autonomous PC control. It's a massive challenge, but it's super fun.</p>
      </>
    ),
    hobbies: (
      <>
        <div style={{ fontSize: 16, fontWeight: 'bold', marginBottom: 6 }}>Hobbies & Interests</div>
        <HR />
        <ul style={{ fontSize: 14, paddingLeft: 20, margin: '8px 0' }}>
          <li>Building side projects that go beyond tutorials</li>
          <li>Reverse engineering games and applying the techniques</li>
          <li>Training custom AI/ML models (Roboflow, Python)</li>
          <li>Exploring new frameworks and low-level concepts</li>
          <li>Gaming — and understanding how games work under the hood</li>
        </ul>
      </>
    ),
  };

  return (
    <div style={{ display: 'flex', height: '100%' }}>
      <div className="w95-inset w95-scroll" style={{ width: 220, overflow: 'auto', background: '#fff', flexShrink: 0, padding: 2 }}>
        {renderTree(tree, 0)}
      </div>
      <div style={{ flex: 1, padding: 12, overflow: 'auto', fontSize: 14 }}>
        {contentMap[selected] || <div style={{ color: '#808080' }}>Select an item from the tree.</div>}
      </div>
    </div>
  );
}

// ═══════════════════════════════════════════════════════════════
//  PROJECTS CONTENT
// ═══════════════════════════════════════════════════════════════
function ProjectsContent({ showDialog }: { showDialog: (d: DialogState) => void }) {
  const [active, setActive] = useState<number | null>(null);
  const [view, setView] = useState<'icons' | 'list'>('icons');

  const projects = [
    {
      name: 'De Witte Raaf',
      icon: <IconBeer size={48} />,
      desc: 'A full-stack web application currently in active production use by a real hospitality business. Features a substantial backend with business logic, database management, reservations, and a live deployment.',
      tech: ['Node.js', 'React', 'PostgreSQL', 'Vite'],
      link: 'https://github.com/aznixx/dewitteraaf',
      status: 'Live (Production)',
      size: '~2.4 MB',
      type: 'Full-Stack Web App',
    },
    {
      name: 'Park Lingezegen',
      icon: <IconMap size={48} />,
      desc: 'Interactive web map for a Dutch nature park built with Vite and MapLibre GL. Includes a full Supabase (PostgreSQL) backend with real-time zone sync, staff/visitor authentication, CRUD operations for tree zones, spatial calculations using Turf.js and GeoJSON, and an offline localStorage fallback.',
      tech: ['Vite', 'MapLibre GL', 'Supabase', 'PostgreSQL', 'Turf.js', 'GeoJSON'],
      link: 'https://github.com/aznixx/parklingezegen',
      status: 'Live',
      size: '~1.8 MB',
      type: 'Full-Stack Web App',
    },
    {
      name: 'AI Screen Detector',
      icon: <IconRobot size={48} />,
      desc: 'Python desktop utility that monitors VS Code in real time, detects AI-generated code snippets on screen using a custom-trained Roboflow object detection model, and displays a live confidence-based overlay. Uses screen capture, OpenCV, threading, and persists detection stats across sessions via JSON.',
      tech: ['Python', 'OpenCV', 'Roboflow SDK', 'customtkinter', 'mss', 'NumPy'],
      link: 'https://github.com/aznixx/ai-tracking',
      status: 'Live',
      size: '~340 KB',
      type: 'Desktop / AI / ML',
    },
    {
      name: 'Jarvis',
      icon: <IconChip size={48} />,
      desc: 'An AI assistant currently in active development that can autonomously perform tasks using voice integration, screen awareness, and AI decision-making. Inspired by Iron Man\'s Jarvis. Still evolving — this is the big one.',
      tech: ['Python', 'AI', 'Voice Integration', 'LLM'],
      link: null,
      status: 'In Development',
      size: 'WIP',
      type: 'AI Agent',
    },
    {
      name: 'Buitenlandse Spoorwegen',
      icon: <IconTrain size={48} />,
      desc: 'A JavaFX desktop application about foreign railways. Demonstrates object-oriented Java development, desktop UI design, and working with structured data sets.',
      tech: ['Java', 'JavaFX'],
      link: 'https://github.com/aznixx/buitenlandsespoorwegen',
      status: 'Live',
      size: '~890 KB',
      type: 'Desktop App',
    },
    {
      name: 'Quotial',
      icon: <IconChat size={48} />,
      desc: 'A frontend web project deployed on Vercel with a clean, modern UI. Built to demonstrate frontend skills and deployment workflow.',
      tech: ['HTML', 'CSS', 'JavaScript', 'Vercel'],
      link: 'https://quotial.vercel.app',
      status: 'Live',
      size: '~210 KB',
      type: 'Frontend',
    },
  ];

  if (active !== null) {
    const p = projects[active];
    return (
      <div style={{ padding: 8, background: '#c0c0c0', height: '100%', display: 'flex', flexDirection: 'column' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 4, marginBottom: 6 }}>
          <button className="w95-btn" style={{ fontSize: 11 }} onClick={() => setActive(null)}>Back</button>
          <span style={{ fontWeight: 'bold', fontSize: 11 }}>{p.name} — Properties</span>
        </div>
        <div className="w95-inset" style={{ flex: 1, background: '#fff', padding: 10, overflow: 'auto' }}>
          {/* Project header banner */}
          <div style={{ width: '100%', height: 80, background: '#000080', border: '2px solid #808080', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: 10, gap: 12 }}>
            <span style={{ display: 'flex', background: '#fff', padding: 4, border: '2px solid #c0c0c0' }}>{React.cloneElement(p.icon as any, { size: 48 })}</span>
            <div>
              <div style={{ color: '#fff', fontWeight: 'bold', fontSize: 14 }}>{p.name}</div>
              <div style={{ color: '#c0c0c0', fontSize: 10 }}>{p.type}</div>
            </div>
          </div>

          <table style={{ fontSize: 11, borderCollapse: 'collapse', width: '100%', marginBottom: 8 }}>
            <tbody>
              <tr><td style={{ padding: '2px 8px 2px 0', fontWeight: 'bold', width: 80, verticalAlign: 'top' }}>Name:</td><td>{p.name}</td></tr>
              <tr><td style={{ padding: '2px 8px 2px 0', fontWeight: 'bold', verticalAlign: 'top' }}>Type:</td><td>{p.type}</td></tr>
              <tr><td style={{ padding: '2px 8px 2px 0', fontWeight: 'bold', verticalAlign: 'top' }}>Status:</td><td>{p.status}</td></tr>
              <tr><td style={{ padding: '2px 8px 2px 0', fontWeight: 'bold', verticalAlign: 'top' }}>Size:</td><td>{p.size}</td></tr>
              <tr>
                <td style={{ padding: '2px 8px 2px 0', fontWeight: 'bold', verticalAlign: 'top' }}>Tech:</td>
                <td>
                  <div style={{ display: 'flex', flexWrap: 'wrap', gap: 3 }}>
                    {p.tech.map(t => (
                      <span key={t} style={{ background: '#000080', color: '#fff', fontSize: 10, padding: '1px 5px', border: '1px solid #808080' }}>{t}</span>
                    ))}
                  </div>
                </td>
              </tr>
            </tbody>
          </table>

          <HR />
          <p style={{ fontSize: 11, margin: '6px 0', lineHeight: 1.5 }}>{p.desc}</p>
          <HR />

          <div style={{ display: 'flex', gap: 4, marginTop: 8 }}>
            {p.link ? (
              <a
                href={p.link}
                target="_blank"
                rel="noreferrer"
                style={{ flex: 1, textDecoration: 'none' }}
              >
                <button className="w95-btn" style={{ width: '100%', fontSize: 11, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 6 }}>
                  <IconGithub size={14} /> View on GitHub
                </button>
              </a>
            ) : (
              <button className="w95-btn" style={{ flex: 1, fontSize: 11 }} onClick={() => showDialog({ title: 'Jarvis', message: 'Jarvis is still being assembled...\n\nLink will appear when he\'s ready.\n\nStay tuned.', icon: 'info', buttons: [{ label: 'Got it', onClick: () => { } }] })}>
                In Development
              </button>
            )}
            {p.link && p.link.startsWith('https://') && !p.link.includes('github') && (
              <a href={p.link} target="_blank" rel="noreferrer" style={{ flex: 1, textDecoration: 'none' }}>
                <button className="w95-btn" style={{ width: '100%', fontSize: 11, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 6 }}>
                  <IconGlobe size={14} /> Live Demo
                </button>
              </a>
            )}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div style={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
      {/* Toolbar */}
      <div style={{ background: '#c0c0c0', padding: '2px 4px', display: 'flex', gap: 4, borderBottom: '1px solid #808080', flexShrink: 0 }}>
        <button className="w95-btn" style={{ fontSize: 10, padding: '1px 4px' }} onClick={() => setView('icons')}>Icons</button>
        <button className="w95-btn" style={{ fontSize: 10, padding: '1px 4px' }} onClick={() => setView('list')}>List</button>
        <span style={{ fontSize: 10, color: '#808080', marginLeft: 8, alignSelf: 'center' }}>Double-click a project to open</span>
      </div>

      {view === 'icons' ? (
        <div style={{ padding: 10, display: 'flex', flexWrap: 'wrap', gap: 6, alignContent: 'flex-start', flex: 1, overflow: 'auto' }}>
          {projects.map((p, i) => (
            <div
              key={i}
              onDoubleClick={() => setActive(i)}
              style={{ width: 90, display: 'flex', flexDirection: 'column', alignItems: 'center', padding: 4, cursor: 'default', textAlign: 'center' }}
              onMouseEnter={e => { (e.currentTarget).style.outline = '1px dotted #000'; }}
              onMouseLeave={e => { (e.currentTarget).style.outline = 'none'; }}
            >
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', height: 32 }}>{p.icon}</div>
              <span style={{ fontSize: 11, marginTop: 3, wordBreak: 'break-word', lineHeight: 1.2 }}>{p.name}</span>
                <span style={{ fontSize: 9, color: '#808080', marginTop: 1 }}>{p.status}</span>
            </div>
          ))}
        </div>
      ) : (
        <div style={{ flex: 1, overflow: 'auto', fontSize: 11 }}>
          <table style={{ width: '100%', borderCollapse: 'collapse' }}>
            <thead>
              <tr style={{ background: '#c0c0c0' }}>
                <th className="w95-outset" style={{ textAlign: 'left', padding: '2px 6px', fontWeight: 'bold' }}>Name</th>
                <th className="w95-outset" style={{ textAlign: 'left', padding: '2px 6px', fontWeight: 'bold' }}>Type</th>
                <th className="w95-outset" style={{ textAlign: 'left', padding: '2px 6px', fontWeight: 'bold' }}>Size</th>
                <th className="w95-outset" style={{ textAlign: 'left', padding: '2px 6px', fontWeight: 'bold' }}>Status</th>
              </tr>
            </thead>
            <tbody>
              {projects.map((p, i) => (
                <tr key={i} onDoubleClick={() => setActive(i)} style={{ cursor: 'default' }}
                  onMouseEnter={e => { (e.currentTarget).style.background = '#000080'; (e.currentTarget).style.color = '#fff'; }}
                  onMouseLeave={e => { (e.currentTarget).style.background = ''; (e.currentTarget).style.color = ''; }}
                >
                  <td style={{ padding: '2px 6px' }}>{p.icon} {p.name}</td>
                  <td style={{ padding: '2px 6px' }}>{p.type}</td>
                  <td style={{ padding: '2px 6px' }}>{p.size}</td>
                  <td style={{ padding: '2px 6px' }}>{p.status}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}

// ═══════════════════════════════════════════════════════════════
//  SKILLS NOTEPAD (fully editable!)
// ═══════════════════════════════════════════════════════════════
function SkillsContent() {
  const [wordWrap, setWordWrap] = useState(true);
  const [text, setText] = useState(`SKILLS.TXT - Notepad
═══════════════════════════════════════

  ┌─────────────────────────────────┐
  │     SKILLS & TECHNOLOGIES       │
  └─────────────────────────────────┘

  > LANGUAGES
    ├─ JavaScript / TypeScript
    ├─ HTML5 / CSS3
    ├─ Python
    ├─ Java
    └─ C / C++

  > FRAMEWORKS & LIBRARIES
    ├─ React.js / Next.js
    ├─ Node.js / Express
    ├─ Vite
    ├─ MapLibre GL / Turf.js
    └─ Tailwind CSS

  > TOOLS & PLATFORMS
    ├─ Git / GitHub
    ├─ Supabase (PostgreSQL + Realtime)
    ├─ Vercel / Netlify
    ├─ Roboflow (ML/AI model training)
    └─ Bash / PowerShell

  > AI / ML
    ├─ Custom object detection (Roboflow)
    ├─ OpenCV / mss (screen capture)
    ├─ LLM integration (in Jarvis)
    └─ Voice recognition / TTS

  > INTERESTS
    ├─ Full-stack web development
    ├─ AI agents & automation
    ├─ Reverse engineering
    ├─ Spatial data & mapping
    └─ Building things that actually work

═══════════════════════════════════════
Last updated: 2026
[EOF]`);

  return (
    <div style={{ display: 'flex', flexDirection: 'column', height: '100%' }}>
      <textarea
        value={text}
        onChange={e => setText(e.target.value)}
        style={{
          flex: 1, resize: 'none', border: 'none', outline: 'none', padding: 4,
          fontFamily: '"Courier New", Courier, monospace', fontSize: 12, lineHeight: 1.4,
          background: '#fff', color: '#000', whiteSpace: wordWrap ? 'pre-wrap' : 'pre',
          overflowWrap: wordWrap ? 'break-word' : undefined,
        }}
      />
      <div style={{ background: '#c0c0c0', padding: '1px 4px', fontSize: 10, borderTop: '1px solid #808080', display: 'flex', justifyContent: 'space-between' }}>
        <span>Ln 1, Col 1</span>
        <label style={{ display: 'flex', alignItems: 'center', gap: 4, cursor: 'default', fontSize: 10 }}>
          <input type="checkbox" checked={wordWrap} onChange={e => setWordWrap(e.target.checked)} style={{ margin: 0 }} />
          Word Wrap
        </label>
      </div>
    </div>
  );
}

// ═══════════════════════════════════════════════════════════════
//  CONTACT (Email Client Style)
// ═══════════════════════════════════════════════════════════════
function ContactContent({ showDialog }: { showDialog: (d: DialogState) => void }) {
  const [sent, setSent] = useState(false);
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [subject, setSubject] = useState('');
  const [message, setMessage] = useState('');

  const handleSend = () => {
    if (!name.trim() || !message.trim()) {
      showDialog({ title: 'Error', message: 'Please fill in at least your Name and Message fields.\n\nThis form requires a valid name to continue.', icon: 'error', buttons: [{ label: 'OK', onClick: () => { } }] });
      return;
    }
    setSent(true);
  };

  if (sent) {
    return (
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', height: '100%', background: '#c0c0c0' }}>
        <div className="w95-outset" style={{ background: '#c0c0c0', padding: 2, maxWidth: 300, width: '100%' }}>
          <div className="w95-titlebar-active" style={{ height: 18, padding: '0 4px', display: 'flex', alignItems: 'center', marginBottom: 2 }}>
            <span style={{ fontSize: 11, fontWeight: 'bold', color: '#fff' }}>Message Sent</span>
          </div>
          <div style={{ padding: 16, display: 'flex', gap: 12, alignItems: 'center' }}>
            <IconInfo size={48} />
            <div style={{ fontSize: 11 }}>
              <div style={{ fontWeight: 'bold', marginBottom: 4 }}>Message sent successfully!</div>
              <div style={{ color: '#808080' }}>Your electronic mail is on its way through cyberspace. Estimated delivery: 3-5 business days.</div>
            </div>
          </div>
          <div style={{ textAlign: 'center', padding: '4px 16px 12px' }}>
            <button className="w95-btn" style={{ width: 80 }} onClick={() => { setSent(false); setName(''); setEmail(''); setSubject(''); setMessage(''); }}>OK</button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div style={{ padding: 8, display: 'flex', flexDirection: 'column', gap: 4, height: '100%', background: '#c0c0c0' }}>
      {/* Toolbar */}
      <div style={{ display: 'flex', gap: 4, marginBottom: 2 }}>
        <button className="w95-btn" style={{ fontSize: 11 }} onClick={handleSend}>📨 Send</button>
        <button className="w95-btn" style={{ fontSize: 11 }} onClick={() => showDialog({ title: 'Attach File', message: 'Please insert the floppy disk containing the file you wish to attach.\n\nDrive A: is not ready.', icon: 'warning', buttons: [{ label: 'Retry', onClick: () => { } }, { label: 'Cancel', onClick: () => { } }] })}>📎 Attach</button>
        <button className="w95-btn" style={{ fontSize: 11 }} onClick={() => showDialog({ title: 'Address Book', message: 'Address Book is empty.\n\nYou have no friends in your contact list.', icon: 'info', buttons: [{ label: '😢 OK', onClick: () => { } }] })}>📒 Address Book</button>
      </div>
      <HR />
      <div style={{ display: 'flex', gap: 4, alignItems: 'center' }}>
        <span style={{ fontSize: 11, fontWeight: 'bold', width: 50 }}>To:</span>
        <input className="w95-input" style={{ flex: 1 }} defaultValue="adam@aznixx.dev" readOnly />
      </div>
      <div style={{ display: 'flex', gap: 4, alignItems: 'center' }}>
        <span style={{ fontSize: 11, fontWeight: 'bold', width: 50 }}>From:</span>
        <input className="w95-input" style={{ flex: 1 }} placeholder="your_email@aol.com" value={email} onChange={e => setEmail(e.target.value)} />
      </div>
      <div style={{ display: 'flex', gap: 4, alignItems: 'center' }}>
        <span style={{ fontSize: 11, fontWeight: 'bold', width: 50 }}>Name:</span>
        <input className="w95-input" style={{ flex: 1 }} placeholder="Your Name" value={name} onChange={e => setName(e.target.value)} />
      </div>
      <div style={{ display: 'flex', gap: 4, alignItems: 'center' }}>
        <span style={{ fontSize: 11, fontWeight: 'bold', width: 50 }}>Subject:</span>
        <input className="w95-input" style={{ flex: 1 }} placeholder="RE: Your Portfolio" value={subject} onChange={e => setSubject(e.target.value)} />
      </div>
      <HR />
      <textarea className="w95-input w95-scroll" style={{ flex: 1, resize: 'none', fontFamily: 'inherit' }} placeholder="Type your message here..." value={message} onChange={e => setMessage(e.target.value)} />
    </div>
  );
}

// ═══════════════════════════════════════════════════════════════
//  RESUME (WordPad Style)
// ═══════════════════════════════════════════════════════════════
function ResumeContent({ showDialog }: { showDialog: (d: DialogState) => void }) {
  const [font, setFont] = useState('Times New Roman');
  const [fontSize, setFontSize] = useState('12');

  return (
    <div style={{ display: 'flex', flexDirection: 'column', height: '100%', background: '#c0c0c0' }}>
      {/* Toolbar */}
      <div style={{ display: 'flex', alignItems: 'center', gap: 2, padding: '2px 4px', borderBottom: '1px solid #808080', flexShrink: 0 }}>
        <select className="w95-select" style={{ width: 110 }} value={font} onChange={e => setFont(e.target.value)}>
          <option>Times New Roman</option>
          <option>Arial</option>
          <option>Courier New</option>
          <option>Comic Sans MS</option>
        </select>
        <select className="w95-select" style={{ width: 40 }} value={fontSize} onChange={e => setFontSize(e.target.value)}>
          {['8', '10', '12', '14', '16', '18', '24', '36'].map(s => <option key={s}>{s}</option>)}
        </select>
        <div style={{ width: 1, height: 16, background: '#808080', margin: '0 2px' }} />
        <button className="w95-btn" style={{ width: 22, height: 20, padding: 0, fontWeight: 'bold' }}>B</button>
        <button className="w95-btn" style={{ width: 22, height: 20, padding: 0, fontStyle: 'italic' }}>I</button>
        <button className="w95-btn" style={{ width: 22, height: 20, padding: 0, textDecoration: 'underline' }}>U</button>
        <div style={{ width: 1, height: 16, background: '#808080', margin: '0 2px' }} />
        <button className="w95-btn" style={{ fontSize: 10, padding: '1px 4px', height: 20 }} onClick={() => showDialog({ title: 'Print', message: 'Sending document to:\n  HP LaserJet 4 on LPT1:\n\nPrinting page 1 of 1...\n\n⚠️ PC LOAD LETTER', icon: 'warning', buttons: [{ label: 'OK', onClick: () => { } }] })}>🖨 Print</button>
        <button className="w95-btn" style={{ fontSize: 10, padding: '1px 4px', height: 20 }} onClick={() => showDialog({ title: 'Save As', message: 'Document saved to:\nA:\\My Documents\\Resume.doc\n\n💾 Save complete.', icon: 'info', buttons: [{ label: 'OK', onClick: () => { } }] })}>💾 Save</button>
      </div>
      {/* Ruler */}
      <div style={{ background: '#fff', borderBottom: '1px solid #808080', padding: '1px 32px', fontSize: 9, color: '#808080', display: 'flex', justifyContent: 'space-between', flexShrink: 0 }}>
        {[0, 1, 2, 3, 4, 5, 6, 7].map(n => <span key={n}>|{n}"</span>)}
      </div>
      {/* Document area */}
      <div className="w95-scroll" style={{ flex: 1, background: '#808080', padding: 16, overflow: 'auto', display: 'flex', justifyContent: 'center' }}>
        <div style={{ background: '#fff', width: '90%', minHeight: '140%', padding: 32, boxShadow: '3px 3px 0 #000', fontFamily: `"${font}", serif`, fontSize: parseInt(fontSize), color: '#000' }}>
          <div style={{ textAlign: 'center', fontSize: parseInt(fontSize) + 8, fontWeight: 'bold', marginBottom: 2 }}>ADAM</div>
          <div style={{ textAlign: 'center', fontSize: parseInt(fontSize) - 2, marginBottom: 8 }}>github.com/aznixx • Rotterdam, Netherlands</div>
          <div style={{ borderTop: '2px solid #000', marginBottom: 10 }} />

          <Section title="OBJECTIVE" fontSize={parseInt(fontSize)}>
            <p>Full-stack developer focused on building real, working software. I go beyond school assignments — my projects are used by real businesses, trained on real data, and deployed to real users.</p>
          </Section>

          <Section title="PROJECTS" fontSize={parseInt(fontSize)}>
            <JobEntry title="De Witte Raaf — Full-Stack Web App" company="Production • Used by real business" date="2026–Present" items={[
              'Full-stack application actively used by a hospitality company',
              'Custom backend with business logic, database management, live deployment',
              'Tech: Node.js, React, PostgreSQL, Vite',
            ]} />
            <JobEntry title="Park Lingezegen — Interactive Map" company="Full-Stack • Real-time Backend" date="2025" items={[
              'Interactive GeoJSON map for a Dutch nature park with MapLibre GL',
              'Supabase (PostgreSQL) backend, real-time sync, CRUD, staff auth',
              'Spatial calculations with Turf.js, offline localStorage fallback',
            ]} />
            <JobEntry title="AI Screen Detector" company="Python • Computer Vision • ML" date="2025" items={[
              'Custom-trained Roboflow object detection model',
              'Monitors VS Code in real time via screen capture (mss + OpenCV)',
              'Live confidence overlay, persistent session stats via JSON',
            ]} />
            <JobEntry title="Jarvis — AI Agent" company="In Development" date="2026–Present" items={[
              'Voice-integrated AI assistant with autonomous task execution',
              'Screen awareness, LLM decision-making, Python backend',
            ]} />
          </Section>

          <Section title="SKILLS" fontSize={parseInt(fontSize)}>
            <p>JavaScript / TypeScript · Python · Java · React · Node.js · Vite · Supabase · PostgreSQL · MapLibre GL · OpenCV · Roboflow · Git · Vercel</p>
          </Section>

          <Section title="REFERENCES" fontSize={parseInt(fontSize)}>
            <p style={{ fontStyle: 'italic' }}>Available upon request.</p>
          </Section>
        </div>
      </div>
    </div>
  );
}

function Section({ title, children, fontSize }: { title: string; children: React.ReactNode; fontSize: number }) {
  return (
    <div style={{ marginBottom: 10 }}>
      <div style={{ fontWeight: 'bold', fontSize: fontSize + 1, textTransform: 'uppercase', marginBottom: 4, borderBottom: '1px solid #808080' }}>{title}</div>
      <div style={{ marginLeft: 8 }}>{children}</div>
    </div>
  );
}

function JobEntry({ title, company, date, items }: { title: string; company: string; date: string; items: string[] }) {
  return (
    <div style={{ marginBottom: 8 }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', fontWeight: 'bold' }}><span>{title}</span><span>{date}</span></div>
      <div style={{ fontStyle: 'italic', fontSize: '0.9em', marginBottom: 2 }}>{company}</div>
      <ul style={{ margin: 0, paddingLeft: 16, fontSize: '0.95em' }}>{items.map((item, i) => <li key={i}>{item}</li>)}</ul>
    </div>
  );
}

// ═══════════════════════════════════════════════════════════════
//  INTERNET EXPLORER
// ═══════════════════════════════════════════════════════════════
function IEContent({ showDialog }: { showDialog: (d: DialogState) => void }) {
  const [url, setUrl] = useState('http://www.aznixx-portfolio.com/');
  const [loading, setLoading] = useState(false);

  const handleNavigate = (newUrl: string) => {
    setLoading(true);
    setUrl(newUrl);
    setTimeout(() => { setLoading(false); }, 800 + Math.random() * 1200);
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', height: '100%', background: '#c0c0c0' }}>
      {/* IE Toolbar */}
      <div style={{ display: 'flex', gap: 2, padding: '2px 4px', borderBottom: '1px solid #808080' }}>
        <button className="w95-btn" style={{ fontSize: 10, padding: '1px 4px', display: 'flex', alignItems: 'center', gap: 4 }} onClick={() => handleNavigate('http://www.aznixx-portfolio.com/')}><IconHome size={12} /> Home</button>
        <button className="w95-btn" style={{ fontSize: 10, padding: '1px 4px', display: 'flex', alignItems: 'center', gap: 4 }} onClick={() => handleNavigate(url)}><IconRefresh size={12} /> Refresh</button>
        <button className="w95-btn" style={{ fontSize: 10, padding: '1px 4px', display: 'flex', alignItems: 'center', gap: 4 }} onClick={() => showDialog({ title: 'Favorites', message: 'Your Favorites:\n\n• github.com/aznixx\n• quotial.vercel.app\n• supabase.io\n• maplibre.org\n• roboflow.com', icon: 'info', buttons: [{ label: 'OK', onClick: () => { } }] })}><IconStar size={12} /> Favorites</button>
      </div>
      {/* Address Bar */}
      <div style={{ display: 'flex', gap: 4, alignItems: 'center', padding: '2px 4px', borderBottom: '1px solid #808080' }}>
        <span style={{ fontSize: 11, fontWeight: 'bold' }}>Address:</span>
        <input className="w95-input" style={{ flex: 1 }} value={url} onChange={e => setUrl(e.target.value)} onKeyDown={e => { if (e.key === 'Enter') handleNavigate(url); }} />
        <button className="w95-btn" style={{ fontSize: 10, padding: '1px 6px' }} onClick={() => handleNavigate(url)}>Go</button>
      </div>
      {/* Content */}
      <div className="w95-scroll" style={{ flex: 1, overflow: 'auto', background: '#fff' }}>
        {loading ? (
          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', height: '100%', gap: 8 }}>
            <IconIE size={48} />
            <div style={{ fontSize: 11, color: '#808080' }}>Connecting to {url}...</div>
            <div style={{ width: 200, height: 12, background: '#c0c0c0', border: '1px solid #808080', padding: 1 }}>
              <div style={{ height: '100%', width: '60%', background: '#000080' }} />
            </div>
            <div style={{ fontSize: 10, color: '#808080' }}>Downloading... (estimated 45 seconds on 56k)</div>
          </div>
        ) : url === 'http://www.aznixx-portfolio.com/' ? (
          <div style={{ padding: 12, fontFamily: '"Times New Roman", serif', fontSize: 14 }}>
            <div style={{ textAlign: 'center', marginBottom: 8 }}>
              <div style={{ fontSize: 8, color: '#808080' }}>[ Best viewed with Netscape Navigator 3.0 at 800x600 ]</div>
            </div>
            <div style={{ textAlign: 'center', borderBottom: '3px solid #000080', paddingBottom: 8, marginBottom: 12 }}>
              <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', gap: 8, fontSize: 28, fontWeight: 'bold', color: '#000080' }}><IconGlobe size={48} /> Welcome to My Homepage! <IconGlobe size={48} /></div>
              <div style={{ background: '#ffff00', color: '#ff0000', fontWeight: 'bold', fontSize: 12, padding: 4, display: 'inline-block', marginTop: 4, border: '2px solid #ff0000' }}>UNDER CONSTRUCTION</div>
            </div>
            <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: 12 }}>
              <tbody>
                <tr>
                  <td style={{ width: 120, verticalAlign: 'top', padding: 4, borderRight: '2px solid #c0c0c0' }}>
                    <div style={{ fontWeight: 'bold', color: '#000080', marginBottom: 4 }}>Navigation</div>
                    {[
                      { l: 'Home', i: <IconHome size={12} />, u: 'http://www.aznixx-portfolio.com/' },
                      { l: 'GitHub', i: <IconGithub size={12} />, u: 'https://github.com/aznixx', blank: true },
                      { l: 'De Witte Raaf', i: <IconFolder size={12} />, u: 'https://dewitteraafbordspellen.nl' },
                      { l: 'Quotial', i: <IconFolder size={12} />, u: 'https://quotial.vercel.app' }
                    ].map((link, i) => (
                      <div key={i} style={{ marginBottom: 2, display: 'flex', alignItems: 'center', gap: 4 }}>
                        {link.i} <a href="#" style={{ color: '#0000ff', fontSize: 11 }} onClick={e => { e.preventDefault(); link.blank ? window.open(link.u, '_blank') : handleNavigate(link.u); }}>{link.l}</a>
                      </div>
                    ))}
                  </td>
                  <td style={{ verticalAlign: 'top', padding: '4px 8px' }}>
                    <p>Welcome to my corner of the World Wide Web! I am a Full Stack Developer from Nijmegen.</p>
                    <p>I build real projects — check out <b>My Projects</b> on the desktop to see what I've been working on.</p>
                    <HR />
                    <div style={{ fontWeight: 'bold', color: '#800000', marginBottom: 4 }}>What's New</div>
                    <ul style={{ fontSize: 11, paddingLeft: 16 }}>
                      <li>Park Lingezegen shipped with real-time Supabase backend!</li>
                      <li>AI Screen Detector v4 model trained and deployed</li>
                      <li>De Witte Raaf still live and running in production</li>
                      <li>Jarvis is coming...</li>
                    </ul>
                    <HR />
                    <div style={{ textAlign: 'center', fontSize: 10, color: '#808080', marginTop: 8 }}>
                      <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', gap: 4 }}><IconGithub size={12} /> <a href="https://github.com/aznixx" target="_blank" rel="noreferrer" style={{ color: '#0000ff' }}>github.com/aznixx</a></div>
                    </div>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        ) : (
          <iframe title="IE Window" src={url.startsWith('http') ? url : `https://${url}`} style={{ border: 'none', width: '100%', height: '100%' }} />
        )}
      </div>
      <div style={{ background: '#c0c0c0', padding: '1px 4px', fontSize: 10, borderTop: '1px solid #808080', color: '#808080' }}>
        {loading ? 'Transferring data from ' + url : 'Done'}
      </div>
    </div>
  );
}

// ═══════════════════════════════════════════════════════════════
//  MINESWEEPER (Fully Playable!)
// ═══════════════════════════════════════════════════════════════
function MinesweeperContent() {
  const ROWS = 9, COLS = 9, MINES = 10;
  type Cell = { mine: boolean; revealed: boolean; flagged: boolean; count: number };

  const initBoard = useCallback((): Cell[][] => {
    const board: Cell[][] = Array.from({ length: ROWS }, () => Array.from({ length: COLS }, () => ({ mine: false, revealed: false, flagged: false, count: 0 })));
    let placed = 0;
    while (placed < MINES) {
      const r = Math.floor(Math.random() * ROWS), c = Math.floor(Math.random() * COLS);
      if (!board[r][c].mine) { board[r][c].mine = true; placed++; }
    }
    for (let r = 0; r < ROWS; r++) for (let c = 0; c < COLS; c++) {
      if (board[r][c].mine) continue;
      let count = 0;
      for (let dr = -1; dr <= 1; dr++) for (let dc = -1; dc <= 1; dc++) {
        const nr = r + dr, nc = c + dc;
        if (nr >= 0 && nr < ROWS && nc >= 0 && nc < COLS && board[nr][nc].mine) count++;
      }
      board[r][c].count = count;
    }
    return board;
  }, []);

  const [board, setBoard] = useState<Cell[][]>(initBoard);
  const [gameOver, setGameOver] = useState(false);
  const [won, setWon] = useState(false);
  const [face, setFace] = useState('🙂');

  const reveal = (r: number, c: number) => {
    if (gameOver || won || board[r][c].revealed || board[r][c].flagged) return;
    const nb = board.map(row => row.map(cell => ({ ...cell })));
    if (nb[r][c].mine) {
      for (let i = 0; i < ROWS; i++) for (let j = 0; j < COLS; j++) if (nb[i][j].mine) nb[i][j].revealed = true;
      setBoard(nb);
      setGameOver(true);
      setFace('😵');
      return;
    }
    const stack: [number, number][] = [[r, c]];
    while (stack.length) {
      const [cr, cc] = stack.pop()!;
      if (cr < 0 || cr >= ROWS || cc < 0 || cc >= COLS || nb[cr][cc].revealed || nb[cr][cc].mine) continue;
      nb[cr][cc].revealed = true;
      if (nb[cr][cc].count === 0) {
        for (let dr = -1; dr <= 1; dr++) for (let dc = -1; dc <= 1; dc++) stack.push([cr + dr, cc + dc]);
      }
    }
    setBoard(nb);
    let unrevealed = 0;
    for (let i = 0; i < ROWS; i++) for (let j = 0; j < COLS; j++) if (!nb[i][j].revealed) unrevealed++;
    if (unrevealed === MINES) { setWon(true); setFace('😎'); }
  };

  const toggleFlag = (e: React.MouseEvent, r: number, c: number) => {
    e.preventDefault();
    if (gameOver || won || board[r][c].revealed) return;
    const nb = board.map(row => row.map(cell => ({ ...cell })));
    nb[r][c].flagged = !nb[r][c].flagged;
    setBoard(nb);
  };

  const reset = () => { setBoard(initBoard()); setGameOver(false); setWon(false); setFace('🙂'); };

  const flagCount = board.flat().filter(c => c.flagged).length;
  const colors: Record<number, string> = { 1: '#0000ff', 2: '#008000', 3: '#ff0000', 4: '#000080', 5: '#800000', 6: '#008080', 7: '#000', 8: '#808080' };

  return (
    <div style={{ background: '#c0c0c0', padding: 6, display: 'flex', flexDirection: 'column', alignItems: 'center', height: '100%' }}>
      <div className="w95-inset" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: 4, marginBottom: 4, width: COLS * 18 + 8 }}>
        <div style={{ background: '#000', color: '#ff0000', fontFamily: 'monospace', fontWeight: 'bold', fontSize: 16, padding: '0 4px', minWidth: 36, textAlign: 'center' }}>
          {String(MINES - flagCount).padStart(3, '0')}
        </div>
        <button className="w95-btn" style={{ width: 26, height: 26, padding: 0, fontSize: 14 }} onClick={reset}>{face}</button>
        <div style={{ background: '#000', color: '#ff0000', fontFamily: 'monospace', fontWeight: 'bold', fontSize: 16, padding: '0 4px', minWidth: 36, textAlign: 'center' }}>
          000
        </div>
      </div>
      <div className="w95-inset" style={{ padding: 2 }}>
        {board.map((row, r) => (
          <div key={r} style={{ display: 'flex' }}>
            {row.map((cell, c) => (
              <div
                key={c}
                onClick={() => reveal(r, c)}
                onContextMenu={e => toggleFlag(e, r, c)}
                onMouseDown={() => { if (!gameOver && !won) setFace('😮'); }}
                onMouseUp={() => { if (!gameOver && !won) setFace('🙂'); }}
                className={cell.revealed ? '' : 'w95-outset'}
                style={{
                  width: 18, height: 18, display: 'flex', alignItems: 'center', justifyContent: 'center',
                  fontSize: 11, fontWeight: 'bold', cursor: 'default', userSelect: 'none',
                  background: cell.revealed ? '#c0c0c0' : undefined,
                  border: cell.revealed ? '1px solid #808080' : undefined,
                  color: cell.mine ? '#000' : colors[cell.count] || '#000',
                }}
              >
                {cell.revealed
                  ? (cell.mine ? '💣' : (cell.count > 0 ? cell.count : ''))
                  : (cell.flagged ? '🚩' : '')}
              </div>
            ))}
          </div>
        ))}
      </div>
      {(gameOver || won) && (
        <div style={{ marginTop: 4, fontSize: 11, fontWeight: 'bold', color: won ? '#008000' : '#ff0000' }}>
          {won ? '🎉 You Win! IDDQD unlocked!' : '💥 BOOM! Game Over!'}
        </div>
      )}
    </div>
  );
}

// ═══════════════════════════════════════════════════════════════
//  MS PAINT (Draw on canvas!)
// ═══════════════════════════════════════════════════════════════
function PaintContent() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [color, setColor] = useState('#000000');
  const [brushSize, setBrushSize] = useState(3);
  const drawing = useRef(false);
  const lastPos = useRef({ x: 0, y: 0 });
  const colors = ['#000000', '#808080', '#800000', '#808000', '#008000', '#008080', '#000080', '#800080',
    '#ffffff', '#c0c0c0', '#ff0000', '#ffff00', '#00ff00', '#00ffff', '#0000ff', '#ff00ff'];

  const getPos = (e: React.MouseEvent) => {
    const rect = canvasRef.current!.getBoundingClientRect();
    return { x: e.clientX - rect.left, y: e.clientY - rect.top };
  };

  const draw = (e: React.MouseEvent) => {
    if (!drawing.current || !canvasRef.current) return;
    const ctx = canvasRef.current.getContext('2d')!;
    const pos = getPos(e);
    ctx.strokeStyle = color;
    ctx.lineWidth = brushSize;
    ctx.lineCap = 'square';
    ctx.beginPath();
    ctx.moveTo(lastPos.current.x, lastPos.current.y);
    ctx.lineTo(pos.x, pos.y);
    ctx.stroke();
    lastPos.current = pos;
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', height: '100%', background: '#c0c0c0' }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: 4, padding: '2px 4px', borderBottom: '1px solid #808080' }}>
        <span style={{ fontSize: 10 }}>Brush:</span>
        {[1, 3, 5, 8].map(s => (
          <button key={s} className={`w95-btn ${brushSize === s ? 'active' : ''}`}
            style={{ width: 20, height: 20, padding: 0, display: 'flex', alignItems: 'center', justifyContent: 'center' }}
            onClick={() => setBrushSize(s)}
          >
            <div style={{ width: s + 2, height: s + 2, background: '#000', borderRadius: 0 }} />
          </button>
        ))}
        <div style={{ width: 1, height: 16, background: '#808080' }} />
        <button className="w95-btn" style={{ fontSize: 10, padding: '1px 4px' }} onClick={() => {
          const ctx = canvasRef.current?.getContext('2d');
          if (ctx && canvasRef.current) ctx.clearRect(0, 0, canvasRef.current.width, canvasRef.current.height);
        }}>Clear</button>
      </div>
      <div style={{ display: 'flex', flex: 1, overflow: 'hidden' }}>
        <div style={{ width: 24, background: '#c0c0c0', padding: 2, display: 'flex', flexDirection: 'column', gap: 1, borderRight: '1px solid #808080', overflow: 'auto' }}>
          {colors.map(c => (
            <div key={c} onClick={() => setColor(c)} style={{
              width: 18, height: 18, background: c, cursor: 'default',
              border: color === c ? '2px solid #fff' : '1px solid #808080',
              boxSizing: 'border-box',
            }} />
          ))}
        </div>
        <canvas ref={canvasRef} width={500} height={400} style={{ background: '#fff', cursor: 'crosshair', flex: 1 }}
          onMouseDown={e => { drawing.current = true; lastPos.current = getPos(e); }}
          onMouseMove={draw}
          onMouseUp={() => { drawing.current = false; }}
          onMouseLeave={() => { drawing.current = false; }}
        />
      </div>
      <div style={{ background: '#c0c0c0', padding: '1px 4px', fontSize: 10, borderTop: '1px solid #808080', display: 'flex', gap: 8 }}>
        <span>For Help, click Help Topics on the Help Menu.</span>
        <span style={{ marginLeft: 'auto' }}>Color: <span style={{ display: 'inline-block', width: 10, height: 10, background: color, border: '1px solid #000', verticalAlign: 'middle' }} /></span>
      </div>
    </div>
  );
}

// ═══════════════════════════════════════════════════════════════
//  HELP CONTENT
// ═══════════════════════════════════════════════════════════════
function HelpContent() {
  const [topic, setTopic] = useState('welcome');
  const topics: { id: string; label: string; content: React.ReactNode }[] = [
    { id: 'welcome', label: '📖 Welcome', content: <div><div style={{ fontWeight: 'bold', fontSize: 13, marginBottom: 4 }}>Welcome to My Portfolio Help</div><HR /><p>This interactive Windows 95 desktop contains all the information about my work as a Full Stack Developer from Nijmegen.</p><p style={{ marginTop: 8 }}>Use the topics on the left to learn how to navigate this site.</p></div> },
    { id: 'navigation', label: '🖱 Navigation', content: <div><div style={{ fontWeight: 'bold', fontSize: 13, marginBottom: 4 }}>How to Navigate</div><HR /><ul style={{ paddingLeft: 16 }}><li><b>Double-click</b> desktop icons to open windows</li><li><b>Click</b> the Start menu for more options</li><li><b>Right-click</b> the desktop for context menu</li><li><b>Drag</b> title bars to move windows</li><li><b>Drag</b> window edges to resize</li></ul></div> },
    { id: 'easter', label: '🥚 Easter Eggs', content: <div><div style={{ fontWeight: 'bold', fontSize: 13, marginBottom: 4 }}>🤫 Secrets & Easter Eggs</div><HR /><ul style={{ paddingLeft: 16 }}><li>Wait 60 seconds for the <b>screensaver</b>!</li><li><b>Clippy</b> appears after a few seconds 📎</li><li>Draw in <b>MS Paint</b>!</li><li>First click plays the <b>startup chime</b> 🔊</li></ul></div> },
    { id: 'about', label: 'ℹ️ About', content: <div><div style={{ fontWeight: 'bold', fontSize: 13, marginBottom: 4 }}>About This Portfolio</div><HR /><p>Version 95.0.1337</p><p style={{ marginTop: 4 }}>Built with React, TypeScript, and love for retro computing.</p><p style={{ marginTop: 4 }}>No Electron, no CSS frameworks, just pure authentic Win95 aesthetic.</p><p style={{ marginTop: 8, color: '#808080' }}>© 2026 Adam. All Rights Reserved.</p></div> },
  ];

  return (
    <div style={{ display: 'flex', height: '100%' }}>
      <div className="w95-inset" style={{ width: 150, overflow: 'auto', background: '#fff', flexShrink: 0, padding: 2 }}>
        {topics.map(t => (
          <div key={t.id} onClick={() => setTopic(t.id)} style={{
            padding: '2px 4px', fontSize: 11, cursor: 'default',
            background: topic === t.id ? '#000080' : 'transparent',
            color: topic === t.id ? '#fff' : '#000',
          }}>
            {t.label}
          </div>
        ))}
      </div>
      <div style={{ flex: 1, padding: 10, overflow: 'auto', fontSize: 11, lineHeight: 1.5 }}>
        {topics.find(t => t.id === topic)?.content}
      </div>
    </div>
  );
}

// ═══════════════════════════════════════════════════════════════
//  RUN DIALOG CONTENT
// ═══════════════════════════════════════════════════════════════
function RunContent({ showDialog, openWindow, onClose }: { showDialog: (d: DialogState) => void; openWindow: (type: WindowType, title: string, w: number, h: number, icon: React.ReactNode) => void, onClose: () => void }) {
  const [cmd, setCmd] = useState('');

  const execute = () => {
    const c = cmd.toLowerCase().trim();
    if (c === 'minesweeper' || c === 'winmine' || c === 'winmine.exe' || c === 'solitaire' || c === 'calc' || c === 'calc.exe' || c === 'calculator' || c === 'cmd' || c === 'cmd.exe' || c === 'command' || c === 'defrag' || c === 'defrag.exe') {
      showDialog({ title: 'Not Available', message: 'Coming soon...', icon: 'info', buttons: [{ label: 'OK', onClick: () => { } }] });
      onClose();
    } else if (c === 'mspaint' || c === 'mspaint.exe' || c === 'paint') {
      openWindow('PAINT', 'untitled - Paint', 700, 550, <IconPaint size={20} />);
      onClose();
    } else if (c === 'iexplore' || c === 'iexplore.exe' || c === 'ie') {
      openWindow('IE', 'Internet Explorer', 750, 560, <IconIE size={20} />);
      onClose();
    } else if (c === 'help') {
      openWindow('HELP', 'Help Topics', 625, 475, <IconHelp size={20} />);
      onClose();
    } else if (c === 'dir' || c === 'ls') {
      showDialog({ title: 'C:\\>', message: 'Volume in drive C is SYSTEM\nVolume Serial Number is 1337-DEAD\n\n Directory of C:\\\n\nDEWITTERAAAF  DIR   <DIR>    2026\nPARKLINGEZEGEN DIR  <DIR>    2025\nAI_TRACKING   DIR   <DIR>    2025\nJARVIS        DIR   <DIR>    2026\nSPOORWEGEN    JAR  890,112   2024\nQUOTIAL       DIR   <DIR>    2025\n        6 project(s)', icon: 'info', buttons: [{ label: 'OK', onClick: () => { } }] });
      onClose();
    } else if (c === 'format c:' || c === 'format c:\\') {
      showDialog({ title: '⚠️ FORMAT', message: 'WARNING: ALL DATA ON NON-REMOVABLE DISK\nDRIVE C: WILL BE LOST!\n\nProceed with Format (Y/N)?', icon: 'error', buttons: [{ label: 'Just kidding!', onClick: () => { } }] });
      onClose();
    } else if (c) {
      showDialog({ title: 'Error', message: `Cannot find '${cmd}'.\n\nMake sure you typed the name correctly, and then try again.`, icon: 'error', buttons: [{ label: 'OK', onClick: () => { } }] });
    }
    setCmd('');
  };

  return (
    <div style={{ background: '#c0c0c0', padding: 16, height: '100%', display: 'flex', flexDirection: 'column' }}>
      <div style={{ display: 'flex', gap: 12, alignItems: 'flex-start', marginBottom: 12 }}>
        <IconRun size={48} />
        <div style={{ fontSize: 11 }}>
          <div style={{ marginBottom: 4 }}>Type the name of a program, folder, document, or Internet resource, and Windows will open it for you.</div>
          <div style={{ color: '#808080', fontSize: 10, marginTop: 2 }}>Try: notepad, calc, cmd, defrag, minesweeper, mspaint, iexplore, doom, dir, help, exit</div>
        </div>
      </div>
      <div style={{ display: 'flex', gap: 4, alignItems: 'center', marginBottom: 8 }}>
        <span style={{ fontSize: 11, fontWeight: 'bold' }}>Open:</span>
        <input className="w95-input" style={{ flex: 1 }} value={cmd} onChange={e => setCmd(e.target.value)} onKeyDown={e => { if (e.key === 'Enter') execute(); }} autoFocus />
      </div>
      <div style={{ display: 'flex', justifyContent: 'flex-end', gap: 4, marginTop: 'auto' }}>
        <button className="w95-btn" style={{ minWidth: 75 }} onClick={execute}>OK</button>
        <button className="w95-btn" style={{ minWidth: 75 }} onClick={onClose}>Cancel</button>
        <button className="w95-btn" style={{ minWidth: 75 }} onClick={() => showDialog({ title: 'Browse', message: 'File Browser is not available.\n\nAll files are on the desktop where they belong.', icon: 'info', buttons: [{ label: 'OK', onClick: () => { } }] })}>Browse...</button>
      </div>
    </div>
  );
}

// ═══════════════════════════════════════════════════════════════
//  FIND CONTENT
// ═══════════════════════════════════════════════════════════════
function FindContent({ showDialog, onClose }: { showDialog: (d: DialogState) => void, onClose: () => void }) {
  const [query, setQuery] = useState('');
  const allFiles = [
    { name: 'dewitteraaf.exe', path: 'C:\\Projects\\', size: '2,400 KB', modified: '2026' },
    { name: 'parklingezegen.exe', path: 'C:\\Projects\\', size: '1,800 KB', modified: '2025' },
    { name: 'ai_tracking.py', path: 'C:\\Projects\\', size: '340 KB', modified: '2025' },
    { name: 'jarvis.exe', path: 'C:\\Projects\\', size: 'WIP', modified: '2026' },
    { name: 'spoorwegen.jar', path: 'C:\\Projects\\', size: '890 KB', modified: '2024' },
    { name: 'quotial.html', path: 'C:\\Projects\\', size: '210 KB', modified: '2025' },
    { name: 'skills.txt', path: 'C:\\My Documents\\', size: '2 KB', modified: '2026' },
    { name: 'resume.doc', path: 'C:\\My Documents\\', size: '8 KB', modified: '2026' },
  ];
  const [results, setResults] = useState(allFiles);

  const search = () => {
    if (!query.trim()) { setResults(allFiles); return; }
    const q = query.toLowerCase();
    const filtered = allFiles.filter(f => f.name.toLowerCase().includes(q) || f.path.toLowerCase().includes(q));
    setResults(filtered);
    if (filtered.length === 0) {
      showDialog({ title: 'Find', message: `No files found matching "${query}".\n\nTry searching for "jarvis" instead.`, icon: 'info', buttons: [{ label: 'OK', onClick: () => { } }] });
    }
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', height: '100%', background: '#c0c0c0' }}>
      <div style={{ padding: 8, display: 'flex', gap: 4, alignItems: 'center' }}>
        <span style={{ fontSize: 11, fontWeight: 'bold' }}>Named:</span>
        <input className="w95-input" style={{ flex: 1 }} value={query} onChange={e => setQuery(e.target.value)} onKeyDown={e => { if (e.key === 'Enter') search(); }} />
        <button className="w95-btn" onClick={search}>Find Now</button>
      </div>
      <div className="w95-inset w95-scroll" style={{ flex: 1, overflow: 'auto', background: '#fff', margin: '0 8px 8px' }}>
        <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: 11 }}>
          <thead>
            <tr style={{ background: '#c0c0c0', position: 'sticky', top: 0 }}>
              <th className="w95-outset" style={{ textAlign: 'left', padding: '2px 6px' }}>Name</th>
              <th className="w95-outset" style={{ textAlign: 'left', padding: '2px 6px' }}>In Folder</th>
              <th className="w95-outset" style={{ textAlign: 'left', padding: '2px 6px' }}>Size</th>
              <th className="w95-outset" style={{ textAlign: 'left', padding: '2px 6px' }}>Modified</th>
            </tr>
          </thead>
          <tbody>
            {results.map((f, i) => (
              <tr key={i} style={{ cursor: 'default' }}
                onMouseEnter={e => { (e.currentTarget).style.background = '#000080'; (e.currentTarget).style.color = '#fff'; }}
                onMouseLeave={e => { (e.currentTarget).style.background = ''; (e.currentTarget).style.color = ''; }}
              >
                <td style={{ padding: '2px 6px' }}>📄 {f.name}</td>
                <td style={{ padding: '2px 6px' }}>{f.path}</td>
                <td style={{ padding: '2px 6px' }}>{f.size}</td>
                <td style={{ padding: '2px 6px' }}>{f.modified}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <div style={{ padding: '2px 8px 4px', fontSize: 10, color: '#808080' }}>{results.length} object(s) found</div>
      <div style={{ display: 'flex', justifyContent: 'flex-end', gap: 4, padding: '0 8px 8px' }}>
        <button className="w95-btn" style={{ minWidth: 75 }} onClick={onClose}>OK</button>
        <button className="w95-btn" style={{ minWidth: 75 }} onClick={onClose}>Cancel</button>
      </div>
    </div>
  );
}

// ═══════════════════════════════════════════════════════════════
//  SETTINGS / DISPLAY PROPERTIES
// ═══════════════════════════════════════════════════════════════
function SettingsContent({ bgColor, setBgColor, screensaverType, setScreensaverType, showDialog, onClose }: { bgColor: string; setBgColor: (c: string) => void, screensaverType: 'none' | 'starfield' | 'pipes', setScreensaverType: (c: 'none' | 'starfield' | 'pipes') => void, showDialog: (d: DialogState) => void, onClose: () => void }) {
  const [tab, setTab] = useState('background');
  const bgColors = [
    { name: 'Teal (Default)', value: '#008080' },
    { name: 'Forest Green', value: '#003300' },
    { name: 'Navy Blue', value: '#000080' },
    { name: 'Plum', value: '#660066' },
    { name: 'Storm Gray', value: '#404040' },
    { name: 'Brick Red', value: '#800000' },
    { name: 'Black', value: '#000000' },
    { name: 'Hotdog Stand', value: '#ff0000' },
  ];

  return (
    <div style={{ background: '#c0c0c0', padding: 8, height: '100%', display: 'flex', flexDirection: 'column' }}>
      <div style={{ display: 'flex', gap: 0, marginBottom: -1, position: 'relative', zIndex: 1 }}>
        {['Background', 'Screen Saver'].map(t => (
          <div key={t}
            onClick={() => setTab(t.toLowerCase().replace(' ', ''))}
            className={tab === t.toLowerCase().replace(' ', '') ? '' : 'w95-outset'}
            style={{
              padding: '2px 12px', fontSize: 11, cursor: 'default',
              background: '#c0c0c0',
              borderTop: tab === t.toLowerCase().replace(' ', '') ? '2px solid #fff' : undefined,
              borderLeft: tab === t.toLowerCase().replace(' ', '') ? '2px solid #fff' : undefined,
              borderRight: tab === t.toLowerCase().replace(' ', '') ? '2px solid #000' : undefined,
              borderBottom: tab === t.toLowerCase().replace(' ', '') ? '2px solid #c0c0c0' : undefined,
            }}
          >{t}</div>
        ))}
      </div>
      <div className="w95-outset" style={{ flex: 1, padding: 12, display: 'flex', flexDirection: 'column' }}>
        {tab === 'background' && (
          <>
            <div style={{ fontSize: 11, fontWeight: 'bold', marginBottom: 8 }}>Desktop Color:</div>
            <div className="w95-inset" style={{ flex: 1, overflow: 'auto', background: '#fff', padding: 2 }}>
              {bgColors.map(c => (
                <div key={c.value} onClick={() => setBgColor(c.value)} style={{
                  display: 'flex', alignItems: 'center', gap: 8, padding: '3px 4px', cursor: 'default', fontSize: 11,
                  background: bgColor === c.value ? '#000080' : 'transparent',
                  color: bgColor === c.value ? '#fff' : '#000',
                }}>
                  <div style={{ width: 16, height: 16, background: c.value, border: '1px solid #000' }} />
                  <span>{c.name}</span>
                </div>
              ))}
            </div>
            <div style={{ marginTop: 8, textAlign: 'center', fontSize: 10, color: '#808080' }}>Preview:</div>
            <div className="w95-inset" style={{ height: 60, background: bgColor, margin: '4px auto', width: 120, display: 'flex', alignItems: 'flex-end', justifyContent: 'center' }}>
              <div style={{ height: 8, width: '100%', background: '#c0c0c0', borderTop: '1px solid #fff' }} />
            </div>
          </>
        )}
        {tab === 'screensaver' && (
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', flex: 1, fontSize: 11, color: '#808080' }}>
            <div style={{ textAlign: 'center' }}>
              <div style={{ fontSize: 32, marginBottom: 8 }}>💤</div>
              <div>Screen Saver: {screensaverType === 'none' ? '(None)' : screensaverType === 'pipes' ? '3D Pipes' : 'Starfield Simulation'}</div>
              <div style={{ marginTop: 4, color: '#000' }}>Wait: 1 minute</div>
              <div style={{ marginTop: 8, fontSize: 10, color: '#808080' }}>Available screensavers:</div>
              <div style={{ marginTop: 4 }}>
                <select className="w95-select" style={{ width: 200 }} value={screensaverType} onChange={e => setScreensaverType(e.target.value as any)}>
                  <option value="none">(None)</option>
                  <option value="pipes">3D Pipes</option>
                  <option value="starfield">Starfield Simulation</option>
                </select>
              </div>
            </div>
          </div>
        )}
      </div>
      <div style={{ display: 'flex', justifyContent: 'flex-end', gap: 4, marginTop: 8 }}>
        <button className="w95-btn" style={{ minWidth: 75 }} onClick={onClose}>OK</button>
        <button className="w95-btn" style={{ minWidth: 75 }} onClick={onClose}>Cancel</button>
        <button className="w95-btn" style={{ minWidth: 75 }} onClick={() => { 
          showDialog({ title: 'Settings', message: 'Changes applied successfully.', icon: 'info', buttons: [{ label: 'OK', onClick: () => { } }] });
        }}>Apply</button>
      </div>
    </div>
  );
}

// ═══════════════════════════════════════════════════════════════
//  UTILITY COMPONENTS
// ═══════════════════════════════════════════════════════════════
function HR() {
  return <div style={{ borderTop: '1px solid #808080', borderBottom: '1px solid #fff', margin: '4px 0' }} />;
}

// ═══════════════════════════════════════════════════════════════
//  MAIN APP
// ═══════════════════════════════════════════════════════════════
export default function App() {
  const [booting, setBooting] = useState(true);
  const [windows, setWindows] = useState<WinState[]>([]);
  const [activeId, setActiveId] = useState<string | null>(null);
  const [startOpen, setStartOpen] = useState(false);
  const [programsOpen, setProgramsOpen] = useState(false);
  const [time, setTime] = useState(new Date());
  const [topZ, setTopZ] = useState(10);
  const [dialog, setDialog] = useState<DialogState | null>(null);
  const [shutdownActive, setShutdownActive] = useState(false);
  const [selectedIcon, setSelectedIcon] = useState<number | null>(null);
  const [contextMenu, setContextMenu] = useState<{ items: ContextMenuItem[]; x: number; y: number } | null>(null);
  const [clipboard, setClipboard] = useState('');
  const [bgColor, setBgColor] = useState(localStorage.getItem('adamOS_bgColor') || '#008080');
  const [recycleFull, setRecycleFull] = useState(false);

  const [keys, setKeys] = useState('');
  const [easterEgg, setEasterEgg] = useState<string | null>(null);
  const [bsodActive, setBsodActive] = useState(false);
  const [screensaverActive, setScreensaverActive] = useState(false);
  const [screensaverType, setScreensaverType] = useState<'none' | 'starfield' | 'pipes'>((localStorage.getItem('adamOS_screensaver') as any) || 'starfield');
  const [clippyAction, setClippyAction] = useState<string | undefined>();
  const [errorCascade, setErrorCascade] = useState(false);
  const idleTimerRef = useRef<any>(null);
  const [totalClicks, setTotalClicks] = useState(0);

  const trackClick = useCallback(() => {
    setTotalClicks(p => p + 1);
  }, []);

  useEffect(() => {
    localStorage.setItem('adamOS_bgColor', bgColor);
  }, [bgColor]);

  useEffect(() => {
    localStorage.setItem('adamOS_screensaver', screensaverType);
  }, [screensaverType]);

  useEffect(() => {
    const t = setInterval(() => setTime(new Date()), 1000);
    return () => clearInterval(t);
  }, []);

  useEffect(() => {
    const playStartupSound = () => {
      try {
        const ctx = new (window.AudioContext || (window as any).webkitAudioContext)();
        const notes = [523.25, 659.25, 783.99, 1046.50];
        notes.forEach((freq, i) => {
          const osc = ctx.createOscillator();
          const gain = ctx.createGain();
          osc.connect(gain);
          gain.connect(ctx.destination);
          osc.frequency.value = freq;
          osc.type = 'sine';
          gain.gain.setValueAtTime(0.15, ctx.currentTime + i * 0.3);
          gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + i * 0.3 + 0.8);
          osc.start(ctx.currentTime + i * 0.3);
          osc.stop(ctx.currentTime + i * 0.3 + 0.8);
        });
      } catch (e) { }
    };
    const handler = () => { playStartupSound(); document.removeEventListener('click', handler); };
    document.addEventListener('click', handler);
    return () => document.removeEventListener('click', handler);
  }, []);

  useEffect(() => {
    const resetIdle = () => {
      if (idleTimerRef.current) clearTimeout(idleTimerRef.current);
      if (screensaverType === 'none') return;
      idleTimerRef.current = setTimeout(() => {
        setScreensaverActive(true);
      }, 60000);
    };
    window.addEventListener('mousemove', resetIdle);
    window.addEventListener('keydown', resetIdle);
    window.addEventListener('click', resetIdle);
    resetIdle();
    return () => {
      window.removeEventListener('mousemove', resetIdle);
      window.removeEventListener('keydown', resetIdle);
      window.removeEventListener('click', resetIdle);
      if (idleTimerRef.current) clearTimeout(idleTimerRef.current);
    };
  }, [screensaverType]);

  useEffect(() => {
    if (!errorCascade) return;
    const errors = [
      'A fatal exception 0E has occurred at 0028:C0011E36',
      'KERNEL32.DLL is not responding',
      'Stack overflow in module EXPLORER.EXE',
      'Insufficient memory to run this application',
      'An error has occurred in your program. To keep working anyway, click Ignore.',
      'This program has performed an illegal operation',
      'General Protection Fault in module USER.EXE',
      'HIMEM.SYS is missing or corrupt',
      'Bad command or file name',
      'Not enough disk space on drive C:',
    ];
    let count = 0;
    const interval = setInterval(() => {
      if (count >= 8) { clearInterval(interval); setErrorCascade(false); return; }
      const msg = errors[Math.floor(Math.random() * errors.length)];
      setDialog({ title: '⚠️ Error', message: msg, icon: 'error', buttons: [{ label: 'OK', onClick: () => { } }] });
      count++;
    }, 600);
    return () => clearInterval(interval);
  }, [errorCascade]);

  /*
  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if ((e.target as HTMLElement).tagName === 'INPUT' || (e.target as HTMLElement).tagName === 'TEXTAREA') return;
      const next = (keys + e.key).slice(-6).toLowerCase();
      setKeys(next);
      if (next.endsWith('doom')) { setEasterEgg('doom'); setTimeout(() => setEasterEgg(null), 4000); }
      else if (next.endsWith('matrix')) { setEasterEgg('matrix'); setTimeout(() => setEasterEgg(null), 5000); }
      else if (next.endsWith('nyan')) { setEasterEgg('nyan'); setTimeout(() => setEasterEgg(null), 4000); }
      else if (next.endsWith('bsod')) { setBsodActive(true); }
      else if (next.endsWith('error')) { setErrorCascade(true); }
      else if (next.endsWith('hello')) { setDialog({ title: '👋 Hello!', message: 'Hello there, friend!\n\nThank you for visiting my portfolio.\nYou found a secret!\n\n🎉 You are awesome!', icon: 'info', buttons: [{ label: 'You too!', onClick: () => { } }] }); }
      else if (next.endsWith('exit')) { setDialog({ title: '🤔 Philosophy', message: 'You cannot exit Windows 95.\nWindows 95 exits you.\n\n"I think, therefore I compute."\n  — René Desktop', icon: 'warning', buttons: [{ label: 'Deep...', onClick: () => { } }] }); }
      else if (next.endsWith('cow')) { setDialog({ title: '🐄 Moo!', message: '        \\   ^__^\n         \\  (oo)\\_______\n            (__)\\       )\\/\\\n                ||----w |\n                ||     ||\n\n   "Moo. You found the secret cow."', icon: 'info', buttons: [{ label: 'Moo!', onClick: () => { } }] }); }
      else if (next.endsWith('xyzzy')) { setDialog({ title: '✨ XYZZY', message: 'A hollow voice says "PLUGH".\n\nYou are in a twisty little maze\nof passages, all alike.\n\nYou have been eaten by a Grue.', icon: 'warning', buttons: [{ label: 'Respawn', onClick: () => { } }] }); }
    };
    window.addEventListener('keydown', handler);
    return () => window.removeEventListener('keydown', handler);
  }, [keys]);
  */

  const showDialog = useCallback((d: DialogState) => setDialog(d), []);

  const openWindow = useCallback((type: WindowType, title: string, w: number, h: number, icon: React.ReactNode) => {
    setStartOpen(false);
    setProgramsOpen(false);
    const existing = windows.find(win => win.type === type);
    if (existing) {
      const nz = topZ + 1;
      setWindows(ws => ws.map(win => win.type === type ? { ...win, isOpen: true, isMinimized: false, zIndex: nz } : win));
      setActiveId(existing.id);
      setTopZ(nz);
      return;
    }
    const nz = topZ + 1;
    const offset = windows.filter(w2 => w2.isOpen).length * 24;
    const nw: WinState = {
      id: Math.random().toString(36).slice(2, 8),
      type, title, isOpen: true, isMinimized: false, isMaximized: false,
      zIndex: nz, x: 60 + offset, y: 30 + offset, w, h, icon,
    };
    setWindows(ws => [...ws, nw]);
    setActiveId(nw.id);
    setTopZ(nz);
  }, [windows, topZ]);

  const focusWindow = useCallback((id: string) => {
    const nz = topZ + 1;
    setWindows(ws => ws.map(w => w.id === id ? { ...w, zIndex: nz } : w));
    setActiveId(id);
    setTopZ(nz);
    setStartOpen(false);
    setProgramsOpen(false);
  }, [topZ]);

  const toggleMinimize = useCallback((id: string) => {
    setWindows(ws => ws.map(w => {
      if (w.id !== id) return w;
      if (w.isMinimized) {
        const nz = topZ + 1;
        setTopZ(nz);
        setActiveId(id);
        return { ...w, isMinimized: false, zIndex: nz };
      }
      return { ...w, isMinimized: true };
    }));
  }, [topZ]);

  const toggleMaximize = useCallback((id: string) => {
    setWindows(ws => ws.map(w => w.id === id ? { ...w, isMaximized: !w.isMaximized } : w));
    focusWindow(id);
  }, [focusWindow]);

  const closeWindow = useCallback((id: string) => {
    setWindows(ws => ws.map(w => w.id === id ? { ...w, isOpen: false } : w));
    setRecycleFull(true);
    setClippyAction('close');
  }, []);

  const buildMenus = useCallback((type: WindowType) => {
    const fileMenu = {
      label: 'File', items: [
        { label: 'New', onClick: () => showDialog({ title: 'New', message: 'Creating new file...\n\nJust kidding, this is a portfolio.', icon: 'info', buttons: [{ label: 'OK', onClick: () => { } }] }), shortcut: 'Ctrl+N' },
        { label: 'Open...', onClick: () => showDialog({ title: 'Open', message: 'Please insert disk into Drive A:\\', icon: 'warning', buttons: [{ label: 'OK', onClick: () => { } }] }), shortcut: 'Ctrl+O' },
        { label: 'Save', onClick: () => showDialog({ title: 'Save', message: 'File saved successfully to C:\\My Documents\\', icon: 'info', buttons: [{ label: 'OK', onClick: () => { } }] }), shortcut: 'Ctrl+S' },
        { label: 'Save As...', onClick: () => showDialog({ title: 'Save As', message: 'Save to:\n  A:\\ (3.5" Floppy)\n  C:\\ (Hard Disk)\n\nInsufficient disk space on A:\\', icon: 'warning', buttons: [{ label: 'OK', onClick: () => { } }] }) },
        { label: '', onClick: () => { }, separator: true },
        { label: 'Print...', onClick: () => showDialog({ title: 'Print', message: 'Printing to:\n  HP LaserJet 4 on LPT1:\n\nPC LOAD LETTER', icon: 'warning', buttons: [{ label: 'OK', onClick: () => { } }] }), shortcut: 'Ctrl+P' },
        { label: '', onClick: () => { }, separator: true },
        { label: 'Exit', onClick: () => { const w = windows.find(w2 => w2.type === type); if (w) closeWindow(w.id); } },
      ],
    };
    const editMenu = {
      label: 'Edit', items: [
        { label: 'Undo', onClick: () => showDialog({ title: 'Undo', message: 'Nothing to undo.\n\nYou cannot undo the passage of time.', icon: 'info', buttons: [{ label: 'OK', onClick: () => { } }] }), shortcut: 'Ctrl+Z' },
        { label: '', onClick: () => { }, separator: true },
        { label: 'Cut', onClick: () => showDialog({ title: 'Cut', message: '✂️ Text cut to clipboard.', icon: 'info', buttons: [{ label: 'OK', onClick: () => { } }] }), shortcut: 'Ctrl+X' },
        { label: 'Copy', onClick: () => { setClipboard('Copied text from portfolio!'); showDialog({ title: 'Copy', message: '📋 Copied to clipboard!', icon: 'info', buttons: [{ label: 'OK', onClick: () => { } }] }); }, shortcut: 'Ctrl+C' },
        { label: 'Paste', onClick: () => showDialog({ title: 'Paste', message: clipboard ? `📋 Clipboard contents:\n"${clipboard}"` : '📋 Clipboard is empty.', icon: 'info', buttons: [{ label: 'OK', onClick: () => { } }] }), shortcut: 'Ctrl+V' },
        { label: 'Select All', onClick: () => showDialog({ title: 'Select All', message: 'Everything is now selected.\nAll of it. The whole thing.', icon: 'info', buttons: [{ label: 'OK', onClick: () => { } }] }), shortcut: 'Ctrl+A' },
      ],
    };
    const viewMenu = {
      label: 'View', items: [
        { label: 'Toolbar', onClick: () => showDialog({ title: 'Toolbar', message: 'Toolbar visibility toggled!\n\n(Not really, but imagine it did)', icon: 'info', buttons: [{ label: 'OK', onClick: () => { } }] }) },
        { label: 'Status Bar', onClick: () => showDialog({ title: 'Status Bar', message: 'Status bar is always visible.\nJust like my dedication to this portfolio.', icon: 'info', buttons: [{ label: 'OK', onClick: () => { } }] }) },
        { label: '', onClick: () => { }, separator: true },
        { label: 'Large Icons', onClick: () => { } },
        { label: 'Small Icons', onClick: () => { } },
        { label: 'List', onClick: () => { } },
        { label: 'Details', onClick: () => { } },
      ],
    };
    const helpMenu = {
      label: 'Help', items: [
        { label: 'Help Topics', onClick: () => openWindow('HELP', 'Help Topics', 625, 475, <IconHelp size={20} />) },
        { label: '', onClick: () => { }, separator: true },
        { label: 'About...', onClick: () => showDialog({ title: 'About This Portfolio', message: 'My Portfolio\nVersion 95.0.1337\n\n© 2026 Adam. All Rights Reserved.\n\nPhysical Memory: 640K ought to be enough\nFree Disk Space: Plenty\nMood: Building Jarvis', icon: 'info', buttons: [{ label: 'OK', onClick: () => { } }] }) },
      ],
    };
    return [fileMenu, editMenu, viewMenu, helpMenu];
  }, [windows, closeWindow, showDialog, openWindow, clipboard]);

  const desktopContextMenu = (e: React.MouseEvent) => {
    e.preventDefault();
    setContextMenu({
      x: e.clientX, y: e.clientY,
      items: [
        { label: 'Arrange Icons', onClick: () => showDialog({ title: 'Arrange Icons', message: 'Icons have been arranged by name.\n\n(They were already arranged by name.)', icon: 'info', buttons: [{ label: 'OK', onClick: () => { } }] }) },
        { label: 'Line up Icons', onClick: () => { } },
        { label: '', onClick: () => { }, separator: true },
        { label: 'Paste', onClick: () => showDialog({ title: 'Paste', message: clipboard ? `📋 "${clipboard}"` : '📋 Clipboard is empty.', icon: 'info', buttons: [{ label: 'OK', onClick: () => { } }] }) },
        { label: 'Paste Shortcut', onClick: () => { }, disabled: true },
        { label: '', onClick: () => { }, separator: true },
        { label: 'New ▶', onClick: () => showDialog({ title: 'New', message: 'What would you like to create?\n\n• Folder\n• Shortcut\n• Text Document\n• Bitmap Image\n• Wave Sound\n\n(This is a portfolio, so nothing actually.)', icon: 'info', buttons: [{ label: 'OK', onClick: () => { } }] }) },
        { label: '', onClick: () => { }, separator: true },
        { label: 'Properties', onClick: () => openWindow('SETTINGS', 'Display Properties', 500, 525, <IconSettings size={20} />) },
      ],
    });
  };

  const iconContextMenu = (e: React.MouseEvent, ic: typeof DESKTOP_ICONS[0], idx: number) => {
    e.preventDefault();
    e.stopPropagation();
    setSelectedIcon(idx);
    setContextMenu({
      x: e.clientX, y: e.clientY,
      items: [
        { label: 'Open', onClick: () => ic.type && openWindow(ic.type, ic.label.replace('\n', ' '), ic.w, ic.h, ic.menuIcon) },
        { label: 'Explore', onClick: () => ic.type && openWindow(ic.type, ic.label.replace('\n', ' '), ic.w, ic.h, ic.menuIcon) },
        { label: '', onClick: () => { }, separator: true },
        { label: 'Copy', onClick: () => { setClipboard(ic.label); showDialog({ title: 'Copy', message: `📋 "${ic.label}" copied to clipboard.`, icon: 'info', buttons: [{ label: 'OK', onClick: () => { } }] }); } },
        { label: 'Create Shortcut', onClick: () => showDialog({ title: 'Shortcut', message: 'A shortcut to "' + ic.label + '" has been created.\n\n...wait, you\'re already on the desktop.', icon: 'info', buttons: [{ label: 'OK', onClick: () => { } }] }) },
        { label: 'Delete', onClick: () => showDialog({ title: 'Confirm Delete', message: 'Are you sure you want to send\n"' + ic.label + '" to the Recycle Bin?', icon: 'warning', buttons: [{ label: 'Yes (just kidding)', onClick: () => { } }, { label: 'No', onClick: () => { } }] }) },
        { label: 'Rename', onClick: () => showDialog({ title: 'Rename', message: 'You cannot rename portfolio items.\nThey are who they are. 🧘', icon: 'info', buttons: [{ label: 'OK', onClick: () => { } }] }) },
        { label: '', onClick: () => { }, separator: true },
        { label: 'Properties', onClick: () => showDialog({ title: ic.label.replace('\n', ' ') + ' Properties', message: `Type: Shortcut\nLocation: Desktop\nSize: ${Math.floor(Math.random() * 100 + 10)} KB\nCreated: 2024\nModified: 2026\nAccessed: Today`, icon: 'info', buttons: [{ label: 'OK', onClick: () => { } }] }) },
      ],
    });
  };

  if (booting) {
    return <BootScreen onDone={() => setBooting(false)} />;
  }

  return (
    <ClipboardContext.Provider value={{ clipboard, setClipboard }}>
      <div
        style={{ width: '100vw', height: '100vh', background: bgColor, display: 'flex', flexDirection: 'column', overflow: 'hidden', userSelect: 'none', fontFamily: '"W95FA", "MS Sans Serif", Tahoma, sans-serif', fontSize: 11 }}
        onClick={() => { setStartOpen(false); setProgramsOpen(false); setSelectedIcon(null); setContextMenu(null); trackClick(); }}
        onContextMenu={desktopContextMenu}
      >
        {/* Desktop */}
        <div style={{ flex: 1, position: 'relative', padding: 8 }}>
          {/* Centered Background Image */}
          <div style={{ position: 'absolute', inset: 0, display: 'flex', alignItems: 'center', justifyContent: 'center', pointerEvents: 'none', zIndex: 0 }}>
            <img src="/backloh.png" alt="Desktop Background" style={{ opacity: 1, maxWidth: '450px', width: '40%', height: 'auto', objectFit: 'contain' }} />
          </div>
          {/* Desktop Icons */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: 4, position: 'relative', zIndex: 1 }}>
            {DESKTOP_ICONS.map((ic, i) => (
              <div
                key={i}
                onClick={(e) => { e.stopPropagation(); setSelectedIcon(i); setContextMenu(null); }}
                onDoubleClick={() => {
                  if (ic.type === null) {
                    showDialog({
                      title: 'Recycle Bin',
                      message: recycleFull
                        ? 'Recycle Bin contains:\n\n• deleted_file.tmp (3 KB)\n• old_resume_v4_FINAL_final.doc (12 KB)\n• untitled.bmp (45 KB)\n• why_did_i_save_this.txt (1 KB)'
                        : 'Recycle Bin is empty.\n\nTry closing some windows first!',
                      icon: 'info',
                      buttons: recycleFull
                        ? [{ label: 'OK', onClick: () => { } }, { label: 'Empty Bin', onClick: () => setRecycleFull(false) }]
                        : [{ label: 'OK', onClick: () => { } }],
                    });
                    return;
                  }
                  openWindow(ic.type, ic.label.replace('\n', ' '), ic.w, ic.h, ic.menuIcon);
                }}
                onContextMenu={(e) => iconContextMenu(e, ic, i)}
                style={{ width: 70, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 2, padding: 2, cursor: 'default' }}
              >
                <div style={{
                  padding: 2,
                  background: selectedIcon === i ? 'rgba(0,0,128,0.5)' : 'transparent',
                  border: selectedIcon === i ? '1px dotted #fff' : '1px solid transparent',
                }}>
                  {ic.type === null ? (recycleFull ? <IconRecycleBinFull size={48} /> : <IconRecycleBin size={48} />) : ic.icon}
                </div>
                <span style={{
                  fontSize: 11, color: '#fff', textAlign: 'center',
                  textShadow: '1px 1px 1px #000, -1px -1px 1px #000, 1px -1px 1px #000, -1px 1px 1px #000',
                  background: selectedIcon === i ? '#000080' : 'transparent',
                  padding: '0 2px', whiteSpace: 'pre-line', lineHeight: 1.2,
                }}>
                  {ic.label}
                </span>
              </div>
            ))}
          </div>

          {/* Windows */}
          {windows.map(w => w.isOpen && !w.isMinimized && (
            <Win95Window
              key={w.id} win={w} isActive={activeId === w.id}
              onFocus={() => focusWindow(w.id)}
              onMinimize={() => toggleMinimize(w.id)}
              onMaximize={() => toggleMaximize(w.id)}
              onClose={() => closeWindow(w.id)}
              menuItems={buildMenus(w.type)}
            >
              {w.type === 'ABOUT' && <AboutContent />}
              {w.type === 'PROJECTS' && <ProjectsContent showDialog={showDialog} />}
              {w.type === 'SKILLS' && <SkillsContent />}
              {w.type === 'CONTACT' && <ContactContent showDialog={showDialog} />}
              {w.type === 'RESUME' && <ResumeContent showDialog={showDialog} />}
              {w.type === 'HELP' && <HelpContent />}
              {w.type === 'IE' && <IEContent showDialog={showDialog} />}
              {w.type === 'MINESWEEPER' && <MinesweeperContent />}
              {w.type === 'PAINT' && <PaintContent />}
              {w.type === 'RUN' && <RunContent showDialog={showDialog} openWindow={openWindow} onClose={() => closeWindow(w.id)} />}
              {w.type === 'FIND' && <FindContent showDialog={showDialog} onClose={() => closeWindow(w.id)} />}
              {w.type === 'SETTINGS' && <SettingsContent setBgColor={setBgColor} bgColor={bgColor} screensaverType={screensaverType} setScreensaverType={setScreensaverType} showDialog={showDialog} onClose={() => closeWindow(w.id)} />}
              {w.type === 'CALCULATOR' && <CalculatorContent />}
              {w.type === 'CMD' && <CMDContent onClose={() => closeWindow(w.id)} />}
              {w.type === 'DEFRAG' && <DefragContent />}
            </Win95Window>
          ))}

          {/* Easter Eggs */}
          {easterEgg === 'doom' && (
            <div style={{ position: 'absolute', inset: 0, background: 'rgba(139,0,0,0.7)', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', zIndex: 99999, pointerEvents: 'none' }}>
              <div style={{ fontSize: 80, fontWeight: 'bold', color: '#ff0000', textShadow: '4px 4px 0 #000, -2px -2px 0 #000', letterSpacing: 8, fontFamily: 'Impact, sans-serif' }}>IDDQD</div>
              <div style={{ fontSize: 18, color: '#ffff00', marginTop: 8, textShadow: '2px 2px 0 #000' }}>GOD MODE ACTIVATED</div>
              <div style={{ fontSize: 11, color: '#fff', marginTop: 16, textShadow: '1px 1px 0 #000' }}>🔥 Rip and Tear, until it is done. 🔥</div>
            </div>
          )}
          {easterEgg === 'matrix' && (
            <div style={{ position: 'absolute', inset: 0, background: 'rgba(0,0,0,0.9)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 99999, pointerEvents: 'none', overflow: 'hidden' }}>
              <MatrixRain />
              <div style={{ position: 'absolute', fontSize: 24, color: '#00ff00', fontFamily: 'monospace', textShadow: '0 0 10px #00ff00' }}>Wake up, Neo...</div>
            </div>
          )}
          {easterEgg === 'nyan' && (
            <div style={{ position: 'absolute', inset: 0, display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 99999, pointerEvents: 'none', background: 'linear-gradient(180deg, #ff0000, #ff8000, #ffff00, #00ff00, #0000ff, #8000ff)' }}>
              <div style={{ fontSize: 64, animation: 'none' }}>🐱</div>
              <div style={{ position: 'absolute', bottom: 20, fontSize: 18, color: '#fff', textShadow: '2px 2px 0 #000', fontWeight: 'bold' }}>🌈 NYAN NYAN NYAN NYAN 🌈</div>
            </div>
          )}
        </div>

        {/* ─── TASKBAR ─────────────────────────────────────────── */}
        <div style={{
          height: 42, background: '#c0c0c0', borderTop: '2px solid #fff',
          display: 'flex', alignItems: 'center', justifyContent: 'space-between',
          padding: '2px', position: 'relative', zIndex: 100000,
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 2, height: '100%', overflow: 'hidden' }}>
            <button
              className={`w95-btn ${startOpen ? 'active' : ''}`}
              style={{ display: 'flex', alignItems: 'center', gap: 6, height: 34, fontWeight: 'bold', paddingLeft: 6, paddingRight: 10, flexShrink: 0, fontSize: 16 }}
              onClick={(e) => { e.stopPropagation(); setStartOpen(!startOpen); setProgramsOpen(false); }}
            >
              <img src="/windows95.png" alt="Start" style={{ height: 20, width: 'auto' }} />
              <span>Start</span>
            </button>
            <div style={{ width: 0, height: 20, borderLeft: '1px solid #808080', borderRight: '1px solid #fff', margin: '0 2px', flexShrink: 0 }} />
            <button className="w95-btn" style={{ width: 34, height: 34, padding: 0, flexShrink: 0 }} title="Internet Explorer"
              onClick={() => openWindow('IE', 'Internet Explorer', 700, 550, <IconIE size={20} />)}>
              <IconIE size={32} />
            </button>
            <div style={{ width: 0, height: 20, borderLeft: '1px solid #808080', borderRight: '1px solid #fff', margin: '0 2px', flexShrink: 0 }} />
            <div style={{ display: 'flex', gap: 2, overflow: 'hidden', flex: 1 }}>
              {windows.filter(w => w.isOpen).map(w => (
                <button
                  key={w.id}
                  className={`w95-btn ${(activeId === w.id && !w.isMinimized) ? 'active' : ''}`}
                  style={{ minWidth: 120, maxWidth: 200, height: 34, textAlign: 'left', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap', fontSize: 14, display: 'flex', alignItems: 'center', gap: 6, flexShrink: 1 }}
                  onClick={() => { toggleMinimize(w.id); }}
                >
                  <span style={{ flexShrink: 0 }}>{w.icon}</span>
                  <span style={{ overflow: 'hidden', textOverflow: 'ellipsis' }}>{w.title}</span>
                </button>
              ))}
            </div>
          </div>

          <div className="w95-inset-thin" style={{ height: 34, padding: '0 12px', display: 'flex', alignItems: 'center', gap: 12, fontSize: 14, background: '#c0c0c0', marginRight: 1, flexShrink: 0 }}>
            <span title="Volume" style={{ cursor: 'default', display: 'flex' }} onClick={() => showDialog({ title: 'Volume Control', message: 'Volume: ████████░░ 80%\n\nWave: ██████░░░░ 60%\nMIDI: ████████░░ 80%\nCD:   ██████████ 100%', icon: 'info', buttons: [{ label: 'OK', onClick: () => { } }] })}><IconVolume size={18} /></span>
            <span title="Network" style={{ cursor: 'default', display: 'flex' }} onClick={() => showDialog({ title: 'Network', message: 'Connected to: The Internet\n\nSpeed: 56,000 bps\nProtocol: TCP/IP (Winsock 2.0)\nDNS: Working (eventually)\n\nBytes Sent: 1,337\nBytes Received: 42,069', icon: 'info', buttons: [{ label: 'OK', onClick: () => { } }] })}><IconGlobe size={18} /></span>
            <span>{time.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
          </div>

          {startOpen && (
            <div className="w95-outset" style={{
              position: 'absolute', bottom: 42, left: 0,
              background: '#c0c0c0', width: 280, display: 'flex', padding: 2,
            }} onClick={(e) => e.stopPropagation()}>
              <div style={{ width: 32, background: 'linear-gradient(180deg, #000080, #1084d0)', display: 'flex', alignItems: 'flex-end', justifyContent: 'center', paddingBottom: 10 }}>
                <span style={{ color: '#c0c0c0', fontWeight: 'bold', fontSize: 20, letterSpacing: 2, writingMode: 'vertical-rl', transform: 'rotate(180deg)' }}>
                  adam<span style={{ color: '#fff' }}>OS</span>
                </span>
              </div>
              <div style={{ flex: 1, display: 'flex', flexDirection: 'column' }}>
                <div style={{ position: 'relative' }}
                  onMouseEnter={() => setProgramsOpen(true)}
                  onMouseLeave={() => setProgramsOpen(false)}
                >
                  <StartMenuItem icon={<IconPrograms size={32} />} label="Programs" arrow onClick={() => setProgramsOpen(!programsOpen)} />
                  {programsOpen && (
                    <div className="w95-outset" style={{ position: 'absolute', left: '100%', top: 0, background: '#c0c0c0', width: 200, padding: 2 }}>
                      <StartMenuItem icon={<IconMinesweeper size={32} />} label="Minesweeper" onClick={() => showDialog({ title: 'Minesweeper', message: 'Coming soon...', icon: 'info', buttons: [{ label: 'OK', onClick: () => { } }] })} />
                      <StartMenuItem icon={<IconPaint size={32} />} label="Paint" onClick={() => openWindow('PAINT', 'untitled - Paint', 700, 550, <IconPaint size={20} />)} />
                      <StartMenuItem icon={<IconSolitaire size={32} />} label="Solitaire" onClick={() => showDialog({ title: 'Solitaire', message: 'Coming soon...', icon: 'info', buttons: [{ label: 'OK', onClick: () => { } }] })} />
                      <div style={{ borderTop: '1px solid #808080', borderBottom: '1px solid #fff', margin: '2px 4px' }} />
                      <StartMenuItem icon={<IconIE size={32} />} label="Internet Explorer" onClick={() => openWindow('IE', 'Internet Explorer', 750, 560, <IconIE size={20} />)} />
                      <StartMenuItem icon={<IconNotepad size={32} />} label="Notepad" onClick={() => openWindow('SKILLS', 'Notepad - Skills.txt', 625, 500, <IconNotepad size={20} />)} />
                      <StartMenuItem icon={<IconWordpad size={32} />} label="WordPad" onClick={() => openWindow('RESUME', 'Resume.doc - WordPad', 725, 650, <IconWordpad size={20} />)} />
                      <StartMenuItem icon={<IconCalculator size={32} />} label="Calculator" onClick={() => showDialog({ title: 'Calculator', message: 'Coming soon...', icon: 'info', buttons: [{ label: 'OK', onClick: () => { } }] })} />
                      <div style={{ borderTop: '1px solid #808080', borderBottom: '1px solid #fff', margin: '2px 4px' }} />
                      <StartMenuItem icon={<IconCMD size={32} />} label="MS-DOS Prompt" onClick={() => showDialog({ title: 'MS-DOS Prompt', message: 'Coming soon...', icon: 'info', buttons: [{ label: 'OK', onClick: () => { } }] })} />
                      <StartMenuItem icon={<IconDefrag size={32} />} label="Disk Defragmenter" onClick={() => showDialog({ title: 'Disk Defragmenter', message: 'Coming soon...', icon: 'info', buttons: [{ label: 'OK', onClick: () => { } }] })} />
                    </div>
                  )}
                </div>
                <StartMenuItem icon={<IconFolderOpen size={32} />} label="Documents" arrow onClick={() => showDialog({ title: 'Recent Documents', message: 'Recent Documents:\n\n• parklingezegen_supabase_schema.sql\n• jarvis_architecture.md\n• ai_tracker_v4_notes.txt\n• dewitteraaf_deploy_log.txt', icon: 'info', buttons: [{ label: 'OK', onClick: () => { } }] })} />
                <StartMenuItem icon={<IconSettings size={32} />} label="Settings" arrow onClick={() => openWindow('SETTINGS', 'Display Properties', 500, 525, <IconSettings size={20} />)} />
                <StartMenuItem icon={<IconFind size={32} />} label="Find" arrow onClick={() => openWindow('FIND', 'Find: All Files', 600, 450, <IconFind size={20} />)} />
                <StartMenuItem icon={<IconHelp size={32} />} label="Help" onClick={() => openWindow('HELP', 'Help Topics', 625, 475, <IconHelp size={20} />)} />
                <StartMenuItem icon={<IconRun size={32} />} label="Run..." onClick={() => openWindow('RUN', 'Run', 525, 250, <IconRun size={20} />)} />
                <div style={{ borderTop: '1px solid #808080', borderBottom: '1px solid #fff', margin: '2px 4px' }} />
                <StartMenuItem icon={<IconShutdown size={32} />} label="Shut Down..." onClick={() => { setStartOpen(false); setShutdownActive(true); }} />
              </div>
            </div>
          )}
        </div>

        {dialog && <DialogBox dialog={dialog} onClose={() => setDialog(null)} />}
        {contextMenu && <ContextMenu items={contextMenu.items} x={contextMenu.x} y={contextMenu.y} onClose={() => setContextMenu(null)} />}
        {shutdownActive && <ShutdownScreen onCancel={() => setShutdownActive(false)} />}
        <Clippy lastAction={clippyAction} />
        {screensaverActive && (
          screensaverType === 'starfield'
            ? <StarfieldScreensaver onDismiss={() => setScreensaverActive(false)} />
            : <PipesScreensaver onDismiss={() => setScreensaverActive(false)} />
        )}

        {bsodActive && (
          <div
            onClick={() => setBsodActive(false)}
            style={{
              position: 'fixed', inset: 0, background: '#0000aa', zIndex: 99999999,
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              cursor: 'default', padding: 40,
            }}
          >
            <div style={{
              color: '#fff', fontFamily: '"Courier New", monospace', fontSize: 14,
              maxWidth: 600, lineHeight: 1.6, whiteSpace: 'pre-wrap',
            }}>
              <div style={{ background: '#aaaaaa', color: '#0000aa', display: 'inline-block', padding: '0 8px', fontWeight: 'bold', marginBottom: 16 }}>
                Windows
              </div>
              {`

A fatal exception 0E has occurred at 0028:C0011E36 in VXD VMM(01) +
00010E36. The current application will be terminated.

*  Press any key to terminate the current application.
*  Press CTRL+ALT+DEL to restart your computer. You will
   lose any unsaved information in all applications.

                  Press any key to continue _


`}
              <div style={{ fontSize: 11, color: '#aaaaaa', marginTop: 20 }}>
                (This is an easter egg. Click anywhere to dismiss.)
                {'\n'}(You typed "bsod" — nice find! 💀)
              </div>
            </div>
          </div>
        )}
      </div>
    </ClipboardContext.Provider>
  );
}

// ─── Start Menu Item ────────────────────────────────────────
function StartMenuItem({ icon, label, arrow, onClick }: { icon: React.ReactNode; label: string; arrow?: boolean; onClick?: () => void }) {
  return (
    <div
      onClick={(e) => { e.stopPropagation(); onClick?.(); }}
      style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '6px 12px', cursor: 'default', fontSize: 14 }}
      onMouseEnter={e => { (e.currentTarget).style.background = '#000080'; (e.currentTarget).style.color = '#fff'; }}
      onMouseLeave={e => { (e.currentTarget).style.background = ''; (e.currentTarget).style.color = ''; }}
    >
      <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
        <span style={{ width: 32, height: 32, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>{icon}</span>
        <span>{label}</span>
      </div>
      {arrow && <span style={{ fontSize: 10 }}>▶</span>}
    </div>
  );
}

// ─── Matrix Rain Easter Egg ─────────────────────────────────
function MatrixRain() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d')!;
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
    const columns = Math.floor(canvas.width / 14);
    const drops: number[] = new Array(columns).fill(1);
    const chars = 'アイウエオカキクケコサシスセソタチツテトナニヌネノハヒフヘホマミムメモヤユヨラリルレロワヲン0123456789';
    const draw = () => {
      ctx.fillStyle = 'rgba(0, 0, 0, 0.05)';
      ctx.fillRect(0, 0, canvas.width, canvas.height);
      ctx.fillStyle = '#00ff00';
      ctx.font = '14px monospace';
      for (let i = 0; i < drops.length; i++) {
        const text = chars[Math.floor(Math.random() * chars.length)];
        ctx.fillText(text, i * 14, drops[i] * 14);
        if (drops[i] * 14 > canvas.height && Math.random() > 0.975) drops[i] = 0;
        drops[i]++;
      }
    };
    const interval = setInterval(draw, 35);
    return () => clearInterval(interval);
  }, []);
  return <canvas ref={canvasRef} style={{ position: 'absolute', inset: 0 }} />;
}