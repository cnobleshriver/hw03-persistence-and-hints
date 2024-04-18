import { scoring } from "./scoring.js";
// TASK #2: Import the Store class from the store.js file
import { Store } from "./store.js";

// Given shuffle algorithm for picking words in a bag
function shuffle(array) {
  // Fisher-Yates shuffle, used for random decoder cipher below
  let m = array.length;

  // While there remain elements to shuffle…
  while (m) {
    // Pick a remaining element…
    let i = Math.floor(Math.random() * m--);

    // And swap it with the current element.
    let t = array[m];
    array[m] = array[i];
    array[i] = t;
  }

  return array;
}

export class Game {
  // Private fields
  #bag; // The bag of tiles
  #grid; // The game board

  constructor() {
    // TASK #2: Initialize the game board and bag of tiles if they are not in
    //          the store, otherwise load them from the store.
    const store = Store.store();

    if (store.has("bag") && store.has("grid")) {
      this.#bag = store.get("bag");
      this.#grid = store.get("grid");
    } else {
      this.#bag = this.#initBag();
      this.#grid = this.#initGrid();
      store.set("bag", this.#bag);
      store.set("grid", this.#grid);
    }
  }

  #initBag() {
    const bag = [];

    // Initial frequencies of the letters in the bag
    const frequencies = {
      "*": 2,
      a: 9,
      b: 2,
      c: 2,
      d: 4,
      e: 12,
      f: 2,
      g: 3,
      h: 2,
      i: 9,
      j: 1,
      k: 1,
      l: 4,
      m: 2,
      n: 6,
      o: 8,
      p: 2,
      q: 1,
      r: 6,
      s: 4,
      t: 6,
      u: 4,
      v: 2,
      w: 2,
      x: 1,
      y: 2,
      z: 1,
    };

    for (let letter in frequencies) {
      for (let i = 0; i < frequencies[letter]; ++i) {
        bag.push(letter);
      }
    }

    return shuffle(bag);
  }

  #initGrid() {
    const grid = [];

    for (let i = 1; i <= 15; ++i) {
      grid[i] = [];
      for (let j = 1; j <= 15; ++j) {
        grid[i][j] = null;
      }
    }

    return grid;
  }

  reset() {
    // TASK #3: Reset the game board and bag of tiles, and save them to the
    // store.
    // Add your implementation here.
    this.#bag = this.#initBag();
    this.#grid = this.#initGrid();
    Store.store().set("bag", this.#bag);
    Store.store().set("grid", this.#grid);
  }

  /**
   * This function removes the first n tiles from the bag and returns them. If n
   * is greater than the number of remaining tiles, this removes and returns all
   * the tiles from the bag. If the bag is empty, this returns an empty array.
   * @param {number} n The number of tiles to take from the bag.
   * @returns {Array<string>} The first n tiles removed from the bag.
   */
  takeFromBag(n) {
    const drawn = [];

    for (let i = 0; i < n && this.#bag.length > 0; ++i) {
      drawn.push(this.#bag.pop());
    }
    // TASK #2: Save the updated bag to the store
    Store.store().set("bag", this.#bag);
    return drawn;
  }

  #canBePlacedOnBoard(word, position, direction) {
    // Check if the word can be placed on the board. If the position is out of
    // bounds, return false.
    if (
      position.x < 1 ||
      position.x > 15 ||
      position.y < 1 ||
      position.y > 15
    ) {
      return false;
    }

    const grid = this.#grid;
    const letters = word.split("");
    const placement = direction
      ? letters.map((letter, i) => grid[position.x + i][position.y] === null)
      : letters.map((letter, i) => grid[position.x][position.y + i] === null);

    return !placement.includes(false);
  }

  #placeOnBoard(word, position, direction) {
    const grid = this.#grid;
    const letters = word.split("");
    if (direction) {
      letters.forEach(
        (letter, i) => (grid[position.x + i][position.y] = letter),
      );
    } else {
      letters.forEach(
        (letter, i) => (grid[position.x][position.y + i] = letter),
      );
    }
    // TASK #2: Save the updated grid to the store
    Store.store().set("grid", this.#grid)
  }

  /**
   * This function will be called when a player takes a turn and attempts to
   * place a word on the board. It will check whether the word can be placed at
   * the given position. If not, it'll return -1. It will then compute the score
   * that the word will receive and return it, taking into account special
   * positions.
   *
   * @param {string} word The word to be placed.
   * @param {Object<x|y, number>} position The position, an object with
   * properties x and y. Example: { x: 2, y: 3 }.
   * @param {boolean} direction Set to true if horizontal, false if vertical.
   * @returns {number} The score the word will obtain (including special tiles),
   * or -1 if the word cannot be placed.
   */
  playAt(word, position, direction) {
    // We first check if the word can be placed
    if (!this.#canBePlacedOnBoard(word, position, direction)) {
      return -1;
    }

    // Place the word on the board
    this.#placeOnBoard(word, position, direction);

    // Compute the score
    return scoring.score(word, position, direction);
  }

  render(element) {
    element.innerHTML = "";

    for (let i = 1; i <= 15; ++i) {
      for (let j = 1; j <= 15; ++j) {
        const div = document.createElement("div");
        div.classList.add("grid-item");
        div.innerText = this.#grid[i][j] === null ? "" : this.#grid[i][j];

        const label = scoring.label(i, j);
        if (label !== "") {
          div.classList.add(label);
        }

        element.appendChild(div);
      }
    }
  }

  // These functions are used by the auto-grader to check your implementation.
  // You can ignore them as part of the rest of the implementation, but feel
  // free to use them for your own testing purposes.
  testGetBag() {
    return this.#bag;
  }

  testGetGrid() {
    return this.#grid;
  }

  testCanBePlacedOnBoard(word, position, direction) {
    return this.#canBePlacedOnBoard(word, position, direction);
  }

  testPlaceOnBoard(word, position, direction) {
    this.#placeOnBoard(word, position, direction);
  }
}
