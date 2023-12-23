import { GridPosition } from '../types/movement'

function SnakeBody(blocks: GridPosition[] = []) {
  return {
    name: 'SnakeBody',
    blocks
  }
}

export type SnakeBodyComponent = ReturnType<typeof SnakeBody>

export default SnakeBody
