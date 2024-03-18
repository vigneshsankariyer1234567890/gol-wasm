export interface IUniverse {
  render(): string;
  width(): number;
  height(): number;
  cells(): number;
  tick(): void;
  cell_state(index: number): boolean;
}

export class UniverseRenderer {
  private readonly universe: IUniverse;
  private readonly canvas: HTMLCanvasElement;
  private readonly ctx: CanvasRenderingContext2D | null;

  public static readonly CELL_SIZE = 5; // px
  public static readonly GRID_COLOR = "#CCCCCC";
  public static readonly DEAD_COLOR = "#FFFFFF";
  public static readonly ALIVE_COLOR = "#000000";

  constructor(universe: IUniverse, canvasId: string, private height: number, private width: number) {
    this.universe = universe;
    const canvas = document.getElementById(canvasId) as HTMLCanvasElement | null;
    if (!canvas) {
      throw new Error(`Canvas with id ${canvasId} not found`);
    }
    this.canvas = canvas;
    this.ctx = this.canvas.getContext('2d');

    this.canvas.height = (UniverseRenderer.CELL_SIZE + 1) * this.height + 1;
    this.canvas.width = (UniverseRenderer.CELL_SIZE + 1) * this.width + 1;

    this.drawGrid();
    this.drawCells();
    requestAnimationFrame(this.renderLoop);
  }

  public renderLoop = () => {
    this.universe.tick();
    this.drawCells();
    requestAnimationFrame(this.renderLoop);
  };

  public drawGrid() {
    if (!this.ctx) return;

    this.ctx.beginPath();
    this.ctx.strokeStyle = UniverseRenderer.GRID_COLOR;

    // Vertical lines
    for (let i = 0; i <= this.width; i++) {
      this.ctx.moveTo(i * (UniverseRenderer.CELL_SIZE + 1) + 1, 0);
      this.ctx.lineTo(i * (UniverseRenderer.CELL_SIZE + 1) + 1, (UniverseRenderer.CELL_SIZE + 1) * this.height + 1);
    }

    // Horizontal lines
    for (let j = 0; j <= this.height; j++) {
      this.ctx.moveTo(0, j * (UniverseRenderer.CELL_SIZE + 1) + 1);
      this.ctx.lineTo((UniverseRenderer.CELL_SIZE + 1) * this.width + 1, j * (UniverseRenderer.CELL_SIZE + 1) + 1);
    }

    this.ctx.stroke();
  }

  public drawCells() {
    if (!this.ctx) return;

    this.ctx.beginPath();

    for (let row = 0; row < this.universe.height(); row++) {
      for (let col = 0; col < this.universe.width(); col++) {
        const idx = row * this.universe.width() + col;
        const alive = this.universe.cell_state(idx);

        this.ctx.fillStyle = alive ? UniverseRenderer.ALIVE_COLOR : UniverseRenderer.DEAD_COLOR;
        this.ctx.fillRect(
          col * (UniverseRenderer.CELL_SIZE + 1) + 1,
          row * (UniverseRenderer.CELL_SIZE + 1) + 1,
          UniverseRenderer.CELL_SIZE,
          UniverseRenderer.CELL_SIZE
        );
      }
    }

    this.ctx.stroke();
  }
}