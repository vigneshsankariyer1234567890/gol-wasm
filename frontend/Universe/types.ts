export interface IUniverse {
  width(): number;
  height(): number;
  tick(): void;
  cell_state(index: number): boolean;
  toggle_cell(row: number, col: number): void;
}
