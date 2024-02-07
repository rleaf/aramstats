import Experience from "../Experience"
import Environment from './Environment'
import Map from './Map'

export default class World {
   constructor() {
      
      this.experience = new Experience()
      this.time = this.experience.time
      this.scene = this.experience.scene
      this.environment = new Environment()
      this.map = new Map()
   }

   update() {
      if (this.map.loaded) this.map.update()
   }
}