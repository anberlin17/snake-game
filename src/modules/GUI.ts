export default class GUI {
  score: number
  highScore: number

  constructor() {
    this.score = 0
    this.highScore = 0
  }

  updateScore(value: number) {
    this.score = value
    const gameScoreElement = document.getElementById('gameScore')

    const score = this.score.toString()
    if (gameScoreElement.textContent !== score) {
      gameScoreElement.textContent = score
    }
  }

  updateHighScore(value: number) {
    this.highScore = value
    localStorage.setItem('highScore', this.highScore.toString())

    const highestScoreElement = document.getElementById('highGameScore')
    if (highestScoreElement) {
      highestScoreElement.textContent = this.highScore.toString()
    }
  }

  removeGamePopup() {
    const gameOverPopup = document.getElementById('gameOverPopup')
    if (gameOverPopup) {
      gameOverPopup.classList.remove('active')
    }
  }

  showGamePopup(cb?: () => void) {
    const gameOverPopup = document.getElementById('gameOverPopup')
    if (gameOverPopup) {
      gameOverPopup.classList.add('active')

      const startGameButton = document.getElementById('startGameButton')
      startGameButton.addEventListener('click', cb)
    }
  }
}
