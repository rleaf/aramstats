import * as THREE from 'three'
import { GLTFLoader } from 'three/addons/loaders/GLTFLoader.js'
import Experience from '../Experience'


export default class Map {
   constructor() {

      this.experience = new Experience()
      this.scene = this.experience.scene
      this.loader = new GLTFLoader()
      this.loaded = false
      this.init()
   }
   
   async init() {
      this.obj = await this.loader.loadAsync('src/assets/Experience/model/howling2.glb')
      this.loaded = true
      this.setGeometry()
      this.setMaterial()
      this.setMesh()
   }
   
   setGeometry() {
      const vertices = []
      this.obj.scene.traverse((child) => {
         if(child.isMesh) {
            vertices.push(...child.geometry.attributes.position.array)
         } 
      })
      this.geometry = new THREE.BufferGeometry()
      this.geometry.setAttribute('position', new THREE.Float32BufferAttribute(vertices, 3))
   }

   setMaterial() {
      this.material = new THREE.PointsMaterial({
         color: 0xFFFFFF,
         size: 0.001,
         transparent: true,
         blending: THREE.AdditiveBlending,
         depthWrite: false
      })
   }

   setMesh() {
      this.mesh = new THREE.Points(this.geometry, this.material)
      this.scene.add(this.mesh)
   }

   update() {
      this.mesh.rotation.y += 0.0005
   }
}