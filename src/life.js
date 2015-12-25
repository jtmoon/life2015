'use strict'

import Board from 'board'
import * as Cell from 'cell'

const Life = (overrides) => {
  function drawCells(cells) {
    cells.forEach((cell) => {
      const x = cell.getX() * (cellSize + cellMargin)
      const y = cell.getY() * (cellSize + cellMargin)

      context.fillStyle = cell.getIsAlive() ? config.colors.live : config.colors.dead
      context.fillRect(x, y,
        cellSize, cellSize);
    })
  }

  function step(timestamp) {
    if (!start) {
      start = timestamp
    }

    if (timestamp - start >= 100) {
      drawCells(board.tick())
      start = timestamp
    }

    window.requestAnimationFrame(step)
  }

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

  let canvas = document.getElementById(config.id)
  const context = canvas.getContext('2d')

  let start = null
  let cellSize = config.cellSize ? config.cellSize : Cell.config.cellSize
  let cellMargin = config.cellMargin ? config.cellMargin : Cell.config.cellMargin

  const boardConfig = Object.assign({}, overrides)

  if (config.fullscreen) {
    boardConfig.cellsPerRow = Math.ceil(window.innerWidth / (cellSize + cellMargin))
    boardConfig.cellsPerColumn = Math.ceil(window.innerHeight / (cellSize + cellMargin))

    canvas.width = window.innerWidth
    canvas.height = window.innerHeight
  } else {
    boardConfig.cellsPerRow = Math.ceil(canvas.width / (cellSize + cellMargin))
    boardConfig.cellsPerColumn = Math.ceil(canvas.height / (cellSize + cellMargin))
  }

  const board = Board(boardConfig)

  drawCells(board.getCells())

  window.requestAnimationFrame(step)
}

export default Life
