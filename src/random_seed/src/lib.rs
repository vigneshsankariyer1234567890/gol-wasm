use rand::{Rng, SeedableRng};
use rand::rngs::StdRng;

pub struct SeededRandom {
    rng: StdRng,
}

impl SeededRandom {
    pub fn new(seed: u64) -> Self {
        let rng = StdRng::seed_from_u64(seed);
        SeededRandom { rng }
    }

    pub fn random_bool(&mut self) -> bool {
        self.rng.gen_bool(0.5)
    }
}
