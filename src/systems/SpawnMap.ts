import Game from '../main'
import System from '../modules/System'

class SpawnMap extends System {
  update(game: Game) {
    const borderSize = game.getCellSize()
    const rectSize = borderSize * 0.75

    game.ctx.fillStyle = 'rgba(11, 11, 11, 0.05)'
    game.ctx.strokeStyle = 'rgba(11, 11, 11, 0.05)'
    game.ctx.lineWidth = 1

    game.ctx.beginPath()
    for (let i = 0; i < game.fieldSize; i++) {
      const x = borderSize * i

      for (let j = 0; j < game.fieldSize; j++) {
        const y = borderSize * j

        const offset = (borderSize - rectSize) / 2

        game.ctx.fillRect(x + offset, y + offset, rectSize, rectSize)
        game.ctx.strokeRect(x, y, borderSize, borderSize)
      }
    }
  }
}

export default SpawnMap
