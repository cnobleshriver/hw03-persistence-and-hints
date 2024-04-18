import { Game } from "./game.js";
// TASK #5: Import the Rack class from the rack.js file.
import { Rack } from "./rack.js";
// TASK #6: Import the scrabbleUtils module from the scrabbleUtils.js
// file.
import { canConstructWord, isValid, constructWord } from "./scrabbleUtils.js";

// UI Components
const boardGridElement = document.getElementById("board");
const playButtonElement = document.getElementById("play");
// TASK #3: Get the reset button element from the DOM.
// Add your implementation here.
const resetButtonElement = document.getElementById("reset");

// TASK #5 Part 3: Get the rack element from the DOM.
// - Get the rack element from the DOM and store it in a variable named
//   `rackElement`.
// - The rack element has an id of 'rack'.
// - Use the `getElementById` method to get the rack element.
const rackElement = document.getElementById("rack");

// TASK #7 (Step 3): Get the help button element from the DOM.
// - Get the help button from the DOM and store it in a variable named
//   `helpButtonElement`.
// - The button element has an id of 'help'.
// - Use the `getElementById` method to get the help button element.

// Game Board
const game = new Game();

// TASK #5 Part 3: Create a new instance of the Rack class.
// - Create a new instance of the Rack class and store it in a variable named `rack`.
// - Take 7 tiles from the game bag and add them to the rack.
// - Render the rack to the rackElement.
const rack = new Rack();
rack.takeFromBag(7, game);
rack.render(rackElement);


game.render(boardGridElement);

// We check to make sure the play button exists before adding the event
// listener. You are to add the play button as part of this homework. If we do
// not test if it exists, the code will break when running the tests. You can
// safely remove this conditional after you add the play button.
if (playButtonElement) {
  playButtonElement.addEventListener("click", () => {
    // Get the DOM elements representing the UI components.
    const wordElement = document.getElementById("word");
    const xElement = document.getElementById("x");
    const yElement = document.getElementById("y");
    const directionElement = document.getElementById("direction");

    // Get the values from the UI components.
    const word = wordElement.value;
    const x = parseInt(xElement.value);
    const y = parseInt(yElement.value);
    const direction = directionElement.value === "horizontal";

    // TASK #6 (Step 1): Check if the word can be constructed from the available tiles
    // - Check if the word can be constructed from the available tiles using the
    //   `canConstructWord` function from the `scrabbleUtils` module.
    // - If the word cannot be constructed from the available tiles, display an
    //   alert message with the following text: `The word "<word>" cannot be
    //   constructed from the available tiles.` where `<word>` is the word that
    //   was entered.
    // - If the word can be constructed from the available tiles, continue to
    //   the next step; otherwise return.
    if (!canConstructWord(rack.getAvailableTiles(), word)) {
      alert(`The word "${word}" cannot be constructed from the available tiles.`);
      return;
    }

    // TASK #6 (Step 2): Check if the word is valid
    // - Check if the word is a valid word using the `isValid` function from the
    //   `scrabbleUtils` module.
    // - If the word is not valid, display an alert message with the following
    //   text: `"<word>" is not a valid word.` where `<word>` is the word that
    //   was entered.
    // - If the word is valid, continue to the next step; otherwise return
    //
    // Modify this assignment by following the instructions above
    if (!isValid(word)) {
      alert(`"${word}" is not a valid word.`);
      return;
    }
    const validWord = word;

    // Try to play the word on the board.
    const result = game.playAt(validWord, { x, y }, direction);
    if (result === -1) {
      alert(
        `The word cannot be placed in a ${directionElement.value} position at coordinates(${x}), ${y}).`,
      );
      return;
    }

    // TASK #6 (Step 3): Construct the word from the available tiles
    // - Construct the word from the available tiles using the `constructWord`
    //   function from the `scrabbleUtils` module.
    // - The `constructWord` function takes an array of available tiles and a
    //   word as arguments and returns an array of tiles that can be used to
    //   construct the word.
    // - Store the result in a variable named `playableWord`.
    const playableWord = constructWord(rack.getAvailableTiles(), word);
    let n = playableWord.length;
    for (let i = 0; i < n; i++) {
      rack.removeTile(playableWord[i]);
    }
    rack.takeFromBag(n, game);
    rack.render(rackElement);

    game.render(boardGridElement);
    // TASK #6 (Step 4): Update the UI elements
    // - Clear the word, x, and y input elements.
    document.getElementById("word").value = "";
    document.getElementById("x").value = "";
    document.getElementById("y").value = "";

    // TASK #7 (Step 5): Clear the hint UI element
    // - Clear the hint display UI element (ID is 'hint')
  });
} else {
  throw new Error("Could not find play button");
}

// TASK #3: Add an event listener to the reset button to reset the game board.
//
// Add your implementation here:
resetButtonElement.addEventListener("click", () => {
  game.reset();
  game.render(boardGridElement);
});

// TASK #7 (Step 4): Add an event listener to the help button to get a hint.
//
// This event listener responds to clicks on the "Help" button. Upon clicking:
// 1. It calls `utils.bestPossibleWords` with the current tiles from the
//    player's rack to get an array of possible words to play.
// 2. A random word is selected from these possibilities to serve as a hint.
// 3. The hint is then displayed by updating the innerText of the element with
//    the ID 'hint'.
//
// Add your implementation here:
