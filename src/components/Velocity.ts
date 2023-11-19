import { Vector2D } from '../math'

function Velocity({ x = 0, y = 0 } = {} as Vector2D) {
  return {
    name: 'Velocity',
    x,
    y
  }
}

export type VelocityComponent = ReturnType<typeof Velocity>

export default Velocity
