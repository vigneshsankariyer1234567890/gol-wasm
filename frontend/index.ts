import { Universe } from "gol_wasm/gol_wasm";
import { UniverseRenderer } from "./UniverseRenderer";

const HEIGHT = 100;
const WIDTH = 100;
const SEED = 123456789n;

const wasmUniverse = new Universe(HEIGHT, WIDTH, SEED);

const renderer = new UniverseRenderer(wasmUniverse, "gol-canvas-wasm", HEIGHT, WIDTH);

renderer.drawGrid();
renderer.drawCells();
requestAnimationFrame(renderer.renderLoop);