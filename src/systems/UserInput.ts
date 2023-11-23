import ECS from '../ECS'
import System from '../modules/System'
import { VelocityComponent } from '../components/Velocity'
import Game from '../main'
import { Vector2D } from '../math'

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

class UserInput extends System {
  key: string

  constructor() {
    super()

    this.key = ''

    const controlUp = document.getElementById('controlUp')
    const controlRight = document.getElementById('controlRight')
    const controlDown = document.getElementById('controlDown')
    const controlLeft = document.getElementById('controlLeft')

    controlUp.ontouchstart = () => {
      this.key = DirectionKey.ArrowUp
    }

    controlRight.ontouchstart = () => {
      this.key = DirectionKey.ArrowRight
    }

    controlDown.ontouchstart = () => {
      this.key = DirectionKey.ArrowDown
    }

    controlLeft.ontouchstart = () => {
      this.key = DirectionKey.ArrowLeft
    }

    window.addEventListener('keydown', this.keydownEventListener.bind(this))
  }

  keydownEventListener(ev: KeyboardEvent) {
    if (ev.key in DirectionKey) {
      ev.preventDefault()
      this.key = DirectionKey[ev.key]
    }
  }

  getInputVelocity(velocity: Vector2D) {
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

  update(game: Game) {
    const entity = ECS.queryEntity(['SnakeBody'])
    if (!entity) {
      return
    }

    const velocity = entity.components.get('Velocity') as VelocityComponent
    if (!velocity) {
      return
    }

    const { x, y } = this.getInputVelocity(velocity)
    velocity.x = x
    velocity.y = y
  }

  destroy() {
    window.removeEventListener('keydown', this.keydownEventListener)
  }
}

export default UserInput
