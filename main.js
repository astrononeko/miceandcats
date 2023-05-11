let canvas;
let context;
let isPlaying = true;
let isPaused = false;

window.onload = init;

/*Функция чтобы размеры реальные и визуальные соотнести взяв за опору размер в CSS*/
function resizeCanvasToDisplaySize(canvas) {
    const width = canvas.clientWidth;
    const height = canvas.clientHeight;

    if (canvas.width !== width || canvas.height !== height) {
        canvas.width = width;
        canvas.height = height;
    }
}

let gameObjects;

const vel = 256;
let scoreRat = 0;
let scorePlayer = 0;

function spawnRat(context, w, h) {
    let dir = Math.random();

    if (dir < 0.25) {  //North
        return new Rat(context, Math.random() * w, 0, Math.random() * vel);
    } else if (dir < 0.5) { //East
        return new Rat(context, w, Math.random() * h, Math.random() * vel);
    } else if (dir < 0.75) { //South
        return new Rat(context, Math.random() * w, h, Math.random() * vel);
    } else { //West
        return new Rat(context, 0, Math.random() * h, Math.random() * vel);
    }
}

let cheese;

function cheeseCreate(context) {
    let x = Math.random() * canvas.width;
    let y = Math.random() * canvas.height;

    cheese = new Cheese(context, x, y);
    return cheese;
}

function createWorld(context, w, h) {
    gameObjects = [
        cheeseCreate(context),
    ];
    for(let i = 0; i < Math.round(Math.random() * 10); i++) {
        gameObjects.push(spawnRat(context, w, h));
    }
}

function circleIntersect(x1, y1, r1, x2, y2, r2) {
    let squareDistance = (x1 - x2) * (x1 - x2) + (y1 - y2) * (y1 - y2);
    return (squareDistance <= ((r1 + r2) * (r1 + r2)));
}

function detectCollisions(w, h) {
    let obj1;
    let obj2;

    for(let i = 0; i < gameObjects.length; i++) {
        obj1 = gameObjects[i];
        for (let j = i + 1; j < gameObjects.length; j++) {
            obj2 = gameObjects[j];

            if (circleIntersect(obj1.x, obj1.y, obj1.radCol, obj2.x, obj2.y, obj2.radCol)) {

                /*Контакт с сыром*/
                if (obj1 === cheese) {
                    scoreRat++;
                    cheese.eaten = true;
                    cheese = {};
                    cheese = cheeseCreate(context);
                    gameObjects[0] = cheese;
                    if (scoreRat % 2 === 0) {
                        gameObjects.push(spawnRat(context, w, h));
                    }
                }
            }
        }
    }
}

function clearCanvas(context, w, h) {
    context.clearRect(0, 0, w, h);
}

let secondsPassed = 0;
let oldTimeStamp = 0;

function retry() {
    clearCanvas(context, canvas.width, canvas.height);
    gameObjects.splice(0);
    scoreRat = 0;
    scorePlayer = 0;
    isPlaying = true;
    createWorld(context, canvas.width, canvas.height);
    secondsPassed = 0;
    oldTimeStamp = 0;
}

function init() {
    canvas = document.getElementById("game");
    resizeCanvasToDisplaySize(canvas);
    context = canvas.getContext("2d");
    createWorld(context, canvas.width, canvas.height);
    window.requestAnimationFrame(gameLoop);

    canvas.addEventListener("mousemove", function(e) {
        for (let i = 1; i < gameObjects.length; i++) { //i=0 is cheese
            if ((e.offsetX - gameObjects[i].x) * (e.offsetX - gameObjects[i].x) +
                (e.offsetY - gameObjects[i].y) * (e.offsetY - gameObjects[i].y) <
                gameObjects[i].radCol * gameObjects[i].radCol) {
                gameObjects[i].speedboost = 1.1;
            }
        }
        isPaused = (e.offsetX > canvas.width * 0.95) && (e.offsetX < canvas.width * 0.95 + canvas.height * 0.04)
            && (e.offsetY > canvas.height * 0.97 - canvas.height * 0.02) && (e.offsetY < canvas.height * 0.97 + canvas.height * 0.02);
    });
    canvas.addEventListener("mousedown", function(event) {
        for (let i = 1; i < gameObjects.length; i++) {
            if ((event.offsetX - gameObjects[i].x) * (event.offsetX - gameObjects[i].x) +
                (event.offsetY - gameObjects[i].y) * (event.offsetY - gameObjects[i].y) <
                gameObjects[i].radCol * gameObjects[i].radCol) {
                gameObjects.splice(i, 1);
                scorePlayer++;
            }
        }
        if ((event.offsetX > canvas.width * 0.95) && (event.offsetX < canvas.width * 0.95 + canvas.height * 0.04)
            && (event.offsetY > canvas.height * 0.97 - canvas.height * 0.02) && (event.offsetY < canvas.height * 0.97 + canvas.height * 0.02)) {
            retry();
        }
    });
}

function gameLoop(timeStamp) {
    secondsPassed = (timeStamp - oldTimeStamp) / 1000;
    secondsPassed = Math.min(secondsPassed, 0.1);
    oldTimeStamp = timeStamp;

    if (isPlaying && !isPaused) {
        for (let i = 0; i < gameObjects.length; i++) {
            gameObjects[i].update(secondsPassed, cheese.x, cheese.y, canvas.width, canvas.height);
        }

        detectCollisions(canvas.width, canvas.height);

        clearCanvas(context, canvas.width, canvas.height);

        for (let i = 0; i < gameObjects.length; i++) {
            gameObjects[i].draw();
        }
        context.fillStyle = "black";
        context.font = "25px Courier";
        context.fillText("Rat Score: " + scoreRat, 40, 40);
        context.fillText("Player Score: " + scorePlayer, 40, 80);

        if (scoreRat === 50) {
            clearCanvas(context, canvas.width, canvas.height);
            context.font = "50px Courier";
            context.textAlign = "center";
            context.textBaseline = "middle";
            context.fillText("Lose! Rat Score: " + scoreRat, canvas.width / 2, canvas.height / 2);
            isPlaying = false;
        }
        if (scorePlayer === 20) {
            clearCanvas(context, canvas.width, canvas.height);
            context.font = "50px Courier";
            context.textAlign = "center";
            context.textBaseline = "middle";
            context.fillText("Win! Player Score: " + scorePlayer, canvas.width / 2, canvas.height / 2);
            isPlaying = false;
        }
    }

    context.fillStyle = "#27278c";
    context.fillRect(canvas.width * 0.95, canvas.height * 0.95, canvas.height * 0.04, canvas.height * 0.04);

    window.requestAnimationFrame(gameLoop);
}