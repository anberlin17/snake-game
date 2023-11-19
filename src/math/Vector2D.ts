export interface IVector2D {
  x: number
  y: number
}

class Vector2D implements IVector2D {
  x: number
  y: number

  constructor({ x, y }: IVector2D) {
    this.x = x
    this.y = y
  }
}

export default Vector2D
