class GitHubStatsPage {
  constructor() {
    this.rocketAnimation = null;
    this.init();
  }
  init() {
    this.setupEventListeners();
    this.addLoadingAnimation();
    this.setupKeyboardNavigation();
    this.addStatsRefresh();
    this.setupPortfolioButton();
  }
  setupPortfolioButton() {
    const portfolioBtn = document.getElementById('portfolio-btn');
    if (portfolioBtn) {
      portfolioBtn.addEventListener('click', this.launchRocket.bind(this));
    }
  }
  launchRocket() {
    console.log('🚀 Launching rocket to portfolio!');
    const head = document.head;
    if (!document.getElementById('portfolio-preconnect')) {
      const preconnect = document.createElement('link');
      preconnect.rel = 'preconnect';
      preconnect.href = 'https://fixeqyt.github.io/';
      preconnect.id = 'portfolio-preconnect';
      head.appendChild(preconnect);
    }
    if (!document.getElementById('portfolio-preload')) {
      const preload = document.createElement('link');
      preload.rel = 'preload';
      preload.as = 'document';
      preload.href = 'https://fixeqyt.github.io/';
      preload.id = 'portfolio-preload';
      head.appendChild(preload);
    }
    const portfolioBtn = document.getElementById('portfolio-btn');
    if (portfolioBtn) {
      portfolioBtn.disabled = true;
      portfolioBtn.style.opacity = '0.7';
    }
    const canvas = document.getElementById('rocket-canvas');
    canvas.classList.remove('rocket-canvas-hidden');
    canvas.classList.add('rocket-canvas-visible');
    document.body.classList.add('launching');
    this.initRocketScene();
  }
  initRocketScene() {
    const canvas = document.getElementById('rocket-canvas');
    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
    const renderer = new THREE.WebGLRenderer({ canvas: canvas, alpha: true });
    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.setClearColor(0x000000, 0);
    const rocketGroup = this.createRocket();
    scene.add(rocketGroup);
    const fireParticles = this.createFireParticles();
    scene.add(fireParticles);
    const smokeParticles = this.createSmokeParticles();
    scene.add(smokeParticles);
    const stars = this.createStars();
    scene.add(stars);
    camera.position.z = 10;
    camera.position.y = -2;
    rocketGroup.position.set(0, -8, 0);
    let time = 0;
    const startTime = Date.now();
    const animate = () => {
      time = (Date.now() - startTime) / 1000;
      if (time < 1) {
        rocketGroup.position.x = (Math.random() - 0.5) * 0.3;
        rocketGroup.rotation.z = (Math.random() - 0.5) * 0.1;
        fireParticles.children.forEach(particle => {
          particle.material.opacity = time * 0.8;
        });
        smokeParticles.children.forEach(particle => {
          particle.material.opacity = time * 0.4;
        });
      } else if (time < 4) {
        const progress = (time - 1) / 3;
        rocketGroup.position.y = -8 + progress * 30;
        rocketGroup.position.x = 0;
        rocketGroup.rotation.z = 0;
        fireParticles.children.forEach(particle => {
          particle.material.opacity = 1;
        });
        smokeParticles.children.forEach(particle => {
          particle.material.opacity = 0.8;
        });
        if (time < 2) {
          camera.position.x = (Math.random() - 0.5) * 0.2;
          camera.position.y = -2 + (Math.random() - 0.5) * 0.2;
        }
      } else if (time < 6) {
        rocketGroup.visible = false;
        fireParticles.visible = false;
        const expandProgress = (time - 4) / 2;
        smokeParticles.scale.set(
          1 + expandProgress * 15, 
          1 + expandProgress * 15, 
          1 + expandProgress * 15
        );
        smokeParticles.children.forEach(particle => {
          particle.material.opacity = Math.min(1, 0.8 + expandProgress * 0.5);
          particle.material.color.setHSL(0, 0, 0.9 + expandProgress * 0.1);
        });
        camera.position.x = Math.sin(time * 2) * 0.1;
        camera.position.y = -2 + Math.cos(time * 3) * 0.1;
      } else {
        smokeParticles.scale.set(20, 20, 20);
        smokeParticles.children.forEach(particle => {
          particle.material.opacity = 1;
          particle.material.color.setRGB(1, 1, 1); 
        });
      }
      if (time < 4 && fireParticles.visible) {
        fireParticles.rotation.y += 0.15;
        fireParticles.children.forEach((particle, i) => {
          const rocketBottomY = rocketGroup.position.y - 1; 
          if (particle.position.y < rocketBottomY - 4) {
            particle.position.set(
              (Math.random() - 0.5) * 0.6,
              rocketBottomY - 0.2, 
              (Math.random() - 0.5) * 0.6
            );
          }
          particle.position.y -= 0.1 + Math.random() * 0.1;
          particle.position.x += (Math.random() - 0.5) * 0.05;
          particle.position.z += (Math.random() - 0.5) * 0.05;
          particle.scale.setScalar(0.8 + Math.sin(time * 20 + i) * 0.4);
          const intensity = time > 1 ? 1 : time;
          particle.material.color.setHSL(0.1 - Math.random() * 0.1, 1, 0.4 + intensity * 0.4);
        });
      }
      if (time > 0.5 && smokeParticles.visible) {
        smokeParticles.rotation.y += 0.01;
        if (time > 0.5 && time < 2.5 && Math.random() < 0.7) {
          const newSmoke = this.createSingleSmokeParticle();
          newSmoke.position.set(
            (Math.random() - 0.5) * 2.5,
            -8.5 + (Math.random() - 0.5) * 0.5,
            (Math.random() - 0.5) * 2.5
          );
          newSmoke.scale.setScalar(0.3 + Math.random() * 0.5);
          smokeParticles.add(newSmoke);
        }
        smokeParticles.children.forEach((particle, i) => {
          particle.scale.multiplyScalar(1.012 + Math.random() * 0.01);
          particle.material.opacity = Math.min(1, particle.material.opacity + 0.01);
          particle.position.y += 0.005 + Math.random() * 0.008;
          particle.position.x += (Math.random() - 0.5) * 0.008;
          particle.position.z += (Math.random() - 0.5) * 0.008;
        });
      }
      stars.children.forEach((star, i) => {
        star.material.opacity = 0.3 + Math.sin(time * 4 + i) * 0.4;
        star.rotation.z += 0.01;
      });
      renderer.render(scene, camera);
      if (time < 7) {
        requestAnimationFrame(animate);
      } else {
        this.finishRocketAnimation();
      }
    };
    animate();
    setTimeout(() => {
      const portfolioBtn = document.getElementById('portfolio-btn');
      if (portfolioBtn) {
        portfolioBtn.style.display = 'none';
        portfolioBtn.style.visibility = 'hidden';
        portfolioBtn.style.opacity = '0';
        portfolioBtn.setAttribute('hidden', 'true');
        if (portfolioBtn.parentNode) portfolioBtn.parentNode.removeChild(portfolioBtn);
      }
      document.body.style.background = '#08080C';
      const statsLink = document.getElementById('stats-link');
      if (statsLink) {
        statsLink.style.display = 'none';
        statsLink.style.visibility = 'hidden';
        statsLink.style.opacity = '0';
        statsLink.setAttribute('hidden', 'true');
        if (statsLink.parentNode) statsLink.parentNode.removeChild(statsLink);
      }
      const credits = document.getElementById('credits');
      if (credits) {
        credits.style.display = 'none';
        credits.style.visibility = 'hidden';
        credits.style.opacity = '0';
        credits.setAttribute('hidden', 'true');
        if (credits.parentNode) credits.parentNode.removeChild(credits);
      }
      const fadeDuration = 500;
      const fadeStart = performance.now();
      const smokeStartOpacities = smokeParticles.children.map(p => p.material.opacity);
      const fireStartOpacities = fireParticles.children.map(p => p.material.opacity);
      function fadeOutParticles(now) {
        const t = Math.min(1, (now - fadeStart) / fadeDuration);
        smokeParticles.children.forEach((p, i) => {
          if (p.material && p.material.opacity !== undefined) {
            p.material.opacity = smokeStartOpacities[i] * (1 - t);
          }
        });
        fireParticles.children.forEach((p, i) => {
          if (p.material && p.material.opacity !== undefined) {
            p.material.opacity = fireStartOpacities[i] * (1 - t);
          }
        });
        if (t < 1) {
          requestAnimationFrame(fadeOutParticles);
        } else {
          smokeParticles.visible = false;
          fireParticles.visible = false;
        }
      }
      requestAnimationFrame(fadeOutParticles);
    }, 4000);
  }
  createRocket() {
    const group = new THREE.Group();
    const bodyGeometry = new THREE.CylinderGeometry(0.3, 0.5, 2, 8);
    const bodyMaterial = new THREE.MeshBasicMaterial({ color: 0xcccccc });
    const body = new THREE.Mesh(bodyGeometry, bodyMaterial);
    const noseGeometry = new THREE.ConeGeometry(0.3, 1, 8);
    const noseMaterial = new THREE.MeshBasicMaterial({ color: 0xff4444 });
    const nose = new THREE.Mesh(noseGeometry, noseMaterial);
    nose.position.y = 1.5;
    const finGeometry = new THREE.BoxGeometry(0.1, 0.8, 0.3);
    const finMaterial = new THREE.MeshBasicMaterial({ color: 0x888888 });
    for (let i = 0; i < 4; i++) {
      const fin = new THREE.Mesh(finGeometry, finMaterial);
      const angle = (i / 4) * Math.PI * 2;
      fin.position.x = Math.cos(angle) * 0.4;
      fin.position.z = Math.sin(angle) * 0.4;
      fin.position.y = -0.8;
      group.add(fin);
    }
    group.add(body);
    group.add(nose);
    return group;
  }
  createFireParticles() {
    const group = new THREE.Group();
    for (let i = 0; i < 30; i++) {
      const geometry = new THREE.SphereGeometry(0.05 + Math.random() * 0.15, 6, 6);
      const hue = 0.15 - (i / 30) * 0.15; 
      const material = new THREE.MeshBasicMaterial({ 
        color: new THREE.Color().setHSL(hue, 1, 0.6),
        transparent: true,
        opacity: 0.9
      });
      const particle = new THREE.Mesh(geometry, material);
      particle.position.set(
        (Math.random() - 0.5) * 0.8,
        -2.5 - Math.random() * 1.2, 
        (Math.random() - 0.5) * 0.8
      );
      particle.userData = {
        velocity: {
          x: (Math.random() - 0.5) * 0.03,
          y: -(0.08 + Math.random() * 0.15), 
          z: (Math.random() - 0.5) * 0.03
        }
      };
      group.add(particle);
    }
    return group;
  }
  createSmokeParticles() {
    const group = new THREE.Group();
    for (let i = 0; i < 100; i++) { 
      const geometry = new THREE.SphereGeometry(0.2 + Math.random() * 0.5, 8, 8); 
      const material = new THREE.MeshBasicMaterial({ 
        color: new THREE.Color().setHSL(0, 0, 0.5 + Math.random() * 0.4), 
        transparent: true,
        opacity: 0.6
      });
      const particle = new THREE.Mesh(geometry, material);
      particle.position.set(
        (Math.random() - 0.5) * 3.0, 
        -8.5 - Math.random() * 1.0, 
        (Math.random() - 0.5) * 3.0 
      );
      particle.userData = {
        velocity: {
          x: (Math.random() - 0.5) * 0.02,
          y: 0, 
          z: (Math.random() - 0.5) * 0.02
        },
        initialScale: particle.scale.x
      };
      group.add(particle);
    }
    return group;
  }
  createSingleSmokeParticle() {
    const geometry = new THREE.SphereGeometry(0.1 + Math.random() * 0.2, 8, 8);
    const material = new THREE.MeshBasicMaterial({ 
      color: new THREE.Color().setHSL(0, 0, 0.6 + Math.random() * 0.3),
      transparent: true,
      opacity: 0.5
    });
    const particle = new THREE.Mesh(geometry, material);
    particle.userData = {
      velocity: {
        x: (Math.random() - 0.5) * 0.02,
        y: 0,
        z: (Math.random() - 0.5) * 0.02
      },
      initialScale: particle.scale.x
    };
    return particle;
  }
  createStars() {
    const group = new THREE.Group();
    for (let i = 0; i < 100; i++) {
      const geometry = new THREE.SphereGeometry(0.02, 4, 4);
      const material = new THREE.MeshBasicMaterial({ 
        color: 0xffffff,
        transparent: true,
        opacity: Math.random()
      });
      const star = new THREE.Mesh(geometry, material);
      star.position.set(
        (Math.random() - 0.5) * 50,
        (Math.random() - 0.5) * 50,
        (Math.random() - 0.5) * 50
      );
      group.add(star);
    }
    return group;
  }
  finishRocketAnimation() {
    console.log('🌟 Rocket launched! Smoke covering screen, redirecting...');
    window.location.href = 'https://fixeqyt.github.io/';
  }
  handleResize(camera, renderer) {
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(window.innerWidth, window.innerHeight);
  }
  setupEventListeners() {
    const statsLink = document.getElementById("stats-link");
    const statsImg = document.getElementById("stats-img");
    const credits = document.getElementById("credits");
    if (statsLink) {
      statsLink.addEventListener('mouseenter', this.onStatsHover.bind(this));
      statsLink.addEventListener('mouseleave', this.onStatsLeave.bind(this));
      statsLink.addEventListener('click', this.onStatsClick.bind(this));
    }
    if (statsImg) {
      statsImg.addEventListener('load', this.onImageLoad.bind(this));
      statsImg.addEventListener('error', this.onImageError.bind(this));
    }
    if (credits) {
      credits.addEventListener('mouseenter', this.onCreditsHover.bind(this));
      credits.addEventListener('mouseleave', this.onCreditsLeave.bind(this));
    }
    document.addEventListener('keydown', this.handleKeyboard.bind(this));
  }
  addLoadingAnimation() {
    const statsLink = document.getElementById("stats-link");
    const credits = document.getElementById("credits");
    if (statsLink) {
      statsLink.style.opacity = '0';
      statsLink.style.transform = 'translateY(20px)';
      setTimeout(() => {
        statsLink.style.transition = 'opacity 0.6s ease-out, transform 0.6s ease-out';
        statsLink.style.opacity = '1';
        statsLink.style.transform = 'translateY(0)';
      }, 100);
    }
    if (credits) {
      credits.style.opacity = '0';
      credits.style.transform = 'translateY(20px)';
      setTimeout(() => {
        credits.style.transition = 'opacity 0.6s ease-out, transform 0.6s ease-out';
        credits.style.opacity = '1';
        credits.style.transform = 'translateY(0)';
      }, 300);
    }
  }
  setupKeyboardNavigation() {
    const focusableElements = document.querySelectorAll('a[href]');
    this.focusableElements = Array.from(focusableElements);
    this.currentFocusIndex = 0;
  }
  handleKeyboard(event) {
    switch(event.key) {
      case 'Tab':
        break;
      case 'Enter':
      case ' ':
        if (document.activeElement.id === 'stats-link') {
          event.preventDefault();
          this.triggerStatsClick();
        }
        break;
      case 'r':
      case 'R':
        if (event.ctrlKey || event.metaKey) {
          event.preventDefault();
          this.refreshStats();
        }
        break;
    }
  }
  addStatsRefresh() {
    const statsImg = document.getElementById("stats-img");
    if (statsImg) {
      statsImg.addEventListener('dblclick', this.refreshStats.bind(this));
    }
  }
  refreshStats() {
    const statsImg = document.getElementById("stats-img");
    if (statsImg) {
      const originalSrc = statsImg.src.split('&cache_bust=')[0];
      const cacheBust = Date.now();
      this.showLoadingIndicator();
      statsImg.src = `${originalSrc}&cache_bust=${cacheBust}`;
    }
  }
  showLoadingIndicator() {
    const statsLink = document.getElementById("stats-link");
    if (statsLink) {
      statsLink.style.opacity = '0.7';
      statsLink.style.pointerEvents = 'none';
      const spinner = document.createElement('div');
      spinner.id = 'loading-spinner';
      spinner.innerHTML = '⟳';
      spinner.style.cssText = `
        position: absolute;
        top: 50%;
        left: 50%;
        transform: translate(-50%, -50%);
        font-size: 2rem;
        animation: spin 1s linear infinite;
        color: #58A6FF;
      `;
      if (!document.getElementById('spinner-styles')) {
        const style = document.createElement('style');
        style.id = 'spinner-styles';
        style.textContent = `
          @keyframes spin {
            from { transform: translate(-50%, -50%) rotate(0deg); }
            to { transform: translate(-50%, -50%) rotate(360deg); }
          }
        `;
        document.head.appendChild(style);
      }
      statsLink.style.position = 'relative';
      statsLink.appendChild(spinner);
    }
  }
  onImageLoad() {
    const statsLink = document.getElementById("stats-link");
    const spinner = document.getElementById('loading-spinner');
    if (statsLink) {
      statsLink.style.opacity = '1';
      statsLink.style.pointerEvents = 'auto';
    }
    if (spinner) {
      spinner.remove();
    }
    console.log('GitHub stats loaded successfully');
  }
  onImageError() {
    const statsImg = document.getElementById("stats-img");
    const spinner = document.getElementById('loading-spinner');
    if (spinner) {
      spinner.remove();
    }
    console.error('Failed to load GitHub stats');
    if (statsImg) {
      statsImg.alt = 'GitHub Stats temporarily unavailable';
      statsImg.style.opacity = '0.5';
    }
  }
  onStatsHover() {
    console.log('Hovering over GitHub stats');
  }
  onStatsLeave() {
    console.log('Left GitHub stats hover');
  }
  onStatsClick(event) {
    console.log('GitHub stats clicked, redirecting to main page');
    const statsLink = event.currentTarget;
    statsLink.style.transform = 'scale(0.95)';
    setTimeout(() => {
      statsLink.style.transform = '';
    }, 150);
  }
  triggerStatsClick() {
    const statsLink = document.getElementById("stats-link");
    if (statsLink) {
      statsLink.click();
    }
  }
  onCreditsHover() {
    console.log('Hovering over credits');
  }
  onCreditsLeave() {
    console.log('Left credits hover');
  }
  getPageStats() {
    return {
      referrer: document.referrer,
      userAgent: navigator.userAgent,
      timestamp: new Date().toISOString()
    };
  }
}
document.addEventListener('DOMContentLoaded', () => {
  new GitHubStatsPage();
});
