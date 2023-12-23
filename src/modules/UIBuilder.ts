import UIElement from '../ui/UIElement'
import ScorePanel from '../ui/ScorePanel'
import Game from '../main'

export default class UIBuilder {
  ctx: CanvasRenderingContext2D

  #children: Map<string, UIElement>

  constructor(game: Game) {
    this.ctx = game.ctx
    this.#children = new Map<string, UIElement>()

    const scorePanel = new ScorePanel(this.ctx)
    scorePanel.setSize(game.GameBoard.width, game.GameBoard.height)
    scorePanel.setPosition(game.GameBoard.x, this.ctx.canvas.height * 0.023)
    this.#children.set('scorePanel', scorePanel)
  }

  get(name: string) {
    return this.#children.get(name)
  }

  has(name: string) {
    return this.#children.has(name)
  }

  render(game: Game) {
    for (const child of this.#children.values()) {
      child.render(game)
    }
  }
}
