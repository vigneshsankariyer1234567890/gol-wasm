import { SeededRandom } from "../SeededRandom/SeededRandom";
import { IUniverse } from "./types";

const DELTA_DIR_ARRAY = [-1, 0, 1];

const liveNeighboursRules = (cell: boolean, liveNeighbours: number) => {
  if (cell && (liveNeighbours >= 2 && liveNeighbours <= 3)) {
    return true;
  }

  if (!cell && liveNeighbours === 3) {
    return true;
  }

  return false;
}

export class Universe implements IUniverse {
  private curr_width: number;
  private curr_height: number;
  private readonly randomMachine: SeededRandom;
  private curr_cells: boolean[];

  constructor(height: number, width: number, seed: bigint) {
    this.curr_width = width;
    this.curr_height = height;
    this.randomMachine = new SeededRandom(seed);
    const size = Math.ceil((width * height) / 8);
    this.curr_cells = new Array(width * height).fill(false);

    this.randomizeCells();
  }
  toggle_cell(row: number, col: number): void {
    const idx = this.getIndex(row, col);
    this.curr_cells[idx] = !this.curr_cells[idx];
  }
  width(): number {
    return this.curr_width;
  }
  height(): number {
    return this.curr_height;
  }
  tick(): void {
    let new_cells = Array.from(this.curr_cells);

    for (let row = 0; row < this.curr_height; row++) {
      for (let col = 0; col < this.curr_width; col++) {
        const idx = this.getIndex(row, col);
        const cell = this.curr_cells[idx];
        const liveNeighbours = this.getLiveNeighbourCount(row, col);
        new_cells[idx] = liveNeighboursRules(cell, liveNeighbours);
      }
    }

    this.curr_cells = new_cells;
  }
  cell_state(index: number): boolean {
    return this.curr_cells[index];
  }
  private randomizeCells() {
    this.curr_cells = this.curr_cells.map(() => this.randomMachine.next() > 0.5)
  }
  private getIndex(row: number, column: number) {
    return row * this.curr_width + column;
  }
  private getLiveNeighbourCount(row: number, column: number) {
    let count = 0;

    for (const deltaRow of DELTA_DIR_ARRAY) {
      for (const deltaCol of DELTA_DIR_ARRAY) {
        if (deltaRow === 0 && deltaCol === 0) {
          continue;
        }

        const neighbor_row = (row + deltaRow) % this.curr_height;
        const neighbor_col = (column + deltaCol) % this.curr_width;
        if (this.cell_state(this.getIndex(neighbor_row, neighbor_col))) {
          count += 1
        }
      }
    }

    return count;
  }
}