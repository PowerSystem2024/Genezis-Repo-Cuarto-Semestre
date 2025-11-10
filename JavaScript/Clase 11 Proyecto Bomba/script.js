// Variables de estado
let audioContext;
let alarmInterval;
let countdownValue = null;
let beepInterval;
let continuousBeep;

// Referencias a elementos
const glassLid = document.getElementById('glass-lid');
const emergencyButton = document.getElementById('emergency-button');
const buttonText = document.getElementById('button-text');
const alertContainer = document.getElementById('alert-container');
const redOverlay = document.getElementById('red-overlay');
const countdownDisplay = document.getElementById('countdown-display');
const explosionScreen = document.getElementById('explosion-screen');
const explosionFragmentsContainer = document.getElementById('explosion-fragments');

// Inicializar AudioContext
function initAudio() {
    if (!audioContext) {
        audioContext = new (window.AudioContext || window.webkitAudioContext)();
    }
}

// Generar sonido de alarma (oscilante)
function playAlarm() {
    initAudio();
    const oscillator = audioContext.createOscillator();
    const gainNode = audioContext.createGain();
    
    oscillator.connect(gainNode);
    gainNode.connect(audioContext.destination);
    
    oscillator.type = 'square';
    oscillator.frequency.value = 800;
    
    gainNode.gain.setValueAtTime(0.3, audioContext.currentTime);
    
    oscillator.start();
    
    setTimeout(() => {
        oscillator.frequency.value = 600;
    }, 250);
    
    setTimeout(() => {
        gainNode.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + 0.1);
        oscillator.stop(audioContext.currentTime + 0.1);
    }, 500);
}

// Generar pitido (beep) cada segundo
function playBeep() {
    initAudio();
    const oscillator = audioContext.createOscillator();
    const gainNode = audioContext.createGain();
    
    oscillator.connect(gainNode);
    gainNode.connect(audioContext.destination);
    
    oscillator.type = 'sine';
    oscillator.frequency.value = 1000;
    
    gainNode.gain.setValueAtTime(0.5, audioContext.currentTime);
    gainNode.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + 0.2);
    
    oscillator.start();
    oscillator.stop(audioContext.currentTime + 0.2);
}

// Generar sonido de explosión
function playExplosion() {
    console.log('🔊 Intentando reproducir explosión');
    initAudio();

    function generate() {
        try {
            const now = audioContext.currentTime;

            // Nodo principal de ganancia para la mezcla
            const masterGain = audioContext.createGain();
            masterGain.gain.setValueAtTime(1.0, now);
            masterGain.connect(audioContext.destination);

            // 1) Rumble: oscilador bajo con barrido de frecuencia
            const osc = audioContext.createOscillator();
            const oscGain = audioContext.createGain();
            osc.type = 'sine';
            osc.frequency.setValueAtTime(120, now);
            oscGain.gain.setValueAtTime(0.8, now);
            // Barrido hacia abajo para el impacto
            osc.frequency.exponentialRampToValueAtTime(40, now + 1.2);
            oscGain.gain.exponentialRampToValueAtTime(0.01, now + 1.5);
            osc.connect(oscGain);
            oscGain.connect(masterGain);

            // 2) Noise burst (explosión)
            const sampleLen = Math.floor(audioContext.sampleRate * 1.5);
            const noiseBuffer = audioContext.createBuffer(1, sampleLen, audioContext.sampleRate);
            const data = noiseBuffer.getChannelData(0);
            for (let i = 0; i < sampleLen; i++) {
                // ruido con envolvente exponencial para decay
                const env = Math.exp(-i / (audioContext.sampleRate * 0.4));
                data[i] = (Math.random() * 2 - 1) * env;
            }
            const noiseSource = audioContext.createBufferSource();
            noiseSource.buffer = noiseBuffer;
            const noiseFilter = audioContext.createBiquadFilter();
            noiseFilter.type = 'lowpass';
            noiseFilter.frequency.setValueAtTime(1200, now);
            // bajar frecuencia rápidamente para efecto "boom"
            noiseFilter.frequency.exponentialRampToValueAtTime(150, now + 0.9);
            const noiseGain = audioContext.createGain();
            noiseGain.gain.setValueAtTime(1.0, now);
            noiseGain.gain.exponentialRampToValueAtTime(0.001, now + 1.5);
            noiseSource.connect(noiseFilter);
            noiseFilter.connect(noiseGain);
            noiseGain.connect(masterGain);

            // Iniciar fuentes
            osc.start(now);
            noiseSource.start(now);

            // Parar después de 2 segundos
            osc.stop(now + 2);
            noiseSource.stop(now + 2);

            console.log('🔊 Explosión reproducida (state:', audioContext.state, ')');
        } catch (err) {
            console.error('Error en generación de explosión:', err);
        }
    }

    // Algunos navegadores inicializan el AudioContext en 'suspended' hasta un gesto del usuario
    if (audioContext.state === 'suspended') {
        console.log('audioContext está suspended — intentando resume()');
        audioContext.resume().then(() => {
            console.log('audioContext resumed, state=', audioContext.state);
            generate();
        }).catch((err) => {
            console.error('No se pudo resume audioContext:', err);
            // Intentar generar de todas formas
            generate();
        });
    } else {
        generate();
    }
}

// Generar pitido continuo después de explosión
function playContinuousBeep() {
    initAudio();
    const oscillator = audioContext.createOscillator();
    const gainNode = audioContext.createGain();
    
    oscillator.connect(gainNode);
    gainNode.connect(audioContext.destination);
    
    oscillator.type = 'sine';
    oscillator.frequency.value = 800;
    
    gainNode.gain.setValueAtTime(0.3, audioContext.currentTime);
    
    oscillator.start();
    
    continuousBeep = { oscillator, gainNode };
}

// Abrir tapa de vidrio
function openGlass() {
    console.log('🔍 Abriendo tapa de vidrio');
    glassLid.classList.add('opening');
    
    // Habilitar botón después de la animación
    setTimeout(() => {
        console.log('🔍 Habilitando botón');
        emergencyButton.disabled = false;
        emergencyButton.classList.add('enabled');
        console.log('Estado del botón:', {
            disabled: emergencyButton.disabled,
            classList: emergencyButton.className
        });
    }, 1000);
}

// Iniciar cuenta regresiva
function startCountdown() {
    countdownValue = 5;
    emergencyButton.classList.add('active');
    buttonText.textContent = '🚨';
    alertContainer.classList.remove('hidden');
    redOverlay.classList.remove('hidden');
    countdownDisplay.classList.remove('hidden');
    countdownDisplay.textContent = countdownValue;
    
    // Iniciar alarma que suena constantemente
    alarmInterval = setInterval(playAlarm, 600);
    
    // Pitido cada segundo con la cuenta regresiva
    beepInterval = setInterval(() => {
        playBeep();
        countdownValue--;
        
        if (countdownValue > 0) {
            countdownDisplay.textContent = countdownValue;
        } else {
            clearInterval(alarmInterval);
            clearInterval(beepInterval);
            setTimeout(explode, 500);
        }
    }, 1000);
}

// Explosión
function explode() {
    console.log('💥 Iniciando explosión');
    // Detener todos los sonidos
    if (continuousBeep) {
        continuousBeep.oscillator.stop();
    }
    
    // Sonido de explosión
    playExplosion();
    
    // Mostrar pantalla de explosión
    explosionScreen.classList.remove('hidden');
    
    // Crear fragmentos de explosión
    for (let i = 0; i < 50; i++) {
        const fragment = document.createElement('div');
        fragment.className = 'explosion-fragment';
        
        const x = Math.random() * 100;
        const y = Math.random() * 100;
        const ex = (Math.random() - 0.5) * 300;
        const ey = (Math.random() - 0.5) * 300;
        const rotation = Math.random() * 720;
        const duration = 1 + Math.random() * 1;
        const scale = 0.5 + Math.random() * 2;
        
        fragment.style.left = `${x}%`;
        fragment.style.top = `${y}%`;
        fragment.style.transform = `rotate(${Math.random() * 360}deg) scale(${scale})`;
        fragment.style.setProperty('--ex', `${ex}vw`);
        fragment.style.setProperty('--ey', `${ey}vh`);
        fragment.style.setProperty('--rotation', `${rotation}deg`);
        fragment.style.animationDuration = `${duration}s`;
        
        explosionFragmentsContainer.appendChild(fragment);
    }
    
    // Pitido continuo después de 1 segundo
    setTimeout(playContinuousBeep, 1000);
}

// Event Listeners
glassLid.addEventListener('click', function() {
    console.log('🔍 Click en la tapa de vidrio');
    openGlass();
});

emergencyButton.addEventListener('click', function() {
    console.log('🔍 Click en el botón de emergencia', {
        disabled: emergencyButton.disabled,
        countdownValue: countdownValue,
        target: this.id
    });
    if (!emergencyButton.disabled && countdownValue === null) {
        startCountdown();
    }
});