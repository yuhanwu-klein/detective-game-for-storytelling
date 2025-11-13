import * as BABYLON from '@babylonjs/core';

/**
 * Represents a 3D table/desk object
 */
export class TableObject {
    constructor(scene, position = new BABYLON.Vector3(0, 0, 0)) {
        this.scene = scene;
        this.position = position;
        this.mesh = null;

        this.initialize();
    }

    /**
     * Create the 3D table model procedurally
     */
    initialize() {
        console.log('Creating table object...');

        // Create table top
        const tableTop = BABYLON.MeshBuilder.CreateBox('tableTop', {
            width: 1.2,
            height: 0.05,
            depth: 0.8
        }, this.scene);
        tableTop.position.y = 0.75;

        // Create table legs (4 legs)
        const legPositions = [
            { x: -0.5, z: -0.35 },  // Front left
            { x: 0.5, z: -0.35 },   // Front right
            { x: -0.5, z: 0.35 },   // Back left
            { x: 0.5, z: 0.35 }     // Back right
        ];

        const legs = [];
        legPositions.forEach((pos, i) => {
            const leg = BABYLON.MeshBuilder.CreateCylinder(`tableLeg${i}`, {
                height: 0.75,
                diameter: 0.05,
                tessellation: 16
            }, this.scene);
            leg.position.x = pos.x;
            leg.position.y = 0.375;
            leg.position.z = pos.z;
            legs.push(leg);
        });

        // Create table rim/edge
        const rim = BABYLON.MeshBuilder.CreateBox('tableRim', {
            width: 1.25,
            height: 0.03,
            depth: 0.85
        }, this.scene);
        rim.position.y = 0.725;

        // Create parent mesh
        this.mesh = BABYLON.Mesh.CreateBox('table', 0.01, this.scene);
        this.mesh.isVisible = false;

        // Parent all parts
        tableTop.parent = this.mesh;
        rim.parent = this.mesh;
        legs.forEach(leg => leg.parent = this.mesh);

        // Create wood material for table
        const woodMaterial = new BABYLON.StandardMaterial('woodMaterial', this.scene);
        woodMaterial.diffuseColor = new BABYLON.Color3(0.4, 0.25, 0.15);
        woodMaterial.specularColor = new BABYLON.Color3(0.2, 0.15, 0.1);
        woodMaterial.specularPower = 16;

        // Create procedural wood texture
        const woodTexture = new BABYLON.DynamicTexture('woodTexture', 512, this.scene);
        const ctx = woodTexture.getContext();

        // Draw wood grain pattern
        ctx.fillStyle = '#5C4033';
        ctx.fillRect(0, 0, 512, 512);

        // Add wood grain lines
        for (let i = 0; i < 512; i += 2) {
            const brightness = 0.3 + Math.random() * 0.2;
            const color = Math.floor(brightness * 255);
            ctx.strokeStyle = `rgb(${color * 0.4}, ${color * 0.25}, ${color * 0.15})`;
            ctx.lineWidth = 1 + Math.random();
            ctx.beginPath();
            ctx.moveTo(0, i);
            ctx.lineTo(512, i + Math.sin(i * 0.1) * 3);
            ctx.stroke();
        }

        woodTexture.update();
        woodMaterial.diffuseTexture = woodTexture;

        // Leg material (darker wood)
        const legMaterial = new BABYLON.StandardMaterial('legMaterial', this.scene);
        legMaterial.diffuseColor = new BABYLON.Color3(0.3, 0.2, 0.12);
        legMaterial.specularColor = new BABYLON.Color3(0.15, 0.1, 0.05);

        // Apply materials
        tableTop.material = woodMaterial;
        rim.material = woodMaterial;
        legs.forEach(leg => leg.material = legMaterial);

        // Position the table
        this.mesh.position = this.position;

        console.log('Table object created successfully');
    }

    /**
     * Get the top surface Y position for placing objects
     */
    getTopSurfaceY() {
        return this.position.y + 0.775;
    }

    /**
     * Clean up resources
     */
    dispose() {
        if (this.mesh) {
            this.mesh.dispose();
        }
    }
}
