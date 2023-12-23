import ECS from '../ECS'
import System from '../modules/System'
import { SnakeBodyComponent } from '../components/SnakeBody'
import components from '../components'
import Game from '../main'
import { GridPosition } from '../types/movement'
import GameOverSystem from './GameOverSystem'

export default class CollisionDetectionSystem extends System {
  main(game: Game) {
    const food = ECS.queryEntity(['Food'])
    const snake = ECS.queryEntity(['SnakeBody'])
    if (!food || !snake) return

    const snakeBody = snake.getComponent<SnakeBodyComponent>('SnakeBody')
    const foodPosition = food.getComponent<GridPosition>('Position')!

    const head = snakeBody.blocks[0]
    if (head.col === foodPosition.col && head.row === foodPosition.row) {
      ECS.removeEntity(food)
      snake.addComponent(components.SnakeGrowUp())
      game.updateScore(game.score + 1)
    }

    // Detect collision with the body
    const body = snakeBody.blocks.slice(1)
    for (const block of body) {
      if (head.col === block.col && head.row === block.row) {
        ECS.schedule.add(new GameOverSystem())
      }
    }

    // Detect collision with the wall
    if (head.col < 0 || head.col >= game.GameBoard.cols || head.row < 0 || head.row >= game.GameBoard.rows) {
      ECS.schedule.add(new GameOverSystem())
    }
  }
}
