import type Game from '../main'

export default class System {
  tickInterval: number | undefined
  prevTimestamp: number

  constructor({ tickInterval }: { tickInterval?: number } = {}) {
    this.tickInterval = tickInterval
    this.prevTimestamp = 0
  }

  isCurrentTick(timestamp: number): boolean {
    if (this.tickInterval === undefined) {
      return true
    }

    return timestamp - this.prevTimestamp >= this.tickInterval
  }

  update(game: Game): void {
    if (!this.isCurrentTick(game.timestamp)) {
      return
    }

    this.prevTimestamp = game.timestamp

    this.main(game)
  }

  main(_: Game): void {
    throw new Error('main method is not implemented')
  }
}
