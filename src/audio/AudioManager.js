import * as BABYLON from '@babylonjs/core';

/**
 * Manages all game audio including sound effects and music
 */
export class AudioManager {
    constructor(scene) {
        this.scene = scene;
        this.sounds = new Map();
        this.musicVolume = 0.7;
        this.sfxVolume = 0.8;
        this.initialized = false;
    }

    /**
     * Initialize and preload all sound effects
     */
    async initialize() {
        console.log('Initializing AudioManager...');

        // Create phone ring sound using Web Audio API
        // This creates a synthetic phone ring sound since we don't have an audio file yet
        this.createPhoneRingSound();

        this.initialized = true;
        console.log('AudioManager initialized successfully');
    }

    /**
     * Creates a synthetic phone ring sound using oscillators
     * This provides a classic telephone ring sound without needing an audio file
     */
    createPhoneRingSound() {
        // We'll use Babylon.js Sound with a data URL containing synthesized audio
        // For now, we'll create a placeholder that uses the Web Audio API directly

        const audioContext = BABYLON.Engine.audioEngine.audioContext;

        this.phoneRingPlayer = {
            isPlaying: false,
            oscillator: null,
            gainNode: null,

            play: () => {
                if (this.phoneRingPlayer.isPlaying) return;

                this.phoneRingPlayer.isPlaying = true;
                this.playRingTone();
            },

            stop: () => {
                this.phoneRingPlayer.isPlaying = false;
                if (this.phoneRingPlayer.oscillator) {
                    this.phoneRingPlayer.oscillator.stop();
                    this.phoneRingPlayer.oscillator = null;
                }
            }
        };
    }

    /**
     * Plays a realistic telephone ring sound
     * Uses dual-tone multi-frequency (similar to old telephone ringers)
     */
    playRingTone() {
        const audioContext = BABYLON.Engine.audioEngine.audioContext;

        const playBurst = () => {
            if (!this.phoneRingPlayer.isPlaying) return;

            // Create two oscillators for a more realistic ring
            const osc1 = audioContext.createOscillator();
            const osc2 = audioContext.createOscillator();
            const gainNode = audioContext.createGain();

            // Classic phone ring frequencies (approximately 440Hz and 480Hz)
            osc1.frequency.value = 440;
            osc2.frequency.value = 480;
            osc1.type = 'sine';
            osc2.type = 'sine';

            // Connect oscillators to gain node
            osc1.connect(gainNode);
            osc2.connect(gainNode);
            gainNode.connect(audioContext.destination);

            // Volume envelope for ring burst
            gainNode.gain.setValueAtTime(0, audioContext.currentTime);
            gainNode.gain.linearRampToValueAtTime(this.sfxVolume * 0.3, audioContext.currentTime + 0.05);
            gainNode.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + 0.4);

            // Start oscillators
            osc1.start(audioContext.currentTime);
            osc2.start(audioContext.currentTime);

            // Stop after burst duration
            osc1.stop(audioContext.currentTime + 0.4);
            osc2.stop(audioContext.currentTime + 0.4);

            // Schedule next burst (2 bursts per ring cycle)
            setTimeout(() => {
                if (!this.phoneRingPlayer.isPlaying) return;

                const osc3 = audioContext.createOscillator();
                const osc4 = audioContext.createOscillator();
                const gainNode2 = audioContext.createGain();

                osc3.frequency.value = 440;
                osc4.frequency.value = 480;
                osc3.type = 'sine';
                osc4.type = 'sine';

                osc3.connect(gainNode2);
                osc4.connect(gainNode2);
                gainNode2.connect(audioContext.destination);

                gainNode2.gain.setValueAtTime(0, audioContext.currentTime);
                gainNode2.gain.linearRampToValueAtTime(this.sfxVolume * 0.3, audioContext.currentTime + 0.05);
                gainNode2.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + 0.4);

                osc3.start(audioContext.currentTime);
                osc4.start(audioContext.currentTime);
                osc3.stop(audioContext.currentTime + 0.4);
                osc4.stop(audioContext.currentTime + 0.4);
            }, 500);

            // Schedule next ring cycle
            setTimeout(() => {
                if (this.phoneRingPlayer.isPlaying) {
                    playBurst();
                }
            }, 2000); // 2 second intervals between rings
        };

        playBurst();
    }

    /**
     * Play the phone ring sound
     */
    playPhoneRing() {
        if (!this.initialized) {
            console.warn('AudioManager not initialized');
            return;
        }

        console.log('Playing phone ring sound...');
        this.phoneRingPlayer.play();
    }

    /**
     * Stop the phone ring sound
     */
    stopPhoneRing() {
        console.log('Stopping phone ring sound...');
        this.phoneRingPlayer.stop();
    }

    /**
     * Play a sound effect
     * @param {string} soundName - Name of the sound to play
     */
    playSound(soundName) {
        const sound = this.sounds.get(soundName);
        if (sound && sound.isReady()) {
            sound.play();
        } else {
            console.warn(`Sound ${soundName} not found or not ready`);
        }
    }

    /**
     * Stop a sound effect
     * @param {string} soundName - Name of the sound to stop
     */
    stopSound(soundName) {
        const sound = this.sounds.get(soundName);
        if (sound) {
            sound.stop();
        }
    }

    /**
     * Set master volume for sound effects
     * @param {number} volume - Volume level (0-1)
     */
    setSFXVolume(volume) {
        this.sfxVolume = Math.max(0, Math.min(1, volume));
        this.sounds.forEach(sound => {
            if (sound.metadata?.type === 'sfx') {
                sound.setVolume(this.sfxVolume);
            }
        });
    }

    /**
     * Clean up all audio resources
     */
    dispose() {
        this.stopPhoneRing();
        this.sounds.forEach(sound => sound.dispose());
        this.sounds.clear();
    }
}
