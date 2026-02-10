// ===================================
// Marwan Malki — BTS SIO
// Script JS (Animations & Interactivité)
// ===================================

// Ajouter les orbs animées et les éléments de fleurs si ils n'existent pas
function initAnimatedBackground() {
  const existingOrbs = document.querySelectorAll('.bg-orb').length;
  if (existingOrbs === 0) {
    const body = document.body;
    
    const orb1 = document.createElement('div');
    orb1.className = 'bg-orb bg-orb-1';
    
    const orb2 = document.createElement('div');
    orb2.className = 'bg-orb bg-orb-2';
    
    const orb3 = document.createElement('div');
    orb3.className = 'bg-orb bg-orb-3';
    
    body.insertBefore(orb3, body.firstChild);
    body.insertBefore(orb2, body.firstChild);
    body.insertBefore(orb1, body.firstChild);
  }
}

// Create animated floating flowers
function createFloatingElements() {
  const existingFlowers = document.querySelectorAll('.floating-element').length;
  if (existingFlowers === 0) {
    const body = document.body;
    
    // Flower 1 - Beautiful flower shape
    const flower1 = document.createElement('div');
    flower1.className = 'floating-element flower-1';
    flower1.innerHTML = `
      <svg viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg">
        <circle cx="50" cy="50" r="15" fill="#007bff" opacity="0.9"/>
        <circle cx="50" cy="15" r="12" fill="#00c8ff" opacity="0.8"/>
        <circle cx="80" cy="25" r="12" fill="#0096ff" opacity="0.8"/>
        <circle cx="85" cy="50" r="12" fill="#00c8ff" opacity="0.8"/>
        <circle cx="80" cy="75" r="12" fill="#0096ff" opacity="0.8"/>
        <circle cx="50" cy="85" r="12" fill="#00c8ff" opacity="0.8"/>
        <circle cx="20" cy="75" r="12" fill="#0096ff" opacity="0.8"/>
        <circle cx="15" cy="50" r="12" fill="#00c8ff" opacity="0.8"/>
        <circle cx="20" cy="25" r="12" fill="#0096ff" opacity="0.8"/>
        <path d="M 50 50 Q 55 30 60 50 Q 55 70 50 50" fill="#00c8ff" opacity="0.5"/>
      </svg>
    `;
    
    // Flower 2 - Star-like flower
    const flower2 = document.createElement('div');
    flower2.className = 'floating-element flower-2';
    flower2.innerHTML = `
      <svg viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg">
        <circle cx="50" cy="50" r="12" fill="#ff6b35" opacity="0.95"/>
        <polygon points="50,10 61,39 92,39 67,61 78,90 50,68 22,90 33,61 8,39 39,39" fill="#ff6b35" opacity="0.7"/>
        <circle cx="50" cy="50" r="6" fill="#ffa500" opacity="0.9"/>
      </svg>
    `;
    
    // Leaf - Animated leaf shape
    const leaf = document.createElement('div');
    leaf.className = 'floating-element leaf-element';
    leaf.innerHTML = `
      <svg viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg">
        <path d="M 50 10 Q 80 30 70 70 Q 50 80 30 70 Q 20 30 50 10" fill="#00c8ff" opacity="0.75"/>
        <path d="M 50 20 Q 60 35 55 65 Q 50 72 45 65 Q 40 35 50 20" fill="#007bff" opacity="0.6"/>
        <ellipse cx="50" cy="50" rx="8" ry="15" fill="#0096ff" opacity="0.5"/>
      </svg>
    `;
    
    // Decorative shape - Geometric pattern
    const shape = document.createElement('div');
    shape.className = 'floating-element shape-deco';
    shape.innerHTML = `
      <svg viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg">
        <circle cx="50" cy="50" r="30" fill="none" stroke="#00c8ff" stroke-width="2" opacity="0.7"/>
        <circle cx="50" cy="50" r="20" fill="none" stroke="#007bff" stroke-width="2" opacity="0.8"/>
        <circle cx="50" cy="50" r="10" fill="#0096ff" opacity="0.6"/>
        <rect x="35" y="35" width="30" height="30" fill="none" stroke="#00c8ff" stroke-width="1.5" opacity="0.5"/>
        <g transform="translate(50,50)">
          <line x1="0" y1="-15" x2="0" y2="15" stroke="#007bff" stroke-width="1" opacity="0.6"/>
          <line x1="-15" y1="0" x2="15" y2="0" stroke="#007bff" stroke-width="1" opacity="0.6"/>
          <line x1="-10" y1="-10" x2="10" y2="10" stroke="#0096ff" stroke-width="1" opacity="0.5"/>
          <line x1="-10" y1="10" x2="10" y2="-10" stroke="#0096ff" stroke-width="1" opacity="0.5"/>
        </g>
      </svg>
    `;
    
    body.appendChild(flower1);
    body.appendChild(flower2);
    body.appendChild(leaf);
    body.appendChild(shape);
  }
}

// Intersection Observer pour les animations au scroll
const observerOptions = {
  threshold: 0.1,
  rootMargin: '0px 0px -50px 0px'
};

const observer = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      entry.target.style.opacity = '1';
      entry.target.style.transform = 'translateY(0)';
      observer.unobserve(entry.target);
    }
  });
}, observerOptions);

// Appliquer l'observation à tous les éléments animés
document.addEventListener('DOMContentLoaded', () => {
  initAnimatedBackground();
  createFloatingElements();
  
  const animatedElements = document.querySelectorAll('.card, .panel, .h1, .h2, .badge');
  animatedElements.forEach(el => {
    observer.observe(el);
  });
});

// Theme Toggle
const themeToggleBtn = document.querySelector('[data-theme-toggle]');
if (themeToggleBtn) {
  themeToggleBtn.addEventListener('click', () => {
    const html = document.documentElement;
    const currentTheme = html.getAttribute('data-theme');
    const newTheme = currentTheme === 'light' ? 'dark' : 'light';
    html.setAttribute('data-theme', newTheme);
    localStorage.setItem('theme', newTheme);
  });

  // Charger le thème sauvegardé
  const savedTheme = localStorage.getItem('theme') || 'dark';
  document.documentElement.setAttribute('data-theme', savedTheme);
}

// Mettre à jour l'année du footer
const yearSpan = document.getElementById('y');
if (yearSpan) {
  yearSpan.textContent = new Date().getFullYear();
}

// Marquer le lien actif dans la navigation
document.addEventListener('DOMContentLoaded', () => {
  const currentPage = window.location.pathname.split('/').pop() || 'index.html';
  const navLinks = document.querySelectorAll('.navlinks a');
  
  navLinks.forEach(link => {
    const href = link.getAttribute('href');
    if (href === currentPage || (currentPage === '' && href === 'index.html')) {
      link.classList.add('active');
    }
  });
});

// Animation de clic pour les boutons
document.querySelectorAll('.btn').forEach(btn => {
  btn.addEventListener('click', function(e) {
    const ripple = document.createElement('span');
    const rect = this.getBoundingClientRect();
    const size = Math.max(rect.width, rect.height);
    const x = e.clientX - rect.left - size / 2;
    const y = e.clientY - rect.top - size / 2;

    ripple.style.width = ripple.style.height = size + 'px';
    ripple.style.left = x + 'px';
    ripple.style.top = y + 'px';
    ripple.classList.add('ripple');

    this.appendChild(ripple);

    setTimeout(() => ripple.remove(), 600);
  });
});

// Smooth scroll pour les ancres
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
  anchor.addEventListener('click', function (e) {
    e.preventDefault();
    const target = document.querySelector(this.getAttribute('href'));
    if (target) {
      target.scrollIntoView({ behavior: 'smooth' });
    }
  });
});

// Performance optimization: lazy load images si supporté
if ('IntersectionObserver' in window) {
  const imageObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const img = entry.target;
        img.src = img.dataset.src || img.src;
        img.classList.add('loaded');
        imageObserver.unobserve(img);
      }
    });
  });

  document.querySelectorAll('img[data-src]').forEach(img => {
    imageObserver.observe(img);
  });
}

// Animation au chargement de page
window.addEventListener('load', () => {
  document.body.style.animation = 'none';
});

// ===================================
// CERTIFICATION CELEBRATION FUNCTIONS
// ===================================

/**
 * Célébrer une certification avec animation et confetti
 */
function celebrateCertification(element, certName, pdfPath) {
  // Ajouter l'animation de bounce à la carte
  element.classList.add('celebrating');
  
  // Créer des confetti
  createConfetti();
  
  // Afficher le modal après un court délai
  setTimeout(() => {
    const modal = document.getElementById('celebrationModal');
    if (modal) {
      modal.style.display = 'flex';
      // Relancer l'animation du modal
      modal.offsetHeight; // Forcer le reflow

      // Si un chemin PDF est fourni, remplir et révéler le lien vers le certificat
      try {
        const pdfLink = document.getElementById('certPdfLink');
        if (pdfLink && pdfPath) {
          pdfLink.href = pdfPath;
          pdfLink.target = '_blank';
          pdfLink.style.display = 'inline-block';
        }
      } catch (e) {
        // Ne pas bloquer la célébration si l'élément manque
      }
    }
  }, 600);
  
  // Jouer un son de célébration (optionnel)
  playSuccessSound();
  
  // Retirer l'animation après qu'elle soit terminée
  setTimeout(() => {
    element.classList.remove('celebrating');
  }, 1500);
}

/**
 * Fermer le modal de félicitation
 */
function closeCelebration() {
  const modal = document.getElementById('celebrationModal');
  if (modal) {
    modal.style.display = 'none';
  }
}

/**
 * Créer des particules de confetti qui tombent
 */
function createConfetti() {
  const confettiEmojis = ['🎉', '⭐', '🏆', '✨', '🎊', '🎁', '💫', '🌟'];
  const particleCount = 50;
  
  for (let i = 0; i < particleCount; i++) {
    const confetti = document.createElement('div');
    confetti.className = 'confetti';
    confetti.textContent = confettiEmojis[Math.floor(Math.random() * confettiEmojis.length)];
    
    // Position aléatoire en haut de l'écran
    const startX = Math.random() * window.innerWidth;
    confetti.style.left = startX + 'px';
    confetti.style.top = '-50px';
    
    // Durée d'animation aléatoire
    const duration = 2 + Math.random() * 1.5;
    confetti.style.animation = `confettiFall ${duration}s linear forwards`;
    
    document.body.appendChild(confetti);
    
    // Supprimer le confetti après l'animation
    setTimeout(() => {
      confetti.remove();
    }, duration * 1000);
  }
}

/**
 * Jouer un son de succès (optionnel - compatible avec les navigateurs modernes)
 */
function playSuccessSound() {
  // Utiliser l'API Web Audio pour créer un son simple
  try {
    const audioContext = new (window.AudioContext || window.webkitAudioContext)();
    const oscillator = audioContext.createOscillator();
    const gainNode = audioContext.createGain();
    
    oscillator.connect(gainNode);
    gainNode.connect(audioContext.destination);
    
    // Créer une mélodie simple
    oscillator.frequency.setValueAtTime(520, audioContext.currentTime);
    oscillator.frequency.setValueAtTime(659, audioContext.currentTime + 0.1);
    oscillator.frequency.setValueAtTime(784, audioContext.currentTime + 0.2);
    
    gainNode.gain.setValueAtTime(0.3, audioContext.currentTime);
    gainNode.gain.setValueAtTime(0, audioContext.currentTime + 0.3);
    
    oscillator.start(audioContext.currentTime);
    oscillator.stop(audioContext.currentTime + 0.3);
  } catch (e) {
    // Navigateur non compatible, ignorer silencieusement
  }
}

// Fermer le modal en cliquant en dehors
document.addEventListener('DOMContentLoaded', () => {
  const modal = document.getElementById('celebrationModal');
  if (modal) {
    modal.addEventListener('click', (e) => {
      if (e.target === modal) {
        closeCelebration();
      }
    });
  }
});

