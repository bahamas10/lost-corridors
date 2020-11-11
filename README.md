Lost Corridors
==============

A JavaScript implementation of the Recursive Backtracking Maze Generation
Algorithm modified to work in a step-by-step way.

About
-----

More information coming soon!

`Maze` object
--------------

`./lib/maze.js` contains code for a stand-alone `Maze` object that can be used
to generate (step-by-step) a maze in a 2D array.

For example:

``` js
var Maze = require('./lib/maze');

var maze = new Maze({
    width: 16,
    height: 9
});

var obj;

while ((obj = maze.step())) {
    console.log(obj);
}

console.log('done');
console.log(maze._asciiMaze);
console.log(maze.grid);
```

Algorithm
---------

More Info: https://weblog.jamisbuck.org/2010/12/27/maze-generation-recursive-backtracking

License
-------

MIT License
