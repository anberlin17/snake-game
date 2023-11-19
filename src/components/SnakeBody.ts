import { Vector2D } from '../math'

function SnakeBody(parts: Vector2D[] = []) {
  return {
    name: 'SnakeBody',
    parts
  }
}

export type SnakeBodyComponent = ReturnType<typeof SnakeBody>

export default SnakeBody
