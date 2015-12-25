'use strict'

const ATTR_POSITION_X = 'x'
const ATTR_POSITION_Y = 'y'
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

const Cell = (overrides) => {
  const cellConfig = Object.assign(config, overrides)
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
    kill() {
      this.setIsAlive(false)
      this.setWillLive(false)
    },
    revive() {
      this.setIsAlive(true)
      this.setWillLive(false)
    },
    evaluate(livingNeighbors) {
      willLive = isAlive ?
        cellConfig.conditions.alive.hasOwnProperty(livingNeighbors) :
        cellConfig.conditions.dead.hasOwnProperty(livingNeighbors)
    },
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
