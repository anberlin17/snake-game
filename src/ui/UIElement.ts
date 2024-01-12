import Game from '../main'

export enum Alignment {
  BOTTOM_CENTER,
  BOTTOM_LEFT,
  BOTTOM_RIGHT,
  CENTER,
  LEFT_BOTTOM,
  LEFT_CENTER,
  LEFT_TOP,
  RIGHT_BOTTOM,
  RIGHT_CENTER,
  RIGHT_TOP,
  TOP_CENTER,
  TOP_LEFT,
  TOP_RIGHT
}

export type AlignmentType = keyof typeof Alignment

export default class UIElement {
  ctx: CanvasRenderingContext2D
  x: number
  y: number
  width: number
  height: number

  constructor(ctx: CanvasRenderingContext2D) {
    this.ctx = ctx
    this.x = 0
    this.y = 0
    this.width = 0
    this.height = 0
  }

  setPoint(position: AlignmentType) {
    switch (position) {
      case 'BOTTOM_CENTER':
        this.x = (this.ctx.canvas.width - this.width) / 2
        this.y = this.ctx.canvas.height - this.height
        break
      case 'BOTTOM_LEFT':
        this.x = 0
        this.y = this.ctx.canvas.height - this.height
        break
      case 'BOTTOM_RIGHT':
        this.x = this.ctx.canvas.width - this.width
        this.y = this.ctx.canvas.height - this.height
        break
      case 'CENTER':
        this.x = (this.ctx.canvas.width - this.width) / 2
        this.y = (this.ctx.canvas.height - this.height) / 2
        break
      case 'LEFT_BOTTOM':
        this.x = 0
        this.y = this.ctx.canvas.height - this.height
        break
      case 'LEFT_CENTER':
        this.x = 0
        this.y = (this.ctx.canvas.height - this.height) / 2
        break
      case 'LEFT_TOP':
        this.x = 0
        this.y = 0
        break
      case 'RIGHT_BOTTOM':
        this.x = this.ctx.canvas.width - this.width
        this.y = this.ctx.canvas.height - this.height
        break
      case 'RIGHT_CENTER':
        this.x = this.ctx.canvas.width - this.width
        this.y = (this.ctx.canvas.height - this.height) / 2
        break
      case 'RIGHT_TOP':
        this.x = this.ctx.canvas.width - this.width
        this.y = 0
        break
      case 'TOP_CENTER':
        this.x = (this.ctx.canvas.width - this.width) / 2
        this.y = 0
        break
      case 'TOP_LEFT':
        this.x = 0
        this.y = 0
        break
      case 'TOP_RIGHT':
        this.x = this.ctx.canvas.width - this.width
        this.y = 0
        break
    }
  }

  setPosition(x: number, y: number) {
    this.x = x
    this.y = y
  }

  setSize(width: number, height: number) {
    this.width = width
    this.height = height
  }

  getBounds() {
    return {
      x: this.x,
      y: this.y,
      width: this.width,
      height: this.height
    }
  }

  render(_: Game) {}
}
