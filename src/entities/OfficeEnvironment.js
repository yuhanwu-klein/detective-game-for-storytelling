import * as BABYLON from '@babylonjs/core';

/**
 * Creates a detailed, compact detective office environment
 * with rich materials and enhanced details
 */
export class OfficeEnvironment {
    constructor(scene) {
        this.scene = scene;
        this.meshes = [];
        this.materials = {};

        this.initialize();
    }

    /**
     * Initialize the complete office environment
     */
    initialize() {
        console.log('Creating detailed detective office environment...');

        // Create all materials first
        this.createMaterials();

        // Build compact environment (smaller room: 5x6 instead of 8x8)
        this.createFloor();
        this.createWalls();
        this.createWindow();
        this.createDoor();
        this.createFilingCabinet();
        this.createBookshelf();
        this.createCoatRack();
        this.createInvestigationBoard(); // New! Detective case board
        this.createDeskLamp(); // New! Desk lamp detail
        this.createWallDecorations();
        this.createPlants(); // Add decorative plants
        this.createCeiling();

        console.log('Detailed detective office environment created successfully');
    }

    /**
     * Create material library with rich, varied textures
     */
    createMaterials() {
        // Wood material - warm, aged wood
        this.materials.wood = new BABYLON.StandardMaterial('woodMat', this.scene);
        this.materials.wood.diffuseColor = new BABYLON.Color3(0.42, 0.28, 0.15);
        this.materials.wood.specularColor = new BABYLON.Color3(0.25, 0.18, 0.1);
        this.materials.wood.specularPower = 32;

        // Dark wood for shelves - rich mahogany
        this.materials.darkWood = new BABYLON.StandardMaterial('darkWoodMat', this.scene);
        this.materials.darkWood.diffuseColor = new BABYLON.Color3(0.22, 0.13, 0.08);
        this.materials.darkWood.specularColor = new BABYLON.Color3(0.3, 0.2, 0.12);
        this.materials.darkWood.specularPower = 64;

        // Metal - brushed steel
        this.materials.metal = new BABYLON.StandardMaterial('metalMat', this.scene);
        this.materials.metal.diffuseColor = new BABYLON.Color3(0.38, 0.38, 0.4);
        this.materials.metal.specularColor = new BABYLON.Color3(0.75, 0.75, 0.75);
        this.materials.metal.specularPower = 128;

        // Brass - aged brass for handles
        this.materials.brass = new BABYLON.StandardMaterial('brassMat', this.scene);
        this.materials.brass.diffuseColor = new BABYLON.Color3(0.65, 0.5, 0.22);
        this.materials.brass.specularColor = new BABYLON.Color3(0.85, 0.7, 0.45);
        this.materials.brass.specularPower = 256;

        // Paper/document material
        this.materials.paper = new BABYLON.StandardMaterial('paperMat', this.scene);
        this.materials.paper.diffuseColor = new BABYLON.Color3(0.9, 0.87, 0.8);
        this.materials.paper.specularColor = new BABYLON.Color3(0.08, 0.08, 0.08);

        // Leather - worn brown leather
        this.materials.leather = new BABYLON.StandardMaterial('leatherMat', this.scene);
        this.materials.leather.diffuseColor = new BABYLON.Color3(0.28, 0.18, 0.12);
        this.materials.leather.specularColor = new BABYLON.Color3(0.12, 0.08, 0.05);
        this.materials.leather.specularPower = 16;

        // Glass - translucent
        this.materials.glass = new BABYLON.StandardMaterial('glassMat', this.scene);
        this.materials.glass.diffuseColor = new BABYLON.Color3(0.7, 0.78, 0.85);
        this.materials.glass.specularColor = new BABYLON.Color3(0.9, 0.9, 1);
        this.materials.glass.alpha = 0.35;

        // Cork board material
        this.materials.cork = new BABYLON.StandardMaterial('corkMat', this.scene);
        this.materials.cork.diffuseColor = new BABYLON.Color3(0.65, 0.5, 0.35);
        this.materials.cork.specularColor = new BABYLON.Color3(0.1, 0.08, 0.05);
        this.materials.cork.specularPower = 8;

        // Concrete/Plaster material with texture
        this.materials.concrete = new BABYLON.StandardMaterial('concreteMat', this.scene);
        const concreteTexture = new BABYLON.DynamicTexture('concreteTexture', 512, this.scene);
        const ctx = concreteTexture.getContext();

        // Base plaster color
        ctx.fillStyle = '#C8BFB0';
        ctx.fillRect(0, 0, 512, 512);

        // Add concrete texture noise
        for (let i = 0; i < 8000; i++) {
            const x = Math.random() * 512;
            const y = Math.random() * 512;
            const shade = 0.9 + Math.random() * 0.2;
            const size = 1 + Math.random() * 2;
            ctx.fillStyle = `rgba(${180 * shade}, ${170 * shade}, ${155 * shade}, 0.15)`;
            ctx.fillRect(x, y, size, size);
        }

        // Add subtle cracks
        for (let i = 0; i < 15; i++) {
            ctx.strokeStyle = 'rgba(0, 0, 0, 0.08)';
            ctx.lineWidth = 0.5 + Math.random();
            ctx.beginPath();
            const startX = Math.random() * 512;
            const startY = Math.random() * 512;
            ctx.moveTo(startX, startY);
            ctx.lineTo(startX + (Math.random() - 0.5) * 60, startY + (Math.random() - 0.5) * 60);
            ctx.stroke();
        }

        this.materials.concrete.diffuseTexture = concreteTexture;
        this.materials.concrete.specularColor = new BABYLON.Color3(0.05, 0.05, 0.05);
        this.materials.concrete.specularPower = 4;

        // Plant foliage material (for leaves)
        this.materials.foliage = new BABYLON.StandardMaterial('foliageMat', this.scene);
        this.materials.foliage.diffuseColor = new BABYLON.Color3(0.2, 0.45, 0.25);
        this.materials.foliage.specularColor = new BABYLON.Color3(0.15, 0.25, 0.18);
        this.materials.foliage.specularPower = 16;

        // Terracotta pot material
        this.materials.terracotta = new BABYLON.StandardMaterial('terracottaMat', this.scene);
        this.materials.terracotta.diffuseColor = new BABYLON.Color3(0.65, 0.35, 0.25);
        this.materials.terracotta.specularColor = new BABYLON.Color3(0.2, 0.15, 0.12);
        this.materials.terracotta.specularPower = 16;

        // Soil material
        this.materials.soil = new BABYLON.StandardMaterial('soilMat', this.scene);
        this.materials.soil.diffuseColor = new BABYLON.Color3(0.25, 0.18, 0.12);
        this.materials.soil.specularColor = new BABYLON.Color3(0.05, 0.04, 0.03);
        this.materials.soil.specularPower = 4;
    }

    /**
     * Create wooden floor with brown wood material
     */
    createFloor() {
        const floor = BABYLON.MeshBuilder.CreateGround('floor', {
            width: 5,
            height: 6
        }, this.scene);

        // Wood brown material
        const floorMaterial = new BABYLON.StandardMaterial('floorMaterial', this.scene);
        floorMaterial.diffuseColor = new BABYLON.Color3(0.45, 0.30, 0.18);  // Medium brown wood
        floorMaterial.specularColor = new BABYLON.Color3(0.2, 0.15, 0.1);
        floorMaterial.specularPower = 32;

        floor.material = floorMaterial;
        floor.receiveShadows = true;
        this.meshes.push(floor);
    }

    /**
     * Create walls for compact room with concrete/plaster texture
     */
    createWalls() {
        const wallHeight = 3.2;

        // Use concrete material for textured walls
        // Scale texture appropriately
        this.materials.concrete.diffuseTexture.uScale = 1.5;
        this.materials.concrete.diffuseTexture.vScale = 2;

        // Back wall
        const backWall = BABYLON.MeshBuilder.CreatePlane('backWall', {
            width: 5,
            height: wallHeight
        }, this.scene);
        backWall.position.z = 3;
        backWall.position.y = wallHeight / 2;
        backWall.material = this.materials.concrete;
        this.meshes.push(backWall);

        // Left wall
        const leftWall = BABYLON.MeshBuilder.CreatePlane('leftWall', {
            width: 6,
            height: wallHeight
        }, this.scene);
        leftWall.position.x = -2.5;
        leftWall.position.y = wallHeight / 2;
        leftWall.rotation.y = Math.PI / 2;
        leftWall.material = this.materials.concrete;
        this.meshes.push(leftWall);

        // Right wall
        const rightWall = BABYLON.MeshBuilder.CreatePlane('rightWall', {
            width: 6,
            height: wallHeight
        }, this.scene);
        rightWall.position.x = 2.5;
        rightWall.position.y = wallHeight / 2;
        rightWall.rotation.y = -Math.PI / 2;
        rightWall.material = this.materials.concrete;
        this.meshes.push(rightWall);

        // Baseboards with wood material
        this.createBaseboard(-2.5, 3, 0, 6, Math.PI / 2); // Left
        this.createBaseboard(2.5, 3, 0, 6, -Math.PI / 2); // Right
        this.createBaseboard(0, 3, 3, 5, 0); // Back
    }

    /**
     * Create detailed baseboard
     */
    createBaseboard(x, z, y, width, rotationY) {
        const baseboard = BABYLON.MeshBuilder.CreateBox('baseboard', {
            width: width,
            height: 0.12,
            depth: 0.04
        }, this.scene);
        baseboard.position.set(x, 0.06, z);
        baseboard.rotation.y = rotationY;
        baseboard.material = this.materials.wood;
        this.meshes.push(baseboard);
    }

    /**
     * Create window with detailed blinds
     */
    createWindow() {
        const windowX = -1.5;
        const windowY = 1.8;
        const windowZ = 2.95;

        // Window frame - wood
        const frame = BABYLON.MeshBuilder.CreateBox('windowFrame', {
            width: 1.4,
            height: 1.6,
            depth: 0.08
        }, this.scene);
        frame.position.set(windowX, windowY, windowZ);
        frame.material = this.materials.darkWood;
        this.meshes.push(frame);

        // Glass pane
        const glass = BABYLON.MeshBuilder.CreatePlane('windowGlass', {
            width: 1.3,
            height: 1.5
        }, this.scene);
        glass.position.set(windowX, windowY, windowZ + 0.05);
        glass.material = this.materials.glass;
        this.meshes.push(glass);

        // Venetian blinds - more detailed
        const blindsMaterial = new BABYLON.StandardMaterial('blindsMaterial', this.scene);
        blindsMaterial.diffuseColor = new BABYLON.Color3(0.82, 0.78, 0.7);
        blindsMaterial.specularColor = new BABYLON.Color3(0.35, 0.35, 0.35);

        const numSlats = 18;
        const slatSpacing = 1.5 / numSlats;

        for (let i = 0; i < numSlats; i++) {
            const slat = BABYLON.MeshBuilder.CreateBox(`blind${i}`, {
                width: 1.2,
                height: 0.035,
                depth: 0.008
            }, this.scene);

            const yPos = windowY - 0.75 + (i * slatSpacing);
            slat.position.set(windowX, yPos, windowZ + 0.08);
            slat.rotation.x = Math.PI / 14; // Slight angle
            slat.material = blindsMaterial;
            this.meshes.push(slat);
        }

        // Blind pull cord
        const cord = BABYLON.MeshBuilder.CreateCylinder('blindCord', {
            height: 1.8,
            diameter: 0.012
        }, this.scene);
        cord.position.set(windowX + 0.55, windowY - 0.1, windowZ + 0.1);
        cord.material = blindsMaterial;
        this.meshes.push(cord);
    }

    /**
     * Create detailed office door
     */
    createDoor() {
        const doorX = 2;
        const doorY = 1.1;
        const doorZ = 2.95;

        // Door frame
        const doorFrame = BABYLON.MeshBuilder.CreateBox('doorFrame', {
            width: 0.95,
            height: 2.2,
            depth: 0.12
        }, this.scene);
        doorFrame.position.set(doorX, doorY, doorZ);
        doorFrame.material = this.materials.darkWood;
        this.meshes.push(doorFrame);

        // Door panel
        const door = BABYLON.MeshBuilder.CreateBox('door', {
            width: 0.88,
            height: 2.1,
            depth: 0.06
        }, this.scene);
        door.position.set(doorX, doorY, doorZ + 0.04);
        door.material = this.materials.wood;
        this.meshes.push(door);

        // Door panels (decorative insets)
        for (let i = 0; i < 2; i++) {
            const panel = BABYLON.MeshBuilder.CreateBox('doorPanel', {
                width: 0.7,
                height: 0.85,
                depth: 0.02
            }, this.scene);
            panel.position.set(doorX, doorY + 0.45 - (i * 1.0), doorZ + 0.07);

            const panelMat = new BABYLON.StandardMaterial('doorPanelMat', this.scene);
            panelMat.diffuseColor = new BABYLON.Color3(0.35, 0.23, 0.12);
            panelMat.specularColor = new BABYLON.Color3(0.2, 0.15, 0.08);
            panel.material = panelMat;
            this.meshes.push(panel);
        }

        // Brass door handle assembly
        // Backplate
        const handlePlate = BABYLON.MeshBuilder.CreateBox('handlePlate', {
            width: 0.08,
            height: 0.18,
            depth: 0.008
        }, this.scene);
        handlePlate.position.set(doorX - 0.35, doorY, doorZ + 0.075);
        handlePlate.material = this.materials.brass;
        this.meshes.push(handlePlate);

        // Door knob
        const knob = BABYLON.MeshBuilder.CreateSphere('doorKnob', {
            diameter: 0.065,
            segments: 16
        }, this.scene);
        knob.position.set(doorX - 0.35, doorY, doorZ + 0.095);
        knob.material = this.materials.brass;
        this.meshes.push(knob);

        // Keyhole cover
        const keyhole = BABYLON.MeshBuilder.CreateCylinder('keyhole', {
            height: 0.01,
            diameter: 0.018,
            tessellation: 16
        }, this.scene);
        keyhole.rotation.x = Math.PI / 2;
        keyhole.position.set(doorX - 0.35, doorY - 0.06, doorZ + 0.08);
        keyhole.material = this.materials.brass;
        this.meshes.push(keyhole);

        // Frosted glass window in door
        const doorWindow = BABYLON.MeshBuilder.CreateBox('doorWindow', {
            width: 0.32,
            height: 0.5,
            depth: 0.015
        }, this.scene);
        doorWindow.position.set(doorX + 0.05, doorY + 0.75, doorZ + 0.075);
        doorWindow.material = this.materials.glass;
        this.meshes.push(doorWindow);
    }

    /**
     * Create detailed filing cabinet with proper materials
     */
    createFilingCabinet() {
        const cabinetX = 2.1;
        const cabinetZ = 1.5;

        // Cabinet body - metal
        const cabinet = BABYLON.MeshBuilder.CreateBox('cabinet', {
            width: 0.5,
            height: 1.0,
            depth: 0.45
        }, this.scene);
        cabinet.position.set(cabinetX, 0.5, cabinetZ);
        cabinet.material = this.materials.metal;
        this.meshes.push(cabinet);

        // Individual drawers with brass handles
        for (let i = 0; i < 3; i++) {
            // Drawer face
            const drawer = BABYLON.MeshBuilder.CreateBox('drawerFace', {
                width: 0.48,
                height: 0.3,
                depth: 0.02
            }, this.scene);
            drawer.position.set(cabinetX, 0.18 + (i * 0.31), cabinetZ + 0.235);
            drawer.material = this.materials.metal;
            this.meshes.push(drawer);

            // Handle
            const handle = BABYLON.MeshBuilder.CreateBox('drawerHandle', {
                width: 0.25,
                height: 0.03,
                depth: 0.03
            }, this.scene);
            handle.position.set(cabinetX, 0.18 + (i * 0.31), cabinetZ + 0.26);
            handle.material = this.materials.brass;
            this.meshes.push(handle);

            // Label holder
            const label = BABYLON.MeshBuilder.CreateBox('labelHolder', {
                width: 0.18,
                height: 0.08,
                depth: 0.01
            }, this.scene);
            label.position.set(cabinetX, 0.23 + (i * 0.31), cabinetZ + 0.245);

            const labelMat = new BABYLON.StandardMaterial('labelMat', this.scene);
            labelMat.diffuseColor = new BABYLON.Color3(0.85, 0.82, 0.75);
            label.material = labelMat;
            this.meshes.push(label);

            // Decorative drawer border lines (ribbed pattern)
            for (let side = 0; side < 2; side++) {
                const borderLine = BABYLON.MeshBuilder.CreateBox('drawerBorder', {
                    width: side === 0 ? 0.46 : 0.28,
                    height: side === 0 ? 0.006 : 0.006,
                    depth: 0.003
                }, this.scene);
                const xOffset = side === 0 ? 0 : 0;
                const yOffset = side === 0 ? 0.14 : -0.14;
                borderLine.position.set(
                    cabinetX + xOffset,
                    0.18 + (i * 0.31) + yOffset,
                    cabinetZ + 0.252
                );
                const borderMat = new BABYLON.StandardMaterial('borderMat', this.scene);
                borderMat.diffuseColor = new BABYLON.Color3(0.28, 0.28, 0.3);
                borderLine.material = borderMat;
                this.meshes.push(borderLine);
            }
        }

        // Cabinet top with some files/folders
        const files = BABYLON.MeshBuilder.CreateBox('topFiles', {
            width: 0.35,
            height: 0.08,
            depth: 0.3
        }, this.scene);
        files.position.set(cabinetX - 0.05, 1.04, cabinetZ);
        files.rotation.y = 0.1;
        files.material = this.materials.paper;
        this.meshes.push(files);
    }

    /**
     * Create detailed bookshelf with individual books
     */
    createBookshelf() {
        const shelfX = -2.1;
        const shelfZ = 1.5;

        // Bookshelf frame
        const frame = BABYLON.MeshBuilder.CreateBox('bookshelfFrame', {
            width: 0.8,
            height: 1.8,
            depth: 0.3
        }, this.scene);
        frame.position.set(shelfX, 0.9, shelfZ);
        frame.material = this.materials.darkWood;
        this.meshes.push(frame);

        // Horizontal shelves
        const shelfMat = new BABYLON.StandardMaterial('shelfMat', this.scene);
        shelfMat.diffuseColor = new BABYLON.Color3(0.3, 0.2, 0.12);
        shelfMat.specularColor = new BABYLON.Color3(0.2, 0.15, 0.1);

        for (let i = 0; i < 4; i++) {
            const shelf = BABYLON.MeshBuilder.CreateBox('shelf', {
                width: 0.75,
                height: 0.025,
                depth: 0.27
            }, this.scene);
            shelf.position.set(shelfX, 0.15 + (i * 0.45), shelfZ);
            shelf.material = shelfMat;
            this.meshes.push(shelf);
        }

        // Add detailed books
        const bookColors = [
            new BABYLON.Color3(0.55, 0.18, 0.15), // Burgundy
            new BABYLON.Color3(0.15, 0.25, 0.52), // Navy blue
            new BABYLON.Color3(0.25, 0.45, 0.2), // Forest green
            new BABYLON.Color3(0.48, 0.28, 0.12), // Brown leather
            new BABYLON.Color3(0.38, 0.18, 0.35), // Purple
            new BABYLON.Color3(0.18, 0.18, 0.2), // Black
        ];

        for (let shelf = 0; shelf < 3; shelf++) {
            for (let i = 0; i < 7; i++) {
                const bookHeight = 0.22 + Math.random() * 0.08;
                const bookWidth = 0.06 + Math.random() * 0.02;

                const book = BABYLON.MeshBuilder.CreateBox('book', {
                    width: bookWidth,
                    height: bookHeight,
                    depth: 0.18
                }, this.scene);

                const xOffset = -0.32 + (i * 0.095);
                const yPos = 0.3 + (shelf * 0.45);
                book.position.set(shelfX + xOffset, yPos, shelfZ);
                book.rotation.y = (Math.random() - 0.5) * 0.15;

                const bookMat = new BABYLON.StandardMaterial('bookMat', this.scene);
                bookMat.diffuseColor = bookColors[Math.floor(Math.random() * bookColors.length)];
                bookMat.specularColor = new BABYLON.Color3(0.1, 0.1, 0.1);
                book.material = bookMat;
                this.meshes.push(book);

                // Add book spine detail (gold text strip)
                if (Math.random() > 0.5) {
                    const spine = BABYLON.MeshBuilder.CreateBox('bookSpine', {
                        width: bookWidth * 0.8,
                        height: 0.015,
                        depth: 0.001
                    }, this.scene);
                    spine.position.set(
                        shelfX + xOffset,
                        yPos + bookHeight * 0.3,
                        shelfZ + 0.091
                    );
                    spine.rotation.y = book.rotation.y;
                    spine.material = this.materials.brass;
                    this.meshes.push(spine);
                }
            }
        }
    }

    /**
     * Create investigation board (cork board with photos and strings)
     */
    createInvestigationBoard() {
        const boardX = 0;
        const boardY = 2.0;
        const boardZ = 2.92;

        // Cork board backing
        const board = BABYLON.MeshBuilder.CreateBox('corkBoard', {
            width: 1.2,
            height: 0.9,
            depth: 0.04
        }, this.scene);
        board.position.set(boardX, boardY, boardZ);
        board.material = this.materials.cork;
        this.meshes.push(board);

        // Wood frame around board
        const frameWidth = 0.06;
        const frameParts = [
            { w: 1.3, h: frameWidth, x: 0, y: 0.48 }, // Top
            { w: 1.3, h: frameWidth, x: 0, y: -0.48 }, // Bottom
            { w: frameWidth, h: 0.9, x: -0.65, y: 0 }, // Left
            { w: frameWidth, h: 0.9, x: 0.65, y: 0 }, // Right
        ];

        frameParts.forEach(part => {
            const framePiece = BABYLON.MeshBuilder.CreateBox('boardFrame', {
                width: part.w,
                height: part.h,
                depth: 0.03
            }, this.scene);
            framePiece.position.set(boardX + part.x, boardY + part.y, boardZ + 0.035);
            framePiece.material = this.materials.darkWood;
            this.meshes.push(framePiece);
        });

        // Add photos/documents pinned to board
        const photoPositions = [
            { x: -0.3, y: 0.2 }, { x: 0.25, y: 0.25 },
            { x: -0.35, y: -0.2 }, { x: 0.15, y: -0.25 },
            { x: 0, y: 0.05 }
        ];

        photoPositions.forEach((pos, i) => {
            // Photo/document
            const photo = BABYLON.MeshBuilder.CreatePlane('photo', {
                width: 0.22,
                height: 0.18
            }, this.scene);
            photo.position.set(boardX + pos.x, boardY + pos.y, boardZ + 0.025);
            photo.rotation.z = (Math.random() - 0.5) * 0.2;

            const photoMat = new BABYLON.StandardMaterial('photoMat', this.scene);
            photoMat.diffuseColor = new BABYLON.Color3(0.85, 0.82, 0.78);
            photoMat.emissiveColor = new BABYLON.Color3(0.05, 0.05, 0.05);
            photo.material = photoMat;
            this.meshes.push(photo);

            // Push pin
            const pin = BABYLON.MeshBuilder.CreateCylinder('pushPin', {
                height: 0.02,
                diameter: 0.015
            }, this.scene);
            pin.position.set(boardX + pos.x, boardY + pos.y + 0.08, boardZ + 0.03);

            const pinMat = new BABYLON.StandardMaterial('pinMat', this.scene);
            const pinColors = [
                new BABYLON.Color3(0.8, 0.15, 0.15), // Red
                new BABYLON.Color3(0.15, 0.15, 0.8), // Blue
                new BABYLON.Color3(0.9, 0.85, 0.2), // Yellow
            ];
            pinMat.diffuseColor = pinColors[i % pinColors.length];
            pin.material = pinMat;
            this.meshes.push(pin);
        });

        // Red string connecting photos (detective connections)
        const stringMat = new BABYLON.StandardMaterial('stringMat', this.scene);
        stringMat.diffuseColor = new BABYLON.Color3(0.85, 0.15, 0.15);
        stringMat.emissiveColor = new BABYLON.Color3(0.2, 0.03, 0.03);

        const connections = [
            [photoPositions[0], photoPositions[1]],
            [photoPositions[1], photoPositions[4]],
            [photoPositions[4], photoPositions[2]],
        ];

        connections.forEach(([start, end]) => {
            const distance = Math.sqrt(Math.pow(end.x - start.x, 2) + Math.pow(end.y - start.y, 2));
            const string = BABYLON.MeshBuilder.CreateCylinder('string', {
                height: distance,
                diameter: 0.004
            }, this.scene);

            const midX = (start.x + end.x) / 2;
            const midY = (start.y + end.y) / 2;
            string.position.set(boardX + midX, boardY + midY, boardZ + 0.022);

            const angle = Math.atan2(end.y - start.y, end.x - start.x);
            string.rotation.z = angle - Math.PI / 2;

            string.material = stringMat;
            this.meshes.push(string);
        });
    }

    /**
     * Create desk lamp (enhanced detail)
     */
    createDeskLamp() {
        const lampX = 0.6;
        const lampY = 0.85;
        const lampZ = 0;

        // Lamp base
        const base = BABYLON.MeshBuilder.CreateCylinder('lampBase', {
            height: 0.04,
            diameter: 0.15
        }, this.scene);
        base.position.set(lampX, lampY, lampZ);
        base.material = this.materials.brass;
        this.meshes.push(base);

        // Lamp arm
        const arm = BABYLON.MeshBuilder.CreateCylinder('lampArm', {
            height: 0.25,
            diameter: 0.015
        }, this.scene);
        arm.position.set(lampX, lampY + 0.14, lampZ);
        arm.rotation.z = 0.3;
        arm.material = this.materials.brass;
        this.meshes.push(arm);

        // Lamp shade
        const shade = BABYLON.MeshBuilder.CreateCylinder('lampShade', {
            height: 0.12,
            diameterTop: 0.08,
            diameterBottom: 0.14
        }, this.scene);
        shade.position.set(lampX + 0.08, lampY + 0.25, lampZ);

        const shadeMat = new BABYLON.StandardMaterial('lampShadeMat', this.scene);
        shadeMat.diffuseColor = new BABYLON.Color3(0.25, 0.45, 0.25); // Green banker's lamp
        shadeMat.specularColor = new BABYLON.Color3(0.15, 0.25, 0.15);
        shadeMat.emissiveColor = new BABYLON.Color3(0.05, 0.1, 0.05);
        shade.material = shadeMat;
        this.meshes.push(shade);
    }

    /**
     * Create coat rack with fedora
     */
    createCoatRack() {
        const rackX = 2.0;
        const rackZ = -2.5;

        // Pole
        const pole = BABYLON.MeshBuilder.CreateCylinder('coatRackPole', {
            height: 1.8,
            diameter: 0.06
        }, this.scene);
        pole.position.set(rackX, 0.9, rackZ);
        pole.material = this.materials.darkWood;
        this.meshes.push(pole);

        // Base
        const base = BABYLON.MeshBuilder.CreateCylinder('coatRackBase', {
            height: 0.04,
            diameter: 0.35
        }, this.scene);
        base.position.set(rackX, 0.02, rackZ);
        base.material = this.materials.darkWood;
        this.meshes.push(base);

        // Hooks
        for (let i = 0; i < 4; i++) {
            const hook = BABYLON.MeshBuilder.CreateCylinder('hook', {
                height: 0.22,
                diameter: 0.03
            }, this.scene);
            hook.position.set(rackX, 1.55, rackZ);
            hook.rotation.z = Math.PI / 2;
            hook.rotation.y = (i * Math.PI / 2);
            hook.material = this.materials.darkWood;
            this.meshes.push(hook);
        }

        // Detective fedora hat
        const hatCrown = BABYLON.MeshBuilder.CreateCylinder('hatCrown', {
            height: 0.13,
            diameterTop: 0.18,
            diameterBottom: 0.2
        }, this.scene);
        hatCrown.position.set(rackX + 0.12, 1.7, rackZ);
        hatCrown.material = this.materials.leather;
        this.meshes.push(hatCrown);

        const hatBrim = BABYLON.MeshBuilder.CreateCylinder('hatBrim', {
            height: 0.015,
            diameter: 0.36
        }, this.scene);
        hatBrim.position.set(rackX + 0.12, 1.64, rackZ);
        hatBrim.material = this.materials.leather;
        this.meshes.push(hatBrim);

        // Hat band
        const hatBand = BABYLON.MeshBuilder.CreateTorus('hatBand', {
            diameter: 0.2,
            thickness: 0.015,
            tessellation: 32
        }, this.scene);
        hatBand.position.set(rackX + 0.12, 1.65, rackZ);
        hatBand.rotation.x = Math.PI / 2;

        const bandMat = new BABYLON.StandardMaterial('hatBandMat', this.scene);
        bandMat.diffuseColor = new BABYLON.Color3(0.15, 0.12, 0.1);
        hatBand.material = bandMat;
        this.meshes.push(hatBand);
    }

    /**
     * Create wall decorations
     */
    createWallDecorations() {
        // Certificate frame
        this.createFrame(-1.2, 2.6, 2.92, 0.35, 0.5);

        // Photo frame
        this.createFrame(1.2, 2.4, 2.92, 0.28, 0.28);

        // Clock
        this.createClock(-0.7, 2.9, 2.92);
    }

    /**
     * Create picture frame with wood frame
     */
    createFrame(x, y, z, width, height) {
        // Frame
        const frame = BABYLON.MeshBuilder.CreateBox('frame', {
            width: width + 0.035,
            height: height + 0.035,
            depth: 0.025
        }, this.scene);
        frame.position.set(x, y, z);
        frame.material = this.materials.darkWood;
        this.meshes.push(frame);

        // Picture/content
        const picture = BABYLON.MeshBuilder.CreatePlane('picture', {
            width: width,
            height: height
        }, this.scene);
        picture.position.set(x, y, z + 0.015);
        picture.material = this.materials.paper;
        this.meshes.push(picture);
    }

    /**
     * Create detailed wall clock
     */
    createClock(x, y, z) {
        // Clock face
        const clockFace = BABYLON.MeshBuilder.CreateCylinder('clockFace', {
            height: 0.04,
            diameter: 0.28
        }, this.scene);
        clockFace.rotation.x = Math.PI / 2;
        clockFace.position.set(x, y, z);

        const clockMat = new BABYLON.StandardMaterial('clockMat', this.scene);
        clockMat.diffuseColor = new BABYLON.Color3(0.95, 0.93, 0.9);
        clockMat.specularColor = new BABYLON.Color3(0.25, 0.25, 0.25);
        clockFace.material = clockMat;
        this.meshes.push(clockFace);

        // Clock rim - brass
        const rim = BABYLON.MeshBuilder.CreateTorus('clockRim', {
            diameter: 0.28,
            thickness: 0.018,
            tessellation: 32
        }, this.scene);
        rim.rotation.x = Math.PI / 2;
        rim.position.set(x, y, z + 0.01);
        rim.material = this.materials.brass;
        this.meshes.push(rim);

        // Hour markers
        for (let i = 0; i < 12; i++) {
            const marker = BABYLON.MeshBuilder.CreateBox('hourMarker', {
                width: 0.008,
                height: 0.025,
                depth: 0.002
            }, this.scene);
            const angle = (i * Math.PI / 6) - Math.PI / 2;
            const radius = 0.11;
            marker.position.set(
                x + Math.cos(angle) * radius,
                y + Math.sin(angle) * radius,
                z + 0.022
            );
            marker.rotation.z = angle + Math.PI / 2;

            const markerMat = new BABYLON.StandardMaterial('markerMat', this.scene);
            markerMat.diffuseColor = new BABYLON.Color3(0.1, 0.1, 0.1);
            marker.material = markerMat;
            this.meshes.push(marker);
        }

        // Hour hand
        const hourHand = BABYLON.MeshBuilder.CreateBox('hourHand', {
            width: 0.015,
            height: 0.09,
            depth: 0.008
        }, this.scene);
        hourHand.position.set(x, y, z + 0.025);
        hourHand.rotation.z = -Math.PI / 6; // 10 o'clock

        const handMat = new BABYLON.StandardMaterial('handMat', this.scene);
        handMat.diffuseColor = new BABYLON.Color3(0.08, 0.08, 0.08);
        hourHand.material = handMat;
        this.meshes.push(hourHand);

        // Minute hand
        const minuteHand = BABYLON.MeshBuilder.CreateBox('minuteHand', {
            width: 0.012,
            height: 0.12,
            depth: 0.008
        }, this.scene);
        minuteHand.position.set(x, y, z + 0.028);
        minuteHand.rotation.z = Math.PI / 3; // 20 minutes
        minuteHand.material = handMat;
        this.meshes.push(minuteHand);

        // Center cap
        const center = BABYLON.MeshBuilder.CreateCylinder('clockCenter', {
            height: 0.008,
            diameter: 0.025
        }, this.scene);
        center.rotation.x = Math.PI / 2;
        center.position.set(x, y, z + 0.032);
        center.material = this.materials.brass;
        this.meshes.push(center);
    }

    /**
     * Create ceiling
     */
    createCeiling() {
        const ceiling = BABYLON.MeshBuilder.CreateGround('ceiling', {
            width: 5,
            height: 6
        }, this.scene);
        ceiling.position.y = 3.2;
        ceiling.rotation.x = Math.PI;

        const ceilingMaterial = new BABYLON.StandardMaterial('ceilingMaterial', this.scene);
        ceilingMaterial.diffuseColor = new BABYLON.Color3(0.88, 0.86, 0.84);
        ceilingMaterial.specularColor = new BABYLON.Color3(0.08, 0.08, 0.08);
        ceiling.material = ceilingMaterial;
        this.meshes.push(ceiling);
    }

    /**
     * Create decorative plants around the office
     */
    createPlants() {
        // Plant 1: Small potted plant on filing cabinet
        this.createPottedPlant(2.1, 1.08, 1.5, 0.12, 'small');

        // Plant 2: Medium floor plant near bookshelf
        this.createPottedPlant(-1.8, 0.0, 0.8, 0.18, 'medium');

        // Plant 3: Desk corner plant
        this.createPottedPlant(-0.5, 0.85, -0.3, 0.1, 'small');

        // Plant 4: Floor plant in corner
        this.createPottedPlant(1.8, 0.0, -2.2, 0.2, 'large');
    }

    /**
     * Create a single potted plant with terracotta pot
     * @param {number} x - X position
     * @param {number} y - Y position (bottom of pot)
     * @param {number} z - Z position
     * @param {number} scale - Scale factor
     * @param {string} size - 'small', 'medium', or 'large'
     */
    createPottedPlant(x, y, z, scale, size) {
        const potHeight = size === 'small' ? 0.15 : size === 'medium' ? 0.25 : 0.3;
        const potDiameter = size === 'small' ? 0.12 : size === 'medium' ? 0.18 : 0.22;

        // Terracotta pot
        const pot = BABYLON.MeshBuilder.CreateCylinder('pot', {
            height: potHeight,
            diameterTop: potDiameter * 1.1,
            diameterBottom: potDiameter * 0.85,
            tessellation: 16
        }, this.scene);
        pot.position.set(x, y + potHeight / 2, z);
        pot.material = this.materials.terracotta;
        this.meshes.push(pot);

        // Rim decoration
        const rim = BABYLON.MeshBuilder.CreateTorus('potRim', {
            diameter: potDiameter * 1.15,
            thickness: 0.008,
            tessellation: 24
        }, this.scene);
        rim.position.set(x, y + potHeight - 0.01, z);
        rim.rotation.x = Math.PI / 2;
        rim.material = this.materials.terracotta;
        this.meshes.push(rim);

        // Soil
        const soil = BABYLON.MeshBuilder.CreateCylinder('soil', {
            height: 0.02,
            diameter: potDiameter * 1.05,
            tessellation: 16
        }, this.scene);
        soil.position.set(x, y + potHeight - 0.02, z);
        soil.material = this.materials.soil;
        this.meshes.push(soil);

        // Plant foliage (multiple leaf clusters)
        const numLeaves = size === 'small' ? 5 : size === 'medium' ? 8 : 12;
        const leafHeight = size === 'small' ? 0.15 : size === 'medium' ? 0.25 : 0.35;

        for (let i = 0; i < numLeaves; i++) {
            const angle = (i / numLeaves) * Math.PI * 2;
            const leafRadius = scale * 0.8;
            const heightVariation = Math.random() * 0.1;

            // Leaf stem
            const stem = BABYLON.MeshBuilder.CreateCylinder('stem', {
                height: leafHeight + heightVariation,
                diameter: 0.008,
                tessellation: 8
            }, this.scene);

            const stemX = x + Math.cos(angle) * (potDiameter * 0.2);
            const stemZ = z + Math.sin(angle) * (potDiameter * 0.2);
            stem.position.set(stemX, y + potHeight + (leafHeight + heightVariation) / 2, stemZ);
            stem.rotation.z = (Math.random() - 0.5) * 0.3;
            stem.rotation.x = (Math.random() - 0.5) * 0.3;

            const stemMat = new BABYLON.StandardMaterial('stemMat', this.scene);
            stemMat.diffuseColor = new BABYLON.Color3(0.25, 0.4, 0.2);
            stem.material = stemMat;
            this.meshes.push(stem);

            // Leaf
            const leaf = BABYLON.MeshBuilder.CreateSphere('leaf', {
                diameter: scale * 1.2,
                segments: 8
            }, this.scene);
            leaf.scaling.y = 0.4; // Flatten to leaf shape
            leaf.scaling.z = 1.5; // Elongate
            leaf.position.set(
                stemX + Math.cos(angle) * (leafRadius * 0.3),
                y + potHeight + leafHeight + heightVariation,
                stemZ + Math.sin(angle) * (leafRadius * 0.3)
            );
            leaf.rotation.y = angle;
            leaf.rotation.z = Math.PI / 6 + (Math.random() - 0.5) * 0.4;
            leaf.material = this.materials.foliage;
            this.meshes.push(leaf);
        }
    }

    /**
     * Clean up resources
     */
    dispose() {
        this.meshes.forEach(mesh => mesh.dispose());
        this.meshes = [];

        // Dispose materials
        Object.values(this.materials).forEach(mat => mat.dispose());
        this.materials = {};
    }
}
