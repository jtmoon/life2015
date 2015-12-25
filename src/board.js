'use strict'

import * as Cell from 'cell'

const Board = (overrides) => {
  const config = Object.assign({
      cellsPerRow: 100,
      cellsPerColumn: 100,
      randomPercentage: 0
    }, overrides)

  /**
   * Calculate the `x` and `y` position of a cell based on the provided index.
   * @param Number index
   * @return Map
   */
  function calculateCellPosition(index) {
    const position = new Map()

    if (index < config.cellsPerRow) {
      position.set(Cell.ATTR_POSITION_Y, 0)
      position.set(Cell.ATTR_POSITION_X, index)
    } else {
      position.set(Cell.ATTR_POSITION_Y, Math.floor(index / config.cellsPerRow))
      position.set(Cell.ATTR_POSITION_X, index % config.cellsPerRow)
    }

    return position
  }

  /**
   * Calculate the index of a cell in the cells array using the provided position.
   * @param Map position
   * @return Number
   */
  function calculateCellIndex(position) {

    // We can use the formula we used to determine the x and y in
    // `populateBoard` to solve for the index of the cell based on the
    // cell's x and y. Every y is considered a new row so we multiply
    // y by the number of cells per row and add x to determine the index.
    const cellIndex = (position.get(Cell.ATTR_POSITION_Y) * config.cellsPerRow)
      + position.get(Cell.ATTR_POSITION_X)

    return cellIndex
  }

  /**
   * Find the neighbors of a target cell.
   * @param Cell cell
   * @return Array
   */
  function getNeighbors(cell) {
    let neighbors = [];

    // A cells neighbors is all vertically, horizontally, and
    // diagonally adjacent cells. To find all neighbors we need to
    // iterate the 3x3 area surrounding the target cell. We can
    // accomplish this by starting our iteration one cell less than
    // the target cell, and end one cell beyond.
    let y = cell.getY() - 1
    let yBoundary = cell.getY() + 1

    while (y <= yBoundary) {

      // If the starting cell is out of bounds then we need to
      // determine which boundary is being violated. We will treat this
      // as an infinite space so the cell will switch to evaluating
      // the cell on the opposite end of the board.

      // If we are within the accepted boundaries then use the position.
      let yPosition = 0

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

      let x = cell.getX() - 1
      let xBoundary = cell.getX() + 1

      while (x <= xBoundary) {

        // Similar to the y boundary, we need to determine if a
        // boundary is being violated, and respond accordingly.
        let xPosition = 0

        if (x >= 0 && x < config.cellsPerRow) {
          xPosition = x;
        } else {
          if (x < 0) {
            xPosition = config.cellsPerRow - 1;
          }
        }

        // Determine the index of the neighboring cell.
        const cellPosition = new Map()
          .set(Cell.ATTR_POSITION_Y, yPosition)
          .set(Cell.ATTR_POSITION_X, xPosition)
        const neighborIndex = calculateCellIndex(cellPosition)

        // Verify this cell is not the same as the target cell.
        // If it's not the same cell then add it to the array of
        // neighboring cells.
        let neighboringCell = cells[neighborIndex];

        if (neighboringCell !== cell) {
          neighbors.push(neighboringCell);
        }

        // Increment x position
        x++
      }

      // Increment y position
      y++
    }

    return neighbors;
  }

  const totalCells = config.cellsPerRow * config.cellsPerColumn
  const cells = []
  let cellCounter = 0

  // Generate cells.
  while (cellCounter < totalCells) {

    // Get a cell instance from the cell factory.
    const cell = Cell.Cell()

    // Determine the position of the cell.
    const position = calculateCellPosition(cellCounter)
    cell.setX(position.get(Cell.ATTR_POSITION_X))
    cell.setY(position.get(Cell.ATTR_POSITION_Y))

    // If a random percentage is set then use it to randomly determine cells
    // that should start as alive. A cell's default state for isAlive is `false`.
    if (config.randomPercentage > 0 && config.randomPercentage <= 100) {

      // Get a float representing the percentage and get a random float
      // using Math.random.
      const ratio = config.randomPercentage / 100;
      const randomFloat = Math.random();

      // If the ratio is greater than the random float then revive the cell.
      if (ratio >= randomFloat) {
        cell.revive();
      }
    }

    // Add the cell to the set.
    cells.push(cell)

    // Increment counter.
    cellCounter++
  }

  return {
    tick() {
      const updatedCells = []

      // Iterate each cell and evaluate to determine if the cell should live or die.
      cells.forEach((cell) => {
        let neighbors = getNeighbors(cell)

        // Filter neighbors to get living neighbors.
        let livingNeighbors = neighbors.filter((neighbor) => {
          return neighbor.getIsAlive()
        })

        cell.evaluate(livingNeighbors.length)

        if (cell.getIsAlive() !== cell.getWillLive()) {
          updatedCells.push(cell)
        }
      })

      // Iterate updated cells and update their state.
      updatedCells.forEach((cell) => {
        cell.update()
      })

      return updatedCells
    },
    getCells() {
      return cells
    }
  }
}

export default Board
