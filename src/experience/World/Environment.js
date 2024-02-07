import Experience from '../Experience'
import * as THREE from 'three'

export default class Environment {
   constructor() {
      
      this.experience = new Experience()
      this.scene = this.experience.scene

      const light = new THREE.AmbientLight(0xffffff, 5.0)

      this.scene.add(light)
      this.scene.fog = new THREE.Fog(0x0d111c, 1, 1300)
   }
}