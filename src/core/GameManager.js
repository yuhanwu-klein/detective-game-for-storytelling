import * as BABYLON from '@babylonjs/core';
import { AudioManager } from '../audio/AudioManager.js';
import { PhoneObject } from '../entities/PhoneObject.js';
import { TableObject } from '../entities/TableObject.js';

/**
 * Main game manager that controls the scene and game logic
 */
export class GameManager {
    constructor(canvas) {
        this.canvas = canvas;
        this.engine = null;
        this.scene = null;
        this.camera = null;
        this.audioManager = null;
        this.phoneObject = null;
        this.tableObject = null;
    }

    /**
     * Initialize the game engine and scene
     */
    async initialize() {
        console.log('Initializing game...');

        // Hide loading screen
        this.updateLoadingStatus('Creating 3D engine...');

        // Create Babylon.js engine
        this.engine = new BABYLON.Engine(this.canvas, true, {
            preserveDrawingBuffer: true,
            stencil: true
        });

        // Create scene
        this.scene = new BABYLON.Scene(this.engine);
        this.scene.clearColor = new BABYLON.Color4(0.85, 0.88, 0.92, 1);

        // Enable physics (optional, for future use)
        // this.scene.enablePhysics();

        this.updateLoadingStatus('Setting up camera...');

        // Create camera
        this.camera = new BABYLON.ArcRotateCamera(
            'camera',
            Math.PI / 2,        // Alpha (horizontal rotation)
            Math.PI / 3,        // Beta (vertical rotation)
            2.5,                // Radius (distance from target)
            new BABYLON.Vector3(0, 0.8, 0),  // Target position
            this.scene
        );

        // Camera controls
        this.camera.attachControl(this.canvas, true);
        this.camera.lowerRadiusLimit = 1.5;
        this.camera.upperRadiusLimit = 4;
        this.camera.lowerBetaLimit = 0.1;
        this.camera.upperBetaLimit = Math.PI / 2;

        this.updateLoadingStatus('Creating lights...');

        // Create lights
        this.setupLighting();

        this.updateLoadingStatus('Initializing audio system...');

        // Initialize audio manager
        this.audioManager = new AudioManager(this.scene);
        await this.audioManager.initialize();

        this.updateLoadingStatus('Creating table...');

        // Create table
        this.tableObject = new TableObject(this.scene, new BABYLON.Vector3(0, 0, 0));

        this.updateLoadingStatus('Creating phone...');

        // Create phone on table
        const tableTop = this.tableObject.getTopSurfaceY();
        this.phoneObject = new PhoneObject(
            this.scene,
            this.audioManager,
            new BABYLON.Vector3(0, tableTop, 0)
        );

        // Set up phone callback
        this.phoneObject.setOnPickUpCallback(() => {
            this.onPhonePickedUp();
        });

        this.updateLoadingStatus('Setting up environment...');

        // Add ground
        this.createGround();

        // Add background/walls
        this.createEnvironment();

        this.updateLoadingStatus('Starting game...');

        // Hide loading screen
        setTimeout(() => {
            const loadingElement = document.getElementById('loading');
            if (loadingElement) {
                loadingElement.style.display = 'none';
            }
        }, 500);

        // Start render loop
        this.engine.runRenderLoop(() => {
            this.scene.render();
        });

        // Handle window resize
        window.addEventListener('resize', () => {
            this.engine.resize();
        });

        console.log('Game initialized successfully!');

        // Auto-start phone ringing after a delay
        setTimeout(() => {
            this.phoneObject.startRinging();
        }, 2000);
    }

    /**
     * Set up scene lighting
     */
    setupLighting() {
        // Ambient light (soft overall illumination)
        const ambientLight = new BABYLON.HemisphericLight(
            'ambientLight',
            new BABYLON.Vector3(0, 1, 0),
            this.scene
        );
        ambientLight.intensity = 0.9;
        ambientLight.diffuse = new BABYLON.Color3(1, 0.98, 0.95);
        ambientLight.specular = new BABYLON.Color3(0.5, 0.5, 0.5);

        // Main directional light (sun/key light)
        const mainLight = new BABYLON.DirectionalLight(
            'mainLight',
            new BABYLON.Vector3(-1, -2, -1),
            this.scene
        );
        mainLight.position = new BABYLON.Vector3(2, 3, 2);
        mainLight.intensity = 1.2;
        mainLight.diffuse = new BABYLON.Color3(1, 0.98, 0.92);

        // Rim light (backlight for depth)
        const rimLight = new BABYLON.PointLight(
            'rimLight',
            new BABYLON.Vector3(-1, 2, 1),
            this.scene
        );
        rimLight.intensity = 0.3;
        rimLight.diffuse = new BABYLON.Color3(0.8, 0.9, 1);

        // Desk lamp (spot light on table)
        const deskLamp = new BABYLON.SpotLight(
            'deskLamp',
            new BABYLON.Vector3(0.5, 2, -0.3),
            new BABYLON.Vector3(0, -1, 0.2),
            Math.PI / 3,
            2,
            this.scene
        );
        deskLamp.intensity = 0.5;
        deskLamp.diffuse = new BABYLON.Color3(1, 0.9, 0.7);
    }

    /**
     * Create ground plane
     */
    createGround() {
        const ground = BABYLON.MeshBuilder.CreateGround('ground', {
            width: 10,
            height: 10
        }, this.scene);

        const groundMaterial = new BABYLON.StandardMaterial('groundMaterial', this.scene);
        groundMaterial.diffuseColor = new BABYLON.Color3(0.75, 0.78, 0.82);
        groundMaterial.specularColor = new BABYLON.Color3(0.3, 0.3, 0.3);

        ground.material = groundMaterial;
        ground.receiveShadows = true;
    }

    /**
     * Create environment (walls, background)
     */
    createEnvironment() {
        // Back wall
        const backWall = BABYLON.MeshBuilder.CreatePlane('backWall', {
            width: 10,
            height: 5
        }, this.scene);
        backWall.position.z = 3;
        backWall.position.y = 2.5;

        const wallMaterial = new BABYLON.StandardMaterial('wallMaterial', this.scene);
        wallMaterial.diffuseColor = new BABYLON.Color3(0.88, 0.90, 0.92);
        wallMaterial.specularColor = new BABYLON.Color3(0.2, 0.2, 0.2);

        backWall.material = wallMaterial;

        // Add some atmosphere with fog
        this.scene.fogMode = BABYLON.Scene.FOGMODE_LINEAR;
        this.scene.fogColor = new BABYLON.Color3(0.85, 0.88, 0.92);
        this.scene.fogStart = 5.0;
        this.scene.fogEnd = 10.0;
    }

    /**
     * Update loading status text
     */
    updateLoadingStatus(status) {
        const loadingElement = document.getElementById('loading');
        if (loadingElement) {
            loadingElement.innerHTML = `<p>${status}</p>`;
        }
    }

    /**
     * Handle phone pickup event
     */
    onPhonePickedUp() {
        console.log('Phone answered - triggering story event');

        // Update UI
        setTimeout(() => {
            this.phoneObject.updatePhoneStatus('Call ended', false);
        }, 3000);

        // Here you could trigger dialogue, change scenes, etc.
        // For example:
        // this.showDialogue("Detective: Hello?");
        // this.startStorySequence();
    }

    /**
     * Clean up and dispose resources
     */
    dispose() {
        if (this.phoneObject) this.phoneObject.dispose();
        if (this.tableObject) this.tableObject.dispose();
        if (this.audioManager) this.audioManager.dispose();
        if (this.scene) this.scene.dispose();
        if (this.engine) this.engine.dispose();
    }
}
