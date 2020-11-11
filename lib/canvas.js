/*
 * Author: Dave Eddy <dave@daveeddy.com>
 * Date: November 11, 2020
 * License: MIT
 */
var MAZE_WIDTH;
var MAZE_HEIGHT;

var CANVAS_WIDTH;
var CANVAS_HEIGHT;

var HORIZONTAL_BLOCKS;
var VERTICAL_BLOCKS;

var BLOCK_SIZE;
var ANIMATION_DELAY;

var BACKGROUND_COLOR;
var MAZE_COLOR;

var MAZE;
var ANIMATING = false;

var canvas = document.getElementById('canvas');
var ctx = canvas.getContext('2d');

var inputs = {
    canvasSize: document.getElementById('canvas-size-input'),
    mazeSize: document.getElementById('maze-size-input'),
    animationDelay: document.getElementById('animation-delay-input'),
    backgroundColor: document.getElementById('background-color-input'),
    mazeColor: document.getElementById('maze-color-input'),
};

var buttons = {
    saveButton: document.getElementById('save-button'),
    stepButton: document.getElementById('step-button'),
    animateButton: document.getElementById('animate-button'),
    resetButton: document.getElementById('reset-button'),
};

// wire up buttons
buttons.saveButton.onclick = doSave;
buttons.stepButton.onclick = doStep;
buttons.animateButton.onclick = doAnimate;
buttons.resetButton.onclick = doReset;

// wire up inputs to enable "save" button
Object.keys(inputs).forEach(function (name) {
    var elem = inputs[name];
    elem.addEventListener('input', onInput);
});
function onInput() {
    buttons.saveButton.disabled = false;
}

// save button pressed
function doSave() {
    var canvasSize = parseValue(inputs.canvasSize.value);
    var mazeSize = parseValue(inputs.mazeSize.value);
    var animationDelay = parseInt(inputs.animationDelay.value, 10);
    var backgroundColor = inputs.backgroundColor.value;
    var mazeColor = inputs.mazeColor.value;

    if (isNaN(animationDelay) || animationDelay < 0) {
        error('invalid animation delay: ' + inputs.animationDelay.value);
    }

    ANIMATION_DELAY = animationDelay;

    MAZE_WIDTH = mazeSize[0];
    MAZE_HEIGHT = mazeSize[1];

    CANVAS_WIDTH = canvasSize[0];
    CANVAS_HEIGHT = canvasSize[1];

    MAZE_COLOR = mazeColor;
    BACKGROUND_COLOR = backgroundColor;

    HORIZONTAL_BLOCKS = MAZE_WIDTH * 2 + 1;
    VERTICAL_BLOCKS = MAZE_HEIGHT * 2 + 1;

    BLOCK_SIZE = Math.floor(Math.min(
        CANVAS_WIDTH / HORIZONTAL_BLOCKS,
        CANVAS_HEIGHT / VERTICAL_BLOCKS
    ));
    BLOCK_SIZE = Math.min(
        CANVAS_WIDTH / HORIZONTAL_BLOCKS,
        CANVAS_HEIGHT / VERTICAL_BLOCKS
    );

    canvas.width = CANVAS_WIDTH;
    canvas.height = CANVAS_HEIGHT;

    doReset();

    buttons.saveButton.disabled = true;
}

function doReset() {
    ctx.fillStyle = BACKGROUND_COLOR;
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    ctx.fillStyle = MAZE_COLOR;

    MAZE = new Maze({
        width: MAZE_WIDTH,
        height: MAZE_HEIGHT
    });
}

function doStep() {
    iterate();
}

function doAnimate() {
    if (ANIMATING) {
        // if we are currently animating, this acts as the stop button
        ANIMATING = false;
        buttons.animateButton.disabled = true;
        return;
    }

    buttons.saveButton.disabled = true;
    buttons.stepButton.disabled = true;
    buttons.resetButton.disabled = true;
    buttons.animateButton.textContent = 'stop';
    ANIMATING = true;

    function go() {
        if (!ANIMATING) {
            // we have been stopped
            done();
            return;
        }

        if (!iterate()) {
            // we are done
            done();
            return;
        }

        setTimeout(go, ANIMATION_DELAY);
    }

    function done() {
        buttons.saveButton.disabled = false;
        buttons.stepButton.disabled = false;
        buttons.resetButton.disabled = false;
        buttons.animateButton.disabled = false;
        buttons.animateButton.textContent = 'animate';
        ANIMATING = false;
    }

    go();
}

function parseValue(val) {
    var spl = val.split('x');

    if (spl.length !== 2) {
        error('invalid value: ' + val);
    }

    return spl.map(function (snum) {
        var num = parseInt(snum, 10);
        if (isNaN(num)) {
            error('not a number: ' + snum);
        }
        return num;
    });
}

function error(msg) {
    alert(msg);
    throw new Error(msg);
}

function iterate() {
    if (!MAZE) {
        error('no maze specified');
    }

    var obj = MAZE.step();

    if (!obj) {
        return false;
    }

    var x = [];
    var y = [];
    obj.forEach(function (change) {
        var idx = change.x * 2 + 1;
        var idy = change.y * 2 + 1;

        x.push(idx);
        y.push(idy);

        ctx.fillRect(idx * BLOCK_SIZE, idy * BLOCK_SIZE,
            BLOCK_SIZE, BLOCK_SIZE);
    });

    var addX = Math.abs(x[0] - x[1]) / 2;
    var addY = Math.abs(y[0] - y[1]) / 2;

    var newX = Math.min(x[0], x[1]) + addX;
    var newY = Math.min(y[0], y[1]) + addY;

    ctx.fillRect(newX * BLOCK_SIZE, newY * BLOCK_SIZE,
        BLOCK_SIZE, BLOCK_SIZE);

    return true;
}

doSave();
