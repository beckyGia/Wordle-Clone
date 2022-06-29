import { WORDS } from "./words.js";

//By convention, the constant identifiers are in uppercase.
const NUMBER_OF_GUESSES = 6;
let guessesRemaining = NUMBER_OF_GUESSES;

//We will be putting the word that we are guessing as its being guessed for currentGuess, each letter will be putting here as an array
let currentGuess = [];

//nextLetter is the index of an array, starting at 0 and it will change based on how many letters are in a given guess
let nextLetter = 0;

//look at the word list (thousands of words), each time our user initializes the game, it will choose a random word from that list as the answer.  look at the giant Array called Words and inside that a array, we want to choose a random number.
let rightGuessString = WORDS[Math.floor(Math.random() * WORDS.length)];

console.log(rightGuessString);

// let guessedWord = rightGuessString;

function initBoard() {
  let board = document.getElementById("game-board");

  // This outer loop creates a row
  for (let i = 0; i < NUMBER_OF_GUESSES; i++) {
    let row = document.createElement("div");
    row.className = "letter-row";

    //The inner loop creates the individual (5) boxes
    for (let j = 0; j < 5; j++) {
      let box = document.createElement("div");
      box.className = "letter-box";

      //essentially making sure each box sits inside the row they are in (adds it to the end of the parent node which is the row)
      row.appendChild(box);
    }

    //Adds the rows with boxes to the game board (adds it to the end of the parent node which is the board)
    board.appendChild(row);
  }
}

//in the function we are passing the in as parameters the letter we want to shade and the color we want to shade it.
function shadeKeyBoard(letter, color) {
  //for everything with the class name of keyboard-button, we are looping through them to figure out what color to make it
  for (const elem of document.getElementsByClassName("keyboard-button")) {
    //does the content of that keyboard button match the letter that we are passing through
    if (elem.textContent === letter) {
      //first we have to figure out does it already have a color by grabbing the current background color
      let oldColor = elem.style.backgroundColor;

      //if its already green, then just return
      if (oldColor === "green") {
        return;
      }

      //if the old color is already yellow and the color we are passing through is not green, then return
      if (oldColor === "yellow" && color !== "green") {
        return;
      }

      //for every other scenario, the backgrounf color becomes the color, that is pass through as an argument
      elem.style.backgroundColor = color;
      elem.style.color = "black";
      break;
    }
  }
}

//deleteLetter gets the correct row, finds the last box and empties it, and then resets the nextLetter counter.
function deleteLetter() {
  //we are specifying the row that we are supposed to be on
  let row = document.getElementsByClassName("letter-row")[6 - guessesRemaining];

  //it is nextLetter - 1 because we don't want the next empty box, we want the last filled box, so we can remove the letter fromm it
  let box = row.children[nextLetter - 1];

  //we remove the value of the last filled box
  box.textContent = "";

  //remove the class of filled-box making sure we know its empty
  box.classList.remove("filled-box");

  //remove the last added letter
  currentGuess.pop();

  //go back an index so we can make sure all the boxes are filled and there is no empty boxes
  nextLetter -= 1;
}

function checkGuess() {
  let row = document.getElementsByClassName("letter-row")[6 - guessesRemaining];

  //this is where we place the string of the guessed word
  let guessString = "";

  //creating an array from the random word that we generated
  let rightGuess = Array.from(rightGuessString);

  //for loop for arrays, where currentGuess is our array that contains our guess, we loop through it and convert it into a string.  We concatenate each letter as we loop through into the empty string of guessString
  for (const val of currentGuess) {
    guessString += val;
  }

  //This is if the length of the guessString does not equal 5, meaning it is less than 5 letters in length, then you will be alerted that it is not enough letters
  if (guessString.length != 5) {
    toastr.error("Not enough letters!");
    return;
  }

  //If the word that is inside guessString is not in list of Words in WORDS, then you will be alerted that that word is not included in the list
  if (!WORDS.includes(guessString)) {
    toastr.error("Word not in list");
    return;
  }

  //The following is what happens when you enter a valid word meaning the word is in the list and is five letters long.

  for (let i = 0; i < 5; i++) {
    //the color the box will change to depending on whether it is part of the word or not
    let letterColor = "";

    //we are selecting the individual boxes from the row
    let box = row.children[i];

    //we are selecting each individual letter depending on the loop cycle
    let letter = currentGuess[i];

    //we are checking the position of the letter to see if it matches up with the position of the letter in the correct word that is in the word list (checking to see if the letter is inside the correct guess)
    //look inside rightGuess and return the indexOf the letter inside currentGuess and if valid will return an index from 0 to 4.
    let letterPosition = rightGuess.indexOf(currentGuess[i]);

    //is letter in the correct guess
    //letterPosition === -1 means that the letter is not in word let alone in the wrong position.
    if (letterPosition === -1) {
      //meaning the letter is not in the word
      letterColor = "grey";
    } else {
      //now, letter is definitely in the word
      //if letter (currentGuess[i]) index and right guess index are the same then letter is in the right position
      if (currentGuess[i] === rightGuess[i]) {
        //shade box green
        letterColor = "green";
      } else {
        //shade box yellow
        letterColor = "yellow";
      }
      //resets the index?
      rightGuess[letterPosition] = "#";
    }

    //this is the syntax for setTimeout: setTimeout(function, milliseconds);

    //we are setting the delay based on the index so the higher the index, the longer the delay so the an index of 0 would be the fastest
    let delay = 250 * i;

    //creating an anonymous function in the setTimeout that changes the styling of the box
    setTimeout(() => {
      //flip box
      animateCSS(box, "flipInX");
      //shade box
      box.style.backgroundColor = letterColor;
      //change text color from white to black
      box.style.color = "black";

      //this another function that we have not defined yet, that will also shade the onscreen keyboard
      shadeKeyBoard(letter, letterColor);
    }, delay);
  }

  //this if statement identfies whether or not you have the correct word and if you do, it will tell you and if not the you get one less guess, the currentGuess is not an empty array again and the nextLetter is 0.
  if (guessString === rightGuessString) {
    toastr.success("You guessed right! Game Over!");
    guessesRemaining = 0;
    return;
  } else {
    guessesRemaining -= 1;
    currentGuess = [];
    nextLetter = 0;

    //if you have run out of guesses, it will let you know that game is over and tell you what the correct word was
    if (guessesRemaining === 0) {
      toastr.error("You've run out of guesses! Game Over!");
      toastr.info(`The right word was: "${rightGuessString}"`);
    }
  }
}

//function that displays the pressed key in the boxes.  insertLetter checks that there's still space in the guess for this letter, finds the appropriate row, and puts the letter in the box.
function insertLetter(pressedKey) {
  //checks if we are at the end of the row.  nextLetter starts at an index of zero because its an array so if its 5, that means it filled up so there are no empty boxes in that row
  if (nextLetter === 5) {
    return;
  }

  pressedKey = pressedKey.toLowerCase();

  //we are specifying the row that we grab (trying to grab the first current empty row) using bracket notation
  let row = document.getElementsByClassName("letter-row")[6 - guessesRemaining];

  //The children property returns a collection of an element's child elements that return an HTMLCollection which is an array like collection
  //specifying which box we are grabbing
  //remember nextLetter is an array that tracks how far along the row we are, want to insert a letter into the next empty box
  let box = row.children[nextLetter];

  animateCSS(box, "pulse");
  //the pressedkey content will show up in the box
  box.textContent = pressedKey;

  //adding a class called filled-box once a letter in place inside the box
  box.classList.add("filled-box");

  //currentGuess is an array where we placed the guessed letter into it, so we place the value of pressedkey
  currentGuess.push(pressedKey);

  //after the letter is inserted into a box, we need to move on to the next box
  nextLetter += 1;
}

//The function returns a promise to allow you to perform actions that need to run only after the animation ends
const animateCSS = (element, animation, prefix = "animate__") =>
  // We create a Promise and return it
  new Promise((resolve, reject) => {
    const animationName = `${prefix}${animation}`;
    // const node = document.querySelector(element);
    const node = element;
    node.style.setProperty("--animate-duration", "0.3s");

    node.classList.add(`${prefix}animated`, animationName);

    // When the animation ends, we clean the classes and resolve the Promise
    function handleAnimationEnd(event) {
      event.stopPropagation();
      node.classList.remove(`${prefix}animated`, animationName);
      resolve("Animation ended");
    }

    node.addEventListener("animationend", handleAnimationEnd, { once: true });
  });

document.addEventListener("keyup", (e) => {
  //type after they run out of guesses
  if (guessesRemaining === 0) {
    return;
  }

  //The e.key or event.key is a property of the event object that is created when the keyup or keydown event is fired.

  //pressedkey is parsing the key that they pressed into a string
  let pressedKey = String(e.key);

  //this is saying if they hit the backspace key and there is still letters on the board to erase then the deleteLetter function runs (essentially if they are not at the beginning of that row)
  if (pressedKey === "Backspace" && nextLetter !== 0) {
    deleteLetter();
    return;
  }

  //if they hit the enter key, then the checkGuess function runs
  if (pressedKey === "Enter") {
    checkGuess();
    return;
  }

  //found is making sure that the key that was pressed is a letter from a to z
  let found = pressedKey.match(/[a-z]/gi);

  //this is saying that if the key pressed is not a letter from a to z or nothing was pressed, then nothing happens else they insert the letter that was pressed if its a letter from a to z
  if (!found || found.length > 1) {
    return;
  } else {
    insertLetter(pressedKey);
  }
});

//To get your on-screen keyboard functioning
//listening for an event listener
document.getElementById("keyboard-cont").addEventListener("click", (e) => {
  //identify what they just clicked
  const target = e.target;

  //if what they click does not contain a class of keyword-button, then we return
  if (!target.classList.contains("keyboard-button")) {
    return;
  }

  //if it does contain the class, then we grab the textcontent of the keyboard button
  let key = target.textContent;

  //We are saying that if the key is Del, it is the same as Backspace, which we have already defined earlier as to what happens.
  if (key === "Del") {
    key = "Backspace";
  }

  //we are mimicing that we hit the same button on the keyboard as we did on the onscreen board

  //dispatchEvent is what you call if you want to send or trigger an event AND is the last step to firing an event. we are creating a new keyboard event

  //KeyboardEvent objects describe a user interaction with the keyboard; each event describes a single interaction between the user and a key (or combination of a key with modifier keys) on the keyboard.

  //The KeyboardEvent() constructor creates a new KeyboardEvent object.  the syntax: new KeyboardEvent(type, options)

  //type: A string with the name of the event. It is case-sensitive and browsers set it to keydown, keyup, or keypress.

  //An object that, in addition of the properties defined in UIEvent(), can have the following properties:

  //key Optional - A string, defaulting to "", that sets the value of KeyboardEvent.key.

  //The KeyboardEvent interface's key read-only property returns the value of the key pressed by the user, taking into consideration the state of modifier keys such as Shift as well as the keyboard locale and layout

  //The keyup event is fired when a key is released.
  document.dispatchEvent(new KeyboardEvent("keyup", { key: key }));
});

initBoard();
