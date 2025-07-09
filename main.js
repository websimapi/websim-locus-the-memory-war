import { Game } from './game.js';
import { UI } from './ui.js';

class Audio {
    constructor() {
        this.audioContext = new (window.AudioContext || window.webkitAudioContext)();
        this.clickBuffer = null;
        this.loadSound('click.mp3').then(buffer => this.clickBuffer = buffer);
    }

    async loadSound(url) {
        try {
            const response = await fetch(url);
            const arrayBuffer = await response.arrayBuffer();
            return await this.audioContext.decodeAudioData(arrayBuffer);
        } catch (error) {
            console.error(`Failed to load sound: ${url}`, error);
            return null;
        }
    }

    playSound(buffer) {
        if (!buffer || this.audioContext.state === 'suspended') return;
        const source = this.audioContext.createBufferSource();
        source.buffer = buffer;
        source.connect(this.audioContext.destination);
        source.start(0);
    }

    playClick() {
        // Resume context on user gesture
        if (this.audioContext.state === 'suspended') {
            this.audioContext.resume();
        }
        this.playSound(this.clickBuffer);
    }
}

function main() {
    const game = new Game();
    const ui = new UI();
    const audio = new Audio();

    function updateView() {
        const state = game.getCurrentState();
        ui.render(state, handleAction);
    }

    function handleAction(action) {
        audio.playClick();
        action.effect();
        updateView();
    }

    updateView();
}

document.addEventListener('DOMContentLoaded', main);

