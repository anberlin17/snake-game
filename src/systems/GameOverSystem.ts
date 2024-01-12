import ECS from '../ECS'
import System from '../modules/System'
import Game from '../main'
import ScorePanel from '../ui/ScorePanel'

export default class GameOverSystem extends System {
  main(game: Game) {
    const entitiesWithVelocity = ECS.queryEntities(['Velocity'])
    for (const entity of entitiesWithVelocity) {
      entity.removeComponent('Velocity')
    }

    cancelAnimationFrame(game.requestId)

    const scorePanel = game.UI.get('scorePanel') as ScorePanel
    if (game.score > game.highScore) {
      scorePanel.updateHighScore(game.score)
    }

    game.ctx.fillStyle = 'rgba(0,0,0,0.75)'
    game.ctx.fillRect(0, 0, game.ctx.canvas.width, game.ctx.canvas.height)

    game.ctx.strokeStyle = '#000'
    game.ctx.fillStyle = '#de301e'
    game.ctx.font = '144px sans-serif'
    game.ctx.textAlign = 'center'
    game.ctx.textBaseline = 'middle'
    game.ctx.fillText('WASTED', game.ctx.canvas.width / 2, game.ctx.canvas.height / 2)
    game.ctx.strokeText('WASTED', game.ctx.canvas.width / 2, game.ctx.canvas.height / 2)

    setTimeout(() => {
      game.reset()
      game.start()
    }, 1500)
  }
}
