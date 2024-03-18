import { Universe as WasmUniverse } from "gol_wasm/gol_wasm";
import { Universe as TsUniverse } from "./Universe/Universe";
import { initAndRunRenderer } from "./UniverseRenderer/UniverseRenderer";

const HEIGHT = 400;
const WIDTH = 400;
const SEED = 123456789n;

const wasmUniverse = new WasmUniverse(HEIGHT, WIDTH, SEED);
const tsUniverse = new TsUniverse(HEIGHT, WIDTH, SEED);

initAndRunRenderer(wasmUniverse, "gol-canvas-wasm", HEIGHT, WIDTH);
initAndRunRenderer(tsUniverse, "gol-canvas-ts", HEIGHT, WIDTH);