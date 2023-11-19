import ECS from '../ECS'
import System from '../modules/System'
import { SnakeBodyComponent } from '../components/SnakeBody'
import components from '../components'
import Game from '../main'
import { GAME_FIELD_SIZE } from '../settings'

class CollisionDetection extends System {
  constructor() {
    super()
  }

  update(game: Game) {
    const food = ECS.queryEntity(['Food'])
    const snake = ECS.queryEntity(['SnakeBody'])
    if (!food || !snake) return

    const snakeBody = snake.components.get('SnakeBody') as SnakeBodyComponent
    const foodPosition = food.components.get('Position')

    const head = snakeBody.parts[0]
    if (head.x === foodPosition.x && head.y === foodPosition.y) {
      ECS.removeEntity(food)
      snake.addComponent(components.SnakeGrowUp())

      game.setScore(game.score + 1)
    }

    // Detect collision with the body
    const body = snakeBody.parts.slice(1)
    for (const part of body) {
      if (head.x === part.x && head.y === part.y) {
        game.stop()
      }
    }

    // Detect collision with the wall
    if (head.x < 0 || head.x >= GAME_FIELD_SIZE || head.y < 0 || head.y >= GAME_FIELD_SIZE) {
      game.stop()
    }
  }
}

export default CollisionDetection
