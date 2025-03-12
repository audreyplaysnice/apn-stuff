class Suguru {
    constructor(size, maxSingleCells = 2) {
        this.size = size;
        this.maxSingleCells = maxSingleCells;
        this.regions = this.generateRandomRegions();
        this.grid = this.generateGrid();
    }

    generateRandomRegions() {
        let regions = Array.from({ length: this.size }, () => Array(this.size).fill(-1));
        let regionId = 1;
        let cells = [];
        for (let r = 0; r < this.size; r++) {
            for (let c = 0; c < this.size; c++) {
                cells.push([r, c]);
            }
        }
        cells.sort(() => Math.random() - 0.5);
        
        let singleCellCount = 0;
        while (cells.length) {
            let [r, c] = cells.pop();
            if (regions[r][c] === -1) {
                if (singleCellCount < this.maxSingleCells && Math.random() < 0.2) {
                    regions[r][c] = regionId;
                    singleCellCount++;
                } else {
                    let regionSize = Math.floor(Math.random() * 4) + 2;
                    let regionCells = [[r, c]];
                    let stack = [[r, c]];
                    while (stack.length && regionCells.length < regionSize) {
                        let [cr, cc] = stack.pop();
                        let neighbors = [[cr-1, cc], [cr+1, cc], [cr, cc-1], [cr, cc+1]];
                        neighbors.sort(() => Math.random() - 0.5);
                        for (let [nr, nc] of neighbors) {
                            if (nr >= 0 && nr < this.size && nc >= 0 && nc < this.size && regions[nr][nc] === -1) {
                                regions[nr][nc] = regionId;
                                regionCells.push([nr, nc]);
                                stack.push([nr, nc]);
                                if (regionCells.length === regionSize) break;
                            }
                        }
                    }
                    for (let [rr, cc] of regionCells) {
                        regions[rr][cc] = regionId;
                    }
                }
                regionId++;
            }
        }
        return regions;
    }

    generateGrid() {
        let grid = Array.from({ length: this.size }, () => Array(this.size).fill(0));
        let regionMap = new Map();
        for (let r = 0; r < this.size; r++) {
            for (let c = 0; c < this.size; c++) {
                let regionId = this.regions[r][c];
                if (!regionMap.has(regionId)) regionMap.set(regionId, []);
                regionMap.get(regionId).push([r, c]);
            }
        }
        for (let [regionId, cells] of regionMap.entries()) {
            let nums = Array.from({ length: cells.length }, (_, i) => i + 1);
            nums.sort(() => Math.random() - 0.5);
            cells.forEach(([r, c], i) => { grid[r][c] = nums[i]; });
        }
        return grid;
    }

    renderGrid() {
        let gridContainer = document.getElementById("suguru-grid");
        if (!gridContainer) {
            gridContainer = document.createElement("div");
            gridContainer.id = "suguru-grid";
            document.body.appendChild(gridContainer);
        }
        gridContainer.innerHTML = "";
        gridContainer.style.display = "grid";
        gridContainer.style.gridTemplateColumns = `repeat(${this.size}, 50px)`;
        gridContainer.style.gap = "2px";
        gridContainer.style.margin = "20px";

        for (let r = 0; r < this.size; r++) {
            for (let c = 0; c < this.size; c++) {
                let cell = document.createElement("div");
                cell.style.width = "50px";
                cell.style.height = "50px";
                cell.style.border = "1px solid black";
                cell.style.display = "flex";
                cell.style.alignItems = "center";
                cell.style.justifyContent = "center";
                cell.style.fontSize = "20px";
                cell.style.fontWeight = "bold";
                cell.style.backgroundColor = `hsl(${(this.regions[r][c] * 137) % 360}, 50%, 80%)`;
                cell.textContent = this.grid[r][c] === 0 ? "" : this.grid[r][c];
                gridContainer.appendChild(cell);
            }
        }
    }
}

function startNewGame() {
    let suguru = new Suguru(7);
    suguru.renderGrid();
}

// Ensure the button remains on the page
document.addEventListener("DOMContentLoaded", () => {
    let button = document.getElementById("new-game-button");
    if (!button) {
        button = document.createElement("button");
        button.id = "new-game-button";
        button.textContent = "New Game";
        button.style.fontSize = "20px";
        button.style.margin = "10px";
        button.onclick = startNewGame;
        document.body.appendChild(button);
    }
    
    startNewGame();
});
