import ECS from '../ECS'
import System from '../modules/System'
import { SnakeBodyComponent } from '../components/SnakeBody'
import Game from '../main'

class SpawnSnake extends System {
  constructor() {
    super()
  }

  update(game: Game) {
    game.ctx.fillStyle = '#555'

    const cellSize = game.getCellSize()

    const entity = ECS.queryEntity(['SnakeBody'])
    if (!entity) return

    const snakeBody = entity.components.get('SnakeBody') as SnakeBodyComponent
    snakeBody.parts.forEach(part => {
      const { x, y } = game.getCoordOfCell(part.x, part.y)

      game.ctx.strokeStyle = '#fff'
      game.ctx.fillRect(x, y, cellSize, cellSize)
      game.ctx.strokeRect(x, y, cellSize, cellSize)
    })
  }
}

export default SpawnSnake
