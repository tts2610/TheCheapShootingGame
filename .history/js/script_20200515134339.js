// FOR NEW GAME EFFECT
let canvas = document.getElementById("myCanvas");
let inputDiv = document.getElementById("inputDiv");
let startGameBtn = document.getElementById("startGameBtn");

// VARIABLE FOR CALCULATE
let historyBox = [];
let bestScores = [];
let previousRecord = [];
let guess = 5;
let second = 20;
let randomNumber = Math.floor(Math.random() * 100) + 1;
let timer;

// USER INPUT
// let input = document.getElementById("guessInput");

// LEFT BOXES
let guessHistory = document.getElementById("guessHistory");
let ranking = document.getElementById("ranking");
let previousRound = document.getElementById("previousRound");

// RIGHT BOXES
let secondRemaining = document.getElementById("secondRemaining");
let liveRemaining = document.getElementById("liveRemaining");
// let finalResult = document.getElementById("finalResult");

// BUTTONS
// let guessBtn = document.getElementById("guessBtn");
// let resetBtn = document.getElementById("resetBtn");


// TOASTER + TOASTER OUTPUT
let toaster = document.getElementById("toast-container");
let prompts = { 1: "Too Low!", 2: "Too High!", 3: "You already input that number!", 4: "Better luck next time!", 5: "Great Job!", 6: "Please input your number!" }


// =========== MAIN ============ 

// ENTER KEY PRESSED
// $(document).keypress(function(e) {
//     if (e.which == 13) {
//         $("#guessBtn").click();
//     }
// });

$(document).ready(function() {
    canvas.style.display = "none";
    // input.disabled = true;
    // guessBtn.disabled = true;
    // resetBtn.disabled = true;
});

// NEW-GAME BUTTON PRESSED
function startGame() {
    window.scroll(0, 0);
    toaster.innerHTML = ""
        // secondRemaining.innerHTML = second;
        // timecounting();
        // guessRemaining.textContent = guess;
    loadImages();
    setupKeyboardListeners();
    main();
    displayDiv();
    // enableOrDisableBtn();
    // autoFocus();
}


// GUESS BUTTON PRESSED
function guessSubmit() {
    // if (guessBtn.disabled) return;
    // else if (input.value == '' && !guessBtn.disabled) {
    //     createAlert(6);
    //     return;
    // }
    let result = getResult();
    createAlert(result);

    if ([4, 5].includes(result)) {
        resetToDefault();
        enableOrDisableBtn();
        displayDiv();
        insertPreviousRecord();
    }
    bestScores.sort((a, b) => (a.guessRemain > b.guessRemain) ? -1 : 1);
    guessHistory.innerHTML = "";
    historyBox.forEach(element => {
        var p = document.createElement("p");
        var img = document.createElement("img")
        img.src = "img/dice.png";
        img.width = 60;
        img.height = 60;
        var textnode = document.createTextNode(element); // Create a text node
        p.appendChild(img);
        p.appendChild(textnode);
        guessHistory.append(p);
    });

    if (result == 5) {
        ranking.innerHTML = "";
        bestScores.forEach((element, i) => {
            if (i == 3) {
                return;
            }
            var p = document.createElement("div");
            p.className = "mt-3 mx-4";
            var img = document.createElement("img")
            img.src = "img/" + ++i + ".png";
            img.width = 64;
            img.height = 64;
            var textnode = document.createTextNode("Sean finished with " + (guess - element.guessRemain + 1) + " tries in " + (second - element.timeRemain) + "s!");
            p.appendChild(img);
            p.appendChild(textnode);
            var hr = document.createElement("hr");
            ranking.append(p);
            ranking.append(hr);
        });
    }

    // clear after insert
    // input.value = "";
    autoFocus();
}

// RESET BUTTON PRESSED
function reset() {
    resetToDefault();
    enableOrDisableBtn();
    displayDiv();
}

// ============END-MAIN===========

// =========EXTRA-FUNCTIONS=======

// function enableOrDisableBtn() {
//     if (!input.disabled && !guessBtn.disabled && !resetBtn.disabled) {
//         input.disabled = true;
//         guessBtn.disabled = true;
//         resetBtn.disabled = true;
//     } else {
//         input.disabled = false;
//         guessBtn.disabled = false;
//         resetBtn.disabled = false;
//     }

// }

function displayDiv() {
    if (canvas.style.display === "block" && startGameBtn.style.display === "none") {
        canvas.style.display = "none";
        inputDiv.style.display = "none";
        startGameBtn.style.display = "block";
    } else {
        canvas.style.display = "block";
        inputDiv.style.display = "block";
        startGameBtn.style.display = "none";
    }

}

function resetToDefault() {
    clearInterval(timer);
    guess = 5;
    second = 20;
    historyBox = [];
    guessHistory.innerHTML = "";
    randomNumber = Math.floor(Math.random() * 100) + 1;
}

// function timecounting() {
//     timer = setInterval(() => {
//         if (second == 0) {
//             previousRecord.push(["FAILED", guess, second]);
//             clearInterval(timer);
//             createAlert(4);
//             reset();
//             insertPreviousRecord();
//             return;
//         }
//         second -= 1;
//         secondRemaining.innerHTML = second + "s";
//     }, 1000)

// }

// function getResult() {
//     let result = 0;
//     if (historyBox.includes(input.value)) {
//         result = 3;
//     } else {
//         historyBox.push(input.value);
//         if (input.value == randomNumber) {
//             bestScores.push({ guessRemain: guess, timeRemain: second });
//             previousRecord.push(["SUCCEED", guess - 1, second])
//             return 5;
//         } else if (input.value < randomNumber) {
//             result = 1;
//         } else if (input.value > randomNumber) {
//             result = 2;
//         }
//         guessRemaining.textContent = --guess;
//         if (guess == 0) {
//             result = 4;
//             previousRecord.push(["FAILED", guess, second])
//         }
//     }
//     return result;
// }


function createAlert(alertType) {

    let alertColor = [1, 2, 3, 4, 6].includes(alertType) ? "btn-danger" : "btn-info";
    let text = prompts[alertType];

    text += [4, 5].includes(alertType) ? "! Try another round to rank up!" : "";

    if (toaster.childElementCount > 1 || [4, 5].includes(alertType)) {
        toaster.innerHTML = "";
    }

    toaster.innerHTML += `<div class="toast" id="toast" role="alert" aria-live="assertive" aria-atomic="true" data-delay="5000">
    <div class="toast-body ${alertColor}" style="letter-spacing: 1px;">
        ${text}
    </div>
    </div>`;
    $('.toast').toast('show');
}


function insertPreviousRecord() {
    previousRound.innerHTML = "";
    // just for printing, have to reverse back after printing
    previousRecord.reverse();

    previousRecord.forEach(element => {
        var p = document.createElement("div");
        p.className = "mt-3 mx-4";
        var img = document.createElement("img")
        img.src = element[0] == "FAILED" ? "img/red_cross.png" : "img/green_tick.png";
        img.width = 32;
        img.height = 32;
        var textnode = document.createTextNode(element[0] + " / " + "Finished with " + (guess - element[1]) + " tries in " + (second - element[2]) + "s");
        p.appendChild(img);
        p.appendChild(textnode);

        previousRound.append(p);
    });
    previousRecord.reverse();
}

// function autoFocus() {
//     input.focus();
// }


// FOR THE GAME

ctx = canvas.getContext("2d");


let bgReady, heroReady, monsterReady;
let bgImage, heroImage, monsterImage;

let startTime = Date.now();
const SECONDS_PER_ROUND = 30;
let elapsedTime = 0;

function loadImages() {
    bgImage = new Image();
    bgImage.onload = function() {
        // show the background image
        bgReady = true;
    };
    bgImage.src = "img/background.png";
    heroImage = new Image();
    heroImage.onload = function() {
        // show the hero image
        heroReady = true;
    };
    heroImage.src = "img/hero.png";

    monsterImage = new Image();
    monsterImage.onload = function() {
        // show the monster image
        monsterReady = true;
    };
    monsterImage.src = "img/monster.png";
}

/** 
 * Setting up our characters.
 * 
 * Note that heroX represents the X position of our hero.
 * heroY represents the Y position.
 * We'll need these values to know where to "draw" the hero.
 * 
 * The same applies to the monster.
 */

let heroX = canvas.width / 2;
let heroY = canvas.height / 2;

let monsterX = 100;
let monsterY = 100;

/** 
 * Keyboard Listeners
 * You can safely ignore this part, for now. 
 * 
 * This is just to let JavaScript know when the user has pressed a key.
 */
let keysDown = {};

function setupKeyboardListeners() {
    // Check for keys pressed where key represents the keycode captured
    // For now, do not worry too much about what's happening here. 
    addEventListener("keydown", function(key) {
        keysDown[key.keyCode] = true;
    }, false);

    addEventListener("keyup", function(key) {
        delete keysDown[key.keyCode];
    }, false);
}


/**
 *  Update game objects - change player position based on key pressed
 *  and check to see if the monster has been caught!
 *  
 *  If you change the value of 5, the player will move at a different rate.
 */
let update = function() {
    // Update the time.
    elapsedTime = Math.floor((Date.now() - startTime) / 1000);


    if (38 in keysDown) { // Player is holding up key
        heroY -= 5;
    }
    if (40 in keysDown) { // Player is holding down key
        heroY += 5;
    }
    if (37 in keysDown) { // Player is holding left key
        heroX -= 5;
    }
    if (39 in keysDown) { // Player is holding right key
        heroX += 5;
    }

    if (heroX <= 0) {
        heroX = canvas.width - 32;
    } else if (heroX > canvas.width - 32) {
        heroX = 0;
    }

    if (heroY < 0) {
        heroY = canvas.height - 32;
    } else if (heroY > canvas.height - 32) {
        heroY = 0;
    }

    // Check if player and monster collided. Our images
    // are about 32 pixels big.
    if (
        heroX <= (monsterX + 32) &&
        monsterX <= (heroX + 32) &&
        heroY <= (monsterY + 32) &&
        monsterY <= (heroY + 32)
    ) {
        // Pick a new location for the monster.
        // Note: Change this to place the monster at a new, random location.
        monsterX = Math.abs(Math.floor(Math.random() * canvas.width - 32));
        monsterY = Math.abs(Math.floor(Math.random() * canvas.height - 32));
    }
};

/**
 * This function, render, runs as often as possible.
 */
var render = function() {
    if (bgReady) {
        ctx.drawImage(bgImage, 0, 0);
    }
    if (heroReady) {
        ctx.drawImage(heroImage, heroX, heroY);
    }
    if (monsterReady) {
        ctx.drawImage(monsterImage, monsterX, monsterY);
    }
    secondRemaining.innerHTML = `Seconds Remaining: ${SECONDS_PER_ROUND - elapsedTime}`;
};

/**
 * The main game loop. Most every game will have two distinct parts:
 * update (updates the state of the game, in this case our hero and monster)
 * render (based on the state of our game, draw the right things)
 */
var main = function() {
    update();
    render();
    // Request to do this again ASAP. This is a special method
    // for web browsers. 
    requestAnimationFrame(main);
};