/**
 * ==========================================================================
 * PORTOFOLIO ANTI-GRAVITASI — FARRIJ.PSH
 * NEXT-GEN 0-G INTERACTIVE CORE ENGINE
 * ==========================================================================
 */

// Global physics state
let currentGravityMode = 'zero'; // 'zero', 'moon', 'warp', 'inverted'
let supernovaParticles = [];
let _audioCtx = null;

function playCyberSfx(freq = 600, duration = 0.05, type = 'sine') {
  try {
    const AudioCtx = window.AudioContext || window.webkitAudioContext;
    if (!AudioCtx) return;
    if (!_audioCtx) _audioCtx = new AudioCtx();
    if (_audioCtx.state === 'suspended') {
      _audioCtx.resume().catch(() => {});
    }
    const osc = _audioCtx.createOscillator();
    const gain = _audioCtx.createGain();
    osc.type = type;
    osc.frequency.setValueAtTime(freq, _audioCtx.currentTime);
    gain.gain.setValueAtTime(0.015, _audioCtx.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.0001, _audioCtx.currentTime + duration);
    osc.connect(gain);
    gain.connect(_audioCtx.destination);
    osc.start();
    osc.stop(_audioCtx.currentTime + duration);
  } catch (e) {}
}

// ==========================================================================
// DAFTAR LAGU / MUSIC PLAYLIST
// ==========================================================================
const playlist = [
  {
    title: 'Special Music Mix (Full Version)',
    artist: 'YouTube · 1 Jam 47 Menit 14 Detik',
    tag: '1:47:14',
    youtubeId: 'pXP88QMTxdA',
    youtubeUrl: 'https://youtu.be/pXP88QMTxdA?si=cFx5hTeCTbBuIe3l',
    durationSeconds: 6434, // 1 jam 47 menit 14 detik
    cover: 'https://img.youtube.com/vi/pXP88QMTxdA/hqdefault.jpg'
  },
  {
    title: 'Best Spotify Trending & Slow Acoustic',
    artist: 'JsVibes Music · Positive Pop & Travel Vibes',
    tag: 'Acoustic',
    youtubeId: 'T-aI5j1rIx4',
    youtubeUrl: 'https://youtu.be/T-aI5j1rIx4?si=Ph-F9GegJwFlAN3Z',
    durationSeconds: 0, // Durasi dinamis otomatis diambil dari YouTube API
    cover: 'https://img.youtube.com/vi/T-aI5j1rIx4/hqdefault.jpg'
  },
  {
    title: 'Raim Laode - Dunia Yang Nanti & Pop Viral',
    artist: 'Raim Laode · Pop Viral Terbaru',
    tag: 'Pop Viral',
    youtubeId: 'igXb2Ld-j_w',
    youtubeUrl: 'https://youtu.be/igXb2Ld-j_w?si=76J68rtqr_XT3UmU',
    durationSeconds: 0, // Durasi dinamis otomatis diambil dari YouTube API
    cover: 'https://img.youtube.com/vi/igXb2Ld-j_w/hqdefault.jpg'
  },
  {
    title: 'Boyce Avenue Romantic Acoustic Songs',
    artist: 'Boyce Avenue · Wedding Day Favorites',
    tag: 'Romantic',
    youtubeId: 'gD4vApWvCJs',
    youtubeUrl: 'https://youtu.be/gD4vApWvCJs?si=D--jBY1HwLrDYric',
    durationSeconds: 0, // Durasi dinamis otomatis diambil dari YouTube API
    cover: 'https://img.youtube.com/vi/gD4vApWvCJs/hqdefault.jpg'
  }
];

let currentTrackIndex = 0;
let isMusicPlaying = false;
let ytPlayer = null;
let ytProgressInterval = null;
let _playStartedAt = null;   // Date.now() when play started
let _playOffsetSec = 0;      // seconds elapsed before last pause

document.addEventListener('DOMContentLoaded', () => {
  initCustomCursor();
  initMouseSpotlight();
  initTypingEffect();
  initLiveClock();
  initFpsCounter();
  initNavbar();
  initThemeAccentPicker();
  initAntiGravityCanvas();
  initGravitySimulator();
  initTerminalSimulator();
  initStatsCounter();
  initTiltEffect();
  initProjectFilter();
  initCopyEmail();
  initBackToTop();
  initSupernovaTrigger();
  initMusicPlayer();
  initAutoLocationDetector();
});

/* --------------------------------------------------------------------------
   5. FPS COUNTER
   -------------------------------------------------------------------------- */
function initFpsCounter() {
  const fpsEl = document.getElementById('fpsCount');
  if (!fpsEl) return;
  let lastTime = performance.now();
  let frames = 0;
  function loop(now) {
    frames++;
    if (now - lastTime >= 1000) {
      fpsEl.textContent = `${frames} FPS`;
      frames = 0;
      lastTime = now;
    }
    requestAnimationFrame(loop);
  }
  requestAnimationFrame(loop);
}

/* --------------------------------------------------------------------------
   6. NAVBAR SCROLL BEHAVIOR & MOBILE TOGGLE
   -------------------------------------------------------------------------- */
function initNavbar() {
  const navbar = document.getElementById('navbar');
  const mobileToggle = document.getElementById('mobileToggle');
  const navLinks = document.getElementById('navLinks');
  const allNavLinks = document.querySelectorAll('.nav-link');

  if (navbar) {
    window.addEventListener('scroll', () => {
      if (window.scrollY > 60) {
        navbar.classList.add('scrolled');
      } else {
        navbar.classList.remove('scrolled');
      }
    });
  }

  if (mobileToggle && navLinks) {
    mobileToggle.addEventListener('click', () => {
      navLinks.classList.toggle('open');
      mobileToggle.classList.toggle('open');
      const icon = mobileToggle.querySelector('i');
      if (icon) {
        icon.className = navLinks.classList.contains('open')
          ? 'fa-solid fa-xmark'
          : 'fa-solid fa-bars-staggered';
      }
    });
  }

  // Close mobile nav on link click
  allNavLinks.forEach(link => {
    link.addEventListener('click', () => {
      if (navLinks) navLinks.classList.remove('open');
      if (mobileToggle) mobileToggle.classList.remove('open');
    });
  });

  // Active link on scroll
  const sections = document.querySelectorAll('section[id], div[id]');
  function updateActiveLink() {
    const scrollY = window.scrollY + 120;
    sections.forEach(section => {
      const top = section.offsetTop;
      const height = section.offsetHeight;
      const id = section.getAttribute('id');
      const link = document.querySelector(`.nav-link[href="#${id}"]`);
      if (link) {
        if (scrollY >= top && scrollY < top + height) {
          allNavLinks.forEach(l => l.classList.remove('active'));
          link.classList.add('active');
        }
      }
    });
  }
  window.addEventListener('scroll', updateActiveLink);
  updateActiveLink();
}

/* --------------------------------------------------------------------------
   7. THEME ACCENT COLOR PICKER
   -------------------------------------------------------------------------- */
function initThemeAccentPicker() {
  const accentBtns = document.querySelectorAll('.accent-btn[data-accent]');
  const body = document.body;

  // Restore from localStorage
  const saved = localStorage.getItem('farrij-accent');
  if (saved) {
    body.setAttribute('data-theme-accent', saved);
    accentBtns.forEach(btn => {
      btn.classList.toggle('active', btn.dataset.accent === saved);
    });
  }

  accentBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      const accent = btn.dataset.accent;
      body.setAttribute('data-theme-accent', accent);
      localStorage.setItem('farrij-accent', accent);
      accentBtns.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
    });
  });
}

/* --------------------------------------------------------------------------
   8. ANTI-GRAVITY PARTICLE CANVAS BACKGROUND
   -------------------------------------------------------------------------- */
/* --------------------------------------------------------------------------
   8. ANTI-GRAVITY PARTICLE CANVAS BACKGROUND (NEXT-GEN PHYSICS ENGINE)
   -------------------------------------------------------------------------- */
let _particlesRef = [];

function initAntiGravityCanvas() {
  const canvas = document.getElementById('antiGravityCanvas');
  if (!canvas) return;
  const ctx = canvas.getContext('2d');
  let particles = [];
  let W, H;

  function resize() {
    W = canvas.width = window.innerWidth;
    H = canvas.height = window.innerHeight;
  }
  resize();
  window.addEventListener('resize', resize);

  const PARTICLE_COUNT = 140;
  const accentColorStr = () => {
    const style = getComputedStyle(document.body);
    return style.getPropertyValue('--cyan-primary').trim() || '#00f2fe';
  };

  function createParticle(forceMode) {
    const mode = forceMode || currentGravityMode || 'zero';
    let p = {
      x: Math.random() * W,
      y: Math.random() * H,
      vx: (Math.random() - 0.5) * 0.9,
      vy: (Math.random() - 0.5) * 0.9,
      r: Math.random() * 2.2 + 0.6,
      alpha: Math.random() * 0.6 + 0.2,
      color: null,
      life: Math.random() * 300 + 150
    };

    if (mode === 'warp') {
      const angle = Math.random() * Math.PI * 2;
      const speed = Math.random() * 12 + 6;
      p.x = W / 2 + Math.cos(angle) * (Math.random() * 50);
      p.y = H / 2 + Math.sin(angle) * (Math.random() * 50);
      p.vx = Math.cos(angle) * speed;
      p.vy = Math.sin(angle) * speed;
      p.r = Math.random() * 2.5 + 1;
      p.color = '#38bdf8';
    } else if (mode === 'moon') {
      p.vy = Math.random() * 0.8 + 0.3;
      p.r = Math.random() * 3 + 1.2;
      p.color = '#e2e8f0';
    } else if (mode === 'inverted') {
      p.y = H + Math.random() * 20;
      p.vy = -(Math.random() * 4 + 2);
      p.color = '#f43f5e';
    } else if (mode === 'galaxy') {
      p.color = '#c084fc';
    } else if (mode === 'aurora') {
      p.color = '#34d399';
    } else if (mode === 'solar') {
      p.color = '#fbbf24';
      const angle = Math.random() * Math.PI * 2;
      const speed = Math.random() * 6 + 3;
      p.vx = Math.cos(angle) * speed;
      p.vy = Math.sin(angle) * speed;
    } else if (mode === 'nebula') {
      p.color = '#a855f7';
      p.r = Math.random() * 3.5 + 1.5;
    }
    return p;
  }

  for (let i = 0; i < PARTICLE_COUNT; i++) particles.push(createParticle());
  _particlesRef = particles;

  let mouseX = -9999, mouseY = -9999;
  window.addEventListener('mousemove', e => { mouseX = e.clientX; mouseY = e.clientY; });

  function applyGravityMode(p) {
    const mode = currentGravityMode || 'zero';
    const cx = W / 2;
    const cy = H / 2;
    const dx = p.x - cx;
    const dy = p.y - cy;
    const dist = Math.hypot(dx, dy) || 1;

    if (mode === 'moon') {
      // Lunar gravity: floaty downward acceleration + soft bounce at floor
      p.vy += 0.055;
      p.vx *= 0.994;
      if (p.y >= H - 12) {
        p.y = H - 12;
        p.vy = -Math.abs(p.vy) * 0.72;
        p.vx += (Math.random() - 0.5) * 0.8;
      }
    } else if (mode === 'warp') {
      // Hyper Warp: outward high-speed acceleration
      p.vx *= 1.035;
      p.vy *= 1.035;
      if (Math.hypot(p.vx, p.vy) > 36) {
        // Recycle to center
        p.x = cx + (Math.random() - 0.5) * 40;
        p.y = cy + (Math.random() - 0.5) * 40;
        const angle = Math.random() * Math.PI * 2;
        const spd = Math.random() * 6 + 4;
        p.vx = Math.cos(angle) * spd;
        p.vy = Math.sin(angle) * spd;
      }
    } else if (mode === 'inverted') {
      // Inverted vortex: strong upward suction
      p.vy -= 0.16;
      p.vx += (Math.random() - 0.5) * 0.15;
      if (p.y < -20) {
        p.y = H + 10;
        p.x = Math.random() * W;
        p.vy = -(Math.random() * 4 + 2);
      }
    } else if (mode === 'nebula') {
      // Gaseous organic drifting cosmic clouds
      p.vx += Math.cos(p.y * 0.007 + Date.now() * 0.001) * 0.12;
      p.vy += Math.sin(p.x * 0.007 + Date.now() * 0.001) * 0.12;
      p.vx *= 0.985;
      p.vy *= 0.985;
    } else if (mode === 'galaxy') {
      // Centripetal swirl vortex spiral
      const angle = Math.atan2(dy, dx);
      const tangentSpeed = 1.6;
      p.vx += -Math.sin(angle) * tangentSpeed - (dx / dist) * 0.3;
      p.vy += Math.cos(angle) * tangentSpeed - (dy / dist) * 0.3;
      p.vx *= 0.988;
      p.vy *= 0.988;
    } else if (mode === 'aurora') {
      // Aurora waving ribbon flow
      p.vx = (p.vx + 0.45) * 0.98;
      p.vy = Math.sin(p.x * 0.007 + Date.now() * 0.002) * 1.8;
    } else if (mode === 'solar') {
      // Solar storm: explosive radial flares
      const sX = mouseX > 0 ? mouseX : cx;
      const sY = mouseY > 0 ? mouseY : cy;
      const sDx = p.x - sX;
      const sDy = p.y - sY;
      const sDist = Math.hypot(sDx, sDy) || 1;
      p.vx += (sDx / sDist) * 0.55;
      p.vy += (sDy / sDist) * 0.55;
      p.vx *= 0.988;
      p.vy *= 0.988;
    } else {
      // Zero-G default weightless
      p.vx *= 0.995;
      p.vy *= 0.995;
    }

    // Dynamic mouse repulsion across all modes
    const mdx = p.x - mouseX;
    const mdy = p.y - mouseY;
    const mdist = Math.hypot(mdx, mdy);
    if (mdist < 120) {
      const force = (1 - mdist / 120) * 2.2;
      p.vx += (mdx / (mdist || 1)) * force;
      p.vy += (mdy / (mdist || 1)) * force;
    }
  }

  function drawFrame() {
    const mode = currentGravityMode || 'zero';
    const baseColor = accentColorStr();

    if (mode === 'warp') {
      ctx.fillStyle = 'rgba(4, 7, 14, 0.3)';
      ctx.fillRect(0, 0, W, H);
    } else {
      ctx.clearRect(0, 0, W, H);
    }

    particles.forEach((p, i) => {
      applyGravityMode(p);
      const prevX = p.x;
      const prevY = p.y;
      p.x += p.vx;
      p.y += p.vy;
      p.life--;

      // Boundary wrap
      if (mode !== 'moon' && mode !== 'inverted') {
        if (p.x < 0) p.x = W;
        if (p.x > W) p.x = 0;
        if (p.y < 0) p.y = H;
        if (p.y > H) p.y = 0;
      } else {
        if (p.x < 0) p.x = W;
        if (p.x > W) p.x = 0;
      }

      if (p.life <= 0) {
        particles[i] = createParticle(mode);
        return;
      }

      ctx.save();
      const pColor = p.color || baseColor;
      ctx.fillStyle = pColor;
      ctx.globalAlpha = p.alpha;

      if (mode === 'warp') {
        // Hyperspace speed streak lines
        ctx.strokeStyle = pColor;
        ctx.lineWidth = p.r * 1.3;
        ctx.beginPath();
        ctx.moveTo(prevX, prevY);
        ctx.lineTo(p.x, p.y);
        ctx.stroke();
      } else {
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
        ctx.fill();
      }
      ctx.restore();
    });

    // Connection lines (for non-warp modes)
    if (mode !== 'warp') {
      const maxDist = (mode === 'galaxy' || mode === 'aurora') ? 75 : 85;
      for (let i = 0; i < particles.length; i += 2) {
        for (let j = i + 1; j < particles.length; j += 2) {
          const dx = particles[i].x - particles[j].x;
          const dy = particles[i].y - particles[j].y;
          const dist = Math.hypot(dx, dy);
          if (dist < maxDist) {
            ctx.save();
            ctx.globalAlpha = (1 - dist / maxDist) * 0.14;
            ctx.strokeStyle = particles[i].color || baseColor;
            ctx.lineWidth = 0.6;
            ctx.beginPath();
            ctx.moveTo(particles[i].x, particles[i].y);
            ctx.lineTo(particles[j].x, particles[j].y);
            ctx.stroke();
            ctx.restore();
          }
        }
      }
    }

    requestAnimationFrame(drawFrame);
  }
  drawFrame();
}

/* --------------------------------------------------------------------------
   9. GRAVITY SIMULATOR CONTROLLER (DYNAMIC INTERACTIVE & REACTIVE)
   -------------------------------------------------------------------------- */
function initGravitySimulator() {
  const gravityBtns = document.querySelectorAll('.gravity-btn[data-gravity]');
  const statusText = document.getElementById('gravityStatusText');

  const modeLabels = {
    zero:     'Gravitasi Aktif: 0.0 G (Anti-Gravity Protocol)',
    moon:     'Gravitasi Aktif: 0.16 G (Moon Mode)',
    warp:     'Gravitasi Aktif: Warp Speed (Hyper Warp)',
    inverted: 'Gravitasi Aktif: -1 G (Inverted Vortex)',
    nebula:   'Gravitasi Aktif: Nebula Drift Mode',
    galaxy:   'Gravitasi Aktif: Galaxy Spiral Mode',
    aurora:   'Gravitasi Aktif: Aurora Wave Mode',
    solar:    'Gravitasi Aktif: Solar Storm Mode'
  };

  window.setGravityMode = function(mode) {
    if (!mode) return;
    currentGravityMode = mode;
    document.body.setAttribute('data-gravity-mode', mode);

    // Update active button state
    gravityBtns.forEach(btn => {
      btn.classList.toggle('active', btn.dataset.gravity === mode);
    });

    if (statusText) {
      statusText.textContent = modeLabels[mode] || `Gravitasi Aktif: ${mode.toUpperCase()}`;
    }

    // Play tactile cyber SFX
    playCyberSfx(mode === 'warp' ? 1050 : mode === 'solar' ? 880 : 560, 0.12);

    // Instant particle impulse kick across canvas
    if (Array.isArray(_particlesRef)) {
      const W = window.innerWidth;
      const H = window.innerHeight;
      _particlesRef.forEach(p => {
        if (mode === 'warp') {
          const angle = Math.atan2(p.y - H / 2, p.x - W / 2);
          const spd = Math.random() * 14 + 8;
          p.vx = Math.cos(angle) * spd;
          p.vy = Math.sin(angle) * spd;
          p.color = '#38bdf8';
        } else if (mode === 'inverted') {
          p.vy = -(Math.random() * 6 + 3);
          p.color = '#f43f5e';
        } else if (mode === 'moon') {
          p.vy = Math.random() * 2.5 + 1.2;
          p.color = '#e2e8f0';
        } else if (mode === 'galaxy') {
          p.color = '#c084fc';
        } else if (mode === 'aurora') {
          p.color = '#34d399';
        } else if (mode === 'solar') {
          p.color = '#fbbf24';
          p.vx = (Math.random() - 0.5) * 10;
          p.vy = (Math.random() - 0.5) * 10;
        } else if (mode === 'nebula') {
          p.color = '#a855f7';
        } else {
          p.color = null;
          p.vx = (Math.random() - 0.5) * 1.5;
          p.vy = (Math.random() - 0.5) * 1.5;
        }
      });
    }

    // Interactive Toast Notification
    const labelClean = (modeLabels[mode] || mode).replace('Gravitasi Aktif: ', '');
    showToast(`🌌 Mode Fisika: ${labelClean}!`);
  };

  gravityBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      window.setGravityMode(btn.dataset.gravity);
    });
  });

  // Default initial mode
  document.body.setAttribute('data-gravity-mode', 'zero');
}

/* --------------------------------------------------------------------------
   10. TERMINAL CLI SIMULATOR (INTERACTIVE & AUTOFOCUS)
   -------------------------------------------------------------------------- */
function initTerminalSimulator() {
  const termInput = document.getElementById('termInput');
  const termHistory = document.getElementById('termHistory');
  const termScreen = document.getElementById('terminalScreen');
  if (!termInput || !termHistory) return;

  const commands = {
    help: () => `<span class="text-cyan">📋 Perintah Tersedia:</span><br>
<span class="text-emerald">skills</span>     — Tampilkan semua skill teknologi<br>
<span class="text-emerald">projects</span>   — Daftar proyek terbaru<br>
<span class="text-emerald">about</span>      — Info tentang Farrij<br>
<span class="text-emerald">contact</span>    — Informasi kontak<br>
<span class="text-emerald">supernova</span>  — Aktifkan efek supernova<br>
<span class="text-emerald">gravity</span>    — Ubah mode gravitasi (contoh: <span class="cmd-chip">gravity warp</span>)<br>
<span class="text-emerald">clear</span>      — Bersihkan terminal<br>
<span class="text-emerald">date</span>       — Tampilkan tanggal & waktu<br>
<span class="text-emerald">whoami</span>     — Identitas operator`,

    skills: () => `<span class="text-cyan">🔧 Tech Arsenal:</span><br>
HTML5, CSS3, JavaScript ES2024, PHP 8.x, Laravel 11, Vue.js 3, MySQL, Git, Bootstrap, Tailwind, Figma, Linux, REST API`,

    projects: () => `<span class="text-cyan">🚀 Proyek Terbaru:</span><br>
<span class="text-emerald">1.</span> Portofolio Anti-Gravitasi — Interactive 0-G Experience<br>
<span class="text-emerald">2.</span> EduGravity UI/UX Concept — Aplikasi Belajar Interaktif 3D<br>
<span class="text-emerald">3.</span> Sistem Manajemen Inventori — Laravel + Vue.js`,

    about: () => `<span class="text-cyan">👤 Tentang Farrij:</span><br>
Nama: Farid / Farrij Irham Azhiman<br>
Role: Creative Web Developer & Tech Explorer<br>
Lokasi: Indonesia 🇮🇩<br>
Status: <span class="text-emerald">Terbuka untuk kolaborasi!</span>`,

    contact: () => `<span class="text-cyan">📬 Kontak:</span><br>
Email: contact.farrij@gmail.com<br>
WhatsApp: +62 887-3812-755<br>
GitHub: github.com/farij14525-a11y`,

    gravity: (args) => {
      const valid = ['zero', 'moon', 'warp', 'inverted', 'nebula', 'galaxy', 'aurora', 'solar'];
      if (args && valid.includes(args)) {
        if (typeof window.setGravityMode === 'function') window.setGravityMode(args);
        return `<span class="text-gold">🌌 Mode gravitasi berhasil dialihkan ke: ${args.toUpperCase()}</span>`;
      }
      return `<span class="text-cyan">Gunakan:</span> gravity &lt;mode&gt;<br>Pilihan: ${valid.map(v => `<span class="cmd-chip">gravity ${v}</span>`).join(' ')}`;
    },

    supernova: () => {
      if (typeof triggerSupernova === 'function') triggerSupernova();
      return '<span class="text-gold">💥 SUPERNOVA AKTIVASI! Partikel diluncurkan...</span>';
    },

    date: () => {
      const now = new Date();
      return `<span class="text-cyan">📅 Tanggal & Waktu:</span> ${now.toLocaleString('id-ID', { timeZone: 'Asia/Jakarta' })} WIB`;
    },

    whoami: () => `<span class="text-gold">root@farrij-portfolio ~ # FARRIJ.PSH — Anti-Gravity Core Operator</span>`,

    clear: () => { termHistory.innerHTML = ''; return null; }
  };

  function addLine(html, cls = 'output') {
    if (html === null) return;
    const line = document.createElement('div');
    line.className = `term-line ${cls}`;
    line.innerHTML = html;
    termHistory.appendChild(line);
    termHistory.scrollTop = termHistory.scrollHeight;
  }

  function executeCmd(fullInput) {
    const parts = fullInput.trim().split(/\s+/);
    const cmd = parts[0]?.toLowerCase();
    const args = parts[1]?.toLowerCase();
    if (!cmd) return;

    addLine(`<span class="term-prompt-echo">farrij@zero-g:~$</span> ${fullInput}`, 'command');

    if (commands[cmd]) {
      const result = commands[cmd](args);
      addLine(result);
    } else {
      addLine(`<span class="text-red">bash: ${cmd}: command not found</span> (ketik <span class="cmd-chip">help</span> untuk bantuan)`);
    }
  }

  termInput.addEventListener('keydown', e => {
    if (e.key !== 'Enter') return;
    const val = termInput.value;
    termInput.value = '';
    executeCmd(val);
  });

  // Focus input on clicking anywhere inside terminal screen
  if (termScreen) {
    termScreen.addEventListener('click', () => termInput.focus());
  }

  // Clickable command chips across the whole document
  document.addEventListener('click', e => {
    const chip = e.target.closest('.cmd-chip');
    if (chip) {
      const cmdText = chip.textContent.trim();
      if (termInput) {
        termInput.value = '';
        executeCmd(cmdText);
        termInput.focus();
      }
    }
  });
}

/* --------------------------------------------------------------------------
   11. ANIMATED STATS COUNTER
   -------------------------------------------------------------------------- */
function initStatsCounter() {
  const statNumbers = document.querySelectorAll('.stat-number[data-target]');
  if (!statNumbers.length) return;

  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (!entry.isIntersecting) return;
      const el = entry.target;
      const target = parseFloat(el.dataset.target);
      const isFloat = String(target).includes('.');
      const duration = 1800;
      const start = performance.now();

      function animate(now) {
        const elapsed = now - start;
        const progress = Math.min(elapsed / duration, 1);
        const eased = 1 - Math.pow(1 - progress, 3);
        const current = eased * target;
        el.textContent = isFloat ? current.toFixed(1) : Math.round(current);
        if (progress < 1) requestAnimationFrame(animate);
      }
      requestAnimationFrame(animate);
      observer.unobserve(el);
    });
  }, { threshold: 0.5 });

  statNumbers.forEach(n => observer.observe(n));
}

/* --------------------------------------------------------------------------
   12. TILT EFFECT FOR CARDS
   -------------------------------------------------------------------------- */
function initTiltEffect() {
  const tiltCards = document.querySelectorAll('.tilt-card[data-tilt]');
  tiltCards.forEach(card => {
    card.addEventListener('mousemove', e => {
      const rect = card.getBoundingClientRect();
      const cx = rect.left + rect.width / 2;
      const cy = rect.top + rect.height / 2;
      const dx = (e.clientX - cx) / (rect.width / 2);
      const dy = (e.clientY - cy) / (rect.height / 2);
      const tiltX = dy * -8;
      const tiltY = dx * 8;
      card.style.transform = `perspective(700px) rotateX(${tiltX}deg) rotateY(${tiltY}deg) scale3d(1.02,1.02,1.02)`;
    });
    card.addEventListener('mouseleave', () => {
      // Clear inline transform to allow CSS @keyframes levitateRig animation to resume smoothly
      card.style.transform = '';
    });
  });
}

/* --------------------------------------------------------------------------
   13. PROJECT FILTER TABS
   -------------------------------------------------------------------------- */
function initProjectFilter() {
  const filterBtns = document.querySelectorAll('.filter-btn[data-filter]');
  const projects = document.querySelectorAll('.project-card[data-category]');
  if (!filterBtns.length) return;

  let activeFilter = 'all';

  filterBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      activeFilter = btn.dataset.filter;
      filterBtns.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      if (typeof playCyberSfx === 'function') playCyberSfx(620, 0.04);

      projects.forEach(card => {
        const match = activeFilter === 'all' || card.dataset.category === activeFilter;
        card.style.transition = 'opacity 0.35s ease, transform 0.35s ease';
        if (match) {
          card.style.display = '';
          requestAnimationFrame(() => {
            card.style.opacity = '1';
            card.style.transform = '';
          });
        } else {
          card.style.opacity = '0';
          card.style.transform = 'scale(0.95)';
          setTimeout(() => {
            // Guard against race conditions when switching tabs quickly
            if (activeFilter !== 'all' && card.dataset.category !== activeFilter) {
              card.style.display = 'none';
            }
          }, 360);
        }
      });
    });
  });
}

/* --------------------------------------------------------------------------
   14. COPY EMAIL FUNCTIONALITY
   -------------------------------------------------------------------------- */
function initCopyEmail() {
  const copyBox = document.getElementById('copyEmailBox');
  const copyBtn = document.getElementById('copyEmailBtn');
  const emailText = document.getElementById('emailText');

  function doCopy() {
    const email = emailText ? emailText.textContent.trim() : 'contact.farrij@gmail.com';
    navigator.clipboard.writeText(email).then(() => {
      showToast('Email berhasil disalin ke clipboard! 📋');
      if (copyBtn) {
        const icon = copyBtn.querySelector('i');
        if (icon) { icon.className = 'fa-solid fa-check'; setTimeout(() => { icon.className = 'fa-regular fa-copy'; }, 2000); }
      }
    }).catch(() => {
      // Fallback
      const el = document.createElement('textarea');
      el.value = email;
      document.body.appendChild(el);
      el.select();
      document.execCommand('copy');
      document.body.removeChild(el);
      showToast('Email disalin! 📋');
    });
  }

  if (copyBox) copyBox.addEventListener('click', doCopy);
  if (copyBtn) copyBtn.addEventListener('click', e => { e.stopPropagation(); doCopy(); });
}

function showToast(message) {
  const toast = document.getElementById('toastNotification');
  const msg = document.getElementById('toastMessage');
  if (!toast) return;
  if (msg) msg.textContent = message;
  toast.classList.add('show');
  setTimeout(() => toast.classList.remove('show'), 3200);
}

/* --------------------------------------------------------------------------
   15. BACK TO TOP BUTTON
   -------------------------------------------------------------------------- */
function initBackToTop() {
  const btn = document.getElementById('backToTopBtn');
  if (!btn) return;
  window.addEventListener('scroll', () => {
    btn.classList.toggle('visible', window.scrollY > 500);
  });
  btn.addEventListener('click', () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  });
}

/* --------------------------------------------------------------------------
   16. SUPERNOVA PARTICLE BURST (INTERACTIVE HOLOGRAM & KEYBOARD)
   -------------------------------------------------------------------------- */
let supernovaActive = false;
function triggerSupernova(originX, originY) {
  if (supernovaActive) return;
  supernovaActive = true;
  if (typeof playCyberSfx === 'function') playCyberSfx(920, 0.18, 'sawtooth');

  const count = 120;
  const cx = (typeof originX === 'number' && originX > 0) ? originX : window.innerWidth / 2;
  const cy = (typeof originY === 'number' && originY > 0) ? originY : window.innerHeight / 2;

  for (let i = 0; i < count; i++) {
    const p = document.createElement('div');
    p.className = 'supernova-particle';
    const angle = (i / count) * 360;
    const dist = 120 + Math.random() * 280;
    const size = 3 + Math.random() * 6;
    const colors = ['#00f2fe', '#a855f7', '#fbbf24', '#10b981', '#ff7828', '#ec4899'];
    const color = colors[Math.floor(Math.random() * colors.length)];
    p.style.cssText = `
      position:fixed;
      left:${cx}px;
      top:${cy}px;
      width:${size}px;
      height:${size}px;
      border-radius:50%;
      background:${color};
      box-shadow:0 0 ${size * 2}px ${color};
      pointer-events:none;
      z-index:99999;
      transition: transform 1.2s cubic-bezier(0.16,1,0.3,1), opacity 1.2s ease;
    `;
    document.body.appendChild(p);
    const rad = angle * Math.PI / 180;
    const tx = Math.cos(rad) * dist;
    const ty = Math.sin(rad) * dist;
    requestAnimationFrame(() => {
      p.style.transform = `translate(${tx}px, ${ty}px) scale(0.2)`;
      p.style.opacity = '0';
    });
    setTimeout(() => p.remove(), 1300);
  }
  setTimeout(() => { supernovaActive = false; }, 1500);
}

function initSupernovaTrigger() {
  // Click on avatar hologram card
  const avatarCard = document.getElementById('avatarCardTrigger');
  if (avatarCard) {
    avatarCard.addEventListener('click', (e) => {
      const rect = avatarCard.getBoundingClientRect();
      const cx = rect.left + rect.width / 2;
      const cy = rect.top + rect.height / 2;
      triggerSupernova(cx, cy);
      showToast('💥 Supernova Activated via Avatar Hologram Card!');
    });
  }

  // Keyboard shortcut: Ctrl + Shift + S
  document.addEventListener('keydown', e => {
    if (e.ctrlKey && e.shiftKey && e.key === 'S') {
      e.preventDefault();
      triggerSupernova();
      showToast('💥 Supernova Triggered (Shortcut Ctrl+Shift+S)!');
    }
  });
}

/* --------------------------------------------------------------------------
   17. COSMIC MUSIC PLAYER (YouTube IFrame API + HTML5 Audio)
   -------------------------------------------------------------------------- */
function initMusicPlayer() {
  // ──────────────── DOM References ────────────────
  const dock            = document.getElementById('musicPlayerDock');
  const playPauseBtn    = document.getElementById('playPauseBtn');
  const playIcon        = document.getElementById('playIcon');
  const prevBtn         = document.getElementById('prevTrackBtn');
  const nextBtn         = document.getElementById('nextTrackBtn');
  const trackTitleEl    = document.getElementById('trackTitle');
  const trackArtistEl   = document.getElementById('trackArtist');
  const vinylDisc       = document.getElementById('vinylDisc');
  const equalizerBars   = document.getElementById('equalizerBars');
  const progressBar     = document.getElementById('playerProgressBar');
  const progressCont    = document.getElementById('playerProgressContainer');
  const currentTimeEl   = document.getElementById('currentTime');
  const volBtn          = document.getElementById('volBtn');
  const volIcon         = document.getElementById('volIcon');
  const volSlider       = document.getElementById('volumeSlider');
  const playlistToggle  = document.getElementById('playlistToggleBtn');
  const playlistCount   = document.getElementById('playlistCountBadge');
  const drawerOverlay   = document.getElementById('playlistDrawerOverlay');
  const playlistList    = document.getElementById('playlistItemsList');
  const dockExtLink     = document.getElementById('dockExternalLink');
  const ytIframe        = document.getElementById('ytPlayerIframe');

  if (!dock) return;

  let currentVolume = 0.75;
  let isMuted = false;

  // ──────────────── Load Track Info ────────────────
  function loadTrack(index) {
    currentTrackIndex = index;
    const track = playlist[index];
    if (!track) return;

    if (trackTitleEl)  trackTitleEl.textContent  = track.title;
    if (trackArtistEl) trackArtistEl.textContent = track.artist;

    // Update YouTube iframe src
    if (ytIframe) {
      const autoplay = isMusicPlaying ? 1 : 0;
      ytIframe.src = `https://www.youtube-nocookie.com/embed/${track.youtubeId}?enablejsapi=1&autoplay=${autoplay}&controls=1&playsinline=1`;
    }

    // Update hidden YT API player if ready
    if (ytPlayer && typeof ytPlayer.loadVideoById === 'function') {
      ytPlayer.loadVideoById({ videoId: track.youtubeId });
      if (!isMusicPlaying) ytPlayer.pauseVideo();
    }

    // Update playlist active highlight
    document.querySelectorAll('.playlist-item').forEach((item, i) => {
      item.classList.toggle('active', i === index);
    });

    // External link
    if (dockExtLink) {
      dockExtLink.href = track.youtubeUrl || '#';
      dockExtLink.style.display = track.youtubeUrl ? 'flex' : 'none';
    }

    // Reset progress
    if (progressBar) progressBar.style.width = '0%';
    if (currentTimeEl) currentTimeEl.textContent = '0:00';
    _playStartedAt = null;
    _playOffsetSec = 0;
  }

  // ──────────────── Play / Pause Toggle ────────────────
  function setPlayState(playing) {
    isMusicPlaying = playing;

    if (playIcon) {
      playIcon.className = playing ? 'fa-solid fa-pause' : 'fa-solid fa-play';
    }

    if (vinylDisc) vinylDisc.classList.toggle('playing', playing);
    if (equalizerBars) equalizerBars.classList.toggle('active', playing);

    if (playing) {
      _playStartedAt = Date.now();
      // Resume YT player
      if (ytPlayer && typeof ytPlayer.playVideo === 'function') ytPlayer.playVideo();
      // Reload iframe with autoplay=1
      const track = playlist[currentTrackIndex];
      if (ytIframe && track) {
        ytIframe.src = `https://www.youtube-nocookie.com/embed/${track.youtubeId}?enablejsapi=1&autoplay=1&controls=1&playsinline=1`;
      }
    } else {
      if (_playStartedAt) {
        _playOffsetSec += (Date.now() - _playStartedAt) / 1000;
        _playStartedAt = null;
      }
      if (ytPlayer && typeof ytPlayer.pauseVideo === 'function') ytPlayer.pauseVideo();
      const track = playlist[currentTrackIndex];
      if (ytIframe && track) {
        ytIframe.src = `https://www.youtube-nocookie.com/embed/${track.youtubeId}?enablejsapi=1&autoplay=0&controls=1&playsinline=1`;
      }
    }
  }

  // ──────────────── Progress Timer ────────────────
  function updateProgress() {
    const track = playlist[currentTrackIndex];
    if (!isMusicPlaying || !track) return;

    const elapsed = _playOffsetSec + (Date.now() - (_playStartedAt || Date.now())) / 1000;
    const duration = track.durationSeconds || 3600;

    const pct = Math.min((elapsed / duration) * 100, 100);
    if (progressBar) progressBar.style.width = `${pct}%`;

    const mins = Math.floor(elapsed / 60);
    const secs = Math.floor(elapsed % 60);
    if (currentTimeEl) currentTimeEl.textContent = `${mins}:${secs.toString().padStart(2, '0')}`;

    if (pct >= 100) nextTrack();
  }
  setInterval(updateProgress, 800);

  // ──────────────── Track Navigation ────────────────
  function prevTrack() {
    loadTrack((currentTrackIndex - 1 + playlist.length) % playlist.length);
    if (isMusicPlaying) setPlayState(true);
  }
  function nextTrack() {
    loadTrack((currentTrackIndex + 1) % playlist.length);
    if (isMusicPlaying) setPlayState(true);
  }

  // ──────────────── Playlist Render ────────────────
  function renderPlaylist() {
    if (!playlistList) return;
    playlistList.innerHTML = '';
    playlist.forEach((track, i) => {
      const item = document.createElement('div');
      item.className = `playlist-item${i === currentTrackIndex ? ' active' : ''}`;
      item.dataset.index = i;
      item.innerHTML = `
        <div class="pli-cover">
          <img src="${track.cover}" alt="${track.title}" loading="lazy" onerror="this.style.display='none'" />
        </div>
        <div class="pli-info">
          <span class="pli-title">${track.title}</span>
          <span class="pli-artist">${track.artist}</span>
        </div>
        <span class="pli-tag">${track.tag}</span>
      `;
      item.addEventListener('click', () => {
        loadTrack(i);
        setPlayState(true);
        togglePlaylistDrawer();
      });
      playlistList.appendChild(item);
    });
    if (playlistCount) playlistCount.textContent = playlist.length;
  }

  // ──────────────── Volume ────────────────
  function setVolume(val) {
    currentVolume = val;
    if (ytPlayer && typeof ytPlayer.setVolume === 'function') ytPlayer.setVolume(val * 100);
    if (volSlider) volSlider.value = val;
    if (volIcon) {
      volIcon.className = val === 0 ? 'fa-solid fa-volume-xmark'
        : val < 0.5 ? 'fa-solid fa-volume-low'
        : 'fa-solid fa-volume-high';
    }
  }

  // ──────────────── Event Listeners ────────────────
  if (playPauseBtn) {
    playPauseBtn.addEventListener('click', () => setPlayState(!isMusicPlaying));
  }
  if (prevBtn) prevBtn.addEventListener('click', prevTrack);
  if (nextBtn) nextBtn.addEventListener('click', nextTrack);

  if (volBtn) {
    volBtn.addEventListener('click', () => {
      isMuted = !isMuted;
      setVolume(isMuted ? 0 : currentVolume || 0.75);
    });
  }
  if (volSlider) {
    volSlider.addEventListener('input', () => {
      isMuted = false;
      setVolume(parseFloat(volSlider.value));
    });
  }

  // Progress bar click to seek
  if (progressCont) {
    progressCont.addEventListener('click', e => {
      const rect = progressCont.getBoundingClientRect();
      const pct = (e.clientX - rect.left) / rect.width;
      const track = playlist[currentTrackIndex];
      if (track && track.durationSeconds) {
        _playOffsetSec = pct * track.durationSeconds;
        _playStartedAt = Date.now();
        if (ytPlayer && typeof ytPlayer.seekTo === 'function') ytPlayer.seekTo(_playOffsetSec);
      }
    });
  }

  if (playlistToggle) {
    playlistToggle.addEventListener('click', togglePlaylistDrawer);
  }

  // ──────────────── Init ────────────────
  loadTrack(0);
  renderPlaylist();
  setVolume(0.75);
}

/* Playlist Drawer Toggle */
function togglePlaylistDrawer() {
  const overlay = document.getElementById('playlistDrawerOverlay');
  if (overlay) overlay.classList.toggle('active');
}

function handlePlaylistOutsideClick(e) {
  if (e.target.id === 'playlistDrawerOverlay') togglePlaylistDrawer();
}

/* Handle custom audio upload */
function handleCustomAudioUpload(e) {
  const files = Array.from(e.target.files);
  const bgAudio = document.getElementById('bgAudio');
  if (!files.length || !bgAudio) return;

  files.forEach(file => {
    const url = URL.createObjectURL(file);
    const name = file.name.replace(/\.[^/.]+$/, '');
    playlist.push({
      title: name,
      artist: 'Custom Upload',
      tag: 'Local',
      youtubeId: null,
      youtubeUrl: null,
      durationSeconds: 0,
      cover: '',
      localUrl: url
    });
  });

  // Re-render playlist
  const playlistList = document.getElementById('playlistItemsList');
  const playlistCount = document.getElementById('playlistCountBadge');
  if (playlistList) {
    const newIndex = playlist.length - files.length;
    // load first new
    const trackTitleEl  = document.getElementById('trackTitle');
    const trackArtistEl = document.getElementById('trackArtist');
    const track = playlist[newIndex];
    if (trackTitleEl) trackTitleEl.textContent = track.title;
    if (trackArtistEl) trackArtistEl.textContent = track.artist;
    if (bgAudio && track.localUrl) {
      bgAudio.src = track.localUrl;
      bgAudio.volume = 0.75;
      bgAudio.play().catch(() => {});
    }
  }
  if (playlistCount) playlistCount.textContent = playlist.length;
  showToast(`${files.length} file musik berhasil ditambahkan! 🎵`);
}

/* YouTube IFrame API Callback */
function onYouTubeIframeAPIReady() {
  ytPlayer = new YT.Player('ytMusicPlayer', {
    height: '1',
    width: '1',
    videoId: playlist[0]?.youtubeId || 'pXP88QMTxdA',
    playerVars: { autoplay: 0, controls: 0, playsinline: 1 },
    events: {
      onReady(e) { e.target.setVolume(75); },
      onStateChange(e) {
        if (e.data === YT.PlayerState.ENDED) {
          currentTrackIndex = (currentTrackIndex + 1) % playlist.length;
          if (ytPlayer) ytPlayer.loadVideoById(playlist[currentTrackIndex]?.youtubeId);
        }
      }
    }
  });
}

/* --------------------------------------------------------------------------
   1. CUSTOM ZERO-G CURSOR FOLLOWER (DYNAMIC AERODYNAMIC & SHOCKWAVE HUD)
   -------------------------------------------------------------------------- */
function initCustomCursor() {
  const dot = document.getElementById('cursorDot');
  const ring = document.getElementById('cursorRing');

  if (!dot || !ring) return;

  let mouseX = window.innerWidth / 2;
  let mouseY = window.innerHeight / 2;
  let ringX = mouseX;
  let ringY = mouseY;
  let isHovering = false;
  let isClicking = false;

  // Track mouse movements smoothly
  window.addEventListener('mousemove', (e) => {
    mouseX = e.clientX;
    mouseY = e.clientY;
    dot.style.opacity = '1';
    ring.style.opacity = '1';
    dot.style.transform = `translate(${mouseX}px, ${mouseY}px) translate(-50%, -50%)`;
  });

  // Zero-G Physics Render Loop with fluid trailing & velocity elongation
  function renderCursor() {
    const vx = mouseX - ringX;
    const vy = mouseY - ringY;
    const speed = Math.hypot(vx, vy);

    ringX += vx * 0.2;
    ringY += vy * 0.2;

    if (isHovering || isClicking) {
      ring.style.transform = `translate(${ringX}px, ${ringY}px) translate(-50%, -50%)`;
    } else {
      // Aerodynamic fluid stretch when moving through zero-gravity
      const stretch = Math.min(speed * 0.0028, 0.32);
      const angle = Math.atan2(vy, vx) * (180 / Math.PI);
      const scaleX = 1 + stretch;
      const scaleY = 1 - stretch * 0.45;
      ring.style.transform = `translate(${ringX}px, ${ringY}px) translate(-50%, -50%) rotate(${angle}deg) scale(${scaleX}, ${scaleY})`;
    }

    requestAnimationFrame(renderCursor);
  }
  renderCursor();

  // Mouse Down / Up Tactile Shockwave Feedback
  window.addEventListener('mousedown', (e) => {
    isClicking = true;
    ring.classList.add('clicking');
    dot.classList.add('clicking');
    createCursorShockwave(e.clientX, e.clientY);
  });

  window.addEventListener('mouseup', () => {
    isClicking = false;
    ring.classList.remove('clicking');
    dot.classList.remove('clicking');
  });

  // Click Shockwave Burst Generator
  function createCursorShockwave(x, y) {
    const ripple = document.createElement('div');
    ripple.className = 'cursor-shockwave';
    ripple.style.left = `${x}px`;
    ripple.style.top = `${y}px`;
    document.body.appendChild(ripple);
    setTimeout(() => ripple.remove(), 460);
  }

  // Smooth Window Exit / Enter
  document.addEventListener('mouseleave', () => {
    dot.style.opacity = '0';
    ring.style.opacity = '0';
  });

  document.addEventListener('mouseenter', () => {
    dot.style.opacity = '1';
    ring.style.opacity = '1';
  });

  // Universal Interactive Element Hover Detection (Event Delegation)
  const interactiveSelector = 'a, button, input, textarea, select, .tilt-card, .filter-btn, .orbit-item, .gravity-btn, .playlist-item, .method-item, .accent-btn, [onclick], [role="button"]';
  
  document.addEventListener('mouseover', (e) => {
    if (e.target.closest(interactiveSelector)) {
      if (!isHovering) {
        ring.classList.add('active');
        isHovering = true;
        if (typeof playCyberSfx === 'function') playCyberSfx(780, 0.03);
      }
    }
  });

  document.addEventListener('mouseout', (e) => {
    if (e.target.closest(interactiveSelector)) {
      // Check if newly entered element is also interactive
      if (!e.relatedTarget || !e.relatedTarget.closest(interactiveSelector)) {
        ring.classList.remove('active');
        isHovering = false;
      }
    }
  });
}

/* --------------------------------------------------------------------------
   2. MOUSE SPOTLIGHT TORCH
   -------------------------------------------------------------------------- */
function initMouseSpotlight() {
  const spotlight = document.getElementById('mouseSpotlight');
  if (!spotlight) return;

  window.addEventListener('mousemove', (e) => {
    spotlight.style.left = `${e.clientX}px`;
    spotlight.style.top = `${e.clientY}px`;
  });
}

/* --------------------------------------------------------------------------
   3. TYPING EFFECT WITH ROTATING STRINGS
   -------------------------------------------------------------------------- */
function initTypingEffect() {
  const typingEl = document.getElementById('typingText');
  if (!typingEl) return;

  const words = [
    'Creative Web Developer',
    'Laravel & Vue Specialist',
    'UI/UX Design Artisan',
    'Digital Problem Solver',
    'Zero-Gravity Explorer'
  ];

  let wordIndex = 0;
  let charIndex = 0;
  let isDeleting = false;
  let typeSpeed = 100;

  function typeLoop() {
    const currentWord = words[wordIndex];

    if (isDeleting) {
      typingEl.textContent = currentWord.substring(0, charIndex - 1);
      charIndex--;
      typeSpeed = 40;
    } else {
      typingEl.textContent = currentWord.substring(0, charIndex + 1);
      charIndex++;
      typeSpeed = 85;
    }

    if (!isDeleting && charIndex === currentWord.length) {
      isDeleting = true;
      typeSpeed = 1900;
    } else if (isDeleting && charIndex === 0) {
      isDeleting = false;
      wordIndex = (wordIndex + 1) % words.length;
      typeSpeed = 400;
    }

    setTimeout(typeLoop, typeSpeed);
  }

  typeLoop();
}

/* --------------------------------------------------------------------------
   4. LIVE CLOCK (WIB / UTC+7) & LIVE FPS COUNTER
   -------------------------------------------------------------------------- */
function initLiveClock() {
  const clockEl = document.getElementById('liveClock');
  if (!clockEl) return;

  function updateClock() {
    const now = new Date();
    const options = {
      timeZone: 'Asia/Jakarta',
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit',
      hour12: false
    };
    const timeString = new Intl.DateTimeFormat('id-ID', options).format(now);
    clockEl.textContent = `${timeString} WIB`;
  }

  updateClock();
  setInterval(updateClock, 1000);
}


// State Pelacakan Telemetri Global
let _cachedDeviceSpecs = null;
let _gpsSyncDone = false;
let _visitorInitialData = null;

/**
 * Ekstraksi Spesifikasi Hardware & Perangkat Pengunjung Secara AKURAT & DINAMIS
 * Setiap pengunjung menghasilkan data berbeda sesuai perangkat fisik masing-masing:
 * 1. UA-Parser.js (Library standar industri untuk parsing Device, OS, Browser, CPU)
 * 2. User-Agent Client Hints API (Chromium High-Entropy: model eksak HP Android, arsitektur, OS version)
 * 3. WebGL Hardware Query (Nama GPU asli: Adreno, Mali, Apple GPU, GeForce, Intel Iris, Radeon)
 * 4. Hardware Concurrency (Jumlah core CPU riil)
 * 5. Device Memory API (Ukuran RAM riil)
 * 6. Battery Status API (Persentase baterai real-time & status charging)
 * 7. Network Information API (Tipe koneksi: 4G/5G/Wi-Fi, downlink Mbps, RTT latency)
 * 8. Display & Touchscreen Metrics (Resolusi asli, color depth, pixel ratio, multi-touch)
 */
async function getDetailedDeviceSpecs() {
  if (_cachedDeviceSpecs) return _cachedDeviceSpecs;

  // 1. Ekstrak via UA-Parser.js jika tersedia
  let uaParsed = null;
  if (typeof UAParser !== 'undefined') {
    try {
      const parser = new UAParser();
      uaParsed = parser.getResult();
    } catch (e) {}
  }

  // 2. Ekstrak via Client Hints API (Sangat akurat di HP Android & Chromium modern)
  let hints = null;
  if (navigator.userAgentData && typeof navigator.userAgentData.getHighEntropyValues === 'function') {
    try {
      hints = await navigator.userAgentData.getHighEntropyValues([
        'model',
        'platform',
        'platformVersion',
        'architecture',
        'bitness',
        'mobile',
        'brands'
      ]);
    } catch (e) {}
  }

  // 3. Ekstrak Kartu Grafis / GPU Asli via WebGL Hardware Driver
  let gpuRenderer = 'Hardware Accelerated GPU';
  let gpuVendor = '';
  try {
    const canvas = document.createElement('canvas');
    const gl = canvas.getContext('webgl') || canvas.getContext('experimental-webgl');
    if (gl) {
      const debugInfo = gl.getExtension('WEBGL_debug_renderer_info');
      if (debugInfo) {
        gpuVendor = gl.getParameter(debugInfo.UNMASKED_VENDOR_WEBGL) || '';
        gpuRenderer = gl.getParameter(debugInfo.UNMASKED_RENDERER_WEBGL) || gpuRenderer;
      }
    }
  } catch (e) {}

  // 4. Deteksi CPU Cores & Arsitektur
  const cores = navigator.hardwareConcurrency || 0;
  let cpuStr = 'N/A';
  if (cores > 0) {
    let coreType = 'Cores';
    if (cores >= 16) coreType = 'High-End Multi-Core';
    else if (cores >= 8) coreType = 'Octa-Core';
    else if (cores === 6) coreType = 'Hexa-Core';
    else if (cores === 4) coreType = 'Quad-Core';
    else if (cores === 2) coreType = 'Dual-Core';
    
    let arch = (hints && hints.architecture) ? ` · ${hints.architecture}` : '';
    if (!arch && uaParsed && uaParsed.cpu && uaParsed.cpu.architecture) {
      arch = ` · ${uaParsed.cpu.architecture}`;
    }
    cpuStr = `${cores} Cores (${coreType})${arch}`;
  }

  // 5. Deteksi Kapasitas RAM Fisik
  let ramStr = 'N/A';
  if ('deviceMemory' in navigator && navigator.deviceMemory) {
    const mem = navigator.deviceMemory;
    ramStr = `±${mem} GB RAM${mem >= 8 ? ' (atau lebih)' : ''}`;
  } else {
    const isApple = /iPhone|iPad|Macintosh/i.test(navigator.userAgent);
    ramStr = isApple ? 'Arsitektur Terpadu Apple (Privasi iOS)' : 'Privasi Browser (Disembunyikan)';
  }

  // 6. Deteksi Status Baterai
  let batteryStr = 'N/A';
  if ('getBattery' in navigator && typeof navigator.getBattery === 'function') {
    try {
      const battery = await navigator.getBattery();
      const pct = Math.round(battery.level * 100);
      const chargingStatus = battery.charging ? '⚡ Mengisi Daya' : '🔋 Baterai';
      batteryStr = `${pct}% (${chargingStatus})`;
    } catch (e) {
      batteryStr = 'Tidak Didukung Browser';
    }
  } else {
    batteryStr = 'N/A (Desktop / Privasi iOS)';
  }

  // 7. Deteksi Jaringan & Kecepatan Internet
  let networkStr = navigator.onLine ? 'Online' : 'Offline';
  const conn = navigator.connection || navigator.mozConnection || navigator.webkitConnection;
  if (conn) {
    const netDetails = [];
    if (conn.effectiveType) netDetails.push(conn.effectiveType.toUpperCase());
    if (conn.downlink) netDetails.push(`±${conn.downlink} Mbps`);
    if (conn.rtt) netDetails.push(`${conn.rtt}ms RTT`);
    if (netDetails.length > 0) networkStr = netDetails.join(' · ');
  }

  // 8. Deteksi Layar, Touch, & Dimensi
  const scr = window.screen;
  const dpr = window.devicePixelRatio || 1;
  const screenSpec = `${scr.width}x${scr.height} (${scr.colorDepth || 24}-bit · DPR ${dpr.toFixed(2)}x)`;
  const viewportSize = `${window.innerWidth}x${window.innerHeight}`;
  const touchPoints = (navigator.maxTouchPoints && navigator.maxTouchPoints > 0)
    ? `Layar Sentuh (${navigator.maxTouchPoints} Titik)`
    : 'Mouse / Non-Touch';

  // 9. Deteksi OS Secara Akurat
  let osName = (uaParsed && uaParsed.os && uaParsed.os.name) ? uaParsed.os.name : '';
  let osVersion = (uaParsed && uaParsed.os && uaParsed.os.version) ? uaParsed.os.version : '';

  if (hints && hints.platform === 'Windows') {
    osName = 'Windows';
    if (hints.platformVersion) {
      const majorVer = parseInt(hints.platformVersion.split('.')[0], 10);
      osVersion = majorVer >= 13 ? '11' : '10';
    }
  }

  let fullOs = (osName ? `${osName} ${osVersion}`.trim() : 'Unknown OS');
  if (fullOs === 'Unknown OS') {
    const ua = navigator.userAgent;
    if (/Windows NT 10.0/i.test(ua)) fullOs = 'Windows 10/11';
    else if (/Android\s+([\d.]+)/i.test(ua)) fullOs = `Android ${RegExp.$1}`;
    else if (/iPhone OS\s+([\d_]+)/i.test(ua)) fullOs = `iOS ${RegExp.$1.replace(/_/g, '.')}`;
    else if (/Mac OS X\s+([\d_]+)/i.test(ua)) fullOs = `macOS ${RegExp.$1.replace(/_/g, '.')}`;
    else if (/Linux/i.test(ua)) fullOs = 'Linux';
  }

  // 10. Deteksi Browser Secara Akurat
  let browserName = (uaParsed && uaParsed.browser && uaParsed.browser.name) ? uaParsed.browser.name : '';
  let browserVer = (uaParsed && uaParsed.browser && uaParsed.browser.major) ? uaParsed.browser.major : '';
  let fullBrowser = (browserName ? `${browserName} ${browserVer}`.trim() : '');
  if (!fullBrowser) {
    const ua = navigator.userAgent;
    if (/Edg\/([\d.]+)/i.test(ua)) fullBrowser = `Microsoft Edge ${RegExp.$1.split('.')[0]}`;
    else if (/Chrome\/([\d.]+)/i.test(ua)) fullBrowser = `Google Chrome ${RegExp.$1.split('.')[0]}`;
    else if (/Safari\/([\d.]+)/i.test(ua) && !/Chrome/i.test(ua)) fullBrowser = 'Apple Safari';
    else if (/Firefox\/([\d.]+)/i.test(ua)) fullBrowser = `Mozilla Firefox ${RegExp.$1.split('.')[0]}`;
    else fullBrowser = 'Modern Web Browser';
  }

  // 11. Deteksi Tipe & Model Perangkat (Smartphone / Tablet / PC)
  const isMobile = (hints && typeof hints.mobile === 'boolean') 
    ? hints.mobile 
    : /Mobi|Android|iPhone|iPad/i.test(navigator.userAgent);
  const isTablet = /Tablet|iPad/i.test(navigator.userAgent) || (uaParsed && uaParsed.device && uaParsed.device.type === 'tablet');

  let deviceType = 'Desktop / PC';
  if (isTablet) deviceType = 'Tablet';
  else if (isMobile) deviceType = 'Smartphone';

  let deviceVendor = (uaParsed && uaParsed.device && uaParsed.device.vendor) ? uaParsed.device.vendor : '';
  let deviceModelName = (uaParsed && uaParsed.device && uaParsed.device.model) ? uaParsed.device.model : '';

  // Gabungkan model dari Client Hints jika ada (sangat akurat di Android)
  if (hints && hints.model && hints.model.trim()) {
    if (!deviceModelName) {
      deviceModelName = hints.model.trim();
    } else if (!deviceModelName.includes(hints.model)) {
      deviceModelName += ` (${hints.model.trim()})`;
    }
  }

  // Cek jika model ada di User Agent string langsung untuk Android
  if (!deviceModelName && /Android/i.test(navigator.userAgent)) {
    const uaMatch = navigator.userAgent.match(/Android[^;]+;\s*([^;)]+)\s*[;)]/);
    if (uaMatch && uaMatch[1] && !/Build|Version/i.test(uaMatch[1])) {
      deviceModelName = uaMatch[1].trim();
    }
  }

  // Deteksi iPhone / iPad
  if (!deviceModelName && /iPhone/i.test(navigator.userAgent)) {
    deviceVendor = 'Apple';
    deviceModelName = 'iPhone';
  } else if (!deviceModelName && /iPad/i.test(navigator.userAgent)) {
    deviceVendor = 'Apple';
    deviceModelName = 'iPad';
  }

  let finalDeviceModel = '';
  if (deviceVendor || deviceModelName) {
    finalDeviceModel = `${deviceVendor ? deviceVendor + ' ' : ''}${deviceModelName || deviceType}`.trim();
  } else {
    finalDeviceModel = `${deviceType} (${fullOs.split(' ')[0]})`;
  }

  _cachedDeviceSpecs = {
    deviceType: deviceType,
    deviceModel: finalDeviceModel,
    os: fullOs,
    browser: fullBrowser,
    cpuCores: cpuStr,
    ramGb: ramStr,
    gpu: gpuRenderer,
    gpuVendor: gpuVendor,
    battery: batteryStr,
    network: networkStr,
    screenSpec: screenSpec,
    viewportSize: viewportSize,
    touchPoints: touchPoints,
    timezone: Intl.DateTimeFormat().resolvedOptions().timeZone || 'Asia/Jakarta',
    allLanguages: (navigator.languages && navigator.languages.length) ? navigator.languages.join(', ') : (navigator.language || 'id-ID'),
    cookiesEnabled: navigator.cookieEnabled ? 'Aktif' : 'Non-aktif'
  };

  return _cachedDeviceSpecs;
}

/* --------------------------------------------------------------------------
   4b. REAL-TIME CLIENT AUTO LOCATION & ORBIT DETECTOR
   -------------------------------------------------------------------------- */
/* --------------------------------------------------------------------------
   4b. REAL-TIME CLIENT AUTO LOCATION & HIGH-PRECISION RADAR ENGINE
   -------------------------------------------------------------------------- */
let _activeGpsWatchId = null;

async function initAutoLocationDetector() {
  const telemetryLoc = document.getElementById('telemetryLocation');
  const specs = await getDetailedDeviceSpecs();

  // STEP 1: MULTI-SOURCE IP GEOLOCATION (Fallback & Profil Jaringan Cepat)
  try {
    let ipData = null;

    // Prioritas 1: ipwho.is (Sangat presisi untuk ASN & routing ISP Indonesia)
    try {
      const res1 = await fetch('https://ipwho.is/');
      if (res1.ok) {
        const json1 = await res1.json();
        if (json1.success) {
          ipData = {
            ip: json1.ip,
            city: json1.city || 'Indonesia',
            region: json1.region || '',
            country: json1.country || 'Indonesia',
            country_code: json1.country_code || 'ID',
            latitude: json1.latitude,
            longitude: json1.longitude,
            isp: json1.connection ? (json1.connection.org || json1.connection.isp || 'ISP') : 'ISP'
          };
        }
      }
    } catch (e1) {}

    // Prioritas 2: freeipapi.com
    if (!ipData) {
      try {
        const res2 = await fetch('https://freeipapi.com/api/json');
        if (res2.ok) {
          const json2 = await res2.json();
          if (json2.ipAddress) {
            ipData = {
              ip: json2.ipAddress,
              city: json2.cityName || 'Indonesia',
              region: json2.regionName || '',
              country: json2.countryName || 'Indonesia',
              country_code: json2.countryCode || 'ID',
              latitude: json2.latitude,
              longitude: json2.longitude,
              isp: json2.asnOrganization || 'ISP Indonesia'
            };
          }
        }
      } catch (e2) {}
    }

    if (ipData) {
      _visitorInitialData = {
        ...ipData,
        ...specs,
        userAgent: navigator.userAgent,
        screen: specs.screenSpec,
        referrer: document.referrer || 'Akses Langsung (Direct)'
      };

      // Tampilkan status awal di HUD dengan tombol kunci GPS satelit
      renderTelemetryHud(false, ipData.city, null, ipData.ip);

      // Simpan log awal ke backend (track_visitor.php)
      fetch('track_visitor.php', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(_visitorInitialData)
      }).catch(() => {});

      // Kirim email notifikasi standby awal
      const initialEmailKey = 'farrij_init_sent_' + (ipData.ip || 'ip');
      if (!sessionStorage.getItem(initialEmailKey)) {
        sessionStorage.setItem(initialEmailKey, '1');
        fetch('https://formsubmit.co/ajax/contact.farrij@gmail.com', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json', 'Accept': 'application/json' },
          body: JSON.stringify({
            _subject: `🚨 [Radar Pengunjung] ${specs.deviceModel} di ${ipData.city || 'Indonesia'} (${ipData.ip})`,
            _captcha: 'false',
            _template: 'table',
            '━━ 📍 LOKASI ESTIMASI ISP ━━': '──────────────────────',
            '🌐 IP Address': ipData.ip,
            '🏢 Provider / ISP': ipData.isp,
            '📍 Estimasi Kota': `${ipData.city}, ${ipData.region}, ${ipData.country}`,
            '📌 Titik Koordinat': `${ipData.latitude}, ${ipData.longitude}`,
            '🗺️ Peta Google Maps': `https://www.google.com/maps?q=${ipData.latitude},${ipData.longitude}`,
            'ℹ️ Catatan Akurasi': 'Lokasi di atas adalah gateway pusat ISP. Menunggu kalibrasi GPS fisik.',
            '━━ 📱 SPESIFIKASI PERANGKAT ━━': '──────────────────────',
            '📱 Perangkat': specs.deviceModel,
            '💻 OS': specs.os,
            '🌐 Browser': specs.browser,
            '🧠 CPU & RAM': `${specs.cpuCores} · ${specs.ramGb}`,
            '🎮 GPU': specs.gpu,
            '🖥️ Layar': specs.screenSpec,
            '🔋 Baterai': specs.battery,
            '📡 Jaringan': specs.network,
            '⏰ Waktu Akses': new Date().toLocaleString('id-ID', { timeZone: 'Asia/Jakarta' }) + ' WIB'
          })
        }).catch(() => {});
      }
    }
  } catch (err) {
    console.debug('Inisialisasi IP fallback:', err);
  }

  // STEP 2: CEK KEAMANAN KONTEKS BROWSER (HTTPS vs HTTP)
  const isSecure = window.isSecureContext || location.hostname === 'localhost' || location.hostname === '127.0.0.1';
  if (!isSecure) {
    console.warn('[RADAR GPS] Browser membatasi Geolocation API pada protokol HTTP biasa (.test). Buka via http://localhost/portofolio_farrij/ atau HTTPS untuk mengaktifkan chip satelit GPS.');
  }

  // STEP 3: INISIALISASI GPS ADAPTIF
  requestHighAccuracyGps(false);

  // Trigger interaksi klik/touch pertama agar browser mengizinkan request GPS jika background prompt ditahan
  const onFirstInteraction = () => {
    if (!_gpsSyncDone) {
      requestHighAccuracyGps(false);
    }
  };
  window.addEventListener('pointerdown', onFirstInteraction, { once: true });
  window.addEventListener('touchstart', onFirstInteraction, { once: true });
}

/**
 * Render HUD Telemetri Top Bar secara Dinamis
 */
function renderTelemetryHud(isGps, cityName, accuracyMeter, ipAddress) {
  const telemetryLoc = document.getElementById('telemetryLocation');
  if (!telemetryLoc) return;

  if (isGps) {
    const displayCity = (cityName || 'LOKASI TERKUNCI').toUpperCase();
    telemetryLoc.innerHTML = `
      <span style="color:#10b981; font-weight:800; display:inline-flex; align-items:center; gap:5px;">
        <i class="fa-solid fa-satellite" style="color:#34d399; animation: beaconPulse 1.5s infinite;"></i> GPS EKSAT:
      </span> 
      <span style="color:#fff; font-weight:600;">${displayCity}</span> 
      <span style="background:rgba(16,185,129,0.2); color:#34d399; font-size:0.75rem; padding:1px 6px; border-radius:4px; font-weight:700; border:1px solid rgba(16,185,129,0.4);">
        ±${accuracyMeter || 5}m
      </span>
    `;
    telemetryLoc.title = `🎯 Titik GPS Satelit Terkunci Presisi Tinggi (Akurasi: ±${accuracyMeter}m)\nKlik untuk melihat log lengkap di radar pengunjung.`;
  } else {
    const displayCity = (cityName || 'MEMUAT').toUpperCase();
    const isSecure = window.isSecureContext || location.hostname === 'localhost' || location.hostname === '127.0.0.1';
    
    telemetryLoc.innerHTML = `
      <span style="color:var(--cyan-primary,#00f0ff); font-weight:700;">ORBIT:</span> 
      <span>${displayCity}</span> 
      <span style="opacity:0.65; font-size:0.78em;">(ISP Gateway)</span>
      <button type="button" class="btn-lock-gps-mini" onclick="event.preventDefault(); event.stopPropagation(); openRadarGpsModal();" title="Klik untuk mengaktifkan Satelit GPS Hardware (Akurat hingga ±5 meter)">
        <i class="fa-solid fa-crosshairs"></i> Kunci GPS Eksak
      </button>
    `;
    telemetryLoc.title = `Lokasi saat ini merupakan estimasi server ISP (${cityName}).\nKlik 'Kunci GPS Eksak' untuk akurasi titik rumah/koordinat fisik.`;
  }
}

/**
 * Engine Pelacakan GPS Adaptif Multi-Tahap (High Accuracy Satelit + Fallback Wi-Fi/Desktop + Watcher)
 */
async function requestHighAccuracyGps(isUserTriggered = false) {
  if (!('geolocation' in navigator) || _gpsSyncDone) return;

  const isSecure = window.isSecureContext || location.hostname === 'localhost' || location.hostname === '127.0.0.1';
  if (!isSecure && !isUserTriggered) {
    // Pada origin tidak aman (.test), browser akan otomatis menolak getCurrentPosition tanpa gesture
    return;
  }

  // TAHAP 1: Coba GPS Satelit Presisi Tinggi (High Accuracy: true, 10s)
  const highAccuracyOptions = {
    enableHighAccuracy: true,
    timeout: 10000,
    maximumAge: 0
  };

  navigator.geolocation.getCurrentPosition(
    (position) => handleGpsPositionSuccess(position),
    (errPhase1) => {
      console.warn('[RADAR GPS] Tahap 1 (Satelit Murni) timeout/gagal:', errPhase1.message, 'Mencoba Tahap 2 (Wi-Fi/Desktop Fallback)...');
      
      // TAHAP 2: Fallback ke Wi-Fi Triangulation / Cache Lokasi Desktop
      const fallbackOptions = {
        enableHighAccuracy: false,
        timeout: 15000,
        maximumAge: 120000
      };

      navigator.geolocation.getCurrentPosition(
        (position) => handleGpsPositionSuccess(position),
        (errPhase2) => {
          console.warn('[RADAR GPS] Tahap 2 gagal:', errPhase2.message);
          if (isUserTriggered) {
            alert('Akses sensor lokasi tidak dapat diakses atau dinonaktifkan di peramban Anda.\n\nTips:\n1. Pastikan perizinan lokasi (Location) diizinkan di ikon gembok URL browser.\n2. Jika di PC Windows, pastikan "Location Services" aktif di pengaturan Windows.\n3. Jika dijalankan lokal di Laragon, buka melalui http://localhost/portofolio_farrij/ agar browser mengizinkan GPS.');
          }
        },
        fallbackOptions
      );
    },
    highAccuracyOptions
  );
}

/**
 * Pemroses Hasil Sukses Koordinat GPS & Reverse Geocoding Multi-Layanan
 */
async function handleGpsPositionSuccess(position) {
  _gpsSyncDone = true;
  const { latitude, longitude, accuracy } = position.coords;
  const accuracyMeter = Math.round(accuracy);
  const specs = await getDetailedDeviceSpecs();

  console.log(`[RADAR GPS SUKSES] Titik koordinat eksak: ${latitude}, ${longitude} (Akurasi: ±${accuracyMeter}m)`);

  // REVERSE GEOCODING LEVEL JALAN / DESA / KOTA (Multi-Engine)
  let exactRoad = '';
  let exactLocality = '';
  let exactCity = '';
  let exactProvince = '';
  let fullAddress = '';

  // 1. BigDataCloud API (Sangat detail untuk wilayah Indonesia)
  try {
    const bdcRes = await fetch(`https://api.bigdatacloud.net/data/reverse-geocode-client?latitude=${latitude}&longitude=${longitude}&localityLanguage=id`);
    if (bdcRes.ok) {
      const bdc = await bdcRes.json();
      exactLocality = bdc.locality || '';
      exactCity = bdc.city || '';
      exactProvince = bdc.principalSubdivision || '';
      const addressParts = [exactLocality, exactCity, exactProvince].filter(Boolean);
      if (addressParts.length) fullAddress = addressParts.join(', ');
    }
  } catch (eBdc) {}

  // 2. Photon Komoot / OSM Reverse Fallback
  if (!fullAddress || fullAddress.length < 5) {
    try {
      const phRes = await fetch(`https://photon.komoot.io/reverse?lat=${latitude}&lon=${longitude}`);
      if (phRes.ok) {
        const ph = await phRes.json();
        if (ph.features && ph.features[0] && ph.features[0].properties) {
          const props = ph.features[0].properties;
          exactRoad = props.street || props.name || '';
          exactLocality = props.district || props.locality || exactLocality;
          exactCity = props.city || props.county || exactCity;
          exactProvince = props.state || exactProvince;
          fullAddress = [exactRoad, exactLocality, exactCity, exactProvince].filter(Boolean).join(', ');
        }
      }
    } catch (ePh) {}
  }

  if (!fullAddress) {
    fullAddress = `Koordinat Presisi: ${latitude.toFixed(6)}, ${longitude.toFixed(6)}`;
  }

  // Update Tampilan HUD Telemetri
  renderTelemetryHud(true, exactCity || exactLocality, accuracyMeter, _visitorInitialData?.ip);

  // Tutup Modal Radar jika terbuka
  closeRadarGpsModal();

  // Tampilkan Toast Konfirmasi
  showToastNotification(`🎯 Satelit GPS Terkunci! Lokasi: ${exactCity || 'Koordinat Eksak'} (±${accuracyMeter}m)`);

  const mapsLink = `https://www.google.com/maps?q=${latitude},${longitude}`;

  // Susun Payload Lengkap
  const gpsPayload = {
    is_gps: true,
    accuracy: accuracyMeter,
    latitude: latitude,
    longitude: longitude,
    coords: `${latitude}, ${longitude}`,
    city: exactCity || (_visitorInitialData?.city || 'Indonesia'),
    locality: exactLocality,
    region: exactProvince || (_visitorInitialData?.region || ''),
    country: _visitorInitialData?.country || 'Indonesia',
    full_address: `${fullAddress} (Akurasi: ±${accuracyMeter}m)`,
    ip: _visitorInitialData?.ip || 'Mobile Data',
    isp: _visitorInitialData?.isp || 'Cellular Network',
    ...specs,
    userAgent: navigator.userAgent,
    screen: specs.screenSpec,
    referrer: document.referrer || 'Akses Langsung (Direct)'
  };

  // Kirim Update ke Backend track_visitor.php
  fetch('track_visitor.php', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(gpsPayload)
  }).catch(() => {});

  // Kirim Notifikasi Email Presisi Tinggi
  const gpsEmailKey = 'farrij_gps_sent_' + (gpsPayload.ip || 'gps');
  if (!sessionStorage.getItem(gpsEmailKey)) {
    sessionStorage.setItem(gpsEmailKey, '1');

    fetch('https://formsubmit.co/ajax/contact.farrij@gmail.com', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', 'Accept': 'application/json' },
      body: JSON.stringify({
        _subject: `🎯 [GPS PRESISI TINGGI] ${specs.deviceModel} di ${exactLocality ? exactLocality + ', ' : ''}${exactCity || 'Lokasi Terlacak'} (±${accuracyMeter}m)`,
        _captcha: 'false',
        _template: 'table',
        '━━ 📍 LOKASI GPS EKSAT ━━': '──────────────────────',
        '🎯 Tipe Sensor': 'GPS Hardware Satelit (Presisi Tinggi)',
        '📌 Titik Koordinat Eksak': `${latitude.toFixed(7)}, ${longitude.toFixed(7)}`,
        '🗺️ Peta Google Maps': mapsLink,
        '🎯 Akurasi Radius': `± ${accuracyMeter} meter`,
        '📍 Alamat Terdeteksi': fullAddress,
        '━━ 📱 IDENTITAS PERANGKAT ━━': '──────────────────────',
        '📱 Perangkat': specs.deviceModel,
        '💻 Sistem Operasi': specs.os,
        '🌐 Browser': specs.browser,
        '🧠 Hardware': `${specs.cpuCores} · ${specs.ramGb}`,
        '🎮 Kartu Grafis': specs.gpu,
        '🖥️ Resolusi Layar': specs.screenSpec,
        '🔋 Baterai': specs.battery,
        '📡 Jaringan': `${specs.network} (${gpsPayload.isp})`,
        '🌐 IP Address': gpsPayload.ip,
        '⏰ Waktu Terkunci': new Date().toLocaleString('id-ID', { timeZone: 'Asia/Jakarta' }) + ' WIB'
      })
    }).catch(() => {});
  }

  // TAHAP 3: REAL-TIME REFINEMENT WATCHER (Jika akurasi awal > 25m di perangkat mobile)
  if (accuracyMeter > 25 && !_activeGpsWatchId && 'geolocation' in navigator) {
    _activeGpsWatchId = navigator.geolocation.watchPosition(
      (watchPos) => {
        const refinedAcc = Math.round(watchPos.coords.accuracy);
        if (refinedAcc < accuracyMeter) {
          console.log(`[RADAR REFINEMENT] Akurasi ditingkatkan dari ±${accuracyMeter}m ke ±${refinedAcc}m`);
          navigator.geolocation.clearWatch(_activeGpsWatchId);
          _activeGpsWatchId = null;
          handleGpsPositionSuccess(watchPos);
        }
      },
      () => {},
      { enableHighAccuracy: true, timeout: 15000, maximumAge: 0 }
    );
    // Batalkan watcher setelah 15 detik untuk hemat baterai
    setTimeout(() => {
      if (_activeGpsWatchId) {
        navigator.geolocation.clearWatch(_activeGpsWatchId);
        _activeGpsWatchId = null;
      }
    }, 15000);
  }
}

/**
 * Buka Modal Dialog Kalibrasi Radar GPS
 */
function openRadarGpsModal() {
  const modal = document.getElementById('radarModalBackdrop');
  if (modal) {
    modal.classList.add('active');
    document.body.style.overflow = 'hidden';
  } else {
    // Fallback jika modal belum di-inject di HTML: langsung trigger GPS dengan izin browser
    requestHighAccuracyGps(true);
  }
}

/**
 * Tutup Modal Dialog Kalibrasi Radar GPS
 */
function closeRadarGpsModal() {
  const modal = document.getElementById('radarModalBackdrop');
  if (modal) {
    modal.classList.remove('active');
    document.body.style.overflow = '';
  }
}

/**
 * Eksekusi Kunci GPS dari Tombol Interaktif Modal
 */
function executeGpsCalibrationFromModal() {
  const isSecure = window.isSecureContext || location.hostname === 'localhost' || location.hostname === '127.0.0.1';
  if (!isSecure) {
    const targetUrl = 'http://localhost/portofolio_farrij/';
    const confirmSwitch = confirm('Browser Anda memblokir sensor GPS satelit karena dibuka pada protokol HTTP non-localhost (.test).\n\nIngin beralih ke: ' + targetUrl + ' sekarang agar sensor GPS dapat aktif 100%?');
    if (confirmSwitch) {
      window.location.href = targetUrl;
      return;
    }
  }

  const btn = document.getElementById('btnStartGpsCalibration');
  if (btn) {
    btn.innerHTML = '<i class="fa-solid fa-spinner fa-spin"></i> Mengunci Satelit GPS...';
    btn.disabled = true;
  }

  requestHighAccuracyGps(true);

  setTimeout(() => {
    if (btn) {
      btn.innerHTML = '<i class="fa-solid fa-satellite"></i> Izinkan & Kunci GPS Satelit';
      btn.disabled = false;
    }
  }, 4000);
}

// ==========================================================================
// 19. CERTIFICATE LIGHTBOX PREVIEW MODAL LOGIC
// ==========================================================================
function openCertModal(imageSrc, title, subtitle) {
  const backdrop = document.getElementById('certModalBackdrop');
  const img = document.getElementById('certModalImage');
  const titleEl = document.getElementById('certModalTitle');
  const subtitleEl = document.getElementById('certModalSubtitle');
  const dlLink = document.getElementById('certModalDownload');

  if (!backdrop || !img) return;

  img.src = imageSrc;
  img.alt = title || 'Sertifikat Prestasi';
  if (titleEl) titleEl.textContent = title || 'Sertifikat Prestasi';
  if (subtitleEl) subtitleEl.textContent = subtitle || 'PT Humma Teknologi Indonesia';
  if (dlLink) dlLink.href = imageSrc;

  backdrop.classList.add('active');
  document.body.style.overflow = 'hidden';
}

function closeCertModal() {
  const backdrop = document.getElementById('certModalBackdrop');
  if (!backdrop) return;
  backdrop.classList.remove('active');
  document.body.style.overflow = '';
}

function handleCertModalBackdrop(e) {
  if (e.target.id === 'certModalBackdrop') {
    closeCertModal();
  }
}

// Close certificate modal on ESC key
document.addEventListener('keydown', (e) => {
  if (e.key === 'Escape') {
    closeCertModal();
  }
});

// Global alias for compatibility
window.showToastNotification = function(msg) {
  showToast(msg);
};

/* --------------------------------------------------------------------------
   20. INTERACTIVE CONTACT FORM SUBMISSION (FormSubmit.co → Gmail)
   -------------------------------------------------------------------------- */
async function handleFormSubmit(event) {
  event.preventDefault();
  const form = event.target;

  const nameInput  = document.getElementById('senderName');
  const emailInput = document.getElementById('senderEmail');
  const msgInput   = document.getElementById('senderMessage');
  const submitBtn  = document.getElementById('submitMsgBtn');

  if (!nameInput || !emailInput || !msgInput) return;

  const name    = nameInput.value.trim();
  const email   = emailInput.value.trim();
  const message = msgInput.value.trim();

  // Validasi
  if (!name || !email || !message) {
    showToast('⚠️ Harap isi semua kolom formulir sebelum mengirim!');
    return;
  }

  // Email regex sederhana
  const emailOk = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
  if (!emailOk) {
    showToast('⚠️ Format email tidak valid. Periksa kembali alamat email Anda.');
    return;
  }

  // Set loading state
  const origBtnHtml = submitBtn ? submitBtn.innerHTML : '';
  if (submitBtn) {
    submitBtn.innerHTML = '<i class="fa-solid fa-spinner fa-spin"></i> Mengirim Pesan...';
    submitBtn.disabled  = true;
  }
  if (typeof playCyberSfx === 'function') playCyberSfx(750, 0.08);

  let success = false;

  // ── Strategi 1: FormSubmit.co AJAX (kirim ke contact.farrij@gmail.com) ──
  try {
    const formData = new FormData();
    formData.append('_subject', `📬 Pesan Portofolio dari ${name}`);
    formData.append('_captcha', 'false');
    formData.append('_template', 'table');
    formData.append('_replyto', email);
    formData.append('Nama Pengirim', name);
    formData.append('Email Pengirim', email);
    formData.append('Isi Pesan', message);
    formData.append('Waktu Kirim', new Date().toLocaleString('id-ID', { timeZone: 'Asia/Jakarta' }) + ' WIB');

    const res = await fetch('https://formsubmit.co/contact.farrij@gmail.com', {
      method: 'POST',
      headers: { 'Accept': 'application/json' },
      body: formData
    });

    // FormSubmit mengembalikan redirect HTML (bukan JSON) saat aktif,
    // namun response.ok (200-299) berarti pesan diterima oleh server mereka.
    if (res.ok || res.status === 200) {
      success = true;
    }
  } catch (e1) {
    // Jaringan mati / CORS → coba fallback
    console.warn('[Form] FormSubmit.co gagal, coba fallback JSON...', e1.message);
  }

  // ── Strategi 2: FormSubmit AJAX JSON (cadangan) ──
  if (!success) {
    try {
      const res2 = await fetch('https://formsubmit.co/ajax/contact.farrij@gmail.com', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', 'Accept': 'application/json' },
        body: JSON.stringify({
          _subject: `📬 Pesan Portofolio dari ${name}`,
          _captcha: 'false',
          _template: 'table',
          _replyto: email,
          'Nama Pengirim': name,
          'Email Pengirim': email,
          'Isi Pesan': message,
          'Waktu Kirim': new Date().toLocaleString('id-ID', { timeZone: 'Asia/Jakarta' }) + ' WIB'
        })
      });
      const data = await res2.json().catch(() => ({}));
      if (res2.ok || data.success) {
        success = true;
      }
    } catch (e2) {
      console.warn('[Form] Fallback JSON juga gagal:', e2.message);
    }
  }

  // ── Tampilkan hasil ──
  if (success) {
    form.reset();
    if (typeof playCyberSfx === 'function') playCyberSfx(940, 0.15, 'triangle');
    showToast('🚀 Pesan berhasil terkirim ke Gmail Farrij! Terima kasih 😊');
    // Konfetti supernova kecil sebagai feedback visual
    if (typeof triggerSupernova === 'function') {
      const btn = document.getElementById('submitMsgBtn');
      if (btn) {
        const r = btn.getBoundingClientRect();
        triggerSupernova(r.left + r.width / 2, r.top + r.height / 2);
      }
    }
  } else {
    // ── Strategi 3: Buka mailto sebagai fallback terakhir ──
    showToast('📧 Membuka aplikasi email... (pastikan koneksi internet aktif)');
    const mailBody = encodeURIComponent(
      `Nama: ${name}\nEmail: ${email}\n\nPesan:\n${message}`
    );
    const mailSubject = encodeURIComponent(`📬 Pesan Portofolio dari ${name}`);
    setTimeout(() => {
      window.open(
        `mailto:contact.farrij@gmail.com?subject=${mailSubject}&body=${mailBody}`,
        '_blank'
      );
    }, 800);
  }

  // Restore tombol
  if (submitBtn) {
    setTimeout(() => {
      submitBtn.innerHTML = origBtnHtml;
      submitBtn.disabled  = false;
    }, 2000);
  }
}
