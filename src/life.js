'use strict'

import Board from 'board'
import * as Cell from 'cell'

/**
 * Sets the context for the game. Responsible for rendering the game.
 */
const Life = (overrides) => {

  /**
   * Draw the cells.
   * @param Array cells
   * @return Void
   */
  function drawCells(cells) {
    cells.forEach((cell) => {
      const x = cell.getX() * (cellSize + cellMargin)
      const y = cell.getY() * (cellSize + cellMargin)

      context.fillStyle = cell.getIsAlive() ? config.colors.live : config.colors.dead
      context.fillRect(x, y,
        cellSize, cellSize);
    })
  }

  /**
   * Process a step in time by triggering a step in time on the board and
   * update the rendering.
   * @return Void
   */
  function step(timestamp) {

    // Calculate the milliseconds for a single frame per millisecond based on
    // the configured FPS.
    const singleFrameRate = (1000 / config.fps)

    // Set the start time if necessary.
    if (!start) {
      start = timestamp
    }

    // Determine if a frame needs to be rendered. If rendered then restart
    // the start time.
    if (timestamp - start >= singleFrameRate) {
      drawCells(board.tick())
      start = timestamp
    }

    // Process a browser repaint.
    window.requestAnimationFrame(step)
  }

  // Update the configuration with the provided overrides.
  const config = Object.assign({
      colors: {
        live: '#D0EAF7',
        dead: '#F7F8F8'
      },
      random: false,
      fullscreen: false,
      id: 'life',
      fps: 60
    }, overrides)

  // Store the canvas and context for drawing.
  const canvas = document.getElementById(config.id)
  const context = canvas.getContext('2d')

  // Store the start time for rendering.
  let start = null

  // Use the configured cell size and margin. Default to the default cell
  // configuration.
  let cellSize = config.cellSize ? config.cellSize : Cell.config.cellSize
  let cellMargin = config.cellMargin ? config.cellMargin : Cell.config.cellMargin

  const boardConfig = Object.assign({}, overrides)

  // Calculate cells per row and column.
  if (config.fullscreen) {
    boardConfig.cellsPerRow = Math.ceil(window.innerWidth / (cellSize + cellMargin))
    boardConfig.cellsPerColumn = Math.ceil(window.innerHeight / (cellSize + cellMargin))

    canvas.width = window.innerWidth
    canvas.height = window.innerHeight
  } else {
    boardConfig.cellsPerRow = Math.ceil(canvas.width / (cellSize + cellMargin))
    boardConfig.cellsPerColumn = Math.ceil(canvas.height / (cellSize + cellMargin))
  }

  // Instatiate a board with the provided overrides.
  const board = Board(boardConfig)

  // Render the initial state of the board.
  drawCells(board.getCells())

  // Start the animation.
  window.requestAnimationFrame(step)
}

export default Life
