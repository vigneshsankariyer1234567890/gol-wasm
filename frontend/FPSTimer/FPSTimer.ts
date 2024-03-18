export class FPSTimer {
  private fpsElement: HTMLDivElement;
  private frames: number[];
  private lastFrameTimeStamp: number;

  constructor(fpsId: string) {
    const fpsElement = document.getElementById(fpsId) as HTMLDivElement;
    if (!fpsElement) {
      throw new Error(`FPS Timer with id ${fpsId} not found`);
    }
    this.fpsElement = fpsElement;
    this.frames = [];
    this.lastFrameTimeStamp = performance.now();
  }

  render() {
    const now = performance.now();
    const delta = now - this.lastFrameTimeStamp;
    this.lastFrameTimeStamp = now;
    const fps = 1 / delta * 1000;

    this.frames.push(fps);
    if (this.frames.length > 100) {
      this.frames.shift();
    }

    let min = Infinity;
    let max = -Infinity;
    let sum = 0;
    for (let i = 0; i < this.frames.length; i++) {
      sum += this.frames[i];
      min = Math.min(this.frames[i], min);
      max = Math.max(this.frames[i], max);
    }
    let mean = sum / this.frames.length;

    this.fpsElement.textContent = `
    Frames per Second:
             latest = ${Math.round(fps)}
    avg of last 100 = ${Math.round(mean)}
    min of last 100 = ${Math.round(min)}
    max of last 100 = ${Math.round(max)}
    `.trim();
  }
}