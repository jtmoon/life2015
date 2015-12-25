'use strict'

const ATTR_POSITION_X = 'x'
const ATTR_POSITION_Y = 'y'

// Default configuration for the cell. `conditions` determines how many
// living neighbors result in the cell living or dying.
const config = {
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
  }

/**
 * A cell is responsible for:
 * 1) Preserving its own state of alive or dead.
 * 2) Evaluating if it needs to live or die.
 * A cell is isolated and has no awareness of its surroundings.
 * It relies on the board to notify it of changes that affect it.
 */
const Cell = (overrides) => {

  // Update the configuration with the provided overrides.
  const cellConfig = Object.assign(config, overrides)

  // Store the `x` and `y` values.
  const position = new Map()
    .set(ATTR_POSITION_X, 0)
    .set(ATTR_POSITION_Y, 0)
  let isAlive = false
  let willLive = false

  return {
    setIsAlive(bool) {
      isAlive = bool
    },
    getIsAlive() {
      return isAlive
    },
    setWillLive(bool) {
      willLive = bool
    },
    getWillLive() {
      return willLive
    },
    setX(pos) {
      position.set(ATTR_POSITION_X, pos)
    },
    getX() {
      return position.get(ATTR_POSITION_X)
    },
    setY(pos) {
      position.set(ATTR_POSITION_Y, pos)
    },
    getY() {
      return position.get(ATTR_POSITION_Y)
    },
    getPosition() {
      return position
    },

    /**
     * Change the cell's state to dead.
     * @return Void
     */
    kill() {
      this.setIsAlive(false)
      this.setWillLive(false)
    },

    /**
     * Change the cell's state to alive.
     * @return Void
     */
    revive() {
      this.setIsAlive(true)
      this.setWillLive(false)
    },

    /**
     * Determine if the cell will live based on the number of
     * living neighbors.
     * @param Number livingNeighbors
     * @return Void
     */
    evaluate(livingNeighbors) {
      willLive = isAlive ?
        cellConfig.conditions.alive.hasOwnProperty(livingNeighbors) :
        cellConfig.conditions.dead.hasOwnProperty(livingNeighbors)
    },

    /**
     * Update the state of the cell.
     * @return Void
     */
    update() {
      if (willLive) {
        this.revive()
      } else {
        this.kill()
      }
    }
  }
}

export { Cell, config, ATTR_POSITION_X, ATTR_POSITION_Y }
