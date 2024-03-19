import { FPSTimer } from "../FPSTimer/FPSTimer";
import { IUniverse } from "../Universe/types";

const TICKS_PER_RENDER = 7;
export class UniverseRenderer {
  private readonly universe: IUniverse;
  private readonly canvas: HTMLCanvasElement;
  private readonly playPauseButton: HTMLButtonElement;
  private readonly ctx: CanvasRenderingContext2D | null;
  private animationId: number | null;
  private fpsTimer: FPSTimer;

  public static readonly CELL_SIZE = 1.1; // px
  public static readonly GRID_COLOR = "#CCCCCC";
  public static readonly DEAD_COLOR = "#FFFFFF";
  public static readonly ALIVE_COLOR = "#000000";

  constructor(universe: IUniverse, canvasId: string, private height: number, private width: number, playPauseButtonId: string, fpsTimer: FPSTimer) {
    this.universe = universe;
    const canvas = document.getElementById(canvasId) as HTMLCanvasElement | null;
    if (!canvas) {
      throw new Error(`Canvas with id ${canvasId} not found`);
    }
    this.canvas = canvas;
    this.addCanvasEvent();

    const button = document.getElementById(playPauseButtonId) as HTMLButtonElement | null;
    if (!button) {
      throw new Error(`Button with id ${playPauseButtonId} not found`);
    }
    this.playPauseButton = button;
    this.addButtonEvent();

    this.ctx = this.canvas.getContext('2d');

    this.canvas.height = (UniverseRenderer.CELL_SIZE + 1) * this.height + 1;
    this.canvas.width = (UniverseRenderer.CELL_SIZE + 1) * this.width + 1;

    this.animationId = null;

    this.fpsTimer = fpsTimer;
  }

  public renderLoop = () => {
    this.fpsTimer.render();
    this.accelerateTicks();
    this.drawGrid();
    this.drawCells();
    this.animationId = requestAnimationFrame(this.renderLoop);
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

    this.drawCellsWithColor(this.ctx, true, UniverseRenderer.ALIVE_COLOR);
    this.drawCellsWithColor(this.ctx, false, UniverseRenderer.DEAD_COLOR);

    this.ctx.stroke();
  }

  private drawCellsWithColor(ctx: CanvasRenderingContext2D, aliveStatus: boolean, colorString: string) {
    ctx.fillStyle = colorString;
    const height = this.universe.height();
    const width = this.universe.width();
    for (let row = 0; row < height; row++) {
      for (let col = 0; col < width; col++) {
        const idx = row * width + col;
        const alive = this.universe.cell_state(idx);
        if (alive !== aliveStatus) {
          continue;
        }

        ctx.fillRect(
          col * (UniverseRenderer.CELL_SIZE + 1) + 1,
          row * (UniverseRenderer.CELL_SIZE + 1) + 1,
          UniverseRenderer.CELL_SIZE,
          UniverseRenderer.CELL_SIZE
        );
      }
    }
  }

  public isPaused = () => this.animationId === null;

  play = () => {
    this.playPauseButton.textContent = "⏸";
    this.renderLoop();
  }

  pause = () => {
    this.playPauseButton.textContent = "▶";
    cancelAnimationFrame(this.animationId as number);
    this.animationId = null;
  }

  private addButtonEvent() {
    this.playPauseButton.addEventListener("click", (event) => {
      if (this.isPaused()) {
        this.play();
      } else {
        this.pause();
      }
    });
  }

  private addCanvasEvent() {
    this.canvas.addEventListener("click", event => {
      if (!this.isPaused()) {
        return;
      }

      const boundingRect = this.canvas.getBoundingClientRect();
    
      const scaleX = this.canvas.width / boundingRect.width;
      const scaleY = this.canvas.height / boundingRect.height;
    
      const canvasLeft = (event.clientX - boundingRect.left) * scaleX;
      const canvasTop = (event.clientY - boundingRect.top) * scaleY;
    
      const row = Math.min(Math.floor(canvasTop / (UniverseRenderer.CELL_SIZE + 1)), this.height - 1);
      const col = Math.min(Math.floor(canvasLeft / (UniverseRenderer.CELL_SIZE + 1)), this.width - 1);
    
      this.universe.toggle_cell(row, col);
    
      this.drawGrid();
      this.drawCells();
    });
  }

  private accelerateTicks() {
    for (let i = 0; i < TICKS_PER_RENDER; i++) {
      this.universe.tick();
    }
  }
}

export const initAndRunRenderer = (universe: IUniverse, canvasId: string, buttonId: string, height: number, width: number, fpsTimer: FPSTimer) => {
  const renderer = new UniverseRenderer(universe, canvasId, height, width, buttonId, fpsTimer);
  renderer.drawGrid();
  renderer.pause();
}