export interface IUniverse {
  width(): number;
  height(): number;
  tick(): void;
  cell_state(index: number): boolean;
}
