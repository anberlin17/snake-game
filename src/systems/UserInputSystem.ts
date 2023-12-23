import ECS from '../ECS'
import System from '../modules/System'
import Game from '../main'
import { Velocity } from '../types/movement'

enum DirectionKey {
  ArrowUp = 'ArrowUp',
  ArrowDown = 'ArrowDown',
  ArrowLeft = 'ArrowLeft',
  ArrowRight = 'ArrowRight',
  w = 'ArrowUp',
  a = 'ArrowLeft',
  s = 'ArrowDown',
  d = 'ArrowRight'
}

export default class UserInputSystem extends System {
  key: string

  constructor(args: { tickInterval?: number } = {}) {
    super({ tickInterval: args.tickInterval })

    this.key = ''

    window.addEventListener('keydown', this.keydownEventListener.bind(this))
  }

  keydownEventListener(ev: KeyboardEvent) {
    if (ev.key in DirectionKey) {
      ev.preventDefault()
      this.key = DirectionKey[ev.key]
    }
  }

  getInputVelocity(velocity: Velocity) {
    const isIdle = velocity.x === 0 && velocity.y === 0
    switch (this.key) {
      case DirectionKey.ArrowUp:
        return velocity.y > 0 ? velocity : { x: 0, y: -1 }
      case DirectionKey.ArrowDown:
        return velocity.y < 0 || isIdle ? velocity : { x: 0, y: 1 }
      case DirectionKey.ArrowLeft:
        return velocity.x > 0 ? velocity : { x: -1, y: 0 }
      case DirectionKey.ArrowRight:
        return velocity.x < 0 ? velocity : { x: 1, y: 0 }
      default:
        return velocity
    }
  }

  main(_: Game) {
    const entity = ECS.queryEntity(['Controlled'])
    if (!entity) {
      return
    }

    const velocity = entity.getComponent<Velocity>('Velocity')
    if (velocity) {
      const { x, y } = this.getInputVelocity(velocity)
      velocity.x = x
      velocity.y = y
    }
  }
}
