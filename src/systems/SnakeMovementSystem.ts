import ECS from '../ECS'
import System from '../modules/System'
import { SnakeBodyComponent } from '../components/SnakeBody'
import { Velocity } from '../types/movement'
import Game from '../main'

export default class SnakeMovementSystem extends System {
  main(_: Game) {
    const snake = ECS.queryEntity(['SnakeBody'])
    if (!snake) {
      return
    }

    const velocity = snake.getComponent<Velocity>('Velocity')
    if (!velocity || (velocity.x === 0 && velocity.y === 0)) {
      return
    }

    const snakeBody = snake.getComponent<SnakeBodyComponent>('SnakeBody')
    const bodyParts = snakeBody.blocks

    if (snake.hasComponent('SnakeGrowUp')) {
      snakeBody.blocks.unshift({
        col: bodyParts[0].col + velocity.x,
        row: bodyParts[0].row + velocity.y
      })

      snake.removeComponent('SnakeGrowUp')
    } else {
      for (let i = bodyParts.length - 1; i >= 0; i--) {
        if (i === 0) {
          bodyParts[i] = {
            col: bodyParts[i].col + velocity.x,
            row: bodyParts[i].row + velocity.y
          }
        } else {
          bodyParts[i] = bodyParts[i - 1]
        }
      }
    }
  }
}
