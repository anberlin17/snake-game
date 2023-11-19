import { Vector2D } from '../math'

function Position({ x = 0, y = 0 } = {} as Vector2D) {
  return {
    name: 'Position',
    x,
    y
  }
}

export default Position
