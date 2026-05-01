import React, { useState, useRef, useEffect } from 'react';

// ═══════════════════════════════════════════════════════════════
//  MS-DOS COMMAND PROMPT — Real terminal with commands!
// ═══════════════════════════════════════════════════════════════

const FILESYSTEM: Record<string, string[]> = {
  'C:\\': ['WINDOWS', 'Program Files', 'My Documents', 'Games', 'AUTOEXEC.BAT', 'CONFIG.SYS', 'COMMAND.COM'],
  'C:\\WINDOWS': ['SYSTEM', 'SYSTEM32', 'Desktop', 'Start Menu', 'WIN.COM', 'NOTEPAD.EXE', 'CALC.EXE'],
  'C:\\Program Files': ['Internet Explorer', 'Microsoft Office', 'Accessories'],
  'C:\\My Documents': ['resume.doc', 'cover_letter.doc', 'skills.txt', 'todo.txt', 'secret_diary.txt'],
  'C:\\Games': ['DOOM', 'DUKE3D', 'QUAKE'],
  'C:\\Games\\DOOM': ['DOOM.EXE', 'DOOM.WAD', 'DEUSEX.BAT', 'README.TXT'],
};

const FILE_CONTENTS: Record<string, string> = {
  'AUTOEXEC.BAT': '@echo off\nPATH C:\\WINDOWS;C:\\WINDOWS\\COMMAND\nSET BLASTER=A220 I5 D1 T4\nSET MIDI=SYNTH:1 MAP:E\nLH C:\\MOUSE\\MOUSE.EXE\nLH SMARTDRV.EXE\necho Welcome to Adamos\' Computer!',
  'CONFIG.SYS': 'DEVICE=C:\\WINDOWS\\HIMEM.SYS\nDEVICE=C:\\WINDOWS\\EMM386.EXE NOEMS\nBUFFERS=20\nFILES=40\nDOS=HIGH,UMB\nLASTDRIVE=Z',
  'README.TXT': '========================================\n     DOOM - README FILE\n========================================\n\nTo start DOOM, type: DOOM.EXE\n\nIDDQD - God Mode\nIDKFA - All Weapons & Keys\nIDCLIP - No Clipping\nIDMUS## - Change Music\n\nRip and Tear!\n========================================',
  'resume.doc': '[WordPad Document]\n\nADAMOS LOVAT\nFull Stack Developer\nadamos@example.com\n\nSee the Resume.doc window for full version.',
  'skills.txt': 'Skills: JavaScript, TypeScript, React,\nNode.js, Python, C/C++, HTML, CSS,\nMS-DOS, Git, FrontPage 97, Notepad.exe',
  'todo.txt': '- [ ] Update portfolio\n- [ ] Learn Rust\n- [x] Build Win95 portfolio\n- [x] Add Clippy\n- [ ] Touch grass',
  'secret_diary.txt': 'Dear Diary,\n\nToday I spent 8 hours making a Windows 95\nportfolio instead of doing real work.\nNo regrets.\n\nAlso, I think Clippy is watching me.\n\n- Adamos',
};

const ASCII_ART = `
    ╔══════════════════════════════════════╗
    ║    Microsoft(R) Windows 95          ║
    ║    (C)Copyright Microsoft Corp      ║
    ║           1981-1995                 ║
    ╚══════════════════════════════════════╝
`;

const HELP_TEXT = `
Available commands:
  dir          List directory contents
  cd <dir>     Change directory
  type <file>  Display file contents
  cls          Clear screen
  help         Show this help
  ver          Show version
  date         Show current date
  time         Show current time
  echo <text>  Display text
  tree         Show directory tree
  color        Random terminal color
  ping <host>  Ping a host
  ipconfig     Show IP configuration
  mem          Show memory info
  format c:    (DON'T DO IT)
  exit         Close prompt
  doom         Launch DOOM
  matrix       Enter the Matrix
  cow          ???
`;

const COW = `
        \\   ^__^
         \\  (oo)\\_______
            (__)\\       )\\/\\
                ||----w |
                ||     ||
   "Moo. I'm a cow in your terminal."
`;

export function CMDContent({ onClose }: { onClose: () => void }) {
  const [lines, setLines] = useState<string[]>([
    ASCII_ART,
    'C:\\>',
  ]);
  const [input, setInput] = useState('');
  const [cwd, setCwd] = useState('C:\\');
  const [textColor, setTextColor] = useState('#c0c0c0');
  const [history, setHistory] = useState<string[]>([]);
  const [historyIndex, setHistoryIndex] = useState(-1);
  const scrollRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [lines]);

  useEffect(() => {
    inputRef.current?.focus();
  }, []);

  const addOutput = (text: string) => {
    setLines(prev => [...prev, text]);
  };

  const executeCommand = (raw: string) => {
    const trimmed = raw.trim();
    if (!trimmed) {
      addOutput(cwd + '>');
      return;
    }

    setHistory(prev => [...prev, trimmed]);
    setHistoryIndex(-1);
    addOutput(cwd + '>' + trimmed);

    const parts = trimmed.split(/\s+/);
    const cmd = parts[0].toLowerCase();
    const args = parts.slice(1).join(' ');

    switch (cmd) {
      case 'dir': {
        const files = FILESYSTEM[cwd];
        if (files) {
          addOutput(` Volume in drive C is ADAMOS`);
          addOutput(` Volume Serial Number is 1337-DEAD`);
          addOutput(``);
          addOutput(` Directory of ${cwd}`);
          addOutput(``);
          addOutput(`.              <DIR>       03-15-97  12:00a`);
          addOutput(`..             <DIR>       03-15-97  12:00a`);
          files.forEach(f => {
            const isDir = !f.includes('.');
            const size = isDir ? '<DIR>      ' : String(Math.floor(Math.random() * 99999 + 100)).padStart(10, ' ');
            addOutput(`${f.padEnd(15)}${size}  03-15-97  12:00a`);
          });
          addOutput(`        ${files.length} file(s)`);
        } else {
          addOutput('File Not Found');
        }
        break;
      }
      case 'cd': {
        if (!args || args === '\\') { setCwd('C:\\'); break; }
        if (args === '..') {
          const parts2 = cwd.split('\\').filter(Boolean);
          if (parts2.length > 1) {
            parts2.pop();
            const newPath = parts2.join('\\');
            setCwd(newPath.endsWith('\\') ? newPath : newPath + '\\');
          } else {
            setCwd('C:\\');
          }
          break;
        }
        const target = cwd + args;
        const targetSlash = target.endsWith('\\') ? target : target + '\\';
        const noSlash = target.endsWith('\\') ? target.slice(0, -1) : target;
        if (FILESYSTEM[target] || FILESYSTEM[targetSlash] || FILESYSTEM[noSlash]) {
          setCwd(targetSlash);
        } else {
          addOutput(`Invalid directory`);
        }
        break;
      }
      case 'type': {
        const content = FILE_CONTENTS[args] || FILE_CONTENTS[args.toUpperCase()];
        if (content) {
          addOutput(content);
        } else {
          addOutput(`File not found - ${args}`);
        }
        break;
      }
      case 'cls':
        setLines([]);
        break;
      case 'help':
        addOutput(HELP_TEXT);
        break;
      case 'ver':
        addOutput(`\nMicrosoft Windows 95 [Version 4.00.950]\n`);
        break;
      case 'date':
        addOutput(`Current date is ${new Date().toLocaleDateString()}`);
        break;
      case 'time':
        addOutput(`Current time is ${new Date().toLocaleTimeString()}`);
        break;
      case 'echo':
        addOutput(args || '');
        break;
      case 'tree':
        addOutput('C:\\');
        addOutput('├── WINDOWS');
        addOutput('│   ├── SYSTEM');
        addOutput('│   └── SYSTEM32');
        addOutput('├── Program Files');
        addOutput('│   ├── Internet Explorer');
        addOutput('│   └── Microsoft Office');
        addOutput('├── My Documents');
        addOutput('│   ├── resume.doc');
        addOutput('│   ├── skills.txt');
        addOutput('│   └── secret_diary.txt');
        addOutput('├── Games');
        addOutput('│   ├── DOOM');
        addOutput('│   ├── DUKE3D');
        addOutput('│   └── QUAKE');
        addOutput('├── AUTOEXEC.BAT');
        addOutput('└── CONFIG.SYS');
        break;
      case 'color':
        const colors = ['#00ff00', '#ff0000', '#ffff00', '#00ffff', '#ff00ff', '#c0c0c0', '#ff8000'];
        setTextColor(colors[Math.floor(Math.random() * colors.length)]);
        addOutput('Terminal color changed!');
        break;
      case 'ping': {
        const host = args || 'localhost';
        addOutput(`\nPinging ${host} with 32 bytes of data:\n`);
        for (let i = 0; i < 4; i++) {
          const ms = Math.floor(Math.random() * 200 + 10);
          addOutput(`Reply from ${host}: bytes=32 time=${ms}ms TTL=128`);
        }
        addOutput(`\nPing statistics for ${host}:`);
        addOutput(`    Packets: Sent = 4, Received = 4, Lost = 0 (0% loss)`);
        break;
      }
      case 'ipconfig':
        addOutput(`\nWindows 95 IP Configuration\n`);
        addOutput(`Ethernet adapter:`);
        addOutput(`   IP Address. . . . . . . . : 192.168.1.95`);
        addOutput(`   Subnet Mask . . . . . . . : 255.255.255.0`);
        addOutput(`   Default Gateway . . . . . : 192.168.1.1`);
        addOutput(`   DNS Server. . . . . . . . : 8.8.8.8`);
        addOutput(`   Connection Speed. . . . . : 56 kbps`);
        break;
      case 'mem':
        addOutput(`\nMemory Type        Total     Used      Free`);
        addOutput(`--------------  --------  --------  --------`);
        addOutput(`Conventional       640K      580K       60K`);
        addOutput(`Upper               0K        0K        0K`);
        addOutput(`Extended        15,360K   12,288K    3,072K`);
        addOutput(`--------------  --------  --------  --------`);
        addOutput(`Total memory    16,000K   12,868K    3,132K`);
        addOutput(`\n640K ought to be enough for anybody.`);
        break;
      case 'format':
        addOutput(`\n⚠️  WARNING: ALL DATA ON DRIVE C: WILL BE DESTROYED!`);
        addOutput(`Are you sure? (Y/N)`);
        addOutput(`\n...Just kidding! I can't format anything.`);
        addOutput(`This is a portfolio, not an actual computer. 😄`);
        break;
      case 'exit':
        onClose();
        return;
      case 'doom':
        addOutput(`\n🔥 DOOM v1.9 - id Software\n`);
        addOutput(`Loading DOOM.WAD...`);
        addOutput(`V_Init: allocate screens.`);
        addOutput(`M_LoadDefaults: Load system defaults.`);
        addOutput(`Z_Init: Init zone memory allocation.`);
        addOutput(`W_Init: Init WADfiles.`);
        addOutput(`\n⚠️  DOOM requires 4MB of RAM.`);
        addOutput(`Current free memory: 60K conventional.`);
        addOutput(`\nInsufficient memory. Try loading HIMEM.SYS`);
        addOutput(`\n(Try typing IDDQD on the desktop instead!)`);
        break;
      case 'matrix':
        addOutput(`\nWake up, Neo...`);
        addOutput(`The Matrix has you...`);
        addOutput(`Follow the white rabbit.`);
        addOutput(`\n01101000 01100101 01101100 01101100 01101111`);
        break;
      case 'cow':
      case 'cowsay':
        addOutput(COW);
        break;
      default:
        addOutput(`Bad command or file name - '${cmd}'`);
        addOutput(`Type 'help' for a list of commands.`);
    }

    addOutput(cwd + '>');
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      executeCommand(input);
      setInput('');
    } else if (e.key === 'ArrowUp') {
      e.preventDefault();
      if (history.length > 0) {
        const newIdx = historyIndex === -1 ? history.length - 1 : Math.max(0, historyIndex - 1);
        setHistoryIndex(newIdx);
        setInput(history[newIdx]);
      }
    } else if (e.key === 'ArrowDown') {
      e.preventDefault();
      if (historyIndex >= 0) {
        const newIdx = historyIndex + 1;
        if (newIdx >= history.length) {
          setHistoryIndex(-1);
          setInput('');
        } else {
          setHistoryIndex(newIdx);
          setInput(history[newIdx]);
        }
      }
    }
  };

  return (
    <div
      ref={scrollRef}
      onClick={() => inputRef.current?.focus()}
      style={{
        background: '#000', color: textColor, fontFamily: '"Courier New", monospace',
        fontSize: 12, padding: 4, height: '100%', overflow: 'auto',
        whiteSpace: 'pre-wrap', wordBreak: 'break-all', cursor: 'text',
        lineHeight: 1.3,
      }}
    >
      {lines.map((line, i) => (
        <div key={i}>{line}</div>
      ))}
      <div style={{ display: 'flex' }}>
        <input
          ref={inputRef}
          value={input}
          onChange={e => setInput(e.target.value)}
          onKeyDown={handleKeyDown}
          style={{
            background: 'transparent', border: 'none', outline: 'none',
            color: textColor, fontFamily: '"Courier New", monospace',
            fontSize: 12, flex: 1, padding: 0, caretColor: textColor,
          }}
          autoFocus
        />
      </div>
    </div>
  );
}
