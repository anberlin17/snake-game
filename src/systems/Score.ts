import Game from '../main'
import System from '../modules/System'

class Score extends System {
  gameScoreElement: HTMLElement

  constructor() {
    super()

    this.gameScoreElement = document.getElementById('gameScore')
  }

  update(game: Game) {
    const score = game.score.toString()
    if (this.gameScoreElement.textContent !== score) {
      this.gameScoreElement.textContent = score
    }
  }
}

export default Score
