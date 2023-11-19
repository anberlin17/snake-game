import ECS from '../ECS'
import System from '../modules/System'
import { SnakeBodyComponent } from '../components/SnakeBody'

class SnakeMovement extends System {
  constructor() {
    super()
  }

  update() {
    const snake = ECS.queryEntity(['SnakeBody'])
    if (!snake) {
      return
    }

    const velocity = snake.components.get('Velocity')
    if (!velocity || (velocity.x === 0 && velocity.y === 0)) {
      return
    }

    const snakeBody = snake.components.get('SnakeBody') as SnakeBodyComponent
    const bodyParts = snakeBody.parts

    if (snake.components.has('SnakeGrowUp')) {
      snakeBody.parts.unshift({
        x: bodyParts[0].x + velocity.x,
        y: bodyParts[0].y + velocity.y
      })

      snake.removeComponent('SnakeGrowUp')
    } else {
      for (let i = bodyParts.length - 1; i >= 0; i--) {
        if (i === 0) {
          bodyParts[i] = {
            x: bodyParts[i].x + velocity.x,
            y: bodyParts[i].y + velocity.y
          }
        } else {
          bodyParts[i] = bodyParts[i - 1]
        }
      }
    }
  }
}

export default SnakeMovement
