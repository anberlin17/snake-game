type IComponent = Record<string, any>

export default class Entity {
  id: symbol
  components: Map<string, IComponent>

  constructor() {
    this.id = Symbol()
    this.components = new Map()
  }

  addComponent(component: IComponent) {
    this.components.set(component.name, { ...component, entity: this })
  }

  getComponent<T>(component: string): T {
    return this.components.get(component) as T
  }

  hasComponent(component: string) {
    return this.components.has(component)
  }

  removeComponent(component: string) {
    this.components.delete(component)
  }
}
