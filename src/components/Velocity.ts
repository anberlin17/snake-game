import { Velocity } from '../types/movement'

function Velocity(value: Velocity = { x: 0, y: 0 }) {
  return {
    name: 'Velocity',
    x: value.x,
    y: value.y
  }
}

export type VelocityComponent = ReturnType<typeof Velocity>

export default Velocity
