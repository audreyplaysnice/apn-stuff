class Suguru {
    constructor(size = 9, difficulty) {
        this.size = size;
        this.difficulty = difficulty;
        this.regions = this.generatePredefinedRegions();
        this.grid = this.generateValidGrid();
        this.solution = JSON.parse(JSON.stringify(this.grid));
        this.puzzle = this.generatePuzzle();
    }

    generatePredefinedRegions() {
        let grid = Array.from({ length: this.size }, () => Array(this.size).fill(-1));
        let regionId = 1;
        let polyominoes = [
            [[0, 0], [0, 1], [1, 0]],  // L-shape (size 3)
            [[0, 0], [1, 0], [2, 0]],  // Vertical line (size 3)
            [[0, 0], [1, 0], [1, 1]],  // T-shape (size 3)
            [[0, 0], [0, 1], [1, 0], [1, 1]], // Square (size 4)
            [[0, 0], [0, 1], [0, 2], [1, 1]], // T-shape (size 4)
            [[0, 0], [1, 0], [2, 0], [3, 0]], // Line (size 4)
            [[0, 0], [0, 1], [0, 2], [1, 0], [1, 1]], // Cross shape (size 5)
            [[0, 0], [1, 0], [2, 0], [2, 1], [2, 2]], // L-shape (size 5)
            [[0, 0], [0, 1], [0, 2], [1, 1], [2, 1], [2, 2]], // Complex (size 6)
            [[0, 0], [1, 0], [2, 0], [3, 0], [4, 0]], // Line (size 5)
        ];
        
        let attempts = 0;
        while (attempts < 100) {
            let poly = polyominoes[Math.floor(Math.random() * polyominoes.length)];
            let startRow = Math.floor(Math.random() * this.size);
            let startCol = Math.floor(Math.random() * this.size);
            let fits = poly.every(([r, c]) => 
                startRow + r < this.size &&
                startCol + c < this.size &&
                grid[startRow + r][startCol + c] === -1
            );
            if (fits) {
                poly.forEach(([r, c]) => grid[startRow + r][startCol + c] = regionId);
                regionId++;
            }
            attempts++;
            if (regionId > this.size) break; // Ensure coverage limit
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
//new polyominoes
