import ECS from '../ECS'
import Components from '../components'
import System from '../modules/System'
import { SnakeBodyComponent } from '../components/SnakeBody'
import Game from '../main'

class SpawnFood extends System {
  constructor() {
    super()
  }

  createFoodEntity(game: Game) {
    const snake = ECS.queryEntity(['SnakeBody'])
    if (!snake) return

    const food = ECS.createEntity()
    food.addComponent(Components.Food())
    food.addComponent(Components.Position())

    const position = food.components.get('Position')
    const snakeBody = snake.components.get('SnakeBody') as SnakeBodyComponent

    let cell = { x: 0, y: 0 }
    do {
      cell = game.getRandomPosition()
    } while (snakeBody.parts.some(({ x, y }) => x === cell.x && y === cell.y))

    position.x = cell.x
    position.y = cell.y

    return food
  }

  update(game: Game) {
    const entity = ECS.queryEntity(['Food']) || this.createFoodEntity(game)
    if (!entity) return

    const cellSize = game.getCellSize()
    const position = entity.components.get('Position')

    const { x, y } = game.getCoordOfCell(position.x, position.y)

    game.ctx.fillStyle = '#AAD372'
    game.ctx.beginPath()
    game.ctx.arc(x + cellSize / 2, y + cellSize / 2, cellSize * 0.4, 0, 2 * Math.PI)
    game.ctx.fill()
  }
}

export default SpawnFood
