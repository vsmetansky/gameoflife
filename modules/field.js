import Random from './random.js';
import Matrix from './matrix.js';

const ALIVE_COLOR = 'black';
const DEAD_COLOR = 'white';

export default class Field extends Matrix {
    constructor(dim, aliveNum) {
        super(dim);
        this.aliveCells = Random.getRandomPairs(aliveNum, 0, dim);
        this.toBeDeadCells = [];
        this.toBeBornCells = [];

        activateBornCells(this.aliveCells, this.element.children);
    }

    evolve() {
        const rows = this.element.children;
        updateBuffers(this.aliveCells, this.toBeBornCells, this.toBeDeadCells, rows);
        activateBornCells(this.toBeBornCells, rows);
        deactivateDeadCells(this.toBeDeadCells, rows);
        updateAliveCells(this.aliveCells, this.toBeBornCells, this.toBeDeadCells);
    }
}

function updateAliveCells(aliveCells, toBeBornCells, toBeDeadCells) {
    filterDead();
    addBorn();

    function filterDead() {
        toBeDeadCells.forEach(dc => {
            let index = aliveCells.findIndex(c => dc[0] === c[0] && dc[1] === c[1]);
            aliveCells.splice(index, 1);
        });
        toBeDeadCells.length = 0;
    }

    function addBorn() {
        toBeBornCells.forEach(bc => {
            aliveCells.push(bc);
        });
        toBeBornCells.length = 0;
    }
}

function updateBuffers(aliveCells, toBeBornCells, toBeDeadCells, rows) {
    aliveCells.forEach(c => {
        aliveLookAround(c[1], c[0], rows, toBeDeadCells);
        deadLookAround(c[1], c[0], rows, toBeBornCells);
    });
}

function aliveLookAround(x, y, rows, toBeDeadCells) {
    const fieldDim = rows.length;
    const aliveAround = [];
    lookAround(x, y, fieldDim, (x1, y1) => {
        let curCell = rows[y1].children[x1];
        if (cellIsAlive(curCell)) aliveAround.push(curCell);
    });
    if (aliveAround.length > 3 || aliveAround.length < 2) {
        toBeDeadCells.push([y, x]);
    }
}

function deadLookAround(x, y, rows, toBeBornCells) {
    const fieldDim = rows.length;
    const aliveAround = [];
    lookAround(x, y, fieldDim, lookAroundDeadCell);

    function lookAroundDeadCell(x1, y1) {
        let curCell = rows[y1].children[x1];
        if (!cellIsAlive(curCell)) {
            lookAround(x1, y1, fieldDim, (x2, y2) => {
                let curCellAdjacent = rows[y2].children[x2];
                if (cellIsAlive(curCellAdjacent)) aliveAround.push(curCellAdjacent);
            });
        }
        //fucking don't know why it executes 3 times
        if (aliveAround.length === 3) {
            if (!!!toBeBornCells.find(c => c[0] === y1 && c[1] === x1)) {
                toBeBornCells.push([y1, x1]);
            }
        }
        aliveAround.length = 0;
    }
}

function indexOutOfBounds(index, dim) {
    return index === -1 || index === dim;
}

function lookAround(x, y, dim, callback) {
    for (let i = y - 1; i <= y + 1; i++) {
        if (indexOutOfBounds(i, dim)) continue;
        for (let j = x - 1; j <= x + 1; j++) {
            if (!indexOutOfBounds(j, dim) && !(j === x && i === y)) {
                callback(j, i);
            }
        }
    }
}

//changes color of corresponding rows' elements to ALIVE_COLOR
function activateBornCells(cells, rows) {
    cells.forEach(c => makeCellAlive(rows[c[0]].children[c[1]]));
}

function deactivateDeadCells(cells, rows) {
    cells.forEach(c => makeCellDead(rows[c[0]].children[c[1]]));
}

//changes cell's color to ALIVE_COLOR
function makeCellAlive(cell) {
    setCellColor(cell, ALIVE_COLOR);
}

//changes cell's color to DEAD_COLOR
function makeCellDead(cell) {
    setCellColor(cell, DEAD_COLOR);
}

function setCellColor(cell, color) {
    cell.style.backgroundColor = color;
}

//checks whether a cell is alive
function cellIsAlive(cell) {
    return cell.style.backgroundColor === ALIVE_COLOR;
}