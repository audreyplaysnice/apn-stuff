class Suguru {
    constructor(size, difficulty, maxSingleCells = 2) {
        this.size = size;
        this.difficulty = difficulty;
        this.maxSingleCells = maxSingleCells;
        this.regions = this.generateRandomRegions();
        this.grid = this.generateGrid();
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

    generatePuzzle() {
        let puzzle = JSON.parse(JSON.stringify(this.solution));
        let totalCells = this.size * this.size;
        let clues = Math.floor(totalCells * this.difficulty);
        let cellsToRemove = totalCells - clues;
        let indices = [];
        for (let r = 0; r < this.size; r++) {
            for (let c = 0; c < this.size; c++) {
                indices.push([r, c]);
            }
        }
        indices.sort(() => Math.random() - 0.5);
        while (cellsToRemove > 0 && indices.length) {
            let [r, c] = indices.pop();
            puzzle[r][c] = 0;
            cellsToRemove--;
        }
        return puzzle;
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
                let cell = document.createElement("input");
                cell.type = "text";
                cell.maxLength = 1;
                cell.style.width = "50px";
                cell.style.height = "50px";
                cell.style.border = "1px solid black";
                cell.style.textAlign = "center";
                cell.style.fontSize = "20px";
                cell.style.fontWeight = "bold";
                cell.style.backgroundColor = `hsl(${(this.regions[r][c] * 137) % 360}, 50%, 80%)`;
                cell.value = this.puzzle[r][c] !== 0 ? this.puzzle[r][c] : "";
                cell.readOnly = this.puzzle[r][c] !== 0;
                gridContainer.appendChild(cell);
            }
        }
    }
}

function startNewGame(difficulty) {
    let suguru = new Suguru(7, difficulty);
    suguru.renderGrid();
}

// Ensure the buttons remain on the page
document.addEventListener("DOMContentLoaded", () => {
    let difficulties = { "Easy": 0.6, "Medium": 0.4, "Hard": 0.2 };
    for (let level in difficulties) {
        let button = document.createElement("button");
        button.textContent = `New ${level} Game`;
        button.style.fontSize = "20px";
        button.style.margin = "10px";
        button.onclick = () => startNewGame(difficulties[level]);
        document.body.appendChild(button);
    }
    startNewGame(0.4);  // Default to Medium
});
// difficulty added
