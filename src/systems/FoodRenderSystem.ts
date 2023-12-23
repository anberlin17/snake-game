import ECS from '../ECS'
import Components from '../components'
import System from '../modules/System'
import { SnakeBodyComponent } from '../components/SnakeBody'
import Game from '../main'
import { GridPosition } from '../types/movement'

export default class FoodRenderSystem extends System {
  createFoodEntity(game: Game) {
    const snake = ECS.queryEntity(['SnakeBody'])
    if (!snake) return

    const food = ECS.createEntity()
    food.addComponent(Components.Food())
    food.addComponent(Components.Position())

    const position = food.getComponent<GridPosition>('Position')!
    const snakeBody = snake.getComponent<SnakeBodyComponent>('SnakeBody')

    let cell = { col: 0, row: 0 }
    do {
      cell = game.GameBoard.getRandomCell()
    } while (snakeBody.blocks.some(({ col, row }) => col === cell.col && row === cell.row))

    position.row = cell.row
    position.col = cell.col

    return food
  }

  main(game: Game) {
    const entity = ECS.queryEntity(['Food']) || this.createFoodEntity(game)
    if (!entity) return

    const ctx = game.ctx

    const position = entity.getComponent<GridPosition>('Position')!
    const cellSize = game.GameBoard.getCellSize()
    const cellPosition = game.GameBoard.getCellPosition(position.col, position.row)

    const x = cellPosition.x
    const y = cellPosition.y - ((Math.cos(game.timestamp / 150) + 1) / 2) * cellSize * 0.15
    const radius = cellSize / 2
    const gradient = ctx.createRadialGradient(x + radius, y + radius, 0, x + radius, y + radius, radius)

    gradient.addColorStop(0, 'hsl(0 100% 100% / 0.75)')
    gradient.addColorStop(1, 'hsl(8 100% 66% / 1)')

    ctx.fillStyle = gradient
    ctx.beginPath()
    ctx.arc(x + radius, y + radius, radius * 0.85, 0, Math.PI * 2)
    ctx.shadowColor = 'rgba(0,0,0,0.75)'
    ctx.shadowOffsetX = 1
    ctx.shadowOffsetY = 3
    ctx.fill()
    ctx.shadowColor = 'rgba(0,0,0,0)'
    ctx.shadowOffsetX = 0
    ctx.shadowOffsetY = 0
    ctx.strokeStyle = 'rgba(0,0,0,0.25)'
    ctx.lineWidth = 1
    ctx.stroke()
    ctx.closePath()
  }
}
