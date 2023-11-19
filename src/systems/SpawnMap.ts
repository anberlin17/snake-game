import Game from '../main'
import System from '../modules/System'
import { GAME_FIELD_SIZE } from '../settings'

class SpawnMap extends System {
  update(game: Game) {
    const cellSize = game.getCellSize()

    game.ctx.strokeStyle = 'rgba(0,0,0,0.4)'
    game.ctx.lineWidth = 0.25
    game.ctx.beginPath()
    for (let i = 0; i < GAME_FIELD_SIZE; i++) {
      game.ctx.moveTo(0, cellSize * i)
      game.ctx.lineTo(game.ctx.canvas.width, cellSize * i)
    }

    for (let i = 0; i < GAME_FIELD_SIZE; i++) {
      game.ctx.moveTo(cellSize * i, 0)
      game.ctx.lineTo(cellSize * i, game.ctx.canvas.width)
    }
    game.ctx.stroke()
    game.ctx.lineWidth = 1
  }
}

export default SpawnMap
