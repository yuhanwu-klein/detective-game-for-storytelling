# Detective Game for Storytelling

A 3D detective game featuring interactive objects with sound effects and animations.

## Features

- 🎮 3D environment built with Babylon.js
- 📞 Interactive telephone with ring animation and shake effects
- 🔊 Sound effects for phone ringing
- 🎨 Realistic table and office scene
- 🖱️ Interactive camera controls

## Installation

```bash
npm install
```

## Development

```bash
npm run dev
```

Visit `http://localhost:3000` to see the game.

## Build

```bash
npm run build
```

## Controls

- **Click/Tap Phone**: Answer the phone when it's ringing
- **Mouse Drag**: Rotate the camera
- **Mouse Scroll**: Zoom in/out

## Project Structure

```
src/
├── main.js              # Entry point
├── core/
│   └── GameManager.js   # Main game logic
├── entities/
│   ├── PhoneObject.js   # Phone with animations
│   └── TableObject.js   # Table model
└── audio/
    └── AudioManager.js  # Sound system

assets/
└── audio/
    └── effects/
        └── phone-ring.mp3  # Phone ring sound
```

## Phone Implementation

The telephone features:
- **3D Model**: Procedurally generated phone mesh
- **Ring Animation**: Vibrating shake effect when ringing
- **Sound Effects**: Authentic phone ring sound
- **Interaction**: Click to answer
