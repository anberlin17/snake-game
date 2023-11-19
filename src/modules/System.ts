import type Game from '../main'

abstract class System {
  abstract update(game: Game): void
}

export default System
