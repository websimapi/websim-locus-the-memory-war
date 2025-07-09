export class UI {
    constructor() {
        this.locationImage = document.getElementById('location-image');
        this.locationTitle = document.getElementById('location-title');
        this.locationDescription = document.getElementById('location-description');
        this.actionList = document.getElementById('action-list');
        this.memoryList = document.getElementById('memory-list');
    }

    render(state, actionHandler) {
        // Update Location View
        this.locationImage.src = state.image;
        this.locationImage.alt = state.title;
        this.locationTitle.textContent = state.title;
        this.locationDescription.textContent = state.description;

        // Update Actions
        this.actionList.innerHTML = '';
        if (state.actions.length > 0) {
            state.actions.forEach(action => {
                const li = document.createElement('li');
                li.textContent = action.text;
                li.addEventListener('click', () => actionHandler(action));
                this.actionList.appendChild(li);
            });
        } else {
            const li = document.createElement('li');
            li.textContent = 'There is nothing more you can do here.';
            li.style.cursor = 'default';
            this.actionList.appendChild(li);
        }

        // Update Memories
        this.memoryList.innerHTML = '';
        state.memories.forEach(memory => {
            if (!memory) return;
            const li = document.createElement('li');
            li.title = memory.description;
            
            const img = document.createElement('img');
            img.src = 'scroll.png';
            img.alt = 'Memory';
            
            const span = document.createElement('span');
            span.textContent = memory.name;
            
            li.appendChild(img);
            li.appendChild(span);
            this.memoryList.appendChild(li);
        });
    }
}

