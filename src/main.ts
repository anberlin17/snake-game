import ECS from './ECS'
import Systems from './systems'
import Components from './components'
import { GAME_FIELD_SIZE, GAME_FPS } from './settings'

import './style.scss'

export default class Game {
  ctx: CanvasRenderingContext2D
  fieldSize: number
  requestId: number
  prevTimestamp: number
  score: number
  highestScore: number

  constructor() {
    this.prevTimestamp = 0
    this.score = 0
    this.start = this.start.bind(this)

    this.setHighestScore(Number(localStorage.getItem('highestScore')) ?? 0)

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
      const wh = Math.min(canvas.clientHeight, canvas.clientWidth)
      this.ctx.canvas.width = this.ctx.canvas.height = wh * devicePixelRatio
    })

    dispatchEvent(new Event('resize'))
  }

  create() {
    const snake = ECS.createEntity()

    const middle = Math.floor(GAME_FIELD_SIZE / 2)
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

    this.start()
  }

  start(timestamp = 0) {
    this.requestId = requestAnimationFrame(this.start)

    const elapsed = timestamp - this.prevTimestamp
    if (elapsed < 1000 / GAME_FPS) {
      return
    }

    this.ctx.clearRect(0, 0, this.ctx.canvas.width, this.ctx.canvas.height)

    for (const system of ECS.schedule) {
      system.update(this)
    }

    this.prevTimestamp = timestamp
  }

  stop() {
    if (this.score > this.highestScore) {
      this.setHighestScore(this.score)
    }

    this.pause()
    this.showGamePopup()
  }

  pause() {
    cancelAnimationFrame(this.requestId)
  }

  reset() {
    this.pause()

    ECS.entities.clear()
    ECS.schedule.clear()

    this.setScore(0)
  }

  removeGamePopup() {
    const gameOverPopup = document.getElementById('gameOverPopup')
    if (gameOverPopup) {
      gameOverPopup.classList.remove('active')
    }
  }

  showGamePopup() {
    const gameOverPopup = document.getElementById('gameOverPopup')
    if (gameOverPopup) {
      gameOverPopup.classList.add('active')

      const startGameButton = document.getElementById('startGameButton')
      startGameButton.addEventListener('click', () => {
        this.removeGamePopup()
        this.reset()
        this.create()
      })
    }
  }

  setScore(value: number) {
    this.score = value
    const gameScoreElement = document.getElementById('gameScore')

    const score = this.score.toString()
    if (gameScoreElement.textContent !== score) {
      gameScoreElement.textContent = score
    }
  }

  setHighestScore(value: number) {
    this.highestScore = value
    localStorage.setItem('highestScore', this.highestScore.toString())

    const highestScoreElement = document.getElementById('highestGameScore')
    if (highestScoreElement) {
      highestScoreElement.textContent = this.highestScore.toString()
    }
  }

  getCellSize() {
    return this.ctx.canvas.width / GAME_FIELD_SIZE
  }

  getCoordOfCell(x: number, y: number) {
    const cellSize = this.getCellSize()
    return {
      x: x * cellSize,
      y: y * cellSize
    }
  }

  getRandomCell() {
    return Math.round(Math.random() * (GAME_FIELD_SIZE - 1))
  }

  getRandomPosition() {
    return {
      x: this.getRandomCell(),
      y: this.getRandomCell()
    }
  }
}

const game = new Game()
game.create()
