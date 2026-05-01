Design a fully interactive Windows 95-style desktop portfolio website UI. This is a personal portfolio that looks and feels exactly like a real Windows 95 operating system running in a browser.

---

🖥️ DESKTOP ENVIRONMENT
- Teal/grey classic Windows 95 desktop background with a subtle tiled texture or wallpaper pattern
- Desktop icons arranged on the left side: "My Portfolio", "Projects", "About Me", "Contact", "Recycle Bin", "My Resume.doc", "Skills.txt"
- Each icon uses pixel-art style 32x32 icons matching the original Win95 icon aesthetic
- Icons are selectable/highlighted on hover with a dotted blue selection rectangle
- Right-click context menu appears on desktop (New, Arrange Icons, Properties, etc.)

---

📋 TASKBAR (bottom, full width)
- Classic grey Windows 95 taskbar with raised 3D bevel border (light top-left, dark bottom-right)
- START button on the far left with the Windows logo and "Start" text
- Start menu opens upward with classic menu items: Programs, Documents, Settings, Find, Help, Run, Shut Down
- System clock on the far right showing real time (HH:MM AM/PM)
- Notification tray area with small icons
- Active window buttons appear in the taskbar when windows are open
- Taskbar height: 28px

---

🪟 WINDOWS (draggable, resizable, stackable)
Each section of the portfolio opens as a classic Win95 window with:
- Title bar: gradient from dark blue (#000080) to lighter blue, white title text, window icon on left
- Three control buttons top-right: [_] Minimize, [□] Maximize, [X] Close — all in raised 3D bevel style
- Menu bar below title bar: File | Edit | View | Help
- Toolbar with small icon buttons (back, forward, cut, copy, paste)
- Content area with white/grey background
- Status bar at the bottom of the window

WINDOW TYPES TO DESIGN:

1. ABOUT ME WINDOW (looks like "My Computer" explorer)
   - Left panel: tree nav (like Windows Explorer)
   - Right panel: personal bio text with a pixelated avatar/photo placeholder
   - Uses monospaced or pixel font for content

2. PROJECTS WINDOW (looks like a File Explorer grid)
   - Projects shown as folder icons in a grid
   - Each folder has a custom label and opens a sub-window with project details
   - Sub-window has a screenshot placeholder, description text, and [Visit Site] [Source Code] buttons styled as Win95 buttons

3. SKILLS WINDOW (looks like a Notepad.exe file)
   - Title: "Skills.txt - Notepad"
   - Skills listed in plain text with ASCII-art section headers
   - Horizontal and vertical scrollbars

4. CONTACT WINDOW (looks like Outlook Express or a dialog box)
   - Form fields with classic Win95 input styling (inset border, white background)
   - Labels: Name, Email, Message
   - [Send] and [Cancel] buttons in raised bevel style
   - On submit: show a Win95 popup dialog with OK button ("Message sent!")

5. RESUME WINDOW (looks like WordPad)
   - Resume content in a WordPad-style document viewer
   - Formatting toolbar at top
   - [Download .doc] button

---

🎨 VISUAL STYLE
- Color palette: Classic Win95 grey (#C0C0C0 background), dark blue title bars (#000080), white content areas, black text
- All buttons: raised 3D bevel effect (white top-left border, dark grey bottom-right border, grey fill)
- All input fields: inset 3D effect (dark top-left, white bottom-right)
- Font: "MS Sans Serif" or closest pixel-style bitmap font — 8pt/10pt size
- Pixel-perfect rendering: no rounded corners anywhere, no shadows except Win95-style flat shadows
- Cursor: classic Win95 arrow cursor (white with black outline)
- Window resize handles at corners and edges
- Selection highlight: solid dark blue (#000080) with white text

---

⚙️ FUNCTIONAL INTERACTIONS
- Clicking desktop icons opens their corresponding window
- Windows are draggable by their title bar
- Windows stack with z-index (clicking a window brings it to front)
- Minimize sends window to taskbar, restores on taskbar click
- Maximize fills the screen (minus taskbar), double-click title bar to toggle
- Close button closes/hides the window
- Start menu: clicking outside dismisses it
- Right-click on desktop: context menu with options
- Double-click desktop icons to open
- Win95-style loading bar / hourglass cursor when "loading" a window
- Error dialog popup: styled like a Win95 error with red X icon, message, and [OK] button

---

📐 LAYOUT & SPACING
- Full viewport: 100vw × 100vh, overflow hidden
- Desktop fills entire space above taskbar
- Windows default to centered or slightly offset cascade position
- Windows can overlap and be reordered

---

🏆 PORTFOLIO-SPECIFIC DETAILS
- Owner name visible in About Me window and title bars (e.g., "Adamos Lovat - Portfolio")
- Subtle Easter egg: typing "DOOM" triggers a pixelated animation
- Visitor count in the taskbar tray ("Visitors: 1,337")
- "Designed in 1995" stamp in the About window

Make this design pixel-perfect, deeply nostalgic, and fully interactive. Every element should feel like it was ripped directly from a real Windows 95 machine — no modern design elements, no gradients except the title bar blue, no border-radius, no box-shadows. Pure 1995 authenticity.