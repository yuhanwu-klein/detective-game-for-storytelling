import { GameManager } from './core/GameManager.js';

/**
 * Main entry point for the detective game
 */

// Wait for DOM to be ready
window.addEventListener('DOMContentLoaded', () => {
    console.log('=== Detective Game Starting ===');

    // Get canvas element
    const canvas = document.getElementById('renderCanvas');

    if (!canvas) {
        console.error('Canvas element not found!');
        return;
    }

    // Create and initialize game manager
    const gameManager = new GameManager(canvas);

    // Start the game
    gameManager.initialize().catch(error => {
        console.error('Failed to initialize game:', error);

        // Show error to user
        const loadingElement = document.getElementById('loading');
        if (loadingElement) {
            loadingElement.innerHTML = `
                <p style="color: #ff4444;">Error loading game:</p>
                <p style="font-size: 14px;">${error.message}</p>
                <p style="font-size: 12px; margin-top: 10px;">Please refresh the page to try again.</p>
            `;
        }
    });

    // Handle page cleanup
    window.addEventListener('beforeunload', () => {
        console.log('Cleaning up game resources...');
        gameManager.dispose();
    });
});

console.log('Detective Game module loaded');
