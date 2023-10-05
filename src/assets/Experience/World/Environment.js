import Experience from '../Experience'

export default class Environment {
   constructor() {
      
      this.experience = new Experience()
      this.scene = this.experience.scene
   }
}