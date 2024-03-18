mod utils;

use wasm_bindgen::prelude::*;
use std::fmt;
use random_seed::SeededRandom;

// Single byte representation here needed.
// As we go along, we may need to edit this to include other information as well
#[wasm_bindgen]
#[repr(u8)]
#[derive(Clone, Copy, Debug, PartialEq, Eq)]
pub enum Cell {
    Dead = 0,
    Alive = 1,
}

#[wasm_bindgen]
pub struct Universe {
    width: u32,
    height: u32,
    cells: Vec<Cell>,
}

#[wasm_bindgen]
impl Universe {
  fn get_index(&self, row: u32, column: u32) -> usize {
    (row * self.width + column) as usize
  }

  fn get_live_neighbour_count(&self, row: u32, column: u32) -> u8 {
    let mut count = 0;
    for delta_row in [self.height - 1, 0, 1].iter().cloned() {
      for delta_col in [self.width - 1, 0, 1].iter().cloned() {
        if delta_row == 0 && delta_col == 0 {
          continue;
        }

        let neighbor_row = (row + delta_row) % self.height;
        let neighbor_col = (column + delta_col) % self.width;
        let idx = self.get_index(neighbor_row, neighbor_col);
        count += self.cells[idx] as u8;
      }
    }
    count
  }

  // TODO: Think of a better way to read and input rules
  // and then saving it somehow
  // TODO: Use threads to parallelize calculation of next cells
  pub fn tick(&mut self) {
    let mut next = self.cells.clone();

    for row in 0..self.height {
        for col in 0..self.width {
            let idx = self.get_index(row, col);
            let cell = self.cells[idx];
            let live_neighbors = self.get_live_neighbour_count(row, col);

            let next_cell = match (cell, live_neighbors) {
                (Cell::Alive, x) if x < 2 => Cell::Dead,
                (Cell::Alive, 2) | (Cell::Alive, 3) => Cell::Alive,
                (Cell::Alive, x) if x > 3 => Cell::Dead,
                (Cell::Dead, 3) => Cell::Alive,
                (otherwise, _) => otherwise,
            };

            next[idx] = next_cell;
        }
    }

    self.cells = next;
  }

  #[wasm_bindgen(constructor)]
  pub fn new(height: u32, width: u32, seed: u64) -> Universe {
    let mut random = SeededRandom::new(seed);

    let cells = (0..width * height)
      .map(|_| {
        if random.random_bool() {
          Cell::Alive
        } else {
          Cell::Dead
        }
      })
      .collect();

    Universe {
      width,
      height,
      cells
    }
  }

  pub fn render(&self) -> String {
    self.to_string()
  }

  pub fn width(&self) -> u32 {
    self.width
  }

  pub fn height(&self) -> u32 {
      self.height
  }

  pub fn cells(&self) -> *const Cell {
      self.cells.as_ptr()
  }
}

impl fmt::Display for Universe {
  fn fmt(&self, f: &mut fmt::Formatter) -> fmt::Result {
      for line in self.cells.as_slice().chunks(self.width as usize) {
          for &cell in line {
              let symbol = if cell == Cell::Dead { '◻' } else { '◼' };
              write!(f, "{}", symbol)?;
          }
          write!(f, "\n")?;
      }

      Ok(())
  }
}