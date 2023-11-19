type IComponent = Record<string, any>

class Entity {
  id: symbol
  components: Map<string, IComponent>

  constructor() {
    this.id = Symbol()
    this.components = new Map()
  }

  addComponent(component: IComponent) {
    this.components.set(component.name, { ...component, entity: this })
  }

  removeComponent(component: string) {
    this.components.delete(component)
  }
}

export default Entity
