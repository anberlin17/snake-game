import Game from '../main'
import UIElement from './UIElement'

export default class ScorePanel extends UIElement {
  score: number
  highScore: number

  constructor(ctx: CanvasRenderingContext2D) {
    super(ctx)

    this.score = 0
    this.highScore = 0
  }

  updateScore(value: number) {
    this.score = value

    const gameScoreElement = document.getElementById('gameScore')
    if (gameScoreElement) {
      gameScoreElement.textContent = value.toString()
    }
  }

  updateHighScore(value: number) {
    this.highScore = value

    const highestScoreElement = document.getElementById('highGameScore')
    if (highestScoreElement) {
      highestScoreElement.textContent = value.toString()
    }

    localStorage.setItem('highScore', value.toString())
  }

  removeGamePopup() {
    const gameOverPopup = document.getElementById('gameOverPopup')
    if (gameOverPopup) {
      gameOverPopup.classList.remove('active')
    }
  }

  showGamePopup() {
    this.ctx.fillStyle = 'rgba(0,0,0,0.75)'
    this.ctx.fillRect(0, 0, this.ctx.canvas.width, this.ctx.canvas.height)
  }

  render(_: Game) {
    const ctx = this.ctx
    const fontSize = this.width / 20

    ctx.lineWidth = 5
    ctx.strokeStyle = 'salmon'
    ctx.shadowColor = 'rgba(0,0,0,0.75)'
    ctx.shadowOffsetY = 3
    ctx.shadowOffsetX = 2
    ctx.fillStyle = 'hsl(0 50% 0%)'
    ctx.font = `${fontSize}px Play, sans-serif`
    ctx.textAlign = 'left'
    ctx.textBaseline = 'middle'

    {
      const textMetrics = ctx.measureText('SCORE: ')
      ctx.strokeText('SCORE: ', this.x, this.y)
      ctx.strokeText(this.score.toString(), this.x + textMetrics.width, this.y)
    }

    {
      ctx.textAlign = 'right'
      const textMetrics = ctx.measureText(this.highScore.toString())
      ctx.strokeText('HIGH SCORE: ', this.x + this.width - textMetrics.width, this.y)
      ctx.strokeText(this.highScore.toString(), this.x + this.width, this.y)
    }

    ctx.shadowOffsetY = 0
    ctx.shadowOffsetX = 0
  }
}
