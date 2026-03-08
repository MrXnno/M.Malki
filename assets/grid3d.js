/*!
 * grid3d.js — Grille 3D déformée animée
 * Marwan Malki Portfolio
 * Ajoute <canvas id="grid3d"></canvas> dans le <body>
 * puis <script src="assets/grid3d.js"></script> avant </body>
 */
(function () {
  const canvas = document.getElementById('grid3d');
  if (!canvas) return;
  const ctx = canvas.getContext('2d');

  // ── Config ──────────────────────────────────────────────
  const CFG = {
    cols: 22,          // colonnes de la grille
    rows: 14,          // lignes
    fov: 340,          // perspective
    camZ: 420,         // distance caméra
    waveAmp: 52,       // amplitude de la vague Z
    waveSpeed: 0.0014, // vitesse d'animation
    waveFreq: 0.38,    // fréquence spatiale
    mouseStr: 0.22,    // influence souris
    lineColor1: [99, 102, 241],   // indigo  (--a1)
    lineColor2: [20, 184, 166],   // teal    (--a3)
    glowColor: [236, 72, 153],    // pink    (--a2)
    glowNodes: 6,      // nombre de nœuds brillants
    maxAlpha: 0.38,    // opacité max des lignes
    nodeSize: 1.6,     // taille des points
  };

  // ── State ────────────────────────────────────────────────
  let W, H, t = 0;
  let mx = 0, my = 0; // souris normalisée -1..1

  function resize() {
    W = canvas.width  = window.innerWidth;
    H = canvas.height = window.innerHeight;
  }

  window.addEventListener('resize', resize);
  resize();

  window.addEventListener('mousemove', e => {
    mx = (e.clientX / W) * 2 - 1;
    my = (e.clientY / H) * 2 - 1;
  });

  // ── Projection 3D → 2D ──────────────────────────────────
  function project(x, y, z) {
    const scale = CFG.fov / (CFG.fov + z + CFG.camZ);
    return {
      x: W / 2 + x * scale,
      y: H / 2 + y * scale,
      s: scale,
    };
  }

  // ── Interpolation couleur ────────────────────────────────
  function lerpColor(c1, c2, t) {
    return [
      Math.round(c1[0] + (c2[0] - c1[0]) * t),
      Math.round(c1[1] + (c2[1] - c1[1]) * t),
      Math.round(c1[2] + (c2[2] - c1[2]) * t),
    ];
  }

  // ── Génère les nœuds brillants ───────────────────────────
  let glowNodes = [];
  function resetGlow() {
    glowNodes = Array.from({ length: CFG.glowNodes }, () => ({
      col: Math.random() * CFG.cols,
      row: Math.random() * CFG.rows,
      speed: 0.004 + Math.random() * 0.008,
      dir: Math.random() > 0.5 ? 1 : -1,
      life: Math.random(),
    }));
  }
  resetGlow();

  // ── Boucle principale ────────────────────────────────────
  function draw() {
    ctx.clearRect(0, 0, W, H);

    const spacingX = Math.min(W, 1200) * 0.9 / CFG.cols;
    const spacingY = Math.min(H, 800)  * 0.78 / CFG.rows;
    const offX = -((CFG.cols - 1) * spacingX) / 2;
    const offY = -((CFG.rows - 1) * spacingY) / 2;

    // Calcul des positions 3D de chaque nœud
    const pts = [];
    for (let r = 0; r < CFG.rows; r++) {
      pts[r] = [];
      for (let c = 0; c < CFG.cols; c++) {
        const x3 = offX + c * spacingX + mx * 28;
        const y3 = offY + r * spacingY + my * 18;
        const wave =
          Math.sin(c * CFG.waveFreq + t) *
          Math.cos(r * CFG.waveFreq * 0.7 + t * 0.8) *
          CFG.waveAmp +
          Math.sin((c + r) * 0.22 + t * 1.3) * CFG.waveAmp * 0.4;
        const p = project(x3, y3, wave);
        pts[r][c] = { ...p, z: wave };
      }
    }

    // ── Tracé des lignes horizontales ───────────────────────
    for (let r = 0; r < CFG.rows; r++) {
      for (let c = 0; c < CFG.cols - 1; c++) {
        const a = pts[r][c];
        const b = pts[r][c + 1];
        const prog = c / CFG.cols;
        const col = lerpColor(CFG.lineColor1, CFG.lineColor2, prog);
        const alpha = CFG.maxAlpha * (0.5 + 0.5 * a.s * 2.2);
        ctx.beginPath();
        ctx.moveTo(a.x, a.y);
        ctx.lineTo(b.x, b.y);
        ctx.strokeStyle = `rgba(${col[0]},${col[1]},${col[2]},${Math.min(alpha, CFG.maxAlpha)})`;
        ctx.lineWidth = 0.7 * a.s * 3;
        ctx.stroke();
      }
    }

    // ── Tracé des lignes verticales ─────────────────────────
    for (let c = 0; c < CFG.cols; c++) {
      for (let r = 0; r < CFG.rows - 1; r++) {
        const a = pts[r][c];
        const b = pts[r + 1][c];
        const prog = r / CFG.rows;
        const col = lerpColor(CFG.lineColor2, CFG.lineColor1, prog);
        const alpha = CFG.maxAlpha * 0.65 * (0.5 + 0.5 * a.s * 2.2);
        ctx.beginPath();
        ctx.moveTo(a.x, a.y);
        ctx.lineTo(b.x, b.y);
        ctx.strokeStyle = `rgba(${col[0]},${col[1]},${col[2]},${Math.min(alpha, CFG.maxAlpha * 0.65)})`;
        ctx.lineWidth = 0.5 * a.s * 3;
        ctx.stroke();
      }
    }

    // ── Nœuds brillants qui se baladent ─────────────────────
    glowNodes.forEach(g => {
      g.col += g.speed * g.dir;
      if (g.col < 0 || g.col >= CFG.cols) {
        g.dir *= -1;
        g.row = (g.row + 1.5 + Math.random() * 2) % CFG.rows;
      }
      const ci = Math.floor(g.col);
      const cf = g.col - ci;
      const ri = Math.min(Math.floor(g.row), CFG.rows - 1);
      if (ci >= CFG.cols - 1) return;

      // interpolation entre deux colonnes
      const pa = pts[ri][ci];
      const pb = pts[ri][ci + 1];
      const gx = pa.x + (pb.x - pa.x) * cf;
      const gy = pa.y + (pb.y - pa.y) * cf;

      const pulse = 0.6 + 0.4 * Math.sin(t * 3 + g.col);
      const r = CFG.glowColor[0], gv = CFG.glowColor[1], b = CFG.glowColor[2];

      // halo externe
      const grad = ctx.createRadialGradient(gx, gy, 0, gx, gy, 22 * pulse);
      grad.addColorStop(0,   `rgba(${r},${gv},${b},0.55)`);
      grad.addColorStop(0.4, `rgba(${r},${gv},${b},0.18)`);
      grad.addColorStop(1,   `rgba(${r},${gv},${b},0)`);
      ctx.beginPath();
      ctx.arc(gx, gy, 22 * pulse, 0, Math.PI * 2);
      ctx.fillStyle = grad;
      ctx.fill();

      // point central
      ctx.beginPath();
      ctx.arc(gx, gy, CFG.nodeSize * 1.8 * pulse, 0, Math.PI * 2);
      ctx.fillStyle = `rgba(255,255,255,${0.85 * pulse})`;
      ctx.fill();
    });

    // ── Points de grille ─────────────────────────────────────
    for (let r = 0; r < CFG.rows; r++) {
      for (let c = 0; c < CFG.cols; c++) {
        const p = pts[r][c];
        const alpha = 0.22 * (0.4 + 0.6 * p.s * 2.5);
        ctx.beginPath();
        ctx.arc(p.x, p.y, CFG.nodeSize * p.s * 2.8, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(99,102,241,${Math.min(alpha, 0.35)})`;
        ctx.fill();
      }
    }

    t += CFG.waveSpeed * 60 / 60;
    requestAnimationFrame(draw);
  }

  draw();
})();
