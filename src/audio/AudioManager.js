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
        this.audioContext = null;
        this.ringPlaying = false;
    }

    /**
     * Initialize and preload all sound effects
     */
    async initialize() {
        console.log('Initializing AudioManager...');

        try {
            // Audio context will be created on first user interaction (browser requirement)
            this.initialized = true;
            console.log('AudioManager initialized successfully');
        } catch (error) {
            console.warn('Audio initialization warning:', error);
            this.initialized = true; // Continue anyway
        }
    }

    /**
     * Ensure audio context is available
     */
    ensureAudioContext() {
        if (!this.audioContext && BABYLON.Engine.audioEngine && BABYLON.Engine.audioEngine.audioContext) {
            this.audioContext = BABYLON.Engine.audioEngine.audioContext;
        }
    }

    /**
     * Play the smartphone ring sound
     */
    playPhoneRing() {
        if (!this.initialized) {
            console.warn('AudioManager not initialized');
            return;
        }

        try {
            this.ensureAudioContext();
            if (!this.audioContext) {
                console.warn('Audio context not available');
                return;
            }

            console.log('Playing smartphone ringtone...');
            this.ringPlaying = true;
            this.playModernRingtone();
        } catch (error) {
            console.warn('Could not play audio:', error);
        }
    }

    /**
     * Plays a modern smartphone ringtone with a melodic pattern
     * Uses a pleasant ascending melody pattern
     */
    playModernRingtone() {
        if (!this.audioContext || !this.ringPlaying) return;

        // Modern ringtone melody (simplified "marimba" style)
        // Notes: E5, C#5, D5, A4 (880, 554, 587, 440 Hz)
        const melody = [
            { freq: 659, duration: 0.15 },  // E5
            { freq: 523, duration: 0.15 },  // C5
            { freq: 587, duration: 0.15 },  // D5
            { freq: 440, duration: 0.2 },   // A4
            { freq: 494, duration: 0.15 },  // B4
            { freq: 523, duration: 0.15 },  // C5
            { freq: 587, duration: 0.15 },  // D5
            { freq: 659, duration: 0.3 }    // E5 (longer)
        ];

        const playMelody = () => {
            if (!this.ringPlaying) return;

            let time = this.audioContext.currentTime;

            // Play each note in the melody
            melody.forEach((note, index) => {
                if (!this.ringPlaying) return;

                try {
                    // Create oscillators for richer sound
                    const osc1 = this.audioContext.createOscillator();
                    const osc2 = this.audioContext.createOscillator();
                    const gainNode = this.audioContext.createGain();

                    // Main tone
                    osc1.frequency.value = note.freq;
                    osc1.type = 'sine';

                    // Harmonic (adds richness)
                    osc2.frequency.value = note.freq * 2;
                    osc2.type = 'sine';

                    // Connect oscillators
                    osc1.connect(gainNode);
                    osc2.connect(gainNode);
                    gainNode.connect(this.audioContext.destination);

                    // Volume envelope (fade in/out for smooth sound)
                    const startTime = time;
                    const endTime = time + note.duration;

                    gainNode.gain.setValueAtTime(0, startTime);
                    gainNode.gain.linearRampToValueAtTime(this.sfxVolume * 0.25, startTime + 0.02);
                    gainNode.gain.linearRampToValueAtTime(this.sfxVolume * 0.2, endTime - 0.05);
                    gainNode.gain.exponentialRampToValueAtTime(0.001, endTime);

                    // Set harmonic level lower
                    const harmonicGain = this.audioContext.createGain();
                    harmonicGain.gain.value = 0.3;
                    osc2.disconnect();
                    osc2.connect(harmonicGain);
                    harmonicGain.connect(gainNode);

                    // Start and stop oscillators
                    osc1.start(startTime);
                    osc2.start(startTime);
                    osc1.stop(endTime);
                    osc2.stop(endTime);

                    time += note.duration;

                } catch (error) {
                    console.warn('Error playing note:', error);
                }
            });

            // Add vibration buzz sound between melodies
            setTimeout(() => {
                if (!this.ringPlaying) return;
                this.playVibrationSound();
            }, (time - this.audioContext.currentTime) * 1000);

            // Schedule next melody cycle (2.5 seconds between rings)
            setTimeout(() => {
                if (this.ringPlaying) {
                    playMelody();
                }
            }, 2500);
        };

        playMelody();
    }

    /**
     * Play a subtle vibration buzz sound
     */
    playVibrationSound() {
        if (!this.audioContext || !this.ringPlaying) return;

        try {
            const osc = this.audioContext.createOscillator();
            const gainNode = this.audioContext.createGain();

            // Low frequency buzz (like vibration motor)
            osc.frequency.value = 80;
            osc.type = 'sawtooth';

            osc.connect(gainNode);
            gainNode.connect(this.audioContext.destination);

            const now = this.audioContext.currentTime;

            // Quick pulses
            gainNode.gain.setValueAtTime(0, now);
            gainNode.gain.linearRampToValueAtTime(this.sfxVolume * 0.1, now + 0.02);
            gainNode.gain.linearRampToValueAtTime(0, now + 0.08);
            gainNode.gain.linearRampToValueAtTime(this.sfxVolume * 0.1, now + 0.12);
            gainNode.gain.linearRampToValueAtTime(0, now + 0.18);

            osc.start(now);
            osc.stop(now + 0.2);

        } catch (error) {
            console.warn('Vibration sound error:', error);
        }
    }

    /**
     * Stop the phone ring sound
     */
    stopPhoneRing() {
        console.log('Stopping smartphone ringtone...');
        this.ringPlaying = false;
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
