import ECS from './ECS'
import Systems from './systems'
import Components from './components'
import GUI from './modules/GUI'

import './style.scss'

export default class Game {
  ctx: CanvasRenderingContext2D

  GUI: GUI

  #requestId: number
  #fps: number
  #tickInterval: number
  #prevTimestamp: number

  paused: boolean
  fieldSize: number
  score: number
  highScore: number

  constructor({ fps = 15, size = 21 } = {}) {
    this.#fps = fps
    this.#tickInterval = 1000 / this.#fps
    this.#prevTimestamp = 0

    this.GUI = new GUI()

    this.paused = true
    this.fieldSize = size
    this.score = 0
    this.start = this.start.bind(this)

    this.updateHighScore(Number(localStorage.getItem('highScore')) ?? 0)

    let canvas = document.getElementById('canvas') as HTMLCanvasElement
    if (!canvas) {
      canvas = document.createElement('canvas')

      let root = document.getElementById('app')
      if (!root) {
        root = document.createElement('div')
        root.id = 'app'
        document.body.appendChild(root)
      }

      root.appendChild(canvas)
    }

    this.ctx = canvas.getContext('2d')

    addEventListener('resize', () => {
      this.ctx.canvas.height = canvas.clientHeight * devicePixelRatio
      this.ctx.canvas.width = canvas.clientWidth * devicePixelRatio
    })

    dispatchEvent(new Event('resize'))
  }

  create() {
    const snake = ECS.createEntity()

    const middle = Math.floor(this.fieldSize / 2)
    snake.addComponent(
      Components.SnakeBody([
        { x: middle, y: middle },
        { x: middle, y: middle + 1 },
        { x: middle, y: middle + 2 }
      ])
    )
    snake.addComponent(Components.Velocity())

    ECS.schedule.add(new Systems.UserInput())
    ECS.schedule.add(new Systems.SnakeMovement())
    ECS.schedule.add(new Systems.CollisionDetection())
    ECS.schedule.add(new Systems.SpawnMap())
    ECS.schedule.add(new Systems.SpawnFood())
    ECS.schedule.add(new Systems.SpawnSnake())

    this.paused = false
    this.start()
  }

  start(timestamp = 0) {
    this.#requestId = requestAnimationFrame(this.start)

    const elapsed = timestamp - this.#prevTimestamp
    if (elapsed < this.#tickInterval) {
      return
    }

    this.ctx.clearRect(0, 0, this.ctx.canvas.width, this.ctx.canvas.height)

    for (const system of ECS.schedule) {
      system.update(this)
    }

    this.#prevTimestamp = timestamp
  }

  stop() {
    if (this.score > this.highScore) {
      this.GUI.updateHighScore(this.score)
    }

    this.pause()
    this.GUI.showGamePopup(() => {
      this.GUI.removeGamePopup()
      this.reset()
      this.create()
    })
  }

  pause() {
    this.paused = true
    cancelAnimationFrame(this.#requestId)
  }

  reset() {
    this.pause()

    ECS.entities.clear()
    ECS.schedule.clear()

    this.updateScore(0)
  }

  updateScore(value: number) {
    this.score = value
    this.GUI.updateScore(value)
  }

  updateHighScore(value: number) {
    this.highScore = value
    this.GUI.updateHighScore(value)
  }

  getCellSize() {
    return this.ctx.canvas.width / this.fieldSize
  }

  getCoordOfCell(x: number, y: number) {
    const cellSize = this.getCellSize()
    return {
      x: x * cellSize,
      y: y * cellSize
    }
  }

  getRandomCell() {
    return Math.round(Math.random() * (this.fieldSize - 1))
  }

  getRandomPosition() {
    return {
      x: this.getRandomCell(),
      y: this.getRandomCell()
    }
  }
}

const game = new Game({
  fps: 15,
  size: 21
})
game.create()
