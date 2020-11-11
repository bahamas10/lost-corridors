/*
 * An implementation of the Recursive Backtracking Maze Generation Algorithm.
 * More info: https://weblog.jamisbuck.org/2010/12/27/maze-generation-recursive-backtracking
 *
 * Author: Dave Eddy <dave@daveeddy.com>
 * Date: November 11, 2020
 * License: MIT
 */

/*
 * This algorithm has been modified to be able to be executed in a step-by-step
 * fashion.  The maze can be constructed a single step at a time, with an
 * object being returned every step that outlines only the changes made to the
 * maze in that single step.
 *
 * Example:
 * var maze = new Maze({
 *   width: 16,
 *   height: 9
 * });
 *
 * var obj;
 * while ((obj = maze.step())) {
 *   console.log('single step taken');
 *   console.log('changes: %j', obj);
 * }
 * console.log('full maze generated');
 * console.log(maze._asciiMaze());
 * console.log(maze.grid);
 */
function Maze(opts) {
    var self = this;

    self.width = opts.width;
    self.height = opts.height;

    self.stack = [];
    self.grid = [];

    for (var i = 0; i < self.height; i++) {
        self.grid[i] = [];
        for (var j = 0; j < self.width; j++) {
            self.grid[i][j] = {
                east: false,
                west: false,
                north: false,
                south: false
            };
        }
    }

    Maze.DIRECTIONS.forEach(function (direction) {
        self.stack.push({
            x: 0,
            y: 0,
            direction: direction
        });
    });
}

Maze.shuffleArray = function shuffleArray(arr) {
    return arr.sort(function (a, b) {
        return Math.random() - 0.5;
    });
};

Maze.DIRECTIONS = [
    'east',
    'west',
    'north',
    'south'
];

Maze.DX = {
    east: 1,
    west: -1,
    north: 0,
    south: 0
};

Maze.DY = {
    east: 0,
    west: 0,
    north: -1,
    south: 1
};

Maze.OPPOSITE = {
    east: 'west',
    west: 'east',
    north: 'south',
    south: 'north'
};

Maze.prototype.step = function step() {
    var self = this;

    var height = self.height;
    var width = self.width;
    var op = self.stack.pop();

    if (!op) {
        return false;
    }

    var cy = op.y;
    var cx = op.x;
    var direction = op.direction;
    var oppoDirection = Maze.OPPOSITE[direction];

    var curPiece = self.grid[cy][cx];

    var nx = cx + Maze.DX[direction];
    var ny = cy + Maze.DY[direction];

    // check bounds
    if (nx < 0 || nx >= width || ny < 0 || ny >= height) {
        // piece out of bounds
        return self.step();
    }

    var newPiece = self.grid[ny][nx];

    // check if already visited
    var hasBeenVisited = false;
    Maze.DIRECTIONS.forEach(function (dir) {
        if (newPiece[dir]) {
            hasBeenVisited = true;
        }
    });

    if (hasBeenVisited) {
        // this piece already has been visited - skip it
        return self.step();
    }

    // piece is valid! update the grid and push new directions into the stack
    curPiece[direction] = true;
    newPiece[oppoDirection] = true;

    Maze.shuffleArray(Maze.DIRECTIONS).filter(function (dir) {
        return dir !== oppoDirection;
    }).forEach(function (dir) {
        self.stack.push({
            x: nx,
            y: ny,
            direction: dir
        });
    });

    // return changes
    return [
        {
            x: cx,
            y: cy,
            direction: direction
        },
        {
            x: nx,
            y: ny,
            direction: oppoDirection
        }
    ];
};

Maze.prototype._asciiMaze = function _asciiMaze() {
    var self = this;

    var s = '';

    for (var i = 0; i < self.grid.length; i++) {
        s += '|';
        for (var j = 0; j < self.grid[0].length; j++) {
            var piece = self.grid[i][j];
            s += piece.south ? ' ' : '_';
            s += piece.east ? ' ' : '|';
        }
        s += '\n';
    }

    return s;
};

if (typeof (module) !== 'undefined' && module.exports) {
    module.exports = Maze;
}
