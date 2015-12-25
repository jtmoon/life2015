/******/ (function(modules) { // webpackBootstrap
/******/ 	// The module cache
/******/ 	var installedModules = {};

/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {

/******/ 		// Check if module is in cache
/******/ 		if(installedModules[moduleId])
/******/ 			return installedModules[moduleId].exports;

/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = installedModules[moduleId] = {
/******/ 			exports: {},
/******/ 			id: moduleId,
/******/ 			loaded: false
/******/ 		};

/******/ 		// Execute the module function
/******/ 		modules[moduleId].call(module.exports, module, module.exports, __webpack_require__);

/******/ 		// Flag the module as loaded
/******/ 		module.loaded = true;

/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}


/******/ 	// expose the modules object (__webpack_modules__)
/******/ 	__webpack_require__.m = modules;

/******/ 	// expose the module cache
/******/ 	__webpack_require__.c = installedModules;

/******/ 	// __webpack_public_path__
/******/ 	__webpack_require__.p = "";

/******/ 	// Load entry module and return exports
/******/ 	return __webpack_require__(0);
/******/ })
/************************************************************************/
/******/ ([
/* 0 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	var _life = __webpack_require__(1);

	var _life2 = _interopRequireDefault(_life);

	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

	window.Life = _life2.default;

/***/ },
/* 1 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	Object.defineProperty(exports, "__esModule", {
	  value: true
	});

	var _board = __webpack_require__(2);

	var _board2 = _interopRequireDefault(_board);

	var _cell = __webpack_require__(3);

	var Cell = _interopRequireWildcard(_cell);

	function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } else { var newObj = {}; if (obj != null) { for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) newObj[key] = obj[key]; } } newObj.default = obj; return newObj; } }

	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

	/**
	 * Sets the context for the game. Responsible for rendering the game.
	 */
	var Life = function Life(overrides) {
	  function drawCells(cells) {
	    cells.forEach(function (cell) {
	      var x = cell.getX() * (cellSize + cellMargin);
	      var y = cell.getY() * (cellSize + cellMargin);

	      context.fillStyle = cell.getIsAlive() ? config.colors.live : config.colors.dead;
	      context.fillRect(x, y, cellSize, cellSize);
	    });
	  }

	  /**
	   * Process a step in time by triggering a step in time on the board and
	   * update the rendering.
	   * @return Void
	   */
	  function step(timestamp) {
	    if (!start) {
	      start = timestamp;
	    }

	    var singleFrameRate = 1000 / config.fps;

	    if (timestamp - start >= singleFrameRate) {
	      drawCells(board.tick());
	      start = timestamp;
	    }

	    window.requestAnimationFrame(step);
	  }

	  // Update the configuration with the provided overrides.
	  var config = Object.assign({
	    colors: {
	      live: '#D0EAF7',
	      dead: '#F7F8F8'
	    },
	    random: false,
	    fullscreen: false,
	    id: 'life',
	    fps: 60
	  }, overrides);

	  // Store the canvas and context for drawing.
	  var canvas = document.getElementById(config.id);
	  var context = canvas.getContext('2d');

	  var start = null;
	  var cellSize = config.cellSize ? config.cellSize : Cell.config.cellSize;
	  var cellMargin = config.cellMargin ? config.cellMargin : Cell.config.cellMargin;

	  var boardConfig = Object.assign({}, overrides);

	  // Calculate cells per row and column.
	  if (config.fullscreen) {
	    boardConfig.cellsPerRow = Math.ceil(window.innerWidth / (cellSize + cellMargin));
	    boardConfig.cellsPerColumn = Math.ceil(window.innerHeight / (cellSize + cellMargin));

	    canvas.width = window.innerWidth;
	    canvas.height = window.innerHeight;
	  } else {
	    boardConfig.cellsPerRow = Math.ceil(canvas.width / (cellSize + cellMargin));
	    boardConfig.cellsPerColumn = Math.ceil(canvas.height / (cellSize + cellMargin));
	  }

	  // Instatiate a board with the provided overrides.
	  var board = (0, _board2.default)(boardConfig);

	  // Render the initial state of the board.
	  drawCells(board.getCells());

	  // Start the animation.
	  window.requestAnimationFrame(step);
	};

	exports.default = Life;

/***/ },
/* 2 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	Object.defineProperty(exports, "__esModule", {
	  value: true
	});

	var _cell = __webpack_require__(3);

	var Cell = _interopRequireWildcard(_cell);

	function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } else { var newObj = {}; if (obj != null) { for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) newObj[key] = obj[key]; } } newObj.default = obj; return newObj; } }

	var Board = function Board(overrides) {
	  var config = Object.assign({
	    cellsPerRow: 100,
	    cellsPerColumn: 100,
	    randomPercentage: 0
	  }, overrides);

	  function calculateCellPosition(index) {
	    var position = new Map();

	    if (index < config.cellsPerRow) {
	      position.set(Cell.ATTR_POSITION_Y, 0);
	      position.set(Cell.ATTR_POSITION_X, index);
	    } else {
	      position.set(Cell.ATTR_POSITION_Y, Math.floor(index / config.cellsPerRow));
	      position.set(Cell.ATTR_POSITION_X, index % config.cellsPerRow);
	    }

	    return position;
	  }

	  function calculateCellIndex(position) {

	    // We can use the formula we used to determine the x and y in
	    // `populateBoard` to solve for the index of the cell based on the
	    // cell's x and y. Every y is considered a new row so we multiply
	    // y by the number of cells per row and add x to determine the index.
	    var cellIndex = position.get(Cell.ATTR_POSITION_Y) * config.cellsPerRow + position.get(Cell.ATTR_POSITION_X);

	    return cellIndex;
	  }

	  function getNeighbors(cell) {
	    var neighbors = [];

	    // A cells neighbors is all vertically, horizontally, and
	    // diagonally adjacent cells. To find all neighbors we need to
	    // iterate the 3x3 area surrounding the target cell. We can
	    // accomplish this by starting our iteration one cell less than
	    // the target cell, and end one cell beyond.
	    var y = cell.getY() - 1;
	    var yBoundary = cell.getY() + 1;

	    while (y <= yBoundary) {

	      // If the starting cell is out of bounds then we need to
	      // determine which boundary is being violated. We will treat this
	      // as an infinite space so the cell will switch to evaluating
	      // the cell on the opposite end of the board.

	      // If we are within the accepted boundaries then use the position.
	      var yPosition = 0;

	      if (y >= 0 && y < config.cellsPerColumn) {
	        yPosition = y;
	      } else {

	        // If we are negative then we have stretched beyond the top boundary.
	        // Update the position to be at the bottom boundary. Otherwise, we
	        // have stretched beyond the bottom boundary so update the position
	        // to be at the top boundary.
	        if (y < 0) {
	          yPosition = config.cellsPerColumn - 1;
	        }
	      }

	      var x = cell.getX() - 1;
	      var xBoundary = cell.getX() + 1;

	      while (x <= xBoundary) {

	        // Similar to the y boundary, we need to determine if a
	        // boundary is being violated, and respond accordingly.
	        var xPosition = 0;

	        if (x >= 0 && x < config.cellsPerRow) {
	          xPosition = x;
	        } else {
	          if (x < 0) {
	            xPosition = config.cellsPerRow - 1;
	          }
	        }

	        // Determine the index of the neighboring cell.
	        var cellPosition = new Map().set(Cell.ATTR_POSITION_Y, yPosition).set(Cell.ATTR_POSITION_X, xPosition);
	        var neighborIndex = calculateCellIndex(cellPosition);

	        // Verify this cell is not the same as the target cell.
	        // If it's not the same cell then add it to the array of
	        // neighboring cells.
	        var neighboringCell = cells[neighborIndex];

	        if (neighboringCell !== cell) {
	          neighbors.push(neighboringCell);
	        }

	        // Increment x position
	        x++;
	      }

	      // Increment y position
	      y++;
	    }

	    return neighbors;
	  }

	  var totalCells = config.cellsPerRow * config.cellsPerColumn;
	  var cells = [];
	  var cellCounter = 0;

	  // Generate cells.
	  while (cellCounter < totalCells) {

	    // Get a cell instance from the cell factory.
	    var cell = Cell.Cell();

	    // Determine the position of the cell.
	    var position = calculateCellPosition(cellCounter);
	    cell.setX(position.get(Cell.ATTR_POSITION_X));
	    cell.setY(position.get(Cell.ATTR_POSITION_Y));

	    // If a random percentage is set then use it to randomly determine cells
	    // that should start as alive. A cell's default state for isAlive is `false`.
	    if (config.randomPercentage > 0 && config.randomPercentage <= 100) {

	      // Get a float representing the percentage and get a random float
	      // using Math.random.
	      var ratio = config.randomPercentage / 100;
	      var randomFloat = Math.random();

	      // If the ratio is greater than the random float then revive the cell.
	      if (ratio >= randomFloat) {
	        cell.revive();
	      }
	    }

	    // Add the cell to the set.
	    cells.push(cell);

	    // Increment counter.
	    cellCounter++;
	  }

	  return {
	    tick: function tick() {
	      var updatedCells = [];

	      // Iterate each cell and evaluate to determine if the cell should live or die.
	      cells.forEach(function (cell) {
	        var neighbors = getNeighbors(cell);
	        var livingNeighbors = neighbors.filter(function (neighbor) {
	          return neighbor.getIsAlive();
	        });

	        cell.evaluate(livingNeighbors.length);

	        if (cell.getIsAlive() !== cell.getWillLive()) {
	          updatedCells.push(cell);
	        }
	      });

	      updatedCells.forEach(function (cell) {
	        cell.update();
	      });

	      return updatedCells;
	    },
	    getCells: function getCells() {
	      return cells;
	    }
	  };
	};

	exports.default = Board;

/***/ },
/* 3 */
/***/ function(module, exports) {

	'use strict';

	Object.defineProperty(exports, "__esModule", {
	  value: true
	});
	var ATTR_POSITION_X = 'x';
	var ATTR_POSITION_Y = 'y';

	// Default configuration for the cell. `conditions` determines how many
	// living neighbors result in the cell living or dying.
	var config = {
	  cellSize: 10,
	  cellMargin: 2,
	  conditions: {
	    alive: {
	      2: true,
	      3: true
	    },
	    dead: {
	      3: true
	    }
	  }
	};

	/**
	 * A cell is responsible for:
	 * 1) Preserving its own state of alive or dead.
	 * 2) Evaluating if it needs to live or die.
	 * A cell is isolated and has no awareness of its surroundings.
	 * It relies on the board to notify it of changes that affect it.
	 */
	var Cell = function Cell(overrides) {

	  // Update the configuration with the provided overrides.
	  var cellConfig = Object.assign(config, overrides);

	  // Store the `x` and `y` values.
	  var position = new Map().set(ATTR_POSITION_X, 0).set(ATTR_POSITION_Y, 0);
	  var isAlive = false;
	  var willLive = false;

	  return {
	    setIsAlive: function setIsAlive(bool) {
	      isAlive = bool;
	    },
	    getIsAlive: function getIsAlive() {
	      return isAlive;
	    },
	    setWillLive: function setWillLive(bool) {
	      willLive = bool;
	    },
	    getWillLive: function getWillLive() {
	      return willLive;
	    },
	    setX: function setX(pos) {
	      position.set(ATTR_POSITION_X, pos);
	    },
	    getX: function getX() {
	      return position.get(ATTR_POSITION_X);
	    },
	    setY: function setY(pos) {
	      position.set(ATTR_POSITION_Y, pos);
	    },
	    getY: function getY() {
	      return position.get(ATTR_POSITION_Y);
	    },
	    getPosition: function getPosition() {
	      return position;
	    },

	    /**
	     * Change the cell's state to dead.
	     * @return Void
	     */
	    kill: function kill() {
	      this.setIsAlive(false);
	      this.setWillLive(false);
	    },

	    /**
	     * Change the cell's state to alive.
	     * @return Void
	     */
	    revive: function revive() {
	      this.setIsAlive(true);
	      this.setWillLive(false);
	    },

	    /**
	     * Determine if the cell will live based on the number of
	     * living neighbors.
	     * @param Number livingNeighbors
	     * @return Void
	     */
	    evaluate: function evaluate(livingNeighbors) {
	      willLive = isAlive ? cellConfig.conditions.alive.hasOwnProperty(livingNeighbors) : cellConfig.conditions.dead.hasOwnProperty(livingNeighbors);
	    },

	    /**
	     * Update the state of the cell.
	     * @return Void
	     */
	    update: function update() {
	      if (willLive) {
	        this.revive();
	      } else {
	        this.kill();
	      }
	    }
	  };
	};

	exports.Cell = Cell;
	exports.config = config;
	exports.ATTR_POSITION_X = ATTR_POSITION_X;
	exports.ATTR_POSITION_Y = ATTR_POSITION_Y;

/***/ }
/******/ ]);