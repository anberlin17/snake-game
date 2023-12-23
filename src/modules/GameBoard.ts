import Game from '../main'
import UIElement from '../ui/UIElement'

interface ISize {
  width: number
  height: number
}

export default class GameBoard extends UIElement {
  rows: number
  cols: number
  x: number
  y: number

  offscreenCanvasCtx: CanvasRenderingContext2D
  borderStripeWidth: number
  rectBorderSize: number
  rectSize: number

  constructor(game: Game, bounds: Optional<ISize, 'width'> | Optional<ISize, 'height'>) {
    super(game.ctx)

    this.x = 0
    this.y = 0

    this.cols = 21
    this.rows = Math.round(this.cols * 1.2)

    if (typeof bounds.height === 'number') {
      this.height = bounds.height
      this.width = this.getCellSize() * this.cols
    } else if (typeof bounds.width === 'number') {
      this.width = bounds.width
      this.height = this.getCellSize() * this.rows
    }

    this.borderStripeWidth = Math.min(this.width, this.height) * 0.035
    this.rectBorderSize = this.getCellSize()
    this.rectSize = this.rectBorderSize * 0.75

    const offscreenCanvas = document.createElement('canvas')
    offscreenCanvas.width = game.ctx.canvas.width
    offscreenCanvas.height = game.ctx.canvas.height
    this.offscreenCanvasCtx = offscreenCanvas.getContext('2d')!

    this.drawBackgroundGradient()
    this.drawBackgroundGrid()
  }

  getCellSize() {
    if (this.width > 0) {
      return this.width / this.cols
    } else if (this.height > 0) {
      return this.height / this.rows
    }
    return 0
  }

  getCellPosition(col: number, row: number, offset = 0) {
    const cellSize = this.getCellSize()
    return {
      x: col * cellSize + this.x + offset,
      y: row * cellSize + this.y + offset
    }
  }

  getRandomCell() {
    return {
      row: Math.round(Math.random() * (this.rows - 1)),
      col: Math.round(Math.random() * (this.cols - 1))
    }
  }

  drawBackgroundGradient() {
    const ctx = this.offscreenCanvasCtx
    const backgroundGradient = ctx.createLinearGradient(this.width / 2, this.y, this.width / 2, this.y + this.height)
    backgroundGradient.addColorStop(0, '#3c7272')
    backgroundGradient.addColorStop(1, '#aee7e6')
    ctx.fillStyle = backgroundGradient
    ctx.fillRect(this.x, this.y, this.width, this.height)
  }

  drawBackgroundGrid() {
    const ctx = this.offscreenCanvasCtx
    ctx.fillStyle = 'rgba(11, 11, 11, 0.05)'
    ctx.strokeStyle = 'rgba(11, 11, 11, 0.05)'
    ctx.lineWidth = 1

    for (let i = 0; i < this.cols; i++) {
      const x = this.rectBorderSize * i + this.x

      for (let j = 0; j < this.rows; j++) {
        const y = this.rectBorderSize * j + this.y

        const rectOffset = (this.rectBorderSize - this.rectSize) / 2

        ctx.fillRect(x + rectOffset, y + rectOffset, this.rectSize, this.rectSize)
        ctx.strokeRect(x, y, this.rectBorderSize, this.rectBorderSize)
      }
    }
  }

  render(game: Game) {
    const ctx = this.ctx

    ctx.drawImage(this.offscreenCanvasCtx.canvas, this.x, this.y)

    // Border
    {
      ctx.lineWidth = this.borderStripeWidth
      ctx.strokeStyle = 'white'

      const path = new Path2D()
      path.moveTo(this.x - this.borderStripeWidth, this.y - this.borderStripeWidth)
      path.lineTo(this.x + this.width + this.borderStripeWidth, this.y - this.borderStripeWidth)
      path.lineTo(this.x + this.width, this.y)
      path.lineTo(this.x, this.y)
      path.closePath()
      path.moveTo(this.x - this.borderStripeWidth, this.y - this.borderStripeWidth)
      path.lineTo(this.x, this.y)
      path.lineTo(this.x, this.y + this.height)
      path.lineTo(this.x - this.borderStripeWidth, this.y + this.height + this.borderStripeWidth)
      path.closePath()
      path.moveTo(this.x + this.width, this.y)
      path.lineTo(this.x + this.width, this.y + this.height)
      path.lineTo(this.x + this.width + this.borderStripeWidth, this.y + this.height + this.borderStripeWidth)
      path.lineTo(this.x + this.width + this.borderStripeWidth, this.y - this.borderStripeWidth)
      path.closePath()
      path.moveTo(this.x, this.y + this.height)
      path.lineTo(this.x + this.width, this.y + this.height)
      path.lineTo(this.x + this.width + this.borderStripeWidth, this.y + this.height + this.borderStripeWidth)
      path.lineTo(this.x - this.borderStripeWidth, this.y + this.height + this.borderStripeWidth)
      path.closePath()

      ctx.save()
      ctx.beginPath()
      ctx.strokeRect(
        this.x - this.borderStripeWidth / 2,
        this.y - this.borderStripeWidth / 2,
        this.width + this.borderStripeWidth,
        this.height + this.borderStripeWidth
      )
      ctx.clip(path)

      // Border stripes
      {
        const lines = 90
        const y1 = this.y - this.borderStripeWidth * 2
        const y2 = this.y + this.height + this.borderStripeWidth * 2
        const hStep = ((this.width + this.borderStripeWidth * 2) * 2) / lines
        const offset = (game.timestamp / 50) % hStep

        ctx.strokeStyle = '#e98a7e'
        ctx.lineWidth = this.width / lines / (this.height / this.width)
        for (let i = 0; i < lines; i++) {
          const step = hStep * i - this.borderStripeWidth + offset
          ctx.moveTo(this.x + step, y1)
          ctx.lineTo(this.x + step - this.width, y2)
        }
        ctx.stroke()
      }

      ctx.closePath()
      ctx.restore()
    }

    // Border outline
    {
      ctx.lineWidth = 2
      ctx.strokeStyle = 'rgba(0, 0, 0, 1)'
      ctx.strokeRect(
        this.x - this.borderStripeWidth,
        this.y - this.borderStripeWidth,
        this.width + this.borderStripeWidth * 2,
        this.height + this.borderStripeWidth * 2
      )
      ctx.strokeRect(this.x, this.y, this.width, this.height)
      ctx.shadowColor = 'rgba(0, 0, 0, 0)'
      ctx.shadowOffsetY = 0
    }

    // Border glow
    {
      ctx.strokeStyle = 'rgba(255, 255, 255,0.75)'
      ctx.filter = 'blur(4px)'
      ctx.lineWidth = 7
      ctx.strokeRect(
        this.x - this.borderStripeWidth / 2,
        this.y - this.borderStripeWidth / 2,
        this.width + this.borderStripeWidth,
        this.height + this.borderStripeWidth
      )
      ctx.filter = 'none'
    }
  }
}
