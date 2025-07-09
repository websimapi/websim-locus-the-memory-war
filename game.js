export class Game {
    constructor() {
        this.player = {
            memories: new Set(['awakened']),
            currentLocation: 'forest'
        };

        this.world = {
            memories: {
                'awakened': { name: 'Awakening', description: 'You remember waking in this strange place.' },
                'found_clearing': { name: 'A Quiet Place', description: 'You found a peaceful clearing in the woods.' },
                'read_inscription': { name: 'Sunken Secret', description: 'A stone spoke of a city beneath the lake.' },
                'saw_ruins': { name: 'Glimpse of the Past', description: 'You saw the spires of a lost city under the waves.' },
                'drank_from_fountain': { name: 'Amnesia', description: 'A sip of water has clouded your thoughts.' }
            },
            locations: {
                'forest': {
                    title: 'Misty Forest',
                    image: 'forest.png',
                    getDescription: () => {
                        if (this.hasMemory('drank_from_fountain')) {
                            return 'The forest feels hostile and unfamiliar, its paths shrouded in a disorienting mist. You feel hopelessly lost.';
                        }
                        return 'You are in a forest shrouded in mist. The air is thick with forgotten secrets. You feel a strange pull from deeper within.';
                    },
                    getActions: () => {
                        const actions = [];
                        if (this.hasMemory('found_clearing') && !this.hasMemory('drank_from_fountain')) {
                            actions.push({ text: 'Go to the clearing', effect: () => this.player.currentLocation = 'clearing' });
                        } else if (!this.hasMemory('drank_from_fountain')) {
                             actions.push({ text: 'Follow the strange pull', effect: () => { this.addMemory('found_clearing'); this.player.currentLocation = 'clearing'; } });
                        }
                        
                        if (this.hasMemory('read_inscription') && !this.hasMemory('drank_from_fountain')) {
                             actions.push({ text: 'Search for the lake from the inscription', effect: () => this.player.currentLocation = 'lake' });
                        }
                        
                        if(this.hasMemory('drank_from_fountain')){
                             actions.push({ text: 'Wander aimlessly', effect: () => { this.player.memories.delete('drank_from_fountain'); this.addMemory('found_clearing'); this.player.currentLocation = 'clearing'; } });
                        }
                        
                        return actions;
                    }
                },
                'clearing': {
                    title: 'Sunlit Clearing',
                    image: 'clearing.png',
                    getDescription: () => 'You stand in a quiet, sunlit clearing. In the center is a weathered stone monolith and a small, inviting fountain. The monolith is covered in faint carvings.',
                    getActions: () => [
                        { text: 'Examine the monolith', effect: () => { this.addMemory('read_inscription'); } },
                        { text: 'Drink from the fountain of forgetfulness', effect: () => { this.forgetAll(); this.player.currentLocation = 'forest'; } },
                        { text: 'Return to the misty forest', effect: () => { this.player.currentLocation = 'forest'; } }
                    ]
                },
                'lake': {
                    title: 'The Silent Lake',
                    image: 'lake.png',
                    getDescription: () => {
                        if (this.hasMemory('saw_ruins')) {
                            return 'You stand at the shore of the silent lake. Looking into the clear water, you can now clearly see the submerged spires of a forgotten city. It is real.';
                        }
                        return 'You stand at the shore of a vast, silent lake. The water is unnaturally still and clear. You feel a sense of immense history here, just beyond your grasp.';
                    },
                    getActions: () => {
                        const actions = [];
                        if (this.hasMemory('saw_ruins')) {
                            actions.push({ text: 'The memory is now truth. Your journey begins.', effect: () => {} });
                        } else {
                            actions.push({ text: 'Peer into the water', effect: () => { this.addMemory('saw_ruins'); this.player.currentLocation = 'ruins'; } });
                        }
                        actions.push({ text: 'Return to the forest', effect: () => { this.player.currentLocation = 'forest'; } });
                        return actions;
                    }
                },
                'ruins': {
                    title: 'Sunken City',
                    image: 'ruins.png',
                    getDescription: () => 'You have found it. The memory led you to the truth. A whole city, preserved beneath the waves, waiting to be remembered fully.',
                    getActions: () => [
                         { text: 'This is the end of the demo. The journey continues...', effect: () => {} }
                    ]
                }
            }
        };
    }

    addMemory(id) {
        if (!this.player.memories.has(id)) {
            this.player.memories.add(id);
        }
    }
    
    forgetAll() {
        this.player.memories.clear();
        this.addMemory('awakened');
        this.addMemory('drank_from_fountain');
    }

    hasMemory(id) {
        return this.player.memories.has(id);
    }

    getCurrentState() {
        const location = this.world.locations[this.player.currentLocation];
        return {
            title: location.title,
            image: location.image,
            description: location.getDescription(),
            actions: location.getActions(),
            memories: Array.from(this.player.memories).map(id => this.world.memories[id])
        };
    }
}

