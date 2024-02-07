import * as THREE from 'three'
import Experience from "./Experience";
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js'


export default class Camera {
   constructor() {

      this.experience = new Experience()
      this.pointer = this.experience.mouse.pointer
      this.sizes = this.experience.sizes
      this.scene = this.experience.scene
      this.canvas = this.experience.canvas
      this.wobble = true

      this.setInstance()
      // this.setControls()

   }

   setInstance() {
      this.instance = new THREE.PerspectiveCamera(50, this.sizes.width / this.sizes.height, 0.1, 20000)
      // this.instance.position.set(4, 6, 8)
      this.instance.position.set(406, 636, 88)
      this.instance.lookAt(32, 315, 29)
      

      this.scene.add(this.instance)
   }

   setControls() {
      this.controls = new OrbitControls(this.instance, this.canvas)
      this.controls.enableDamping = true
      this.controls.enabled = true
   }

   resize() {
      this.instance.aspect = this.sizes.width / this.sizes.height
      this.instance.updateProjectionMatrix()
   }

   update() {
      // this.controls.update()
      if (this.wobble) {
         this.instance.position.x = 406 + -(this.pointer.y * 30)
         // this.instance.position.z = 88 + -(this.pointer.x * 10)
      }
      this.instance.lookAt(50, 340, 24)
   }
}