import { GridPosition } from '../types/movement'

function Position(value: GridPosition = { row: 0, col: 0 }) {
  return {
    name: 'Position',
    row: value.row,
    col: value.col
  }
}

export default Position
