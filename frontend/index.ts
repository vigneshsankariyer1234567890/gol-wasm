import { Universe as WasmUniverse } from "gol_wasm/gol_wasm";
import { Universe as TsUniverse } from "./Universe/Universe";
import { initAndRunRenderer } from "./UniverseRenderer/UniverseRenderer";
import { FPSTimer } from "./FPSTimer/FPSTimer";

const HEIGHT = 250;
const WIDTH = 250;
const SEED = 987654321n;

const wasmUniverse = new WasmUniverse(HEIGHT, WIDTH, SEED);
const tsUniverse = new TsUniverse(HEIGHT, WIDTH, SEED);

const wasmTimer = new FPSTimer("fps-wasm");
const tsTimer = new FPSTimer("fps-ts");

initAndRunRenderer(wasmUniverse, "gol-canvas-wasm", "play-pause-wasm", HEIGHT, WIDTH, wasmTimer);
initAndRunRenderer(tsUniverse, "gol-canvas-ts", "play-pause-ts", HEIGHT, WIDTH, tsTimer);