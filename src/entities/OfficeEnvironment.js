import * as BABYLON from '@babylonjs/core';

/**
 * Creates a complete detective office environment with walls, furniture, and decorations
 */
export class OfficeEnvironment {
    constructor(scene) {
        this.scene = scene;
        this.meshes = [];

        this.initialize();
    }

    /**
     * Initialize the complete office environment
     */
    initialize() {
        console.log('Creating detective office environment...');

        // Create floor
        this.createFloor();

        // Create walls
        this.createWalls();

        // Create window with blinds
        this.createWindow();

        // Create door
        this.createDoor();

        // Create filing cabinet
        this.createFilingCabinet();

        // Create bookshelf
        this.createBookshelf();

        // Create coat rack
        this.createCoatRack();

        // Create wall decorations
        this.createWallDecorations();

        // Create ceiling
        this.createCeiling();

        console.log('Detective office environment created successfully');
    }

    /**
     * Create wooden floor
     */
    createFloor() {
        const floor = BABYLON.MeshBuilder.CreateGround('floor', {
            width: 8,
            height: 8
        }, this.scene);

        // Create procedural wood floor texture
        const floorTexture = new BABYLON.DynamicTexture('floorTexture', 512, this.scene);
        const ctx = floorTexture.getContext();

        // Wood planks pattern
        ctx.fillStyle = '#3D2817';
        ctx.fillRect(0, 0, 512, 512);

        // Draw wood planks (horizontal)
        for (let y = 0; y < 512; y += 64) {
            const plankShade = 0.2 + Math.random() * 0.15;
            ctx.fillStyle = `rgb(${61 * plankShade}, ${40 * plankShade}, ${23 * plankShade})`;
            ctx.fillRect(0, y, 512, 60);

            // Wood grain
            ctx.strokeStyle = `rgba(0, 0, 0, ${0.1 + Math.random() * 0.1})`;
            ctx.lineWidth = 1;
            for (let x = 0; x < 512; x += 4) {
                ctx.beginPath();
                ctx.moveTo(x, y);
                ctx.lineTo(x + Math.random() * 8, y + 60);
                ctx.stroke();
            }

            // Plank separation lines
            ctx.strokeStyle = 'rgba(0, 0, 0, 0.4)';
            ctx.lineWidth = 2;
            ctx.beginPath();
            ctx.moveTo(0, y + 62);
            ctx.lineTo(512, y + 62);
            ctx.stroke();
        }

        const floorMaterial = new BABYLON.StandardMaterial('floorMaterial', this.scene);
        floorMaterial.diffuseTexture = floorTexture;
        floorMaterial.specularColor = new BABYLON.Color3(0.2, 0.2, 0.2);
        floorMaterial.diffuseTexture.uScale = 3;
        floorMaterial.diffuseTexture.vScale = 3;

        floor.material = floorMaterial;
        floor.receiveShadows = true;
        this.meshes.push(floor);
    }

    /**
     * Create office walls (back, left, right)
     */
    createWalls() {
        const wallHeight = 3.5;
        const wallMaterial = new BABYLON.StandardMaterial('wallMaterial', this.scene);
        wallMaterial.diffuseColor = new BABYLON.Color3(0.82, 0.78, 0.72); // Beige/cream
        wallMaterial.specularColor = new BABYLON.Color3(0.1, 0.1, 0.1);

        // Back wall
        const backWall = BABYLON.MeshBuilder.CreatePlane('backWall', {
            width: 8,
            height: wallHeight
        }, this.scene);
        backWall.position.z = 4;
        backWall.position.y = wallHeight / 2;
        backWall.material = wallMaterial;
        this.meshes.push(backWall);

        // Left wall
        const leftWall = BABYLON.MeshBuilder.CreatePlane('leftWall', {
            width: 8,
            height: wallHeight
        }, this.scene);
        leftWall.position.x = -4;
        leftWall.position.y = wallHeight / 2;
        leftWall.rotation.y = Math.PI / 2;
        leftWall.material = wallMaterial;
        this.meshes.push(leftWall);

        // Right wall
        const rightWall = BABYLON.MeshBuilder.CreatePlane('rightWall', {
            width: 8,
            height: wallHeight
        }, this.scene);
        rightWall.position.x = 4;
        rightWall.position.y = wallHeight / 2;
        rightWall.rotation.y = -Math.PI / 2;
        rightWall.material = wallMaterial;
        this.meshes.push(rightWall);

        // Baseboards
        this.createBaseboard(-4, 4, 0, 8, Math.PI / 2); // Left
        this.createBaseboard(4, 4, 0, 8, -Math.PI / 2); // Right
        this.createBaseboard(0, 4, 4, 8, 0); // Back
    }

    /**
     * Create baseboard molding
     */
    createBaseboard(x, z, y, width, rotationY) {
        const baseboard = BABYLON.MeshBuilder.CreateBox('baseboard', {
            width: width,
            height: 0.15,
            depth: 0.05
        }, this.scene);
        baseboard.position.x = x;
        baseboard.position.z = z;
        baseboard.position.y = 0.075;
        baseboard.rotation.y = rotationY;

        const baseboardMaterial = new BABYLON.StandardMaterial('baseboardMaterial', this.scene);
        baseboardMaterial.diffuseColor = new BABYLON.Color3(0.9, 0.9, 0.88);
        baseboard.material = baseboardMaterial;
        this.meshes.push(baseboard);
    }

    /**
     * Create window with venetian blinds (noir detective aesthetic)
     */
    createWindow() {
        const windowX = -2;
        const windowY = 2;
        const windowZ = 3.95;

        // Window frame
        const frame = BABYLON.MeshBuilder.CreateBox('windowFrame', {
            width: 1.8,
            height: 2,
            depth: 0.1
        }, this.scene);
        frame.position.set(windowX, windowY, windowZ);

        const frameMaterial = new BABYLON.StandardMaterial('frameMaterial', this.scene);
        frameMaterial.diffuseColor = new BABYLON.Color3(0.25, 0.2, 0.15);
        frame.material = frameMaterial;
        this.meshes.push(frame);

        // Window glass (semi-transparent)
        const glass = BABYLON.MeshBuilder.CreatePlane('windowGlass', {
            width: 1.6,
            height: 1.8
        }, this.scene);
        glass.position.set(windowX, windowY, windowZ + 0.06);

        const glassMaterial = new BABYLON.StandardMaterial('glassMaterial', this.scene);
        glassMaterial.diffuseColor = new BABYLON.Color3(0.7, 0.8, 0.9);
        glassMaterial.specularColor = new BABYLON.Color3(0.9, 0.9, 1);
        glassMaterial.alpha = 0.3;
        glass.material = glassMaterial;
        this.meshes.push(glass);

        // Venetian blinds (horizontal slats)
        const blindsMaterial = new BABYLON.StandardMaterial('blindsMaterial', this.scene);
        blindsMaterial.diffuseColor = new BABYLON.Color3(0.85, 0.82, 0.75);
        blindsMaterial.specularColor = new BABYLON.Color3(0.3, 0.3, 0.3);

        const numSlats = 20;
        const slatHeight = 0.04;
        const slatSpacing = 1.8 / numSlats;

        for (let i = 0; i < numSlats; i++) {
            const slat = BABYLON.MeshBuilder.CreateBox(`blind${i}`, {
                width: 1.5,
                height: slatHeight,
                depth: 0.01
            }, this.scene);

            const yPos = windowY - 0.9 + (i * slatSpacing);
            slat.position.set(windowX, yPos, windowZ + 0.08);
            slat.rotation.x = Math.PI / 12; // Slight angle
            slat.material = blindsMaterial;
            this.meshes.push(slat);
        }

        // Pull cord
        const cord = BABYLON.MeshBuilder.CreateCylinder('blindCord', {
            height: 2.2,
            diameter: 0.015
        }, this.scene);
        cord.position.set(windowX + 0.7, windowY - 0.1, windowZ + 0.1);

        const cordMaterial = new BABYLON.StandardMaterial('cordMaterial', this.scene);
        cordMaterial.diffuseColor = new BABYLON.Color3(0.9, 0.9, 0.85);
        cord.material = cordMaterial;
        this.meshes.push(cord);
    }

    /**
     * Create office door
     */
    createDoor() {
        const doorX = 3;
        const doorY = 1.2;
        const doorZ = 3.95;

        // Door frame
        const doorFrame = BABYLON.MeshBuilder.CreateBox('doorFrame', {
            width: 1.1,
            height: 2.4,
            depth: 0.15
        }, this.scene);
        doorFrame.position.set(doorX, doorY, doorZ);

        const frameMaterial = new BABYLON.StandardMaterial('doorFrameMaterial', this.scene);
        frameMaterial.diffuseColor = new BABYLON.Color3(0.3, 0.25, 0.2);
        doorFrame.material = frameMaterial;
        this.meshes.push(doorFrame);

        // Door panel
        const door = BABYLON.MeshBuilder.CreateBox('door', {
            width: 1.0,
            height: 2.3,
            depth: 0.08
        }, this.scene);
        door.position.set(doorX, doorY, doorZ + 0.04);

        const doorMaterial = new BABYLON.StandardMaterial('doorMaterial', this.scene);
        doorMaterial.diffuseColor = new BABYLON.Color3(0.35, 0.28, 0.22);
        doorMaterial.specularColor = new BABYLON.Color3(0.2, 0.2, 0.2);
        door.material = doorMaterial;
        this.meshes.push(door);

        // Door knob
        const knob = BABYLON.MeshBuilder.CreateSphere('doorKnob', {
            diameter: 0.08
        }, this.scene);
        knob.position.set(doorX - 0.4, doorY, doorZ + 0.09);

        const knobMaterial = new BABYLON.StandardMaterial('knobMaterial', this.scene);
        knobMaterial.diffuseColor = new BABYLON.Color3(0.6, 0.5, 0.3);
        knobMaterial.specularColor = new BABYLON.Color3(0.8, 0.7, 0.5);
        knobMaterial.specularPower = 128;
        knob.material = knobMaterial;
        this.meshes.push(knob);

        // Door window (frosted glass with text)
        const doorWindow = BABYLON.MeshBuilder.CreateBox('doorWindow', {
            width: 0.4,
            height: 0.6,
            depth: 0.02
        }, this.scene);
        doorWindow.position.set(doorX + 0.1, doorY + 0.8, doorZ + 0.08);

        const doorWindowMaterial = new BABYLON.StandardMaterial('doorWindowMaterial', this.scene);
        doorWindowMaterial.diffuseColor = new BABYLON.Color3(0.8, 0.8, 0.75);
        doorWindowMaterial.alpha = 0.6;
        doorWindow.material = doorWindowMaterial;
        this.meshes.push(doorWindow);
    }

    /**
     * Create filing cabinet
     */
    createFilingCabinet() {
        const cabinetX = 3.5;
        const cabinetZ = 2;

        // Cabinet body
        const cabinet = BABYLON.MeshBuilder.CreateBox('cabinet', {
            width: 0.6,
            height: 1.2,
            depth: 0.5
        }, this.scene);
        cabinet.position.set(cabinetX, 0.6, cabinetZ);

        const cabinetMaterial = new BABYLON.StandardMaterial('cabinetMaterial', this.scene);
        cabinetMaterial.diffuseColor = new BABYLON.Color3(0.4, 0.4, 0.42);
        cabinetMaterial.specularColor = new BABYLON.Color3(0.5, 0.5, 0.52);
        cabinetMaterial.specularPower = 64;
        cabinet.material = cabinetMaterial;
        this.meshes.push(cabinet);

        // Drawer handles (3 drawers)
        const handleMaterial = new BABYLON.StandardMaterial('handleMaterial', this.scene);
        handleMaterial.diffuseColor = new BABYLON.Color3(0.3, 0.3, 0.32);

        for (let i = 0; i < 3; i++) {
            const handle = BABYLON.MeshBuilder.CreateBox('handle', {
                width: 0.3,
                height: 0.04,
                depth: 0.04
            }, this.scene);
            handle.position.set(cabinetX, 0.3 + (i * 0.3), cabinetZ + 0.27);
            handle.material = handleMaterial;
            this.meshes.push(handle);

            // Drawer lines
            const drawerLine = BABYLON.MeshBuilder.CreateBox('drawerLine', {
                width: 0.58,
                height: 0.02,
                depth: 0.01
            }, this.scene);
            drawerLine.position.set(cabinetX, 0.1 + (i * 0.3), cabinetZ + 0.26);
            drawerLine.material = handleMaterial;
            this.meshes.push(drawerLine);
        }
    }

    /**
     * Create bookshelf with books
     */
    createBookshelf() {
        const shelfX = -3.5;
        const shelfZ = 2;

        // Bookshelf frame
        const shelf = BABYLON.MeshBuilder.CreateBox('bookshelf', {
            width: 1.0,
            height: 2.0,
            depth: 0.35
        }, this.scene);
        shelf.position.set(shelfX, 1.0, shelfZ);

        const shelfMaterial = new BABYLON.StandardMaterial('shelfMaterial', this.scene);
        shelfMaterial.diffuseColor = new BABYLON.Color3(0.3, 0.22, 0.15);
        shelf.material = shelfMaterial;
        this.meshes.push(shelf);

        // Horizontal shelves
        const shelfBoardMaterial = new BABYLON.StandardMaterial('shelfBoardMaterial', this.scene);
        shelfBoardMaterial.diffuseColor = new BABYLON.Color3(0.35, 0.25, 0.18);

        for (let i = 0; i < 4; i++) {
            const board = BABYLON.MeshBuilder.CreateBox('shelfBoard', {
                width: 0.95,
                height: 0.03,
                depth: 0.3
            }, this.scene);
            board.position.set(shelfX, 0.2 + (i * 0.5), shelfZ);
            board.material = shelfBoardMaterial;
            this.meshes.push(board);
        }

        // Add books
        const bookColors = [
            new BABYLON.Color3(0.6, 0.2, 0.2),  // Red
            new BABYLON.Color3(0.2, 0.3, 0.6),  // Blue
            new BABYLON.Color3(0.3, 0.5, 0.2),  // Green
            new BABYLON.Color3(0.5, 0.3, 0.1),  // Brown
            new BABYLON.Color3(0.4, 0.2, 0.4),  // Purple
        ];

        // Add books to shelves
        for (let shelfNum = 0; shelfNum < 3; shelfNum++) {
            for (let i = 0; i < 8; i++) {
                const book = BABYLON.MeshBuilder.CreateBox('book', {
                    width: 0.08,
                    height: 0.25 + Math.random() * 0.1,
                    depth: 0.2
                }, this.scene);

                const xOffset = -0.4 + (i * 0.11);
                const yPos = 0.35 + (shelfNum * 0.5);
                book.position.set(shelfX + xOffset, yPos, shelfZ);
                book.rotation.y = (Math.random() - 0.5) * 0.1;

                const bookMaterial = new BABYLON.StandardMaterial('bookMaterial', this.scene);
                bookMaterial.diffuseColor = bookColors[Math.floor(Math.random() * bookColors.length)];
                book.material = bookMaterial;
                this.meshes.push(book);
            }
        }
    }

    /**
     * Create coat rack with hat
     */
    createCoatRack() {
        const rackX = 3.2;
        const rackZ = -3.5;

        // Vertical pole
        const pole = BABYLON.MeshBuilder.CreateCylinder('coatRackPole', {
            height: 2.0,
            diameter: 0.08
        }, this.scene);
        pole.position.set(rackX, 1.0, rackZ);

        const poleMaterial = new BABYLON.StandardMaterial('poleMaterial', this.scene);
        poleMaterial.diffuseColor = new BABYLON.Color3(0.15, 0.12, 0.1);
        pole.material = poleMaterial;
        this.meshes.push(pole);

        // Base
        const base = BABYLON.MeshBuilder.CreateCylinder('coatRackBase', {
            height: 0.05,
            diameter: 0.4
        }, this.scene);
        base.position.set(rackX, 0.025, rackZ);
        base.material = poleMaterial;
        this.meshes.push(base);

        // Hooks (4 arms)
        const hookMaterial = new BABYLON.StandardMaterial('hookMaterial', this.scene);
        hookMaterial.diffuseColor = new BABYLON.Color3(0.2, 0.18, 0.15);

        for (let i = 0; i < 4; i++) {
            const hook = BABYLON.MeshBuilder.CreateCylinder('hook', {
                height: 0.3,
                diameter: 0.04
            }, this.scene);
            hook.position.set(rackX, 1.7, rackZ);
            hook.rotation.z = Math.PI / 2;
            hook.rotation.y = (i * Math.PI / 2);
            hook.material = hookMaterial;
            this.meshes.push(hook);
        }

        // Detective hat (fedora on one hook)
        const hatCrown = BABYLON.MeshBuilder.CreateCylinder('hatCrown', {
            height: 0.15,
            diameterTop: 0.2,
            diameterBottom: 0.22
        }, this.scene);
        hatCrown.position.set(rackX + 0.15, 1.85, rackZ);

        const hatMaterial = new BABYLON.StandardMaterial('hatMaterial', this.scene);
        hatMaterial.diffuseColor = new BABYLON.Color3(0.25, 0.22, 0.2);
        hatCrown.material = hatMaterial;
        this.meshes.push(hatCrown);

        // Hat brim
        const hatBrim = BABYLON.MeshBuilder.CreateCylinder('hatBrim', {
            height: 0.02,
            diameter: 0.4
        }, this.scene);
        hatBrim.position.set(rackX + 0.15, 1.78, rackZ);
        hatBrim.material = hatMaterial;
        this.meshes.push(hatBrim);
    }

    /**
     * Create wall decorations (framed certificates, photos)
     */
    createWallDecorations() {
        // Certificate/license on back wall
        this.createFrame(-0.5, 2.5, 3.92, 0.4, 0.6);

        // Photo frame
        this.createFrame(0.5, 2.2, 3.92, 0.3, 0.3);

        // Clock
        this.createClock(0, 3.0, 3.92);
    }

    /**
     * Create a picture frame
     */
    createFrame(x, y, z, width, height) {
        // Frame border
        const frame = BABYLON.MeshBuilder.CreateBox('frame', {
            width: width + 0.04,
            height: height + 0.04,
            depth: 0.03
        }, this.scene);
        frame.position.set(x, y, z);

        const frameMaterial = new BABYLON.StandardMaterial('frameMaterial', this.scene);
        frameMaterial.diffuseColor = new BABYLON.Color3(0.15, 0.12, 0.1);
        frame.material = frameMaterial;
        this.meshes.push(frame);

        // Picture/content
        const picture = BABYLON.MeshBuilder.CreatePlane('picture', {
            width: width,
            height: height
        }, this.scene);
        picture.position.set(x, y, z + 0.02);

        const pictureMaterial = new BABYLON.StandardMaterial('pictureMaterial', this.scene);
        pictureMaterial.diffuseColor = new BABYLON.Color3(0.85, 0.82, 0.75);
        picture.material = pictureMaterial;
        this.meshes.push(picture);
    }

    /**
     * Create wall clock
     */
    createClock(x, y, z) {
        // Clock face
        const clockFace = BABYLON.MeshBuilder.CreateCylinder('clockFace', {
            height: 0.05,
            diameter: 0.35
        }, this.scene);
        clockFace.rotation.x = Math.PI / 2;
        clockFace.position.set(x, y, z);

        const clockMaterial = new BABYLON.StandardMaterial('clockMaterial', this.scene);
        clockMaterial.diffuseColor = new BABYLON.Color3(0.95, 0.95, 0.92);
        clockMaterial.specularColor = new BABYLON.Color3(0.3, 0.3, 0.3);
        clockFace.material = clockMaterial;
        this.meshes.push(clockFace);

        // Clock rim
        const rim = BABYLON.MeshBuilder.CreateTorus('clockRim', {
            diameter: 0.35,
            thickness: 0.02,
            tessellation: 32
        }, this.scene);
        rim.rotation.x = Math.PI / 2;
        rim.position.set(x, y, z + 0.01);

        const rimMaterial = new BABYLON.StandardMaterial('rimMaterial', this.scene);
        rimMaterial.diffuseColor = new BABYLON.Color3(0.1, 0.1, 0.1);
        rim.material = rimMaterial;
        this.meshes.push(rim);

        // Clock hands
        const hourHand = BABYLON.MeshBuilder.CreateBox('hourHand', {
            width: 0.02,
            height: 0.12,
            depth: 0.01
        }, this.scene);
        hourHand.position.set(x, y, z + 0.03);
        hourHand.rotation.z = -Math.PI / 6; // 10 o'clock position

        const handMaterial = new BABYLON.StandardMaterial('handMaterial', this.scene);
        handMaterial.diffuseColor = new BABYLON.Color3(0.1, 0.1, 0.1);
        hourHand.material = handMaterial;
        this.meshes.push(hourHand);

        const minuteHand = BABYLON.MeshBuilder.CreateBox('minuteHand', {
            width: 0.015,
            height: 0.15,
            depth: 0.01
        }, this.scene);
        minuteHand.position.set(x, y, z + 0.04);
        minuteHand.rotation.z = Math.PI / 3; // 20 minutes
        minuteHand.material = handMaterial;
        this.meshes.push(minuteHand);

        // Center dot
        const center = BABYLON.MeshBuilder.CreateCylinder('clockCenter', {
            height: 0.01,
            diameter: 0.03
        }, this.scene);
        center.rotation.x = Math.PI / 2;
        center.position.set(x, y, z + 0.05);
        center.material = handMaterial;
        this.meshes.push(center);
    }

    /**
     * Create ceiling
     */
    createCeiling() {
        const ceiling = BABYLON.MeshBuilder.CreateGround('ceiling', {
            width: 8,
            height: 8
        }, this.scene);
        ceiling.position.y = 3.5;
        ceiling.rotation.x = Math.PI;

        const ceilingMaterial = new BABYLON.StandardMaterial('ceilingMaterial', this.scene);
        ceilingMaterial.diffuseColor = new BABYLON.Color3(0.92, 0.90, 0.88);
        ceilingMaterial.specularColor = new BABYLON.Color3(0.1, 0.1, 0.1);
        ceiling.material = ceilingMaterial;
        this.meshes.push(ceiling);
    }

    /**
     * Clean up resources
     */
    dispose() {
        this.meshes.forEach(mesh => mesh.dispose());
        this.meshes = [];
    }
}
