var canvasWidth = 600;
var canvasHeight = 400;

var player;
var playerYPosition = 200;
var block;

var fallSpeed = 0;
var interval = setInterval(updateCanvas, 20);

var isJumping = false;
var jumpSpeed = 0;



var score = 0;
var scoreLabel;


function startGame() {
    gameCanvas.start();
    player = new createPlayer(30, 30, 10);
    block = new createBlock();
    scoreLabel = new createScoreLabel(10, 30);
}

 var gameCanvas = {
    canvas: document.createElement("canvas"), start: function() {
        this.canvas.width = canvasWidth;
        this.canvas.height = canvasHeight;
        this.context = this.canvas.getContext("2d");
        document.body.insertBefore(this.canvas, document.body.childNodes[0]);
    }
}

function createPlayer(width, height, x) {
    this.width = width;
    this.height = height;
    this.x = x;
    this.y = playerYPosition;

    // Draw function
    this.draw = function () {
        ctx = gameCanvas.context;
        ctx.fillStyle = "green";
        ctx.fillRect(this.x, this.y, this.width, this.height);
    }

    // makeFall function
    this.makeFall = function() {
        if (!isJumping) {
            this.y += fallSpeed;
            fallSpeed += 0.25;
            this.stopPlayer();
        }
    }

    // stopPlayer function
    this.stopPlayer = function() {
        var ground = canvasHeight - this.height;
        if (this.y > ground) {
            this.y = ground;
        }
    }

    // jump function
    this.jump = function() {
        if (isJumping) {
            this.y -= jumpSpeed;
            jumpSpeed += 0.4;
        }
    }
}

function createBlock() {
    var width = randomNumber(10, 30);
    var height = randomNumber(30, 90);
    var speed = randomNumber(5, 7);

    this.x = canvasWidth;
    this.y = canvasHeight - height;

    this.draw = function() {
        ctx = gameCanvas.context;
        ctx.fillStyle = "red";
        ctx.fillRect(this.x, this.y, width, height);
    }

    this.attackPlayer = function() {
        this.x -= speed;
        this.returnToAttackPosition();
    }

    this.returnToAttackPosition = function() {
        if (this.x < 0) {
            width = randomNumber(10, 30);
            height = randomNumber(30, 130);
            speed = randomNumber(5,7);
            this.y = canvasHeight - height;
            this.x = canvasWidth;
            score++;
        }
    }
}

// updateCanvas will redraw player and make them fall
function updateCanvas() {
    detectCollision();

    ctx = gameCanvas.context;
    ctx.clearRect(0, 0, canvasWidth, canvasHeight);

    player.makeFall();
    player.draw();
    player.jump();

    block.draw();
    block.attackPlayer();

    scoreLabel.text = "SCORE: " + score;
    scoreLabel.draw();
}

function randomNumber(min, max) {
    return Math.floor(Math.random() * (max - min + 1) + min)
}

function detectCollision() {
    var playerLeft = player.x;
    var playerRight = player.x + player.width;
    var blockLeft = block.x;

    var playerBottom = player.y + player.height;
    var blockTop = block.y;

    if (playerRight > blockLeft && 
        playerLeft < blockLeft &&
        playerBottom > blockTop) {
            gameCanvas.stop();
        }
}

function resetJump() {
    jumpSpeed = 0;
    isJumping = false;
}

document.body.onkeyup = function(e) {
    if (e.keyCode == 32) {
        isJumping = true;
        setTimeout(function() { resetJump(); }, 800);
    }
}

function createScoreLabel(x, y) {
    this.score = 0;
    this.x = x;
    this.y = y;
    this.draw = function() {
        ctx = gameCanvas.context;
        ctx.font = "25px Marker Felt";
        ctx.fillStyle = "black";
        ctx.fillText(this.text, this.x, this.y);
    }
}

