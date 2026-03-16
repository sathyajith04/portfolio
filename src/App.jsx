import { useState, useEffect, useRef, useCallback } from "react";

// ─── BOOT ─────────────────────────────────────────────────────────────────────
const BOOT = [
  {t:0,   txt:""},
  {t:100, txt:"ELEC-SYS DIAGNOSTIC TERMINAL  v4.2.1",cls:"info"},
  {t:240, txt:"(c) 2026 SATHYAJITH // PSG COLLEGE OF TECHNOLOGY",cls:"dim"},
  {t:380, txt:""},
  {t:480, txt:"[ BIOS ] Checking hardware registers..."},
  {t:620, txt:"[ BIOS ] MCU subsystem (TI C2000 F28027F) ......... OK",ok:true},
  {t:760, txt:"[ BIOS ] DSP engine (FFT + Wavelet hybrid) ........ OK",ok:true},
  {t:900, txt:"[ BIOS ] ML inference core (XGBoost) .............. OK",ok:true},
  {t:1040,txt:"[ BIOS ] IoT stack (ESP32 / MQTT / Vercel) ........ OK",ok:true},
  {t:1180,txt:"[ BIOS ] Watchdog timer ........................... OK",ok:true},
  {t:1320,txt:""},
  {t:1400,txt:"[ SYS  ] Mounting portfolio filesystem..."},
  {t:1540,txt:"[ SYS  ] Engineer profile ........... SATHYAJITH / EEE-2027",ok:true},
  {t:1680,txt:"[ SYS  ] Project registry ........... 6 records indexed",ok:true},
  {t:1820,txt:"[ SYS  ] Achievement log ............ 5 entries",ok:true},
  {t:1960,txt:"[ SYS  ] Danfoss Award 2026 ......... WINNER ★",ok:true},
  {t:2100,txt:""},
  {t:2180,txt:"[ POST ] Running self-test diagnostics..."},
  {t:2340,txt:"[ POST ] System integrity ........... PASS  98/100",ok:true},
  {t:2480,txt:"[ POST ] Memory check ............... PASS  0 errors",ok:true},
  {t:2620,txt:"[ POST ] Signal path ................ PASS  all channels nominal",ok:true},
  {t:2760,txt:"[ POST ] Interactive terminal ........ ENABLED  (type 'help')",ok:true},
  {t:2900,txt:""},
  {t:2960,txt:"[ ALL SYSTEMS OPERATIONAL — LAUNCHING PORTFOLIO ]",cls:"ok"},
  {t:3060,txt:""},
  {t:3120,txt:"Initialising display subsystem...",cls:"dim"},
];

// ─── DATA ─────────────────────────────────────────────────────────────────────
const EDU = [
  {id:"EDU-01",title:"B.E. — ELECTRICAL & ELECTRONICS ENGINEERING",inst:"PSG College of Technology, Coimbatore",period:"2023 – 2027",year:"",note:"Current — 3rd Year"},
  {id:"EDU-02",title:"12TH GRADE (HSC)",inst:"Kongu Vellalar Matric Hr Sec School, Coimbatore",period:"March 2023",year:"",note:"Centum in Physics, Chemistry & Mathematics — Academic Excellence Award"},
  {id:"EDU-03",title:"10TH GRADE (SSLC)",inst:"Holy Rosary Matriculation School, Coimbatore",period:"March 2021",year:"",note:"Corona Batch"},
];

const PROJECTS = [
  {id:"PROJECT-001",period:"JAN 2026–PRESENT",type:"HARDWARE+DSP",title:"POWER QUALITY ANALYSER",
   desc:"Low-cost PQ analyser detecting voltage sag/swell in real time. LEM sensors, op-amp conditioning, TI C2000 F28027F MCU. Hybrid Fourier + Wavelet. Validated with DSO.",
   detail:"Targets industrial power monitoring at 10× lower cost than commercial alternatives. Hybrid DSP engine: Fourier for stationary signals, Wavelet for transients — <2ms detection latency. Signal chain: LEM sensor → instrumentation amp → 12-bit ADC on F28027F → real-time DSP core.",
   tags:["TI C2000","LEM SENSORS","WAVELET+FFT","OP-AMP"],status:"IN PROGRESS",sc:"var(--amber)",pulse:"amber",link:null},
  {id:"PROJECT-002",period:"OCT 2025–FEB 2026",type:"ML + HW  ★ DANFOSS",title:"DC-LINK CAPACITOR HEALTH MONITOR",
   desc:"Danfoss Innovator Award 2026 Winner. Current-sensorless predictive maintenance. ESP32 edge FFT → ESR/capacitance → XGBoost HI & RUL. Live MQTT Vercel dashboard.",
   detail:"Eliminates dedicated current sensors by extracting ESR and capacitance from existing drive measurements. XGBoost model trained on 50k synthetic aging cycles achieves 94% RUL prediction accuracy. End-to-end latency sensor → dashboard: <500ms via MQTT → Vercel edge functions.",
   tags:["ESP32","XGBOOST","MATLAB/SIMULINK","MQTT"],status:"LIVE ↗",sc:"var(--green)",pulse:"green",link:"https://capacitorhealthdashboard.vercel.app"},
  {id:"PROJECT-003",period:"APR–MAY 2025",type:"ANALOG",title:"ANALOG PID MOTOR CONTROLLER",
   desc:"Analog feedback control using LM358 op-amp for 12V DC motor. Full P, I, D control with discrete analog components — zero digital processing.",
   detail:"Three op-amp stages: proportional (inverting amp), integrator (Miller integrator), derivative (differentiator). Summing amp combines PID terms. Speed feedback via back-EMF sensing. Tuned for <5% overshoot at rated load.",
   tags:["LM358","12V DC MOTOR","ANALOG PID"],status:"RESOLVED",sc:"var(--green)",pulse:null,link:null},
  {id:"PROJECT-004",period:"APR–MAY 2025",type:"SIMULATION",title:"UNDERGROUND CABLE FAULT DETECTOR",
   desc:"Voltage-drop based fault location for underground cables. Proteus + ESP32 for real-time fault distance estimation.",
   detail:"Murray loop test principle: known voltage applied, fault distance computed from resistance ratio. ESP32 reads ADC, calculates fault distance in metres. Proteus simulation validated against theoretical calculations with <3% error.",
   tags:["ESP32","PROTEUS","VOLTAGE DROP"],status:"GITHUB ↗",sc:"var(--green)",pulse:null,link:"https://github.com/sathyajith04/underground-cable-fault-detector"},
  {id:"PROJECT-005",period:"MAR–APR 2025",type:"ASSISTIVE TECH",title:"BRAILLE TO TEXT CONVERTER",
   desc:"Arduino Uno Braille input. 6-dot buttons → alphanumeric on LCD. Alpha/Numeric mode, backspace, space, clear. Tinkercad validated.",
   detail:"6 tactile buttons map to Braille dots 1-6. Full Grade 1 Braille alphabet plus digits. Mode toggle switches alpha/numeric tables. 16×2 LCD shows decoded char and running string. Simulated and validated in Tinkercad.",
   tags:["ARDUINO UNO","LCD","TINKERCAD"],status:"GITHUB ↗",sc:"var(--green)",pulse:null,link:"https://github.com/sathyajith04/braille-to-text-converter"},
  {id:"PROJECT-006",period:"JUN–JUL 2025",type:"WEB",title:"rCALC — RESISTOR CALCULATOR",
   desc:"Web-based resistor colour code calculator. Converts colour bands ↔ values. HTML/CSS/JS, responsive, live preview. Deployed on Vercel.",
   detail:"Bidirectional: select bands → get resistance, enter value → get bands. Supports 4-band and 5-band resistors. Visual resistor preview updates in real time. Pure vanilla JS, no dependencies, <20kB bundle.",
   tags:["HTML/CSS/JS","VERCEL"],status:"LIVE ↗",sc:"var(--green)",pulse:"green",link:"https://rcalc1.vercel.app/"},
];

const LOG = [
  {ts:"2026-02",sev:"WINNER",sc:"ok",  title:"Danfoss Innovator Award 2026",
   body:"Won for non-invasive condition monitoring and RUL prediction of DC-link capacitors.",
   expand:"Competed at national level among engineering institutions across India. Proposed a current-sensorless approach using existing drive signals, eliminating additional hardware. Evaluated by Danfoss India R&D panel."},
  {ts:"2025-09",sev:"ACTIVE",sc:"info",title:"Design Head — EEEA Association",
   body:"Leading visual design for the EEE Association. Tools: Adobe Photoshop & Illustrator.",
   expand:"Responsible for all visual communication — event posters, social media creatives, internal newsletters. Collaborating with department faculty and student coordinators to maintain consistent design language."},
  {ts:"2025-02",sev:"ACTIVE",sc:"info",title:"Web Development Team — IEEE SC 12951",
   body:"Member of IEEE SC 12951 web dev team. Building and maintaining chapter digital presence.",
   expand:"Contributing to the IEEE Student Chapter website — frontend development, content updates, and UI improvements. Working with a cross-functional team of students and faculty advisors."},
  {ts:"2023-09",sev:"RESOLVED",sc:"ok",title:"NCC Cadet — Sergeant // B Certificate Grade A",
   body:"Sep 2023 – Feb 2026. Sergeant rank. B Certificate 'A' Grade. C Certificate exam appeared.",
   expand:"Served as NCC cadet for 2.5 years under the Tamil Nadu Directorate. Promoted to Sergeant. Cleared B Certificate examination with Grade A. Participated in combined annual training camps and drill competitions."},
  {ts:"2023-03",sev:"RESOLVED",sc:"ok",title:"Academic Excellence — AMS Coimbatore",
   body:"Centum (100/100) in Physics, Chemistry, Mathematics in HSC finals.",
   expand:"Awarded by the Association of Matriculation Schools, Coimbatore for scoring 100/100 in Physics, Chemistry, and Mathematics in the Tamil Nadu State Board HSC examinations (March 2023 batch)."},
];

const TICKS    = ["TI C2000 F28027F","MATLAB/SIMULINK","PYTHON — XGBOOST","FFT + WAVELET DSP","ESP32 FIRMWARE","MQTT / IOT PIPELINE","WEB DEV — HTML/CSS/JS","ADOBE PS / AI","DANFOSS AWARD 2026 ★","NCC SGT — B-CERT GRADE A","PCB DESIGN","SIGNAL PROCESSING"];
const NAV_IDS  = ["about","education","projects","log","contact"];
const NAV_PATHS= {about:"/sathyajith/about",education:"/sathyajith/education",projects:"/sathyajith/projects",log:"/sathyajith/log",contact:"/sathyajith/contact"};
const GLYPHS   = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789#@$%&!?";
const ALPHA    = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";
const DIGITS   = "0123456789";
const rg       = () => GLYPHS[Math.floor(Math.random() * GLYPHS.length)];
// total fixed header height: topbar 46 + breadcrumb 20 + ticker 22 = 88, +16 buffer
const NAV_OFFSET = 104;

// ─── EASTER EGG COMMANDS ──────────────────────────────────────────────────────
const CMDS = {
  help:{input:"help",lines:[
    {t:"OUT >",v:" Available commands:",hi:true},{t:"OUT >",v:""},
    {t:"OUT >",v:"  whoami"},         //display engineer profile
    {t:"OUT >",v:"  ls"},             //list project directory
    {t:"OUT >",v:"  ssh sathyajith"}, //attempt connection
    {t:"OUT >",v:"  ping"},           //check all social channels
    {t:"OUT >",v:"  sudo"},           //escalate privileges
    {t:"OUT >",v:"  clear"},          //dismiss terminal
    {t:"OUT >",v:""},{t:"OUT >",v:"  // undiscovered commands exist",dim:true},
  ]},
  whoami:{input:"whoami",lines:[
    {t:"OUT >",v:" UNIT: SATHYAJITH",hi:true},
    {t:"OUT >",v:" ROLE: B.E. Electrical & Electronics Engineering"},
    {t:"OUT >",v:" INST: PSG College of Technology, Coimbatore"},
    {t:"OUT >",v:" YEAR: 2023–2027  [3rd Year]"},
    {t:"OUT >",v:" RANK: NCC Sergeant | B-Cert Grade A"},
    {t:"OUT >",v:" AWARD: Danfoss Innovator Award 2026 — WINNER ★",hi:true},
    {t:"OUT >",v:" ROLES: Design Head EEEA | Web Dev IEEE SC 12951"},
    {t:"OUT >",v:""},{t:"OUT >",v:" // If it can't be drawn, it can't be built.",dim:true},
  ]},
  ls:{input:"ls -la /projects",lines:[
    {t:"OUT >",v:" total 6",dim:true},
    {t:"OUT >",v:" drwxr--  PROJECT-001  power-quality-analyser/      [IN PROGRESS]"},
    {t:"OUT >",v:" drwxr--  PROJECT-002  dc-link-capacitor-monitor/   [LIVE ↗]",hi:true},
    {t:"OUT >",v:" drwxr--  PROJECT-003  analog-pid-controller/       [RESOLVED]"},
    {t:"OUT >",v:" drwxr--  PROJECT-004  cable-fault-detector/        [GITHUB ↗]"},
    {t:"OUT >",v:" drwxr--  PROJECT-005  braille-text-converter/      [GITHUB ↗]"},
    {t:"OUT >",v:" drwxr--  PROJECT-006  rcalc-resistor-calculator/   [LIVE ↗]",hi:true},
  ]},
  ssh:{input:"ssh sathyajith@psg.eee",lines:[
    {t:"OUT >",v:" Connecting to sathyajith@psg.eee..."},
    {t:"OUT >",v:" Authenticating... ",dim:true},
    {t:"OUT >",v:" ██████████ 100%",hi:true},{t:"OUT >",v:""},
    {t:"OUT >",v:" CONNECTION ESTABLISHED",hi:true},
    {t:"OUT >",v:" Welcome back, engineer. All systems nominal."},
  ]},
  ping:{input:"ping --all-channels",lines:[
    {t:"OUT >",v:" PING linkedin.com/in/sathyajith04    — 4ms  TTL=64",hi:true},
    {t:"OUT >",v:" PING github.com/sathyajith04         — 6ms  TTL=64",hi:true},
    {t:"OUT >",v:" PING instagram.com/the.sathyajith    — 5ms  TTL=64",hi:true},
    {t:"OUT >",v:" PING letterboxd.com/sathyajith4      — 8ms  TTL=64",hi:true},
    {t:"OUT >",v:" PING tvtime.com/r/3dBdB              — 7ms  TTL=64",hi:true},
    {t:"OUT >",v:""},{t:"OUT >",v:" 5 channels reachable — 0% packet loss",dim:true},
  ]},
  sudo:{input:"sudo su",lines:[
    {t:"OUT >",v:" [sudo] password for sathyajith: "},
    {t:"OUT >",v:" sudo: Permission denied.",dim:true},
    {t:"OUT >",v:" Nice try.",dim:true},
  ]},
};

// ─── PROFANITY RESPONSES ──────────────────────────────────────────────────────
const PROFANITY = {
  fuck:[
    {t:"ERR >",v:" ERROR: profanity.exe not found in /sys/valid_commands",dim:true},
    {t:"OUT >",v:" // sathyajith here. this terminal runs on coffee and respect.",hi:true},
  ],
  shit:[
    {t:"ERR >",v:" ALERT: Hostile input detected. Notifying admin...",dim:true},
    {t:"OUT >",v:" // just kidding. but seriously, type 'help'.",hi:true},
  ],
  damn:[
    {t:"ERR >",v:" SYNTAX ERROR: That word is not in the EEE curriculum.",dim:true},
    {t:"OUT >",v:" // try 'whoami' instead. much more productive.",hi:true},
  ],
  hell:[
    {t:"ERR >",v:" WARNING: Unrecognised emotional output detected.",dim:true},
    {t:"OUT >",v:" // breathe. the circuits are watching.",hi:true},
  ],
  ass:[
    {t:"ERR >",v:" EXCEPTION: Invalid argument passed to /sys/terminal.",dim:true},
    {t:"OUT >",v:" // this is an engineering portfolio, not a comment section.",hi:true},
  ],
  crap:[
    {t:"ERR >",v:" DIAGNOSTIC: Signal integrity compromised by input noise.",dim:true},
    {t:"OUT >",v:" // filter your input. the ADC can't handle this.",hi:true},
  ],
  wtf:[
    {t:"ERR >",v:" PARSE ERROR: Ambiguous token sequence detected.",dim:true},
    {t:"OUT >",v:" // valid question honestly. type 'help' and we'll get there.",hi:true},
  ],
  idiot:[
    {t:"ERR >",v:" SYSTEM: Insult directed at — nobody? Terminal is not sentient.",dim:true},
    {t:"OUT >",v:" // but if it were, it would still respond with 'help'.",hi:true},
  ],
};

// ─── BIO / CONTACT LINES ─────────────────────────────────────────────────────
const BIO_LINES = [
  {prompt:"SYS >",cmd:" query --profile sathyajith --verbose",delay:0},
  {prompt:"OUT >",out:" Loading engineer profile...",delay:500,dim:true},
  {prompt:"OUT >",out:" Name         : SATHYAJITH",delay:1100},
  {prompt:"OUT >",out:" Degree       : B.E. Electrical & Electronics Engineering",delay:1700},
  {prompt:"OUT >",out:" Institution  : PSG College of Technology, Coimbatore",delay:2300},
  {prompt:"OUT >",out:" Year         : 2023 – 2027  [CURRENTLY 3rd YEAR]",delay:2900},
  {prompt:"OUT >",out:" Award        : Danfoss Innovator Award 2026 — WINNER ★",delay:3500,hi:true},
  {prompt:"OUT >",out:" NCC          : Sergeant | B Certificate Grade A",delay:4100},
  {prompt:"OUT >",out:" Roles        : Design Head EEEA | Web Dev IEEE SC 12951",delay:4700},
  {prompt:"OUT >",out:"",delay:5200},
  {prompt:"OUT >",out:" // I treat every project like a schematic.",delay:5800,dim:true},
  {prompt:"OUT >",out:" // From power rails to signal paths — every node must make sense.",delay:6500,dim:true},
  {prompt:"OUT >",out:" // If it can't be drawn, it can't be built.",delay:7200,dim:true},
  {prompt:"OUT >",out:"",delay:7700},
  {prompt:"SYS >",cmd:" status --field interests",delay:8300},
  {prompt:"OUT >",out:" Power Electronics · Embedded System · Electrical Machines",delay:9000},
  {prompt:"OUT >",out:" [PROFILE LOADED]  // try typing 'help' anywhere",delay:9700,dim:true},
];

const CT_LINES = [
  {prompt:"SYS >",cmd:" ping --unit sathyajith --loc coimbatore",delay:0},
  {prompt:"OUT >",out:" PING OK — HOST REACHABLE — RTT: 0ms",delay:340},
  {prompt:"SYS >",cmd:" status --channels all",delay:700},
  {prompt:"OUT >",out:" LinkedIn ......... CHANNEL ACTIVE",delay:1000},
  {prompt:"OUT >",out:" GitHub ........... CHANNEL ACTIVE",delay:1180},
  {prompt:"OUT >",out:" Instagram ........ CHANNEL ACTIVE",delay:1360},
  {prompt:"OUT >",out:" Letterboxd ....... CHANNEL ACTIVE",delay:1540},
  {prompt:"OUT >",out:" TV Time .......... CHANNEL ACTIVE",delay:1720},
  {prompt:"SYS >",cmd:" open --connection-request",delay:1800},
  {prompt:"OUT >",out:" ALL CHANNELS OPEN — AWAITING HANDSHAKE",delay:2000,hi:true},
];

// ─── ICONS ────────────────────────────────────────────────────────────────────
const LI=<svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor"><path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433a2.062 2.062 0 0 1-2.063-2.065 2.064 2.064 0 1 1 2.063 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/></svg>;
const GH=<svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor"><path d="M12 0C5.374 0 0 5.373 0 12c0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23A11.509 11.509 0 0 1 12 5.803c1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576C20.566 21.797 24 17.3 24 12c0-6.627-5.373-12-12-12z"/></svg>;
const IG=<svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor"><path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zM12 0C8.741 0 8.333.014 7.053.072 2.695.272.273 2.69.073 7.052.014 8.333 0 8.741 0 12c0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98C8.333 23.986 8.741 24 12 24c3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98C15.668.014 15.259 0 12 0zm0 5.838a6.162 6.162 0 1 0 0 12.324 6.162 6.162 0 0 0 0-12.324zM12 16a4 4 0 1 1 0-8 4 4 0 0 1 0 8zm6.406-11.845a1.44 1.44 0 1 0 0 2.881 1.44 1.44 0 0 0 0-2.881z"/></svg>;
const LB=<svg width="26" height="17" viewBox="0 0 66 40"><circle cx="13" cy="20" r="13" fill="var(--red)" opacity="0.5"/><circle cx="33" cy="20" r="13" fill="var(--red)" opacity="0.95"/><circle cx="53" cy="20" r="13" fill="var(--red)" opacity="0.5"/><ellipse cx="23" cy="20" rx="3.2" ry="10" fill="var(--bg)" opacity="0.5"/><ellipse cx="43" cy="20" rx="3.2" ry="10" fill="var(--bg)" opacity="0.5"/></svg>;
const TV=<svg width="20" height="20" viewBox="0 0 10 10" fill="var(--red)"><rect x="1" y="0" width="3" height="3" opacity="0.7"/><rect x="4" y="0" width="4" height="3" opacity="0.95"/><rect x="7" y="0" width="3" height="3" opacity="0.8"/><rect x="4" y="3" width="3" height="4" opacity="0.8"/><rect x="4" y="6" width="3" height="3"/></svg>;


const SOCIALS=[
  {label:"LinkedIn",  href:"https://www.linkedin.com/in/sathyajith04/",icon:LI},
  {label:"GitHub",    href:"https://github.com/sathyajith04",          icon:GH},
  {label:"Instagram", href:"https://www.instagram.com/the.sathyajith/",icon:IG},
  {label:"Letterboxd",href:"https://letterboxd.com/sathyajith4/",      icon:LB},
  {label:"TV Time",   href:"https://tvtime.com/r/3dBdB",               icon:TV},
];

// ─── CSS ──────────────────────────────────────────────────────────────────────
const css = `
  @import url('https://fonts.googleapis.com/css2?family=Orbitron:wght@400;600;700;900&family=Share+Tech+Mono&display=swap');
  *{margin:0;padding:0;box-sizing:border-box}

  /* ── DARK THEME (default) ── */
  :root{
    --bg:#080b10;--bg2:#0d1018;--bg3:#111520;--panel:#0f1319;
    --b1:rgba(255,255,255,.06);--b2:rgba(255,255,255,.11);
    --tx:#bfcfe8;--tdim:rgba(191,207,232,.5);--tfaint:rgba(191,207,232,.22);
    --red:#e03c3c;--rdim:rgba(224,60,60,.45);
    --green:#29c270;--amber:#e8a020;--blue:#3d8fe0;--teal:#1fb5a8;
    --topbar-bg:rgba(8,11,16,.97);
    --modal-bg:rgba(4,6,10,.88);
    --noise-op:.028;
    --scan-op:.14;
  }
  /* ── LIGHT THEME — engineering paper ── */
  body.light{
    --bg:#f5f0e8;--bg2:#ede8de;--bg3:#e4ddd2;--panel:#ede8de;
    --b1:rgba(60,40,10,.08);--b2:rgba(60,40,10,.16);
    --tx:#1c1408;--tdim:rgba(28,20,8,.58);--tfaint:rgba(28,20,8,.32);
    --red:#c42828;--rdim:rgba(196,40,40,.3);
    --green:#1a6e38;--amber:#8a5500;--blue:#1a4f8a;--teal:#0d6b62;
    --topbar-bg:rgba(245,240,232,.97);
    --modal-bg:rgba(230,224,214,.9);
    --noise-op:.0;
    --scan-op:.0;
  }
  /* engineering paper grid in light mode */
  body.light::before{background:
    linear-gradient(var(--b1) 1px,transparent 1px),
    linear-gradient(90deg,var(--b1) 1px,transparent 1px);
    background-size:24px 24px;
    opacity:.6
  }
  body.light .topbar,body.light .breadcrumb,body.light .ticker{
    box-shadow:0 1px 0 var(--b2);
  }

  html{scroll-behavior:smooth}
  body{background:var(--bg);color:var(--tx);font-family:'Orbitron',sans-serif;font-size:13px;min-height:100vh;overflow-x:hidden;letter-spacing:.5px;transition:background .35s,color .35s}

  /* ── NOISE ── */
  body::before{content:'';position:fixed;inset:0;background:repeating-linear-gradient(0deg,transparent,transparent 2px,rgba(0,0,0,var(--scan-op)) 2px,rgba(0,0,0,var(--scan-op)) 4px);pointer-events:none;z-index:9998}
  body::after{content:'';position:fixed;inset:0;opacity:var(--noise-op);background-image:url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)'/%3E%3C/svg%3E");background-size:256px;pointer-events:none;z-index:9997}

  /* ── SCROLL PROGRESS ── */
  .scroll-bar{position:fixed;left:0;top:0;bottom:0;width:2px;z-index:300;background:var(--b1)}
  .scroll-fill{position:absolute;top:0;left:0;width:100%;background:var(--red);box-shadow:0 0 8px var(--red);transition:height .1s linear}

  /* ── BOOT ── */
  .boot{position:fixed;inset:0;background:#080b10;z-index:5000;display:flex;flex-direction:column;padding:2rem 2.5rem}
  .boot-brand{font-family:'Orbitron';font-size:.55rem;font-weight:700;letter-spacing:6px;color:#e03c3c;margin-bottom:1.2rem;text-shadow:0 0 14px rgba(224,60,60,.5)}
  .boot-lines{flex:1;min-height:0;overflow-y:auto;display:flex;flex-direction:column;gap:.04rem;font-family:'Share Tech Mono',monospace;font-size:.68rem;line-height:1.7;scrollbar-width:none}
  .boot-lines::-webkit-scrollbar{display:none}
  .bl{opacity:0;transform:translateX(-8px);transition:opacity .16s,transform .16s}
  .bl.show{opacity:1;transform:none}
  .bl.ok{color:#29c270}.bl.info{color:#3d8fe0}.bl.dim{color:rgba(191,207,232,.48)}
  .bcur{display:inline-block;width:8px;height:14px;background:#bfcfe8;vertical-align:middle;animation:blink .7s infinite}
  @keyframes blink{0%,49%{opacity:1}50%,100%{opacity:0}}
  .bbar-wrap{margin-top:1rem;padding-top:.5rem;border-top:1px solid rgba(255,255,255,.06);flex-shrink:0}
  .bbar-lbl{font-family:'Orbitron';font-size:.42rem;font-weight:600;letter-spacing:4px;color:rgba(191,207,232,.48);margin-bottom:.3rem}
  .bbar{height:2px;background:rgba(255,255,255,.04);max-width:500px}
  .bbar-fill{height:100%;background:#e03c3c;box-shadow:0 0 10px #e03c3c;transition:width .04s linear}
  .bbar-pct{font-family:'Share Tech Mono';font-size:.55rem;color:#e03c3c;margin-top:.25rem;letter-spacing:2px}

  /* ── WIPE ── */
  .wipe{position:fixed;inset:0;z-index:4999;pointer-events:none;overflow:hidden}
  .wipe-line{position:absolute;left:0;right:0;height:3px;background:#e03c3c;box-shadow:0 0 18px 4px #e03c3c,0 0 40px 8px rgba(224,60,60,.45);top:var(--y,0%)}
  .wipe-mask{position:absolute;left:0;right:0;top:0;background:#080b10;height:var(--y,0%)}

  /* ── TOPBAR ── */
  .topbar{position:fixed;top:0;left:0;right:0;z-index:200;height:46px;background:var(--topbar-bg);border-bottom:1px solid var(--b2);display:flex;align-items:center;padding:0 1.2rem;gap:.8rem;overflow:hidden;backdrop-filter:blur(6px);transition:background .35s,border-color .35s}
  .t-logo{font-family:'Orbitron';font-size:.7rem;font-weight:900;color:var(--red);letter-spacing:4px;white-space:nowrap;text-shadow:0 0 12px var(--rdim);flex-shrink:0}
  .t-sep{width:1px;height:22px;background:var(--b2);flex-shrink:0}
  .t-stat{display:flex;align-items:center;gap:.35rem;font-family:'Share Tech Mono';font-size:.52rem;letter-spacing:1px;color:var(--tdim);white-space:nowrap}
  .tdot{width:5px;height:5px;border-radius:50%;flex-shrink:0}
  .tdot.g{background:var(--green);box-shadow:0 0 5px var(--green)}
  .tdot.r{background:var(--red);box-shadow:0 0 6px var(--red);animation:pd 1.8s infinite}
  @keyframes pd{0%,100%{opacity:1}50%{opacity:.2}}
  .t-time{font-family:'Share Tech Mono';font-size:.58rem;color:var(--tdim);letter-spacing:2px;white-space:nowrap}
  .top-nav{display:flex;gap:.2rem;margin-left:auto}
  .tnbtn{background:transparent;border:none;font-family:'Orbitron';font-size:.44rem;font-weight:600;letter-spacing:2px;padding:5px 8px;cursor:pointer;color:var(--tdim);transition:color .2s;white-space:nowrap;position:relative}
  .tnbtn::after{content:'';position:absolute;bottom:0;left:8px;right:8px;height:2px;background:var(--red);transform:scaleX(0);transition:transform .2s;transform-origin:left}
  .tnbtn:hover{color:var(--red)}.tnbtn.active{color:var(--red)}.tnbtn.active::after{transform:scaleX(1)}
  .t-right{display:flex;align-items:center;gap:.6rem;margin-left:auto}
  .theme-btn{background:transparent;border:1px solid var(--b2);color:var(--tdim);font-family:'Orbitron';font-size:.38rem;font-weight:600;letter-spacing:2px;padding:3px 8px;cursor:pointer;transition:all .2s;white-space:nowrap;flex-shrink:0}
  .theme-btn:hover{border-color:var(--red);color:var(--red)}
  .burger{display:none;flex-direction:column;gap:4px;background:transparent;border:1px solid var(--b2);padding:5px 7px;cursor:pointer;flex-shrink:0}
  .burger span{display:block;width:16px;height:1px;background:var(--tdim);transition:all .3s}
  .burger.open span:nth-child(1){transform:rotate(45deg) translate(3px,3px)}
  .burger.open span:nth-child(2){opacity:0}
  .burger.open span:nth-child(3){transform:rotate(-45deg) translate(3px,-3px)}
  .mob-menu{display:none;position:fixed;top:46px;left:0;right:0;z-index:199;background:var(--topbar-bg);border-bottom:1px solid var(--b2);flex-direction:column;padding:.5rem .8rem .8rem;backdrop-filter:blur(6px)}
  .mob-menu.open{display:flex}
  .mob-menu .tnbtn{width:100%;text-align:left;padding:9px 10px;font-size:.52rem;border-bottom:1px solid var(--b1)}

  /* ── BREADCRUMB ── */
  .breadcrumb{position:fixed;top:46px;left:0;right:0;z-index:198;height:20px;background:var(--topbar-bg);border-bottom:1px solid var(--b1);display:flex;align-items:center;padding:0 1.2rem;gap:.4rem;font-family:'Share Tech Mono';font-size:.44rem;letter-spacing:1px;color:var(--tdim);overflow:hidden;transition:background .35s}
  .bc-prompt{color:var(--red);opacity:.7}
  .bc-cursor{display:inline-block;width:6px;height:10px;background:var(--red);opacity:.5;vertical-align:middle;animation:blink .9s infinite;margin-left:2px}

  /* ── TICKER ── */
  .ticker{position:fixed;top:66px;left:0;right:0;z-index:99;height:22px;overflow:hidden;background:var(--topbar-bg);border-bottom:1px solid var(--b1);display:flex;align-items:center;transition:background .35s}
  .t-badge{background:var(--red);color:#fff;font-family:'Orbitron';font-size:.42rem;font-weight:700;letter-spacing:3px;padding:0 10px;height:100%;display:flex;align-items:center;white-space:nowrap;flex-shrink:0}
  .t-scroll{overflow:hidden;flex:1}
  .t-inner{display:inline-flex;gap:3rem;animation:tick 36s linear infinite;white-space:nowrap;font-family:'Share Tech Mono';font-size:.46rem;letter-spacing:2px;color:var(--tdim)}
  @keyframes tick{from{transform:translateX(0)}to{transform:translateX(-50%)}}
  .t-inner .hi{color:var(--green)}

  /* ── MAIN ── */
  .main{padding:104px 1.2rem 5rem;max-width:1260px;margin:0 auto}

  /* ── HERO ── */
  .hero{display:grid;grid-template-columns:1fr auto;gap:1.5rem;align-items:end;padding:2.5rem 0 1.8rem;border-bottom:1px solid var(--b1);margin-bottom:2rem}
  @media(max-width:560px){.hero{grid-template-columns:1fr}}
  .h-eye{font-family:'Share Tech Mono';font-size:.48rem;letter-spacing:5px;color:var(--tdim);margin-bottom:.7rem}
  .h-name{font-family:'Orbitron';font-weight:900;font-size:clamp(2rem,7.5vw,4.8rem);line-height:.85;letter-spacing:3px;white-space:nowrap}
  .h-cur{display:inline-block;width:.55em;height:.8em;background:var(--red);vertical-align:middle;animation:blink .8s infinite;margin-left:4px;opacity:.8}
  .dc-white{display:inline-block}.dc-white.settled{color:var(--tx)}
  .dc-red{display:inline-block}.dc-red.settled{color:var(--red);text-shadow:0 0 18px var(--rdim)}
  .h-sub{font-family:'Orbitron';font-size:.48rem;font-weight:400;letter-spacing:2px;color:var(--tdim);margin-top:.9rem;line-height:2}
  .dc-sub{display:inline-block}.dc-sub.settled{color:var(--tdim)}
  .h-meta{display:flex;flex-direction:column;gap:.5rem;align-items:flex-end}
  @media(max-width:560px){.h-meta{flex-direction:row;flex-wrap:wrap;align-items:flex-start;margin-top:1rem}}
  .h-badge{border:1px solid var(--b2);padding:.45rem .9rem;font-family:'Orbitron';font-size:.42rem;font-weight:600;letter-spacing:2px;color:var(--tdim);background:var(--panel);white-space:nowrap;line-height:1.6}
  .h-badge .g{color:var(--green)}.h-badge .r{color:var(--red)}

  /* ── STATS ── */
  .stats{display:grid;grid-template-columns:repeat(4,1fr);gap:1px;background:var(--b1);border:1px solid var(--b1);margin-bottom:2rem}
  @media(max-width:600px){.stats{grid-template-columns:repeat(2,1fr)}}
  .scell{background:var(--panel);padding:1rem 1.1rem;position:relative;overflow:hidden;transition:background .35s}
  .scell::before{content:attr(data-l);font-family:'Orbitron';font-size:.4rem;font-weight:600;letter-spacing:2px;color:var(--tdim);display:block;margin-bottom:.35rem}
  .sv-wrap{display:flex;align-items:flex-end;gap:1px;height:2rem;margin-bottom:.25rem}
  .sv-reel{height:2rem;overflow:hidden;position:relative;display:inline-block}
  .sv-inner{display:flex;flex-direction:column;transition:transform .32s cubic-bezier(.22,1,.36,1)}
  .sv-char{font-family:'Orbitron';font-weight:900;font-size:1.6rem;color:var(--tx);line-height:2rem;height:2rem;display:block;white-space:nowrap}
  .sv-char.g{color:var(--green)}.sv-char.a{color:var(--amber)}
  .ssub{font-family:'Share Tech Mono';font-size:.46rem;color:var(--tdim);letter-spacing:1px}
  .sbar{position:absolute;bottom:0;left:0;right:0;height:2px;background:var(--b1)}
  .sbar-f{height:100%;transition:width 3.5s ease}

  /* ── SECTION HEAD ── */
  .sh{display:flex;align-items:center;gap:.9rem;margin:2.5rem 0 1.1rem;padding-bottom:.65rem;border-bottom:1px solid var(--b1);flex-wrap:wrap}
  .sn-wrap{display:flex;gap:1px}
  .sn-char{font-family:'Orbitron';font-size:.52rem;font-weight:700;color:var(--red);letter-spacing:3px;display:inline-block;transition:color .1s}
  .sn-char.scramble{color:var(--tdim)}
  .st{font-family:'Orbitron';font-size:.68rem;font-weight:700;color:var(--tx);letter-spacing:3px}
  .sl{flex:1;height:1px;background:var(--b1);min-width:20px}
  .stag{font-family:'Orbitron';font-size:.4rem;font-weight:600;letter-spacing:2px;color:var(--tdim);border:1px solid var(--b2);padding:2px 8px}

  /* ── TERMINALS ── */
  .bio-term,.cterm{background:var(--bg2);border:1px solid var(--b2);padding:1.4rem 1.6rem;font-family:'Share Tech Mono',monospace;font-size:.7rem;line-height:1.9;position:relative;transition:background .35s,border-color .35s}
  .bio-term{min-height:200px}
  .bio-term::before{content:'UNIT-PROFILE // SATHYAJITH';position:absolute;top:-10px;left:14px;background:var(--bg2);padding:0 7px;font-family:'Orbitron';font-size:.42rem;font-weight:600;color:var(--red);letter-spacing:2px;transition:background .35s}
  .bio-line,.cline{display:flex;gap:.6rem;flex-wrap:wrap}
  .bio-prompt,.cprompt{color:var(--red);flex-shrink:0;opacity:.85}
  .bio-cmd,.ccmd{color:var(--tdim)}
  .bio-out{color:var(--tx)}.bio-out.hi{color:var(--green)}.bio-out.dim{color:var(--tdim)}
  .cout{color:var(--green)}
  .bio-cur,.ccur{display:inline-block;width:8px;height:13px;background:var(--tx);vertical-align:middle;animation:blink .7s infinite}

  /* ── CONTACT ── */
  .contact-wrap{display:flex;flex-direction:column;gap:1.4rem}
  .cterm{min-height:140px}
  .soc-row{display:flex;justify-content:center;gap:1.2rem;flex-wrap:wrap;padding-top:1.2rem;padding-bottom:0rem; margin-bottom:-2rem}
  .soc-btn{position:relative;display:flex;align-items:center;justify-content:center;width:50px;height:50px;border:1px solid var(--b2);border-radius:50%;background:var(--panel);color:var(--red);text-decoration:none;transition:transform .2s,border-color .2s,box-shadow .2s}
  .soc-btn:hover{transform:scale(1.22);border-color:var(--red);box-shadow:0 0 16px var(--rdim)}
  .soc-btn svg{display:block;pointer-events:none}
  .soc-btn::after{content:attr(data-label);position:absolute;top:calc(100% + 9px);left:50%;transform:translateX(-50%) translateY(5px);background:var(--bg2);border:1px solid var(--red);color:var(--red);font-family:'Orbitron';font-size:.38rem;font-weight:700;letter-spacing:2px;padding:3px 9px;white-space:nowrap;opacity:0;pointer-events:none;transition:opacity .18s,transform .18s}
  .soc-btn:hover::after{opacity:1;transform:translateX(-50%) translateY(0)}

  /* ── EDU ── */
  .edu-timeline{display:flex;flex-direction:column;gap:.85rem}
  .edu-item{position:relative}
  .edu-card{background:var(--panel);border:1px solid var(--b1);border-left:3px solid var(--red);padding:1rem 1.2rem;position:relative;transition:border-color .2s,background .35s}
  .edu-card::before{content:attr(data-id);position:absolute;top:-9px;left:10px;background:var(--panel);padding:0 5px;font-family:'Orbitron';font-size:.4rem;font-weight:700;color:var(--red);letter-spacing:2px;transition:background .35s}
  .edu-card:hover{border-color:var(--b2);border-left-color:var(--red)}
  .etitle{font-family:'Orbitron';font-size:.6rem;font-weight:700;color:var(--tx);letter-spacing:1px;margin-bottom:.3rem}
  .einst{font-family:'Share Tech Mono';font-size:.66rem;color:var(--tdim)}
  .eperiod{font-family:'Share Tech Mono';font-size:.52rem;color:var(--tdim);margin-top:.2rem}
  .enote{font-family:'Share Tech Mono';font-size:.56rem;color:var(--tdim);margin-top:.25rem;border-left:2px solid var(--red);padding-left:.5rem}

  /* ── PROJECTS ── */
  .pgrid{display:grid;grid-template-columns:repeat(3,1fr);gap:1.1rem}
  @media(max-width:900px){.pgrid{grid-template-columns:repeat(2,1fr)}}
  @media(max-width:580px){.pgrid{grid-template-columns:1fr}}
  .pc{background:var(--panel);border:1px solid var(--b1);padding:1.4rem;position:relative;transition:border-color .25s,background .35s;cursor:pointer;display:flex;flex-direction:column}
  .pc:hover{border-color:var(--b2)}
  .pc::before{content:'';position:absolute;top:0;left:0;right:0;height:2px;background:linear-gradient(90deg,var(--red),transparent);opacity:.55}
  .pid{font-family:'Share Tech Mono';font-size:.46rem;letter-spacing:2px;color:var(--tdim);margin-bottom:.4rem}
  .ptitle{font-family:'Orbitron';font-size:.72rem;font-weight:700;color:var(--tx);letter-spacing:1px;line-height:1.35;height:3.2rem;overflow:hidden;margin-bottom:.55rem}
  .pdesc{font-family:'Share Tech Mono';font-size:.67rem;color:var(--tdim);line-height:1.9;flex:1}
  .pfoot{padding-top:.75rem;margin-top:.9rem;border-top:1px solid var(--b1);display:flex;justify-content:space-between;align-items:center;flex-wrap:wrap;gap:.4rem}
  .ptags{display:flex;flex-wrap:wrap;gap:.3rem}
  .ptag{font-family:'Orbitron';font-size:.38rem;font-weight:600;padding:2px 7px;background:var(--b1);border:1px solid var(--b2);color:var(--tdim);letter-spacing:1px}
  .pstat{font-family:'Orbitron';font-size:.46rem;font-weight:600;letter-spacing:2px;white-space:nowrap;display:flex;align-items:center;gap:.4rem}
  .pstat-dot{width:7px;height:7px;border-radius:50%;flex-shrink:0}
  .pstat-dot.pulse-green{background:var(--green);box-shadow:0 0 6px var(--green);animation:pulse-g 2s infinite}
  .pstat-dot.pulse-amber{background:var(--amber);box-shadow:0 0 6px var(--amber);animation:pulse-a 2s infinite}
  @keyframes pulse-g{0%,100%{opacity:1;transform:scale(1)}50%{opacity:.4;transform:scale(.7)}}
  @keyframes pulse-a{0%,100%{opacity:1;transform:scale(1)}50%{opacity:.3;transform:scale(.65)}}
  .popen{font-family:'Share Tech Mono';font-size:.46rem;color:var(--red);margin-top:.55rem;letter-spacing:1px;opacity:.7}

  /* ── MODAL ── */
  .modal-overlay{position:fixed;inset:0;z-index:1000;display:flex;align-items:center;justify-content:center;padding:1.2rem;background:var(--modal-bg);backdrop-filter:blur(5px);animation:fdin .15s ease}
  @keyframes fdin{from{opacity:0}to{opacity:1}}
  .modal{position:relative;background:var(--bg2);max-width:640px;width:100%;padding:2rem 2rem 1.8rem;overflow:visible}
  /* border trace — separate element, not pseudo */
  .modal-border{position:absolute;inset:0;border:1px solid var(--red);pointer-events:none;opacity:0;animation:border-fade .3s ease .1s forwards}
  @keyframes border-fade{to{opacity:1}}
  /* corner brackets — always visible, above border */

  /* dot grid background */
  .modal-grid{position:absolute;inset:0;background-image:radial-gradient(circle,var(--b2) 1px,transparent 1px);background-size:18px 18px;opacity:.5;pointer-events:none;z-index:0}
  .modal-close{position:absolute;top:.7rem;right:.8rem;background:var(--panel);border:1px solid var(--b2);color:var(--tdim);font-family:'Orbitron';font-size:.42rem;padding:3px 10px;cursor:pointer;transition:all .2s;letter-spacing:2px;z-index:3}
  .modal-close:hover{border-color:var(--red);color:var(--red)}
  .modal-chip{display:inline-flex;align-items:center;gap:.5rem;border:1px solid var(--red);padding:2px 10px;font-family:'Orbitron';font-size:.42rem;font-weight:700;color:var(--red);letter-spacing:2px;margin-bottom:.6rem;opacity:0;animation:fadein .2s .38s forwards;position:relative;z-index:1}
  @keyframes fadein{to{opacity:1}}
  .modal-period{font-family:'Share Tech Mono';font-size:.52rem;color:var(--tdim);letter-spacing:1px;margin-bottom:.6rem;opacity:0;animation:fadein .2s .46s forwards;position:relative;z-index:1}
  .modal-title{font-family:'Orbitron';font-size:.95rem;font-weight:900;letter-spacing:2px;margin-bottom:.5rem;line-height:1.3;min-height:1.4em;position:relative;z-index:1}
  .dc-modal{display:inline-block;color:var(--red)}.dc-modal.s{color:var(--tx)}.dc-modal.sp{color:transparent;width:.3em}
  .modal-rule{height:1px;background:var(--red);transform-origin:left;transform:scaleX(0);transition:transform .28s ease;margin-bottom:.9rem;position:relative;z-index:1}
  .modal-rule.drawn{transform:scaleX(1)}
  .modal-detail{font-family:'Share Tech Mono';font-size:.7rem;color:var(--tdim);line-height:2;min-height:2rem;position:relative;z-index:1}
  .modal-tags{display:flex;flex-wrap:wrap;gap:.3rem;margin-top:.9rem;position:relative;z-index:1}
  .modal-tag{opacity:0;transform:translateY(6px);transition:opacity .18s,transform .18s}
  .modal-tag.in{opacity:1;transform:none}
  .modal-link{display:inline-flex;align-items:center;gap:.5rem;margin-top:1rem;border:1px solid var(--red);color:var(--red);font-family:'Orbitron';font-size:.52rem;font-weight:600;letter-spacing:2px;padding:6px 16px;text-decoration:none;transition:background .2s;opacity:0;animation:fadein .3s forwards;position:relative;z-index:1}
  .modal-link:hover{background:rgba(224,60,60,.09)}

  /* ── LOG ── */
  .log{border:1px solid var(--b1);background:var(--panel);overflow:hidden;transition:background .35s}
  .log-hd{display:flex;justify-content:space-between;align-items:center;padding:.6rem 1.1rem;border-bottom:1px solid var(--b2);background:var(--b1);font-family:'Orbitron';font-size:.42rem;font-weight:600;letter-spacing:2px;color:var(--tdim);flex-wrap:wrap;gap:.4rem}
  .log-hd span{color:var(--green)}
  .lrow{display:grid;grid-template-columns:70px 80px 1fr auto;align-items:start;gap:.9rem;padding:1rem 1.1rem;border-bottom:1px solid var(--b1);transition:background .15s;cursor:pointer}
  .lrow:hover{background:var(--b1)}.lrow:last-child{border:none}
  .lts{font-family:'Share Tech Mono';font-size:.5rem;color:var(--tdim);white-space:nowrap;padding-top:.14rem}
  .lsev{font-family:'Orbitron';font-size:.4rem;font-weight:700;padding:2px 8px;letter-spacing:1px;white-space:nowrap;align-self:start;justify-self:start}
  .sev-ok{background:rgba(41,194,112,.1);color:var(--green);border:1px solid rgba(41,194,112,.25)}
  .sev-info{background:rgba(61,143,224,.1);color:var(--blue);border:1px solid rgba(61,143,224,.2)}
  .lbody{min-width:0}
  .lbody strong{font-family:'Orbitron';font-size:.58rem;font-weight:700;color:var(--tx);letter-spacing:.5px;display:block}
  .lbody p{font-family:'Share Tech Mono';font-size:.62rem;color:var(--tdim);margin-top:.22rem;line-height:1.85}
  /* typed log expand */
  .l-expand{overflow:hidden;max-height:0;transition:max-height .35s ease}
  .l-expand.open{max-height:300px}
  .l-expand-inner{padding:.55rem 0 .1rem;margin-top:.5rem;border-top:1px solid var(--b1)}
  .l-expand-lines{font-family:'Share Tech Mono';font-size:.6rem;color:var(--tdim);line-height:1.9}
  .l-expand-cmd{color:var(--red);opacity:.8;font-family:'Share Tech Mono';font-size:.58rem;display:block;margin-bottom:.3rem}
  .l-expand-typed{color:var(--tdim)}
  .l-expand-cur{display:inline-block;width:7px;height:11px;background:var(--tx);vertical-align:middle;animation:blink .7s infinite;margin-left:2px}
  .lchev{font-family:'Share Tech Mono';font-size:.52rem;color:var(--tdim);align-self:start;padding-top:.14rem;transition:transform .3s;flex-shrink:0}
  .lchev.open{transform:rotate(180deg)}
  @media(max-width:540px){.lrow{grid-template-columns:1fr auto;gap:.3rem}.lts,.lsev{display:inline-block;margin-right:.4rem}}

  /* ── FADE ── */
  .fu{opacity:0;transform:translateY(14px);transition:opacity .5s ease,transform .5s ease}
  .fu.in{opacity:1;transform:none}

  /* ── FOOTER ── */
  .site-footer{border-top:1px solid var(--b1);padding:0.7rem 1.2rem;display:flex;align-items:center;justify-content:center}
  .footer-inner{max-width:1260px;width:100%;display:flex;justify-content:center;align-items:center;gap:0.6rem;flex-wrap:wrap}
  .footer-item{font-family:'Share Tech Mono',monospace;font-size:.52rem;color:var(--tdim);letter-spacing:1px}
  .footer-item.r{color:var(--red);opacity:.7}
  .footer-sep{color:var(--tfaint);opacity:.35}

  /* ── EASTER EGG ── */
  .egg-overlay{position:fixed;inset:0;z-index:2000;display:flex;align-items:center;justify-content:center;padding:1rem;background:var(--modal-bg);backdrop-filter:blur(4px);animation:fdin .18s ease}
  .egg-term{background:var(--bg2);border:1px solid var(--red);max-width:580px;width:100%;padding:1.6rem;position:relative;font-family:'Share Tech Mono',monospace;font-size:.72rem;line-height:1.95}
  .egg-term::before{content:'INTERACTIVE TERMINAL';position:absolute;top:-10px;left:14px;background:var(--bg2);padding:0 6px;font-family:'Orbitron';font-size:.4rem;font-weight:700;color:var(--red);letter-spacing:2px}
  .egg-hist{max-height:60vh;overflow-y:auto;scrollbar-width:none}
  .egg-hist::-webkit-scrollbar{display:none}
  .egg-input-line{display:flex;gap:.5rem;align-items:center;margin-bottom:.3rem}
  .egg-live{margin-top:.4rem;padding-top:.4rem;border-top:1px solid var(--b2)}
  .egg-cur{display:inline-block;width:.55em;height:.85em;background:var(--red);vertical-align:middle;margin-left:1px;animation:blink .8s infinite}
  .egg-prompt{color:var(--red);opacity:.85}.egg-typed{color:var(--tx)}
  .egg-line{display:flex;gap:.5rem}
  .egg-lt{color:var(--red);opacity:.7;flex-shrink:0}
  .egg-lt.err{color:var(--red);opacity:1}
  .egg-lv{color:var(--tx)}.egg-lv.hi{color:var(--green)}.egg-lv.dim{color:var(--tdim)}
  .egg-close{position:absolute;top:.6rem;right:.7rem;background:transparent;border:1px solid var(--b2);color:var(--tdim);font-family:'Orbitron';font-size:.4rem;padding:2px 8px;cursor:pointer;letter-spacing:2px;transition:all .2s}
  .egg-close:hover{border-color:var(--red);color:var(--red)}
  .egg-hint{position:fixed;bottom:1.4rem;left:50%;transform:translateX(-50%);font-family:'Share Tech Mono';font-size:.5rem;color:var(--tdim);letter-spacing:2px;pointer-events:none;animation:fdin .3s ease;white-space:nowrap}

  /* ── PRINT ── */
  @media print{
    .boot,.topbar,.ticker,.breadcrumb,.burger,.mob-menu,.scroll-bar{display:none!important}
    body{background:#fff;color:#000}.main{padding:1rem}@page{margin:15mm}
  }
  @media(max-width:700px){
    .top-nav{display:none}.burger{display:flex}
    .t-right .t-time{display:none}
    .main{padding:104px .9rem 4rem}
    .edu-timeline{padding-left:1.5rem}
  }
  @media(max-width:480px){
    .h-name{font-size:clamp(1.6rem,9vw,2.4rem)}
    .st{font-size:.58rem}
    .lrow{grid-template-columns:1fr auto}
  }
`;

// ─── RANDOM DECRYPT ───────────────────────────────────────────────────────────
function useRandomDecrypt(text, trigger, totalDuration = 3200) {
  const arr = Array.from(text);
  const [chars, setChars] = useState(() => arr.map(c => ({c: c===" "?" ":rg(), settled:false})));
  useEffect(() => {
    if (!trigger) return;
    let alive = true;
    const indices = arr.map((_,i)=>i).filter(i=>arr[i]!==" ");
    for (let i=indices.length-1;i>0;i--){const j=Math.floor(Math.random()*(i+1));[indices[i],indices[j]]=[indices[j],indices[i]];}
    const iv = setInterval(()=>{if(!alive)return;setChars(p=>p.map((ch,i)=>ch.settled?ch:{...ch,c:arr[i]===" "?" ":rg()}));},80);
    const ts = indices.map((idx,order)=>setTimeout(()=>{if(!alive)return;setChars(p=>{const n=[...p];n[idx]={c:arr[idx],settled:true};return n;});}, (order/indices.length)*totalDuration));
    const stop = setTimeout(()=>clearInterval(iv), totalDuration+100);
    return ()=>{alive=false;clearInterval(iv);ts.forEach(clearTimeout);clearTimeout(stop);};
  },[trigger]);
  return chars;
}

function HeroName({trigger}) {
  const chars = useRandomDecrypt("SATHYAJITH", trigger, 3400);
  const allSettled = chars.every(c=>c.settled);
  return (
    <h1 className="h-name">
      {chars.map((ch,i)=>{
        const isRed=i>=6;
        return <span key={i} className={isRed?`dc-red${ch.settled?" settled":""}` :`dc-white${ch.settled?" settled":""}`}
          style={ch.settled?{}:{color:isRed?"var(--tx)":"var(--red)"}}>{ch.c}</span>;
      })}
      {allSettled&&null}
    </h1>
  );
}

function DecryptLine({text,trigger,duration=2800}) {
  const chars = useRandomDecrypt(text,trigger,duration);
  return <>{chars.map((ch,i)=>(
    <span key={i} className={`dc-sub${ch.settled?" settled":""}`}
      style={ch.settled?{}:{color:"var(--red)",opacity:.7}}>{ch.c}</span>
  ))}</>;
}

// ─── SECTION NUMBER SCRAMBLE ──────────────────────────────────────────────────
function ScrambleNum({num, trigger}) {
  const [chars, setChars] = useState(Array.from(num));
  const [done,  setDone]  = useState(false);
  useEffect(()=>{
    if(!trigger||done) return;
    let alive=true, count=0;
    const iv=setInterval(()=>{
      if(!alive)return;
      count++;
      if(count>14){setChars(Array.from(num));setDone(true);clearInterval(iv);return;}
      setChars(Array.from(num).map(()=>DIGITS[Math.floor(Math.random()*DIGITS.length)]));
    },55);
    return()=>{alive=false;clearInterval(iv);};
  },[trigger]);
  return <div className="sn-wrap">{chars.map((c,i)=><span key={i} className={`sn-char${done?"":" scramble"}`}>{c}</span>)}</div>;
}

// ─── SLOT STATS ───────────────────────────────────────────────────────────────
function SlotReel({finalChar,delay,colorClass,spinDuration=1800}) {
  const COUNT=14,charH=32;
  const pool = isNaN(finalChar)?ALPHA:DIGITS;
  const [chars]=useState(()=>{const c=Array.from({length:COUNT},()=>pool[Math.floor(Math.random()*pool.length)]);c.push(finalChar);return c;});
  const [started,setStarted]=useState(false);
  useEffect(()=>{const t=setTimeout(()=>setStarted(true),delay);return()=>clearTimeout(t);},[delay]);
  return (
    <div className="sv-reel" style={{width:finalChar==="%"?"1.4rem":"1.2rem"}}>
      <div className="sv-inner" style={{transform:`translateY(${started?-(COUNT*charH):0}px)`,transition:started?`transform ${spinDuration}ms cubic-bezier(.12,.85,.2,1)`:"none"}}>
        {chars.map((c,i)=>(
          <span key={i} className={`sv-char${i===chars.length-1?` ${colorClass}`:""}`}
            style={i<chars.length-1?{color:"var(--tfaint)",opacity:.4}:{}}>{c}</span>
        ))}
      </div>
    </div>
  );
}

function SlotStat({value,colorClass="",stagger=120,spinDuration=1800}) {
  return <div className="sv-wrap">{Array.from(String(value)).map((ch,i)=>(
    <SlotReel key={i} finalChar={ch} delay={i*stagger} colorClass={colorClass} spinDuration={spinDuration}/>
  ))}</div>;
}

function StatsBlock({trigger}) {
  return (
    <div className="stats">
      <div className="scell" data-l="SYSTEM HEALTH">
        {trigger?<SlotStat value="98%" colorClass="g" stagger={140} spinDuration={2000}/>:<div className="sv-wrap"><span className="sv-char g" style={{opacity:.2}}>--</span></div>}
        <div className="ssub">ALL MODULES PASS</div>
        <div className="sbar"><div className="sbar-f" style={{width:trigger?"98%":"0%",background:"var(--green)"}}/></div>
      </div>
      <div className="scell" data-l="BATCH YEAR">
        {trigger?<SlotStat value="2027" stagger={160} spinDuration={2100}/>:<div className="sv-wrap"><span className="sv-char" style={{opacity:.2}}>----</span></div>}
        <div className="ssub">EXPECTED GRADUATION</div>
        <div className="sbar"><div className="sbar-f" style={{width:trigger?"50%":"0%",background:"var(--blue)"}}/></div>
      </div>
      <div className="scell" data-l="PROJECTS">
        {trigger?<SlotStat value="06" stagger={200} spinDuration={1900}/>:<div className="sv-wrap"><span className="sv-char" style={{opacity:.2}}>--</span></div>}
        <div className="ssub">0 OPEN DEFECTS</div>
        <div className="sbar"><div className="sbar-f" style={{width:trigger?"60%":"0%",background:"var(--teal)"}}/></div>
      </div>
      <div className="scell" data-l="NCC RANK">
        {trigger?<SlotStat value="SGT" colorClass="a" stagger={130} spinDuration={1600}/>:<div className="sv-wrap"><span className="sv-char a" style={{opacity:.2}}>---</span></div>}
        <div className="ssub">B-CERT GRADE A</div>
        <div className="sbar"><div className="sbar-f" style={{width:trigger?"75%":"0%",background:"var(--amber)"}}/></div>
      </div>
    </div>
  );
}

// ─── SCROLL HOOKS ─────────────────────────────────────────────────────────────
function useScrollTrigger() {
  const ref=useRef(), [fired,setFired]=useState(false);
  useEffect(()=>{
    const el=ref.current; if(!el) return;
    const io=new IntersectionObserver(([e])=>{if(e.isIntersecting){el.classList.add("in");setFired(true);io.disconnect();}},{rootMargin:"0px 0px -15% 0px"});
    io.observe(el); return()=>io.disconnect();
  },[]);
  return [ref,fired];
}

function useScrollTriggerEarly() {
  const ref=useRef(), [fired,setFired]=useState(false);
  useEffect(()=>{
    const el=ref.current; if(!el) return;
    const io=new IntersectionObserver(([e])=>{if(e.isIntersecting){el.classList.add("in");setFired(true);io.disconnect();}},{rootMargin:"0px 0px -5% 0px"});
    io.observe(el); return()=>io.disconnect();
  },[]);
  return [ref,fired];
}

function useFU() {
  const ref=useRef();
  useEffect(()=>{
    const el=ref.current; if(!el) return;
    const io=new IntersectionObserver(([e])=>{if(e.isIntersecting){el.classList.add("in");io.disconnect();}},{rootMargin:"0px 0px -8% 0px"});
    io.observe(el); return()=>io.disconnect();
  },[]);
  return ref;
}

// ─── SECTION HEAD ─────────────────────────────────────────────────────────────
function SH({num,title,tag,id}) {
  const ref=useRef(), [visible,setVisible]=useState(false);
  useEffect(()=>{
    const el=ref.current; if(!el) return;
    const io=new IntersectionObserver(([e])=>{if(e.isIntersecting){el.classList.add("in");setVisible(true);io.disconnect();}},{rootMargin:"0px 0px -8% 0px"});
    io.observe(el); return()=>io.disconnect();
  },[]);
  return (
    <div className="sh fu" ref={ref} id={id}>
      <ScrambleNum num={num} trigger={visible}/>
      <div className="st">{title}</div>
      <div className="sl"/>
      <div className="stag">{tag}</div>
    </div>
  );
}

// ─── BIO TERMINAL ────────────────────────────────────────────────────────────
function BioTerminal({active}) {
  const [vis,setVis]=useState([]); const [done,setDone]=useState(false);
  useEffect(()=>{
    if(!active) return;
    setVis([]); setDone(false);
    BIO_LINES.forEach((l,i)=>setTimeout(()=>setVis(p=>[...p,i]),l.delay));
    setTimeout(()=>setDone(true),BIO_LINES[BIO_LINES.length-1].delay+400);
  },[active]);
  return (
    <div className="bio-term">
      {BIO_LINES.map((l,i)=>vis.includes(i)&&(
        <div key={i} className="bio-line">
          <span className="bio-prompt">{l.prompt}</span>
          {l.cmd&&<span className="bio-cmd">{l.cmd}</span>}
          {l.out!==undefined&&<span className={`bio-out${l.hi?" hi":l.dim?" dim":""}`}>{l.out||"\u00a0"}</span>}
        </div>
      ))}
      {!done&&vis.length>0&&<div className="bio-line"><span className="bio-cur"/></div>}
    </div>
  );
}

// ─── CONTACT TERMINAL ─────────────────────────────────────────────────────────
function ContactTerminal({active}) {
  const [vis,setVis]=useState([]);
  useEffect(()=>{
    if(!active) return;
    setVis([]);
    CT_LINES.forEach((l,i)=>setTimeout(()=>setVis(p=>[...p,i]),l.delay));
  },[active]);
  return (
    <div className="cterm">
      {CT_LINES.map((l,i)=>vis.includes(i)&&(
        <div key={i} className="cline">
          <span className="cprompt">{l.prompt}</span>
          {l.cmd&&<span className="ccmd">{l.cmd}</span>}
          {l.out&&<span className={`cout${l.hi?" hi":""}`}>{l.out}</span>}
        </div>
      ))}
      {vis.length>0&&<div className="cline"><span className="cprompt">OUT &gt;</span><span className="ccur"/></div>}
    </div>
  );
}

// ─── MODAL ────────────────────────────────────────────────────────────────────
function ModalTyped({text}) {
  const [shown, setShown] = useState("");
  useEffect(()=>{
    let i=0;
    const iv=setInterval(()=>{
      i++;
      setShown(text.slice(0,i));
      if(i>=text.length) clearInterval(iv);
    },22);
    return()=>clearInterval(iv);
  },[text]);
  return <span>{shown}<span className="bio-cur" style={{opacity:shown.length<text.length?1:0}}/></span>;
}


function ModalFixed({p,onClose}) {
  const titleChars = useRandomDecrypt(p.title, true, 1800);
  const [phase, setPhase] = useState(0);

  useEffect(()=>{
    const t1=setTimeout(()=>setPhase(1),440);
    const t2=setTimeout(()=>setPhase(2),700);
    const t3=setTimeout(()=>setPhase(3),920);
    const detailTime=p.detail.length*22+200;
    const t4=setTimeout(()=>setPhase(4),920+detailTime);
    const t5=setTimeout(()=>setPhase(5),920+detailTime+p.tags.length*80+300);
    return()=>[t1,t2,t3,t4,t5].forEach(clearTimeout);
  },[]);

  useEffect(()=>{
    const h=e=>{if(e.key==="Escape")onClose();};
    window.addEventListener("keydown",h);
    return()=>window.removeEventListener("keydown",h);
  },[onClose]);

  return (
    <div className="modal-overlay" onClick={e=>e.target.className==="modal-overlay"&&onClose()}>
      <div className="modal">
        <div className="modal-grid"/>
        <div className="modal-border"/>

        <button className="modal-close" onClick={onClose}>[ ESC ]</button>
        {phase>=1&&<div className="modal-chip">[ {p.id} ] // {p.type}</div>}
        {phase>=1&&<div className="modal-period">{p.period}</div>}
        <div className="modal-title">
          {titleChars.map((ch,i)=>(
            <span key={i} className={`dc-modal${ch.settled?" s":""}${ch.c===" "?" sp":""}`}>{ch.c}</span>
          ))}
        </div>
        <div className={`modal-rule${phase>=2?" drawn":""}`}/>
        <div className="modal-detail">{phase>=3&&<ModalTyped text={p.detail}/>}</div>
        <div className="modal-tags">
          {p.tags.map((t,i)=>(
            <span key={t} className={`ptag modal-tag${phase>=4?" in":""}`}
              style={{transitionDelay:`${i*80}ms`}}>{t}</span>
          ))}
        </div>
        {phase>=5&&p.link&&(
          <a href={p.link} target="_blank" rel="noreferrer" className="modal-link">● {p.status}</a>
        )}
      </div>
    </div>
  );
}

// ─── PROJECT CARD ─────────────────────────────────────────────────────────────
function ProjectCard({p}) {
  const [open, setOpen] = useState(false);
  return (<>
    <div className="pc" onClick={()=>setOpen(true)} tabIndex={0} role="button"
      onKeyDown={e=>e.key==="Enter"&&setOpen(true)}>
      <div className="pid">{p.id} // {p.period} // {p.type}</div>
      <div className="ptitle">{p.title}</div>
      <div className="pdesc">{p.desc}</div>
      <div className="pfoot">
        <div className="ptags">{p.tags.map(t=><span key={t} className="ptag">{t}</span>)}</div>
        <span className="pstat" style={{color:p.sc}}>
          {p.pulse?<span className={`pstat-dot pulse-${p.pulse}`}/>:<span>●&nbsp;</span>}
          {p.status}
        </span>
      </div>
      <div className="popen">▸ OPEN RECORD</div>
    </div>
    {open&&<ModalFixed key={p.id} p={p} onClose={()=>setOpen(false)}/>}
  </>);
}

// ─── LOG ROW (typed expand) ───────────────────────────────────────────────────
function LogRow({l}) {
  const [open,    setOpen]    = useState(false);
  const [typed,   setTyped]   = useState("");
  const [cmdDone, setCmdDone] = useState(false);
  const timerRef = useRef([]);

  const clearTimers = () => { timerRef.current.forEach(clearTimeout); timerRef.current=[]; };

  const handleOpen = () => {
    if (open) { setOpen(false); setTyped(""); setCmdDone(false); clearTimers(); return; }
    setOpen(true); setTyped(""); setCmdDone(false);
    const cmd = `SYS > query --log-id ${l.ts} --verbose`;
    // type the command first
    [...cmd].forEach((_,i)=>{
      const t=setTimeout(()=>setCmdDone(i===cmd.length-1),i*28+100);
      timerRef.current.push(t);
    });
    // then type detail char by char
    const startDelay = cmd.length*28+280;
    [...l.expand].forEach((_,i)=>{
      const t=setTimeout(()=>setTyped(l.expand.slice(0,i+1)), startDelay+i*20);
      timerRef.current.push(t);
    });
  };

  useEffect(()=>()=>clearTimers(),[]);

  return (
    <div className="lrow" onClick={handleOpen} tabIndex={0} onKeyDown={e=>e.key==="Enter"&&handleOpen()}>
      <div className="lts">{l.ts}</div>
      <div className={`lsev sev-${l.sc}`}>{l.sev}</div>
      <div className="lbody">
        <strong>{l.title}</strong>
        <p>{l.body}</p>
        <div className={`l-expand${open?" open":""}`}>
          <div className="l-expand-inner">
            <span className="l-expand-cmd">
              {`SYS > query --log-id ${l.ts} --verbose`}
            </span>
            <div className="l-expand-lines">
              <span className="l-expand-typed">{typed}</span>
              {typed.length < l.expand.length && cmdDone && <span className="l-expand-cur"/>}
            </div>
          </div>
        </div>
      </div>
      <div className={`lchev${open?" open":""}`}>▾</div>
    </div>
  );
}

// ─── EASTER EGG ───────────────────────────────────────────────────────────────
function EasterEgg({cmd:initCmd, onClose}) {
  const [input,   setInput]   = useState("");
  const [history, setHistory] = useState(()=>{
    const first = Object.values(CMDS).find(c=>c.input.startsWith(initCmd.toLowerCase().split(" ")[0]))
      || {input:initCmd, lines:[{t:"OUT >",v:` command not found: ${initCmd}  (type 'help')`,dim:true}]};
    return [{cmd:first.input, lines:first.lines}];
  });
  const bottomRef = useRef();

  useEffect(()=>{
    if(bottomRef.current) bottomRef.current.scrollIntoView({block:"nearest"});
  },[history, input]);

  useEffect(()=>{
    const h=e=>{
      if(e.key==="Escape"){onClose();return;}
      if(e.key==="Enter"){
        const trimmed=input.trim();
        if(!trimmed) return;
        if(trimmed.toLowerCase()==="clear"){setHistory([]);setInput("");return;}
        const lower=trimmed.toLowerCase();
        const profane=Object.keys(PROFANITY).find(w=>lower.split(/\s+/).some(token=>token.includes(w)));
        const match=profane
          ? {input:trimmed, lines:PROFANITY[profane]}
          : Object.values(CMDS).find(c=>c.input.startsWith(lower.split(" ")[0]));
        const result=match||{input:trimmed,lines:[{t:"OUT >",v:` command not found: ${trimmed}  (type 'help')`,dim:true}]};
        setHistory(h=>[...h,{cmd:trimmed,lines:result.lines}]);
        setInput("");
        return;
      }
      if(e.key==="Backspace"){setInput(p=>p.slice(0,-1));return;}
      if(e.key.length===1 && !e.ctrlKey && !e.metaKey){setInput(p=>p+e.key);}
    };
    window.addEventListener("keydown",h);
    return()=>window.removeEventListener("keydown",h);
  },[input,onClose]);

  return (
    <div className="egg-overlay" onClick={e=>e.target.className==="egg-overlay"&&onClose()}>
      <div className="egg-term">
        <button className="egg-close" onClick={onClose}>ESC</button>
        <div className="egg-hist">
          {history.map((entry,ei)=>(
            <div key={ei}>
              <div className="egg-input-line">
                <span className="egg-prompt">SYS &gt;</span>
                <span className="egg-typed">&nbsp;{entry.cmd}</span>
              </div>
              {entry.lines.map((l,i)=>(
                <div key={i} className="egg-line">
                  <span className="egg-lt">{l.t}</span>
                  <span className={`egg-lv${l.hi?" hi":l.dim?" dim":""}`}>{l.v||"\u00a0"}</span>
                </div>
              ))}
            </div>
          ))}
          {/* live input prompt */}
          <div className="egg-input-line egg-live">
            <span className="egg-prompt">SYS &gt;</span>
            <span className="egg-typed">&nbsp;{input}</span>
            <span className="egg-cur"/>
          </div>
          <div ref={bottomRef}/>
        </div>
      </div>
    </div>
  );
}

// ─── BOOT SCREEN ─────────────────────────────────────────────────────────────
function BootScreen({onDone}) {
  const [lines, setLines] = useState([]);
  const [pct,   setPct]   = useState(0);
  const linesRef = useRef();
  const wipeRef  = useRef();
  const maskRef  = useRef();
  const started  = useRef(false);

  useEffect(()=>{
    if(started.current) return;
    started.current = true;
    BOOT.forEach(l=>setTimeout(()=>{
      setLines(p=>[...p,l]);
      if(linesRef.current) linesRef.current.scrollTop=linesRef.current.scrollHeight;
    },l.t));
    const iv=setInterval(()=>setPct(p=>Math.min(100,p+(p<75?1.8:p<92?.55:.15))),35);
    const TOTAL=BOOT[BOOT.length-1].t+300;
    setTimeout(()=>{
      clearInterval(iv); setPct(100);
      let pos=0;
      const wi=setInterval(()=>{
        pos+=2.2;
        if(wipeRef.current) wipeRef.current.style.setProperty("--y",`${pos}%`);
        if(maskRef.current) maskRef.current.style.setProperty("--y",`${pos}%`);
        if(pos>=103){clearInterval(wi);onDone();}
      },12);
    },TOTAL);
    return()=>clearInterval(iv);
  },[]);

  // also scroll when lines change
  useEffect(()=>{
    if(linesRef.current) linesRef.current.scrollTop=linesRef.current.scrollHeight;
  },[lines]);

  return (<>
    <div className="boot">
      <div className="boot-brand">ELEC-SYS DIAGNOSTIC TERMINAL</div>
      <div className="boot-lines" ref={linesRef}>
        {lines.map((l,i)=>(
          <div key={i} className={["bl show",l.ok?(l.txt.startsWith("[")&&l.txt.endsWith("]")?"ok-box":"ok"):"",l.cls||""].filter(Boolean).join(" ")}>
            {l.txt||"\u00a0"}
          </div>
        ))}
        <div className="bl show"><span className="bcur"/></div>
      </div>
      <div className="bbar-wrap">
        <div className="bbar-lbl">LOADING PORTFOLIO</div>
        <div className="bbar"><div className="bbar-fill" style={{width:`${pct}%`}}/></div>
        <div className="bbar-pct">{Math.floor(pct)}%</div>
      </div>
    </div>
    <div className="wipe" ref={wipeRef} style={{"--y":"0%"}}>
      <div className="wipe-mask" ref={maskRef} style={{"--y":"0%"}}/>
      <div className="wipe-line"/>
    </div>
  </>);
}

// ─── APP ─────────────────────────────────────────────────────────────────────
export default function App() {
  const [booted,    setBooted]    = useState(false);
  const [heroReady, setHeroReady] = useState(false);
  const [time,      setTime]      = useState("--:--:--");
  const [menuOpen,  setMenuOpen]  = useState(false);
  const [active,    setActive]    = useState("about");
  const [scrollPct, setScrollPct] = useState(0);
  const [breadcrumb,setBreadcrumb]= useState("/sathyajith/about");
  const [lightTheme,setLightTheme]= useState(false);
  const [eggCmd,    setEggCmd]    = useState(null);
  const [eggBuf,    setEggBuf]    = useState("");
  const [eggHint,   setEggHint]   = useState(false);

  const [bioRef, bioActive] = useScrollTriggerEarly();
  const [ctRef,  ctActive]  = useScrollTrigger();

  // Clock
  useEffect(()=>{
    const iv=setInterval(()=>{
      const d=new Date();
      setTime(`${String(d.getHours()).padStart(2,"0")}:${String(d.getMinutes()).padStart(2,"0")}:${String(d.getSeconds()).padStart(2,"0")}`);
    },1000);
    return()=>clearInterval(iv);
  },[]);

  const handleBooted=useCallback(()=>{setBooted(true);setTimeout(()=>setHeroReady(true),150);},[]);

  // Scroll progress + active nav + breadcrumb
  useEffect(()=>{
    const handler=()=>{
      const doc=document.documentElement;
      setScrollPct(Math.min(100,(window.scrollY/(doc.scrollHeight-doc.clientHeight))*100));
      for(let i=NAV_IDS.length-1;i>=0;i--){
        const el=document.getElementById(NAV_IDS[i]);
        if(el&&el.getBoundingClientRect().top<=140){
          setActive(NAV_IDS[i]);
          setBreadcrumb(NAV_PATHS[NAV_IDS[i]]);
          break;
        }
      }
    };
    addEventListener("scroll",handler,{passive:true});
    return()=>removeEventListener("scroll",handler);
  },[]);

  // Light theme toggle
  useEffect(()=>{
    document.body.classList.toggle("light",lightTheme);
  },[lightTheme]);

  useEffect(()=>{document.title="Sathyajith";},[]);

  // Keyboard easter egg
  useEffect(()=>{
    if(!booted) return;
    let buf="", hintTimer=null;
    const KNOWN=["help","whoami","ls","ssh","ping","sudo"];
    const handler=e=>{
      if(["INPUT","TEXTAREA"].includes(document.activeElement.tagName)) return;
      if(eggCmd!==null) return;
      if(e.key==="Escape"){buf="";setEggBuf("");setEggHint(false);return;}
      if(e.key==="Enter"){if(buf.trim()){setEggCmd(buf.trim());buf="";setEggBuf("");setEggHint(false);}return;}
      if(e.key==="Backspace"){buf=buf.slice(0,-1);setEggBuf(buf);return;}
      if(e.key.length===1){
        buf+=e.key; setEggBuf(buf); setEggHint(true);
        clearTimeout(hintTimer);
        hintTimer=setTimeout(()=>{buf="";setEggBuf("");setEggHint(false);},3000);
        if(KNOWN.includes(buf.toLowerCase())){
          clearTimeout(hintTimer);
          setEggCmd(buf.trim());buf="";setEggBuf("");setEggHint(false);
        }
      }
    };
    window.addEventListener("keydown",handler);
    return()=>window.removeEventListener("keydown",handler);
  },[booted,eggCmd]);

  const jump=useCallback(id=>{
    const el=document.getElementById(id);
    if(el){window.scrollTo({top:el.getBoundingClientRect().top+window.scrollY-NAV_OFFSET,behavior:"smooth"});}
    setMenuOpen(false);
  },[]);

  return (<>
    <style>{css}</style>
    {!booted&&<BootScreen onDone={handleBooted}/>}

    <div className="scroll-bar"><div className="scroll-fill" style={{height:`${scrollPct}%`}}/></div>

    <header className="topbar">
      <div className="t-logo">DIAG//SYS</div>
      <div className="t-sep"/>
      <div className="t-stat"><div className="tdot g"/>POWER OK</div>
      <div className="t-stat"><div className="tdot r"/>DIAGNOSTIC</div>
      <nav className="top-nav">
        {NAV_IDS.map(id=>(
          <button key={id} className={`tnbtn${active===id?" active":""}`} onClick={()=>jump(id)}>
            {id.toUpperCase()}
          </button>
        ))}
      </nav>
      <div className="t-right">
        <div className="t-time">{time}</div>
        <button className="theme-btn" onClick={()=>setLightTheme(l=>!l)}>
          {lightTheme?"DARK":"LITE"}
        </button>
        <button className={`burger${menuOpen?" open":""}`} onClick={()=>setMenuOpen(o=>!o)} aria-label="Menu">
          <span/><span/><span/>
        </button>
      </div>
    </header>

    <div className="breadcrumb">
      <span className="bc-prompt">&gt;</span>
      <span style={{color:"var(--tdim)",fontFamily:"'Share Tech Mono',monospace",fontSize:".44rem",letterSpacing:"1px"}}>&nbsp;{breadcrumb}</span>
      <span className="bc-cursor"/>
    </div>

    <div className={`mob-menu${menuOpen?" open":""}`}>
      {NAV_IDS.map(id=>(
        <button key={id} className={`tnbtn${active===id?" active":""}`} onClick={()=>jump(id)}>
          {id.toUpperCase()}
        </button>
      ))}
    </div>

    <div className="ticker" aria-hidden="true">
      <div className="t-badge">▶ LIVE</div>
      <div className="t-scroll">
        <div className="t-inner">
          {[...TICKS,...TICKS].map((t,i)=><span key={i}>{t}&nbsp;<span className="hi">NOMINAL</span></span>)}
        </div>
      </div>
    </div>

    <main className="main">

      {/* HERO */}
      <div className="hero fu in" id="about">
        <div>
          <div className="h-eye">// UNIT-ID: EEE-PSG-2023 // DIAGNOSTIC REPORT //</div>
          {heroReady?<HeroName trigger={heroReady}/>:<h1 className="h-name" style={{opacity:0}}>SATHYAJITH</h1>}
          <div className="h-sub">
            {heroReady
              ?<><DecryptLine text="B.E. ELECTRICAL & ELECTRONICS ENGINEERING" trigger={heroReady} duration={2600}/><br/><DecryptLine text="PSG COLLEGE OF TECHNOLOGY — COIMBATORE" trigger={heroReady} duration={2400}/></>
              :<span style={{opacity:0}}>B.E. ELECTRICAL &amp; ELECTRONICS ENGINEERING</span>}
          </div>
        </div>
        <div className="h-meta">
          <div className="h-badge">INSTITUTION<br/><span className="g">PSG TECH</span></div>
          <div className="h-badge">PROJECTS<br/><span className="g">6 SHIPPED</span></div>
          <div className="h-badge">AWARD<br/><span className="r">DANFOSS 2026 ★</span></div>
        </div>
      </div>

      <StatsBlock trigger={heroReady}/>

      {/* BIO */}
      <SH num="00" title="UNIT PROFILE" tag="ABOUT" id="bio"/>
      <div className="fu" ref={bioRef}><BioTerminal active={bioActive}/></div>

      {/* EDUCATION */}
      <SH num="01" title="EDUCATION RECORDS" tag="ACADEMIC" id="education"/>
      <div className="edu-timeline fu" ref={useFU()}>
        {EDU.map((e)=>(
          <div key={e.id} className="edu-item">
            <div className="edu-card" data-id={e.id}>
              <div className="etitle">{e.title}</div>
              <div className="einst">{e.inst}</div>
              <div className="eperiod">{e.period}</div>
              {e.note&&<div className="enote">{e.note}</div>}
            </div>
          </div>
        ))}
      </div>

      {/* PROJECTS */}
      <SH num="02" title="DEPLOYED SYSTEMS" tag="PROJECTS" id="projects"/>
      <div className="pgrid fu" ref={useFU()}>
        {PROJECTS.map(p=><ProjectCard key={p.id} p={p}/>)}
      </div>

      {/* LOG */}
      <SH num="03" title="SYSTEM EVENT LOG" tag="ACHIEVEMENTS" id="log"/>
      <div className="log fu" ref={useFU()}>
        <div className="log-hd">
          <span>SYSTEM LOG — UNIT: SATHYAJITH // PSG-EEE-2023</span>
          <span>{LOG.length} ENTRIES</span>
        </div>
        {LOG.map((l,i)=><LogRow key={i} l={l}/>)}
      </div>

      {/* CONTACT */}
      <SH num="04" title="ESTABLISH CONNECTION" tag="CONTACT" id="contact"/>
      <div className="contact-wrap fu" ref={ctRef}>
        <ContactTerminal active={ctActive}/>
        <div className="soc-row">
          {SOCIALS.map(s=>(
            <a key={s.label} href={s.href} target="_blank" rel="noreferrer"
              className="soc-btn" aria-label={s.label} data-label={s.label}>{s.icon}</a>
          ))}
        </div>
      </div>

    </main>

    <footer className="site-footer">
      <div className="footer-inner">
        <span className="footer-item r">SATHYAJITH</span>
        <span className="footer-item">© 2026</span>
      </div>
    </footer>

    {eggHint&&!eggCmd&&<div className="egg-hint">SYS &gt; {eggBuf}_</div>}
    {eggCmd&&<EasterEgg key={eggCmd} cmd={eggCmd} onClose={()=>setEggCmd(null)}/>}
  </>);
}
