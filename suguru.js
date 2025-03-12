class Suguru {
    constructor(size, difficulty, maxSingleCells = 2) {
        this.size = size;
        this.difficulty = difficulty;
        this.maxSingleCells = maxSingleCells;
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
    let game = new Suguru(7, difficulty);
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
