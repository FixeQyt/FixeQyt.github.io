class ThreeScene {
    constructor(canvasId) {
        this.canvas = utils.$(canvasId);
        if (!this.canvas) return;
        this.scene = null;
        this.camera = null;
        this.renderer = null;
        this.particles = null;
        this.geometry = null;
        this.material = null;
        this.animationId = null;
        this.mouse = { x: 0, y: 0 };
        this.windowHalf = { x: window.innerWidth / 2, y: window.innerHeight / 2 };
        this.init();
        this.createParticles();
        this.addEventListeners();
        this.animate();
    }
    init() {
        try {
            this.scene = new THREE.Scene();
            this.camera = new THREE.PerspectiveCamera(
                75, 
                window.innerWidth / window.innerHeight, 
                1, 
                1000
            );
            this.camera.position.z = 500;
            this.renderer = new THREE.WebGLRenderer({
                canvas: this.canvas,
                alpha: true,
                antialias: true
            });
            this.renderer.setSize(window.innerWidth, window.innerHeight);
            this.renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
            this.renderer.setClearColor(0x000000, 0);
        } catch (error) {
            utils.errorHandler(error, 'ThreeScene.init');
        }
    }
    createParticles() {
        try {
            const particleCount = 1000;
            const positions = new Float32Array(particleCount * 3);
            const colors = new Float32Array(particleCount * 3);
            const sizes = new Float32Array(particleCount);
            const colorPalette = [
                new THREE.Color(0x4a9eff), 
                new THREE.Color(0xe74c3c), 
                new THREE.Color(0x2ecc71), 
                new THREE.Color(0x9b59b6), 
                new THREE.Color(0xf39c12)  
            ];
            for (let i = 0; i < particleCount; i++) {
                const i3 = i * 3;
                positions[i3] = (Math.random() - 0.5) * 2000;
                positions[i3 + 1] = (Math.random() - 0.5) * 2000;
                positions[i3 + 2] = (Math.random() - 0.5) * 1000;
                const color = colorPalette[Math.floor(Math.random() * colorPalette.length)];
                colors[i3] = color.r;
                colors[i3 + 1] = color.g;
                colors[i3 + 2] = color.b;
                sizes[i] = Math.random() * 3 + 1;
            }
            this.geometry = new THREE.BufferGeometry();
            this.geometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));
            this.geometry.setAttribute('color', new THREE.BufferAttribute(colors, 3));
            this.geometry.setAttribute('size', new THREE.BufferAttribute(sizes, 1));
            this.material = new THREE.ShaderMaterial({
                uniforms: {
                    time: { value: 0 },
                    pixelRatio: { value: Math.min(window.devicePixelRatio, 2) }
                },
                vertexShader: `
                    attribute float size;
                    attribute vec3 color;
                    varying vec3 vColor;
                    uniform float time;
                    void main() {
                        vColor = color;
                        vec3 pos = position;
                        pos.x += sin(time * 0.001 + position.y * 0.01) * 10.0;
                        pos.y += cos(time * 0.001 + position.x * 0.01) * 10.0;
                        pos.z += sin(time * 0.001 + position.x * 0.005) * 5.0;
                        vec4 mvPosition = modelViewMatrix * vec4(pos, 1.0);
                        gl_Position = projectionMatrix * mvPosition;
                        gl_PointSize = size * (300.0 / -mvPosition.z) * (1.0 + sin(time * 0.002) * 0.3);
                    }
                `,
                fragmentShader: `
                    varying vec3 vColor;
                    uniform float time;
                    void main() {
                        vec2 center = gl_PointCoord - 0.5;
                        float dist = length(center);
                        if (dist > 0.5) discard;
                        float alpha = 1.0 - smoothstep(0.0, 0.5, dist);
                        alpha *= (0.8 + 0.2 * sin(time * 0.005));
                        gl_FragColor = vec4(vColor, alpha);
                    }
                `,
                transparent: true,
                vertexColors: true,
                blending: THREE.AdditiveBlending
            });
            this.particles = new THREE.Points(this.geometry, this.material);
            this.scene.add(this.particles);
            this.createGeometricShapes();
        } catch (error) {
            utils.errorHandler(error, 'ThreeScene.createParticles');
        }
    }
    createGeometricShapes() {
        try {
            const shapes = [];
            const torusGeometry = new THREE.TorusGeometry(50, 20, 16, 100);
            const torusMaterial = new THREE.MeshBasicMaterial({
                color: 0x4a9eff,
                wireframe: true,
                transparent: true,
                opacity: 0.2
            });
            const torus = new THREE.Mesh(torusGeometry, torusMaterial);
            torus.position.set(-300, 200, -200);
            shapes.push(torus);
            const octaGeometry = new THREE.OctahedronGeometry(40);
            const octaMaterial = new THREE.MeshBasicMaterial({
                color: 0xe74c3c,
                wireframe: true,
                transparent: true,
                opacity: 0.2
            });
            const octahedron = new THREE.Mesh(octaGeometry, octaMaterial);
            octahedron.position.set(300, -150, -100);
            shapes.push(octahedron);
            const icoGeometry = new THREE.IcosahedronGeometry(35);
            const icoMaterial = new THREE.MeshBasicMaterial({
                color: 0x2ecc71,
                wireframe: true,
                transparent: true,
                opacity: 0.2
            });
            const icosahedron = new THREE.Mesh(icoGeometry, icoMaterial);
            icosahedron.position.set(0, 300, -300);
            shapes.push(icosahedron);
            shapes.forEach(shape => {
                this.scene.add(shape);
            });
            this.shapes = shapes;
        } catch (error) {
            utils.errorHandler(error, 'ThreeScene.createGeometricShapes');
        }
    }
    addEventListeners() {
        const onMouseMove = utils.throttle((event) => {
            this.mouse.x = (event.clientX - this.windowHalf.x) * 0.001;
            this.mouse.y = (event.clientY - this.windowHalf.y) * 0.001;
        }, 16);
        document.addEventListener('mousemove', onMouseMove);
        const onWindowResize = utils.debounce(() => {
            this.windowHalf.x = window.innerWidth / 2;
            this.windowHalf.y = window.innerHeight / 2;
            this.camera.aspect = window.innerWidth / window.innerHeight;
            this.camera.updateProjectionMatrix();
            this.renderer.setSize(window.innerWidth, window.innerHeight);
        }, 250);
        window.addEventListener('resize', onWindowResize);
        const onVisibilityChange = () => {
            if (document.hidden) {
                this.pause();
            } else {
                this.resume();
            }
        };
        document.addEventListener('visibilitychange', onVisibilityChange);
    }
    animate() {
        this.animationId = requestAnimationFrame(() => this.animate());
        try {
            const time = Date.now();
            if (this.material && this.material.uniforms) {
                this.material.uniforms.time.value = time;
            }
            if (this.particles) {
                this.particles.rotation.x += 0.0005;
                this.particles.rotation.y += 0.001;
            }
            if (this.shapes) {
                this.shapes.forEach((shape, index) => {
                    shape.rotation.x += 0.01 + index * 0.001;
                    shape.rotation.y += 0.005 + index * 0.002;
                    shape.rotation.z += 0.003 + index * 0.001;
                    shape.position.y += Math.sin(time * 0.001 + index) * 0.5;
                });
            }
            this.camera.position.x += (this.mouse.x * 100 - this.camera.position.x) * 0.05;
            this.camera.position.y += (-this.mouse.y * 100 - this.camera.position.y) * 0.05;
            this.camera.lookAt(this.scene.position);
            this.renderer.render(this.scene, this.camera);
        } catch (error) {
            utils.errorHandler(error, 'ThreeScene.animate');
        }
    }
    pause() {
        if (this.animationId) {
            cancelAnimationFrame(this.animationId);
            this.animationId = null;
        }
    }
    resume() {
        if (!this.animationId) {
            this.animate();
        }
    }
    destroy() {
        this.pause();
        if (this.geometry) this.geometry.dispose();
        if (this.material) this.material.dispose();
        if (this.renderer) this.renderer.dispose();
        if (this.shapes) {
            this.shapes.forEach(shape => {
                this.scene.remove(shape);
                shape.geometry.dispose();
                shape.material.dispose();
            });
        }
        if (this.particles) {
            this.scene.remove(this.particles);
        }
    }
    setParticleSpeed(speed) {
        this.particleSpeed = speed;
    }
    setMouseSensitivity(sensitivity) {
        this.mouseSensitivity = sensitivity;
    }
    toggleWireframe() {
        if (this.shapes) {
            this.shapes.forEach(shape => {
                shape.material.wireframe = !shape.material.wireframe;
            });
        }
    }
}
utils.ready(() => {
    try {
        window.threeScene = new ThreeScene('#hero-canvas');
    } catch (error) {
        utils.errorHandler(error, 'ThreeScene initialization');
        console.warn('Three.js scene could not be initialized. Falling back to CSS animations.');
    }
});
