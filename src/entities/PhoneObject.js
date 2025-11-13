import * as BABYLON from '@babylonjs/core';

/**
 * Represents a 3D smartphone object that can ring, vibrate, and be interacted with
 */
export class PhoneObject {
    constructor(scene, audioManager, position = new BABYLON.Vector3(0, 0.85, 0)) {
        this.scene = scene;
        this.audioManager = audioManager;
        this.position = position;
        this.mesh = null;
        this.isRinging = false;
        this.isPickedUp = false;
        this.shakeAnimation = null;
        this.originalPosition = position.clone();
        this.onPickUpCallback = null;
        this.screenLight = null;

        this.initialize();
    }

    /**
     * Create the 3D smartphone model procedurally
     */
    initialize() {
        console.log('Creating smartphone object...');

        // Create smartphone body (thin rectangular slab)
        const phoneBody = BABYLON.MeshBuilder.CreateBox('phoneBody', {
            width: 0.08,
            height: 0.012,
            depth: 0.16
        }, this.scene);

        // Create rounded corners using smaller boxes
        const cornerRadius = 0.008;
        const corners = [];
        const cornerPositions = [
            { x: 0.036, z: 0.076 }, { x: -0.036, z: 0.076 },
            { x: 0.036, z: -0.076 }, { x: -0.036, z: -0.076 }
        ];

        cornerPositions.forEach((pos, i) => {
            const corner = BABYLON.MeshBuilder.CreateSphere(`corner${i}`, {
                diameter: cornerRadius * 2,
                segments: 8
            }, this.scene);
            corner.position.x = pos.x;
            corner.position.z = pos.z;
            corner.position.y = 0;
            corner.scaling.y = 0.3;
            corners.push(corner);
        });

        // Create screen (slightly inset, glass-like)
        const screen = BABYLON.MeshBuilder.CreateBox('screen', {
            width: 0.072,
            height: 0.002,
            depth: 0.15
        }, this.scene);
        screen.position.y = 0.007;

        // Create screen bezel (thin border)
        const bezel = BABYLON.MeshBuilder.CreateBox('bezel', {
            width: 0.076,
            height: 0.001,
            depth: 0.154
        }, this.scene);
        bezel.position.y = 0.0065;

        // Create camera (small circle at top)
        const camera = BABYLON.MeshBuilder.CreateCylinder('camera', {
            height: 0.002,
            diameter: 0.006,
            tessellation: 16
        }, this.scene);
        camera.rotation.x = Math.PI / 2;
        camera.position.y = 0.008;
        camera.position.z = 0.07;

        // Create camera lens (smaller, shiny)
        const lens = BABYLON.MeshBuilder.CreateCylinder('lens', {
            height: 0.003,
            diameter: 0.004,
            tessellation: 16
        }, this.scene);
        lens.rotation.x = Math.PI / 2;
        lens.position.y = 0.0085;
        lens.position.z = 0.07;

        // Create speaker grille (small slits at top)
        const speaker = BABYLON.MeshBuilder.CreateBox('speaker', {
            width: 0.02,
            height: 0.001,
            depth: 0.002
        }, this.scene);
        speaker.position.y = 0.008;
        speaker.position.z = 0.065;

        // Create home button / touch sensor (bottom center)
        const homeButton = BABYLON.MeshBuilder.CreateCylinder('homeButton', {
            height: 0.001,
            diameter: 0.01,
            tessellation: 32
        }, this.scene);
        homeButton.rotation.x = Math.PI / 2;
        homeButton.position.y = 0.007;
        homeButton.position.z = -0.065;

        // Create volume buttons (side)
        const volumeUp = BABYLON.MeshBuilder.CreateBox('volumeUp', {
            width: 0.002,
            height: 0.003,
            depth: 0.015
        }, this.scene);
        volumeUp.position.x = 0.041;
        volumeUp.position.z = 0.03;

        const volumeDown = BABYLON.MeshBuilder.CreateBox('volumeDown', {
            width: 0.002,
            height: 0.003,
            depth: 0.015
        }, this.scene);
        volumeDown.position.x = 0.041;
        volumeDown.position.z = 0.01;

        // Create power button (opposite side)
        const powerButton = BABYLON.MeshBuilder.CreateBox('powerButton', {
            width: 0.002,
            height: 0.003,
            depth: 0.012
        }, this.scene);
        powerButton.position.x = -0.041;
        powerButton.position.z = 0.02;

        // Create parent mesh to group all phone parts
        this.mesh = BABYLON.Mesh.CreateBox('smartphone', 0.01, this.scene);
        this.mesh.isVisible = false;

        // Parent all parts to main mesh
        phoneBody.parent = this.mesh;
        screen.parent = this.mesh;
        bezel.parent = this.mesh;
        camera.parent = this.mesh;
        lens.parent = this.mesh;
        speaker.parent = this.mesh;
        homeButton.parent = this.mesh;
        volumeUp.parent = this.mesh;
        volumeDown.parent = this.mesh;
        powerButton.parent = this.mesh;
        corners.forEach(corner => corner.parent = this.mesh);

        // Create materials
        // Phone body material (metal/aluminum)
        const bodyMaterial = new BABYLON.StandardMaterial('bodyMaterial', this.scene);
        bodyMaterial.diffuseColor = new BABYLON.Color3(0.15, 0.15, 0.18);
        bodyMaterial.specularColor = new BABYLON.Color3(0.6, 0.6, 0.65);
        bodyMaterial.specularPower = 128;

        // Screen material (glass-like, dark when off)
        const screenMaterial = new BABYLON.StandardMaterial('screenMaterial', this.scene);
        screenMaterial.diffuseColor = new BABYLON.Color3(0.05, 0.05, 0.08);
        screenMaterial.specularColor = new BABYLON.Color3(0.8, 0.8, 0.9);
        screenMaterial.specularPower = 256;
        screenMaterial.emissiveColor = new BABYLON.Color3(0, 0, 0);

        // Bezel material (black plastic/glass)
        const bezelMaterial = new BABYLON.StandardMaterial('bezelMaterial', this.scene);
        bezelMaterial.diffuseColor = new BABYLON.Color3(0.02, 0.02, 0.02);
        bezelMaterial.specularColor = new BABYLON.Color3(0.3, 0.3, 0.3);

        // Camera material (dark)
        const cameraMaterial = new BABYLON.StandardMaterial('cameraMaterial', this.scene);
        cameraMaterial.diffuseColor = new BABYLON.Color3(0.05, 0.05, 0.05);
        cameraMaterial.specularColor = new BABYLON.Color3(0.2, 0.2, 0.2);

        // Lens material (shiny)
        const lensMaterial = new BABYLON.StandardMaterial('lensMaterial', this.scene);
        lensMaterial.diffuseColor = new BABYLON.Color3(0.1, 0.15, 0.2);
        lensMaterial.specularColor = new BABYLON.Color3(0.9, 0.95, 1);
        lensMaterial.specularPower = 512;

        // Button materials
        const buttonMaterial = new BABYLON.StandardMaterial('buttonMaterial', this.scene);
        buttonMaterial.diffuseColor = new BABYLON.Color3(0.12, 0.12, 0.14);
        buttonMaterial.specularColor = new BABYLON.Color3(0.4, 0.4, 0.45);

        // Apply materials
        phoneBody.material = bodyMaterial;
        screen.material = screenMaterial;
        bezel.material = bezelMaterial;
        camera.material = cameraMaterial;
        lens.material = lensMaterial;
        speaker.material = bezelMaterial;
        homeButton.material = buttonMaterial;
        volumeUp.material = buttonMaterial;
        volumeDown.material = buttonMaterial;
        powerButton.material = buttonMaterial;
        corners.forEach(corner => corner.material = bodyMaterial);

        // Store screen reference for lighting effects
        this.screenMesh = screen;
        this.screenMaterial = screenMaterial;

        // Position the phone
        this.mesh.position = this.position;

        // Make phone interactive
        this.setupInteraction();

        console.log('Smartphone object created successfully');
    }

    /**
     * Set up click/touch interaction for the phone
     */
    setupInteraction() {
        // Make all child meshes pickable
        this.mesh.getChildMeshes().forEach(mesh => {
            mesh.isPickable = true;
        });

        // Create action manager for the phone
        this.mesh.actionManager = new BABYLON.ActionManager(this.scene);

        // Add pointer down action
        this.mesh.actionManager.registerAction(
            new BABYLON.ExecuteCodeAction(
                BABYLON.ActionManager.OnPickTrigger,
                () => this.handlePickup()
            )
        );

        // Add child meshes to action manager
        this.mesh.getChildMeshes().forEach(childMesh => {
            childMesh.actionManager = new BABYLON.ActionManager(this.scene);
            childMesh.actionManager.registerAction(
                new BABYLON.ExecuteCodeAction(
                    BABYLON.ActionManager.OnPickTrigger,
                    () => this.handlePickup()
                )
            );
        });

        // Add highlight on hover
        this.mesh.getChildMeshes().forEach(childMesh => {
            childMesh.actionManager.registerAction(
                new BABYLON.ExecuteCodeAction(
                    BABYLON.ActionManager.OnPointerOverTrigger,
                    () => {
                        if (this.isRinging) {
                            this.scene.getEngine().getRenderingCanvas().style.cursor = 'pointer';
                        }
                    }
                )
            );

            childMesh.actionManager.registerAction(
                new BABYLON.ExecuteCodeAction(
                    BABYLON.ActionManager.OnPointerOutTrigger,
                    () => {
                        this.scene.getEngine().getRenderingCanvas().style.cursor = 'default';
                    }
                )
            );
        });
    }

    /**
     * Handle phone pickup interaction
     */
    handlePickup() {
        if (this.isRinging) {
            console.log('Phone answered!');
            this.stopRinging();
            this.isPickedUp = true;

            if (this.onPickUpCallback) {
                this.onPickUpCallback();
            }
        }
    }

    /**
     * Start the phone ringing with vibration animation and screen light
     */
    startRinging() {
        if (this.isRinging) return;

        console.log('Smartphone is ringing...');
        this.isRinging = true;
        this.isPickedUp = false;

        // Start sound
        this.audioManager.playPhoneRing();

        // Start vibration animation
        this.startVibrateAnimation();

        // Light up the screen
        this.lightUpScreen();

        // Update UI
        this.updatePhoneStatus('Ringing...', true);
    }

    /**
     * Stop the phone from ringing
     */
    stopRinging() {
        if (!this.isRinging) return;

        console.log('Smartphone stopped ringing');
        this.isRinging = false;

        // Stop sound
        this.audioManager.stopPhoneRing();

        // Stop vibration animation
        this.stopVibrateAnimation();

        // Turn off screen
        this.turnOffScreen();

        // Update UI
        this.updatePhoneStatus('Answered', false);

        // Reset to original position
        this.mesh.position = this.originalPosition.clone();
        this.mesh.rotation = BABYLON.Vector3.Zero();
    }

    /**
     * Light up the smartphone screen when ringing
     */
    lightUpScreen() {
        if (this.screenMaterial) {
            // Animate screen brightness
            let brightness = 0;
            const maxBrightness = 0.4;

            this.screenLightInterval = setInterval(() => {
                if (!this.isRinging) return;

                // Pulse effect
                brightness = maxBrightness * (0.5 + 0.5 * Math.sin(Date.now() * 0.003));
                this.screenMaterial.emissiveColor = new BABYLON.Color3(
                    brightness * 0.3,
                    brightness * 0.5,
                    brightness * 1.0
                );
            }, 16); // ~60fps
        }
    }

    /**
     * Turn off the smartphone screen
     */
    turnOffScreen() {
        if (this.screenLightInterval) {
            clearInterval(this.screenLightInterval);
            this.screenLightInterval = null;
        }

        if (this.screenMaterial) {
            this.screenMaterial.emissiveColor = new BABYLON.Color3(0, 0, 0);
        }
    }

    /**
     * Create vibration animation for smartphone (faster, smaller movements)
     */
    startVibrateAnimation() {
        const vibrateStrength = 0.003;  // Smaller than phone shake
        const vibrateSpeed = 60;         // Faster vibration
        const rotationStrength = 0.02;

        let elapsed = 0;
        const startPosition = this.mesh.position.clone();
        const startRotation = this.mesh.rotation.clone();

        // Animation loop
        this.shakeAnimation = this.scene.onBeforeRenderObservable.add(() => {
            if (!this.isRinging) return;

            elapsed += this.scene.getEngine().getDeltaTime() / 1000;

            // Rapid horizontal vibration (like phone on table)
            const vibrateX = Math.sin(elapsed * vibrateSpeed) * vibrateStrength;
            const vibrateZ = Math.cos(elapsed * vibrateSpeed * 1.5) * vibrateStrength;

            // Very subtle vertical bounce
            const bounceY = Math.abs(Math.sin(elapsed * vibrateSpeed * 0.3)) * vibrateStrength * 0.3;

            // Slight rotation wobble
            const rotationZ = Math.sin(elapsed * vibrateSpeed * 0.7) * rotationStrength;

            // Apply transformations
            this.mesh.position.x = startPosition.x + vibrateX;
            this.mesh.position.y = startPosition.y + bounceY;
            this.mesh.position.z = startPosition.z + vibrateZ;

            this.mesh.rotation.z = startRotation.z + rotationZ;
        });
    }

    /**
     * Stop vibration animation
     */
    stopVibrateAnimation() {
        if (this.shakeAnimation) {
            this.scene.onBeforeRenderObservable.remove(this.shakeAnimation);
            this.shakeAnimation = null;
        }
    }

    /**
     * Update phone status in UI
     */
    updatePhoneStatus(status, isRinging) {
        const statusElement = document.getElementById('status-text');
        const statusContainer = document.getElementById('phone-status');

        if (statusElement) {
            statusElement.textContent = status;
        }

        if (statusContainer) {
            if (isRinging) {
                statusContainer.classList.add('status-ringing');
            } else {
                statusContainer.classList.remove('status-ringing');
            }
        }
    }

    /**
     * Set callback for when phone is picked up
     */
    setOnPickUpCallback(callback) {
        this.onPickUpCallback = callback;
    }

    /**
     * Clean up resources
     */
    dispose() {
        this.stopRinging();
        if (this.mesh) {
            this.mesh.dispose();
        }
    }
}
