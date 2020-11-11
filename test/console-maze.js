var Maze = require('../lib/maze');

var maze = new Maze({
    width: 16*3,
    height: 9*3
});

function tick() {
    var obj = maze.step();

    if (!obj) {
        return;
    }

    process.stdout.write('\x1b[0f');
    console.log(maze._asciiMaze());
    setTimeout(tick, 2);
}
process.stdout.write('\x1b[2J\x1b[0f');
tick();
