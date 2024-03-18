export class SeededRandom {
  private seed: bigint;

  constructor(seed: bigint) {
    this.seed = seed;
  }

  next(): number {
    // Parameters for a linear congruential generator
    const a = 1664525n;
    const c = 1013904223n;
    const m = 2n ** 32n;

    // Update the seed and return a pseudo-random value
    this.seed = (a * this.seed + c) % m;
    return Number(this.seed) / Number(m);
  }

  nextBool(): boolean {
    return this.next() > 0.5;
  }
}
