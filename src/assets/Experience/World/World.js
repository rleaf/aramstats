import * as THREE from 'three'
import Experience from "../Experience"
import Environment from './Environment'
import Box from './Box'
import Plane from './Plane'
import Map from './Map'

export default class World {
   constructor() {
      
      this.experience = new Experience()
      this.time = this.experience.time
      this.scene = this.experience.scene
      this.environment = new Environment()
      // this.box = new Box()
      // this.plane = new Plane()
      this.map = new Map()
      // this.scene.background = new THREE.Color(0x0d111c)
   }

   update() {
      // this.box.update()
      // this.plane.update()
      // console.log(this.experience.camera.instance.position)
      this.map.update()
   }
}