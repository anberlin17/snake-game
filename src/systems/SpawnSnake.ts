import ECS from '../ECS'
import System from '../modules/System'
import { SnakeBodyComponent } from '../components/SnakeBody'
import Game from '../main'

class SpawnSnake extends System {
  constructor() {
    super()
  }

  update(game: Game) {
    game.ctx.fillStyle = '#0b0b0b'
    game.ctx.strokeStyle = '#0b0b0b'
    game.ctx.lineWidth = 2

    const cellSize = game.getCellSize()
    const borderSize = cellSize * 0.9
    const blockSize = cellSize * 0.75

    const entity = ECS.queryEntity(['SnakeBody'])
    if (!entity) return

    const snakeBody = entity.components.get('SnakeBody') as SnakeBodyComponent
    snakeBody.parts.forEach(part => {
      const { x, y } = game.getCoordOfCell(part.x, part.y)

      {
        const offset = (cellSize - blockSize) / 2
        game.ctx.fillRect(x + offset, y + offset, blockSize, blockSize)
      }
      {
        const offset = (cellSize - borderSize) / 2
        game.ctx.strokeRect(x + offset, y + offset, borderSize, borderSize)
      }
    })
  }
}

export default SpawnSnake
