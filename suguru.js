class Suguru {
    constructor(size = 9, difficulty, minLargeRegions = 2, maxSmallRegions = 1) {
        this.size = size;
        this.difficulty = difficulty;
        this.minLargeRegions = minLargeRegions;
        this.maxSmallRegions = maxSmallRegions;
        this.regions = this.generateRandomRegions();
        this.grid = this.generateValidGrid();
        this.solution = JSON.parse(JSON.stringify(this.grid));
        this.puzzle = this.generatePuzzle();
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
        
        let largeRegionCount = 0;
        let smallRegionCount = 0;
        while (cells.length) {
            let [r, c] = cells.pop();
            if (regions[r][c] === -1) {
                let regionSize = Math.floor(Math.random() * 6) + 2; // Ensures regions are between size 2 and 7
                if (largeRegionCount < this.minLargeRegions && regionSize < 7) {
                    regionSize = 7;
                    largeRegionCount++;
                }
                if (regionSize === 2 && smallRegionCount >= this.maxSmallRegions) {
                    regionSize = Math.floor(Math.random() * 5) + 3;
                } else if (regionSize === 2) {
                    smallRegionCount++;
                }
                if (regionSize === 1) continue; // Ensure no regions of size 1
                
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
                regionId++;
            }
        }
        return regions;
    }

    generateValidGrid() {
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
            
            for (let i = 0; i < cells.length; i++) {
                let [r, c] = cells[i];
                grid[r][c] = nums[i];
            }
        }
        return grid;
    }

    generatePuzzle() {
        return JSON.parse(JSON.stringify(this.solution));
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
                cell.textContent = this.puzzle[r][c] === 0 ? "" : this.puzzle[r][c];
                gridContainer.appendChild(cell);
            }
        }
    }
}

function startNewGame(difficulty) {
    let game = new Suguru(9, difficulty);
    game.renderGrid();
}

document.addEventListener("DOMContentLoaded", () => {
    let difficulties = { "Easy": 0.6, "Medium": 0.4, "Hard": 0.2 };
    let buttonContainer = document.createElement("div");
    buttonContainer.id = "button-container";
    document.body.appendChild(buttonContainer);
    
    for (let level in difficulties) {
        let button = document.createElement("button");
        button.textContent = `New ${level} Game`;
        button.style.fontSize = "20px";
        button.style.margin = "10px";
        button.addEventListener("click", () => startNewGame(difficulties[level]));
        buttonContainer.appendChild(button);
    }
    startNewGame(0.4); // Default to Medium
});
// more fixes 
