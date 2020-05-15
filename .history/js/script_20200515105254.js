var canvas = document.getElementById("myCanvas");
var ctx = canvas.getContext("2d");
var spritedx = 10;
var spritedy = 10;
var mySpeed = 10;
var changeSpriteSpeed = 0.001;
var bonus = 100;
var bulletdx = 5;
var bulletdy = 5;
var spriteInterval = 100;
var spriteMinRadius = 5;
var spriteMaxRadius = 30;
var myDebug = false;
var scoreAdj = 100;

var bulletCounter = 0;
var spriteCounter = 0;
var refreshCounter = 0;
var score = 0;
var lives = 3;
var spriteArray = [];
var bulletArray = [];
var isGameOver = false;
//myCircle.x = 200;
// myCircle.y = 100;
var newBullet = false;
var duration = 0;
var difficulty = 1;
var dispDuration = "";
var hyperSpace = false;

var startDate = Date.now();
var timeInMs = Date.now();
var hits = 0;

var rightPressed = false;
var leftPressed = false;
var downPressed = false;
var upPressed = false;
var blink = false;
var myColor = "#a000ff";
var myBulletColor = "red";



// FOR NEW GAME EFFECT
let div = document.getElementById("inputDiv");
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
let input = document.getElementById("guessInput");

// LEFT BOXES
let guessHistory = document.getElementById("guessHistory");
let ranking = document.getElementById("ranking");
let previousRound = document.getElementById("previousRound");

// RIGHT BOXES
let secondRemaining = document.getElementById("secondRemaining");
let guessRemaining = document.getElementById("guessRemaining");
let finalResult = document.getElementById("finalResult");

// BUTTONS
let guessBtn = document.getElementById("guessBtn");
let resetBtn = document.getElementById("resetBtn");


// TOASTER + TOASTER OUTPUT
let toaster = document.getElementById("toast-container");
let prompts = { 1: "Too Low!", 2: "Too High!", 3: "You already input that number!", 4: "Better luck next time!", 5: "Great Job!", 6: "Please input your number!" }


// =========== MAIN ============ 

// ENTER KEY PRESSED
$(document).keypress(function(e) {
    if (e.which == 13) {
        $("#guessBtn").click();
    }
});

$(document).ready(function() {
    div.style.display = "none";
    input.disabled = true;
    guessBtn.disabled = true;
    resetBtn.disabled = true;
});

// NEW-GAME BUTTON PRESSED
function startGame() {
    // window.scroll(0, 0);
    // toaster.innerHTML = ""
    // secondRemaining.innerHTML = second;
    // timecounting();
    // guessRemaining.textContent = guess;
    // displayDiv();
    // enableOrDisableBtn();
    // autoFocus();
    // alert("Random number revealed(for testing): " + randomNumber);

    loadImages();
    setupKeyboardListeners();
    main();
}


// GUESS BUTTON PRESSED
function guessSubmit() {
    if (guessBtn.disabled) return;
    else if (input.value == '' && !guessBtn.disabled) {
        createAlert(6);
        return;
    }
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
    input.value = "";
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

function enableOrDisableBtn() {
    if (!input.disabled && !guessBtn.disabled && !resetBtn.disabled) {
        input.disabled = true;
        guessBtn.disabled = true;
        resetBtn.disabled = true;
    } else {
        input.disabled = false;
        guessBtn.disabled = false;
        resetBtn.disabled = false;
    }

}

function displayDiv() {
    if (div.style.display === "block" && startGameBtn.style.display === "none") {
        div.style.display = "none";
        startGameBtn.style.display = "block";
    } else {
        div.style.display = "block";
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

function timecounting() {
    timer = setInterval(() => {
        if (second == 0) {
            previousRecord.push(["FAILED", guess, second]);
            clearInterval(timer);
            createAlert(4);
            reset();
            insertPreviousRecord();
            return;
        }
        second -= 1;
        secondRemaining.innerHTML = second + "s";
    }, 1000)

}

function getResult() {
    let result = 0;
    if (historyBox.includes(input.value)) {
        result = 3;
    } else {
        historyBox.push(input.value);
        if (input.value == randomNumber) {
            bestScores.push({ guessRemain: guess, timeRemain: second });
            previousRecord.push(["SUCCEED", guess - 1, second])
            return 5;
        } else if (input.value < randomNumber) {
            result = 1;
        } else if (input.value > randomNumber) {
            result = 2;
        }
        guessRemaining.textContent = --guess;
        if (guess == 0) {
            result = 4;
            previousRecord.push(["FAILED", guess, second])
        }
    }
    return result;
}


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

function autoFocus() {
    input.focus();
}


// GAME MAKING

function Circle(name, x, y, radius, color, dx, dy) {
    radius = radius || 10;
    x = x || 0 + radius;
    y = y || 0 + radius;
    dx = dx || spritedx;
    dy = dy || spritedy;
    name = name || "Blob";
    color = color || myColor;
    this.x = x;
    this.y = y;
    this.radius = radius;
    this.color = color;
    this.dx = dx;
    this.dy = dy;
    this.name = name;
}
Circle.prototype.draw = function() {
    ctx.beginPath();
    ctx.arc(this.x, this.y, this.radius, 0, 2 * Math.PI);

    ctx.fillStyle = this.color;
    ctx.fill();
    if (this.name === "myCircle") {
        ctx.strokeStyle = myColor;
    } else {
        ctx.strokeStyle = this.color;
    }

    //ctx.strokeStyle=this.color;
    ctx.stroke();
    return this;
};

Circle.prototype.move = function() {
    // console.log("dx: "+this.dx);
    // console.log("dy: "+this.dy);

    // change the sprite speed as time goes on
    if (this.dx > 0) {
        this.dx = this.dx + changeSpriteSpeed;
    } else {
        this.dx = this.dx - changeSpriteSpeed;
    }

    if (this.dy > 0) {
        this.dy = this.dy + changeSpriteSpeed;
    } else {
        this.dy = this.dy - changeSpriteSpeed;
    }

    this.x += this.dx;
    this.y += this.dy;
    this.checkBoundary();
};

Circle.prototype.checkBoundary = function() {
    if (
        this.x + this.dx > myCanvas.width - this.radius ||
        this.x + this.dx < this.radius
    ) {
        this.dx = -this.dx; // reverse the sign
    }

    if (
        this.y + this.dy > myCanvas.height - this.radius ||
        this.y + this.dy < this.radius
    ) {
        this.dy = -this.dy; // reverse the sign
    }
};

function Bullet(name, width, height, orientation, color, x, y, dx, dy) {
    length = length || 1;
    width = width || 1;
    orientation = orientation || "N";
    x = x;
    y = y;
    dx = dx || bulletdx;
    dy = dy || bulletdy;
    name = name || "bullet";
    color = color || myBulletColor;
    this.x = x;
    this.y = y;
    this.color = color;
    this.dx = dx;
    this.dy = dy;
    this.name = name;
    this.height = height;
    this.width = width;
    this.orientation = orientation;
}

Bullet.prototype.draw = function() {
    // note it's really this the linewidth usedfor bullet size. As we are drawing rectanges we and firing in all directions
    // we really need width and height to be the same or a new routine for each sideways, up/down.
    ctx.beginPath();
    ctx.lineWidth = "2";
    ctx.strokeStyle = this.color;
    ctx.fillStyle = this.color;
    ctx.rect(this.x, this.y, this.width, this.height);
    ctx.stroke();
    return this;
};

Bullet.prototype.move = function() {
    //  this.x += this.dx;
    // this.y += this.dy;
    if (this.orientation == "N") {
        this.y -= this.dy;
    } else if (this.orientation == "S") {
        this.y += this.dy;
    } else if (this.orientation == "W") {
        this.x -= this.dx;
    } else if (this.orientation == "E") {
        this.x += this.dx;
    }
};

function ceateNewBullets() {
    ceateNewBullet("N");
    ceateNewBullet("S");
    ceateNewBullet("W");
    ceateNewBullet("E");
}

function ceateNewBullet(o) {
    var bullet = new Bullet(
        "bullet" + bulletCounter,
        1,
        1,
        o,
        myBulletColor,
        myCircle.x,
        myCircle.y
    );
    bulletCounter = bulletCounter + 1;
    bulletArray.push(bullet);
    bullet.draw();
    //alert(JSON.stringify(bullet));
}

function drawBullets() {
    bulletArray.forEach(function(v, i, a) {
        v.draw();
        v.move();
    });
}

function bulletCollisionDetection() {
    bulletArray.forEach(function(v, i, a) {
        //var that = this;
        if (v.x > myCanvas.width || v.y > myCanvas.height || v.x < 0 || v.y < 0) {
            //console.log("destroy bullet!!!!!!! " + v.x + " " + v.y );
            bulletArray.splice(i, 1);
        } else {
            spriteArray.forEach(function(va, ind, ar) {
                // console.log("check bullet");
                bulletHitDetection(v, va, ind);
            });
        }
    });
}

function bulletHitDetection(bullet, sprite, ind) {
    if (myDebug) {
        //   console.log(JSON.stringify(bullet));
        //   console.log(JSON.stringify(sprite));
        myDebug = false;
    }

    var dx = bullet.x - sprite.x;
    var dy = bullet.y - sprite.y;
    var distance = Math.sqrt(dx * dx + dy * dy);

    if (distance < +sprite.radius) {
        // console.log(sprite.radius);
        score = score + (scoreAdj - sprite.radius);
        spriteArray.splice(ind, 1);
        hits++;
        checkDifficulty();
    }
}

function checkDifficulty() {
    if (hits > 10 && hits < 30) {
        difficulty = 2;
    } else if (hits > 30 && hits < 100) {
        difficulty = 3;
    } else if (hits > 100 && hits < 200) {
        difficulty = 4;
    } else if (hits > 200 && hits < 300) {
        difficulty = 5;
    } else if (hits > 300 && hits < 400) {
        difficulty = 6;
    } else if (hits > 400 && hits < 500) {
        difficulty = 7;
    } else if (hits > 500) {
        difficulty++;
    } else {
        difficulty = 1;
    }
}

function drawScore() {
    ctx.font = "20px Arial";
    ctx.fillStyle = "green";
    ctx.fillText("Score " + score, 10, 20);
}

function drawLives() {
    ctx.font = "20px Arial";
    ctx.fillStyle = "green";
    ctx.fillText("Lives " + lives, myCanvas.width - 70, 20);
}

function drawDuration() {
    ctx.font = "20px Arial";
    ctx.fillStyle = "green";
    ctx.fillText("Time " + dispDuration, myCanvas.width / 2 - 80, 20);
}

function drawDifficulty() {
    ctx.font = "15px Arial";
    ctx.fillStyle = "green";
    ctx.fillText(
        "Level:" + difficulty,
        myCanvas.width - 60,
        myCanvas.height - 10
    );
}

function drawHalfway() {
    ctx.moveTo(250, 0);
    ctx.lineTo(myCanvas.width / 2, myCanvas.height);
    ctx.stroke();
}

function drawSprites() {
    spriteArray.forEach(function(v, i, a) {
        v.draw();
        v.move();
    });
}

function clearSprites() {
    spriteArray.splice(0, spriteArray.length);
    //    for ( var i=0; i < spriteArray.length; i++ ){
    //        spriteArray.pop();
    //    }
}

var myCircle = new Circle("myCircle", 200, 100, 10, myColor);
myCircle.draw();

function getRandomInt(min, max) {
    return Math.floor(Math.random() * (max - min + 1)) + min;
}

function ceateNewSprite(name) {
    var spriteColors = [
        "grey",
        "green",
        "blue",
        "plum",
        "peru",
        "purple",
        "seagreen",
        "yellow",
        "olive",
        "navy",
        "orange"
    ];
    var newX = getRandomInt(0, myCanvas.width);
    var newY = getRandomInt(0, myCanvas.height);
    var radius = getRandomInt(spriteMinRadius, spriteMaxRadius);
    var color = spriteColors[getRandomInt(0, spriteColors.length)];

    // get random start dx/dy 1 to 5
    var newDX = getRandomInt(1, 5);
    var newDY = -getRandomInt(1, 5);

    var sprite = new Circle(name, newX, newY, radius, color, newDX, newDY);
    spriteArray.push(sprite);
    // alert(JSON.stringify(sprite));
    sprite.draw();
}

function SpriteCollisionDetection() {
    // ad code to loop between all sprites.
    spriteArray.forEach(function(v, i, a) {
        spriteHitDetection(v);
    });
}

function spriteHitDetection(sprite) {
    var dx = myCircle.x - sprite.x;
    var dy = myCircle.y - sprite.y;
    var distance = Math.sqrt(dx * dx + dy * dy);

    if (distance < myCircle.radius + sprite.radius) {
        // collision detected!
        lives--;
        flash();
        drawLives();
        if (lives === 0) {
            gameOver();
        }
        clearSprites();
    }
}

function flash() {
    blink = true;
    myCircle.radius = myCircle.radius + 30;
    myCircle.color = "orange";

    setTimeout(function() {
        myCircle.radius = myCircle.radius + 10;
        myCircle.color = "yellow";
        setTimeout(function() {
            myCircle.radius = myCircle.radius + 10;
            myCircle.color = "orange";
        }, 300);
    }, 300);

    setTimeout(function() {
        blink = false;
        myCircle.radius = 10;
        myCircle.color = myColor;
        myCircle.x = 200;
        myCircle.y = 100;
    }, 1000);
}

function ResetGlobalVariables() {
    bulletCounter = 0;
    spriteCounter = 0;
    refreshCounter = 0;
    score = 0;
    lives = 3;
    spriteArray = [];
    bulletArray = [];
    isGameOver = false;
    myCircle.x = 200;
    myCircle.y = 100;
    newBullet = false;
    duration = 0;
    difficulty = 1;
    dispDuration = "";
    hyperSpace = false;
    startDate = Date.now();
    hits = 0;
}

function msToTime(duration) {
    var milliseconds = parseInt(duration % 1000 / 100),
        seconds = parseInt(duration / 1000 % 60),
        minutes = parseInt(duration / (1000 * 60) % 60),
        hours = parseInt(duration / (1000 * 60 * 60) % 24);

    hours = hours < 10 ? "0" + hours : hours;
    minutes = minutes < 10 ? "0" + minutes : minutes;
    seconds = seconds < 10 ? "0" + seconds : seconds;

    return hours + ":" + minutes + ":" + seconds + "." + milliseconds;
}

function gameOver() {
    //alert("game over");
    isGameOver = true;
    // dont clear canveas as leave score etc
    ctx.clearRect(0, 0, myCanvas.width, myCanvas.height);
    drawLives();
    drawScore();
    drawDuration();
    drawDifficulty();
    // ctx.font = "20px Arial";
    // ctx.fillStyle = "red";
    ctx.font = "30px Verdana";
    // Create gradient
    var gradient = ctx.createLinearGradient(0, 0, canvas.width, 0);
    gradient.addColorStop("0", "magenta");
    gradient.addColorStop("0.5", "blue");
    gradient.addColorStop("1.0", "red");
    // Fill with gradient
    ctx.fillStyle = gradient;

    ctx.fillText("GAME OVER Press Enter to restart.", 100, myCanvas.height / 2);
}

function reload() {
    ResetGlobalVariables();
}

// game loop

document.addEventListener("keydown", keyDownHandler, false);
document.addEventListener("keyup", keyUpHandler, false);

function keyDownHandler(e) {
    //console.log(e.which);
    if (e.keyCode == 39) {
        rightPressed = true;
    } else if (e.keyCode == 37) {
        leftPressed = true;
    } else if (e.keyCode == 40) {
        downPressed = true;
    } else if (e.keyCode == 38) {
        upPressed = true;
    } else if (e.keyCode == 13 && isGameOver) {
        reload();
    } else if (e.keyCode == 32 && !isGameOver) {
        newBullet = true;
        // add a delay to make more playable (lessen holding down fire button).
        // At some point come back and add a "power" display. Reduce power on fire and then when zero power
        // some sort of delay until reset power. Do not allow fire while zero.
        setTimeout(function() {
            newBullet = false;
        }, 100);
    } else if (e.keyCode == 90 && !isGameOver) {
        hyperSpace = true;
    }
}

function keyUpHandler(e) {
    if (e.keyCode == 39) {
        rightPressed = false;
    } else if (e.keyCode == 37) {
        leftPressed = false;
    } else if (e.keyCode == 40) {
        downPressed = false;
    } else if (e.keyCode == 38) {
        upPressed = false;
    } else if (e.keyCode == 32 && !isGameOver) {
        newBullet = false;
    }
}

function doRefresh() {
    if (!isGameOver) {
        ctx.clearRect(0, 0, myCanvas.width, myCanvas.height);

        // var my_gradient=ctx.createRadialGradient( canvas.width/2, canvas.height/2, 300,canvas.width/2 +200, canvas.height/2+100, 200);
        var my_gradient = ctx.createRadialGradient(
            canvas.width / 2,
            canvas.height / 2,
            400,
            canvas.width - 100,
            canvas.height - 100,
            300
        );
        my_gradient.addColorStop(0, "#f2cf46");
        my_gradient.addColorStop(1, "#5ba0b7");
        ctx.fillStyle = my_gradient;
        ctx.fillRect(0, 0, canvas.width, canvas.height);

        drawScore();
        drawLives();
        drawDuration();
        drawDifficulty();

        //drawHalfway();

        if (rightPressed && myCircle.x + myCircle.radius < myCanvas.width) {
            myCircle.x += mySpeed;
        } else if (leftPressed && myCircle.x - myCircle.radius > 0) {
            myCircle.x -= mySpeed;
        } else if (upPressed && myCircle.y - myCircle.radius > 0) {
            myCircle.y -= mySpeed;
        } else if (downPressed && myCircle.y + myCircle.radius < myCanvas.height) {
            myCircle.y += mySpeed;
        } else if (newBullet) {
            ceateNewBullets();
        }

        if (hyperSpace) {
            hyperSpace = false;
            // generate random position.
            myCircle.x = getRandomInt(
                0 + myCircle.radius,
                myCanvas.width - myCircle.radius
            );
            myCircle.y = getRandomInt(
                0 + myCircle.radius,
                myCanvas.height - myCircle.radius
            );
        }

        var frequency = 200;
        if (!blink || Math.floor(Date.now() / frequency) % 2) {
            myCircle.draw();
        }

        // myCircle.draw();
        drawSprites();
        drawBullets();
        bulletCollisionDetection();
        SpriteCollisionDetection();

        if (refreshCounter == spriteInterval) {
            if (spriteArray.length === 0) {
                score = score + bonus;
            }
            refreshCounter = 0;
            for (var j = 1; j <= difficulty; j++) {
                ceateNewSprite("Sprite" + spriteCounter);
                spriteCounter = spriteCounter + 1;
            }
        }

        refreshCounter = refreshCounter + 1;

        timeInMs = Date.now();
        duration = timeInMs - startDate;
        dispDuration = msToTime(duration);
    }
    requestAnimationFrame(doRefresh);
}

$(document).ready(function() {
    setTimeout(() => {
        const windowWidth = window.innerWidth;
        const windowHeight = window.innerHeight;
        // console.log(`width ${windowWidth}  height ${ windowHeight } `);

        const instruction = document.getElementById("instruction");
        const divWidth = instruction.offsetWidth;
        const centerIt = (windowWidth - divWidth) / 2;
        // console.log(`div width is ${divWidth} `);

        // set css centreIt variable
        instruction.className += " shiftIn";
        instruction.style.setProperty("--centerIt", divWidth + centerIt + "px");
        // console.log(`centerIt ${centerIt}`);

        instruction.addEventListener("click", function() {
            instruction.style.setProperty("display", "none");
            doRefresh();
        });
    }, 500);
});