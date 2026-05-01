import React from 'react';

/**
 * ═══════════════════════════════════════════════════════════════
 *  WIN95 ICON SYSTEM — Easy to swap!
 * ═══════════════════════════════════════════════════════════════
 *
 *  To replace any icon with a real Windows 95 asset:
 *
 *  1. Import your SVG:
 *     import myComputerSvg from "../../imports/my-computer.svg";
 *
 *  2. Replace the component body:
 *     export const IconComputer = ({ size = 32 }) => (
 *       <img src={myComputerSvg} width={size} height={size} alt="My Computer" style={{ imageRendering: 'pixelated' }} />
 *     );
 *
 *  Or use an inline SVG, a PNG, whatever you want.
 *  All icons accept a `size` prop (default 32 for desktop, 16 for menus).
 * ═══════════════════════════════════════════════════════════════
 */

interface IconProps {
  size?: number;
}

// ─── MY COMPUTER ──────────────────────────────────────────────
export const IconComputer = ({ size = 32 }: IconProps) => (
  <svg width={size} height={size} viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg">
    <rect x="2" y="3" width="28" height="20" fill="#c0c0c0" />
    <rect x="2" y="3" width="28" height="1" fill="#fff" />
    <rect x="2" y="3" width="1" height="20" fill="#fff" />
    <rect x="29" y="3" width="1" height="20" fill="#808080" />
    <rect x="2" y="22" width="28" height="1" fill="#808080" />
    <rect x="4" y="5" width="24" height="16" fill="#000" />
    <rect x="5" y="6" width="22" height="14" fill="#008080" />
    <rect x="10" y="9" width="4" height="4" fill="#ffff00" />
    <rect x="16" y="11" width="6" height="2" fill="#fff" />
    <rect x="10" y="24" width="12" height="2" fill="#808080" />
    <rect x="6" y="26" width="20" height="3" fill="#c0c0c0" />
    <rect x="6" y="26" width="20" height="1" fill="#fff" />
    <rect x="6" y="28" width="20" height="1" fill="#808080" />
    <rect x="14" y="27" width="4" height="1" fill="#00aa00" />
  </svg>
);

// ─── FOLDER (CLOSED) ──────────────────────────────────────────
export const IconFolder = ({ size = 32 }: IconProps) => (
  <svg width={size} height={size} viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg">
    <rect x="1" y="7" width="12" height="4" fill="#808000" />
    <rect x="1" y="7" width="12" height="1" fill="#ffff80" />
    <rect x="1" y="10" width="30" height="18" fill="#ffff00" />
    <rect x="1" y="10" width="30" height="1" fill="#ffff80" />
    <rect x="1" y="10" width="1" height="18" fill="#ffff80" />
    <rect x="30" y="10" width="1" height="18" fill="#808000" />
    <rect x="1" y="27" width="30" height="1" fill="#808000" />
  </svg>
);

// ─── FOLDER (OPEN) ────────────────────────────────────────────
export const IconFolderOpen = ({ size = 32 }: IconProps) => (
  <svg width={size} height={size} viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg">
    <rect x="1" y="7" width="12" height="4" fill="#808000" />
    <rect x="1" y="7" width="12" height="1" fill="#ffff80" />
    <rect x="1" y="10" width="26" height="18" fill="#ffff00" />
    <rect x="1" y="10" width="26" height="1" fill="#ffff80" />
    <rect x="5" y="14" width="26" height="14" fill="#ffff00" />
    <rect x="5" y="14" width="26" height="1" fill="#ffff80" />
    <rect x="30" y="14" width="1" height="14" fill="#808000" />
    <rect x="5" y="27" width="26" height="1" fill="#808000" />
  </svg>
);

// ─── NOTEPAD / TEXT FILE ──────────────────────────────────────
export const IconNotepad = ({ size = 32 }: IconProps) => (
  <svg width={size} height={size} viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg">
    <rect x="5" y="2" width="22" height="28" fill="#fff" />
    <rect x="5" y="2" width="22" height="1" fill="#808080" />
    <rect x="5" y="2" width="1" height="28" fill="#808080" />
    <rect x="26" y="2" width="1" height="28" fill="#000" />
    <rect x="5" y="29" width="22" height="1" fill="#000" />
    <rect x="5" y="2" width="14" height="3" fill="#000080" />
    <rect x="8" y="8" width="16" height="1" fill="#000" />
    <rect x="8" y="11" width="16" height="1" fill="#000" />
    <rect x="8" y="14" width="12" height="1" fill="#000" />
    <rect x="8" y="17" width="16" height="1" fill="#000" />
    <rect x="8" y="20" width="14" height="1" fill="#000" />
    <rect x="8" y="23" width="16" height="1" fill="#000" />
    <rect x="8" y="26" width="8" height="1" fill="#000" />
  </svg>
);

// ─── MAIL / INBOX ─────────────────────────────────────────────
export const IconMail = ({ size = 32 }: IconProps) => (
  <svg width={size} height={size} viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg">
    <rect x="1" y="6" width="30" height="20" fill="#fff" />
    <rect x="1" y="6" width="30" height="1" fill="#c0c0c0" />
    <rect x="1" y="6" width="1" height="20" fill="#c0c0c0" />
    <rect x="30" y="6" width="1" height="20" fill="#808080" />
    <rect x="1" y="25" width="30" height="1" fill="#808080" />
    <polygon points="1,6 16,18 31,6 31,9 16,21 1,9" fill="#000080" />
    <polygon points="1,6 16,18 31,6 31,7 16,19 1,7" fill="#0000ff" />
  </svg>
);

// ─── WORDPAD / DOC ────────────────────────────────────────────
export const IconWordpad = ({ size = 32 }: IconProps) => (
  <svg width={size} height={size} viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg">
    <rect x="3" y="2" width="22" height="28" fill="#fff" />
    <rect x="3" y="2" width="1" height="28" fill="#808080" />
    <rect x="24" y="2" width="1" height="28" fill="#000" />
    <rect x="3" y="2" width="22" height="1" fill="#808080" />
    <rect x="3" y="29" width="22" height="1" fill="#000" />
    <rect x="6" y="5" width="16" height="3" fill="#000080" />
    <text x="7" y="7.5" fill="#fff" fontSize="5" fontFamily="sans-serif" fontWeight="bold">WordPad</text>
    <rect x="6" y="10" width="16" height="1" fill="#000" />
    <rect x="6" y="13" width="12" height="1" fill="#000" />
    <rect x="6" y="16" width="16" height="1" fill="#000" />
    <rect x="6" y="19" width="14" height="1" fill="#000" />
    <rect x="6" y="22" width="16" height="1" fill="#000" />
    <rect x="25" y="3" width="6" height="9" fill="#0000ff" />
    <rect x="26" y="4" width="4" height="7" fill="#000080" />
    <text x="26" y="10" fill="#fff" fontSize="8" fontFamily="serif" fontWeight="bold">W</text>
  </svg>
);

// ─── RECYCLE BIN (EMPTY) ──────────────────────────────────────
export const IconRecycleBin = ({ size = 32 }: IconProps) => (
  <svg width={size} height={size} viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg">
    <rect x="9" y="8" width="14" height="20" fill="#c0c0c0" />
    <rect x="9" y="8" width="14" height="1" fill="#fff" />
    <rect x="9" y="8" width="1" height="20" fill="#fff" />
    <rect x="22" y="8" width="1" height="20" fill="#808080" />
    <rect x="9" y="27" width="14" height="1" fill="#808080" />
    <rect x="10" y="5" width="12" height="4" fill="#808080" />
    <rect x="10" y="5" width="12" height="1" fill="#fff" />
    <rect x="13" y="3" width="6" height="3" fill="#808080" />
    <rect x="13" y="3" width="6" height="1" fill="#fff" />
    <rect x="12" y="11" width="1" height="13" fill="#808080" />
    <rect x="16" y="11" width="1" height="13" fill="#808080" />
    <rect x="20" y="11" width="1" height="13" fill="#808080" />
  </svg>
);

// ─── RECYCLE BIN (FULL) ───────────────────────────────────────
export const IconRecycleBinFull = ({ size = 32 }: IconProps) => (
  <svg width={size} height={size} viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg">
    <rect x="9" y="8" width="14" height="20" fill="#c0c0c0" />
    <rect x="9" y="8" width="14" height="1" fill="#fff" />
    <rect x="9" y="8" width="1" height="20" fill="#fff" />
    <rect x="22" y="8" width="1" height="20" fill="#808080" />
    <rect x="9" y="27" width="14" height="1" fill="#808080" />
    <rect x="10" y="5" width="12" height="4" fill="#808080" />
    <rect x="10" y="5" width="12" height="1" fill="#fff" />
    <rect x="13" y="3" width="6" height="3" fill="#808080" />
    <rect x="13" y="3" width="6" height="1" fill="#fff" />
    <rect x="11" y="10" width="3" height="3" fill="#ffff00" />
    <rect x="15" y="9" width="4" height="2" fill="#fff" />
    <rect x="20" y="10" width="2" height="4" fill="#0000ff" />
    <rect x="12" y="14" width="1" height="11" fill="#808080" />
    <rect x="16" y="14" width="1" height="11" fill="#808080" />
    <rect x="20" y="14" width="1" height="11" fill="#808080" />
  </svg>
);

// ─── USER / PERSON ────────────────────────────────────────────
export const IconUser = ({ size = 32 }: IconProps) => (
  <svg width={size} height={size} viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg">
    <rect x="3" y="3" width="26" height="26" fill="#008080" />
    <rect x="3" y="3" width="26" height="1" fill="#00aaaa" />
    <rect x="3" y="3" width="1" height="26" fill="#00aaaa" />
    <rect x="28" y="3" width="1" height="26" fill="#006060" />
    <rect x="3" y="28" width="26" height="1" fill="#006060" />
    <circle cx="16" cy="11" r="5" fill="#ffff00" stroke="#000" strokeWidth="1" />
    <ellipse cx="16" cy="26" rx="9" ry="6" fill="#ffff00" stroke="#000" strokeWidth="1" />
    <rect x="13" y="9" width="2" height="2" fill="#000" />
    <rect x="17" y="9" width="2" height="2" fill="#000" />
    <rect x="14" y="13" width="4" height="1" fill="#000" />
  </svg>
);

// ─── WINDOWS FLAG (Start Button) ──────────────────────────────
export const WinFlag = ({ size = 16 }: IconProps) => {
  const scale = size / 16;
  return (
    <svg width={size} height={Math.round(14 * scale)} viewBox="0 0 16 14" fill="none" xmlns="http://www.w3.org/2000/svg">
      <rect x="1" y="0" width="6" height="6" fill="#ff0000" rx="0" />
      <rect x="9" y="0" width="6" height="6" fill="#0000ff" rx="0" />
      <rect x="1" y="8" width="6" height="6" fill="#008000" rx="0" />
      <rect x="9" y="8" width="6" height="6" fill="#ffff00" rx="0" />
      <rect x="7" y="0" width="2" height="14" fill="#c0c0c0" />
      <rect x="1" y="6" width="14" height="2" fill="#c0c0c0" />
      <rect x="0" y="0" width="1" height="14" fill="#000" />
    </svg>
  );
};

// ─── HELP BOOK ────────────────────────────────────────────────
export const IconHelp = ({ size = 32 }: IconProps) => (
  <svg width={size} height={size} viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg">
    <rect x="4" y="4" width="20" height="24" fill="#ffff00" />
    <rect x="4" y="4" width="1" height="24" fill="#808000" />
    <rect x="23" y="4" width="1" height="24" fill="#808000" />
    <rect x="4" y="27" width="20" height="1" fill="#808000" />
    <rect x="6" y="4" width="2" height="24" fill="#808000" />
    <circle cx="15" cy="14" r="4" fill="none" stroke="#800080" strokeWidth="2" />
    <rect x="14" y="19" width="2" height="2" fill="#800080" />
    <rect x="14" y="23" width="2" height="2" fill="#800080" />
  </svg>
);

// ─── SETTINGS / CONTROL PANEL ─────────────────────────────────
export const IconSettings = ({ size = 32 }: IconProps) => (
  <svg width={size} height={size} viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg">
    <rect x="4" y="4" width="24" height="24" fill="#c0c0c0" />
    <rect x="4" y="4" width="24" height="1" fill="#fff" />
    <rect x="4" y="4" width="1" height="24" fill="#fff" />
    <rect x="27" y="4" width="1" height="24" fill="#808080" />
    <rect x="4" y="27" width="24" height="1" fill="#808080" />
    <rect x="8" y="8" width="6" height="6" fill="#0000ff" />
    <rect x="18" y="8" width="6" height="6" fill="#ff0000" />
    <rect x="8" y="18" width="6" height="6" fill="#008000" />
    <rect x="18" y="18" width="6" height="6" fill="#ffff00" />
  </svg>
);

// ─── FIND / SEARCH ────────────────────────────────────────────
export const IconFind = ({ size = 32 }: IconProps) => (
  <svg width={size} height={size} viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg">
    <circle cx="13" cy="13" r="8" fill="#fff" stroke="#000" strokeWidth="2" />
    <circle cx="13" cy="13" r="5" fill="#c0c0c0" />
    <rect x="19" y="19" width="10" height="4" fill="#808080" transform="rotate(-45 19 19)" />
    <rect x="20" y="20" width="8" height="2" fill="#c0c0c0" transform="rotate(-45 20 20)" />
  </svg>
);

// ─── PROGRAMS / MONITOR ───────────────────────────────────────
export const IconPrograms = ({ size = 32 }: IconProps) => (
  <svg width={size} height={size} viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg">
    <rect x="2" y="4" width="28" height="18" fill="#c0c0c0" />
    <rect x="2" y="4" width="28" height="1" fill="#fff" />
    <rect x="2" y="4" width="1" height="18" fill="#fff" />
    <rect x="4" y="6" width="24" height="14" fill="#000080" />
    <rect x="5" y="7" width="22" height="12" fill="#008080" />
    <rect x="7" y="9" width="4" height="4" fill="#ffff00" />
    <rect x="13" y="9" width="4" height="4" fill="#ff0000" />
    <rect x="19" y="9" width="4" height="4" fill="#0000ff" />
    <rect x="12" y="22" width="8" height="2" fill="#808080" />
    <rect x="8" y="24" width="16" height="2" fill="#c0c0c0" />
    <rect x="8" y="24" width="16" height="1" fill="#fff" />
  </svg>
);

// ─── RUN ──────────────────────────────────────────────────────
export const IconRun = ({ size = 32 }: IconProps) => (
  <svg width={size} height={size} viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg">
    <rect x="2" y="6" width="28" height="18" fill="#c0c0c0" />
    <rect x="2" y="6" width="28" height="1" fill="#fff" />
    <rect x="2" y="6" width="1" height="18" fill="#fff" />
    <rect x="29" y="6" width="1" height="18" fill="#808080" />
    <rect x="2" y="23" width="28" height="1" fill="#808080" />
    <rect x="4" y="8" width="24" height="14" fill="#000" />
    <text x="6" y="16" fill="#c0c0c0" fontSize="8" fontFamily="monospace">C:\&gt;_</text>
    <rect x="2" y="25" width="28" height="3" fill="#c0c0c0" />
    <rect x="2" y="25" width="28" height="1" fill="#fff" />
  </svg>
);

// ─── SHUTDOWN ─────────────────────────────────────────────────
export const IconShutdown = ({ size = 32 }: IconProps) => (
  <svg width={size} height={size} viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg">
    <circle cx="16" cy="16" r="12" fill="#ff0000" stroke="#800000" strokeWidth="2" />
    <rect x="15" y="6" width="2" height="10" fill="#fff" />
    <circle cx="16" cy="16" r="6" fill="none" stroke="#fff" strokeWidth="2" />
  </svg>
);

// ─── INTERNET EXPLORER ────────────────────────────────────────
export const IconIE = ({ size = 32 }: IconProps) => (
  <svg width={size} height={size} viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg">
    <circle cx="16" cy="16" r="13" fill="#0078d4" />
    <circle cx="16" cy="16" r="11" fill="#00a2ed" />
    <ellipse cx="16" cy="16" rx="13" ry="5" fill="none" stroke="#fff" strokeWidth="2" />
    <ellipse cx="16" cy="16" rx="5" ry="11" fill="none" stroke="#fff" strokeWidth="1" />
    <rect x="3" y="15" width="26" height="2" fill="#fff" />
    <text x="11" y="20" fill="#fff" fontSize="10" fontWeight="bold" fontFamily="serif">e</text>
  </svg>
);

// ─── MINESWEEPER ──────────────────────────────────────────────
export const IconMinesweeper = ({ size = 32 }: IconProps) => (
  <svg width={size} height={size} viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg">
    <rect x="2" y="2" width="28" height="28" fill="#c0c0c0" />
    <rect x="2" y="2" width="28" height="1" fill="#fff" />
    <rect x="2" y="2" width="1" height="28" fill="#fff" />
    <rect x="29" y="2" width="1" height="28" fill="#808080" />
    <rect x="2" y="29" width="28" height="1" fill="#808080" />
    <circle cx="16" cy="16" r="6" fill="#000" />
    <rect x="15" y="6" width="2" height="20" fill="#000" />
    <rect x="6" y="15" width="20" height="2" fill="#000" />
    <rect x="9" y="9" width="2" height="2" fill="#000" />
    <rect x="21" y="9" width="2" height="2" fill="#000" />
    <rect x="9" y="21" width="2" height="2" fill="#000" />
    <rect x="21" y="21" width="2" height="2" fill="#000" />
    <circle cx="14" cy="14" r="2" fill="#fff" />
  </svg>
);

// ─── PAINT ────────────────────────────────────────────────────
export const IconPaint = ({ size = 32 }: IconProps) => (
  <svg width={size} height={size} viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg">
    <rect x="3" y="3" width="26" height="26" fill="#fff" />
    <rect x="3" y="3" width="26" height="1" fill="#808080" />
    <rect x="3" y="3" width="1" height="26" fill="#808080" />
    <rect x="28" y="3" width="1" height="26" fill="#000" />
    <rect x="3" y="28" width="26" height="1" fill="#000" />
    <rect x="6" y="22" width="3" height="3" fill="#ff0000" />
    <rect x="10" y="22" width="3" height="3" fill="#00ff00" />
    <rect x="14" y="22" width="3" height="3" fill="#0000ff" />
    <rect x="18" y="22" width="3" height="3" fill="#ffff00" />
    <rect x="22" y="22" width="3" height="3" fill="#ff00ff" />
    <rect x="8" y="6" width="2" height="14" fill="#808080" transform="rotate(-20 8 6)" />
    <rect x="7" y="17" width="3" height="3" fill="#ff0000" transform="rotate(-20 7 17)" />
  </svg>
);

// ─── SOLITAIRE ────────────────────────────────────────────────
export const IconSolitaire = ({ size = 32 }: IconProps) => (
  <svg width={size} height={size} viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg">
    <rect x="4" y="2" width="18" height="24" rx="0" fill="#fff" stroke="#000" strokeWidth="1" />
    <rect x="10" y="6" width="18" height="24" rx="0" fill="#fff" stroke="#000" strokeWidth="1" />
    <text x="12" y="18" fill="#ff0000" fontSize="12" fontWeight="bold" fontFamily="serif">A</text>
    <text x="19" y="14" fill="#ff0000" fontSize="8" fontFamily="serif">♥</text>
  </svg>
);

// ─── INFO ICON (for dialogs) ──────────────────────────────────
export const IconInfo = ({ size = 32 }: IconProps) => (
  <svg width={size} height={size} viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg">
    <circle cx="16" cy="16" r="14" fill="#fff" stroke="#000080" strokeWidth="2" />
    <circle cx="16" cy="16" r="12" fill="#000080" />
    <text x="13" y="22" fill="#fff" fontSize="18" fontWeight="bold" fontFamily="serif">i</text>
  </svg>
);

// ─── WARNING ICON ─────────────────────────────────────────────
export const IconWarning = ({ size = 32 }: IconProps) => (
  <svg width={size} height={size} viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg">
    <polygon points="16,2 30,28 2,28" fill="#ffff00" stroke="#000" strokeWidth="1" />
    <text x="13" y="25" fill="#000" fontSize="16" fontWeight="bold" fontFamily="sans-serif">!</text>
  </svg>
);

// ─── ERROR ICON ───────────────────────────────────────────────
export const IconError = ({ size = 32 }: IconProps) => (
  <svg width={size} height={size} viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg">
    <circle cx="16" cy="16" r="14" fill="#ff0000" stroke="#800000" strokeWidth="2" />
    <rect x="9" y="14" width="14" height="4" fill="#fff" transform="rotate(-45 16 16)" />
    <rect x="9" y="14" width="14" height="4" fill="#fff" transform="rotate(45 16 16)" />
  </svg>
);

// ─── CLIPBOARD ────────────────────────────────────────────────
export const IconClipboard = ({ size = 16 }: IconProps) => (
  <svg width={size} height={size} viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
    <rect x="2" y="3" width="12" height="12" fill="#ffff00" />
    <rect x="2" y="3" width="12" height="1" fill="#fff" />
    <rect x="5" y="1" width="6" height="3" fill="#808080" />
    <rect x="4" y="7" width="8" height="1" fill="#000" />
    <rect x="4" y="9" width="8" height="1" fill="#000" />
    <rect x="4" y="11" width="6" height="1" fill="#000" />
  </svg>
);

// ─── CALCULATOR ───────────────────────────────────────────────
export const IconCalculator = ({ size = 32 }: IconProps) => (
  <svg width={size} height={size} viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg">
    <rect x="6" y="2" width="20" height="28" fill="#c0c0c0" />
    <rect x="6" y="2" width="20" height="1" fill="#fff" />
    <rect x="6" y="2" width="1" height="28" fill="#fff" />
    <rect x="25" y="2" width="1" height="28" fill="#808080" />
    <rect x="6" y="29" width="20" height="1" fill="#808080" />
    <rect x="8" y="4" width="16" height="6" fill="#8fbc8f" />
    <rect x="8" y="4" width="16" height="1" fill="#000" />
    <rect x="8" y="4" width="1" height="6" fill="#000" />
    <rect x="8" y="12" width="4" height="3" fill="#fff" stroke="#808080" strokeWidth="0.5" />
    <rect x="14" y="12" width="4" height="3" fill="#fff" stroke="#808080" strokeWidth="0.5" />
    <rect x="20" y="12" width="4" height="3" fill="#fff" stroke="#808080" strokeWidth="0.5" />
    <rect x="8" y="17" width="4" height="3" fill="#fff" stroke="#808080" strokeWidth="0.5" />
    <rect x="14" y="17" width="4" height="3" fill="#fff" stroke="#808080" strokeWidth="0.5" />
    <rect x="20" y="17" width="4" height="3" fill="#fff" stroke="#808080" strokeWidth="0.5" />
    <rect x="8" y="22" width="4" height="3" fill="#fff" stroke="#808080" strokeWidth="0.5" />
    <rect x="14" y="22" width="4" height="3" fill="#fff" stroke="#808080" strokeWidth="0.5" />
    <rect x="20" y="22" width="4" height="6" fill="#808080" />
  </svg>
);

// ─── COMMAND PROMPT / MS-DOS ──────────────────────────────────
export const IconCMD = ({ size = 32 }: IconProps) => (
  <svg width={size} height={size} viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg">
    <rect x="2" y="2" width="28" height="28" fill="#000" />
    <rect x="2" y="2" width="28" height="1" fill="#808080" />
    <rect x="2" y="2" width="1" height="28" fill="#808080" />
    <rect x="29" y="2" width="1" height="28" fill="#fff" />
    <rect x="2" y="29" width="28" height="1" fill="#fff" />
    <text x="4" y="12" fill="#c0c0c0" fontSize="7" fontFamily="monospace">C:\&gt;</text>
    <text x="4" y="20" fill="#c0c0c0" fontSize="7" fontFamily="monospace">dir /w</text>
    <rect x="4" y="22" width="6" height="1" fill="#c0c0c0" />
    <rect x="22" y="24" width="4" height="2" fill="#c0c0c0" />
  </svg>
);

// ─── DEFRAG ───────────────────────────────────────────────────
export const IconDefrag = ({ size = 32 }: IconProps) => (
  <svg width={size} height={size} viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg">
    <rect x="2" y="2" width="28" height="28" fill="#c0c0c0" />
    <rect x="2" y="2" width="28" height="1" fill="#fff" />
    <rect x="2" y="2" width="1" height="28" fill="#fff" />
    <rect x="29" y="2" width="1" height="28" fill="#808080" />
    <rect x="2" y="29" width="28" height="1" fill="#808080" />
    <rect x="4" y="4" width="4" height="4" fill="#0000ff" />
    <rect x="9" y="4" width="4" height="4" fill="#0000ff" />
    <rect x="14" y="4" width="4" height="4" fill="#ff0000" />
    <rect x="19" y="4" width="4" height="4" fill="#0000ff" />
    <rect x="24" y="4" width="4" height="4" fill="#fff" />
    <rect x="4" y="9" width="4" height="4" fill="#ff0000" />
    <rect x="9" y="9" width="4" height="4" fill="#fff" />
    <rect x="14" y="9" width="4" height="4" fill="#0000ff" />
    <rect x="19" y="9" width="4" height="4" fill="#0000ff" />
    <rect x="24" y="9" width="4" height="4" fill="#ff0000" />
    <rect x="4" y="14" width="4" height="4" fill="#0000ff" />
    <rect x="9" y="14" width="4" height="4" fill="#0000ff" />
    <rect x="14" y="14" width="4" height="4" fill="#0000ff" />
    <rect x="19" y="14" width="4" height="4" fill="#fff" />
    <rect x="24" y="14" width="4" height="4" fill="#0000ff" />
    <rect x="4" y="24" width="24" height="4" fill="#000080" />
    <rect x="4" y="24" width="12" height="4" fill="#00aa00" />
  </svg>
);

// ─── MEDIA PLAYER ─────────────────────────────────────────────
export const IconMediaPlayer = ({ size = 32 }: IconProps) => (
  <svg width={size} height={size} viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg">
    <rect x="3" y="4" width="26" height="24" fill="#c0c0c0" />
    <rect x="3" y="4" width="26" height="1" fill="#fff" />
    <rect x="3" y="4" width="1" height="24" fill="#fff" />
    <rect x="28" y="4" width="1" height="24" fill="#808080" />
    <rect x="3" y="27" width="26" height="1" fill="#808080" />
    <rect x="5" y="6" width="22" height="14" fill="#000" />
    <polygon points="13,9 13,17 21,13" fill="#00ff00" />
    <rect x="5" y="22" width="22" height="4" fill="#404040" />
    <rect x="7" y="23" width="4" height="2" fill="#808080" />
    <rect x="13" y="23" width="4" height="2" fill="#808080" />
    <rect x="19" y="23" width="4" height="2" fill="#808080" />
  </svg>
);

// ─── CLIPPY (the paperclip assistant) ─────────────────────────
export const IconClippy = ({ size = 48 }: IconProps) => (
  <svg width={size} height={size} viewBox="0 0 48 64" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path d="M20 58 L20 20 Q20 8 28 8 Q36 8 36 20 L36 44 Q36 52 28 52 Q24 52 24 44 L24 24"
      fill="none" stroke="#808080" strokeWidth="4" strokeLinecap="round" />
    <path d="M20 58 L20 20 Q20 8 28 8 Q36 8 36 20 L36 44 Q36 52 28 52 Q24 52 24 44 L24 24"
      fill="none" stroke="#c0c0c0" strokeWidth="2" strokeLinecap="round" />
    <circle cx="22" cy="18" r="3" fill="#fff" stroke="#000" strokeWidth="1" />
    <circle cx="30" cy="18" r="3" fill="#fff" stroke="#000" strokeWidth="1" />
    <circle cx="23" cy="17" r="1.5" fill="#000" />
    <circle cx="31" cy="17" r="1.5" fill="#000" />
    <line x1="19" y1="13" x2="24" y2="14" stroke="#000" strokeWidth="1" />
    <line x1="28" y1="14" x2="33" y2="13" stroke="#000" strokeWidth="1" />
  </svg>
);// --- NEW RETRO SVGS FOR EMOJIS -----------------------------
export const IconBeer = ({ size = 32 }: IconProps) => (
  <svg width={size} height={size} viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg">
    <rect x="7" y="10" width="16" height="18" fill="#e6b800" stroke="#000" strokeWidth="2" />
    <rect x="23" y="12" width="6" height="12" fill="none" stroke="#000" strokeWidth="2" />
    <path d="M5 10 Q14 4 25 10" fill="#fff" stroke="#000" strokeWidth="2" />
    <rect x="10" y="12" width="2" height="14" fill="#ffcc00" />
    <rect x="14" y="12" width="2" height="14" fill="#ffcc00" />
    <rect x="18" y="12" width="2" height="14" fill="#ffcc00" />
  </svg>
);

export const IconMap = ({ size = 32 }: IconProps) => (
  <svg width={size} height={size} viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg">
    <rect x="2" y="4" width="28" height="24" fill="#e0e0e0" stroke="#000" strokeWidth="2" />
    <path d="M10 4 L10 28 M20 4 L20 28" stroke="#000" strokeWidth="2" />
    <path d="M2 14 L10 10 M10 10 L20 16 M20 16 L30 12" stroke="#404040" strokeWidth="2" strokeDasharray="2,2" />
    <circle cx="20" cy="16" r="3" fill="#ff0000" />
  </svg>
);

export const IconRobot = ({ size = 32 }: IconProps) => (
  <svg width={size} height={size} viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg">
    <rect x="6" y="8" width="20" height="18" fill="#c0c0c0" stroke="#000" strokeWidth="2" />
    <rect x="10" y="12" width="4" height="4" fill="#ff0000" />
    <rect x="18" y="12" width="4" height="4" fill="#ff0000" />
    <rect x="10" y="20" width="12" height="2" fill="#000" />
    <rect x="14" y="4" width="4" height="4" fill="#808080" />
    <circle cx="16" cy="3" r="2" fill="#ffcc00" />
    <rect x="2" y="14" width="4" height="6" fill="#808080" stroke="#000" strokeWidth="1" />
    <rect x="26" y="14" width="4" height="6" fill="#808080" stroke="#000" strokeWidth="1" />
  </svg>
);

export const IconChip = ({ size = 32 }: IconProps) => (
  <svg width={size} height={size} viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg">
    <rect x="6" y="6" width="20" height="20" fill="#404040" stroke="#000" strokeWidth="2" />
    <path d="M3 10h3 M3 16h3 M3 22h3" stroke="#c0c0c0" strokeWidth="2" />
    <path d="M26 10h3 M26 16h3 M26 22h3" stroke="#c0c0c0" strokeWidth="2" />
    <path d="M10 3v3 M16 3v3 M22 3v3" stroke="#c0c0c0" strokeWidth="2" />
    <path d="M10 26v3 M16 26v3 M22 26v3" stroke="#c0c0c0" strokeWidth="2" />
    <rect x="10" y="10" width="12" height="12" fill="#000" />
    <rect x="12" y="12" width="8" height="8" fill="#000080" />
  </svg>
);

export const IconTrain = ({ size = 32 }: IconProps) => (
  <svg width={size} height={size} viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg">
    <rect x="6" y="10" width="12" height="14" fill="#000080" stroke="#000" strokeWidth="2" />
    <rect x="18" y="14" width="10" height="10" fill="#ff0000" stroke="#000" strokeWidth="2" />
    <circle cx="10" cy="26" r="3" fill="#808080" stroke="#000" strokeWidth="1.5" />
    <circle cx="16" cy="26" r="3" fill="#808080" stroke="#000" strokeWidth="1.5" />
    <circle cx="24" cy="26" r="3" fill="#808080" stroke="#000" strokeWidth="1.5" />
    <rect x="22" y="8" width="4" height="6" fill="#808080" stroke="#000" strokeWidth="2" />
    <rect x="8" y="12" width="6" height="6" fill="#00ffff" />
    <path d="M4 24h24" stroke="#000" strokeWidth="2" />
  </svg>
);

export const IconChat = ({ size = 32 }: IconProps) => (
  <svg width={size} height={size} viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path d="M4 8 h24 v14 h-6 l-6 6 v-6 h-12 z" fill="#fff" stroke="#000" strokeWidth="2" />
    <rect x="8" y="12" width="16" height="2" fill="#404040" />
    <rect x="8" y="16" width="10" height="2" fill="#404040" />
  </svg>
);

export const IconGlobe = ({ size = 32 }: IconProps) => (
  <svg width={size} height={size} viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg">
    <circle cx="16" cy="16" r="14" fill="#00ffff" stroke="#000" strokeWidth="2" />
    <path d="M16 2 a14 14 0 0 1 0 28 a14 14 0 0 1 0 -28" stroke="#000" strokeWidth="1" />
    <path d="M16 2 c 6 0, 10 6, 10 14 c 0 8, -4 14, -10 14 c -6 0, -10 -6, -10 -14 c 0 -8, 4 -14, 10 -14" stroke="#000" strokeWidth="2" fill="none" />
    <path d="M2 16 h28 M5 10 h22 M5 22 h22" stroke="#000" strokeWidth="2" />
  </svg>
);

export const IconVolume = ({ size = 32 }: IconProps) => (
  <svg width={size} height={size} viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg">
    <polygon points="12,12 12,20 6,20 6,12" fill="#c0c0c0" stroke="#000" strokeWidth="2" />
    <polygon points="12,12 20,6 20,26 12,20" fill="#c0c0c0" stroke="#000" strokeWidth="2" />
    <path d="M24 10 A 8 8 0 0 1 24 22" stroke="#000" strokeWidth="2" fill="none" />
    <path d="M27 7 A 13 13 0 0 1 27 25" stroke="#000" strokeWidth="2" fill="none" />
  </svg>
);

export const IconPrinter = ({ size = 32 }: IconProps) => (
  <svg width={size} height={size} viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg">
    <rect x="8" y="4" width="16" height="8" fill="#fff" stroke="#000" strokeWidth="2" />
    <rect x="10" y="6" width="12" height="1" fill="#404040" />
    <rect x="10" y="8" width="8" height="1" fill="#404040" />
    <rect x="4" y="12" width="24" height="10" fill="#c0c0c0" stroke="#000" strokeWidth="2" />
    <rect x="10" y="22" width="12" height="6" fill="#fff" stroke="#000" strokeWidth="2" />
    <rect x="12" y="24" width="8" height="1" fill="#404040" />
    <rect x="12" y="26" width="6" height="1" fill="#404040" />
    <circle cx="8" cy="17" r="1.5" fill="#00ff00" />
    <circle cx="24" cy="17" r="1.5" fill="#ff0000" />
  </svg>
);

export const IconFloppy = ({ size = 32 }: IconProps) => (
  <svg width={size} height={size} viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path d="M4 4 h18 l6 6 v18 h-24 z" fill="#000080" stroke="#000" strokeWidth="2" />
    <rect x="8" y="4" width="14" height="8" fill="#fff" />
    <rect x="18" y="5" width="2" height="6" fill="#000" />
    <rect x="8" y="16" width="16" height="12" fill="#fff" stroke="#000" strokeWidth="1" />
    <rect x="10" y="18" width="12" height="2" fill="#404040" />
    <rect x="10" y="22" width="12" height="2" fill="#404040" />
  </svg>
);

export const IconGithub = ({ size = 32 }: IconProps) => (
  <svg width={size} height={size} viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg">
    <circle cx="16" cy="16" r="14" fill="#000" />
    <path d="M16 4 C 10 4, 6 9, 6 15 C 6 20, 9 24, 14 26 C 14.5 26, 15 25.5, 15 24.5 L 15 22 C 12 22.5, 11 20.5, 11 20.5 C 10.5 19, 9.5 18.5, 9.5 18.5 C 8.5 18, 9.8 18, 9.8 18 C 11 18, 11.5 19, 11.5 19 C 12.5 21, 14.5 20.5, 15.5 20 C 15.5 19, 16 18.5, 16.5 18 C 13.5 18, 10.5 16.5, 10.5 12 C 10.5 10.5, 11 9.5, 12 8.5 C 11.8 8, 11.5 6.5, 12 5 C 12 5, 13 4.5, 16 6.5 C 17 6.2, 18 6.2, 19 6.5 C 22 4.5, 23 5, 23 5 C 23.5 6.5, 23.2 8, 23 8.5 C 24 9.5, 24.5 10.5, 24.5 12 C 24.5 16.5, 21.5 18, 18.5 18 C 19 18.5, 19.5 19.5, 19.5 20.5 L 19.5 24.5 C 19.5 25.5, 20 26, 20.5 26 C 25.5 24, 28 19.5, 28 15 C 28 9, 23 4, 16 4 Z" fill="#fff" />
  </svg>
);
export const IconHome = ({ size = 32 }: IconProps) => (
  <svg width={size} height={size} viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg">
    <polygon points="16,4 4,14 8,14 8,26 24,26 24,14 28,14" fill="#000080" />
    <polygon points="16,6 6,14 10,14 10,24 22,24 22,14 26,14" fill="#fff" />
    <rect x="14" y="16" width="4" height="8" fill="#000" />
  </svg>
);

export const IconRefresh = ({ size = 32 }: IconProps) => (
  <svg width={size} height={size} viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path d="M16 6 A 10 10 0 1 1 6 16" stroke="#000" strokeWidth="3" fill="none" />
    <polygon points="16,1 16,11 10,6" fill="#000" />
  </svg>
);

export const IconStar = ({ size = 32 }: IconProps) => (
  <svg width={size} height={size} viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg">
    <polygon points="16,2 20,12 30,12 22,18 25,28 16,22 7,28 10,18 2,12 12,12" fill="#ffff00" stroke="#000" strokeWidth="2" />
  </svg>
);
