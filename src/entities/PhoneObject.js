import * as BABYLON from '@babylonjs/core';

/**
 * Represents a 3D telephone object that can ring, shake, and be interacted with
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

        this.initialize();
    }

    /**
     * Create the 3D phone model procedurally
     */
    initialize() {
        console.log('Creating phone object...');

        // Create phone body (main rectangular base)
        const phoneBody = BABYLON.MeshBuilder.CreateBox('phoneBody', {
            width: 0.15,
            height: 0.05,
            depth: 0.25
        }, this.scene);

        // Create phone handset (receiver)
        const handset = BABYLON.MeshBuilder.CreateCylinder('handset', {
            height: 0.2,
            diameter: 0.04,
            tessellation: 16
        }, this.scene);
        handset.rotation.x = Math.PI / 2;
        handset.rotation.z = Math.PI / 6;
        handset.position.y = 0.04;
        handset.position.x = -0.02;

        // Create earpiece and mouthpiece (spheres at ends of handset)
        const earpiece = BABYLON.MeshBuilder.CreateSphere('earpiece', {
            diameter: 0.05,
            segments: 16
        }, this.scene);
        earpiece.position.y = 0.04;
        earpiece.position.x = 0.06;
        earpiece.position.z = 0.08;

        const mouthpiece = BABYLON.MeshBuilder.CreateSphere('mouthpiece', {
            diameter: 0.05,
            segments: 16
        }, this.scene);
        mouthpiece.position.y = 0.04;
        mouthpiece.position.x = -0.1;
        mouthpiece.position.z = -0.08;

        // Create dial pad buttons (3x4 grid)
        const buttons = [];
        const buttonPositions = [
            [-0.04, 0.04], [0, 0.04], [0.04, 0.04],        // 1, 2, 3
            [-0.04, 0], [0, 0], [0.04, 0],                  // 4, 5, 6
            [-0.04, -0.04], [0, -0.04], [0.04, -0.04],     // 7, 8, 9
            [-0.04, -0.08], [0, -0.08], [0.04, -0.08]      // *, 0, #
        ];

        buttonPositions.forEach((pos, i) => {
            const button = BABYLON.MeshBuilder.CreateCylinder(`button${i}`, {
                height: 0.01,
                diameter: 0.02,
                tessellation: 16
            }, this.scene);
            button.position.x = pos[0];
            button.position.y = 0.031;
            button.position.z = pos[1];
            buttons.push(button);
        });

        // Create phone cord (decorative spiral)
        const cordPath = [];
        for (let i = 0; i < 20; i++) {
            const angle = i * Math.PI / 4;
            cordPath.push(new BABYLON.Vector3(
                -0.075 + Math.cos(angle) * 0.01,
                0.025 - i * 0.003,
                -0.12 + i * 0.005
            ));
        }
        const cord = BABYLON.MeshBuilder.CreateTube('cord', {
            path: cordPath,
            radius: 0.002,
            tessellation: 8,
            cap: BABYLON.Mesh.CAP_ALL
        }, this.scene);

        // Create parent mesh to group all phone parts
        this.mesh = BABYLON.Mesh.CreateBox('phone', 0.01, this.scene);
        this.mesh.isVisible = false;

        // Parent all parts to main mesh
        phoneBody.parent = this.mesh;
        handset.parent = this.mesh;
        earpiece.parent = this.mesh;
        mouthpiece.parent = this.mesh;
        cord.parent = this.mesh;
        buttons.forEach(button => button.parent = this.mesh);

        // Create materials
        const phoneMaterial = new BABYLON.StandardMaterial('phoneMaterial', this.scene);
        phoneMaterial.diffuseColor = new BABYLON.Color3(0.2, 0.2, 0.2);
        phoneMaterial.specularColor = new BABYLON.Color3(0.3, 0.3, 0.3);
        phoneMaterial.specularPower = 64;

        const handsetMaterial = new BABYLON.StandardMaterial('handsetMaterial', this.scene);
        handsetMaterial.diffuseColor = new BABYLON.Color3(0.15, 0.15, 0.15);

        const buttonMaterial = new BABYLON.StandardMaterial('buttonMaterial', this.scene);
        buttonMaterial.diffuseColor = new BABYLON.Color3(0.8, 0.8, 0.8);
        buttonMaterial.emissiveColor = new BABYLON.Color3(0.1, 0.1, 0.1);

        const cordMaterial = new BABYLON.StandardMaterial('cordMaterial', this.scene);
        cordMaterial.diffuseColor = new BABYLON.Color3(0.1, 0.1, 0.1);

        // Apply materials
        phoneBody.material = phoneMaterial;
        handset.material = handsetMaterial;
        earpiece.material = handsetMaterial;
        mouthpiece.material = handsetMaterial;
        cord.material = cordMaterial;
        buttons.forEach(button => button.material = buttonMaterial);

        // Position the phone
        this.mesh.position = this.position;

        // Make phone interactive
        this.setupInteraction();

        console.log('Phone object created successfully');
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
     * Start the phone ringing with shake animation
     */
    startRinging() {
        if (this.isRinging) return;

        console.log('Phone is ringing...');
        this.isRinging = true;
        this.isPickedUp = false;

        // Start sound
        this.audioManager.playPhoneRing();

        // Start shake animation
        this.startShakeAnimation();

        // Update UI
        this.updatePhoneStatus('Ringing...', true);
    }

    /**
     * Stop the phone from ringing
     */
    stopRinging() {
        if (!this.isRinging) return;

        console.log('Phone stopped ringing');
        this.isRinging = false;

        // Stop sound
        this.audioManager.stopPhoneRing();

        // Stop shake animation
        this.stopShakeAnimation();

        // Update UI
        this.updatePhoneStatus('Answered', false);

        // Reset to original position
        this.mesh.position = this.originalPosition.clone();
        this.mesh.rotation = BABYLON.Vector3.Zero();
    }

    /**
     * Create shake animation using sine waves
     */
    startShakeAnimation() {
        const shakeStrength = 0.008;  // How far the phone moves
        const shakeSpeed = 30;         // How fast it shakes
        const rotationStrength = 0.05; // Rotation intensity

        let elapsed = 0;
        const startPosition = this.mesh.position.clone();
        const startRotation = this.mesh.rotation.clone();

        // Animation loop
        this.shakeAnimation = this.scene.onBeforeRenderObservable.add(() => {
            if (!this.isRinging) return;

            elapsed += this.scene.getEngine().getDeltaTime() / 1000;

            // Horizontal shake (X-axis)
            const shakeX = Math.sin(elapsed * shakeSpeed) * shakeStrength;
            const shakeZ = Math.cos(elapsed * shakeSpeed * 1.3) * shakeStrength;

            // Vertical bounce (Y-axis) - subtle
            const bounceY = Math.abs(Math.sin(elapsed * shakeSpeed * 0.5)) * shakeStrength * 0.5;

            // Rotation shake
            const rotationY = Math.sin(elapsed * shakeSpeed * 0.8) * rotationStrength;
            const rotationZ = Math.cos(elapsed * shakeSpeed * 1.1) * rotationStrength * 0.5;

            // Apply transformations
            this.mesh.position.x = startPosition.x + shakeX;
            this.mesh.position.y = startPosition.y + bounceY;
            this.mesh.position.z = startPosition.z + shakeZ;

            this.mesh.rotation.y = startRotation.y + rotationY;
            this.mesh.rotation.z = startRotation.z + rotationZ;
        });
    }

    /**
     * Stop shake animation
     */
    stopShakeAnimation() {
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
