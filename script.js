/* --- script.js --- */

document.addEventListener('DOMContentLoaded', () => {
    
    // --- 1. BOOT SEQUENCE LOGIC ---
    const bootLayer = document.getElementById('boot-layer');
    if (bootLayer) {
        document.body.style.overflow = 'hidden';
        const bootLog = document.querySelector('.boot-log');
        const progressBar = document.querySelector('.boot-progress-bar');
        
        const sequence = [
            { text: "BIOS DATE 01/09/2025 15:22:05 VER 1.2.9", delay: 200 },
            { text: "CPU: NEURAL CORE X9 - 16 CORES ACTIVE", delay: 500 },
            { text: "MEMORY TEST: 32768K OK", delay: 900 },
            { text: "INITIALIZING NOVA_KERNEL v1.4...", delay: 1300 },
            { text: "MOUNTING VIRTUAL FILESYSTEM...", delay: 1800 },
            { text: "LOADING USER INTERFACE...", delay: 2300 }
        ];

        let i = 0;
        function runBoot() {
            if (i < sequence.length) {
                setTimeout(() => {
                    const line = document.createElement('div');
                    line.className = 'boot-line';
                    line.innerText = sequence[i].text;
                    bootLog.appendChild(line);
                    
                    const progress = ((i + 1) / sequence.length) * 100;
                    progressBar.style.width = progress + '%';
                    
                    i++;
                    runBoot();
                }, sequence[i].delay - (i > 0 ? sequence[i-1].delay : 0));
            } else {
                setTimeout(() => {
                    bootLayer.style.transition = 'opacity 0.8s ease';
                    bootLayer.style.opacity = '0';
                    setTimeout(() => {
                        bootLayer.remove();
                        document.body.style.overflow = 'auto';
                    }, 800);
                }, 500);
            }
        }
        runBoot();
    }

    // --- 2. THEME SWITCHER ---
    const themeBtn = document.querySelector('.theme-toggle');
    const themeMenu = document.querySelector('.theme-menu');
    const root = document.documentElement;

    if (themeBtn) {
        themeBtn.addEventListener('click', () => {
            themeMenu.classList.toggle('active');
        });

        document.querySelectorAll('.color-dot').forEach(dot => {
            dot.addEventListener('click', (e) => {
                const color = e.target.getAttribute('data-color');
                const glow = e.target.getAttribute('data-glow');
                root.style.setProperty('--accent-primary', color);
                root.style.setProperty('--accent-glow', glow);
                themeMenu.classList.remove('active');
            });
        });
    }

    // --- 3. DOWNLOAD CONFIGURATOR (UPDATED for Links) ---
// --- 3. DOWNLOAD CONFIGURATOR (UPDATED: FIXED LINK) ---
    const options = document.querySelectorAll('.option-card');
    const downloadBtn = document.getElementById('final-download-btn');
    const sizeLabel = document.getElementById('download-size');
    
    // Default State
    let selectedConfig = { edition: 'Home', arch: 'x86_64' };
    
    // The fixed file path you requested
    const FIXED_DOWNLOAD_LINK = "downloadOS/Nova18OS.ISO";

    options.forEach(opt => {
        opt.addEventListener('click', function() {
            // 1. Visual Selection Logic
            const type = this.getAttribute('data-type');
            document.querySelectorAll(`.option-card[data-type="${type}"]`).forEach(el => el.classList.remove('selected'));
            this.classList.add('selected');
            
            // 2. Update Data State
            selectedConfig[type] = this.getAttribute('data-value');
            
            if(downloadBtn) {
                // 3. Update Visual Text & Size (To keep it looking realistic)
                let size = "1.2 GB";
                if (selectedConfig.edition === 'Pro') size = "2.4 GB";
                if (selectedConfig.arch === 'ARM64') size = (selectedConfig.edition === 'Pro') ? "2.1 GB" : "1.0 GB";
                
                downloadBtn.innerHTML = `Download NovaOS ${selectedConfig.edition} (${selectedConfig.arch})`;
                sizeLabel.innerText = `Estimated Size: ${size} • ISO Image`;

                // 4. FORCE THE LINK TO BE THE SAME FILE ALWAYS
                downloadBtn.setAttribute('href', FIXED_DOWNLOAD_LINK);
            }
        });
    });

    // --- 4. TERMINAL LOGIC (IMPROVED) ---
    const termInput = document.getElementById('term-input');
    const termBody = document.getElementById('term-body');

    if (termInput) {
        // Force focus when clicking anywhere on terminal
        document.querySelector('.terminal-window').addEventListener('click', () => {
            termInput.focus();
        });

        termInput.addEventListener('keydown', function(e) {
            if (e.key === 'Enter') {
                const command = this.value.trim().toLowerCase();
                
                // 1. Append user command
                const line = document.createElement('div');
                line.className = 'term-line';
                line.innerHTML = `<span style="color:var(--accent-secondary); font-weight:bold;">➜ ~</span> ${this.value}`;
                termBody.appendChild(line);

                // 2. Process command
                let outputHTML = '';
                switch(command) {
                    case 'help': 
                        outputHTML = `Available commands:<br>- <span style="color:var(--accent-primary)">version</span><br>- <span style="color:var(--accent-primary)">neofetch</span><br>- <span style="color:var(--accent-primary)">date</span><br>- <span style="color:var(--accent-primary)">whoami</span><br>- <span style="color:var(--accent-primary)">clear</span>`; 
                        break;
                    case 'version': 
                        outputHTML = 'NovaOS v1.4-beta (Build 2025.01.09)'; 
                        break;
                    case 'neofetch': 
                        outputHTML = `
                        <div style="display:flex; gap:15px; margin-top:5px;">
                            <div style="color:var(--accent-primary);">
                               &nbsp;/\\ <br>
                               /  \\ <br>
                               \\  / <br>
                               &nbsp;\\/
                            </div>
                            <div>
                                <strong>OS</strong>: NovaOS x86_64<br>
                                <strong>Kernel</strong>: 5.14-nova-rust<br>
                                <strong>Shell</strong>: zsh 5.8<br>
                                <strong>Uptime</strong>: 4 days, 2 hours
                            </div>
                        </div>`; 
                        break;
                    case 'date':
                        outputHTML = new Date().toString();
                        break;
                    case 'whoami':
                        outputHTML = 'root';
                        break;
                    case 'clear': 
                        termBody.innerHTML = ''; 
                        this.value = ''; 
                        return;
                    case '':
                        break;
                    default: 
                        outputHTML = `Command not found: ${command}. Type 'help' for info.`;
                }

                // 3. Append Output
                if (outputHTML) {
                    const outputDiv = document.createElement('div');
                    outputDiv.className = 'term-line';
                    outputDiv.style.color = '#a1a1aa';
                    outputDiv.innerHTML = outputHTML;
                    termBody.appendChild(outputDiv);
                }

                // 4. Scroll to bottom
                termBody.scrollTop = termBody.scrollHeight;
                this.value = '';
            }
        });
    }

    // --- 5. SCROLL REVEAL & NAV ---
    const revealElements = document.querySelectorAll('.reveal');
    const revealObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) entry.target.classList.add('active');
        });
    }, { threshold: 0.1 });
    revealElements.forEach(el => revealObserver.observe(el));

    const nav = document.getElementById('navbar');
    window.addEventListener('scroll', () => {
        if(nav) {
            if (window.scrollY > 50) nav.classList.add('scrolled');
            else nav.classList.remove('scrolled');
        }
    });

    // --- 6. FAQ TOGGLE ---
    document.querySelectorAll('.faq-item').forEach(item => {
        item.querySelector('.faq-question').addEventListener('click', () => {
            item.classList.toggle('active');
        });
    });
});

/* --- ADD THIS TO THE VERY BOTTOM OF SCRIPT.JS --- */

function runFakeScan() {
    // 1. Get Elements
    const initial = document.getElementById('comp-initial');
    const loading = document.getElementById('comp-loading');
    const success = document.getElementById('comp-success');
    const statusText = document.getElementById('scan-status');

    // 2. Hide Button, Show Loader
    initial.style.display = 'none';
    loading.style.display = 'flex'; // Flex to center the spinner
    loading.style.flexDirection = 'column';
    loading.style.alignItems = 'center';

    // 3. Fake Progress Steps
    setTimeout(() => {
        statusText.innerText = "ANALYZING CPU INSTRUCTION SET...";
    }, 1000);

    setTimeout(() => {
        statusText.innerText = "VERIFYING MEMORY INTEGRITY...";
    }, 2000);

    // 4. Show Success
    setTimeout(() => {
        loading.style.display = 'none';
        success.style.display = 'block';
        
        // Optional: Add a subtle glow effect to the box upon success
        const container = document.querySelector('.compatibility-container');
        if(container) {
            container.style.border = '1px solid rgba(34, 197, 94, 0.3)';
            container.style.boxShadow = '0 0 15px rgba(34, 197, 94, 0.1)';
        }
    }, 3200);
}

/* --- DESKTOP VISUALIZER LOGIC --- */
function setScreen(mode) {
    // 1. Remove 'active' from all buttons
    document.querySelectorAll('.ui-btn').forEach(btn => btn.classList.remove('active'));
    
    // 2. Add 'active' to clicked button (logic based on click event or finding the matching text)
    // Simple way: Find the button that calls this function with this mode
    // (Or just rely on the user clicking to see the visual change)
    event.target.classList.add('active');

    // 3. Hide all screens
    document.querySelectorAll('.screen-content').forEach(screen => {
        screen.classList.remove('active');
    });

    // 4. Show the selected screen
    const targetScreen = document.getElementById(`screen-${mode}`);
    if (targetScreen) {
        targetScreen.classList.add('active');
    }
}

/* --- CALCULATOR LOGIC (UPDATED) --- */
let selectedOS = 'win11';

function selectOS(os) {
    selectedOS = os;
    // Update visual buttons
    document.querySelectorAll('.os-btn').forEach(btn => btn.classList.remove('active'));
    event.target.classList.add('active');
}

function updateSliderLabel(val) {
    document.getElementById('ram-display').innerText = val + " GB";
}

function calculateSavings() {
    // 1. Get User Input
    const userRAM = parseInt(document.getElementById('ram-slider').value);
    
    // 2. Define OS Bloat Metrics
    // Base: Fixed GB used by OS
    // Factor: Percentage of TOTAL RAM the OS wastes on caching/bloat (e.g. 0.15 = 15%)
    const metrics = {
        'win11': { base: 3.5, factor: 0.12, storage: 45, eff: 18 },
        'win10': { base: 2.5, factor: 0.10, storage: 30, eff: 14 },
        'mac':   { base: 2.0, factor: 0.08, storage: 20, eff: 10 }
    };
    
    // NovaOS Metrics (Lean & Mean)
    const novaBase = 0.4; // Only 400MB
    const novaStorage = 8; // 8GB Install size

    // 3. Perform The Math
    const osData = metrics[selectedOS];
    
    // Calculate how much RAM the current OS is using (Base + % of Total)
    const currentRamUsage = osData.base + (userRAM * osData.factor);
    
    // Calculate Savings
    const savedRAM = (currentRamUsage - novaBase).toFixed(1); 
    const savedStorage = osData.storage - novaStorage;
    
    // Calculate Efficiency % (Simple formula based on RAM ratio)
    // If you save more RAM, efficiency score goes up
    const perfBoost = Math.floor(osData.eff + (userRAM * 0.2)); 

    // 4. Update UI
    const resultsPanel = document.getElementById('results-panel');
    const ramEl = document.getElementById('res-ram');
    const storageEl = document.getElementById('res-storage');
    const perfEl = document.getElementById('res-perf');

    // Un-blur the results
    resultsPanel.classList.add('calculated');

    // Update Text
    ramEl.innerText = savedRAM + " GB";
    storageEl.innerText = savedStorage + " GB";
    perfEl.innerText = "+" + perfBoost + "%";

    // Re-trigger Animation (Pop-in effect)
    [ramEl, storageEl, perfEl].forEach(el => {
        el.classList.remove('pop-in');
        void el.offsetWidth; // Trigger reflow
        el.classList.add('pop-in');
    });
}

/* --- EASTER EGG: KONAMI CODE (KZYUBE VARIANT) --- */
const secretCode = [
    'ArrowUp', 
    'ArrowUp', 
    'ArrowDown', 
    'ArrowDown', 
    'k', 
    'z', 
    'y', 
    'u', 
    'b', 
    'e'
];
let inputIndex = 0;

document.addEventListener('keydown', (e) => {
    // Check if the key pressed matches the current step in the sequence
    if (e.key === secretCode[inputIndex] || e.key.toLowerCase() === secretCode[inputIndex]) {
        // Correct key pressed, move to next step
        inputIndex++;
        
        // Check if the full sequence is complete
        if (inputIndex === secretCode.length) {
            activateHackerMode();
            inputIndex = 0; // Reset
        }
    } else {
        // Wrong key pressed, reset progress
        inputIndex = 0;
    }
});

function activateHackerMode() {
    // 1. Show the Overlay
    const overlay = document.getElementById('hacker-overlay');
    overlay.style.display = 'flex';

    // 2. Play a sound (Optional - this is a simple system beep sound effect via code)
    // You can remove this block if you don't want sound
    const audioCtx = new (window.AudioContext || window.webkitAudioContext)();
    const oscillator = audioCtx.createOscillator();
    oscillator.type = 'square';
    oscillator.frequency.setValueAtTime(440, audioCtx.currentTime); // Hz
    oscillator.frequency.exponentialRampToValueAtTime(880, audioCtx.currentTime + 0.1);
    oscillator.connect(audioCtx.destination);
    oscillator.start();
    oscillator.stop(audioCtx.currentTime + 0.3);

    // 3. Wait 2 seconds, then remove overlay and apply theme
    setTimeout(() => {
        overlay.style.display = 'none';
        document.body.classList.toggle('matrix-mode');
        
        // Change text in the hero section to match
        const heroTitle = document.querySelector('.hero-title');
        if(document.body.classList.contains('matrix-mode')) {
            if(heroTitle) heroTitle.innerHTML = "SYSTEM<br> <span class='gradient-text'>COMPROMISED.</span>";
        } else {
            if(heroTitle) heroTitle.innerHTML = "The Operating System<br> <span class='gradient-text'>That Thinks.</span>";
        }
    }, 2000);
}

/* --- SYSTEM UPLINK LOGIC --- */
const uplinkBtn = document.getElementById('uplink-btn');

// 1. Monitor Scroll Position
window.addEventListener('scroll', () => {
    // Show button if scrolled down more than 500px
    if (window.scrollY > 500) {
        uplinkBtn.classList.add('visible');
    } else {
        uplinkBtn.classList.remove('visible');
    }
});

// 2. The Uplink Action
function engageUplink() {
    window.scrollTo({
        top: 0,
        behavior: 'smooth'
    });
}

/* --- NAVBAR MONITOR LOGIC --- */
setInterval(() => {
    const cpuEl = document.getElementById('nav-cpu');
    const ramEl = document.getElementById('nav-ram');

    if(cpuEl && ramEl) {
        // Generate random low numbers
        // CPU: 0% to 3%
        const cpu = Math.floor(Math.random() * 4); 
        
        // RAM: 10MB to 16MB (Very lightweight)
        const ram = 10 + Math.floor(Math.random() * 7); 

        cpuEl.innerText = cpu + "%";
        ramEl.innerText = ram + "MB";
    }
}, 2000);

/* --- CODE COMPARISON SLIDER LOGIC (FIXED) --- */
function moveSlider(val) {
    const cppLayer = document.getElementById('cpp-layer');
    const handle = document.getElementById('compare-handle');

    // 1. Move the Width and Handle
    cppLayer.style.width = val + "%";
    handle.style.left = val + "%";

    // 2. THE FIX: Hide the red border if width is near 0
    if (val < 1) {
        cppLayer.style.borderRight = 'none';
    } else {
        cppLayer.style.borderRight = '1px solid #ef4444';
    }
}

/* --- 3D GLOBE LOGIC (THREE.JS) --- */
// We load Three.js dynamically to keep your site fast
import('https://unpkg.com/three@0.160.0/build/three.module.js').then((THREE) => {
    
    const container = document.getElementById('globe-container');
    if (!container) return;

    // 1. Scene Setup
    const scene = new THREE.Scene();
    // Add some fog for depth
    scene.fog = new THREE.FogExp2(0x000000, 0.03);

    const camera = new THREE.PerspectiveCamera(45, container.clientWidth / container.clientHeight, 1, 1000);
    camera.position.z = 18;
    camera.position.y = 2;

    const renderer = new THREE.WebGLRenderer({ alpha: true, antialias: true });
    renderer.setSize(container.clientWidth, container.clientHeight);
    renderer.setPixelRatio(window.devicePixelRatio);
    container.appendChild(renderer.domElement);

    // 2. The Globe Sphere (Wireframe looking)
    const geometry = new THREE.SphereGeometry(5, 64, 64);
    
    // Create a cool "tech" material
    const material = new THREE.MeshPhongMaterial({
        color: 0x111111,
        emissive: 0x000000,
        specular: 0x111111,
        shininess: 10,
        transparent: true,
        opacity: 0.9,
        wireframe: false 
    });
    
    const globe = new THREE.Mesh(geometry, material);
    scene.add(globe);

    // Add a Wireframe Mesh on top for the "Grid" look
    const wireGeo = new THREE.EdgesGeometry(new THREE.SphereGeometry(5.05, 24, 24)); // Slightly larger
    const wireMat = new THREE.LineBasicMaterial({ color: 0x333333, transparent: true, opacity: 0.3 });
    const wireframe = new THREE.LineSegments(wireGeo, wireMat);
    globe.add(wireframe);

    // 3. Lighting
    const ambientLight = new THREE.AmbientLight(0xffffff, 0.5); // Soft white light
    scene.add(ambientLight);

    const pointLight = new THREE.PointLight(0x6366f1, 2, 50); // Purple/Blue glow from side
    pointLight.position.set(10, 10, 10);
    scene.add(pointLight);

    const pointLight2 = new THREE.PointLight(0x22c55e, 2, 50); // Green glow from other side
    pointLight2.position.set(-10, -5, 5);
    scene.add(pointLight2);


    // 4. Add "User Dots" (Pillars on the surface)
    // Helper function to convert Lat/Lon to 3D Position
    function createDot(lat, lon, color = 0x22c55e) {
        const phi = (90 - lat) * (Math.PI / 180);
        const theta = (lon + 180) * (Math.PI / 180);
        const radius = 5;

        const x = -(radius * Math.sin(phi) * Math.cos(theta));
        const z = (radius * Math.sin(phi) * Math.sin(theta));
        const y = (radius * Math.cos(phi));

        // Create a small glowing sphere
        const dotGeo = new THREE.SphereGeometry(0.1, 16, 16);
        const dotMat = new THREE.MeshBasicMaterial({ color: color });
        const dot = new THREE.Mesh(dotGeo, dotMat);
        
        dot.position.set(x, y, z);
        globe.add(dot);

        // Create a "Beam" sticking out
        const beamGeo = new THREE.CylinderGeometry(0.02, 0.02, 0.5, 8);
        beamGeo.translate(0, 0.25, 0); // Move pivot to bottom
        beamGeo.rotateX(Math.PI / 2); // Point outward
        const beamMat = new THREE.MeshBasicMaterial({ color: color, transparent: true, opacity: 0.6 });
        const beam = new THREE.Mesh(beamGeo, beamMat);
        beam.position.set(x, y, z);
        beam.lookAt(0, 0, 0); // Point to center (which means bottom points to center)
        globe.add(beam);
    }

    // --- ADDING USERS (Lat, Lon) ---
    createDot(37.77, -122.41); // San Francisco
    createDot(40.71, -74.00);  // New York
    createDot(51.50, -0.12);   // London
    createDot(35.67, 139.65);  // Tokyo
    createDot(52.52, 13.40);   // Berlin
    createDot(-33.86, 151.20); // Sydney
    createDot(-23.55, -46.63); // Sao Paulo
    createDot(28.61, 77.20);   // New Delhi
    createDot(1.35, 103.81);   // Singapore
    createDot(55.75, 37.61);   // Moscow
    
    // Add some random nodes
    for(let i=0; i<20; i++) {
        const lat = (Math.random() - 0.5) * 160;
        const lon = (Math.random() - 0.5) * 360;
        createDot(lat, lon, 0x444444); // Dimmer dots for "inactive" nodes
    }

    // 5. Interaction (Rotation)
    let isDragging = false;
    let previousMousePosition = { x: 0, y: 0 };

    container.addEventListener('mousedown', (e) => { isDragging = true; });
    document.addEventListener('mouseup', () => { isDragging = false; });
    document.addEventListener('mousemove', (e) => {
        if (isDragging) {
            const deltaMove = {
                x: e.offsetX - previousMousePosition.x,
                y: e.offsetY - previousMousePosition.y
            };

            const rotateSpeed = 0.005;
            globe.rotation.y += deltaMove.x * rotateSpeed;
            globe.rotation.x += deltaMove.y * rotateSpeed;
        }
        previousMousePosition = { x: e.offsetX, y: e.offsetY };
    });

    // 6. Animation Loop
    function animate() {
        requestAnimationFrame(animate);
        
        // Auto Rotate slightly
        if (!isDragging) {
            globe.rotation.y += 0.002;
        }

        renderer.render(scene, camera);
    }
    animate();

    // Handle Window Resize
    window.addEventListener('resize', () => {
        camera.aspect = container.clientWidth / container.clientHeight;
        camera.updateProjectionMatrix();
        renderer.setSize(container.clientWidth, container.clientHeight);
    });

}).catch(err => console.error("Failed to load 3D Globe:", err));

/* --- PRIVACY TOGGLE LOGIC --- */
function denySpying(element) {
    // 1. Shake the row to say "NO"
    element.classList.remove('shake-element');
    void element.offsetWidth; // Trigger reflow to restart animation
    element.classList.add('shake-element');

    // 2. Show the warning message
    const warning = document.getElementById('priv-warning');
    warning.innerText = "⚠️ ACCESS DENIED: Surveillance capabilities are physically stripped from the kernel.";
    warning.classList.add('visible');

    // 3. Optional: Flash Red
    element.style.background = "rgba(255, 0, 0, 0.1)";
    setTimeout(() => {
        element.style.background = "transparent";
    }, 400);
}

/* --- MOBILE MENU TOGGLE --- */
const mobileBtn = document.querySelector('.mobile-menu-icon');
const navLinks = document.querySelector('.nav-links');

if(mobileBtn) {
    mobileBtn.addEventListener('click', () => {
        navLinks.classList.toggle('active');
        
        // Toggle icon between ☰ and ✕
        if(navLinks.classList.contains('active')) {
            mobileBtn.innerText = '✕';
        } else {
            mobileBtn.innerText = '☰';
        }
    });
}

// Close menu when a link is clicked
document.querySelectorAll('.nav-links a').forEach(link => {
    link.addEventListener('click', () => {
        navLinks.classList.remove('active');
        mobileBtn.innerText = '☰';
    });
});

/* --- CRASH TEST LOGIC --- */
function triggerCrash() {
    const legacyScreen = document.getElementById('legacy-screen');
    const bsod = document.getElementById('bsod');
    const novaToast = document.getElementById('nova-toast');
    
    // 1. Reset State (in case clicked twice)
    bsod.style.display = 'none';
    novaToast.classList.remove('visible');
    legacyScreen.classList.remove('glitch-active');
    
    // 2. Start Glitch Effect (The Crash)
    legacyScreen.classList.add('glitch-active');
    
    // 3. LEGACY OS: Fails after 1 second
    setTimeout(() => {
        legacyScreen.classList.remove('glitch-active');
        bsod.style.display = 'block'; // Show Blue Screen
    }, 1000);

    // 4. NOVA OS: Survives instantly
    setTimeout(() => {
        // Show success message
        novaToast.classList.add('visible');
        
        // Hide it after 5 seconds
        setTimeout(() => {
            novaToast.classList.remove('visible');
        }, 5000);
    }, 1200);
}

/* --- MULTI-TEST CRASH LOGIC --- */
function runTest(type) {
    const legacyScreen = document.getElementById('legacy-screen');
    const consoleLog = document.getElementById('crash-console');
    const toast = document.getElementById('nova-toast');
    const rtTitle = document.getElementById('rt-title');
    const rtDesc = document.getElementById('rt-desc');

    // 1. Reset Legacy Screen
    document.getElementById('fail-bsod').style.display = 'none';
    document.getElementById('fail-frozen').style.display = 'none';
    document.getElementById('fail-hang').classList.remove('active');
    legacyScreen.classList.remove('glitch-active');
    
    // 2. Hide Nova Toast
    toast.classList.remove('visible');

    // 3. LOGIC SWITCH
    let logMsg = "";
    let novaMsg = "";
    let novaTitle = "";

    if (type === 'gpu') {
        logMsg = "> INJECTING: GPU_DRIVER_SEGFAULT...";
        novaTitle = "Graphics Driver Restored";
        novaMsg = "Display process restarted (4ms)";
        
        // Legacy Effect: Glitch then BSOD
        legacyScreen.classList.add('glitch-active');
        setTimeout(() => {
            legacyScreen.classList.remove('glitch-active');
            document.getElementById('fail-bsod').style.display = 'block';
        }, 800);
    } 
    else if (type === 'audio') {
        logMsg = "> INJECTING: AUDIO_BUFFER_OVERFLOW...";
        novaTitle = "Audio Service Restored";
        novaMsg = "Sound server restarted (2ms)";

        // Legacy Effect: Freeze (Opacity)
        setTimeout(() => {
            document.getElementById('fail-frozen').style.display = 'block';
        }, 500);
    } 
    else if (type === 'net') {
        logMsg = "> INJECTING: NETWORK_PACKET_FLOOD...";
        novaTitle = "Network Stack Isolated";
        novaMsg = "Malicious packet dropped. Connection safe.";

        // Legacy Effect: Application Hang
        setTimeout(() => {
            document.getElementById('fail-hang').classList.add('active');
        }, 500);
    }

    // 4. Print Log
    consoleLog.innerText = logMsg;

    // 5. Nova Recovery (Always succeeds)
    setTimeout(() => {
        rtTitle.innerText = novaTitle;
        rtDesc.innerText = novaMsg;
        toast.classList.add('visible');
        consoleLog.innerText = "> SYSTEM STATUS: NOVA_KERNEL_STABLE";
        
        // Hide Toast after 4s
        setTimeout(() => {
            toast.classList.remove('visible');
        }, 4000);
    }, 1200);
}

/* --- MULTI-TEST CRASH LOGIC (UPDATED) --- */
function runTest(type) {
    const legacyScreen = document.getElementById('legacy-screen');
    const consoleLog = document.getElementById('crash-console');
    const toast = document.getElementById('nova-toast');
    const rtTitle = document.getElementById('rt-title');
    const rtDesc = document.getElementById('rt-desc');
    
    // Reset All States
    document.getElementById('fail-bsod').style.display = 'none';
    document.getElementById('fail-frozen').style.display = 'none';
    document.getElementById('fail-hang').classList.remove('active');
    document.getElementById('fail-hacked').classList.remove('active');
    document.getElementById('nova-big-shield').classList.remove('active');
    legacyScreen.classList.remove('glitch-active');
    toast.classList.remove('visible');

    let logMsg = "";
    let novaTitle = "";
    let novaMsg = "";

    // --- LOGIC SWITCH ---
    if (type === 'virus') {
        logMsg = "> EXEC: RANSOMWARE.EXE (SUDO)...";
        novaTitle = "Malware Sandboxed";
        novaMsg = "Virus isolated in temp container. System safe.";

        // Windows: HACKED
        setTimeout(() => {
            document.getElementById('fail-hacked').classList.add('active');
        }, 500);

        // Nova: BIG SHIELD
        setTimeout(() => {
            const shield = document.getElementById('nova-big-shield');
            shield.classList.add('active');
            
            // Remove shield after 1.5s
            setTimeout(() => {
                shield.classList.remove('active');
            }, 1500);
        }, 600);
    } 
    else if (type === 'gpu') {
        logMsg = "> INJECTING: GPU_DRIVER_SEGFAULT...";
        novaTitle = "Graphics Driver Restored";
        novaMsg = "Display process restarted (4ms)";
        legacyScreen.classList.add('glitch-active');
        setTimeout(() => {
            legacyScreen.classList.remove('glitch-active');
            document.getElementById('fail-bsod').style.display = 'block';
        }, 800);
    } 
    else if (type === 'audio') {
        logMsg = "> INJECTING: AUDIO_BUFFER_OVERFLOW...";
        novaTitle = "Audio Service Restored";
        novaMsg = "Sound server restarted (2ms)";
        setTimeout(() => { document.getElementById('fail-frozen').style.display = 'block'; }, 500);
    } 
    else if (type === 'net') {
        logMsg = "> INJECTING: NETWORK_PACKET_FLOOD...";
        novaTitle = "Network Stack Isolated";
        novaMsg = "Malicious packet dropped. Connection safe.";
        setTimeout(() => { document.getElementById('fail-hang').classList.add('active'); }, 500);
    }

    // Print Log
    consoleLog.innerText = logMsg;

    // Nova Toast Notification (Delay slightly)
    setTimeout(() => {
        // Don't show toast immediately if Shield is showing (for virus test)
        let delay = (type === 'virus') ? 1600 : 0;
        
        setTimeout(() => {
            rtTitle.innerText = novaTitle;
            rtDesc.innerText = novaMsg;
            toast.classList.add('visible');
            consoleLog.innerText = "> SYSTEM STATUS: NOVA_KERNEL_STABLE";
            
            setTimeout(() => { toast.classList.remove('visible'); }, 4000);
        }, delay);

    }, 1200);
}

/* --- HARDWARE HANDSHAKE LOGIC --- */
function startHardwareScan() {
    const idleScreen = document.getElementById('scan-idle');
    const procScreen = document.getElementById('scan-processing');
    const resultScreen = document.getElementById('scan-result');
    const box = document.getElementById('scanner-box');

    // 1. Reset
    idleScreen.style.display = 'none';
    resultScreen.style.display = 'none';
    procScreen.style.display = 'flex';
    box.style.borderColor = "#22c55e"; // Turn border green

    // 2. Detect User Info
    const userAgent = navigator.userAgent;
    let os = "Unknown OS";
    let browser = "Unknown Browser";

    // Simple OS Detection
    if (userAgent.indexOf("Win") != -1) os = "Windows";
    if (userAgent.indexOf("Mac") != -1) os = "macOS";
    if (userAgent.indexOf("Linux") != -1) os = "Linux";
    if (userAgent.indexOf("Android") != -1) os = "Android";
    if (userAgent.indexOf("like Mac") != -1) os = "iOS";

    // Simple Browser Detection
    if (userAgent.indexOf("Chrome") != -1) browser = "Chrome (Google)";
    else if (userAgent.indexOf("Safari") != -1) browser = "Safari";
    else if (userAgent.indexOf("Firefox") != -1) browser = "Firefox";

    // 3. Fake Processing Delay (2 seconds)
    setTimeout(() => {
        procScreen.style.display = 'none';
        resultScreen.style.display = 'block';

        // 4. Update Text
        document.getElementById('user-os').innerText = "Detected: " + os;
        document.getElementById('user-browser').innerText = "Running on " + browser;
        
        // 5. Calculate Fake Boost based on OS
        // Windows/Mac get high boosts (implying they are slow). Linux gets lower (implying it's already fast).
        let boost = "35%";
        if(os === "Windows") boost = "42%";
        if(os === "macOS") boost = "38%";
        if(os === "Linux") boost = "12%"; // Linux is already efficient
        
        document.querySelector('.boost-val').innerText = "+" + boost;

    }, 2000);
}