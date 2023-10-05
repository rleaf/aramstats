import * as THREE from 'three'
import Experience from "../Experience"

export default class Box {
   constructor() {

      this.experience = new Experience()
      this.scene = this.experience.scene

      this.setGeometry()
      this.setMaterial()
      this.setMesh()
      this.update()
   }

   setGeometry() {
      this.geometry = new THREE.BoxGeometry(1, 1, 1)
   }

   setMaterial() {
      // this.material = new THREE.MeshBasicMaterial({ wireframe: true})
      this.material = new THREE.MeshStandardMaterial()
   }

   setMesh() {
      this.mesh = new THREE.Mesh(this.geometry, this.material)
      this.scene.add(this.mesh)
   }

   update() {
      this.mesh.rotation.y += 0.005
   }
}