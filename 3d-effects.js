// ============================================================================
// SIMPLE NAME-WRITING INTRO + THREE.JS BACKGROUND EFFECTS
// ============================================================================

(function () {
    const INTRO_DURATION = 2600;

    function hideIntro() {
        const intro = document.getElementById('intro3d');
        if (!intro) return;

        intro.classList.add('is-hidden');
        document.body.classList.remove('intro-running');

        setTimeout(() => {
            intro.remove();
        }, 900);
    }

    function initIntroScene() {
        const intro = document.getElementById('intro3d');
        if (!intro) return;

        document.body.classList.add('intro-running');
        setTimeout(hideIntro, INTRO_DURATION);
    }

    function initBackgroundScene() {
        const canvas = document.getElementById('threejs-canvas');
        if (!canvas || typeof THREE === 'undefined') return;

        const ACCENT = 0xF0EDCC;
        const ACCENT_LIGHT = 0xF7F4DE;

        const scene = new THREE.Scene();
        const camera = new THREE.PerspectiveCamera(65, window.innerWidth / window.innerHeight, 0.1, 1000);
        camera.position.z = 8;

        const renderer = new THREE.WebGLRenderer({ canvas, antialias: true, alpha: true });
        renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 2));
        renderer.setSize(window.innerWidth, window.innerHeight);

        // --- Rig that everything sits inside, used for mouse parallax ---
        const rig = new THREE.Group();
        scene.add(rig);

        // --- Cluster of drifting wireframe polyhedra (crisp edges, not full mesh wireframe) ---
        const shapeGeometries = [
            new THREE.IcosahedronGeometry(1, 0),
            new THREE.OctahedronGeometry(0.85, 0),
            new THREE.DodecahedronGeometry(0.7, 0),
            new THREE.TetrahedronGeometry(0.9, 0)
        ];

        const shapes = [];
        const shapeCount = 7;
        for (let i = 0; i < shapeCount; i++) {
            const geo = shapeGeometries[i % shapeGeometries.length];
            const edges = new THREE.EdgesGeometry(geo);
            const color = i % 2 === 0 ? ACCENT : ACCENT_LIGHT;
            const line = new THREE.LineSegments(
                edges,
                new THREE.LineBasicMaterial({ color, transparent: true, opacity: 0.45 })
            );

            const spread = 6;
            line.position.set(
                (Math.random() - 0.5) * spread * 2.2,
                (Math.random() - 0.5) * spread * 1.4,
                -Math.random() * 8 - 1
            );
            const scale = 0.5 + Math.random() * 0.9;
            line.scale.setScalar(scale);

            line.userData = {
                rotSpeedX: (Math.random() - 0.5) * 0.006,
                rotSpeedY: (Math.random() - 0.5) * 0.006,
                floatSpeed: 0.4 + Math.random() * 0.6,
                floatOffset: Math.random() * Math.PI * 2,
                baseY: line.position.y
            };

            rig.add(line);
            shapes.push(line);
        }

        // --- Connected particle network (constellation effect) ---
        const nodeCount = 55;
        const spreadX = 20;
        const spreadY = 12;
        const spreadZ = 10;
        const nodePositions = [];

        for (let i = 0; i < nodeCount; i++) {
            nodePositions.push(new THREE.Vector3(
                (Math.random() - 0.5) * spreadX,
                (Math.random() - 0.5) * spreadY,
                -Math.random() * spreadZ - 1
            ));
        }

        const nodeGeometry = new THREE.BufferGeometry();
        const nodeArray = new Float32Array(nodeCount * 3);
        nodePositions.forEach((v, i) => {
            nodeArray[i * 3] = v.x;
            nodeArray[i * 3 + 1] = v.y;
            nodeArray[i * 3 + 2] = v.z;
        });
        nodeGeometry.setAttribute('position', new THREE.BufferAttribute(nodeArray, 3));
        const nodePoints = new THREE.Points(
            nodeGeometry,
            new THREE.PointsMaterial({ color: 0xffffff, size: 0.05, transparent: true, opacity: 0.6 })
        );
        rig.add(nodePoints);

        // Draw lines between nearby nodes to form a network mesh
        const linkDistance = 4.2;
        const linkPositions = [];
        for (let i = 0; i < nodePositions.length; i++) {
            for (let j = i + 1; j < nodePositions.length; j++) {
                if (nodePositions[i].distanceTo(nodePositions[j]) < linkDistance) {
                    linkPositions.push(
                        nodePositions[i].x, nodePositions[i].y, nodePositions[i].z,
                        nodePositions[j].x, nodePositions[j].y, nodePositions[j].z
                    );
                }
            }
        }
        const linkGeometry = new THREE.BufferGeometry();
        linkGeometry.setAttribute('position', new THREE.BufferAttribute(new Float32Array(linkPositions), 3));
        const linkMesh = new THREE.LineSegments(
            linkGeometry,
            new THREE.LineBasicMaterial({ color: ACCENT, transparent: true, opacity: 0.18 })
        );
        rig.add(linkMesh);

        // --- Soft background starfield for depth ---
        const starsGeometry = new THREE.BufferGeometry();
        const starCount = 500;
        const stars = new Float32Array(starCount * 3);
        for (let i = 0; i < starCount; i++) {
            stars[i * 3] = (Math.random() - 0.5) * 26;
            stars[i * 3 + 1] = (Math.random() - 0.5) * 16;
            stars[i * 3 + 2] = -Math.random() * 20 - 5;
        }
        starsGeometry.setAttribute('position', new THREE.BufferAttribute(stars, 3));
        const starField = new THREE.Points(
            starsGeometry,
            new THREE.PointsMaterial({ color: 0xffffff, size: 0.014, transparent: true, opacity: 0.4 })
        );
        rig.add(starField);

        // --- Mouse parallax ---
        const mouse = { x: 0, y: 0 };
        const targetRotation = { x: 0, y: 0 };
        window.addEventListener('mousemove', (e) => {
            mouse.x = (e.clientX / window.innerWidth) * 2 - 1;
            mouse.y = (e.clientY / window.innerHeight) * 2 - 1;
        }, { passive: true });

        function resize() {
            const width = window.innerWidth;
            const height = window.innerHeight;
            camera.aspect = width / height;
            camera.updateProjectionMatrix();
            renderer.setSize(width, height);
        }

        const clock = new THREE.Clock();

        function animate() {
            const t = clock.getElapsedTime();

            shapes.forEach((s) => {
                s.rotation.x += s.userData.rotSpeedX;
                s.rotation.y += s.userData.rotSpeedY;
                s.position.y = s.userData.baseY + Math.sin(t * s.userData.floatSpeed + s.userData.floatOffset) * 0.35;
            });

            nodePoints.rotation.y += 0.0004;
            linkMesh.rotation.y += 0.0004;
            starField.rotation.y += 0.0006;

            targetRotation.x += (mouse.y * 0.12 - targetRotation.x) * 0.03;
            targetRotation.y += (mouse.x * 0.16 - targetRotation.y) * 0.03;
            rig.rotation.x = targetRotation.x;
            rig.rotation.y = targetRotation.y;

            renderer.render(scene, camera);
            requestAnimationFrame(animate);
        }

        window.addEventListener('resize', resize);
        animate();
    }

    document.addEventListener('DOMContentLoaded', () => {
        initIntroScene();
        initBackgroundScene();
    });
})();
