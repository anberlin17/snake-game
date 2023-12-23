import ECS from '../ECS'
import System from '../modules/System'
import { SnakeBodyComponent } from '../components/SnakeBody'
import Game from '../main'
import { SNAKE_BODY_BLOCK_MAJOR_RADIUS, SNAKE_BODY_BLOCK_MINOR_RADIUS } from '../const'
import { GridPosition } from '../types/movement'

interface Position {
  col: number
  row: number
}

export default class SnakeRenderSystem extends System {
  private getBlockPosition(current: Position, next: Position) {
    const { col, row } = current

    if (col > next.col) {
      return 'left'
    }

    if (col < next.col) {
      return 'right'
    }

    if (row > next.row) {
      return 'up'
    }

    if (row < next.row) {
      return 'down'
    }

    return
  }

  private processBlock(
    block: Position,
    idx: number,
    arr: GridPosition[],
    game: Game,
    snake: Path2D,
    snakeCellSize: number,
    cellOffset: number,
    isReverse: boolean
  ) {
    const { col, row } = block
    const { x: x1, y: y1 } = game.GameBoard.getCellPosition(col, row, cellOffset)

    const nextBlock = isReverse ? arr[Math.max(idx - 1, 0)] : arr[Math.min(idx + 1, arr.length - 1)]
    const prevBlock = isReverse ? arr[Math.min(idx + 1, arr.length - 1)] : arr[Math.max(idx - 1, 0)]

    const prevBlockPosition = this.getBlockPosition(block, prevBlock)
    const nextBlockPosition = this.getBlockPosition(block, nextBlock)

    const isLast = isReverse ? idx === 0 : idx === arr.length - 1
    const isFirst = isReverse ? idx === arr.length - 1 : idx === 0

    if (isFirst) {
      switch (nextBlockPosition) {
        case 'right':
          snake.moveTo(x1, y1 + snakeCellSize)
          snake.lineTo(x1 + snakeCellSize, y1 + snakeCellSize)
          break
        case 'down':
          snake.moveTo(x1, y1)
          snake.lineTo(x1, y1 + snakeCellSize)
          break
        case 'up':
          snake.moveTo(x1 + snakeCellSize, y1 + snakeCellSize)
          snake.lineTo(x1 + snakeCellSize, y1)
          break
        case 'left':
          snake.moveTo(x1 + snakeCellSize, y1)
          snake.lineTo(x1, y1)
          break
      }

      return
    }

    if (isLast) {
      switch (prevBlockPosition) {
        case 'right':
          snake.lineTo(x1, y1)
          snake.lineTo(x1, y1 + snakeCellSize)
          break
        case 'down':
          snake.lineTo(x1 + snakeCellSize, y1)
          snake.lineTo(x1, y1)
          break
        case 'up':
          snake.lineTo(x1, y1 + snakeCellSize)
          snake.lineTo(x1 + snakeCellSize, y1 + snakeCellSize)
          break
        case 'left':
          snake.lineTo(x1 + snakeCellSize, y1 + snakeCellSize)
          snake.lineTo(x1 + snakeCellSize, y1)
          break
      }
      return
    }

    switch (prevBlockPosition) {
      case 'right':
        switch (nextBlockPosition) {
          case 'down':
            snake.arcTo(x1, y1, x1, y1 + snakeCellSize, SNAKE_BODY_BLOCK_MAJOR_RADIUS)
            break
          case 'up':
            snake.arcTo(x1 + snakeCellSize, y1, x1 + snakeCellSize, y1 - snakeCellSize, SNAKE_BODY_BLOCK_MINOR_RADIUS)
            break
          case 'left':
            snake.lineTo(x1 + snakeCellSize / 2, y1)
            break
        }
        break
      case 'down':
        switch (nextBlockPosition) {
          case 'right':
            snake.arcTo(
              x1 + snakeCellSize,
              y1 + snakeCellSize,
              x1 + snakeCellSize * 2,
              y1 + snakeCellSize,
              SNAKE_BODY_BLOCK_MINOR_RADIUS
            )
            break
          case 'up':
            snake.lineTo(x1 + snakeCellSize, y1 + snakeCellSize / 2)
            break
          case 'left':
            snake.arcTo(x1 + snakeCellSize, y1, x1, y1, SNAKE_BODY_BLOCK_MAJOR_RADIUS)
            break
        }
        break
      case 'up':
        switch (nextBlockPosition) {
          case 'right':
            snake.arcTo(x1, y1 + snakeCellSize, x1 + snakeCellSize, y1 + snakeCellSize, SNAKE_BODY_BLOCK_MAJOR_RADIUS)
            break
          case 'down':
            snake.lineTo(x1, y1 + snakeCellSize / 2)
            break
          case 'left':
            snake.arcTo(x1, y1, x1 - snakeCellSize, y1, SNAKE_BODY_BLOCK_MINOR_RADIUS)
            break
        }
        break
      case 'left':
        switch (nextBlockPosition) {
          case 'right':
            snake.lineTo(x1 + snakeCellSize / 2, y1 + snakeCellSize)
            break
          case 'down':
            snake.arcTo(x1, y1 + snakeCellSize, x1, y1 + snakeCellSize * 2, SNAKE_BODY_BLOCK_MINOR_RADIUS)
            break
          case 'up':
            snake.arcTo(x1 + snakeCellSize, y1 + snakeCellSize, x1 + snakeCellSize, y1, SNAKE_BODY_BLOCK_MAJOR_RADIUS)
            break
        }
        break
    }
  }

  main(game: Game) {
    const entity = ECS.queryEntity(['SnakeBody'])
    if (!entity) return

    const ctx = game.ctx

    const cellSize = game.GameBoard.getCellSize()
    const snakeCellSize = cellSize * 0.85
    const cellOffset = (cellSize - snakeCellSize) / 2

    const snakeBody = entity.components.get('SnakeBody') as SnakeBodyComponent

    const gradient = ctx.createLinearGradient(
      game.GameBoard.width / 2,
      0,
      game.GameBoard.width / 2,
      game.GameBoard.height
    )
    gradient.addColorStop(0, 'pink')
    gradient.addColorStop(0.5, 'salmon')
    gradient.addColorStop(1, 'tomato')

    ctx.fillStyle = gradient
    ctx.lineWidth = 2
    ctx.shadowColor = 'rgba(0,0,0,0.75)'
    ctx.shadowOffsetX = 3
    ctx.shadowOffsetY = 5
    ctx.beginPath()

    const snake = new Path2D()
    snakeBody.blocks.reduce((_, block, idx, arr) => {
      this.processBlock(block, idx, arr, game, snake, snakeCellSize, cellOffset, false)
    }, null)

    snakeBody.blocks.reduceRight((_, block, idx, arr) => {
      this.processBlock(block, idx, arr, game, snake, snakeCellSize, cellOffset, true)
    }, null)

    ctx.fill(snake)
    ctx.shadowColor = 'rgba(0,0,0,0)'
    ctx.shadowOffsetX = 0
    ctx.shadowOffsetY = 0
    ctx.stroke(snake)
  }
}
