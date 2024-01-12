import ECS from './ECS'
import Systems from './systems'
import Components from './components'
import UIBuilder from './modules/UIBuilder'
import GameBoard from './modules/GameBoard'
import ScorePanel from './ui/ScorePanel'
import { GAME_FPS } from './const'
import { setupCanvasSize } from './utils'

import './style.scss'

export default class Game {
  ctx: CanvasRenderingContext2D
  timestamp: number
  requestId: number
  score: number
  highScore: number
  interval: number
  prevTimestamp: number

  UI: UIBuilder
  GameBoard: GameBoard

  constructor() {
    this.interval = 1000 / GAME_FPS
    this.prevTimestamp = 0

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

    this.ctx = canvas.getContext('2d', { alpha: true })!

    setupCanvasSize(this.ctx)

    this.GameBoard = new GameBoard(this, {
      height: this.ctx.canvas.height * 0.85
    })
    this.GameBoard.setPoint('CENTER')

    this.UI = new UIBuilder(this)

    this.updateScore(0)
    this.updateHighScore(Number(localStorage.getItem('highScore')) ?? 0)

    this.loop = this.loop.bind(this)
  }

  start() {
    const snake = ECS.createEntity()

    {
      const col = Math.floor(this.GameBoard.cols / 2)
      const row = Math.floor(this.GameBoard.rows / 2)
      snake.addComponent(
        Components.SnakeBody([
          { col, row },
          { col, row: row + 1 },
          { col, row: row + 2 }
        ])
      )
    }
    snake.addComponent(Components.Velocity())
    snake.addComponent(Components.Controlled())

    ECS.schedule.add(new Systems.UserInputSystem({ tickInterval: 1000 / 15 }))
    ECS.schedule.add(new Systems.SnakeMovementSystem({ tickInterval: 1000 / 15 }))
    ECS.schedule.add(new Systems.CollisionDetectionSystem())
    ECS.schedule.add(new Systems.FoodRenderSystem())
    ECS.schedule.add(new Systems.SnakeRenderSystem())

    this.loop()
  }

  loop(timestamp = 0) {
    this.timestamp = timestamp
    this.requestId = requestAnimationFrame(this.loop)

    if (!this.isCurrentTick(this.interval, this.prevTimestamp)) return
    this.prevTimestamp = timestamp

    this.ctx.clearRect(0, 0, this.ctx.canvas.width, this.ctx.canvas.height)

    this.GameBoard.render(this)
    this.UI.render(this)

    for (const system of ECS.schedule) {
      system.update(this)
    }
  }

  reset() {
    ECS.entities.clear()
    ECS.schedule.clear()

    this.updateScore(0)
  }

  isCurrentTick(interval: number, prevTimestamp: number): boolean {
    return game.timestamp - prevTimestamp >= interval
  }

  updateScore(value: number) {
    const scorePanel = this.UI.get('scorePanel') as ScorePanel

    this.score = value
    scorePanel.updateScore(value)
  }

  updateHighScore(value: number) {
    const scorePanel = this.UI.get('scorePanel') as ScorePanel

    this.highScore = value
    scorePanel.updateHighScore(value)
    localStorage.setItem('highScore', value.toString())
  }
}

const game = new Game()
game.start()
