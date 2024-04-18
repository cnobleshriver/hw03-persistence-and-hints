// TASK #8: Import the Store class from the store.js file.

/**
 * Represents a rack of tiles for the game of Scrabble.
 */
export class Rack {
  /**
   * Constructs a new Rack instance.
   */
  constructor() {
    /**
     * An object to keep track of available tiles. The keys are the letters of
     * the tiles, and the values are the number of those tiles available.
     * @type {Object.<string, number>}
     */
    this.available = {};

    /**
     * The total number of tiles available on the rack.
     * @type {number}
     */
    this.count = Object.values(this.available).reduce(
      (acc, val) => acc + val,
      0,
    );
  }

  /**
   * Retrieves the currently available tiles on the rack.
   * @returns {Object.<string, number>} The available tiles.
   */
  getAvailableTiles() {
    // Return a copy of the available tiles to prevent the original object from
    // being modified.
    return { ...this.available };
  }

  /**
   * Renders the current state of the rack to a specified DOM element. Each tile
   * is represented as a div element with the class `grid-item` and text content
   * set to the letter of the tile.
   * @param {Element} element - The DOM element to render the tiles into.
   */
  render(element) {
    // TASK #5 Part 1: Implement the render method
    //
    // Basic Algorithm:
    // - Clear the content of the element.
    // - Iterate over the available tiles.
    //   - For each tile, create a new div element.
    //     - Add the class 'grid-item' to the div.
    //     - Set the text content of the div to the letter of the tile.
    //   - Append the div to the specified element.
    //
    // Hints:
    // - You can clear the content of an element by setting its innerHTML to an
    //   empty string.
    // - You can create a new div element using document.createElement('div').
    // - You can add a class to an element using the classList property.
    // - You can set the text content of an element using the innerText
    //   property.
    // - You can append a child element to a parent element using the
    //   appendChild method.
    element.innerHTML = "";
    let tiles = this.getAvailableTiles();
    for (let letter in tiles) {
      let count = tiles[letter];
      for (let i = 0; i < count; i++) {
        let div = document.createElement('div');
        div.classList.add("grid-item");
        div.innerText = letter;
        element.appendChild(div);
      }
    }
  }

  /**
   * Attempts to remove a single tile from the rack.
   * @param {string} tile - The tile to remove.
   * @returns {boolean} True if the tile was successfully removed, false
   * otherwise.
   */
  removeTile(tile) {
    // TASK #5 Part 2: Implement the removeTile method
    //
    // Basic Algorithm:
    // - Check if the tile is available in the rack.
    //   - If the tile is not available, return false.
    //   - If the tile is available, decrement the count of the tile.
    //     - If the count reaches zero, remove the tile from the available
    //       tiles.
    // - Return true.
    let tiles = this.getAvailableTiles();
    if (tile in tiles) {
      if (tiles[tile] === 1) {
        delete this.available[tile];
      } else {
        this.available[tile] -= 1;
      }
    } else {
      return false;
    }
    return true;
  }

  /**
   * Takes tiles from the game bag and adds them to the available tiles on the
   * rack.
   * @param {number} n - The number of tiles to take from the bag.
   * @param {Object} game - The game instance from which to take tiles.
   */
  takeFromBag(n, game) {
    if (this.count === 7) {
      return;
    }

    for (let tile of game.takeFromBag(n)) {
      if (tile in this.available) {
        ++this.available[tile];
      } else {
        this.available[tile] = 1;
      }
    }
    // TASK #8: Store the updated rack in the local storage
  }

  /**
   * Resets the rack to its initial state.
   */
  reset() {
    this.available = {};
    this.count = 0;
    // TASK #8: Remove the rack from the local storage
  }
}
