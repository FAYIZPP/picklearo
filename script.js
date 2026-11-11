/* ============================================
   PICKLEARO — Main Script
   ============================================ */

(function () {
  'use strict';

  // ─── DOM refs ───
  const navbar     = document.getElementById('navbar');
  const navToggle  = document.getElementById('navToggle');
  const navMenu    = document.getElementById('navMenu');
  const navOverlay = document.getElementById('navOverlay');
  const navLinks   = document.querySelectorAll('.navbar__link');

  // ─── Mobile Nav Toggle ───
  function openNav() {
    navToggle.classList.add('is-active');
    navToggle.setAttribute('aria-expanded', 'true');
    navMenu.classList.add('is-open');
    navOverlay.classList.add('is-visible');
    navOverlay.setAttribute('aria-hidden', 'false');
    document.body.style.overflow = 'hidden';
  }

  function closeNav() {
    navToggle.classList.remove('is-active');
    navToggle.setAttribute('aria-expanded', 'false');
    navMenu.classList.remove('is-open');
    navOverlay.classList.remove('is-visible');
    navOverlay.setAttribute('aria-hidden', 'true');
    document.body.style.overflow = '';
  }

  navToggle.addEventListener('click', () => {
    const isOpen = navMenu.classList.contains('is-open');
    isOpen ? closeNav() : openNav();
  });

  navOverlay.addEventListener('click', closeNav);

  // Close on link click (mobile)
  navLinks.forEach(link => {
    link.addEventListener('click', closeNav);
  });

  // Close on Escape
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && navMenu.classList.contains('is-open')) {
      closeNav();
      navToggle.focus();
    }
  });

  // ─── Navbar scroll effect & WhatsApp FAB ───
  const whatsappFab = document.getElementById('whatsappFab');
  const heroTrackEl = document.getElementById('hero');

  function handleNavScroll() {
    const scrollY = window.scrollY;
    if (scrollY > 50) {
      navbar.style.background = 'rgba(11, 61, 46, .95)';
      navbar.style.boxShadow = '0 2px 12px rgba(0,0,0,.18)';
    } else {
      navbar.style.background = 'rgba(11, 61, 46, .55)';
      navbar.style.boxShadow = 'none';
    }

    if (whatsappFab) {
      const heroDone = heroTrackEl
        ? heroTrackEl.getBoundingClientRect().bottom <= window.innerHeight * 1.08
        : scrollY > window.innerHeight * 0.6;
      if (heroDone) {
        whatsappFab.classList.add('is-visible');
      } else {
        whatsappFab.classList.remove('is-visible');
      }
    }
  }

  handleNavScroll();
  window.addEventListener('scroll', handleNavScroll, { passive: true });

  // ─── Scroll Reveal (IntersectionObserver) ───
  const revealElements = document.querySelectorAll('[data-reveal]');

  // Check if user prefers reduced motion
  const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  if (prefersReducedMotion) {
    // Instantly reveal everything
    revealElements.forEach(el => el.classList.add('is-revealed'));
  } else {
    const revealObserver = new IntersectionObserver(
      (entries) => {
        entries.forEach(entry => {
          if (entry.isIntersecting) {
            const delay = entry.target.dataset.revealDelay || 0;
            setTimeout(() => {
              entry.target.classList.add('is-revealed');
            }, parseInt(delay));
            revealObserver.unobserve(entry.target);
          }
        });
      },
      {
        threshold: 0.15,
        rootMargin: '0px 0px -40px 0px',
      }
    );

    revealElements.forEach(el => revealObserver.observe(el));
  }

  // ─── Active nav link highlight on scroll ───
  const sections = document.querySelectorAll('section[id]');

  function highlightNav() {
    const scrollPos = window.scrollY + navbar.offsetHeight + 100;

    sections.forEach(section => {
      const top = section.offsetTop;
      const bottom = top + section.offsetHeight;
      const id = section.getAttribute('id');

      navLinks.forEach(link => {
        if (link.getAttribute('href') === '#' + id) {
          if (scrollPos >= top && scrollPos < bottom) {
            link.style.color = 'var(--clr-white)';
          } else {
            link.style.color = '';
          }
        }
      });
    });
  }

  window.addEventListener('scroll', highlightNav, { passive: true });

  // ─── Newsletter form handler (demo) ───
  const newsletterForm = document.querySelector('.newsletter__form');
  if (newsletterForm) {
    newsletterForm.addEventListener('submit', (e) => {
      e.preventDefault();
      const emailInput = newsletterForm.querySelector('.newsletter__input');
      const email = emailInput.value.trim();

      if (email) {
        // Simulated success
        const btn = newsletterForm.querySelector('.newsletter__btn');
        const originalText = btn.textContent;
        btn.textContent = '✓ Subscribed!';
        btn.style.background = 'var(--clr-accent-hover)';
        emailInput.value = '';

        setTimeout(() => {
          btn.textContent = originalText;
          btn.style.background = '';
        }, 3000);
      }
    });
  }

  // ─── Add-to-Cart button handler (demo) ───
  document.querySelectorAll('.product-card .btn--accent').forEach(btn => {
    btn.addEventListener('click', function () {
      const originalText = this.textContent;
      this.textContent = '✓ Added!';
      this.style.background = 'var(--clr-primary)';
      this.style.color = 'var(--clr-white)';

      setTimeout(() => {
        this.textContent = originalText;
        this.style.background = '';
        this.style.color = '';
      }, 1500);
    });
  });

  // ─── Smooth scroll for all anchor links ───
  document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', (e) => {
      const targetId = anchor.getAttribute('href');
      if (targetId === '#') return;

      const target = document.querySelector(targetId);
      if (target) {
        e.preventDefault();
        const navHeight = navbar.offsetHeight;
        const targetPosition = target.getBoundingClientRect().top + window.scrollY - navHeight;

        window.scrollTo({
          top: targetPosition,
          behavior: prefersReducedMotion ? 'auto' : 'smooth',
        });
      }
    });
  });

  // ==========================================
  // HERO SCROLL-DRIVEN ANIMATION ENGINE
  // ==========================================
  const heroSection = document.getElementById('hero');
  const canvas = document.getElementById('heroCanvas');
  const stage1 = document.getElementById('heroStage1');
  const stage2 = document.getElementById('heroStage2');
  const stage3 = document.getElementById('heroStage3');
  const scrollPrompt = document.getElementById('heroScrollPrompt');
  const progressFill = document.getElementById('heroProgressFill');

  if (heroSection && canvas) {
    const ctx = canvas.getContext('2d', { alpha: false });
    const TOTAL_FRAMES = 238;
    const IMG_RATIO = 1280 / 720;
    const FRAME_URL = (i) =>
      `hero/optimized/ezgif-frame-${String(i + 1).padStart(3, '0')}.jpg`;

    const frames = new Array(TOTAL_FRAMES);
    const loaded = new Array(TOTAL_FRAMES).fill(false);

    let targetProgress = 0;
    let smoothProgress = 0;
    let lastDrawnFrame = -1;
    let lastDrawnProgress = -1;
    let isLoopRunning = false;

    function clamp01(v) {
      return Math.max(0, Math.min(1, v));
    }

    function rangeProgress(val, start, end) {
      return clamp01((val - start) / (end - start));
    }

    // Resize canvas cleanly for crisp Retina rendering
    function resizeCanvas() {
      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      const w = canvas.clientWidth || window.innerWidth;
      const h = canvas.clientHeight || window.innerHeight;
      if (canvas.width !== Math.round(w * dpr) || canvas.height !== Math.round(h * dpr)) {
        canvas.width = Math.round(w * dpr);
        canvas.height = Math.round(h * dpr);
      }
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      lastDrawnFrame = -1; // Force redraw on resize
      renderAtProgress(smoothProgress);
    }

    // Find closest loaded frame if exact frame isn't cached yet
    function getFrameImage(idx) {
      if (loaded[idx] && frames[idx]) return frames[idx];
      for (let d = 1; d < TOTAL_FRAMES; d++) {
        if (idx - d >= 0 && loaded[idx - d]) return frames[idx - d];
        if (idx + d < TOTAL_FRAMES && loaded[idx + d]) return frames[idx + d];
      }
      return null;
    }

    // Paint frame with responsive framing (desktop side-to-center glide, mobile portrait framing)
    function drawScene(img, progress) {
      const cw = canvas.clientWidth || window.innerWidth;
      const ch = canvas.clientHeight || window.innerHeight;
      const viewRatio = cw / ch;

      // Studio forest green backdrop matching frame edge pixels
      const bgGrad = ctx.createRadialGradient(cw * 0.55, ch * 0.45, 20, cw * 0.5, ch * 0.5, Math.max(cw, ch));
      bgGrad.addColorStop(0, '#1D422A');
      bgGrad.addColorStop(1, '#102719');
      ctx.fillStyle = bgGrad;
      ctx.fillRect(0, 0, cw, ch);

      if (!img || !img.complete || img.naturalWidth === 0) return;

      let drawW, drawH, drawX, drawY;

      if (cw >= 960 || (viewRatio >= 1 && cw >= 540)) {
        // Desktop & wide landscape: cover viewport + slight cinematic zoom during explosion
        const zoom = 1 + rangeProgress(progress, 0.25, 0.85) * 0.07;
        const baseW = viewRatio > IMG_RATIO ? cw : ch * IMG_RATIO;
        const baseH = baseW / IMG_RATIO;
        drawW = baseW * zoom;
        drawH = baseH * zoom;

        // Smoothly glide jar from right-offset (clear of Stage 1 headline) to dead-center during explosion
        const centerFactor = 1 - rangeProgress(progress, 0.02, 0.30);
        const shiftPct = cw >= 960 ? 0.14 : 0.18;
        const shiftX = cw * shiftPct * centerFactor;
        drawX = (cw - drawW) / 2 + shiftX;
        drawY = (ch - drawH) / 2;

        ctx.drawImage(img, drawX, drawY, drawW, drawH);

        // Soft feather left edge if shifted right so left area blends seamlessly
        if (drawX > 0) {
          const featherGrad = ctx.createLinearGradient(drawX - 10, 0, drawX + 140, 0);
          featherGrad.addColorStop(0, '#142D1D');
          featherGrad.addColorStop(1, 'rgba(20, 45, 29, 0)');
          ctx.fillStyle = featherGrad;
          ctx.fillRect(0, 0, drawX + 140, ch);
        }
      } else if (viewRatio < 1) {
        const zoom = 1 + rangeProgress(progress, 0.25, 0.85) * 0.14;
        drawW = Math.max(cw * 1.48, ch * 0.85) * zoom;
        drawH = drawW / IMG_RATIO;
        drawX = (cw - drawW) / 2;

        // Position jar higher at 0% scroll so it shines clearly above Stage 1 bottom text,
        // then glide cleanly to center during the burst
        const yGlide = rangeProgress(progress, 0.04, 0.32);
        const centerY = ch * (0.28 + yGlide * 0.20);
        drawY = centerY - drawH / 2;

        ctx.drawImage(img, drawX, drawY, drawW, drawH);

        // Soft feather top & bottom edges into deep forest green studio backdrop
        const edgeFade = Math.min(80, drawH * 0.18);
        if (drawY > 0) {
          const topFade = ctx.createLinearGradient(0, drawY - 2, 0, drawY + edgeFade);
          topFade.addColorStop(0, '#122B1C');
          topFade.addColorStop(1, 'rgba(18, 43, 28, 0)');
          ctx.fillStyle = topFade;
          ctx.fillRect(0, 0, cw, drawY + edgeFade);
        }
        const bottomEdge = drawY + drawH;
        if (bottomEdge < ch) {
          const botFade = ctx.createLinearGradient(0, bottomEdge - edgeFade, 0, bottomEdge + 2);
          botFade.addColorStop(0, 'rgba(16, 39, 25, 0)');
          botFade.addColorStop(1, '#102719');
          ctx.fillStyle = botFade;
          ctx.fillRect(0, bottomEdge - edgeFade, cw, ch - (bottomEdge - edgeFade));
        }
      } else {
        // Landscape phones / tablets
        const baseW = viewRatio > IMG_RATIO ? cw : ch * IMG_RATIO;
        drawW = baseW;
        drawH = baseW / IMG_RATIO;
        drawX = (cw - drawW) / 2;
        drawY = (ch - drawH) / 2;
        ctx.drawImage(img, drawX, drawY, drawW, drawH);
      }
    }

    // Synchronize overlay text stages with scroll progress
    function updateStages(progress) {
      if (progressFill) {
        progressFill.style.width = `${(progress * 100).toFixed(2)}%`;
      }

      if (scrollPrompt) {
        if (progress > 0.04) {
          scrollPrompt.classList.add('is-hidden');
        } else {
          scrollPrompt.classList.remove('is-hidden');
        }
      }

      // Stage 1: Intro headline (0 -> 0.25)
      if (stage1) {
        const out = rangeProgress(progress, 0.06, 0.25);
        const op1 = 1 - out;
        stage1.style.opacity = op1.toFixed(3);
        stage1.style.transform = `translate3d(0, ${(-out * 40).toFixed(1)}px, 0)`;
        stage1.style.pointerEvents = op1 > 0.15 ? 'auto' : 'none';
      }

      // Stage 2: Mid-scroll callout (0.30 -> 0.62)
      if (stage2) {
        const fadeIn = rangeProgress(progress, 0.30, 0.40);
        const fadeOut = rangeProgress(progress, 0.52, 0.62);
        const op2 = fadeIn * (1 - fadeOut);
        const y2 = (1 - fadeIn) * 26 - fadeOut * 26;
        stage2.style.opacity = op2.toFixed(3);
        stage2.style.transform = `translate3d(0, ${y2.toFixed(1)}px, 0)`;
        stage2.setAttribute('aria-hidden', op2 < 0.1 ? 'true' : 'false');
      }

      // Stage 3: Peak explosion callout (0.65 -> 0.96)
      if (stage3) {
        const fadeIn = rangeProgress(progress, 0.65, 0.75);
        const fadeOut = rangeProgress(progress, 0.92, 0.99);
        const op3 = fadeIn * (1 - fadeOut);
        const y3 = (1 - fadeIn) * 26 - fadeOut * 20;
        stage3.style.opacity = op3.toFixed(3);
        stage3.style.transform = `translate3d(0, ${y3.toFixed(1)}px, 0)`;
        stage3.style.pointerEvents = op3 > 0.2 ? 'auto' : 'none';
        stage3.setAttribute('aria-hidden', op3 < 0.1 ? 'true' : 'false');
      }
    }

    function renderAtProgress(progress) {
      const frameIdx = Math.max(
        0,
        Math.min(TOTAL_FRAMES - 1, Math.round(progress * (TOTAL_FRAMES - 1)))
      );

      if (frameIdx !== lastDrawnFrame || Math.abs(progress - lastDrawnProgress) > 0.001) {
        const img = getFrameImage(frameIdx);
        drawScene(img, progress);
        lastDrawnFrame = frameIdx;
        lastDrawnProgress = progress;
      }

      updateStages(progress);
    }

    // Measure scroll progress strictly across the hero scroll track
    function computeScrollTarget() {
      const rect = heroSection.getBoundingClientRect();
      const scrollDistance = heroSection.offsetHeight - window.innerHeight;
      if (scrollDistance <= 0) return 0;
      return clamp01(-rect.top / scrollDistance);
    }

    // Smooth animation tick using lerp
    function tick() {
      const diff = targetProgress - smoothProgress;

      if (Math.abs(diff) > 0.0004) {
        smoothProgress += diff * 0.14;
        renderAtProgress(smoothProgress);
        requestAnimationFrame(tick);
      } else {
        smoothProgress = targetProgress;
        renderAtProgress(smoothProgress);
        isLoopRunning = false;
      }
    }

    function requestTick() {
      if (!isLoopRunning) {
        isLoopRunning = true;
        requestAnimationFrame(tick);
      }
    }

    // Preload a single frame
    function loadFrame(index) {
      return new Promise((resolve) => {
        if (loaded[index] && frames[index]) {
          resolve(frames[index]);
          return;
        }
        const img = new Image();
        img.onload = () => {
          frames[index] = img;
          loaded[index] = true;
          // If this frame is currently visible (or frame 0 on boot), render immediately
          const currentIdx = Math.round(smoothProgress * (TOTAL_FRAMES - 1));
          if (Math.abs(index - currentIdx) <= 4 || index === 0) {
            lastDrawnFrame = -1;
            renderAtProgress(smoothProgress);
          }
          resolve(img);
        };
        img.onerror = () => resolve(null);
        img.src = FRAME_URL(index);
      });
    }

    // Multi-pass priority preloader:
    // Pass 1: Frame 0 immediately
    // Pass 2: Keyframes every 8th frame across the whole scroll timeline so fast scrolling is always sharp
    // Pass 3: Fill in all remaining frames smoothly in small chunks
    async function preloadFrames() {
      await loadFrame(0);

      // Pass 2: Distributed keyframes (every 8th frame)
      const keyframes = [];
      for (let i = 8; i < TOTAL_FRAMES; i += 8) {
        keyframes.push(loadFrame(i));
      }
      await Promise.all(keyframes);

      // Pass 3: Remaining frames in batches of 8
      const remaining = [];
      for (let i = 1; i < TOTAL_FRAMES; i++) {
        if (i % 8 !== 0) remaining.push(i);
      }
      const CHUNK = 8;
      for (let i = 0; i < remaining.length; i += CHUNK) {
        await Promise.all(remaining.slice(i, i + CHUNK).map(loadFrame));
      }
    }

    if (prefersReducedMotion) {
      // Reduced motion: load hero frame 0 & burst preview cleanly without scroll scrubbing
      resizeCanvas();
      loadFrame(0).then(() => renderAtProgress(0));
    } else {
      window.addEventListener(
        'scroll',
        () => {
          targetProgress = computeScrollTarget();
          requestTick();
        },
        { passive: true }
      );

      window.addEventListener('resize', resizeCanvas);

      resizeCanvas();
      targetProgress = computeScrollTarget();
      smoothProgress = targetProgress;
      renderAtProgress(smoothProgress);
      preloadFrames();
    }
  }

})();

