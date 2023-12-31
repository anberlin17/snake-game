import Entity from './modules/Entity'
import System from './modules/System'

class ECS {
  static Entity = Entity

  static schedule = new Set<System>()
  static entities = new Set<Entity>()

  static createEntity() {
    const entity = new Entity()
    ECS.entities.add(entity)
    return entity
  }

  static removeEntity(entity: Entity) {
    ECS.entities.delete(entity)
  }

  static queryEntity(query: string[]) {
    for (const entity of ECS.entities) {
      const hasAnyComponent = query.every(queriedComponent => entity.components.has(queriedComponent))
      if (hasAnyComponent) {
        return entity
      }
    }
  }

  static queryEntities(query: string[]) {
    const entities: Entity[] = []

    for (const entity of ECS.entities) {
      const hasAnyComponent = query.every(queriedComponent => entity.components.has(queriedComponent))
      if (hasAnyComponent) {
        entities.push(entity)
      }
    }

    return entities
  }
}

export default ECS
